export const hex2rgba = (hex: string, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g)?.map(x => parseInt(x, 16)) ?? [];
  return `rgba(${r},${g},${b},${alpha})`;
};

export const linearGradient = (color: string, opacity = 1, fallBackColor = '#ffffff', addon = '') => {
  const more = addon ? `, ${addon}` : '';
  return `linear-gradient(0deg, ${hex2rgba(color, opacity)}, ${hex2rgba(color, opacity)})${more} ${fallBackColor}`;
};
