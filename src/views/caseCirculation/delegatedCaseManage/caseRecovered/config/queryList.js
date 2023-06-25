/**
 * 表单查询区Json配置
 */

export default [
  {
    type: 'date',
    property: 'recoverStartTime',
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    placeholder: '请选择收回时间'
  },
  {
    type: 'select',
    property: 'operStoreId',
    placeholder: '请选择处置机构',
    options: [
      {
        value: '1',
        label: '哇哈哈'
      },
      {
        value: '2',
        label: '货拉拉'
      }
    ]
  }
]
