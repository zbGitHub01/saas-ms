export default [
  {
    label: '账单ID',
    prop: 'orderNo'
  },
  {
    label: '到账时间',
    prop: 'orderNo'
  },
  {
    label: '收入（+元）',
    prop: 'orderNo'
  },
  {
    label: '支出（-元）',
    prop: 'orderNo',
    formatter({ tendereeName }) {
      return tendereeName === undefined ? '-- --' : tendereeName
    }
  },
  {
    label: '产品',
    prop: 'orderNo',
    formatter({ bidSectionName }) {
      return bidSectionName === undefined ? '-- --' : bidSectionName
    }
  },
  {
    label: '批次号',
    prop: 'orderNo',
    formatter({ targetName }) {
      return targetName === undefined ? '-- --' : targetName
    },
    width: 250
  },
  {
    label: '收款账号',
    prop: 'orderNo'
    // formatter({ amount }) {
    //   return Format.AmountFormat(amount)
    // }
  },
  {
    label: '虚拟账户',
    prop: 'orderNo'
    // formatter({ premium }) {
    //   return Format.AmountFormat(premium)
    // }
  },
  {
    label: '收款债权方',
    prop: 'orderNo'
    // formatter({ createTime }) {
    //   return Format.DateFormat(createTime)
    // }
  },
  {
    label: '对方账号',
    prop: 'orderNo'
  },
  {
    label: '对方姓名',
    prop: 'orderNo'
  },
  {
    label: '账单导入方式',
    prop: 'orderNo'
  },
  {
    label: '交易号/回单号',
    prop: 'orderNo'
  },
  {
    label: '账单备注',
    prop: 'orderNo'
  },
  {
    label: '导入时间',
    prop: 'orderNo'
  },
  {
    label: '导入操作人',
    prop: 'orderNo'
  },
  {
    label: '账单分类',
    prop: 'orderNo'
  }
]
