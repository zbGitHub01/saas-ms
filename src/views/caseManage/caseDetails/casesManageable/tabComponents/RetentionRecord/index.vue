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

const getRetainRecord = async (page, pageSize) => {
  try {
    const params = {
      caseUserId: caseInfoStore?.caseId,
      page: page ? page : state.page,
      pageSize: pageSize ? pageSize : state.pageSize
    }
    const { data } = await Api.getRetainList(params)
    state.tableData = data.data
    state.pageTotal = data.total
    state.page = data.page
    state.pageSize = data.pageSize
  } catch (error) {
    console.log(error)
  }
}

getRetainRecord()
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
      @query="getRetainRecord"
    ></TableClass>
  </div>
</template>
<style scoped lang="scss"></style>
