<template>
  <div class="outcase-container">
    <div
      v-for="(item, index) in inputdata"
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
      <div class="btn">
        <el-button style="background: #4d7cfe; font-size: 14px" v-if="item.show" type="primary" @click="inputClicks(item)">
          {{ item.btn }}
        </el-button>
      </div>
    </div>
    <!-- 导出 -->
    <el-dialog
      :title="title"
      v-model="inputShow"
      :width="width"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :before-close="cancal"
    >
      <el-form ref="ruleFormRef" :model="Fdata" :rules="rules" v-if="select === true">
        <el-form-item label="产品:" :label-width="formLabelWidth" prop="productId">
          <el-select clearable v-model="Fdata.productId" filterable placeholder="请选择产品" style="width: 300px">
            <el-option
              v-for="item in selectData.productList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库批次:" :label-width="formLabelWidth" prop="batchId">
          <el-select clearable v-model="Fdata.batchId" filterable placeholder="请选择入库批次" style="width: 300px">
            <el-option
              v-for="item in selectData.batchList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="债权方:" :label-width="formLabelWidth" prop="creditorId">
          <el-select clearable v-model="Fdata.creditorId" filterable placeholder="请选择债权方" style="width: 300px">
            <el-option
              v-for="item in selectData.creditorList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- action再定，额外的参数data -->
        <el-form-item label="导入文件:" :label-width="formLabelWidth" prop="upload">
          <el-upload
            v-model="form.upload"
            ref="upload"
            action="/caseCenter/caseImport/import"
            accept=".xls,.xlsx"
            :limit="1"
            :headers="tokens"
            :data="Fdata"
            :auto-upload="false"
            :file-list="info.fileList"
            :on-success="successUpload"
          >
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div v-else>
        <div class="mr10 ml20" style="float: left">导入文件:</div>
        <el-upload
          v-model="form.file"
          ref="upload"
          action="/caseCenter/caseImport/import"
          accept=".xls,.xlsx"
          :limit="1"
          :headers="tokens"
          :data="info.Ddata"
          :auto-upload="false"
          :file-list="info.fileList"
          :on-success="successUpload"
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancal">取 消</el-button>
          <el-button type="primary" @click="handlerOk(ruleFormRef)">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useGlobalStore } from '@/store'
const globalState = useGlobalStore()
const tokens = reactive({
  Authorization: globalState.token
})
// 接收props数据
const props = defineProps<{
  selectData: {
    batchList: any[] //入库批次
    creditorList: any[] //债权方
    productList: any[] //产品
    downData: any //下载模版
  }
}>()
const upload = ref()
const inputdata = reactive([
  {
    title: '新案入库-特殊库',
    btn: '导入案件',
    type: 101,
    select: true, //弹窗内容是否展示其他选项
    downloadUrlKey: 'caseTemplateUrl',
    downloadBanner: '下载案件导入模板', //再处理
    show: true
    // show: this.hasPerm("base_import_case"),
  },
  {
    title: '更新覆盖案件信息',
    btn: '更新覆盖案件',
    type: 102,
    select: false,
    downloadUrlKey: 'caseTemplateUrl',
    tipsList: ['1、案件更新模板同案件导入模板；', '2、导入文档必须保留“案件ID”字段；'],
    show: true
    // show: this.hasPerm("base_import_update"),
  },
  // {
  //   title: '导入案件评语',
  //   btn: '导入评语',
  //   type: 103,
  //   select: false,
  //   downloadUrlKey: 'wordTemplateUrl',
  //   show: true
  //   // show: this.hasPerm('base_import_word'),
  // },
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
    btn: '导入临时标签', //再处理
    type: 106,
    select: false,
    downloadUrlKey: 'tagTemplateUrl',
    downloadBanner: '下载临时标签导入模板', //再处理
    show: true
    // show: this.hasPerm("base_import_label"),
  },
  // {
  //   title: '导入捷信还款账户',
  //   btn: '导入还款账户',
  //   type: 107,
  //   select: false,
  //   downloadUrlKey: 'refund4JXTemplateUrl',
  //   show: true
  //   // show: this.hasPerm('base_import_account'),
  // },
  // {
  //   title: '导入债转通知记录',
  //   btn: '导入债转通知',
  //   type: 108,
  //   select: false,
  //   downloadUrlKey: 'caseNoticeTemplateUrl',
  //   show: true
  //   // show: this.hasPerm('mng_case_data_base_import_irodtn'),
  // },
  // {
  //   title: '导入自定义字段',
  //   btn: '导入自定义字段',
  //   type: 109,
  //   select: false,
  //   downloadUrlKey: 'customFieldTemplateUrl',
  //   tipsList: ['1、导入文档必须保留“案件ID”字段；', '2、模板表头自定义字段名称可修改；'],
  //   show: true
  //   // show: this.hasPerm('mng_case_data_base_import_custom'),
  // },
  // {
  //   title: '导入车贷特殊关联人',
  //   btn: '导入关联人',
  //   type: 110,
  //   select: false,
  //   downloadUrlKey: 'specialRelationTemplateUrl',
  //   show: true
  //   // show: this.hasPerm('mng_case_data_base_import_rv'),
  // },
  // {
  //   title: '导入法诉状态标签',
  //   btn: '导入标签',
  //   type: 111,
  //   select: false,
  //   downloadUrlKey: 'caseLawsuitStatusTagUrl',
  //   show: true
  //   // show: this.hasPerm('mng_case_data_base_import_lst'),
  // }
])
const inputShow = ref(false)
const formLabelWidth = ref('100px')
const select = ref(false)
const title = ref('')
const width = ref('')
const info = reactive({
  fileList: [] as any,
  Ddata: {
    importFileType: null
  }
})
const Fdata = reactive({
  productId: null,
  batchId: null,
  creditorId: null,
  importFileType: 101 //写死了是新案入库的弹窗
})
const form = reactive({
  upload: '',
  file: ''
})
const originFormData = JSON.parse(JSON.stringify(form))
// 校验规则
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  productId: [{ required: true, trigger: 'change', message: '请选择产品' }],
  batchId: [{ required: true, trigger: 'change', message: '请选择入库批次' }],
  creditorId: [{ required: true, trigger: 'change', message: '请选择债权方' }]
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

// 打开导出弹窗，传输数据
const inputClicks = item => {
  title.value = item.title
  select.value = item.select
  width.value = select.value ? '500px' : '400px'
  info.Ddata = {
    importFileType: item.type
  }
  inputShow.value = true
}

// 保存提交数据
const handlerOk = (formEl: FormInstance | undefined) => {
  // 文件手动上传
  // upload.value.submit()
  console.log(formEl)
  if (!formEl) {
    console.log(form, info.Ddata)
    upload.value.submit()
  } else {
    formEl.validate(async valid => {
      if (valid) {
        console.log(Fdata, form)
        ElMessage.success('导入成功！')
        formEl.resetFields()
        inputShow.value = false
      }
    })
  }
}

//文件成功
const successUpload = res => {
  ElMessage.success(res.msg)
  cancal()
}
// 取消
const cancal = () => {
  inputShow.value = false
  ruleFormRef.value?.resetFields()
  Object.assign(form, originFormData)
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
      align-items: center;
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
  }
  .btn {
    text-align: center;
  }
}
:deep(.el-dialog__body .el-input) {
  width: 300px !important;
}
</style>
