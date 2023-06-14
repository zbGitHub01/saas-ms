export default [
  {
    label: '案件分库',
    prop: 'storeName',
    width: 100
  },
  {
    label: '委案产品',
    prop: 'productName',
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
    label: '预委案金额',
    prop: 'preEntrustAmount',
    formatter({ preEntrustAmount }) {
      return Number(preEntrustAmount).toLocaleString()
    }
  },
  {
    label: '委案配置',
    prop: 'orderNo',
    operaBtn: true,
    operaBtnName: '配置'
  },
  {
    label: '操作人',
    prop: 'createName'
  },
  {
    label: '操作时间',
    prop: 'createTime'
  }
]
