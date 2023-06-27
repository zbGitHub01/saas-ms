/**
 * json配置约定：
 *      customizeIcon: 自定义图标名，
 *      eleIcon： element-plus内置图标
 *      isHaveRmbSign: 是否需要'￥'标识
 * 注意：两个icon只传一个
 */

export default [
  {
    customizeIcon: 'caselist',
    // eplusIcon: '',
    labelTitle: '案件数量',
    isHaveRmbSign: false,
    property: 'pageTotal',
    value: null
  },
  {
    customizeIcon: 'peoplenum',
    // eplusIcon: '',
    labelTitle: '案人人数',
    isHaveRmbSign: false,
    property: 'caseUserCount',
    value: null
  },
  {
    customizeIcon: 'moneynum',
    // eplusIcon: '',
    labelTitle: '委案金额',
    isHaveRmbSign: false,
    property: 'sumEntrustAmount',
    value: null
  },
  {
    customizeIcon: 'moneing',
    // eplusIcon: '',
    labelTitle: '待还金额',
    isHaveRmbSign: false,
    property: 'sumResidueAmount',
    value: null
  }
]
