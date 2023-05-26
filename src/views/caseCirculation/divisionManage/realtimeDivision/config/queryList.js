/**
 * 表单查询区Json配置
 */

export default [
  {
    name: '案件ID',
    type: 'input',
    property: 'orderNo'
  },
  {
    name: '到账日期',
    type: 'daterange',
    property: 'dateArray'
  },
  {
    name: '产品',
    type: 'select',
    property: 'orderStatus',
    placeholder: '请选择产品',
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
    name: '批次号',
    type: 'select',
    property: 'orderStatus',
    placeholder: '请选择批次号',
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
    name: '导入日期',
    type: 'daterange',
    property: 'subDate'
  },
  {
    name: '导入操作人',
    type: 'select',
    property: 'orderStatus',
    placeholder: '请选择导入操作人',
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
    name: '导入方式',
    type: 'select',
    property: 'orderStatus',
    placeholder: '请选择导入方式',
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
    name: '账单分类',
    type: 'select',
    property: 'orderStatus',
    placeholder: '请选择账单分类',
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
