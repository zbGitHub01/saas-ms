<template>
  <div class="outcase-container">
    <div
      v-for="(item, index) in inputdateShow"
      :key="item.type"
      class="message-warp"
      :style="{ 'margin-right': (index + 1) % 4 === 0 ? '' : '1.3%' }"
    >
      <div class="flx-justify-between head">
        <h4>
          {{ item.title }}
        </h4>
        <div @click="importExcelPath(item.downloadUrlKey)" style="cursor: pointer">
          <el-icon color="#3178ff">
            <Download />
          </el-icon>
        </div>
      </div>
      <div class="input_case">
        <div v-if="item.tipsList" class="message-title">
          <div v-for="(text, index) in item.tipsList" :key="index">{{ text }}</div>
        </div>
      </div>
      <div>
        <el-button style="background: #4d7cfe; font-size: 14px" type="primary" @click="inputClicks(item)">
          {{ item.btn }}
        </el-button>
      </div>
    </div>
    <NewCaseDialog ref="newCaseDialog" :selectData="props.selectData" />
    <CommonDialog ref="commonDialog" />
    <LegalDialog ref="legalDialog" />
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
// import { useGlobalStore } from '@/store'
import NewCaseDialog from './NewCaseDialog.vue'
import CommonDialog from './CommonDialog.vue'
import LegalDialog from './LegalDialog.vue'
// const globalState = useGlobalStore()
// const tokens = reactive({
//   Authorization: globalState.token
// })
// 接收props数据
const props = defineProps({
  selectData: {
    type: Object,
    default: () => ({})
  }
})
const newCaseDialog = ref()
const commonDialog = ref()
const legalDialog = ref()
const inputdata = reactive([
  {
    title: '新案入库',
    btn: '导入案件',
    type: 101,
    // select: true, //弹窗内容是否展示其他选项
    downloadUrlKey: 'caseTemplateUrl',
    show: true
    // show: this.hasPerm("base_import_case"),
  },
  {
    title: '更新覆盖案件信息',
    btn: '更新覆盖案件',
    type: 102,
    // select: false,
    downloadUrlKey: 'caseTemplateUrl',
    tipsList: ['1、案件更新模板同案件导入模板；', '2、导入文档必须保留“案件ID”字段；'],
    show: true
    // show: this.hasPerm("base_import_update"),
  },
  {
    title: '导入案件评语',
    btn: '导入评语',
    type: 103,
    // select: false,
    downloadUrlKey: 'wordTemplateUrl',
    show: true
    // show: this.hasPerm('base_import_word'),
  },
  // {
  //   title: '导入案件联系人',
  //   btn: '导入联系人',
  //   type: 104,
  //   select: false,
  //   downloadUrlKey: 'contactTemplateUrl',
  //   show: true
  //   // show: this.hasPerm('base_import_contact'),
  // },
  // {
  //   title: '导入案件地址',
  //   btn: '导入地址',
  //   type: 105,
  //   select: false,
  //   downloadUrlKey: 'addressTemplateUrl',
  //   show: true
  //   // show: this.hasPerm('base_import_address'),
  // },
  {
    title: '导入临时标签',
    btn: '导入临时标签',
    type: 106,
    // select: false,
    downloadUrlKey: 'tagTemplateUrl',
    show: true
    // show: this.hasPerm("base_import_label"),
  },
  {
    title: '导入捷信还款账户',
    btn: '导入还款账户',
    type: 107,
    // select: false,
    downloadUrlKey: 'refund4JXTemplateUrl',
    show: true
    // show: this.hasPerm('base_import_account'),
  },
  {
    title: '导入债转通知记录',
    btn: '导入债转通知',
    type: 108,
    // select: false,
    downloadUrlKey: 'caseNoticeTemplateUrl',
    show: true
    // show: this.hasPerm('mng_case_data_base_import_irodtn'),
  },
  {
    title: '导入自定义字段',
    btn: '导入自定义字段',
    type: 109,
    // select: false,
    downloadUrlKey: 'customFieldTemplateUrl',
    tipsList: ['1、导入文档必须保留“案件ID”字段；', '2、模板表头自定义字段名称可修改；'],
    show: true
    // show: this.hasPerm('mng_case_data_base_import_custom'),
  },
  // {
  //   title: '导入车贷特殊关联人',
  //   btn: '导入关联人',
  //   type: 110,
  //   select: false,
  //   downloadUrlKey: 'specialRelationTemplateUrl',
  //   show: true
  //   // show: this.hasPerm('mng_case_data_base_import_rv'),
  // },
  {
    title: '导入法诉状态标签',
    btn: '导入标签',
    type: 111,
    // select: false,
    downloadUrlKey: 'caseLawsuitStatusTagUrl',
    show: true
    // show: this.hasPerm('mng_case_data_base_import_lst'),
  }
])
const inputdateShow = computed(() => {
  return inputdata.filter(item => {
    if (item.show) {
      return item
    }
  })
})

// watch: {
//   $route: {
//     handler: function (route) {
//       this.redirect = route.query && route.query.redirect;
//     },
//     immediate: true,
//   }

//下载模版
const importExcelPath = key => {
  download(props.selectData.downData[key])
}
const download = url => {
  let urls = url
  let a = document.createElement('a')
  a.href = urls
  a.download = '模板'
  a.click()
}

// 打开导出弹窗
const inputClicks = item => {
  if (item.type === 101) {
    // 新案入库的弹窗
    newCaseDialog.value.open()
    // } else if (item.type === 111) {
    // 法诉状态标签的弹窗
    // legalDialog.value.open(item.title)
  } else {
    commonDialog.value.open(item.type, item.title)
  }
}
</script>

<style lang="scss" scoped>
.outcase-container {
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  .message-warp {
    width: 24%;
    height: 164px;
    padding: 20px;
    margin-bottom: 20px;
    background: #ffffff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    position: relative;
    .head {
      height: 30px;
      font-size: 18px;
      font-weight: 400;
      color: #333;
    }
    .input_case {
      height: 55%;
      margin: 0 auto;
      display: flex;
      align-items: self-start;
      justify-content: center;
      flex-direction: column;
      .message-title {
        line-height: 1;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        div {
          margin-bottom: 10px;
        }
      }
      .download-banner {
        text-align: center;
        color: #3178ff;
        cursor: pointer;
      }
    }
    :deep(.el-button) {
      width: 130px;
    }
  }
}
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>
