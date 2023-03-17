// 和api请求接口地址一直，主要用于除api以外的地方调用
export const BASE_URL =
  window.location.host === 'arbitrate.donganzichan.cn'
    ? 'https://arbitrate.donganzichan.cn/api'
    : 'https://test-arbitrate.donganzichan.cn/api'
// 请求接口成功状态码
export const ERR_OK = 200
// 缓存token key值名称
export const TOKEN = 'token'
// 路由子页白名单
export const whiteRoutes = new Map([
  ['/legalCaseManage/allBatches', ['/legalCaseManage/batchCase']]
  // ['/legalCaseManage', ['/legalCaseManage/caseDetail']]
])
// 灰色背景路由名称
export const GRAY_BG_ROUTE_NAME = ['Home', 'CaseDetail']

export const HOME_URL = '/home/index'

// * Tabs（黑名单地址，不需要添加到 tabs 的路由地址）
export const TABS_BLACK_LIST = ['/403', '/404', '/500', '/layout', '/login']
