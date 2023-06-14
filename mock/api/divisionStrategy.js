import Mocks from 'mockjs'

const baseUrl = '/api'

Mocks.mock(baseUrl + '/caseCenter/divisionStrategyList', 'post', {
  'data|3-10': [
    {
      'id|+1': 0,
      'orgName|1-4': '浙江天心',
      'assignAdminName|1-3': '塔里木',
      'assignCaseAmount|1-10000.1-2': 25895622.58,
      'unAssignCaseAmount|1-1000000.1-2': 3654998.56,
      'assignCaseNumber|1-10000': 1225,
      'unAssignCaseNumber|1-10000': 365
    }
  ]
})

Mocks.mock(baseUrl + '/caseCenter/getOrgNameList', 'get', {
  'data|5-30': [
    {
      'id|+1': 0,
      'orgName|1-5': '哇哈哈'
    }
  ]
})

Mocks.mock(baseUrl + '/caseCenter/getAssignAdminNameList', 'get', {
  'data|3-10': [
    {
      'id|+1': 0,
      'assignAdminName|1-5': '塔里木'
    }
  ]
})
