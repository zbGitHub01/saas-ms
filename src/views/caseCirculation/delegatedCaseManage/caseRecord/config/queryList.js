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
    optionLabel: 'storeName',
    optionValue: 'storeId',
    options: [
      {
        storeId: '1',
        storeName: '大额处置库'
      },
      {
        storeId: '2',
        storeName: 'test临时造的库'
      }
    ]
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
    placeholder: '请选择委案批次'
  },
  {
    name: '',
    type: 'select',
    property: 'orgId',
    placeholder: '请选择处置机构',
    optionLabel: 'itemText',
    optionValue: 'itemId',
    options: [
      {
        itemId: '111',
        itemText: 'test机构111'
      },
      {
        itemId: '222',
        itemText: 'test机构222'
      }
    ]
  }
]
