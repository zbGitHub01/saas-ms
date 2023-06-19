export default [
  {
    label: '上传文件',
    prop: 'entrustFileUrl',
    width: 150,
    formatter({ entrustFileUrl }) {
      return entrustFileUrl.split('/').slice(-1)[0]
    }
  },
  {
    label: '案件分库',
    prop: 'storeName',
    width: 100
  },
  {
    label: '目标机构',
    prop: 'orgName',
    width: 200
  },
  {
    label: '操作维度',
    prop: 'entrustStrategy',
    formatter({ entrustStrategy }) {
      const textMap = {
        1: '案人',
        2: '案件',
        3: '剩余共债'
      }
      return textMap[entrustStrategy]
    }
  },
  {
    label: '委案类型',
    prop: 'entrustTypeStr'
  },
  {
    label: '委案备注',
    prop: 'remark'
  },
  {
    label: '执行时间',
    prop: 'execTime'
  },
  {
    label: '上传人',
    prop: 'createName'
  },
  {
    label: '上传时间',
    prop: 'createTime'
  }
]
