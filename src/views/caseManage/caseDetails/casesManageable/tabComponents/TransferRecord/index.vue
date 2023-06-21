<script setup>
import { reactive } from 'vue'
import Api from '@/api/modules/casesManageable'
import useCaseStore from '@/store/modules/caseInfo.js'

const caseInfoStore = useCaseStore()

const state = reactive({
  orgData: [],
  cpeData: [],
  expands: [],
  expands1: [],
  getRowKeys1(row) {
    return row.id
  },
  getRowKeys(row) {
    return row.id
  }
})
//查看详情
const handleEdit = async (item, expandedRows) => {
  if (expandedRows.length) {
    state.expands = []
    if (item) {
      state.expands.push(item.id)
    }
  } else {
    state.expands = []
  }
  let newParams = {
    caseId: caseInfoStore?.caseId,
    searchLogType: 1,
    parentId: item.id
  }
  getTransferRecordList(newParams)
}
//二次查看详情
const handleLastEdit = (item, expandedRows) => {
  if (expandedRows.length) {
    state.expands1 = []
    if (item) {
      state.expands1.push(item.id)
    }
  } else {
    state.expands1 = []
  }
  let newParams = {
    caseId: caseInfoStore?.caseId,
    searchLogType: 2,
    parentId: item.id
  }
  getTransferRecordList(newParams)
}

const getTransferRecordList = async params => {
  try {
    const {
      data: { data }
    } = await Api.getTransferLogList(params)
    state.orgData = data
  } catch (error) {
    console.log(error)
  }
}

let params = {
  caseId: caseInfoStore?.caseId,
  searchLogType: 0
}
getTransferRecordList(params)
</script>

<template>
  <div>
    <el-table
      :border="false"
      :data="state.subTreasuryData"
      :header-cell-style="{ background: '#F8F9FB' }"
      :row-style="{ height: 48 + 'px' }"
      :cell-style="{ padding: 0 + 'px' }"
      :show-header="false"
      :row-key="state.getRowKeys"
      :expand-row-keys="state.expands"
      stripe
      @expand-change="handleEdit"
    >
      <el-table-column align="center" type="expand">
        <template #default="">
          <el-table
            :header-cell-style="{ background: '#F8F9FB' }"
            :row-style="{ height: 48 + 'px' }"
            :cell-style="{ padding: 0 + 'px' }"
            :show-header="false"
            :data="state.orgData"
            :row-key="state.getRowKeys1"
            :expand-row-keys="state.expands1"
            stripe
            @expand-change="handleLastEdit"
          >
            <el-table-column align="center" type="expand">
              <template #default="">
                <el-table
                  :header-cell-style="{ background: '#F8F9FB' }"
                  :row-style="{ height: 48 + 'px' }"
                  :cell-style="{ padding: 0 + 'px' }"
                  :show-header="false"
                  :data="state.cpeData"
                  stripe
                >
                  <el-table-column property="startTime" align="center" label="开始时间"></el-table-column>
                  <el-table-column property="endTime" align="center" label="结束时间">
                    <template #default="scope">
                      <span>{{ scope.row.endTime === null ? '—' : scope.row.endTime }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column property="relateName" align="center" label="CPE"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column property="startTime" align="center" label="开始时间"></el-table-column>
            <el-table-column property="endTime" label="结束时间" align="center">
              <template #default="scope">
                <span>{{ scope.row.endTime === null ? '—' : scope.row.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column property="relateName" align="center" label="处置机构"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column property="startTime" label="开始时间" align="center"></el-table-column>
      <el-table-column property="endTime" label="结束时间" align="center">
        <template #default="scope">
          <span>{{ scope.row.endTime === null ? '—' : scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column property="relateName" label="所属分库" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<style scoped lang="scss"></style>
