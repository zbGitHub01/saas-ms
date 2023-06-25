/**
 * 表单查询区Json配置
 */

export default [
  {
    name: '部门',
    type: 'select',
    property: 'deptId',
    // multiple: true,
    clearable: true,
    filterable: true,
    placeholder: '请选择部门',
    options: [
      {
        value: '1',
        label: '杭州三花控股集团'
      },
      {
        value: '2',
        label: '杭州斯凯网络科技'
      },
      {
        value: '3',
        label: '杭州融都科技'
      },
      {
        value: '4',
        label: '浙江中控控股集团'
      }
    ]
  },
  {
    name: 'CPE',
    type: 'select',
    property: 'cpeId',
    placeholder: '请选择CPE',
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
  }
]
