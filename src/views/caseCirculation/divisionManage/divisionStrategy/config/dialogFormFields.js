/**
 * dialogForm 表单配置
 */
export default [
  {
    label: '机构',
    prop: 'orgId',
    type: 'select',
    disabled: false,
    filterable: true,
    clearable: true,
    placeholder: '请选择机构',
    optionLabel: 'itemText',
    optionValue: 'itemId',
    options: []
  },
  {
    label: '负责人',
    prop: 'assignAdminId',
    type: 'select',
    filterable: true,
    disabled: false,
    clearable: true,
    placeholder: '请选择负责人',
    optionLabel: 'userName',
    optionValue: 'userId',
    options: []
  }
]
