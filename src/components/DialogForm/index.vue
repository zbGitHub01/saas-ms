<script setup>
import { ref, toRefs, reactive, getCurrentInstance, watch, nextTick } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const props = defineProps({
  dialogFormVisible: {
    type: Boolean,
    default: false
  },
  //label方向
  labelPosition: {
    type: String,
    default: null
  },
  //dialog title
  title: {
    type: String,
    default: null
  },
  //form大小
  size: {
    type: String,
    default: null
  },
  //label宽
  labelWidth: {
    type: String,
    default: null
  },
  //dialog宽度
  width: {
    type: String,
    default: null
  },
  //formItem配置json
  formFields: {
    type: Array,
    default: () => []
  },
  //监听对象
  watchItem: {
    type: String,
    default: null
  },
  //form对象
  ruleForm: {
    type: Object,
    required: true,
    default: () => {}
  },
  //form校验规则
  rules: {
    type: Object,
    default: () => {}
  }
})
const instance = getCurrentInstance()?.proxy

const { ruleForm, rules } = toRefs(props)

let state = reactive({
  form: instance?.$deepCopy(ruleForm.value, true)
})
const ruleFormRef = ref(null)

const emit = defineEmits([
  'update:dialogFormVisible',
  'handlePreview',
  'handleRemove',
  'handleExceed',
  'submit',
  'watchChange',
  'fileList',
  'btnClick'
])

const closeClick = ruleFormRef => {
  resetFunc(ruleFormRef)
}

watch(
  () => ruleForm.value,
  // eslint-disable-next-line no-unused-vars
  (newValue, _) => {
    state.form = instance?.$deepCopy(newValue, true)
    console.log(newValue)
  },
  { deep: true },
  { immediate: true }
)

//监听表单某个值变化
watch(
  () => state.form[props.watchItem],
  // eslint-disable-next-line no-unused-vars
  (newValue, _) => {
    emit('watchChange', newValue)
  },
  { deep: true },
  { immediate: true }
)

//文件列表移除文件时的钩子
const handleRemove = (file, uploadFiles) => {
  emit('handlePreview', file, uploadFiles)
  console.log(file, uploadFiles)
}

//点击文件列表中已上传的文件时的钩子
const handlePreview = uploadFile => {
  emit('handlePreview', uploadFile)
  console.log(uploadFile)
}

//文件上传失败
const uploadError = () => {
  ElMessage.error('上传失败！')
}

const fileList = ref([])
//文件上传成功
// eslint-disable-next-line no-unused-vars
const uploadSuccess = (response, uploadFile, _) => {
  const fileObj = {}
  fileObj['name'] = uploadFile?.name
  fileObj['url'] = response?.data?.url
  fileList.value.push(fileObj)
  console.log(fileList.value)
  emit('fileList', fileList.value)
  // console.log('response, uploadFile, uploadFiles', response, uploadFile, uploadFiles)
}

//当超出限制时，执行的钩子函数
const handleExceed = (files, uploadFiles) => {
  emit('handleExceed', files, uploadFiles)
  // ElMessage.warning(
  //   `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length} totally`
  // )
}

// eslint-disable-next-line no-unused-vars
const beforeRemove = (uploadFile, _) => {
  return ElMessageBox.confirm(`确定移除 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  )
}

const submitForm = async formEl => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('submit', state.form, formEl)
      // resetFunc(formEl)
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = formEl => {
  if (!formEl) return
  //假如有传默认重置对象，则深拷贝进行重置
  resetFunc(formEl)
}

//表单按钮
const handleClick = () => {
  emit('btnClick')
}

//打开前清楚校验
const open = ruleFormRef => {
  nextTick(() => {
    ruleFormRef.clearValidate()
  })
}
const resetFunc = formEl => {
  state.form = instance?.$deepCopy(props.ruleForm, true)
  formEl.resetFields()
  emit('update:dialogFormVisible', false)
}
</script>

<template>
  <el-dialog
    :width="props.width"
    :model-value="props.dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="props.title"
    @open="open(ruleFormRef)"
    @close="closeClick(ruleFormRef)"
  >
    <el-form
      ref="ruleFormRef"
      :model="state.form"
      :rules="rules"
      :label-width="props.labelWidth || '120px'"
      class="demo-ruleForm"
      :label-position="labelPosition"
      :size="size"
      status-icon
    >
      <slot name="validator" />
      <el-form-item
        v-for="item in formFields"
        :key="item.prop"
        :label-width="item.labelWidth || labelWidth"
        :label="item.label"
        :prop="item.prop"
      >
        <!--input输入框-->
        <el-input v-if="item.type === 'input'" v-model="state.form[item.prop]" :placeholder="item.placeholder"></el-input>
        <!--switch单选框-->
        <el-switch v-if="item.type === 'switch'" v-model="state.form[item.prop]" />
        <!--textarea文本域-->
        <el-input
          v-if="item.type === 'textarea'"
          v-model="state.form[item.prop]"
          type="textarea"
          :placeholder="item.placeholder"
        />
        <!--select选择框-->
        <el-select
          v-if="item.type === 'select'"
          v-model="state.form[item.prop]"
          :disabled="item.disabled"
          :multiple="item.multiple"
          :filterable="item.filterable"
          :clearable="item.clearable"
          :placeholder="item.placeholder"
        >
          <el-option
            v-for="(opts, index) in item.options"
            :key="index"
            :label="opts.label || opts[item.optionLabel]"
            :value="opts.value || opts[item.optionValue]"
          />
        </el-select>
        <!--checkbox多选框-->
        <el-checkbox-group v-if="item.type === 'checkbox'" v-model="state.form[item.prop]">
          <el-checkbox v-for="(opts, index) in item.checkList" :key="index" :label="opts.label || opts[item.checkboxLabel]" />
        </el-checkbox-group>
        <!--radio单选框-->
        <el-radio-group v-if="item.type === 'radio'" v-model="state.form[item.prop]">
          <el-radio v-for="(opts, index) in item.radioList" :key="index" :label="opts.label || opts[item.radioLabel]">
            {{ opts.name || opts[item.radioName] }}
          </el-radio>
        </el-radio-group>
        <!--date日期选择器-->
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="state.form[item.prop]"
          type="date"
          value-format="YYYY-MM-DD"
          :placeholder="item.placeholder"
        />
        <!--datetime日期时间选择器-->
        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="state.form[item.prop]"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          :placeholder="item.placeholder"
        />
        <el-button v-if="item.needBtn" type="primary" style="margin-left: 20px" :disabled="item.btnDisabled" @click="handleClick">
          {{ item.btnText }}
        </el-button>
        <!--目标机构（特殊）-->
        <!-- <template v-if="item.type === 'pairSelect'">
          <el-col :span="6">
            <el-form-item :prop="item.childItem[0].prop">
              <el-select
                v-if="item.childItem[0].type === 'select'"
                v-model="state.form[item.childItem[0].prop]"
                :placeholder="item.childItem[0].placeholder"
                :filterable="true"
                :clearable="true"
              >
                <el-option v-for="opts in item.childItem[0].options" :key="opts.value" :label="opts.label" :value="opts.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="text-center"></el-col>
          <el-col :span="12">
            <el-form-item :prop="item.childItem[1].prop">
              <el-select
                v-if="item.childItem[1].type === 'select'"
                v-model="state.form[item.childItem[1].prop]"
                :placeholder="item.childItem[1].placeholder"
                :filterable="true"
                :clearable="true"
              >
                <el-option v-for="opts in item.childItem[1].options" :key="opts.value" :label="opts.label" :value="opts.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </template> -->
        <!--文件上传-->
        <el-upload
          v-if="item.type === 'upload'"
          v-model:file-list="state.form[item.prop]"
          class="upload-demo"
          :action="item.action"
          :accept="item.accept || ''"
          :limit="item.limit"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          :headers="item.headers"
          :multiple="item.multiple"
        >
          <el-button type="primary">点击上传</el-button>
          <template v-if="!!item.uploadTips" #tip>
            <div class="el-upload__tip">{{ item.uploadTips }}</div>
          </template>
        </el-upload>
      </el-form-item>
      <slot name="more"></slot>
    </el-form>
    <slot name="default" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}

.upload-demo {
  width: 100%;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.child-form {
  width: 100%;
  padding: 20px;
  background-color: #eeeeee;
  & .el-form-item:nth-child(2n) {
    margin: 20px 0;
  }
  &:nth-child(2n) {
    margin: 10px 0;
  }
}
</style>
