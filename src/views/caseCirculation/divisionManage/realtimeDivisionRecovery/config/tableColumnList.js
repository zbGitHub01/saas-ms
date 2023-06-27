export default [
  {
    label: '案件ID',
    prop: 'caseId'
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
    label: '委案金额',
    prop: 'entrustAmount'
    // formatter({ amount }) {
    //   return Format.AmountFormat(amount)
    // }
  },
  {
    label: '还款入账金额',
    prop: 'totalRefundAmount'
    // formatter({ amount }) {
    //   return Format.AmountFormat(amount)
    // }
  },
  {
    label: '减免金额',
    prop: 'totalReductionAmount'
    // formatter({ amount }) {
    //   return Format.AmountFormat(amount)
    // }
  },
  {
    label: '剩余待还金额',
    prop: 'entrustResidueAmount'
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
    prop: 'tagAlterList',
    popoverProp: 'tagAlertName',
    isSplitJoint: true
  },
  {
    label: 'CPE',
    prop: 'cpeName'
  },
  {
    label: '分案时间',
    prop: 'allotTime'
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
    label: '跟进次数',
    prop: 'entrustFollowTimes'
  },
  {
    label: '最近跟进时间',
    prop: 'entrustLastFollowTime'
  },
  {
    label: '案件状态',
    prop: 'caseStatusText'
  }
]
