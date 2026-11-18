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
    message: 'Увімкни стрічку, закрий MR Star на телефоні й під’єднайся через Chrome.',
    tone: 'normal',
  } : {
    message: 'Відкрий пульт у Chrome або Edge через HTTPS чи localhost для доступу до Bluetooth.',
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

  function report(message, tone = 'normal') {
    setStatus({ message, tone });
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
      report('Стрічку від’єднано.');
      return;
    }

    updateBusy(session, true);
    report('Вибери свою стрічку у вікні браузера.');
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
        report('З’єднання втрачено. Під’єднай стрічку знову.', 'error');
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
      report('Стрічку під’єднано. Вибери колір або запусти сцену.');
    } catch (error) {
      if (!session.active || (selected && session.device !== selected)) return;
      releaseDevice(session);
      if (!selected && error.name === 'NotFoundError') {
        report('Стрічку не вибрано.');
      } else {
        report('Не вдалося під’єднатися. Перевір живлення стрічки й доступ браузера до Bluetooth. Закрий MR Star на телефоні.', 'error');
        console.error(error);
      }
    } finally {
      updateBusy(session, false);
    }
  }

  async function send(frames, message, colorValue) {
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
      report(message);
    } catch (error) {
      if (target === session.characteristic) {
        report('Не вдалося завершити команду. Спробуй ще раз або під’єднай стрічку знову.', 'error');
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
      const message = on ? 'Команду ввімкнення надіслано.' : 'Команду вимкнення надіслано.';
      return send([powerFrame(on)], message);
    },
    applyColor(color, brightness) {
      const { frames, value } = colorFrames(color, brightness);
      return send(frames, 'Команду кольору надіслано.', value);
    },
    applyBrightness(brightness) {
      const frame = brightnessFrame(brightness, sessionRef.current.colorValue);
      return send([frame], 'Команду яскравості надіслано.');
    },
    applyScene(scene, speed, direction) {
      return send(sceneFrames(scene, speed, direction), 'Команди сцени, швидкості й напрямку надіслано.', 1);
    },
    applySound(mode, sensitivity) {
      return send(soundFrames(mode, sensitivity), 'Команди звукового режиму надіслано.', 1);
    },
  };
}
