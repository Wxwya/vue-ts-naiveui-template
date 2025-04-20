/**
 * 
 * @author xwya
 * @since 2024-12-14
 * @description 深拷贝
 * @param  { any } - obj[需要拷贝的对象]
 * @returns { any } - [拷贝后的对象]
 * @example
 * deepClone({ a: 1, b: { c: 2 } })
 */
export function deepClone(obj){
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);

  const clonedObj = {};
  for (const key in obj) {
    clonedObj[key] = deepClone(obj[key]);
  }
  return clonedObj;
}

/**
 * @author xwya
 * @since 2024-12-14
 * @description 将一个数组分成几个同等长度的数组
 * @param  { Array } - array[分割的原数组]
 * @param  { Number } - size[每个子数组的长度]
 * @return { Array } - result[分割后的数组]
 * @example
 * sliceArray([1, 2, 3, 4, 5, 6, 7, 8], 3)
 */
export const sliceArray = (array, size) => {
  const result = []
  for (let x = 0; x < Math.ceil(array.length / size); x++) {
    const start = x * size
    const end = start + size
    result.push(array.slice(start, end))
  }
  return result
}
/**
 * @author xwya
 * @since 2024-12-14
 * @description 生成随机id
 * @param  { Number } - length[随机id的长度]
 */
export const generateRandomId = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}