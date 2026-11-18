'use strict';

// Scene IDs and color sequences from the MR Star controller documentation.
// https://github.com/witchbladeq/MR-Star-OpenRGB/blob/main/scenes.md
export const SCENE_COLORS = {
  r: '#ff4561',
  g: '#68eb84',
  b: '#5596ff',
  y: '#ffc45b',
  c: '#39e1e6',
  p: '#b785ff',
  w: '#fff4e6',
};

export const SCENE_GROUPS = [
  {
    name: { en: 'Basics', uk: 'Основні' },
    motion: 'jump',
    scenes: [
      [1, { en: 'Auto cycle', uk: 'Автоматична зміна' }, 'rygcbp', 'flow'],
      [2, { en: 'Symphony', uk: 'Симфонія' }, 'rygcbp', 'pulse'],
      [3, { en: 'Color energy', uk: 'Кольорова енергія' }, 'rygcbp'],
      [4, { en: 'Color jumps', uk: 'Стрибки кольорів' }, 'rygcbp'],
      [5, { en: 'Red–green–blue jumps', uk: 'Червоно-зелено-сині стрибки' }, 'rgb'],
      [6, { en: 'Yellow–blue–purple jumps', uk: 'Жовто-синьо-фіолетові стрибки' }, 'ybp'],
    ],
  },
  {
    name: { en: 'Gradients', uk: 'Градієнти' },
    motion: 'flow',
    scenes: [
      [10, { en: 'Rainbow gradient', uk: 'Веселковий градієнт' }, 'rygcbp'],
      [11, { en: 'Red–yellow gradient', uk: 'Червоно-жовтий градієнт' }, 'ry'],
      [12, { en: 'Red–purple gradient', uk: 'Червоно-фіолетовий градієнт' }, 'rp'],
      [13, { en: 'Green gradient', uk: 'Зелений градієнт' }, 'g'],
      [14, { en: 'Green–yellow gradient', uk: 'Зелено-жовтий градієнт' }, 'gy'],
      [15, { en: 'Blue–purple gradient', uk: 'Синьо-фіолетовий градієнт' }, 'bp'],
    ],
  },
  {
    name: { en: 'Flicker and fill', uk: 'Мерехтіння й заповнення' },
    motion: 'opening',
    scenes: [
      [26, { en: 'Multicolor flicker', uk: 'Кольорове мерехтіння' }, 'rygcbp', 'pulse'],
      [27, { en: 'Red–green–blue flicker', uk: 'Червоно-зелено-синє мерехтіння' }, 'rgb', 'pulse'],
      [28, { en: 'Yellow–cyan–purple flicker', uk: 'Жовто-бірюзово-фіолетове мерехтіння' }, 'ycp', 'pulse'],
      [29, { en: 'Rainbow fill', uk: 'Веселкове заповнення' }, 'rygcbp'],
      [30, { en: 'Red–green–blue fill', uk: 'Червоно-зелено-синє заповнення' }, 'rgb'],
      [31, { en: 'Yellow–cyan–purple fill', uk: 'Жовто-бірюзово-фіолетове заповнення' }, 'ycp'],
      [32, { en: 'Two-way rainbow fill', uk: 'Двобічне веселкове заповнення' }, 'rygcbp'],
    ],
  },
  {
    name: { en: 'Expand and retract', uk: 'Розкриття й згортання' },
    motion: 'opening',
    scenes: [
      [35, { en: 'Rainbow expansion', uk: 'Веселкове розкриття' }, 'rygcbp'],
      [36, { en: 'Red–green–blue expansion', uk: 'Червоно-зелено-синє розкриття' }, 'rgb'],
      [37, { en: 'Yellow–cyan–purple expansion', uk: 'Жовто-бірюзово-фіолетове розкриття' }, 'ycp'],
      [38, { en: 'Red expansion', uk: 'Червоне розкриття' }, 'r'],
      [39, { en: 'Green expansion', uk: 'Зелене розкриття' }, 'g'],
      [40, { en: 'Blue expansion', uk: 'Синє розкриття' }, 'b'],
      [41, { en: 'Yellow expansion', uk: 'Жовте розкриття' }, 'y'],
      [42, { en: 'Cyan expansion', uk: 'Бірюзове розкриття' }, 'c'],
      [43, { en: 'Purple expansion', uk: 'Фіолетове розкриття' }, 'p'],
      [44, { en: 'White expansion', uk: 'Біле розкриття' }, 'w'],
    ],
  },
  {
    name: { en: 'Fades', uk: 'Плавне згасання' },
    motion: 'pulse',
    scenes: [
      [45, { en: 'Rainbow fade', uk: 'Веселкове згасання' }, 'rygcbp'],
      [46, { en: 'Blue–red–green fade', uk: 'Синьо-червоно-зелене згасання' }, 'brg'],
      [47, { en: 'Purple–green–yellow fade', uk: 'Фіолетово-зелено-жовте згасання' }, 'pgy'],
      [48, { en: 'Red accent fade', uk: 'Згасання з червоним акцентом' }, 'r'],
      [49, { en: 'Green accent fade', uk: 'Згасання із зеленим акцентом' }, 'g'],
      [50, { en: 'Blue accent fade', uk: 'Згасання із синім акцентом' }, 'b'],
      [51, { en: 'Cyan accent fade', uk: 'Згасання з бірюзовим акцентом' }, 'c'],
      [52, { en: 'Yellow accent fade', uk: 'Згасання з жовтим акцентом' }, 'y'],
      [53, { en: 'Purple accent fade', uk: 'Згасання з фіолетовим акцентом' }, 'p'],
      [54, { en: 'White accent fade', uk: 'Згасання з білим акцентом' }, 'w'],
    ],
  },
  {
    name: { en: 'Waves', uk: 'Хвилі' },
    motion: 'wave',
    scenes: [
      [55, { en: 'Rainbow wave', uk: 'Веселкова хвиля' }, 'rygcbp'],
      [56, { en: 'Blue–green–red wave', uk: 'Синьо-зелено-червона хвиля' }, 'bgr'],
      [57, { en: 'Purple–green–yellow wave', uk: 'Фіолетово-зелено-жовта хвиля' }, 'pgy'],
      [58, { en: 'Red–green wave', uk: 'Червоно-зелена хвиля' }, 'rg'],
      [59, { en: 'Green–blue wave', uk: 'Зелено-синя хвиля' }, 'gb'],
      [60, { en: 'Yellow–blue wave', uk: 'Жовто-синя хвиля' }, 'yb'],
      [61, { en: 'Yellow–cyan wave', uk: 'Жовто-бірюзова хвиля' }, 'yc'],
      [62, { en: 'Blue–purple wave', uk: 'Синьо-фіолетова хвиля' }, 'bp'],
    ],
  },
  {
    name: { en: 'Trails', uk: 'Шлейфи' },
    motion: 'tail',
    scenes: [
      [76, { en: 'Rainbow trail', uk: 'Веселковий шлейф' }, 'rygcbp'],
      [77, { en: 'Red trail', uk: 'Червоний шлейф' }, 'r'],
      [78, { en: 'Green trail', uk: 'Зелений шлейф' }, 'g'],
      [79, { en: 'Blue trail', uk: 'Синій шлейф' }, 'b'],
      [80, { en: 'Yellow trail', uk: 'Жовтий шлейф' }, 'y'],
      [81, { en: 'Cyan trail', uk: 'Бірюзовий шлейф' }, 'c'],
      [82, { en: 'Purple trail', uk: 'Фіолетовий шлейф' }, 'p'],
      [83, { en: 'White trail', uk: 'Білий шлейф' }, 'w'],
    ],
  },
  {
    name: { en: 'Chases', uk: 'Рухомі вогники' },
    motion: 'chase',
    scenes: [
      [84, { en: 'Red chase', uk: 'Червоний рухомий вогник' }, 'r'],
      [85, { en: 'Green chase', uk: 'Зелений рухомий вогник' }, 'g'],
      [86, { en: 'Blue chase', uk: 'Синій рухомий вогник' }, 'b'],
      [87, { en: 'Yellow chase', uk: 'Жовтий рухомий вогник' }, 'y'],
      [88, { en: 'Cyan chase', uk: 'Бірюзовий рухомий вогник' }, 'c'],
      [89, { en: 'Purple chase', uk: 'Фіолетовий рухомий вогник' }, 'p'],
      [90, { en: 'White chase', uk: 'Білий рухомий вогник' }, 'w'],
      [91, { en: 'Rainbow chase', uk: 'Веселкові рухомі вогники' }, 'rygcbp'],
      [92, { en: 'Blue–green–red chase', uk: 'Синьо-зелено-червоні вогники' }, 'bgr'],
      [93, { en: 'Purple–cyan–yellow chase', uk: 'Фіолетово-бірюзово-жовті вогники' }, 'pcy'],
    ],
  },
];
