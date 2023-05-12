<script setup>
import { ref, toRefs, reactive, getCurrentInstance } from 'vue'
import { ElMessageBox } from 'element-plus'

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
  //formItem配置json
  formFields: {
    type: Array,
    default: () => []
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
const { proxy } = getCurrentInstance()

const { ruleForm, rules } = toRefs(props)

let state = reactive({
  form: proxy.$deepCopy(ruleForm.value, true)
})
const ruleFormRef = ref(0)

const emit = defineEmits(['update:dialogFormVisible', 'handlePreview', 'handleRemove', 'handleExceed', 'submit'])

const closeClick = ruleFormRef => {
  resetFunc(ruleFormRef)
}

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
      emit('submit', state.form)
      resetFunc(formEl)
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
const resetFunc = formEl => {
  state.form = proxy.$deepCopy(ruleForm.value, true)
  emit('update:dialogFormVisible', false)
  formEl.resetFields()
}
console.log(rules)
</script>

<template>
  <el-dialog
    :model-value="props.dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="props.title"
    @close="closeClick(ruleFormRef)"
  >
    <el-form
      ref="ruleFormRef"
      :model="state.form"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :label-position="labelPosition"
      :size="size"
      status-icon
    >
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
          :filterable="item.filterable"
          :clearable="item.clearable"
          :placeholder="item.placeholder"
        >
          <el-option v-for="opts in item.options" :key="opts.value" :label="opts.label" :value="opts.value" />
        </el-select>
        <!--checkbox多选框-->
        <el-checkbox-group v-if="item.type === 'checkbox'" v-model="state.form[item.prop]">
          <el-checkbox v-for="opts in item.checkList" :key="opts.value" :label="opts.label" />
        </el-checkbox-group>
        <!--radio单选框-->
        <el-radio-group v-if="item.type === 'radio'" v-model="state.form[item.prop]">
          <el-radio v-for="(opts, index) in item.radioList" :key="index" :label="opts.label" />
        </el-radio-group>
        <!--date日期选择器-->
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="state.form[item.prop]"
          type="date"
          value-format="x"
          :placeholder="item.placeholder"
        />
        <!--datetime日期时间选择器-->
        <el-date-picker
          v-if="item.type === 'datetime'"
          v-model="state.form[item.prop]"
          type="datetime"
          value-format="x"
          :placeholder="item.placeholder"
        />
        <!--目标机构（特殊）-->
        <template v-if="item.type === 'pairSelect'">
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
        </template>
        <!--文件上传-->
        <el-upload
          v-if="item.type === 'upload'"
          v-model:file-list="state.form[item.prop]"
          class="upload-demo"
          :action="item.action"
          :limit="item.limit"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          multiple
        >
          <el-button type="primary">点击上传</el-button>
          <template v-if="!!item.uploadTips" #tip>
            <div class="el-upload__tip">{{ item.uploadTips }}</div>
          </template>
        </el-upload>
      </el-form-item>
      <slot name="more"></slot>
    </el-form>
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
