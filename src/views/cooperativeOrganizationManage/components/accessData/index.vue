<template>
  <div style="height: 100%">
    <el-tabs v-model="tabActive" class="mb12" @tab-click="onTab">
      <el-tab-pane
        v-for="item in tabPaneData"
        :key="item.type"
        :label="item.typeName"
        :name="String(item.type)"
      ></el-tab-pane>
    </el-tabs>
    <div v-if="tabActive === '2'" id="tabbar-history" style="height: calc(100% - 40px)">
      <el-radio-group v-model="userTabActive" @change="onUserTab">
        <el-radio-button
          v-for="(userItem, userIndex) in userTabPaneData"
          :key="userIndex"
          size="small"
          :label="userItem.field"
        >{{ userItem.fieldName }}</el-radio-button>
      </el-radio-group>
      <div :id="props.accessId" style="height: calc(100% - 50px); overflow-y: auto">
        <div
          v-for="infoItem in userTabPaneData"
          :id="`${props.accessId}${infoItem.field}`"
          :key="infoItem.field"
          class="mt20"
        >
          <div style="font-weight: bold">{{ infoItem.fieldName }}</div>
          <detail-content
            :tab-active="tabActive"
            :info-data="infoItem.info"
            :detail-data="detailData"
            :hit-list="hitList"
            :job-name="infoItem.field"
          ></detail-content>
        </div>
      </div>
    </div>
    <div v-else style="height: calc(100% - 50px); overflow-y: auto">
      <detail-content
        :tab-active="tabActive"
        :info-data="itemInfo"
        :detail-data="detailData"
        :hit-list="hitList"
      ></detail-content>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'
import detailContent from './detailContent.vue'
const listBoxStateHis = ref(true) // 点击导航栏时，暂时停止监听页面滚动
const tabPaneData = ref([
  {
    sysFieldDetails: [
      {
        field: 'company_profile',
        fieldName: '公司介绍',
        id: 1,
        isOpen: 1,
        isSure: 1
      },
      {
        field: 'business_time',
        fieldName: '处置业务运营开始时间',
        id: 2,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'business_license',
        fieldName: '营业执照',
        id: 3,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'ip_address',
        fieldName: '固定IP地址',
        id: 4,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'org_chart',
        fieldName: '组织架构图',
        id: 5,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'main_job_responsibilities',
        fieldName: '主要岗位职责',
        id: 6,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'company_people',
        fieldName: '公司人数',
        id: 7,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'company_culture',
        fieldName: '公司文化',
        id: 8,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'social_credit_code',
        fieldName: '统一社会信用代码',
        id: 33,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'access_certificate',
        fieldName: '入网证明',
        id: 34,
        isOpen: 1,
        isSure: 0
      }
    ],
    type: 1,
    typeName: '公司概况'
  },
  {
    sysFieldDetails: [
      {
        field: 'legal_person',
        fieldName: '法定代表人',
        id: 9,
        isOpen: 1,
        isSure: 1
      },
      {
        field: 'control_person',
        fieldName: '企业实际控制人',
        id: 10,
        isOpen: 1,
        isSure: 1
      },
      {
        field: 'charge_person',
        fieldName: '企业经营负责人',
        id: 11,
        isOpen: 1,
        isSure: 1
      },
      {
        field: 'business_person',
        fieldName: '专职负责承接我司业务运营负责人',
        id: 12,
        isOpen: 1,
        isSure: 1
      }
    ],
    type: 2,
    typeName: '主要人员信息'
  },
  {
    sysFieldDetails: [
      {
        field: 'address',
        fieldName: '办公地点',
        id: 13,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'environment_url',
        fieldName: '场地环境照片',
        id: 14,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'contract_url',
        fieldName: '办公场地租赁合同',
        id: 15,
        isOpen: 1,
        isSure: 0
      }
    ],
    type: 3,
    typeName: '办公地点'
  },
  {
    sysFieldDetails: [
      {
        field: 'org_product_json',
        fieldName: '合作机构和产品',
        id: 16,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'cooperation_url',
        fieldName: '合作证明',
        id: 17,
        isOpen: 1,
        isSure: 0
      }
    ],
    type: 4,
    typeName: '公司合作情况及业绩排名'
  },
  {
    sysFieldDetails: [
      {
        field: 'hardware',
        fieldName: '公司硬件设施',
        id: 18,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'software',
        fieldName: '公司软件技术',
        id: 19,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'monitorInfo',
        fieldName: '安防监控配备情况',
        id: 35,
        isOpen: 1,
        isSure: 1
      }
    ],
    type: 5,
    typeName: '公司设备设施'
  },
  {
    sysFieldDetails: [
      {
        field: 'system_url',
        fieldName: '招聘制度',
        id: 20,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'register_url',
        fieldName: '公司花名册',
        id: 21,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'training',
        fieldName: '培训制度',
        id: 22,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'check',
        fieldName: '内部稽核制度',
        id: 23,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'complaint',
        fieldName: '投诉处理制度',
        id: 24,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'security',
        fieldName: '信息安全保密机制',
        id: 25,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'emergency',
        fieldName: '突发事件应急预案和机制',
        id: 26,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'phone_manage',
        fieldName: '手机管理制度',
        id: 27,
        isOpen: 1,
        isSure: 0
      }
    ],
    type: 6,
    typeName: '公司管理制度'
  },
  {
    sysFieldDetails: [
      {
        field: 'operation_disposal_process',
        fieldName: '作业处置流程',
        id: 28,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'complaint_handling_process',
        fieldName: '投诉案件处置流程',
        id: 29,
        isOpen: 1,
        isSure: 0
      }
    ],
    type: 7,
    typeName: '工作流程'
  },
  {
    sysFieldDetails: [
      {
        field: 'account',
        fieldName: '对公账户',
        id: 30,
        isOpen: 1,
        isSure: 0
      },
      {
        field: 'tax',
        fieldName: '开票信息',
        id: 31,
        isOpen: 1,
        isSure: 0
      }
    ],
    type: 8,
    typeName: '财务相关信息'
  },
  {
    sysFieldDetails: [
      {
        field: 'advantage',
        fieldName: '公司优势',
        id: 32,
        isOpen: 1,
        isSure: 0
      }
    ],
    type: 9,
    typeName: '其他信息'
  }
])
const tabActive = ref('1')
const userTabPaneData = ref([])
const userTabActive = ref('')
const detailData = ref({})
const hitList = ref([])
const itemInfo = ref({})
const detailJsonMapData = ref({})
// 接收props数据
const props = defineProps({
  scrollTop: {
    type: Number,
    default: 0
  },
  accessId: {
    type: String,
    default: ''
  },
  accessDetail: {
    type: Object,
    default: () => {}
  }
})
// 点击导航菜单，页面滚动到指定位置
const onUserTab = () => {
  listBoxStateHis.value = false
  const temId = `${props.accessId}${userTabActive.value}`
  const offsetTop = document.getElementById(temId).offsetTop - props.scrollTop
  document.getElementById(props.accessId).scrollTo({
    top: offsetTop,
    behavior: 'smooth' // 平滑滚动
  })

  let timeId = null
  clearTimeout(timeId)
  timeId = setTimeout(() => {
    listBoxStateHis.value = true
  }, 3000)
}
// 监听页面元素滚动，改变导航栏选中
const scrollChange = () => {
  // 获取导航条高度
  const navOffsetHeight = document.getElementById('tabbar-history')?.offsetHeight ?? 0
  // dom滚动位置
  const scrollTop = document.getElementById(props.accessId)?.scrollTop ?? 0

  if (listBoxStateHis.value) {
    // 作用是点击导航栏时，延迟这里执行。
    userTabPaneData.value.map(item => {
      const temId = `${props.accessId}${item.field}`
      // 获取监听元素距离视窗顶部距离
      const offsetTop = document.getElementById(temId)?.offsetTop ?? 0
      // 获取监听元素本身高度
      const scrollHeight = document.getElementById(temId)?.scrollHeight ?? 0

      // 如果 dom滚动位置 >= 元素距离视窗距离 && dom滚动位置 <= 元素距离视窗距离+元素本身高度
      // 则表示页面已经滚动到可视区了。
      if (scrollTop >= offsetTop - navOffsetHeight && scrollTop <= offsetTop + scrollHeight + 20) {
        // 导航栏背景色选中
        userTabActive.value = item.field
      }
    })
  }
}
// 字段详情
const sysFieldList = async () => {
  userTabPaneData.value = tabPaneData.value.filter(item => item.type === 2)[0].sysFieldDetails
  userTabActive.value = userTabPaneData.value[0].field
}
const onTab = e => {
  tabActive.value = e.props.name
  tabActive.value !== '2' && (itemInfo.value = detailJsonMapData.value[tabActive.value])
}
const handleData = (info, list) => {
  detailData.value = info
  hitList.value = list
  tabActive.value = '1'
  sysFieldList()
  let temData = JSON.parse(JSON.stringify(info))
  temData.jsonMap = temData.jsonMap ? eval('(' + temData.jsonMap + ')') : {}
  for (let i = 1; i < 10; i++) {
    temData.jsonMap[i] = i === 2 ? temData.jsonMap[i] || '[]' : temData.jsonMap[i] || {}
  }
  temData.jsonMap[1] = handleBusinessLicense(temData.jsonMap[1])
  temData.jsonMap[2] = handleJobInfo(temData.jsonMap[2])
  temData.jsonMap[5] = handleMonitorInfo(temData.jsonMap[5])

  detailJsonMapData.value = JSON.parse(JSON.stringify(temData.jsonMap))
  itemInfo.value = detailJsonMapData.value[tabActive.value]
}
// 处理营业执照信息
const handleBusinessLicense = data => {
  const temBusinessLicense = data?.businessLicense ? JSON.parse(JSON.stringify(data.businessLicense)) : []
  let temInfo = []
  if (Array.isArray(temBusinessLicense)) {
    temInfo = temBusinessLicense
  } else {
    if (temBusinessLicense[0] === '[') {
      temInfo = eval('(' + temBusinessLicense + ')')
    } else {
      temInfo = [{ url: temBusinessLicense }]
    }
  }
  return {
    ...data,
    businessLicense: temInfo
  }
}
// 处理主要人员信息数据
const handleJobInfo = data => {
  const jobData = JSON.parse(data)
  userTabPaneData.value.forEach((item, index) => {
    item.info = jobData.length > 0 ? jobData[index] : []
  })
  return jobData
}
// 处理监控设备信息
const handleMonitorInfo = data => {
  const temInfo = data.monitorInfo ? eval('(' + data.monitorInfo + ')') : {}
  let temMonitorInfo = {}
  if (JSON.stringify(temInfo === '{}')) {
    temMonitorInfo = {
      entranceMonitor: 0,
      workMonitor: 0,
      equipmentMonitor: 0,
      allDayMonitor: 0,
      keepTime: 0,
      monitorRemark: ''
    }
  } else {
    const { entranceMonitor, workMonitor, equipmentMonitor, allDayMonitor, keepTime, monitorRemark } = temInfo
    temMonitorInfo = {
      entranceMonitor,
      workMonitor,
      equipmentMonitor,
      allDayMonitor,
      keepTime,
      monitorRemark
    }
  }
  return {
    ...data,
    ...temMonitorInfo
  }
}
onMounted(async () => {})
defineExpose({
  handleData
})
onUpdated(() => {
  if (tabActive.value === '2') {
    // 获取指定元素
    const scrollview = document.getElementById(props.accessId)
    // 添加滚动监听，该滚动监听了拖拽滚动条
    scrollview.addEventListener('scroll', scrollChange, true)
  }
})
onUnmounted(() => {
  if (tabActive.value === '2') {
    // 获取指定元素
    const scrollview = document.getElementById(props.accessId)
    // 移除监听
    scrollview && scrollview.removeEventListener('scroll', scrollChange, true)
  }
})
</script>

<style lang="scss" scoped></style>
