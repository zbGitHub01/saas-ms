import cloneDeep from 'lodash/cloneDeep'
/**
 * @desc 子查父路径
 * @param curKey: 当前节点id
 * @param data: tree数据
 * @returns result 返回父级路径
 */
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
        result = cloneDeep(path)
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

/**
 * @desc 子查父路径
 * @param treeData: tree数据
 * @param parentId: 父级id
 * @param processor: 操作当前查找到的元素
 * @returns result 返回父级路径
 */
export const setUpTree = (treeData, parentId, processor = () => {}) => {
  let path = []
  function traverse(data, id, parentPath) {
    if (!data.length) return
    for (let item of data) {
      parentPath.push(item)
      if (item.id === id) {
        path = cloneDeep(parentPath)
        parentPath.forEach(el => {
          processor(el)
        })
        return
      }
      const children = item.children || []
      traverse(children, id, parentPath)
      parentPath.pop()
    }
  }
  traverse(treeData, parentId, [])
  return path
}

/**
 * @desc 子查父路径
 * @param treeData: 子节点数据
 * @param processor: 操作当前查找到的元素
 * @returns allChildren 返回所有子孙数据
 */
export const setDownTree = (treeData, processor = () => {}) => {
  let allChildren = []
  function traverse(data) {
    data.forEach(item => {
      allChildren.push(item)
      processor(item)
      if (item.children && item.children.length) {
        traverse(item.children)
      }
    })
  }
  traverse(treeData)
  return allChildren
}

export const filterMenu = treeData => {
  const menuList = []
  treeData.forEach((item, index) => {
    if (item.type === 1) {
      menuList.push(item)
      if (item.children && item.children.length) {
        menuList[index].children = filterMenu(item.children)
      }
    }
  })
  return menuList
}
export const filterAuth = treeData => {
  const authRouter = []
  const buttonList = []
  const tabPageMap = {}
  function traverse(data) {
    data.forEach(item => {
      if (item.path) {
        authRouter.push(item.path)
      }
      if (item.type === 3) {
        buttonList.push(item.code)
      }
      if (item.children && item.children.length) {
        const tabPage = item.children.filter(child => child.type === 2)
        if (tabPage.length) {
          tabPageMap[item.path] = {
            tabs: tabPage.map(child => child.code),
            tabActive: tabPage[0].code
          }
        }
        traverse(item.children)
      }
    })
  }
  traverse(treeData)
  return { authRouter, buttonList, tabPageMap }
}
