<template>
  <div>
    <attention />
    <outcase :selectData="selectData" />
  </div>
</template>
  
<script setup>
import { reactive, onMounted } from 'vue'
import attention from './components/attention.vue'
import outcase from './components/outcase.vue'
const selectData = reactive({
  batchList: [], //入库批次
  creditorList: [], //债权方
  productList: [], //产品
  downData: {} //下载模版
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
  // 请求得到下载模版地址
  // const { data } = await xx()
  selectData.downData = {
    caseTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/案件导入模板.xlsx', //导入案件，更新覆盖案件
    addressTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/地址导入模板.xlsx',
    contactTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/联系人导入模板.xlsx',
    tagTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/临时标签导入模板.xlsx', //导入临时标签
    wordTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/评语导入模板.xlsx',
    refund4JXTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/捷信还款账户导入模板.xlsx',
    customEntrustTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/指定委案导入模板.xlsx',
    customAllotTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/指定分案导入模板.xlsx',
    caseNoticeTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/债转通知模板.xlsx',
    customFieldTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/案件自定义字段导入模板.xlsx',
    specialRelationTemplateUrl: 'https://asfile.donganzichan.cn/assets/tmpl/特殊关联人模板.xlsx',
    caseLawsuitStatusTagUrl: 'https://asfile.donganzichan.cn/assets/tmpl/案件法诉状态标签模板.xlsx'
  }
}
// 获取下拉
const getSelecData = async () => {
  // 请求得到数据
  let params = {
    codes: 'IVR_TAG,ROBOT_TAG,PRODUCT_LIST,BATCH_LIST,CREDITOR_LIST'
  }
  // const { data } = await xx(params)
  //selectData.batchLis = data.BATCH_LIST;
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
  // selectData.creditorList = data.CREDITOR_LIST;
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
  // selectData.productList = data.PRODUCT_LIST;
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
  