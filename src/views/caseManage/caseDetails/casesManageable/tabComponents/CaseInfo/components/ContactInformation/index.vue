<script setup>
import { reactive } from 'vue'
import { ordinaryColumnList, specialColumnList } from './config/tableColumnList.js'

const state = reactive({
  tableData: [
    {
      name: 'xxxx',
      relation: 'xx',
      typeText: '贷款',
      statusText: 'ddd',
      phone: '250250250',
      lastCallResult: 'ccc',
      createName: '111',
      createTime: ''
    },
    {
      name: '白菜',
      relation: 'xxx',
      typeText: '贷款',
      statusText: 'xxx',
      phone: '250250250',
      lastCallResult: 'ccc',
      createName: '111',
      createTime: ''
    },
    {
      name: '洗衣机',
      relation: 'xxx',
      typeText: '贷款',
      statusText: 'xxx',
      phone: '250250250',
      lastCallResult: 'aaa',
      createName: '111',
      createTime: ''
    }
  ]
})
</script>

<template>
  <div>
    <!--普通-->
    <TableClass
      ref="ordinaryTable"
      :table-data="state.tableData"
      :column-list="ordinaryColumnList"
      :pagination="false"
      :stripe="true"
    >
      <template #operation>
        <el-table-column align="center" label="操作" width="200">
          <template #default="scope">
            <!-- v-if="scope.row.createId === userId" -->
            <el-button type="danger" size="small" link @click="handleDel(scope.$index, row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </TableClass>
    <div class="special">特殊联系人</div>
    <!--特殊联系人-->
    <TableClass
      ref="specialTable"
      :table-data="state.tableData"
      :column-list="specialColumnList"
      :pagination="false"
      :stripe="true"
    ></TableClass>
  </div>
</template>
<style scoped lang="scss">
.special {
  margin-top: 25px;
}
</style>
