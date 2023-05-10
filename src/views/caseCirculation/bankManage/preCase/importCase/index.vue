<script setup>
import { reactive, computed } from 'vue'
import queryList from './config/queryList.js'
import tableColumnList from './config/tableColumnList.js'

const state = reactive({
  tableData: [],
  pageTotal: 4,
  queryNewData: {},
  dialogVisible: false,
  monthList: []
})

const getOrderListAgain = (pageSize, pageNum) => {
  const pageInfo = {
    ...state.queryNewData,
    pageNum,
    pageSize
  }
  console.log(pageInfo)
  // getOrderList(pageInfo).then(res => {
  //   state.tableData = res.data.records
  //   state.pageTotal = res.data.total
  // })
}

state.monthList = Array(20).fill({ label: '2021-01', name: Math.floor(Math.random(0, 1) * 10) })

getOrderListAgain()

//formClass实例

// const total = ref(0)
// const page = ref(1)
// const pageSize = ref(10)
// state.tableData = Array(10).fill({ orderNo: 'test' })
state.tableData = [
  { orderNo: 'test', isEnable: false, isOpen: true },
  { orderNo: '111', isEnable: true, isOpen: false },
  { orderNo: 'te222st', isEnable: true, isOpen: true },
  { orderNo: 't3333est', isEnable: false, isOpen: true }
]

//api获取
// const queryList = computed(() => {
//   const apiList = [
//     {
//       code: 'PRODUCT_LIST',
//       data: [],
//       isShow: 0,
//       key: 'caseId',
//       title: '案件ID',
//       type: 'input'
//     },
//     {
//       code: 'PRODUCT_LIST',
//       data: [],
//       isShow: 1,
//       key: 'product',
//       title: '产品',
//       type: 'select'
//     },
//     {
//       code: 'PRODUCT_LIST',
//       data: [],
//       isShow: 1,
//       key: 'date',
//       title: '日期',
//       type: 'daterange'
//     },
//     {
//       code: 'PRODUCT_LIST',
//       data: [],
//       isShow: 1,
//       key: 'area',
//       title: '区域',
//       type: 'area-select'
//     }
//   ]
//   apiList.forEach(item => {
//     item['property'] = item.key
//     item['name'] = item.title
//     delete item['key']
//     delete item['title']
//   })
//   return apiList
// })
// console.log(queryList)

const handleChange = row => {
  console.log(row)
}
</script>

<template>
  <div class="card-wrap">
    <FormWrap style="margin-top: 20px" @search="handleSearch" @reset="handleReset">
      <template #default>
        <FormClass ref="formClass" :fields="queryList" label-width="102px" />
      </template>
    </FormWrap>
    <div>
      <OperationBar>
        <template #default>
          <el-button type="primary" icon="CirclePlusFilled" @click="handleClick">批量发布方案</el-button>
          <el-button type="primary" icon="CircleCloseFilled" @click="handleClick">删除委案方案</el-button>
        </template>
        <template #tool>
          <el-button type="primary" icon="CirclePlusFilled" @click="handleClick">上传委案文件</el-button>
          <el-button type="primary" icon="UploadFilled" @click="handleClick">下载导入模板</el-button>
        </template>
      </OperationBar>
      <TableClass :table-data="state.tableData" :column-list="tableColumnList" :is-selection="true" @change-status="handleChange">
        <template #operation>
          <el-table-column align="center" fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" size="small" link @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button type="primary" size="small" link @click="handleEdit(scope.$index, scope.row)">查看机构设置</el-button>
            </template>
          </el-table-column>
        </template>
      </TableClass>
    </div>
  </div>
</template>

<style scoped lang="scss">
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
:deep(.el-button > span) {
  display: inline-block;
  margin-top: 2px;
}
:deep(.el-input__wrapper) {
  height: 32px;
}
</style>
