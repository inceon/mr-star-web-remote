import { useRef, useState } from 'react';
import {
  AudioLines, Bluetooth, BluetoothOff, Check, ChevronDown, CircleAlert, Eye, Info, Mic,
  Palette, Play, Power, PowerOff, Sparkles, Sun, Zap,
} from 'lucide-react';
import LedPreview from './LedPreview.jsx';
import { SCENE_GROUPS } from './scenes.js';
import useLedRemote from './useLedRemote.js';

const SWATCHES = [
  ['#ff4561', 'Червоний'],
  ['#ffa34d', 'Бурштиновий'],
  ['#68eb84', 'Зелений'],
  ['#39e1e6', 'Бірюзовий'],
  ['#5596ff', 'Синій'],
  ['#b785ff', 'Фіолетовий'],
  ['#fff4e6', 'Теплий білий'],
];
const HEX_COLOR = /^#?[\da-f]{6}$/i;

function LevelSlider({ id, label, value, onChange, action }) {
  return (
    <div className="field">
      <div className="readout">
        <label htmlFor={id}>{label}</label>
        <output id={`${id}-value`} className="value" htmlFor={id}>{value}%</output>
      </div>
      <div className="range-row">
        <input
          id={id}
          type="range"
          min="1"
          max="100"
          value={value}
          style={{ '--progress': `${(value - 1) / 99 * 100}%` }}
          onChange={event => onChange(Number(event.target.value))}
        />
        {action}
      </div>
    </div>
  );
}

function SelectField({ id, label, value, onChange, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="select-wrap">
        <select id={id} value={value} onChange={event => onChange(Number(event.target.value))}>
          {children}
        </select>
        <ChevronDown aria-hidden="true" size={16} />
      </div>
    </div>
  );
}

export default function App() {
  const remote = useLedRemote();
  const [color, setColor] = useState('#b785ff');
  const [hex, setHex] = useState('#B785FF');
  const [brightness, setBrightness] = useState(80);
  const [scene, setScene] = useState(10);
  const [speed, setSpeed] = useState(50);
  const [direction, setDirection] = useState(1);
  const [soundMode, setSoundMode] = useState(1);
  const [sensitivity, setSensitivity] = useState(65);
  const [previewingScene, setPreviewingScene] = useState(false);
  const previewRef = useRef(null);
  const commandsDisabled = !remote.connected || remote.busy;
  const deviceLabel = remote.connected ? remote.deviceName || 'Під’єднано' : 'Не під’єднано';
  const ConnectionIcon = remote.connected ? BluetoothOff : Bluetooth;
  const StatusIcon = remote.status.tone === 'error' ? CircleAlert : Info;

  function chooseColor(nextColor) {
    setColor(nextColor);
    setHex(nextColor.toUpperCase());
    setPreviewingScene(false);
  }

  function changeHex(event) {
    const value = event.target.value;
    setHex(value);
    if (HEX_COLOR.test(value)) {
      setColor('#' + value.replace(/^#/, '').toLowerCase());
      setPreviewingScene(false);
    }
  }

  function applyColor(event) {
    event.preventDefault();
    setPreviewingScene(false);
    void remote.applyColor(color, brightness);
  }

  function applyScene() {
    setPreviewingScene(true);
    void remote.applyScene(scene, speed, direction);
  }

  function previewScene() {
    setPreviewingScene(true);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    previewRef.current?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'instant' : 'smooth' });
  }

  return (
    <>
      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="brand">
            <span className="brand-mark"><Zap aria-hidden="true" size={23} /></span>
            <div><h1>MR Star</h1><p>Пульт LED-стрічки</p></div>
          </div>
          <div className="connection">
            <span id="device-state" className="state" data-connected={remote.connected} title={deviceLabel}>
              <span>{deviceLabel}</span>
            </span>
            <button
              id="connection"
              className="button connect-button"
              type="button"
              disabled={remote.busy || !remote.supported}
              onClick={remote.toggleConnection}
            >
              <ConnectionIcon aria-hidden="true" size={17} />
              {remote.connected ? 'Від’єднати' : 'Під’єднати'}
            </button>
          </div>
        </div>
      </header>

      <main className="shell">
        <div className="stage">
          <LedPreview
            ref={previewRef}
            color={color}
            brightness={brightness}
            sceneId={previewingScene ? scene : null}
            speed={speed}
            direction={direction}
          />
          <section className="power" aria-labelledby="power-heading">
            <h2 id="power-heading">Живлення</h2>
            <div className="power-actions">
              <button id="on" className="button power-on" type="button" disabled={commandsDisabled} onClick={() => remote.applyPower(true)}>
                <Power aria-hidden="true" size={16} /> Увімкнути
              </button>
              <button id="off" className="button" type="button" disabled={commandsDisabled} onClick={() => remote.applyPower(false)}>
                <PowerOff aria-hidden="true" size={16} /> Вимкнути
              </button>
            </div>
          </section>
        </div>

        <div className="workspace">
          <section className="panel color-panel" aria-labelledby="color-heading">
            <div className="section-heading">
              <span className="section-icon"><Palette aria-hidden="true" size={20} /></span>
              <h2 id="color-heading">Колір</h2>
            </div>
            <form id="color-controls" className="panel-body" onSubmit={applyColor}>
              <div className="field">
                <span id="swatches-label" className="field-label">Готові кольори</span>
                <div className="swatches" role="group" aria-labelledby="swatches-label">
                  {SWATCHES.map(([swatch, label]) => (
                    <button
                      key={swatch}
                      type="button"
                      className="swatch"
                      style={{ '--swatch': swatch }}
                      aria-label={label}
                      aria-pressed={color === swatch}
                      title={label}
                      onClick={() => chooseColor(swatch)}
                    >
                      {color === swatch && <Check aria-hidden="true" size={15} strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label htmlFor="hex">Власний колір</label>
                <div className="color-inputs">
                  <input id="color" type="color" aria-label="Палітра власного кольору" value={color} onChange={event => chooseColor(event.target.value)} />
                  <input
                    id="hex"
                    type="text"
                    value={hex}
                    onChange={changeHex}
                    maxLength={7}
                    pattern="#?[A-Fa-f0-9]{6}"
                    title="Шість шістнадцяткових символів, наприклад #B785FF"
                    aria-label="HEX-код кольору"
                    spellCheck={false}
                    required
                  />
                </div>
              </div>
              <LevelSlider
                id="brightness"
                label="Яскравість"
                value={brightness}
                onChange={setBrightness}
                action={(
                  <button id="apply-brightness" className="button compact" type="button" disabled={commandsDisabled} onClick={() => remote.applyBrightness(brightness)}>
                    <Sun aria-hidden="true" size={15} /> Задати
                  </button>
                )}
              />
              <div className="panel-actions">
                <button className="button action" type="submit" disabled={commandsDisabled}>
                  <Check aria-hidden="true" size={17} /> Застосувати колір
                </button>
              </div>
            </form>
          </section>

          <section className="panel effects-panel" aria-labelledby="effects-heading">
            <div className="section-heading">
              <span className="section-icon"><Sparkles aria-hidden="true" size={20} /></span>
              <h2 id="effects-heading">Ефекти</h2>
            </div>
            <div className="panel-body">
              <SelectField id="scene" label="Сцена" value={scene} onChange={value => {
                setScene(value);
                setPreviewingScene(true);
              }}>
                {SCENE_GROUPS.map(group => (
                  <optgroup key={group.name} label={group.name}>
                    {group.scenes.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                  </optgroup>
                ))}
              </SelectField>
              <LevelSlider id="speed" label="Швидкість" value={speed} onChange={value => {
                setSpeed(value);
                setPreviewingScene(true);
              }} />
              <SelectField id="direction" label="Напрямок" value={direction} onChange={value => {
                setDirection(value);
                setPreviewingScene(true);
              }}>
                <option value={1}>Прямий</option>
                <option value={0}>Зворотний</option>
              </SelectField>
              <div className="panel-actions scene-actions">
                <button id="preview-scene" className="button" type="button" onClick={previewScene}>
                  <Eye aria-hidden="true" size={17} /> Переглянути
                </button>
                <button id="apply-scene" className="button action" type="button" disabled={commandsDisabled} onClick={applyScene}>
                  <Play aria-hidden="true" size={16} /> Запустити
                </button>
              </div>
            </div>
          </section>

          <section className="panel sound-panel" aria-labelledby="sound-heading">
            <div className="section-heading">
              <span className="section-icon"><AudioLines aria-hidden="true" size={21} /></span>
              <h2 id="sound-heading">Реакція на звук</h2>
            </div>
            <div className="panel-body">
              <SelectField id="sound-mode" label="Режим" value={soundMode} onChange={setSoundMode}>
                <option value={1}>Енергія</option>
                <option value={2}>Ритм</option>
                <option value={3}>Спектр</option>
                <option value={4}>Рухома хвиля</option>
              </SelectField>
              <LevelSlider id="sensitivity" label="Чутливість" value={sensitivity} onChange={setSensitivity} />
              <p className="sound-note"><Mic aria-hidden="true" size={17} /> Для контролерів із вбудованим мікрофоном.</p>
              <div className="panel-actions">
                <button id="apply-sound" className="button action" type="button" disabled={commandsDisabled} onClick={() => remote.applySound(soundMode, sensitivity)}>
                  <AudioLines aria-hidden="true" size={17} /> Увімкнути реакцію
                </button>
              </div>
            </div>
          </section>
        </div>

        <p id="status" className="status" role="status" data-tone={remote.status.tone}>
          <StatusIcon aria-hidden="true" size={17} /> {remote.status.message}
        </p>
      </main>
    </>
  );
}
