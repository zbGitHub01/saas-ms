export default [
  {
    type: 'select',
    label: '案件分库',
    prop: 'operStoreId',
    options: []
  },
  {
    type: 'select',
    label: '委案产品',
    prop: 'productId',
    options: [
      {
        label: '默认',
        value: 1
      }
    ]
  },
  {
    type: 'radio',
    label: '操作维度',
    prop: 'entrustStrategy',
    radioList: [
      { name: '案人', label: 1 },
      { name: '案件', label: 2 },
      { name: '库内剩余共债', label: 3 }
    ]
  },
  {
    type: 'select',
    label: '委案类型',
    prop: 'entrustType',
    options: [
      {
        label: '默认',
        value: 1
      },
      {
        label: 'test',
        value: 2
      }
    ]
  },
  {
    type: 'radio',
    label: '历史处置记录',
    prop: 'isHideHisFollowRecord',
    radioList: [
      { name: '隐藏', label: 1 },
      { name: '不隐藏', label: 0 }
    ]
  },
  {
    type: 'date',
    label: '委案到期日',
    prop: 'recoverDate'
  },
  {
    type: 'radio',
    label: '是否自动收回',
    prop: 'isAutoRecycle',
    radioList: [
      { name: '不自动收回', label: 0 },
      { name: '自动收回', label: 1 }
    ]
  },
  {
    type: 'textarea',
    label: '委案备注',
    prop: 'remark'
  },
  {
    type: 'datetime',
    label: '执行时间',
    prop: 'execTime'
  }
]
