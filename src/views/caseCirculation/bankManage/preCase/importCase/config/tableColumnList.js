export default [
  {
    label: '产品',
    prop: 'orderNo'
  },
  {
    label: '回款率梯度（%）',
    prop: 'isEnable',
    isSwitch: true
  },
  {
    label: '正常案件',
    prop: 'orderNo',
    childColumn: [
      {
        prop: 'isOpen',
        label: '本金结算比例',
        isSwitch: true
      },
      {
        label: '利息结算比例',
        prop: 'isOpen',
        isSwitch: true
      }
    ]
  },
  {
    label: '留置案件',
    prop: 'orderNo',
    childColumn: [
      {
        label: '本金结算比例',
        prop: 'orderNo'
      },
      {
        label: '利息结算比例',
        prop: 'orderNo'
      }
    ]
  }
]
