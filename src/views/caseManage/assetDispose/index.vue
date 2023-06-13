<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive">
      <el-tab-pane label="产品名录" name="1">
        <ProductDirectory :selectData="selectData" />
      </el-tab-pane>
      <el-tab-pane label="入库批次" name="2">
        <ReceiptBatch :selectData="selectData" />
      </el-tab-pane>
      <el-tab-pane label="债权方" name="3">
        <CreditorList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import ProductDirectory from './ProductDirectory/index.vue'
import ReceiptBatch from './ReceiptBatch/index.vue'
import CreditorList from './CreditorList/index.vue'
import Apis from '@/api/modules/caseManage'
const selectData = reactive({
  productList: [], //产品列表
  orgList: [], //机构列表
  packageList: [] //资产包类型
})
const tabActive = ref('1')
onMounted(() => {
  getSelecData()
})
const getSelecData = async () => {
  // 请求得到数据
  // const { data } = await Apis.packagetypeList(params)
  const { data: data1 } = await Apis.productList({ isProxy: 0 }) //productStatus 1已启用 0不启用，没传
  selectData.productList = data1
  // selectData.productList = [
  //   {
  //     creditorId: 1,
  //     creditorName: '债权方1',
  //     productId: 1,
  //     productName: '产品1'
  //   },
  //   {
  //     creditorId: 2,
  //     creditorName: '债权方2',
  //     productId: 2,
  //     productName: '产品2'
  //   },
  //   {
  //     creditorId: 3,
  //     creditorName: '债权方3',
  //     productId: 3,
  //     productName: '产品3'
  //   },
  //   {
  //     creditorId: 4,
  //     creditorName: '债权方4',
  //     productId: 4,
  //     productName: '产品4'
  //   }
  // ]
  // selectData.productList = [
  //   {
  //     id: 1,
  //     text: '小花袋'
  //   },
  //   {
  //     id: 2,
  //     text: '“360”借条'
  //   },
  //   {
  //     id: 3,
  //     text: '中腾信'
  //   },
  //   {
  //     id: 4,
  //     text: '万达袋'
  //   }
  // ]
  selectData.orgList = [
    {
      id: 1,
      text: '小丽水海树信用管理有限公司花袋'
    },
    {
      id: 2,
      text: '浙江东岸科技有限公司'
    }
  ]
  const { data: data3 } = await Apis.packagetypeList() //packageTypeStatus 1已启用 0未启用
  selectData.packageList = data3
  selectData.packageList = [
    {
      packageTypeId: 1,
      packageTypeName: '资产包1',
      packageTypeStatus: 0
    },
    {
      packageTypeId: 2,
      packageTypeName: '资产包2',
      packageTypeStatus: 0
    },
    {
      packageTypeId: 3,
      packageTypeName: '资产包3',
      packageTypeStatus: 0
    }
  ]
}
</script>

<style lang="scss" scoped>
</style>
