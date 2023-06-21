//批量导出所有components组件
const components = {}
const files = import.meta.globEager('./*/*.vue')
Object.keys(files).forEach(fileName => {
  const name = fileName.replace(/\.\/|\.ts/g, '').split('/')[0]
  components[name] = files[fileName].default
})
export default components
