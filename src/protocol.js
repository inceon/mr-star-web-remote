// MR Star BLE protocol: https://github.com/witchbladeq/MR-Star-OpenRGB/blob/main/protocol.md
export const SERVICE_ID = '0000fff0-0000-1000-8000-00805f9b34fb';
export const WRITE_ID = '0000fff3-0000-1000-8000-00805f9b34fb';

const COMMAND = {
  power: 0x01,
  color: 0x04,
  brightness: 0x05,
  scene: 0x06,
  direction: 0x07,
  speed: 0x08,
  microphone: 0x0f,
  soundMode: 0x11,
  sensitivity: 0x12,
};

function frame(command, ...payload) {
  return Uint8Array.of(0xbc, command, payload.length, ...payload, 0x55);
}

function bigEndian(value) {
  return [value >> 8, value & 0xff];
}

function rgbToHsv(hex) {
  const [red, green, blue] = hex.slice(1).match(/../g).map(channel => parseInt(channel, 16));
  const largest = Math.max(red, green, blue);
  const difference = largest - Math.min(red, green, blue);
  const value = largest / 255;
  if (!difference) return { degrees: 0, saturation: 0, value };

  let hue;
  if (largest === red) hue = (green - blue) / difference;
  else if (largest === green) hue = (blue - red) / difference + 2;
  else hue = (red - green) / difference + 4;

  return {
    degrees: Math.round((hue * 60 + 360) % 360) % 360,
    saturation: Math.round(difference / largest * 1000),
    value,
  };
}

export function powerFrame(on) {
  return frame(COMMAND.power, Number(on));
}

export function brightnessFrame(percent, colorValue) {
  const level = Math.max(3, Math.round(percent * 10 * colorValue));
  return frame(COMMAND.brightness, ...bigEndian(level), 0, 0, 0, 0);
}

export function colorFrames(hex, brightness) {
  const { degrees, saturation, value } = rgbToHsv(hex);
  return {
    value,
    frames: [
      frame(COMMAND.color, ...bigEndian(degrees), ...bigEndian(saturation), 0, 0),
      brightnessFrame(brightness, value),
    ],
  };
}

export function sceneFrames(scene, speed, direction) {
  return [
    frame(COMMAND.scene, Math.floor(scene / 255), scene % 255),
    frame(COMMAND.speed, speed),
    frame(COMMAND.direction, direction),
  ];
}

export function soundFrames(mode, sensitivity) {
  return [
    frame(COMMAND.microphone, 1),
    frame(COMMAND.soundMode, mode),
    frame(COMMAND.sensitivity, sensitivity),
  ];
}
