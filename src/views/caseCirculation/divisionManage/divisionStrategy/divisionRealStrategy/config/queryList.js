/**
 * 表单查询区Json配置
 */

export default [
  {
    name: '委案类型',
    type: 'select',
    property: 'entrustType',
    placeholder: '请选择委案类型',
    // optionLabel: 'storeName',
    // optionValue: 'storeId',
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
    name: '委案批次',
    type: 'select',
    property: 'entrustNo',
    placeholder: '请选择委案批次',
    // optionLabel: 'storeName',
    // optionValue: 'storeId',
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
    name: '产品',
    type: 'select',
    property: 'productId',
    placeholder: '请选择产品',
    // optionLabel: 'storeName',
    // optionValue: 'storeId',
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
    name: '临时标签',
    type: 'input',
    property: 'tagTempName'
  }
]
