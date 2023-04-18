import CryptoJS from 'crypto-js'

export const aesEncrypt = (word, keyWord = 'dongancloudsaas+') => {
  const key = CryptoJS.enc.Latin1.parse(keyWord)
  const encrypted = CryptoJS.AES.encrypt(word, key, { iv: key, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.NoPadding })
  return encrypted.toString()
}

// 子查父路径
export const getPathByKey = (curKey, data) => {
  let result = []
  let traverse = (curKey, path, data) => {
    if (data.length === 0) {
      return
    }
    for (let item of data) {
      path.push(item)
      if (item.id === curKey) {
        result = JSON.parse(JSON.stringify(path))
        return
      }
      const children = Array.isArray(item.children) ? item.children : []
      traverse(curKey, path, children)
      path.pop()
    }
  }
  traverse(curKey, [], data)
  return result
}
