<script setup>
import { toRefs, reactive } from 'vue'

const props = defineProps({
  tagVisible: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number,
    default: 1
  },
  sysAlertTagList: {
    type: Array,
    default: () => []
  },
  customAlertTagList: {
    type: Array,
    default: () => []
  },
  historyData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:tagVisible', 'tagAlertLogList'])

const { sysAlertTagList, customAlertTagList, historyData, tagVisible, type } = toRefs(props)

const state = reactive({
  pageTotal: 0,
  page: 1,
  pageSize: 10
})

defineExpose({
  setPage: val => {
    state.page = val
  },
  setPageSize: val => {
    state.pageSize = val
  },
  setPageTotal: val => {
    state.pageTotal = val
  }
})

const tableColumnList = [
  { label: '标记时间', prop: 'createTime' },
  { label: '处置机构', prop: 'orgTitle', width: 250 },
  { label: 'cpe', prop: 'createName', width: 250 },
  { label: '标记标签', prop: 'tagAlertName', width: 250 }
]

const tagAlertLogList = (page, pageSize) => {
  emit('tagAlertLogList', page, pageSize)
}

const close = () => {
  emit('update:tagVisible', false)
}
</script>

<template>
  <el-dialog :model-value="tagVisible" title="预警标签" @close="close">
    <template v-if="type === 1">
      <p>预警标签选项：</p>
      <el-table :border="true" :data="sysAlertTagList">
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column property="tagAlertName" align="center" label="预警标签"></el-table-column>
        <el-table-column property="markCount" align="center" label="标记次数"></el-table-column>
        <el-table-column property="isShare" align="center" label="机构共享">
          <template #default="{ row }">
            <el-checkbox v-model="row.isShare" :checked="!!row.isShare"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <p>自定义预警标签：</p>
      <el-table :border="true" :data="customAlertTagList">
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column property="tagAlertName" align="center" label="预警标签"></el-table-column>
        <el-table-column property="markCount" align="center" label="标记次数"></el-table-column>
        <el-table-column property="isShare" align="center" label="机构共享">
          <template #default="{ row }">
            <el-checkbox v-model="row.isShare" :checked="!!row.isShare" @change="handleChange(row)"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <TableClass
        :table-data="historyData"
        :column-list="tableColumnList"
        :stripe="true"
        :total="state.pageTotal"
        :page="state.page"
        :page-size="state.pageSize"
        @query="tagAlertLogList"
      />
    </template>
    <template v-if="type === 1" #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="clickOk">确 定</el-button>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss"></style>
