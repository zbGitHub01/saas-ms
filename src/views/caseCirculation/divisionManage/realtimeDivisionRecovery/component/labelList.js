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
    eplusIcon: '',
    labelTitle: '选中案件数',
    isHaveRmbSign: false,
    property: 'caseNum',
    value: null
  },
  {
    customizeIcon: 'peoplenum',
    eplusIcon: '',
    labelTitle: '选中案件人数',
    isHaveRmbSign: false,
    property: 'personNum',
    value: null
  },
  {
    customizeIcon: 'moneynum',
    eplusIcon: '',
    labelTitle: '预计分库金额',
    isHaveRmbSign: false,
    property: 'totalAmount',
    value: null
  }
]
