<template>
  <div style="display: flex; height: 100%">
    <div style="width: 65%; height: 100%" class="pt16">
      <h4 class="pl16 pb16" style="border-bottom: 1px solid #efefef">拒绝原因和准入周期设置</h4>
      <div class="pt16 pl20 pr20 pb20" style="height: calc(100% - 40px); overflow-y: auto">
        <el-button type="primary" size="small" @click="addReason" :icon="Plus">拒绝原因</el-button>
        <div class="tip-text mt8 mb16">重新准入周期：拒绝后此天数内拒绝再次准入</div>
        <el-table :data="tableData">
          <el-table-column label="拒绝原因" prop="name" min-width="100" align="center"></el-table-column>
          <el-table-column label="重新准入周期" prop="day" min-width="100" align="center"></el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template #default="scope">
              <el-button type="primary" link @click="addReason(scope.row)">编辑</el-button>
              <el-button type="danger" link @click="deleteReason(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="width: 35%; border-left: 16px solid #efefef" class="pt16">
      <h4 class="pl16 pb16" style="border-bottom: 1px solid #efefef">准入更新提醒</h4>
      <div class="pt20 pl20">
        <div>
          <span class="mr8" style="vertical-align: middle">合作间断时长/天</span>
          <el-input v-model="breakTimeData.day" placeholder="请输入" style="width: 100px"></el-input>
        </div>
        <div class="tip-text mt12 mb20">如合作中的机构未持有案件超过 n 天即提示准入更新</div>
        <el-button type="primary" size="small" @click="onBreakTimeSave">保存</el-button>
      </div>
    </div>
    <reject-reason-dialog ref="rejectReasonDialogRef" @get-table-data="getTableData"></reject-reason-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useConfirm } from '@/hooks/useConfirm'
import rejectReasonDialog from './rejectReasonDialog.vue'
import Apis from '@/api/modules/cooperativeOrganization'
import { ElMessage } from 'element-plus'
const props = defineProps<{
  categoryId: string
}>()
const rejectReasonDialogRef = ref()
const addReason = (item: any) => {
  rejectReasonDialogRef.value.open(props.categoryId, item)
}
const tableData = ref<any[]>([])
const breakTimeData = reactive({
  day: null,
  id: null
})
const deleteReason = async (id: number) => {
  await useConfirm('删除', Apis.configDelete, { id })
  getTableData()
}
// 准入更新配置保存
const onBreakTimeSave = async () => {
  const params = {
    ...breakTimeData,
    optionId: props.categoryId,
    type: 1
  }
  let data
  if (params.id) {
    data = await Apis.configUpdate(params)
  } else {
    data = await Apis.configAdd(params)
  }
  if (data.code !== 200) return
  const msg = params.id ? '修改成功' : '新增成功'
  ElMessage.success(msg)
  getBreakTime()
}
// 获取拒绝原因和准入周期设置
// type 0:审批失效设置 1:准入更新配置 2:拒绝原因和准入周期设置 3:合规评分卡配置 4:机构退出原因配置 5:机构类型标准 6:判定标签
const getTableData = async () => {
  let param = {
    optionId: props.categoryId,
    type: 2
  }
  const { code, data } = await Apis.configList(param)
  if (code !== 200) return
  tableData.value = data
}
// 获取准入更新配置
const getBreakTime = async () => {
  let param = {
    optionId: props.categoryId,
    type: 1
  }
  const { code, data } = await Apis.configList(param)
  if (code !== 200) return
  breakTimeData.day = data.length > 0 ? data[0].day : ''
  breakTimeData.id = data.length > 0 ? data[0].id : ''
}
const getConfigList = () => {
  getTableData()
  getBreakTime()
}
defineExpose({
  getConfigList
})
</script>

<style scoped lang="scss">
.tip-text {
  font-size: 12px;
  color: #ff9921;
}
</style>
