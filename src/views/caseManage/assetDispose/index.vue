<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive">
      <el-tab-pane v-if="authStore.tabVisible('ASSET_DISPOSE_PRODUCT_LIST')" label="产品名录" name="ASSET_DISPOSE_PRODUCT_LIST">
        <ProductDirectory :selectData="selectData" />
      </el-tab-pane>
      <el-tab-pane v-if="authStore.tabVisible('ASSET_DISPOSE_STORAGE_BATCH')" label="入库批次" name="ASSET_DISPOSE_STORAGE_BATCH">
        <ReceiptBatch :selectData="selectData" />
      </el-tab-pane>
      <el-tab-pane v-if="authStore.tabVisible('ASSET_DISPOSE_CREDITOR')" label="债权方" name="ASSET_DISPOSE_CREDITOR">
        <CreditorList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import ProductDirectory from './ProductDirectory/index.vue'
import ReceiptBatch from './ReceiptBatch/index.vue'
import CreditorList from './CreditorList/index.vue'
import Apis from '@/api/modules/caseManage'
import { useGlobalStore } from '@/store/index'
import { useAuthStore } from '@/store/modules/auth'
const authStore = useAuthStore()
const tabActive = ref(authStore.tabPage.tabActive || '')
const globalStore = useGlobalStore()
const tenantInfo = computed(() => globalStore.tenantInfo)
const selectData = reactive({
  productAndCreList: [], //产品列表
  creditorList: [], //债权方列表
  packageList: [] //资产包类型
})
onMounted(() => {
  getSelecData()
})
const getSelecData = async () => {
  const { data: data1 } = await Apis.productList({ isProxy: 0, productStatus: 1 })
  selectData.productAndCreList = data1
  const { data: data2 } = await Apis.dictCreditorList()
  selectData.creditorList = data2
  selectData.creditorList.push({
    itemId: tenantInfo.value.tenantId,
    itemText: tenantInfo.value.tenantName
  })
  const { data: data3 } = await Apis.packagetypeList({ packageTypeStatus: 1 })
  selectData.packageList = data3
  // selectData.packageList = [
  //   {
  //     packageTypeId: 1,
  //     packageTypeName: '资产包1',
  //     packageTypeStatus: 1
  //   },
  //   {
  //     packageTypeId: 2,
  //     packageTypeName: '资产包2',
  //     packageTypeStatus: 1
  //   },
  //   {
  //     packageTypeId: 3,
  //     packageTypeName: '资产包3',
  //     packageTypeStatus: 1
  //   }
  // ]
}
</script>

<style lang="scss" scoped>
</style>
