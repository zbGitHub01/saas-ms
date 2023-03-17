import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/util'

const systemRouter: Array<RouteRecordRaw> = [
  {
    path: '/systemSetting',
    name: 'systemSetting',
    component: Layout,
    meta: {
      title: '系统设置'
    },
    children: [
      {
        path: '/systemSetting/employee',
        name: 'employee',
        meta: { title: '员工管理', icon: 'UserFilled' },
        children: [
          {
            path: '/systemSetting/employee/info',
            name: 'employeeInfo',
            component: () => import('@/views/systemSetting/business/businessInfo/index.vue'),
            meta: { title: '员工信息', icon: 'Menu' }
          },
          {
            path: '/systemSetting/employee/department',
            name: 'department',
            component: () => import('@/views/systemSetting/business/departmentSetting/index.vue'),
            meta: { title: '部门设置', keepAlive: true, icon: 'Menu' }
          },
        ]
      },
      
    //   {
    //     path: '/systemSetting/employee/personal',
    //     name: 'personalInfo',
    //     component: () => import('@/views/systemSetting/employee/personal/index.vue'),
    //     meta: {
    //       title: '个人中心',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/employee/department',
    //     name: 'employeDepartment',
    //     component: () => import('@/views/systemSetting/employee/department/index.vue'),
    //     meta: {
    //       title: '部门设置',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/employee/role',
    //     name: 'employeRole',
    //     component: () => import('@/views/systemSetting/employee/role/index.vue'),
    //     meta: {
    //       title: '角色权限',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/employee/group',
    //     name: 'employeGroup',
    //     component: () => import('@/views/systemSetting/employee/group/index.vue'),
    //     meta: {
    //       title: '自定义分组',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/taskMsg/taskSetting',
    //     name: 'taskSetting',
    //     component: () => import('@/views/systemSetting/taskMsg/task/index.vue'),
    //     meta: {
    //       title: '任务设置',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/taskMsg/processSetting',
    //     name: 'taskProcess',
    //     component: () => import('@/views/systemSetting/taskMsg/process/index.vue'),
    //     meta: {
    //       title: '流程配置',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/taskMsg/messageSetting',
    //     name: 'messageSetting',
    //     component: () => import('@/views/systemSetting/taskMsg/message/index.vue'),
    //     meta: {
    //       title: '消息设置',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/business/productBatch',
    //     name: 'productBatch',
    //     component: () => import('@/views/systemSetting/business/productBatch/index.vue'),
    //     meta: {
    //       title: '入库产品/批次',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/business/assetType',
    //     name: 'assetType',
    //     component: () => import('@/views/systemSetting/business/assetType/index.vue'),
    //     meta: {
    //       title: '资产类型',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/business/packageBuyer',
    //     name: 'packageBuyer',
    //     component: () => import('@/views/systemSetting/business/packageBuyer/index.vue'),
    //     meta: {
    //       title: '购包主体',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/business/dataField',
    //     name: 'dataField',
    //     component: () => import('@/views/systemSetting/business/dataField/index.vue'),
    //     meta: {
    //       title: '数据字段',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/business/dataList',
    //     name: 'dataList',
    //     component: () => import('@/views/systemSetting/business/dataList/index.vue'),
    //     meta: {
    //       title: '资料清单',
    //       keepAlive: true
    //     }
    //   },
    //   {
    //     path: '/systemSetting/business/transactionStructure',
    //     name: 'transactionStructure',
    //     component: () => import('@/views/systemSetting/business/transactionStructure/index.vue'),
    //     meta: {
    //       title: '交易架构',
    //       keepAlive: true
    //     }
    //   }
    ]
  }
]

export default systemRouter
