<template>
  <div class="two-page-wrap pt12 pl12 pb12 pr12">
    <el-table
      ref="multipleTable"
      :data="state.tableData"
      row-key="id"
      class="two-custom-table"
      :default-expand-all="false"
      :tree-props="{ children: 'sysFieldDetails' }"
    >
      <el-table-column prop="fieldName" align="left" label="字段">
        <template #default="scope">
          <span class="table-field">{{ scope.row.fieldName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isOpen" align="center" label="是否展示">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isOpen"
            class="table-isopen"
            :active-value="1"
            :inactive-value="0"
            @change="changeIsOpen(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="isSure" align="center" label="是否必填">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isSure"
            class="table-issure"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.isOpen === 0"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" style="margin: 20px 0 0" @click="onSave">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import { ElMessage } from 'element-plus'
const props = defineProps<{
  categoryId: string
}>()
const state = reactive({
  tableData: []
})
// 保存
const onSave = async () => {
  const temChildren = Array.from(state.tableData, ({ sysFieldDetails }) => sysFieldDetails)
  const temData = [].concat(...temChildren)
  let params = []
  temData.forEach((item: any) => {
    const temItem = {
      id: item.id,
      isOpen: item.isOpen,
      isSure: item.isSure,
      optionId: Number(props.categoryId)
    }
    params.push(temItem)
  })
  // TODO：参数确定
  const { code } = awaitApis.configFiledUpdate(params)
  if (code !== 200) return
  ElMessage.success('保存成功')
  getConfigList()
}
// 不展示时不必填
const changeIsOpen = (row: any) => {
  row.isOpen === 0 && (row.isSure = 0)
  state.tableData = JSON.parse(JSON.stringify(state.tableData))
}
// 准入资料列表
const getConfigList = async () => {
  let param = {
    optionId: props.categoryId
  }
  const { code, data } = await Apis.configFieldList(param)
  if (code !== 200) return
  data.forEach((item: any, index: number) => {
    item.fieldName = item.typeName
    item.id = item.typeName + index
  })
  state.tableData = data
}
defineExpose({
  getConfigList
})
</script>

<style scoped lang="scss">
.two-page-wrap {
  height: 100%;
  overflow-y: auto;
}
::v-deep .two-custom-table.el-table {
  .el-table__row--level-0 {
    .table-field {
      font-weight: bold;
    }
    .table-isopen,
    .table-issure {
      display: none;
    }
  }
}
</style>
