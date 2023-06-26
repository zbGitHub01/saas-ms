<template>
  <div class="pt16 pl16 pr16 pb16 mr16 option-wrap">
    <div class="top pb16 mb16" style="width: 100%">
      <span class="title">{{ detail.title }}</span>
      <el-button
        v-if="detail.isForm"
        plain
        :icon="Plus"
        size="small"
        type="primary"
        @click="onFormDialog('add')"
      >添加{{ detail.name }}</el-button>
    </div>
    <el-table
      :data="data"
      class="custom-table"
      row-key="itemId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
    >
      <el-table-column prop="isOpen" align="center" label="是否启用">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isOpen"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in head"
        :key="index"
        :property="item.key"
        :width="item.width ? item.width : ''"
        :label="item.title"
        align="center"
      />
      <el-table-column label="操作" prop="name" align="center" width="120">
        <template #default="scope">
          <el-button type="primary" link @click="onFormDialog('edit', scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <form-dialog ref="formDialogRef" @update-select="updateSelect"></form-dialog>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import formDialog from './formDialog.vue'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/cooperativeOrganization'
const emits = defineEmits(['getSelectList'])
// 接收props数据
const props = defineProps({
  stateData: {
    type: Object,
    default: () => {}
  }
})
const { head, data, detail } = toRefs(props.stateData)
const formDialogRef = ref()
// 更改状态
const changeStatus = row => {
  const { id, name, isOpen, code } = row
  let params = {
    id,
    name,
    isOpen,
    code
  }
  updateSelect(params, '修改成功')
}
// 添加-更新下拉选项
const updateSelect = async (params, msg) => {
  const { code } = await Apis.optionSave(params)
  if (code !== 200) return
  ElMessage.success(msg)
  emits('getSelectList')
}
// 新增/编辑
const onFormDialog = (type, row) => {
  formDialogRef.value.open(props.stateData, type, row)
}
</script>

<style scoped lang="scss">
.custom-table.el-table {
  max-height: calc(100% - 65px);
  overflow-y: auto;
}
.option-wrap {
  width: 100%;
  box-shadow: 10px 10px 10px 10px rgba(0, 0, 0, 0.04);
  .top {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #efefef;
  }
  .title {
    font-weight: bold;
  }
}
</style>
