//批量导出所有tab组件
const tabComponentObj = {}
const files = import.meta.globEager('./*/*.vue')
Object.keys(files).forEach(fileName => {
  const name = fileName.replace(/\.\/|\.ts/g, '').split('/')[0]
  tabComponentObj[name] = files[fileName].default
})
export default tabComponentObj
