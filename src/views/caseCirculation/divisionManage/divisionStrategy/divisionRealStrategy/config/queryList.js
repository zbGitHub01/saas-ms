/**
 * 表单查询区Json配置
 */

export default [
  {
    name: '委案类型',
    type: 'select',
    property: 'caseType',
    placeholder: '请选择委案类型',
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
    name: '委案批次',
    type: 'select',
    property: 'caseNo',
    placeholder: '请选择委案批次',
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
    name: '产品',
    type: 'select',
    property: 'product',
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
    name: '临时标签',
    type: 'input',
    property: 'tag'
  }
]
