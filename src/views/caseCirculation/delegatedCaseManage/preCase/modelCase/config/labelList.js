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
    labelTitle: '还款清算记录数',
    isHaveRmbSign: false,
    value: null
  },
  {
    customizeIcon: 'peoplenum',
    eplusIcon: '',
    labelTitle: '挂单记录数',
    isHaveRmbSign: false,
    value: null
  },
  {
    customizeIcon: 'moneynum',
    eplusIcon: '',
    labelTitle: '其他损益记录数',
    isHaveRmbSign: false,
    value: null
  },
  {
    customizeIcon: 'backmoney',
    eplusIcon: '',
    labelTitle: '收入金额',
    isHaveRmbSign: true,
    value: null
  }
  // {
  //   customizeIcon: 'moneing',
  //   eplusIcon: '',
  //   labelTitle: '支出金额',
  //   isHaveRmbSign: true,
  //   value: null
  // }
]
