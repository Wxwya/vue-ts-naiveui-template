/**
 * @author  xwya 
 * @param {string} color 色值
 * @param {number} ilighten 减弱对比度(-1 ~ -15)
 * @returns {string} 反色值
 * 示例: handleColorReversal("#000000", -4); 返回: #bbbbbb
 */
export const handleColorReversal = (color: string, ilighten: number = 0): string => {
  if (color.startsWith('rgba')||color.startsWith('rgb')) {
    return handleRgbaReversal(color, ilighten);
  } else if (color.startsWith('#')) {
    return handleHexReversal(color, ilighten);
  } else {
    throw new Error('Unsupported color format');
  }
}
// 处理Hex颜色
export const handleHexReversal = (hex: string, ilighten: number): string => {
  hex = hex.replace('#', '');
  const max16 = Math.max(0, Math.min(15, 15 + ilighten));
  
  const reversedHex = hex.split('').map(char => {
    const c16 = parseInt(char, 16); // to 16进制
    const c10 = Math.abs(max16 - c16); // 10进制计算
    return c10.toString(16); // to 16进制
  }).join('');

  return `#${reversedHex}`;
}
// 处理Rgba颜色
export const handleRgbaReversal = (rgba: string, ilighten: number): string => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]*)?\)/);
  if (!match) throw new Error('Invalid RGBA color format');

  const [, r, g, b, a] = match.map(Number);
  const max255 = Math.max(0, Math.min(255, 255 + (ilighten * 17))); // -1 ~ -15 的值被放大了 17 倍，以更好地适应 0-255 的范围
  
  const reverseColor = (c: number) => Math.max(0, Math.min(255, max255 - c));
  
  const reversedR = reverseColor(r);
  const reversedG = reverseColor(g);
  const reversedB = reverseColor(b);

  if (a !== undefined && !isNaN(a)) {
    return `rgba(${reversedR}, ${reversedG}, ${reversedB}, ${a})`;
  } else {
    return `rgb(${reversedR}, ${reversedG}, ${reversedB})`;
  }
}

/**
 * @author  xwya 
 * @param {string} hex  颜色 
 * @param {number} opacity  透明度0-1
 * @returns {string} 弱化值 
 *  示例 toHexToRGB("#000000", 0.5) 返回:rgba(0,0,0,0.5)
 */
export const toHexToRGB = (hex: string, opacity: number):string => {
  let RGBA =
    "rgba(" +
    parseInt("0x" + hex.slice(1, 3)) +
    "," +
    parseInt("0x" + hex.slice(3, 5)) +
    "," +
    parseInt("0x" + hex.slice(5, 7)) +
    "," +
    opacity +
    ")";
  return RGBA;
};

/**
 * @author  xwya
 * @description 生成随机颜色
 * @returns {string} 随机颜色值
 * 示例: generateRandomColor(); 返回: #ffffff
 */
export const generateRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}