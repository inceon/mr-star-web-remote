const LANGUAGE_STORAGE_KEY = 'mr-star-language';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Українська' },
];

export function readLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'uk' ? 'uk' : 'en';
  } catch {
    return 'en';
  }
}

export function saveLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // The language switch still works when the browser blocks storage.
  }
}

export const MESSAGES = {
  en: {
    title: 'MR Star · LED Strip Remote',
    subtitle: 'LED Strip Remote',
    language: 'Interface language',
    connected: 'Connected',
    disconnected: 'Not connected',
    connect: 'Connect',
    disconnect: 'Disconnect',
    previewLabel: 'LED preview',
    power: 'Power',
    powerOn: 'Turn on',
    powerOff: 'Turn off',
    color: 'Color',
    presets: 'Color presets',
    swatches: {
      red: 'Red', amber: 'Amber', green: 'Green', cyan: 'Cyan', blue: 'Blue', purple: 'Purple', warmWhite: 'Warm white',
    },
    customColor: 'Custom color',
    colorPicker: 'Custom color picker',
    hexColor: 'HEX color code',
    hexHint: 'Six hexadecimal digits, for example #B785FF',
    brightness: 'Brightness',
    setBrightness: 'Set',
    applyColor: 'Apply color',
    effects: 'Effects',
    scene: 'Scene',
    speed: 'Speed',
    direction: 'Direction',
    forward: 'Forward',
    reverse: 'Reverse',
    previewScene: 'Preview',
    startScene: 'Start scene',
    sound: 'Sound reactive',
    mode: 'Mode',
    energy: 'Energy',
    rhythm: 'Rhythm',
    spectrum: 'Spectrum',
    movingWave: 'Moving wave',
    sensitivity: 'Sensitivity',
    micNote: 'Requires a controller with a built-in microphone.',
    enableSound: 'Enable sound mode',
    status: {
      ready: 'Power on the strip, close the MR Star phone app, and connect over Bluetooth.',
      unsupported: 'Use Chrome or Edge over HTTPS or on localhost to access Bluetooth.',
      disconnected: 'LED strip disconnected.',
      chooseDevice: 'Select your LED strip in the browser’s Bluetooth prompt.',
      connectionLost: 'Connection lost. Reconnect the LED strip.',
      connected: 'LED strip connected. Pick a color or start a scene.',
      noDevice: 'No LED strip selected.',
      connectionFailed: 'Could not connect. Check that the strip is powered on and the browser can access Bluetooth. Close the MR Star phone app.',
      commandFailed: 'Could not finish sending the command. Try again or reconnect the LED strip.',
      powerOnSent: 'Power-on command sent.',
      powerOffSent: 'Power-off command sent.',
      colorSent: 'Color command sent.',
      brightnessSent: 'Brightness command sent.',
      sceneSent: 'Scene, speed, and direction commands sent.',
      soundSent: 'Sound mode commands sent.',
    },
  },
  uk: {
    title: 'MR Star · Пульт стрічки',
    subtitle: 'Пульт LED-стрічки',
    language: 'Мова інтерфейсу',
    connected: 'Під’єднано',
    disconnected: 'Не під’єднано',
    connect: 'Під’єднати',
    disconnect: 'Від’єднати',
    previewLabel: 'Попередній перегляд',
    power: 'Живлення',
    powerOn: 'Увімкнути',
    powerOff: 'Вимкнути',
    color: 'Колір',
    presets: 'Готові кольори',
    swatches: {
      red: 'Червоний', amber: 'Бурштиновий', green: 'Зелений', cyan: 'Бірюзовий', blue: 'Синій', purple: 'Фіолетовий', warmWhite: 'Теплий білий',
    },
    customColor: 'Власний колір',
    colorPicker: 'Палітра власного кольору',
    hexColor: 'HEX-код кольору',
    hexHint: 'Шість шістнадцяткових символів, наприклад #B785FF',
    brightness: 'Яскравість',
    setBrightness: 'Задати',
    applyColor: 'Застосувати колір',
    effects: 'Ефекти',
    scene: 'Сцена',
    speed: 'Швидкість',
    direction: 'Напрямок',
    forward: 'Прямий',
    reverse: 'Зворотний',
    previewScene: 'Переглянути',
    startScene: 'Запустити',
    sound: 'Реакція на звук',
    mode: 'Режим',
    energy: 'Енергія',
    rhythm: 'Ритм',
    spectrum: 'Спектр',
    movingWave: 'Рухома хвиля',
    sensitivity: 'Чутливість',
    micNote: 'Для контролерів із вбудованим мікрофоном.',
    enableSound: 'Увімкнути реакцію',
    status: {
      ready: 'Увімкни стрічку, закрий MR Star на телефоні й під’єднайся через Bluetooth.',
      unsupported: 'Відкрий пульт у Chrome або Edge через HTTPS чи localhost для доступу до Bluetooth.',
      disconnected: 'Стрічку від’єднано.',
      chooseDevice: 'Вибери свою стрічку у вікні браузера.',
      connectionLost: 'З’єднання втрачено. Під’єднай стрічку знову.',
      connected: 'Стрічку під’єднано. Вибери колір або запусти сцену.',
      noDevice: 'Стрічку не вибрано.',
      connectionFailed: 'Не вдалося під’єднатися. Перевір живлення стрічки й доступ браузера до Bluetooth. Закрий MR Star на телефоні.',
      commandFailed: 'Не вдалося завершити команду. Спробуй ще раз або під’єднай стрічку знову.',
      powerOnSent: 'Команду ввімкнення надіслано.',
      powerOffSent: 'Команду вимкнення надіслано.',
      colorSent: 'Команду кольору надіслано.',
      brightnessSent: 'Команду яскравості надіслано.',
      sceneSent: 'Команди сцени, швидкості й напрямку надіслано.',
      soundSent: 'Команди звукового режиму надіслано.',
    },
  },
};
