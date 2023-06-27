export default [
  {
    label: '案件ID',
    prop: 'customColumn'
  },
  {
    label: '产品',
    prop: 'productName'
  },
  {
    label: '姓名',
    prop: 'userName'
  },
  {
    label: '证件号',
    prop: 'idno'
  },
  {
    label: '手机号',
    prop: 'userPhone'
  },
  {
    label: '委案类型',
    prop: 'entrustType'
  },
  {
    label: '委案金额',
    prop: 'entrustAmount'
    // formatter({ amount }) {
    //   return Format.AmountFormat(amount)
    // }
  },
  {
    label: '剩余待还金额',
    prop: 'entrustResidueAmount'

    // formatter({ premium }) {
    //   return Format.AmountFormat(premium)
    // }
  },
  {
    label: '临时标签',
    prop: 'orgTagTempList',
    popoverProp: 'tagName',
    isSplitJoint: true
    // formatter({ createTime }) {
    //   return Format.DateFormat(createTime)
    // }
  },
  {
    label: '预警标签',
    prop: 'tagAlterName',
    popoverProp: 'tagName',
    isSplitJoint: true
  },
  {
    label: '跟进结果',
    prop: 'entrustContactResultText'
  },
  {
    label: '处置状态',
    prop: 'followStatusText'
  },
  {
    label: '案件状态',
    prop: 'caseStatusText'
  }
]
