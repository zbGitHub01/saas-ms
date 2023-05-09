/**
 * 深浅拷贝递归方法：
 *    origin: 目标对象
 *    deep: true 开启深拷贝, false 则为浅拷贝
 */
export default function deepCopy(origin, deep) {
  //判断是数组还是对象
  let obj = origin instanceof Array ? [] : {}
  for (let key in origin) {
    let value = origin[key]
    obj[key] = !!deep && typeof value === 'object' && value !== null ? deepCopy(value, deep) : value
  }
  return obj
}
