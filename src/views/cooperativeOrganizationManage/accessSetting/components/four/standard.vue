<template>
  <div class="two-wrap pt14">
    <!-- 机构类型标准 -->
    <div style="border-bottom: 12px solid #f0f2f5">
      <div class="title-wrap pb14 pl20 pr20" style="border-bottom: 1px solid #f0f2f5">处置经验判断标准</div>
      <div class="flx-align-center pt20 pl20 pr20 pb30">
        <div
          v-for="(orgItem, index) in orgTypeList"
          :key="`org${index}`"
          style="margin-right: 64px; font-size: 14px"
          class="list1-item"
        >
          <div>{{ orgItem.state === 0 ? '有经验处置机构定义：' : '新成立处置机构定义：' }}</div>
          <div class="pt20 pb5">
            <el-input v-model="orgTypeText" style="width: 170px" disabled></el-input>
            <span style="margin: 0 10px">{{ orgItem.state === 0 ? '≥' : '<' }}</span>
            <el-input-number
              v-model="orgItem.day"
              style="width: 80px"
              :min="0"
              :controls="false"
              placeholder="请输入"
            ></el-input-number>
            <span style="margin: 0 40px 0 10px">个月</span>
            <el-button type="primary" @click="onSave(orgItem)">保存</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 准入标准 -->
    <div>
      <div class="title-wrap pt14 pb14 pl20 pr20" style="border-bottom: 1px solid #f0f2f5">准入标准</div>
      <div class="flx-align-center pt20 pl20 pr20 pb30">
        <div
          v-for="(accessItem, index) in orgTypeList"
          :key="`access${index}`"
          class="list-item pt5 pb5"
          style="margin-right: 104px; font-size: 14px"
        >
          <div>{{ accessItem.state === 0 ? '有经验机构准入分：' : '新机构准入分：' }}</div>
          <span style="margin: 0 10px">≥</span>
          <el-input-number
            v-model="accessItem.score"
            style="width: 80px"
            :min="0"
            :controls="false"
            placeholder="请输入"
          ></el-input-number>
          <span style="margin: 0 40px 0 10px">分</span>
          <el-button type="primary" @click="onSave(accessItem)">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import { ElMessage } from 'element-plus'
const props = defineProps({
  optionIds: {
    type: String,
    default: ''
  }
})

const orgTypeList = ref([])
const orgTypeText = ref('业务运营处置累计时长')
// 保存
const onSave = async item => {
  const params = {
    type: 5,
    ...item,
    optionId: props.optionIds
  }
  params.json = JSON.stringify(params.json)
  let data
  if (item.id) {
    data = await Apis.configUpdate(params)
  } else {
    data = await Apis.configAdd(params)
  }
  if (data.code !== 200) return
  ElMessage.success('更新成功')
  getTableData()
}

// 获取判定标签
// type 0:审批失效设置 1:准入更新配置 2:拒绝原因和准入周期设置 3:合规评分卡配置 4:机构退出原因配置 5:机构类型标准 6:判定标签
const getTableData = async () => {
  let param = {
    optionId: props.optionIds,
    type: 5
  }
  const { code, data } = await Apis.configList(param)
  if (code !== 200) return
  if (data.length === 2) {
    orgTypeList.value = JSON.parse(JSON.stringify(data))
    return
  }
  if (data.length === 1) {
    const temItem = {
      state: data[0].state === 0 ? 1 : 0,
      day: '',
      score: ''
    }
    data[0].state === 0 ? data.unshift(temItem) : data.push(temItem)
    orgTypeList.value = JSON.parse(JSON.stringify(data))
    return
  }
  orgTypeList.value = [
    {
      state: 1,
      day: '',
      score: ''
    },
    {
      state: 0,
      day: '',
      score: ''
    }
  ]
}
defineExpose({
  getTableData
})
</script>

<style scoped lang="scss">
.two-wrap {
  width: 100%;
  border-bottom: 12px solid #f0f2f5;
  .title-wrap {
    font-size: 18px !important;
    font-weight: bold;
  }
  .list-item {
    display: flex;
    align-items: center;
  }
  .list-item:last-child,
  .list1-item:last-child {
    padding-left: 64px;
    border-left: 1px solid #f0f2f5;
  }
}
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
