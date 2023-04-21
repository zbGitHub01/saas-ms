import CryptoJS from 'crypto-js'

export const aesEncrypt = (word, keyWord = 'dongancloudsaas+') => {
  const key = CryptoJS.enc.Latin1.parse(keyWord)
  const encrypted = CryptoJS.AES.encrypt(word, key, { iv: key, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.NoPadding })
  return encrypted.toString()
}
