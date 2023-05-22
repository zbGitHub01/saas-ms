import Mocks from 'mockjs'

const baseUrl = '/api'

Mocks.mock(baseUrl + '/caseCenter/case/entrust/entrustRecordExportField', 'get', {
  'data|1-10': ['委案类型']
})
