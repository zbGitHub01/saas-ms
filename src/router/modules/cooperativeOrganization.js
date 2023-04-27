const cooperativeOrganizationRouter = [
  {
    path: '/cooperativeOrganizationManage',
    name: 'cooperativeOrganizationManage',
    component: () => import('@/layout/index.vue'),
    meta: { title: '合作机构管理' },
    children: [
      {
        path: '/cooperativeOrganizationManage/directory',
        name: 'directory',
        meta: { title: '合作机构名录', icon: 'UserFilled' },
        component: () => import('@/views/cooperativeOrganizationManage/directory/index.vue')
      },
      {
        path: '/cooperativeOrganizationManage/accessSetting',
        name: 'accessSetting',
        meta: { title: '合作机构准入设置', icon: 'UserFilled' },
        component: () => import('@/views/cooperativeOrganizationManage/accessSetting/index.vue')
      },
      {
        path: '/cooperativeOrganizationManage/allAccess',
        name: 'allAccess',
        meta: { title: '所有准入审批工单', icon: 'UserFilled' },
        component: () => import('@/views/cooperativeOrganizationManage/allAccess/index.vue')
      },
      {
        path: '/cooperativeOrganizationManage/accessApproval',
        name: 'accessApproval',
        meta: { title: '准入审批', icon: 'UserFilled' },
        component: () => import('@/views/cooperativeOrganizationManage/accessApproval/index.vue')
      },
      {
        path: '/cooperativeOrganizationManage/complianceApproval',
        name: 'complianceApproval',
        meta: { title: '准入合规审批', icon: 'UserFilled' },
        component: () => import('@/views/cooperativeOrganizationManage/complianceApproval/index.vue')
      },
      {
        path: '/cooperativeOrganizationManage/optionSetting',
        name: 'optionSetting',
        meta: { title: '机构选项设置', icon: 'UserFilled' },
        component: () => import('@/views/cooperativeOrganizationManage/optionSetting/index.vue')
      },
      {
        path: '/cooperativeOrganizationManage/inviteManage',
        name: 'inviteManage',
        meta: { title: '上游合作邀请管理', icon: 'UserFilled' },
        component: () => import('@/views/cooperativeOrganizationManage/inviteManage/index.vue')
      }
    ]
  }
]
export default cooperativeOrganizationRouter
