import Mocks from 'mockjs'

const baseUrl = '/api'

Mocks.mock(baseUrl + '/caseCenter/case/entrust/entrustRecordExportField', 'get', {
  'data|1-10': ['委案类型']
})

Mocks.mock(baseUrl + '/caseCenter/case/getList', 'post', {
  'data|3-10': [
    {
      'caseNum|+1': ['20230427_666_10203', '20230427_666_10202', '20230427_666_10201'],
      'caseStore|+1': ['协商处置库', '委外处置库', '大额处置库', '法诉处置库'],
      'operaCompany|+1': ['杭州根号网络科技有限公司', '江西正众企业管理有限公司', '山西今昇昌企业管理咨询服务有限公司'],
      'caseType|+1': ['默认', '待委派客服进线调案', '激励案件23-内部-28（2023年4月）'],
      'caseNumber|+1': ['10245', '44', '556'],
      'orderNo|+1': ['10245', '44', '556']
    }
  ],
  page: 1,
  pageSize: 10,
  total: 16
})
