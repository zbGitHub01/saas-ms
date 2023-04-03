<template>
  <div class="outcase-container">
    <div
      v-for="(item, index) in inputdata"
      :key="item.type"
      class="message-warp"
      :style="{ 'margin-right': (index + 1) % 4 === 0 ? '' : '1.3%' }"
    >
      <h4>
        {{ item.title }}
      </h4>
      <div class="input_case">
        <div v-if="item.tipsList" class="message-title">
          <div v-for="(text, index) in item.tipsList" :key="index">{{ text }}</div>
        </div>
        <div v-if="item.downloadBanner" class="download-banner" @click="importExcelPath(item.downloadUrlKey)">
          <el-icon><Download /></el-icon>
          {{ item.downloadBanner }}
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
      width="25%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :before-close="cancal"
    >
      <el-form ref="formRef" :model="form" :rules="rules">
        <template v-if="select === true">
          <el-form-item label="产品:" :label-width="formLabelWidth" prop="productId">
            <el-select clearable v-model="Fdata.productId" filterable placeholder="请选择产品">
              <el-option
                v-for="item in selectData.productList"
                :key="item.itemId"
                :label="item.itemText"
                :value="item.itemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入库批次:" :label-width="formLabelWidth" prop="batchId">
            <el-select clearable v-model="Fdata.batchId" filterable placeholder="请选择入库批次">
              <el-option
                v-for="item in selectData.batchList"
                :key="item.itemId"
                :label="item.itemText"
                :value="item.itemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="债权方:" :label-width="formLabelWidth" prop="creditorId">
            <el-select clearable v-model="Fdata.creditorId" filterable placeholder="请选择债权方">
              <el-option
                v-for="item in selectData.creditorList"
                :key="item.itemId"
                :label="item.itemText"
                :value="item.itemId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="导入文件:" :label-width="formLabelWidth" prop="upload">
            <el-upload
              v-model="form.upload"
              class="upload-demo"
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
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="导入文件:" :label-width="formLabelWidth" prop="upload">
            <el-upload
              v-model="form.file"
              class="upload-demo"
              ref="upload"
              action="/caseCenter/caseImport/import"
              :data="info.Ddata"
              accept=".xls,.xlsx"
              :limit="1"
              :on-success="successUpload"
              :headers="tokens"
              :auto-upload="false"
              :file-list="info.fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </template>
      </el-form>
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
// 获取token
// import { getToken } from "@/utils/auth";
// const token = getToken();
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
const token = 'token'
// 接收props数据
const props = defineProps<{
  selectData: {
    batchList: any[] //入库批次
    creditorList: any[] //债权方
    productList: any[] //产品
    downData: any //下载模版
  }
}>()
const tokens = reactive({
  Authorization: token
})
const upload = ref()
const formRef = ref()

const inputdata = reactive([
  {
    title: '新案入库',
    btn: '导入案件',
    type: 101,
    select: true,
    downloadUrlKey: 'caseTemplateUrl',
    downloadBanner: '下载案件导入模板',
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
  {
    title: '导入临时标签',
    btn: '导入临时标签',
    type: 106,
    select: false,
    downloadUrlKey: 'tagTemplateUrl',
    downloadBanner: '下载临时标签导入模板',
    show: true
    // show: this.hasPerm("base_import_label"),
  }
])
const inputShow = ref(false)
const formLabelWidth = ref('120px')
const select = ref(false)
const title = ref('')
const info = reactive({
  fileList: [] as any,
  // 不清楚这个是啥
  Ddata: {
    importFileType: null
  }
})
const Fdata = reactive({
  productId: '',
  batchId: '',
  creditorId: '',
  importFileType: 101
})
const form = reactive(
  // new FormData()
  {
    upload: '',
    file: ''
  }
)
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
  info.Ddata = {
    importFileType: item.type
  }
  inputShow.value = true
}

// 保存提交数据
const handlerOk = (formEl: FormInstance | undefined) => {
  // 文件是否需要自动上传，还是手动上传
  // upload.value.submit()
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log(Fdata, form)
      // 请求得到数据
      // const { code, data, msg } = await xx(form)
      // if(code !== 200){
      //   return ElMessage.error(msg)
      // }
      ElMessage.success('导入成功！')
      formEl.resetFields()
      inputShow.value = false
    }
  })
}

//文件成功 ?
const successUpload = res => {
  ElMessage.success(res.msg)
  inputShow.value = false
}
const cancal = () => {
  inputShow.value = false
  formRef.value.resetFields()
}
</script>

<style lang="scss" scoped>
.outcase-container {
  margin: 20px 0;
  display: flex;
  // justify-content: flex-start;
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
    // margin-right: 1%;
    h4 {
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
</style>
