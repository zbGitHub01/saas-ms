import Mocks from 'mockjs'

const baseUrl = '/api'

Mocks.mock(baseUrl + '/caseCenter/caseRecoveredList', 'post', {
  'data|3-10': [
    {
      'orgName|+1': ['杭州根号网络科技有限公司', '江西正众企业管理有限公司', '广州律控信用管理有限公司'],
      'remark|+1': ['备注1', '备注2', '备注3'],
      'recoverNum|1-10000': 5001,
      'recoverNumber|1-10000': 5001,
      'recoverAmount|1-1000000.1-2': 1001586.5,
      'beginTimeStr|+1': ['2023-04-27 11:14:50', '2023-04-27 10:49:48'],
      'finishTimeStr|+1': ['2023-04-27 11:14:50', '2023-04-27 10:09:15'],
      'operaName|+1': ['魏征', '尉迟恭', '秦叔宝'],
      'operaTimeStr|+1': ['子时二刻', '亥时三刻', '卯时四刻', '寅时一刻', '丑时三刻'],
      'recoverStateStr|1': '已完成',
      'failData|+1': ['http://www.baidu.com', '']
    }
  ],
  page: 1,
  pageSize: 10,
  total: 100
})

Mocks.mock(baseUrl + '/caseCenter/caseRecoveredInfo', 'get', {
  'data|1-5': [
    {
      'productName|+1': ['水象分期', '速秒钱包', '咿呀咿呀'],
      'recoverNum|1-10000': 5001,
      'recoverNumber|1-10000': 5001,
      'recoverAmount|1-1000000.1-2': 1001586.5,
      'case|+1': ['不收回', '收回']
    }
  ]
})
