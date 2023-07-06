<template>
  <div>
    <attention />
    <outcase :selectData="selectData" />
  </div>
</template>
  
<script setup>
import { reactive, onMounted, computed } from 'vue'
import attention from './components/attention.vue'
import outcase from './components/outcase.vue'
import Apis from '@/api/modules/caseManage'
import { useGlobalStore } from '@/store/index'
const globalStore = useGlobalStore()
const tenantInfo = computed(() => globalStore.tenantInfo)
const selectData = reactive({
  batchList: [], //入库批次
  creditorList: [], //债权方
  productAndCreList: [], //产品
  downData: {} //下载模版
})
onMounted(() => {
  importExcelPath()
  getSelecData()
})
// 获取下载模版
const importExcelPath = async () => {
  const { data } = await Apis.importExcelPath()
  selectData.downData = data
}
// 获取下拉
const getSelecData = async () => {
  const { data } = await Apis.batchList()
  selectData.batchList = data
  const { data: data2 } = await Apis.dictCreditorList()
  data2.forEach(item => {
    item.importCaseType = 2 //1为非自身租户
  })
  selectData.creditorList = data2
  selectData.creditorList.push({
    itemId: tenantInfo.value.tenantId,
    itemText: tenantInfo.value.tenantName,
    importCaseType: 1 //2为自身租户
  })
  const { data: data3 } = await Apis.productList({ productStatus: 1 })
  selectData.productAndCreList = data3
}
</script>
  
<style lang="scss" scoped>
</style>
  