import { ElMessage, ElMessageBox } from 'element-plus'
export const useConfirm = (message: string = '删除', api: (params: any) => Promise<any>, params: any) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`您确定${message}吗？`, '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      const { code } = await api(params)
      if (code !== 200) return reject(false)
      ElMessage.success(`${message}操作成功`)
      resolve(true)
    })
  })
}
