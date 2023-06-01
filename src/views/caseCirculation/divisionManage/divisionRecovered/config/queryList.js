/**
 * 表单查询区Json配置
 */

export default [
  {
    type: 'date',
    property: 'dateArray',
    placeholder: '请选择收回时间'
  },
  {
    type: 'select',
    property: 'orderStatus',
    placeholder: '请选择处置机构',
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
  }
]
