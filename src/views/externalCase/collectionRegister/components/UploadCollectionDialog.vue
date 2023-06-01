<template>
  <el-dialog
    v-model="dialogVisible"
    title="导入回款登记表"
    width="582px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <div class="warning_warp">
        <div>1、请使用系统提供的回款登记表模版导入；</div>
        <div>2、模版中“产品”和“收款债权方”内容必须与系统保持一致，否则会导致数据导入失败；</div>
        <div>
          <span class="mr20">-产看产品名称</span>
          <span>-查看债权方名称</span>
        </div>
      </div>
      <el-form :model="form" ref="ruleFormRef" label-position="right" label-width="90px">
        <el-form-item label="导入文件：" prop="file">
          <UploadFile v-model:file-list="form.file" :limit="1" :acceptType="'excel'" ref="uploadFile"></UploadFile>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="form.remark"
            style="width: 290px"
            type="textarea"
            :autosize="{ minRows: 2 }"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
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
  
<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive } from 'vue'
import { UploadFile } from '@/components/Upload'
const ruleFormRef = ref()
const form = reactive({
  remark: '', //备注
  file: [] //文件地址
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = async () => {
  dialogVisible.value = true
}
defineExpose({
  open
})
//确认
const submitForm = () => {
  const params = {
    remark: form.remark,
    file: form.file[0]?.url
  }
  // 请求
  // await xx(params)
  console.log(params)
  ElMessage.success('操作成功！')
  emits('getTableData')
  cancelSubmit()
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
</script>
  
<style lang="scss" scoped>
.warning_warp {
  margin: -12px 0 14px 0;
  padding: 10px;
  border: 1px solid #ff9921;
  border-radius: 6px;
  background-color: #fffcdc;
  color: #ff9921;
  div {
    margin-bottom: 5px;
  }
  span {
    color: var(--el-color-primary);
  }
}
</style>