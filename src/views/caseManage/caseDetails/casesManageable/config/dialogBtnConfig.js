/**
 * 可管理案件顶部操作按钮DialogForm配置
 */

//录入资方信息
export const CapitalDialog = {
  dialogBtnTitle: '录入资方信息',
  dialogRuleForm: { investorName: '' },
  rules: { investorName: [{ required: true, message: '请选择资方名称', trigger: 'change' }] },
  width: '25%',
  formFieldsList: [
    {
      type: 'select',
      label: '资方名称',
      prop: 'investorName',
      options: [
        '中泰信托有限责任公司',
        '中信信托有限责任公司',
        '深圳宝安融兴村镇银行有限责任公司',
        '哈尔滨哈银消费金融有限责任公司',
        '吉林银行股份有限公司'
      ]
    }
  ]
}

//录入财产信息
