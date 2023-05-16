export default [
  {
    type: 'select',
    label: '案件分库',
    prop: 'case',
    options: []
  },
  {
    type: 'radio',
    label: '操作维度',
    prop: 'opera',
    radioList: []
  },
  {
    type: 'pairSelect',
    label: '目标机构',
    prop: 'categoryCompany',
    childItem: [
      {
        type: 'select',
        prop: 'categoryCompany',
        options: [
          {
            label: '哇哈哈',
            value: 1
          },
          {
            label: '哇哈哈',
            value: 2
          }
        ]
      },
      {
        type: 'select',
        prop: 'aimCompany',
        options: []
      }
    ]
  },
  {
    type: 'select',
    label: '委案类型',
    prop: 'caseType',
    options: [
      {
        label: '默认',
        value: 1
      }
    ]
  },
  {
    type: 'radio',
    label: '历史处置记录',
    prop: 'history',
    radioList: [
      {
        label: '隐藏'
      },
      { label: '不隐藏' }
    ]
  },
  {
    type: 'date',
    label: '委案到期日',
    prop: 'date'
  },
  {
    type: 'radio',
    label: '是否自动收回',
    prop: 'isAuto',
    radioList: [
      {
        label: '不自动收回'
      },
      { label: '自动收回' }
    ]
  },
  {
    type: 'textarea',
    label: '委案备注',
    prop: 'notes'
  },
  {
    type: 'datetime',
    label: '执行时间',
    prop: 'executeTime'
  },
  {
    type: 'checkbox',
    label: '多选测试',
    prop: 'checkTest',
    checkList: [
      {
        label: '八宝粥',
        value: '1'
      },
      {
        label: '银耳汤',
        value: '2'
      }
    ]
  },
  {
    type: 'upload',
    label: '上传委案文件',
    prop: 'fileList',
    limit: 1,
    uploadTips: 'jpg/png files with a size less than 500KB.',
    action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15'
  }
]
