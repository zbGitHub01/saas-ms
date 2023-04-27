<template>
  <div class="pt16 pl20 pr20 pb20" style="height: 100%; overflow-y: auto">
    <el-button type="primary" size="small" @click="addReason" :icon="Plus" class="mb16">退出原因</el-button>
    <el-table :data="tableData">
      <el-table-column label="退出原因" prop="name" min-width="150" align="center"></el-table-column>
      <el-table-column label="操作" min-width="110" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="addReason(scope.row)">编辑</el-button>
          <el-button type="danger" link @click="deleteReason(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <exit-reason-dialog ref="exitReasonDialogRef" @get-table-data="getConfigList"></exit-reason-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useConfirm } from '@/hooks/useConfirm'
import exitReasonDialog from './exitReasonDialog.vue'
import Apis from '@/api/modules/cooperativeOrganization'
const props = defineProps<{
  categoryId: string
}>()
const tableData = ref<any[]>([])
const exitReasonDialogRef = ref()
const addReason = (item?: any) => {
  exitReasonDialogRef.value.open(props.categoryId, item)
}
const deleteReason = async (id: number) => {
  await useConfirm('删除', Apis.configDelete, { id })
  getConfigList()
}
// 获取机构退出原因配置
// type 0:审批失效设置 1:准入更新配置 2:拒绝原因和准入周期设置 3:合规评分卡配置 4:机构退出原因配置 5:机构类型标准 6:判定标签
const getConfigList = async () => {
  let param = {
    optionId: props.categoryId,
    type: 4
  }
  const { code, data } = await Apis.configList(param)
  if (code !== 200) return
  tableData.value = data
}
defineExpose({
  getConfigList
})
</script>

<style scoped lang="scss"></style>
