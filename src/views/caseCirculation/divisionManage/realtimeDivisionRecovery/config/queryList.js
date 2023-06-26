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
    placeholder: '请选择委案批次号',
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
    name: '委案类型',
    type: 'select',
    property: 'entrustType',
    placeholder: '请选择委案类型',
    options: [
      {
        value: '1',
        label: '中控集团'
      },
      {
        value: '2',
        label: '三花集团'
      }
    ]
  }
]
