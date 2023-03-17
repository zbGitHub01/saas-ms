import Layout from '@/layout'

const caseAcceptRouter = [
  {
    path: '/caseAcceptManage',
    component: Layout,
    redirect: '',
    name: 'caseAcceptManage',
    meta: { title: '案件受理和缴费', icon: 'case-accept-icon' },
    children: [
      {
        path: '/caseAcceptManage/caseAccept',
        name: 'CaseAccept',
        component: () => import('@/views/caseAcceptManage/caseAccept/index'),
        meta: { title: '待受理案件', icon: 'el-icon-menu' }
      },
      {
        path: '/caseAcceptManage/payCostManage',
        name: 'PayCostManage',
        component: () => import('@/views/caseAcceptManage/payCostManage/index'),
        meta: { title: '缴费管理', icon: 'el-icon-menu' }
      }
    ]
  }
]
export default caseAcceptRouter
