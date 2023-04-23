<template>
  <div class="card-wrap">
    <el-tabs class="mb20" v-model="tabActive" @tab-click="tabClick">
      <el-tab-pane label="待审批" name="1"></el-tab-pane>
      <el-tab-pane label="已拒绝/已撤销" name="2"></el-tab-pane>
      <el-tab-pane label="待结清" name="3"></el-tab-pane>
      <el-tab-pane label="已生效" name="4"></el-tab-pane>
      <el-tab-pane label="已失效" name="5"></el-tab-pane>
    </el-tabs>
    <FormWrap>
      <template #default>
        <el-form :model="searchForm" inline>
          <el-form-item label="产品">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="证件号">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
          <el-form-item label="处置机构">
            <el-select v-model="searchForm.name" placeholder="请选择处置机构">
              <el-option label="权益类1" value="1"></el-option>
              <el-option label="权益类2" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="searchForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <div class="mt20">
      <OperationBar v-model:active="operation">
        <template #default>
          <el-button type="primary" :icon="Finished">直接开通租户</el-button>
          <el-button type="primary" :icon="Finished">邀请租户入驻</el-button>
        </template>
      </OperationBar>
      <el-table :data="tableData">
        <el-table-column label="租户ID" prop="name"></el-table-column>
        <el-table-column label="租户企业名" prop="name"></el-table-column>
        <el-table-column label="企业认证状态" prop="name"></el-table-column>
        <el-table-column label="租户开通时间" prop="name"></el-table-column>
        <el-table-column label="主管理员" prop="name"></el-table-column>
        <el-table-column label="注册手机号" prop="name"></el-table-column>
        <el-table-column label="注册时间" prop="name"></el-table-column>
        <el-table-column label="对接邮箱" prop="name"></el-table-column>
        <el-table-column label="租户类型" prop="name"></el-table-column>
        <el-table-column label="服务权益配置" prop="name"></el-table-column>
        <el-table-column label="租户账号数" prop="name"></el-table-column>
        <el-table-column label="合作中处置机构" prop="name"></el-table-column>
        <el-table-column label="操作" prop="name"></el-table-column>
      </el-table>
      <pagination :total="total" v-model:page="page" v-model:page-size="pageSize" @pagination="getTableData" />
    </div>
  </div>
</template>

<script setup>
import { Finished } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'

const tabActive = ref('1')
const searchForm = reactive({
  name: '',
  date: []
})
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const data = Array(10).fill({ name: '东岸科技' })
const tableData = ref(data)
const operation = ref(1)
const tabClick = () => {
  console.log(tabActive.value)
}
const getTableData = () => {

}
</script>

<style lang="scss" scoped></style>
