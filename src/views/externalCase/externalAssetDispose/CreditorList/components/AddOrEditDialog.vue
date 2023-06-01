<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="630px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <el-form :model="form" :rules="rules" ref="ruleFormRef" label-position="right" label-width="125px">
        <el-form-item label="债权方：" prop="creditorName">
          <el-input v-model="form.creditorName" placeholder="请输入债权方" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：" prop="creditorStatus">
          <el-radio-group v-model="form.creditorStatus">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">不启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
const form = reactive({
  creditorName: '', //债权方
  creditorId: null,
  creditorStatus: null //是否启用
})
const originFormData = JSON.parse(JSON.stringify(form))
// watch: {
//     $route: {
//       handler: function (route) {
//         this.redirect = route.query && route.query.redirect;
//       },
//       immediate: true
//     }
//   },
const title = ref('')
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  creditorName: [{ required: true, trigger: 'blur', message: '债权方不能为空' }]
})
const emits = defineEmits(['getTableData'])
// 打开弹窗
const dialogVisible = ref(false)
const open = async (row, type) => {
  Object.assign(form, originFormData)
  if (type === 1) {
    title.value = '新增'
  } else if (type === 2) {
    title.value = '编辑'
    form.creditorId = row.creditorId
    form.creditorName = row.creditorName
    form.creditorStatus = Number(row.creditorStatus)
  }
  dialogVisible.value = true
}
defineExpose({
  open
})
// 添加/编辑
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      console.log(form)
      // 请求得到数据
      // const { data } = await xx(form)
      ElMessage.success('操作成功！')
      emits('getTableData')
      cancelSubmit()
    }
  })
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
</script>
  
<style lang="scss" scoped>
.center {
  text-align: center;
  font-size: 18px;
}
</style>
  