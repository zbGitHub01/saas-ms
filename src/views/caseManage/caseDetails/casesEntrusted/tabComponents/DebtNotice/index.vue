<script setup>
import { reactive } from 'vue'
import useCaseStore from '@/store/modules/caseInfo.js'
import Api from '@/api/modules/casesManageable'
import tableColumn from './config/tableColumn.js'

const caseInfoStore = useCaseStore()

const state = reactive({
  tableData: [],
  total: 10,
  page: 1,
  pageSize: 10
})

const getDebtList = async (page, pageSize) => {
  try {
    const params = {
      caseId: caseInfoStore?.caseId,
      page: page ? page : state.page,
      pageSize: pageSize ? pageSize : state.pageSize
    }
    const { data } = await Api.getDebtNoticeList(params)
    state.tableData = data.data
    state.pageTotal = data.total
    state.page = data.page
    state.pageSize = data.pageSize
  } catch (error) {
    console.log(error)
  }
}

getDebtList()
</script>

<template>
  <div class="card-wrap">
    <TableClass
      :table-data="state.tableData"
      :is-order-number="true"
      :total="state.total"
      :page="state.page"
      :page-size="state.pageSize"
      :column-list="tableColumn"
      @query="getDebtList"
    ></TableClass>
  </div>
</template>
<style scoped lang="scss"></style>
