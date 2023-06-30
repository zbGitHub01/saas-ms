/**
 * 表单查询区Json配置
 */

export default [
  {
    name: '',
    type: 'select',
    property: 'storeId',
    clearable: true,
    placeholder: '请选择委案分库',
    optionLabel: 'itemText',
    optionValue: 'itemId',
    options: []
  },
  {
    name: '',
    type: 'date',
    property: 'entrustMonth',
    placeholder: '请选择委案月份'
  },
  {
    name: '',
    type: 'input',
    property: 'entrustNo',
    placeholder: '请输入委案批次'
  },
  {
    name: '',
    type: 'select',
    property: 'orgId',
    placeholder: '请选择处置机构',
    optionLabel: 'itemText',
    optionValue: 'itemId',
    options: []
  }
]
