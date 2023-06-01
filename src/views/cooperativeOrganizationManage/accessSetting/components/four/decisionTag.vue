<template>
  <div class="three-wrap pt14">
    <div class="title-wrap pb14 pl20 pr20" style="border-bottom: 1px solid #f0f2f5;">判定标签</div>
    <div class="pl20 pr20">
      <el-button type="primary" @click="onFormDialog" :icon="Plus" class="mt16 mb16">添加标签</el-button>
      <el-table ref="multipleTable" :data="tableData" style="width: 601px" border>
        <el-table-column
          property="name"
          label="标签名称"
          width="400"
          :show-overflow-tooltip="true"
          align="center"
        />
        <el-table-column property="operate" label="操作" width="200" align="center">
          <template #default="scope">
            <el-button type="text" style="margin-right: 12px" @click="onFormDialog(scope.row)">编辑</el-button>
            <el-button type="primary" link @click="onDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <form-dialog ref="formDialogRef" @get-table-data="getTableData"></form-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import formDialog from './formDialog.vue'
import { Plus } from '@element-plus/icons-vue'
import Apis from '@/api/modules/cooperativeOrganization'
import { useConfirm } from '@/hooks/useConfirm'
const formDialogRef = ref()
const props = defineProps<{
  optionIds: string
}>()
const tableData = ref([])
// 删除标签
const onDelete = async (id: number) => {
  await useConfirm('删除', Apis.configDelete, { id })
  getTableData()
}
// 新增编辑
const onFormDialog = (row: any) => {
  formDialogRef.value.open(props.optionIds, row)
}
// 获取判定标签
// type 0:审批失效设置 1:准入更新配置 2:拒绝原因和准入周期设置 3:合规评分卡配置 4:机构退出原因配置 5:机构类型标准 6:判定标签
const getTableData = async () => {
  let param = {
    optionId: props.optionIds,
    type: 6
  }
  const { code, data } = await Apis.configList(param)
  if (code !== 200) return
  tableData.value = data
}
defineExpose({
  getTableData
})
</script>

<style scoped lang="scss">
.three-wrap {
  padding-bottom: 20px;
  .title-wrap {
    font-weight: bold;
    font-size: 18px;
  }
}
</style>
