import { Eye } from 'lucide-react';
import { SCENE_COLORS, SCENE_GROUPS } from './scenes.js';

const scenesById = new Map(SCENE_GROUPS.flatMap(group =>
  group.scenes.map(([id, name, colors, motion = group.motion]) => [id, {
    name,
    palette: Array.from(colors, key => SCENE_COLORS[key]),
    motion,
  }]),
));

function sceneStyles({ palette, motion }) {
  const first = palette[0];
  if (motion === 'jump') {
    const cycle = [...palette, first];
    const stops = cycle.map((fill, index) =>
      `${fill} ${100 * index / cycle.length}% ${100 * (index + 1) / cycle.length}%`);
    return {
      '--preview-fill': `linear-gradient(90deg, ${stops.join(', ')})`,
      '--preview-width': `${cycle.length * 100}%`,
      '--preview-steps': palette.length,
    };
  }
  if (motion === 'flow' || motion === 'wave') {
    const cycle = palette.length === 1 ? [first, `color-mix(in srgb, ${first} 55%, white)`] : palette;
    const stops = [...cycle, first].map((fill, index) => `${fill} ${50 * index / cycle.length}%`);
    return { '--preview-fill': `repeating-linear-gradient(90deg, ${stops.join(', ')})` };
  }
  return {
    '--preview-fill': palette.length === 1 ? first : `linear-gradient(90deg, ${palette.join(', ')})`,
  };
}

export default function LedPreview({ ref, color, brightness, sceneId, speed, direction }) {
  const scene = scenesById.get(sceneId);
  const style = {
    '--preview-level': brightness / 100,
    '--preview-color': scene ? scene.palette[0] : color,
    '--preview-duration': `${(8.4 - 6 * speed / 100).toFixed(2)}s`,
    ...(scene && sceneStyles(scene)),
  };

  return (
    <figure
      id="preview"
      ref={ref}
      className="preview"
      data-motion={scene?.motion ?? 'color'}
      data-reverse={Boolean(scene) && direction === 0}
      style={style}
    >
      <figcaption id="preview-caption">
        <span className="preview-label"><Eye aria-hidden="true" size={18} /> Попередній перегляд</span>
        <span className="preview-value">{scene ? scene.name : color.toUpperCase()}</span>
      </figcaption>
      <div className="preview-visual" aria-hidden="true">
        <div className="preview-track"><div className="preview-light" /></div>
      </div>
    </figure>
  );
}
