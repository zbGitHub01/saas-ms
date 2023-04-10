/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export const phoneReg = /^((\+|00)86)?1\d{10}$/

export const passwordReg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{8,20}$/

export const capitalized = /^[A-Z]/

