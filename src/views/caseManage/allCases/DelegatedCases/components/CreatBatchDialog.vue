<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="880px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" ref="ruleFormRef" label-width="120px" label-position="right" class="flx-justify-between form">
        <div>
          <div v-if="opeType === 1" class="info-wrap left-info">
            <div>案件筛选结果：</div>
            <div class="flx-justify-between item">
              <div>
                <div class="item-content">{{ state.numInfo.filterCaseNum }}</div>
                <div>案件数</div>
              </div>
              <div>
                <div class="item-content">{{ state.numInfo.filterCaseUserNum }}</div>
                <div>案人数</div>
              </div>
            </div>
          </div>
          <div v-if="opeType === 2" class="info-wrap left-info">
            <div class="mb10">上传案件：</div>
            <el-form-item label="" prop="file" label-width="0px">
              <UploadFile v-model:file-list="form.file" :limit="1" :acceptType="'excel'" ref="uploadFile"></UploadFile>
            </el-form-item>
            <div style="color: #999; line-height: 20px; margin: -10px 0 10px 0">只能上传txt/xls/xlsx文件</div>
            <el-button link type="primary" @click="onDownload">下载导入模板</el-button>
          </div>
          <el-form-item label="关联产品：" class="no-bottom">
            {{ format(state.numInfo.productList) }}
          </el-form-item>
          <el-form-item label="委托承办机构：" class="no-bottom">
            {{ format(state.numInfo.orgList) }}
          </el-form-item>
        </div>
        <div>
          <div class="info-wrap right-info">
            <div>批次信息预览：</div>
            <div class="flx-justify-between item">
              <div>
                <div class="item-content">{{ state.numInfo.createCaseNum || 0 }}</div>
                <div>可创建工单数</div>
              </div>
              <div>
                <div class="item-content">{{ state.numInfo.createCaseUserNum || 0 }}</div>
                <div>案人数</div>
              </div>
            </div>
          </div>
          <div class="mb8">备注：</div>
          <el-form-item label="" prop="remark" label-width="0px">
            <el-input
              v-model="form.remark"
              style="width: 360px"
              type="textarea"
              :autosize="{ minRows: 6 }"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref, watch } from 'vue'
import { UploadFile } from '@/components/Upload'
const form: any = reactive({
  remark: '', //备注
  file: [] //文件地址
})
const ruleFormRef = ref()
const uploadFile = ref()
const originFormData = JSON.parse(JSON.stringify(form))
const typType = ref(1)
const opeType = ref(1)
const title = ref('')
const state = reactive({
  numInfo: {} as any //批次数据信息
})
const emits = defineEmits(['submitForm'])
// 打开弹窗
const dialogVisible = ref(false)
const open = (type1, type2, numInfo) => {
  typType.value = type1
  opeType.value = type2
  title.value = type1 === 0 ? '创建诉讼批次' : '创建单保全批次'
  if (type2 === 1) {
    // Object.assign(state.numInfo, numInfo)
    state.numInfo = numInfo
  } else if (type2 === 2) {
    state.numInfo = {}
  }
  Object.assign(form, originFormData)
  dialogVisible.value = true
}
defineExpose({
  open
})
// 文件上传成功时，执行获取批次数据信息接口
watch(
  () => form.file,
  (newValue, oldValue) => {
    if (newValue[0]?.url) {
      console.log('watch成功')
      const params = {
        file: newValue[0].url,
        type: typType.value
      }
      // const {data } = await xx(params)
      // state.numInfo = data
      state.numInfo = {
        createCaseNum: 1,
        createCaseUserNum: 1,
        filterCaseUserNum: 1,
        orgList: ['公司名称T79'],
        filterCaseNum: 1,
        productList: ['“360”借条']
      }
    }
  },
  { deep: true }
)
// 确认
const submitForm = () => {
  if (opeType.value === 1) {
    const params = {
      remark: form.remark,
      type: typType.value
    }
    emits('submitForm', params)
    cancelSubmit()
  } else if (opeType.value === 2) {
    if (form.file[0] && form.file[0].url) {
      const params = {
        remark: form.remark,
        file: form.file[0].url,
        type: typType.value,
        createType: 1 //创建批次平台类型 0平台端，1机构端 //再处理
      }
      console.log(params)
      // 发送接口
      // await xx()
      cancelSubmit()
    } else {
      return ElMessage.warning('请先上传文件')
    }
  }
}
// 下载导入模板
const onDownload = async () => {
  //  const {data} =  await xx({ key: 'create_batch_template' })
  //  exportMethod(data)
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
// 处理数组
const format = list => {
  return list?.length > 0 ? list?.join('，') : ''
}
</script>
    
<style lang="scss" scoped>
.form {
  padding: 0 25px;
  align-items: flex-start;
  .info-wrap {
    width: 360px;
    margin-bottom: 22px;
    border-radius: 6px;
    padding: 10px 12px;
  }
}
.left-info {
  border: 1px solid rgba(240, 239, 239, 1);
  background: #fbfbfb;
}
.right-info {
  border: 1px solid rgba(240, 239, 239, 1);
  background: #fefadf;
  margin: 0px 0px 20px;
}
.item {
  justify-content: space-around;
  margin: 20px 0 12px;
  .item-content {
    font-size: 22px;
    color: #333;
    font-weight: bold;
    margin-bottom: 12px;
  }
}
</style>