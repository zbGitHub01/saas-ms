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
    optionLabel: 'itemText',
    optionValue: 'itemId',
    options: []
  },
  {
    name: 'CPE',
    type: 'select',
    property: 'cpeId',
    placeholder: '请选择CPE',
    optionLabel: 'itemText',
    optionValue: 'itemId',
    options: []
  }
]
