/**
 * 递归遍历一个对象，对每个节点执行一个函数
 * @param node 节点
 * @param processor 处理函数
 */
export function traverseDown(node, processor, parent) {
  if (Array.isArray(node)) {
    node?.forEach(child => traverseDown(child, processor, parent))
    return
  }
  if (!node) return
  processor(node, parent)
  node.children && node?.children?.forEach(child => traverseDown(child, processor, node))
}

export function traverseUp(node, processor) {
  if (!node) return
  processor(node)
  node.parent && traverseUp(node.parent, processor)
}