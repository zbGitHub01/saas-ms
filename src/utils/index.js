import CryptoJS from 'crypto-js'

export const aesEncrypt = (word, keyWord = 'dongancloudsaas+') => {
  const key = CryptoJS.enc.Latin1.parse(keyWord)
  const encrypted = CryptoJS.AES.encrypt(word, key, { iv: key, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.NoPadding })
  return encrypted.toString()
}

/**
 * @description 文件下载
 * @param {string} url  下载地址
 */
export const downloadFile = url => {
  if (!url) return
  const eLink = document.createElement('a')
  eLink.style.display = 'none'
  eLink.href = url
  document.body.appendChild(eLink)
  eLink.click()
  document.body.removeChild(eLink)
}
