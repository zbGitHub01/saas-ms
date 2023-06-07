<script setup>
import { reactive, onBeforeMount, onMounted } from 'vue'
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
const emit = defineEmits(['update:dialogVisible'])

const state = reactive({
  form: {
    resource: '',
    notes: ''
  }
})

//取消
const handleCancel = () => {
  emit('update:dialogVisible', false)
}

const handleClose = () => {
  emit('update:dialogVisible', false)
}

onBeforeMount(() => {})
onMounted(() => {})
</script>

<template>
  <el-dialog :model-value="props.dialogVisible" title="案件分派" width="60%" :before-close="handleClose">
    <div>
      <div class="label_class">
        <LabelClass :label-data="labelList" :is-bkg-color="false" />
      </div>
      <el-form :model="form" label-position="top">
        <el-form-item label="普通留案案件">
          <el-radio-group v-model="state.form.resource">
            <el-radio label="不收回留案案件" />
            <el-radio label="强制收回留案案件" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收回备注">
          <el-input v-model="state.form.notes" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleCancel">Confirm</el-button>
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
