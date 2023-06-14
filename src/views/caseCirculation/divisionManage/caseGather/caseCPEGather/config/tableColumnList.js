export default [
  {
    label: 'CPE姓名',
    prop: 'CPEName',
    width: 150
  },
  {
    label: '所属部门',
    prop: 'apartment',
    width: 100
  },
  {
    label: '全部',
    prop: 'all',
    multilayer: true,
    childColumn: [
      {
        label: '金额',
        prop: 'amount'
      },
      {
        label: '户数',
        prop: 'households'
      },
      {
        label: '户均',
        prop: 'perHouseholds'
      }
    ]
  },
  {
    label: '“360”借条',
    prop: 'loan',
    multilayer: true,
    childColumn: [
      {
        label: '金额',
        prop: 'amount'
      },
      {
        label: '户数',
        prop: 'households'
      },
      {
        label: '户均',
        prop: 'perHouseholds'
      }
    ]
  },
  {
    label: '古京我来贷',
    prop: 'my',
    multilayer: true,
    childColumn: [
      {
        label: '金额',
        prop: 'amount'
      },
      {
        label: '户数',
        prop: 'households'
      },
      {
        label: '户均',
        prop: 'perHouseholds'
      }
    ]
  },
  {
    label: '捷信项目',
    prop: 'jieXin',
    multilayer: true,
    childColumn: [
      {
        label: '金额',
        prop: 'amount'
      },
      {
        label: '户数',
        prop: 'households'
      },
      {
        label: '户均',
        prop: 'perHouseholds'
      }
    ]
  }
]
