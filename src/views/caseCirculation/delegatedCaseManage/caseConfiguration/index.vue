<template>
  <div class="flx-justify-between configuration">
    <div class="left">
      <div class="flx-justify-between">
        <div>委案类型</div>
        <el-button type="primary" plain icon="Plus" @click="addOrEditCase(undefined, 1)">添加委案类型</el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="state.tableDataCase" border>
        <el-table-column label="是否启用" prop="status" align="center" min-width="85">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="changeStatusCase(scope.row)"
              :disabled="scope.row.operateStatus === 1"
            />
          </template>
        </el-table-column>
        <el-table-column label="委案类型" prop="itemText" align="center" min-width="240"></el-table-column>
        <el-table-column label="案件等级" prop="caseLevelText" align="center" min-width="150"></el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="addOrEditCase(scope.row, 2)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddOrEditCaseDialog ref="addOrEditCaseDialog" @getTableData="getTableDataCase" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import AddOrEditCaseDialog from './components/AddOrEditCaseDialog.vue'
const addOrEditCaseDialog = ref()
const state = reactive({
  tableDataCase: [] as any[]
})
onMounted(() => {
  getTableDataCase()
})
const getTableDataCase = async () => {
  console.log('委案')
  // 请求得到数据
  // const { data } = await xx(params)
  const tableDataSub = [
    {
      itemId: 1,
      itemText: '默认', //委案类型
      itemValue: '{"caseLevel": ["A", "B", "C", "D", "E", "其他"]}', //委案等级
      status: false, //是否启用
      operateStatus: 1
    },
    {
      itemId: 101,
      itemText: '敏感案件-大额（2022年10月）', //委案类型
      itemValue: '{"caseLevel": ["A", "B", "C", "D", "E", "其他"]}', //委案等级
      status: true, //是否启用
      operateStatus: 0
    }
  ]
  state.tableDataCase = tableDataSub.map(item => {
    return {
      ...item,
      caseLevelText: JSON.parse(item.itemValue).caseLevel.join('/')
    }
  })
  console.log(state.tableDataCase)
}
// 新增/编辑委案类型
const addOrEditCase = (row: any, type: Number) => {
  addOrEditCaseDialog.value.open(row, type)
}
// 编辑是否启用委案类型
const changeStatusCase = (row: any) => {
  const params = row
  console.log(row)
  // 请求
  // await xx(params)
  // getTableDataCase()
}
</script>

<style lang="scss" scoped>
.configuration {
  height: 100%;
  align-items: flex-start;
}
.left,
.right {
  height: 100%;
  width: 49.5%;
  box-sizing: border-box;
  padding: 20px;
  overflow-x: hidden;
  background-color: var(--el-fill-color-blank);
  border-radius: 4px;
  box-shadow: 0 0 12px rgb(0 0 0 / 5%);
}
:deep(.el-divider--horizontal) {
  margin: 8px 0 15px 0;
}
</style>
