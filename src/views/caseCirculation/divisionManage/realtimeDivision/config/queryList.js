/**
 * 表单查询区Json配置
 */

export default [
  {
    name: '案件ID',
    type: 'input',
    property: 'caseId'
  },
  // {
  //   name: '到账日期',
  //   type: 'daterange',
  //   property: 'dateArray'
  // },
  {
    name: '产品',
    type: 'select',
    property: 'productId',
    placeholder: '请选择产品',
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
  },
  {
    name: '批次号',
    type: 'select',
    property: 'entrustBatchNo',
    placeholder: '请选择批次号',
    options: [
      {
        value: '111',
        label: '哇哈哈'
      },
      {
        value: '222',
        label: '货拉拉'
      }
    ]
  },
  {
    name: '债权方',
    type: 'select',
    property: 'orderStatus',
    placeholder: '请选择债权方',
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
