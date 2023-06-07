/**
 * dialogForm 表单配置
 */
export const reductionDialogFormFields = [
  {
    label: '减免类型',
    prop: 'reductionType',
    type: 'select',
    clearable: true,
    placeholder: '请选择减免类型',
    options: [
      {
        label: '类型一',
        value: 1
      },
      {
        label: '类型二',
        value: 2
      }
    ]
  },
  {
    label: '还款人姓名',
    prop: 'refundName',
    type: 'select',
    clearable: true,
    placeholder: '请选择还款人姓名',
    options: []
  },
  {
    label: '与案人关系',
    prop: 'relation',
    type: 'select',
    clearable: true,
    placeholder: '请选择与案人关系',
    options: []
  },
  {
    label: '还款人电话',
    prop: 'refundPhone',
    type: 'select',
    clearable: true,
    placeholder: '请选择还款人电话',
    options: []
  },
  {
    label: '减免额度',
    prop: 'reductionMoney',
    type: 'input',
    placeholder: '请输入减免额度'
  },
  {
    label: '减免原因',
    prop: 'reductionReasonId',
    type: 'select',
    clearable: true,
    placeholder: '请选择减免原因',
    options: []
  },
  {
    label: '备注',
    prop: 'remark',
    type: 'textarea',
    placeholder: '请输入备注'
  },
  {
    type: 'upload',
    label: '附件',
    prop: 'attachment',
    limit: 1,
    uploadTips: 'jpg/png files with a size less than 500KB.',
    action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15'
  }
]
