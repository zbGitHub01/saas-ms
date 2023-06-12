<template>
  <div>
    <OperationBar>
      <template #default>
        <el-button type="primary" icon="Plus" @click="addOrEdit(undefined, 1)">新增</el-button>
      </template>
    </OperationBar>
    <div class="mt20">
      <el-table :data="state.tableData" border>
        <el-table-column label="公司ID" prop="creditorId" align="center" min-width="100"></el-table-column>
        <el-table-column label="公司名称" prop="creditorName" align="center" min-width="150"></el-table-column>
        <el-table-column label="是否启用" prop="creditorStatus" align="center" min-width="150">
          <template #default="scope">
            <el-checkbox v-model="scope.row.creditorStatus" @change="changeCheckbox(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="addOrEdit(scope.row, 2)">编辑</el-button>
            <el-button link type="danger" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="state.total" v-model:page="query.page" v-model:page-size="query.pageSize" @pagination="getTableData" />
    </div>
    <AddOrEditDialog ref="addOrEditDialog" @getTableData="getTableData" />
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue'
import AddOrEditDialog from './components/AddOrEditDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import Apis, { creditorDel } from '@/api/modules/caseManage'
// 页码
const query = reactive({
  page: 1,
  pageSize: 10
})
const state = reactive({
  tableData: [],
  total: 0
})
const addOrEditDialog = ref()
onMounted(() => {
  getTableData()
})
const getTableData = async () => {
  console.log('债权方')
  const { data } = await Apis.creditorPage({ ...query })
  state.tableData = data.data
  // state.tableData = [
  //   {
  //     creditorId: 1,
  //     creditorName: '“360”借条',
  //     zhaiquanfangId: 1,
  //     creditorStatus: 1,
  //     code: 'code',
  //     picture1: '//asfile.donganzichan.cn/a24b5577dc284f32b35e6babdfef7aac.jpeg',
  //     picture2: '//asfile.donganzichan.cn/a24b5577dc284f32b35e6babdfef7aac.jpeg',
  //     picture3: '//asfile.donganzichan.cn/a24b5577dc284f32b35e6babdfef7aac.jpeg',
  //     picture4: '//asfile.donganzichan.cn/a24b5577dc284f32b35e6babdfef7aac.jpeg',
  //     picture5: '//asfile.donganzichan.cn/a24b5577dc284f32b35e6babdfef7aac.jpeg',
  //     address: '齐贤镇曙光村',
  //     addressSub: [636, 1188, 1218],
  //     people: '李思',
  //     caseId: '330621111111111111',
  //     phone: '11111111111'
  //   },
  //   {
  //     creditorId: 2,
  //     creditorName: '我来带',
  //     zhaiquanfangId: 2,
  //     creditorStatus: 0
  //   }
  // ]
  state.tableData.forEach(item => {
    item.creditorStatus = !!item.creditorStatus
  })
  state.total = data.total
}

// 新增/编辑
const addOrEdit = (row, type) => {
  addOrEditDialog.value.open(row, type)
}

// 删除
const toDelete = row => {
  ElMessageBox.confirm('是否确认删除该债权方?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    async() => {
      await creditorDel(row.creditorId)
      ElMessage.success('删除成功！')
      getTableData()
    },
    res => {
      ElMessage.info('已取消')
      console.log(res)
    }
  )
}
// 是否启用
const changeCheckbox = row => {
  console.log(row.creditorStatus)
  // 请求
  // await xx(form)
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>