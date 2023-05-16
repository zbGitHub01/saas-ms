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

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import ProductDirectory from './ProductDirectory/index.vue'
import ReceiptBatch from './ReceiptBatch/index.vue'
import CreditorList from './CreditorList/index.vue'
const selectData = reactive({
  productList: [] as any[], //产品列表
  orgList: [] as any[], //机构列表
  packageList: [] as any[] //资产包类型
})
const tabActive = ref('1')
onMounted(() => {
  getSelecData()
})
const getSelecData = async () => {
  // 请求得到数据
  // const { data } = await xx(params)
  selectData.productList = [
    {
      id: 1,
      text: '小花袋'
    },
    {
      id: 2,
      text: '“360”借条'
    },
    {
      id: 3,
      text: '中腾信'
    },
    {
      id: 4,
      text: '万达袋'
    }
  ]
  selectData.orgList = [
    {
      itemId: 1,
      itemText: '小丽水海树信用管理有限公司花袋'
    },
    {
      itemId: 2,
      itemText: '浙江东岸科技有限公司'
    }
  ]
  selectData.packageList = [
    {
      itemId: 1,
      itemText: '资产包1'
    },
    {
      itemId: 2,
      itemText: '资产包2'
    },
    {
      itemId: 3,
      itemText: '资产包3'
    }
  ]
}
</script>

<style lang="scss" scoped>
</style>
