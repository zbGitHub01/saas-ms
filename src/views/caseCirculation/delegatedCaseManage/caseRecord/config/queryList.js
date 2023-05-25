/**
 * 表单查询区Json配置
 */

export default [
  {
    name: '',
    type: 'select',
    property: 'orderStatus',
    placeholder: '请选择委案分库',
    options: [
      {
        value: '1100010001000',
        label: '哇哈哈'
      },
      {
        value: '2100011001000',
        label: '货拉拉'
      }
    ]
  },
  {
    name: '',
    type: 'date',
    property: 'dateArray',
    placeholder: '请选择委案日期'
  },
  {
    name: '',
    type: 'input',
    property: 'orderNo',
    placeholder: '请选择委案批次'
  },
  {
    name: '',
    type: 'select',
    property: 'orderStatus',
    placeholder: '请选择处置机构',
    options: [
      {
        value: '1100010001000',
        label: '还款清算表'
      },
      {
        value: '2100011001000',
        label: '支付宝账单'
      }
    ]
  }
]
