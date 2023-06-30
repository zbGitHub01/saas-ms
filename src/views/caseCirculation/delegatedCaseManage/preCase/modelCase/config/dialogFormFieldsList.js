export default [
  {
    type: 'select',
    label: '案件分库',
    prop: 'operStoreId',
    optionLabel: 'itemText',
    optionValue: 'itemId',
    options: []
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
    label: '案人模型',
    prop: 'modelArr',
    clearable: true,
    multiple: true,
    filterable: true,
    placeholder: '请选择案人模型',
    needBtn: true,
    btnText: '计算',
    btnDisabled: false,
    optionLabel: 'modelName',
    optionValue: 'modelId',
    options: []
  },
  {
    type: 'checkbox',
    label: '委案产品',
    prop: 'productArr',
    checkboxLabel: 'productName',
    checkList: []
  },
  {
    type: 'select',
    label: '备用模型',
    prop: 'backupModelArr',
    placeholder: '请选择案人模型',
    optionLabel: 'modelName',
    optionValue: 'modelId',
    options: []
  },
  {
    type: 'select',
    label: '委案类型',
    prop: 'entrustType',
    optionLabel: 'itemText',
    optionValue: 'itemId',
    options: []
  },
  {
    type: 'radio',
    label: '历史处置记录',
    prop: 'isHideHisFollowRecord',
    radioList: [
      { name: '隐藏', label: '1' },
      { name: '不隐藏', label: '0' }
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
      { name: '不自动收回', label: '0' },
      { name: '自动收回', label: '1' }
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
