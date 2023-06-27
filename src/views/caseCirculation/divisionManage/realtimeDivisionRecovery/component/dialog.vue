<script setup>
import { reactive, ref } from 'vue'
import labelList from './labelList.js'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  labelData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['update:dialogVisible', 'submit'])

const state = reactive({
  form: {
    isRecoverRetain: '',
    remark: ''
  }
})

const form1 = ref(null)

//取消
const handleClose = () => {
  emit('update:dialogVisible', false)
}

//确认
const handleConfirm = () => {
  emit('submit', state.form)
}
</script>

<template>
  <el-dialog :model-value="props.dialogVisible" title="案件分派" width="40%" :before-close="handleClose">
    <div>
      <div class="label_class">
        <LabelClass :label-data="labelList" :label-obj="props.labelData" :is-bkg-color="false" />
      </div>
      <el-form ref="form1" :model="state.form" label-position="top">
        <el-form-item label="普通留案案件">
          <el-radio-group v-model="state.form.isRecoverRetain">
            <el-radio :label="0">不收回留案案件</el-radio>
            <el-radio :label="1">强制收回留案案件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收回备注">
          <el-input v-model="state.form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.label_class {
  padding: 0 50px;
}
:deep(.el-form-item__label) {
  font-weight: bold;
}
:deep(.el-form-item__content) {
  margin-left: 20px;
}
</style>
