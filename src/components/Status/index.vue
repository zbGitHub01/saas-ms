<template>
  <span>
    <el-button style="color: #4d7cfe" type="primary" link @click="goDetail">{{ row.caseNo }}</el-button>
  </span>
  <span v-if="row.retainId && row.retainId !== 0">
    <el-tooltip class="item" effect="dark" :content="`留案至${row.retainEndTime}`" placement="top-start">
      <span class="item">留</span>
    </el-tooltip>
  </span>
  <span v-if="row.pauseCaseType && row.pauseCaseType.length !== 0">
    <el-tooltip
      class="item"
      effect="dark"
      :content="row.pauseCaseType[0].pauseType === 2 ? '永久停催' : `停催至${row.pauseCaseType[0].expire}`"
      placement="top-start"
    >
      <span class="item item2">停</span>
    </el-tooltip>
  </span>
  <span v-if="showTag(row.prosecuteStatus)">
    <el-tooltip class="item" effect="dark" :content="`诉讼状态：${row.prosecuteStatusText}`" placement="right">
      <span class="item item2" :class="[map.prosecuteClass]">诉</span>
    </el-tooltip>
  </span>
  <span v-if="hasdata(row.certUrl)" class="item item3" @click="handleClick(row)">清</span>
  <span v-if="showTag(row.arbitrationStatus)">
    <el-tooltip
      class="item"
      effect="dark"
      :content="`仲裁状态：${['未立案', '已立案'][row.arbitrationStatus]}`"
      placement="top-start"
    >
      <span class="item" :class="[map.arbitrationClass]">仲</span>
    </el-tooltip>
  </span>
  <span v-if="showTag(row.preservationStatus)">
    <el-tooltip
      class="item"
      effect="dark"
      :content="`保全状态：${['未保全', '已保全'][row.preservationStatus]}`"
      placement="top-start"
    >
      <span class="item" :class="[map.preservationClass]">保</span>
    </el-tooltip>
  </span>
  <span v-if="row.execStatus === 1">
    <el-tooltip class="item" effect="dark" :content="`执行状态：已执行`" placement="top-start">
      <span class="item" :class="[map.execClass]">执</span>
    </el-tooltip>
  </span>
  <span v-if="isStagingPlan(row.stagingPlan)">
    <el-tooltip effect="dark" :content="`分期还款计划状态：${stagingPlan()}`" placement="top-start">
      <span class="icon-wrap"><svg-icon style="width: 22px; height: 22px" :icon-class="map.iconType"></svg-icon></span>
    </el-tooltip>
  </span>
  <span v-if="pageType === 'disposalCasemessage' || pageType === 'outsourcingCasemessage'">
    <span v-if="row.mediateStatus && row.mediateStatus !== null">
      <el-tooltip class="item" effect="dark" :content="mediateContentText(row)" placement="top-start">
        <span class="item" :class="row.mediateStatus == 13 && 'item1'">调</span>
      </el-tooltip>
    </span>
  </span>
</template>
    
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const statusMap = Object.freeze(
  new Map([
    [2, { name: '生效中' }],
    [3, { name: '逾期中' }],
    [5, { name: '已失效' }],
    [6, { name: '履约完成' }]
  ])
)
const router = useRouter()
const props = defineProps({
  row: {
    type: Object,
    default: () => ({})
  },
  pageType: {
    type: String,
    default: ''
  }
})
const map = reactive({
  iconType: 'effect',
  arbitrationClass: 'blue-bg',
  preservationClass: 'blue-bg',
  prosecuteClass: 'blue-bg',
  execClass: 'blue-bg'
})
// const iconType = ref('effect')
// const arbitrationClass = ref('blue-bg')
// const preservationClass = ref('blue-bg')
// const prosecuteClass = ref('blue-bg')
// const execClass = ref('blue-bg')
onMounted(() => {
  calcWorkOrderTimeStyle()
})
// 法诉工单标签新增颜色表示更新时间
const calcWorkOrderTimeStyle = () => {
  calcStyleClass('arbitrationTime')
  calcStyleClass('preservationTime')
  calcStyleClass('prosecuteTime')
  calcStyleClass('execTime')
}
const calcStyleClass = key => {
  const timeClassMap = {
    arbitrationTime: 'arbitrationClass',
    preservationTime: 'preservationClass',
    prosecuteTime: 'prosecuteClass',
    execTime: 'execClass'
  }
  const classMap = {
    1: 'red-bg',
    2: 'yellow-bg',
    3: 'blue-bg'
  }
  if (!props.row[key]) return
  const currentDate = dayjs(new Date())
  const start = dayjs(props.row[key])
  const weeksDiff = currentDate.diff(start, 'week') + 1
  const classMapKey = weeksDiff > 3 ? 3 : weeksDiff
  const classKey = timeClassMap[key]
  map[classKey] = classMap[classMapKey]
}
// 点击案件编号，跳转案件详情
const goDetail = () => {
  if (!props.row.caseId) return
  router.push({
    name: 'casesManageable',
    query: { caseNo: props.row.caseNo, caseId: props.row.caseId }
  })
}
//查看结清证明
const handleClick = item => {
  let url = item.certUrl
  window.open(url)
}
//提示
const handleSee = () => {
  ElMessage.warning('不可查看异常状态案件!!!')
}
const showTag = tag => {
  if (!tag && tag !== 0) {
    return false
  } else {
    return true
  }
}
const isStagingPlan = stagingPlan => {
  if (!stagingPlan) return false
  const { planStatus } = stagingPlan
  const statusList = [2, 3, 5, 6]
  if (planStatus === 2 || planStatus === 3) map.iconType = 'effect'
  if (planStatus === 5) map.iconType = 'failure'
  if (planStatus === 6) map.iconType = 'completePerform'
  return statusList.includes(planStatus)
}
const stagingPlan = () => {
  if (!props.row.stagingPlan) return
  return statusMap.get(props.row.stagingPlan.planStatus).name
}
const mediateContentText = computed(val => {
  return val => {
    const { mediateStatus, mediateStatusText } = val
    if (mediateStatus == 13) return mediateStatusText
    return `当前调解状态：${mediateStatusText}`
  }
})
const hasdata = data => {
  if (data === '' || data === null || data === undefined) {
    return false
  } else {
    return true
  }
}
</script>
    
<style lang="scss" scoped>
.blue-bg {
  background-color: #09f;
}
.red-bg {
  background-color: #eb0016;
}
.yellow-bg {
  background-color: #d1b42f;
}
.icon-wrap {
  vertical-align: middle;
  margin-left: 5px;
}
</style>