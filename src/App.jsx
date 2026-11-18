import { useEffect, useRef, useState } from 'react';
import {
  AudioLines, Bluetooth, BluetoothOff, Check, ChevronDown, CircleAlert, Eye, Info, Languages, Mic,
  Palette, Play, Power, PowerOff, Sparkles, Sun, Zap,
} from 'lucide-react';
import LedPreview from './LedPreview.jsx';
import { LANGUAGES, MESSAGES, readLanguage, saveLanguage } from './i18n.js';
import { SCENE_GROUPS } from './scenes.js';
import useLedRemote from './useLedRemote.js';

const SWATCHES = [
  ['#ff4561', 'red'],
  ['#ffa34d', 'amber'],
  ['#68eb84', 'green'],
  ['#39e1e6', 'cyan'],
  ['#5596ff', 'blue'],
  ['#b785ff', 'purple'],
  ['#fff4e6', 'warmWhite'],
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
  const [language, setLanguage] = useState(readLanguage);
  const messages = MESSAGES[language];
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
  const deviceLabel = remote.connected ? remote.deviceName || messages.connected : messages.disconnected;
  const ConnectionIcon = remote.connected ? BluetoothOff : Bluetooth;
  const StatusIcon = remote.status.tone === 'error' ? CircleAlert : Info;

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = MESSAGES[language].title;
    saveLanguage(language);
  }, [language]);

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
            <div><h1>MR Star</h1><p>{messages.subtitle}</p></div>
          </div>
          <div className="language-switch">
            <Languages className="language-icon" aria-hidden="true" size={16} />
            <select id="language" aria-label={messages.language} value={language} onChange={event => setLanguage(event.target.value)}>
              {LANGUAGES.map(({ code, name }) => <option key={code} value={code} lang={code}>{name}</option>)}
            </select>
            <ChevronDown className="language-arrow" aria-hidden="true" size={14} />
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
              {remote.connected ? messages.disconnect : messages.connect}
            </button>
          </div>
        </div>
      </header>

      <main className="shell">
        <div className="stage">
          <LedPreview
            ref={previewRef}
            color={color}
            language={language}
            label={messages.previewLabel}
            brightness={brightness}
            sceneId={previewingScene ? scene : null}
            speed={speed}
            direction={direction}
          />
          <section className="power" aria-labelledby="power-heading">
            <h2 id="power-heading">{messages.power}</h2>
            <div className="power-actions">
              <button id="on" className="button power-on" type="button" disabled={commandsDisabled} onClick={() => remote.applyPower(true)}>
                <Power aria-hidden="true" size={16} /> {messages.powerOn}
              </button>
              <button id="off" className="button" type="button" disabled={commandsDisabled} onClick={() => remote.applyPower(false)}>
                <PowerOff aria-hidden="true" size={16} /> {messages.powerOff}
              </button>
            </div>
          </section>
        </div>

        <div className="workspace">
          <section className="panel color-panel" aria-labelledby="color-heading">
            <div className="section-heading">
              <span className="section-icon"><Palette aria-hidden="true" size={20} /></span>
              <h2 id="color-heading">{messages.color}</h2>
            </div>
            <form id="color-controls" className="panel-body" onSubmit={applyColor}>
              <div className="field">
                <span id="swatches-label" className="field-label">{messages.presets}</span>
                <div className="swatches" role="group" aria-labelledby="swatches-label">
                  {SWATCHES.map(([swatch, name]) => (
                    <button
                      key={swatch}
                      type="button"
                      className="swatch"
                      style={{ '--swatch': swatch }}
                      aria-label={messages.swatches[name]}
                      aria-pressed={color === swatch}
                      title={messages.swatches[name]}
                      onClick={() => chooseColor(swatch)}
                    >
                      {color === swatch && <Check aria-hidden="true" size={15} strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label htmlFor="hex">{messages.customColor}</label>
                <div className="color-inputs">
                  <input id="color" type="color" aria-label={messages.colorPicker} value={color} onChange={event => chooseColor(event.target.value)} />
                  <input
                    id="hex"
                    type="text"
                    value={hex}
                    onChange={changeHex}
                    maxLength={7}
                    pattern="#?[A-Fa-f0-9]{6}"
                    title={messages.hexHint}
                    aria-label={messages.hexColor}
                    spellCheck={false}
                    required
                  />
                </div>
              </div>
              <LevelSlider
                id="brightness"
                label={messages.brightness}
                value={brightness}
                onChange={setBrightness}
                action={(
                  <button id="apply-brightness" className="button compact" type="button" disabled={commandsDisabled} onClick={() => remote.applyBrightness(brightness)}>
                    <Sun aria-hidden="true" size={15} /> {messages.setBrightness}
                  </button>
                )}
              />
              <div className="panel-actions">
                <button className="button action" type="submit" disabled={commandsDisabled}>
                  <Check aria-hidden="true" size={17} /> {messages.applyColor}
                </button>
              </div>
            </form>
          </section>

          <section className="panel effects-panel" aria-labelledby="effects-heading">
            <div className="section-heading">
              <span className="section-icon"><Sparkles aria-hidden="true" size={20} /></span>
              <h2 id="effects-heading">{messages.effects}</h2>
            </div>
            <div className="panel-body">
              <SelectField id="scene" label={messages.scene} value={scene} onChange={value => {
                setScene(value);
                setPreviewingScene(true);
              }}>
                {SCENE_GROUPS.map(group => (
                  <optgroup key={group.name.en} label={group.name[language]}>
                    {group.scenes.map(([id, name]) => <option key={id} value={id}>{name[language]}</option>)}
                  </optgroup>
                ))}
              </SelectField>
              <LevelSlider id="speed" label={messages.speed} value={speed} onChange={value => {
                setSpeed(value);
                setPreviewingScene(true);
              }} />
              <SelectField id="direction" label={messages.direction} value={direction} onChange={value => {
                setDirection(value);
                setPreviewingScene(true);
              }}>
                <option value={1}>{messages.forward}</option>
                <option value={0}>{messages.reverse}</option>
              </SelectField>
              <div className="panel-actions scene-actions">
                <button id="preview-scene" className="button" type="button" onClick={previewScene}>
                  <Eye aria-hidden="true" size={17} /> {messages.previewScene}
                </button>
                <button id="apply-scene" className="button action" type="button" disabled={commandsDisabled} onClick={applyScene}>
                  <Play aria-hidden="true" size={16} /> {messages.startScene}
                </button>
              </div>
            </div>
          </section>

          <section className="panel sound-panel" aria-labelledby="sound-heading">
            <div className="section-heading">
              <span className="section-icon"><AudioLines aria-hidden="true" size={21} /></span>
              <h2 id="sound-heading">{messages.sound}</h2>
            </div>
            <div className="panel-body">
              <SelectField id="sound-mode" label={messages.mode} value={soundMode} onChange={setSoundMode}>
                <option value={1}>{messages.energy}</option>
                <option value={2}>{messages.rhythm}</option>
                <option value={3}>{messages.spectrum}</option>
                <option value={4}>{messages.movingWave}</option>
              </SelectField>
              <LevelSlider id="sensitivity" label={messages.sensitivity} value={sensitivity} onChange={setSensitivity} />
              <p className="sound-note"><Mic aria-hidden="true" size={17} /> {messages.micNote}</p>
              <div className="panel-actions">
                <button id="apply-sound" className="button action" type="button" disabled={commandsDisabled} onClick={() => remote.applySound(soundMode, sensitivity)}>
                  <AudioLines aria-hidden="true" size={17} /> {messages.enableSound}
                </button>
              </div>
            </div>
          </section>
        </div>

        <p id="status" className="status" role="status" data-tone={remote.status.tone}>
          <StatusIcon aria-hidden="true" size={17} /> {messages.status[remote.status.key]}
        </p>
      </main>
    </>
  );
}
