<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive">
      <el-tab-pane label="可管理案件" name="1"></el-tab-pane>
      <el-tab-pane label="已委托案件" name="2"></el-tab-pane>
    </el-tabs>
    <ManageableCases v-if="tabActive === '1'" />
    <EntrustedCases v-if="tabActive === '2'" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import ManageableCases from './ManageableCases/index.vue'
import EntrustedCases from './EntrustedCases/index.vue'
const selectData = reactive({
  productList: [] as any[], //产品列表
  orgList: [] as any[], //机构列表
  packageList: [] as any[] //资产包类型
})
const tabActive = ref('1')
const getSelecData = async () => {
  // 请求得到数据
  // const { code, data, msg } = await xx(params)
  // if(code !== 200){
  //   return ElMessage.error(msg)
  // }
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
      id: 1,
      text: '小丽水海树信用管理有限公司花袋'
    },
    {
      id: 2,
      text: '浙江东岸科技有限公司'
    }
  ]
  selectData.packageList = [
    {
      id: 1,
      text: '资产包1'
    },
    {
      id: 2,
      text: '资产包2'
    },
    {
      id: 3,
      text: '资产包3'
    }
  ]
}
</script>

<style lang="scss" scoped>
</style>
