import { useEffect, useRef, useState } from 'react';
import {
  SERVICE_ID,
  WRITE_ID,
  brightnessFrame,
  colorFrames,
  powerFrame,
  sceneFrames,
  soundFrames,
} from './protocol.js';

function releaseDevice(session) {
  const { device, onDisconnect } = session;
  session.device = null;
  session.characteristic = null;
  session.onDisconnect = null;
  session.colorValue = 1;
  if (device) {
    device.removeEventListener('gattserverdisconnected', onDisconnect);
    if (device.gatt.connected) device.gatt.disconnect();
  }
}

export default function useLedRemote() {
  const supported = Boolean(navigator.bluetooth);
  const [deviceName, setDeviceName] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(() => supported ? {
    key: 'ready',
    tone: 'normal',
  } : {
    key: 'unsupported',
    tone: 'error',
  });
  const sessionRef = useRef({
    active: true,
    busy: false,
    device: null,
    characteristic: null,
    onDisconnect: null,
    colorValue: 1,
  });

  useEffect(() => {
    const session = sessionRef.current;
    session.active = true;
    return () => {
      session.active = false;
      releaseDevice(session);
    };
  }, []);

  function report(statusKey, tone = 'normal') {
    setStatus({ key: statusKey, tone });
  }

  function updateBusy(session, value) {
    session.busy = value;
    if (session.active) setBusy(value);
  }

  async function toggleConnection() {
    const session = sessionRef.current;
    if (session.busy || !supported) return;
    if (session.characteristic) {
      releaseDevice(session);
      setDeviceName(null);
      report('disconnected');
      return;
    }

    updateBusy(session, true);
    report('chooseDevice');
    let selected;
    try {
      selected = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'GATT-' }, { namePrefix: 'MRSTAR' }, { namePrefix: 'MR Star' }],
        optionalServices: [SERVICE_ID],
      });
      if (!session.active) return;
      session.device = selected;
      session.onDisconnect = () => {
        releaseDevice(session);
        setDeviceName(null);
        report('connectionLost', 'error');
      };
      selected.addEventListener('gattserverdisconnected', session.onDisconnect);

      const server = await selected.gatt.connect();
      if (!session.active || session.device !== selected) {
        if (server.connected) server.disconnect();
        return;
      }
      const service = await server.getPrimaryService(SERVICE_ID);
      const characteristic = await service.getCharacteristic(WRITE_ID);
      if (!session.active || session.device !== selected) return;
      if (!server.connected) throw new Error('Bluetooth disconnected');
      if (!characteristic.properties.write && !characteristic.properties.writeWithoutResponse) {
        throw new Error('FFF3 does not support writing');
      }

      session.characteristic = characteristic;
      setDeviceName(selected.name ?? '');
      report('connected');
    } catch (error) {
      if (!session.active || (selected && session.device !== selected)) return;
      releaseDevice(session);
      if (!selected && error.name === 'NotFoundError') {
        report('noDevice');
      } else {
        report('connectionFailed', 'error');
        console.error(error);
      }
    } finally {
      updateBusy(session, false);
    }
  }

  async function send(frames, statusKey, colorValue) {
    const session = sessionRef.current;
    const target = session.characteristic;
    if (session.busy || !target) return;
    updateBusy(session, true);
    try {
      for (const [index, bytes] of frames.entries()) {
        if (index) await new Promise(resolve => setTimeout(resolve, 100));
        if (target !== session.characteristic) return;
        if (target.properties.writeWithoutResponse) await target.writeValueWithoutResponse(bytes);
        else await target.writeValueWithResponse(bytes);
      }
      if (target !== session.characteristic) return;
      if (colorValue !== undefined) session.colorValue = colorValue;
      report(statusKey);
    } catch (error) {
      if (target === session.characteristic) {
        report('commandFailed', 'error');
        console.error(error);
      }
    } finally {
      updateBusy(session, false);
    }
  }

  return {
    supported,
    connected: deviceName !== null,
    deviceName,
    busy,
    status,
    toggleConnection,
    applyPower(on) {
      const statusKey = on ? 'powerOnSent' : 'powerOffSent';
      return send([powerFrame(on)], statusKey);
    },
    applyColor(color, brightness) {
      const { frames, value } = colorFrames(color, brightness);
      return send(frames, 'colorSent', value);
    },
    applyBrightness(brightness) {
      const frame = brightnessFrame(brightness, sessionRef.current.colorValue);
      return send([frame], 'brightnessSent');
    },
    applyScene(scene, speed, direction) {
      return send(sceneFrames(scene, speed, direction), 'sceneSent', 1);
    },
    applySound(mode, sensitivity) {
      return send(soundFrames(mode, sensitivity), 'soundSent', 1);
    },
  };
}
