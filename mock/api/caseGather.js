import Mocks from 'mockjs'

const baseUrl = '/api'

Mocks.mock(baseUrl + '/caseCenter/case/getCPEList', 'post', {
  'data|3-10': [
    {
      'CPEName|+1': ['栾合金', '吴曲曲', '周志全', '王银萍'],
      'apartment|+1': ['一组', '二组', '三组', '四组'],
      all: {
        'amount|1-1000000.1-2': 7501259.33,
        'households|1-10000': 6702,
        'perHouseholds|1-10000.1-2': 1119.26
      },
      loan: {
        'amount|1-1000000.1-2': 7501259.33,
        'households|1-10000': 6702,
        'perHouseholds|1-10000.1-2': 1119.26
      },
      my: {
        'amount|1-1000000.1-2': 7501259.33,
        'households|1-10000': 6702,
        'perHouseholds|1-10000.1-2': 1119.26
      },
      jieXin: {
        'amount|1-1000000.1-2': 7501259.33,
        'households|1-10000': 6702,
        'perHouseholds|1-10000.1-2': 1119.26
      }
    }
  ],
  page: 1,
  pageSize: 10,
  total: 16
})

Mocks.mock(baseUrl + '/caseCenter/case/caseUnassignedGatherList', 'post', {
  'data|3-10': [
    {
      'caseType|+1': ['默认', '激励案件23-内部-28（2023年4月）', '综合案件3-内部-34', '待委派客服进线调案'],
      all: {
        'amount|1-1000000.1-2': 7501259.33,
        'households|1-10000': 6702,
        'perHouseholds|1-10000.1-2': 1119.26
      },
      loan: {
        'amount|1-1000000.1-2': 7501259.33,
        'households|1-10000': 6702,
        'perHouseholds|1-10000.1-2': 1119.26
      },
      my: {
        'amount|1-1000000.1-2': 7501259.33,
        'households|1-10000': 6702,
        'perHouseholds|1-10000.1-2': 1119.26
      },
      jieXin: {
        'amount|1-1000000.1-2': 7501259.33,
        'households|1-10000': 6702,
        'perHouseholds|1-10000.1-2': 1119.26
      }
    }
  ],
  page: 1,
  pageSize: 10,
  total: 16
})
