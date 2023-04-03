<template>
  <div>
    <attention />
    <outcase :selectData="selectData" />
  </div>
</template>
  
  <script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import attention from './components/attention.vue'
import outcase from './components/outcase.vue'
const selectData = reactive({
  batchList: [] as any[], //入库批次
  creditorList: [] as any[], //债权方
  productList: [] as any[], //产品
  downData: {} as any //下载模版
})
onMounted(() => {
  importExcelPath()
  getSelecData()
})
// watch: {
//   $route: {
//     handler: function(route) {
//       this.redirect = route.query && route.query.redirect
//     },
//     immediate: true
//   }
// }
// 获取下载模版
const importExcelPath = async () => {
  // 请求得到数据
  // const { code, data, msg } = await xx(params)
  // if(code !== 200){
  //   return ElMessage.error(msg)
  // }
  const downDataSub = {
    caseTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/案件导入模板.xlsx', //导入案件，更新覆盖案件
    tagTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/临时标签导入模板.xlsx' //导入临时标签
  }
  selectData.downData = downDataSub
}
// 获取下拉
const getSelecData = async () => {
  // 请求得到数据
  // const { code, data, msg } = await xx(form)
  // if(code !== 200){
  //   return ElMessage.error(msg)
  // }
  selectData.batchList = [
    {
      itemId: 2,
      itemText: '万腾浩达资产-手机贷20190326'
    },
    {
      itemId: 36,
      itemText: '万腾浩达资产-我来贷20190911'
    }
  ]
  selectData.creditorList = [
    {
      itemId: 1,
      itemText: '广西广投资产管理股份有限公司'
    },
    {
      itemId: 2,
      itemText: '马上贷债权方'
    }
  ]
  selectData.productList = [
    {
      itemId: 1,
      itemText: '“360”借条'
    },
    {
      itemId: 62,
      itemText: '易借速贷'
    }
  ]
}
</script>
  
  <style lang="scss" scoped>
</style>
  