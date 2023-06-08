<script setup>
import { reactive, toRefs, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: null
  },
  type: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:dialogVisible'])

const { dialogVisible, title, type } = toRefs(props)

const defaultForm = {
  remark: ''
}

const state = reactive({
  ruleForm: Object.assign({}, defaultForm),
  rules: {
    remark: [{ required: true, message: '请输入内容', trigger: 'blur' }]
  },
  dataList: []
})

const ruleForm = ref(null)
//删除
const handleDel = row => {
  ElMessageBox.confirm('是否确认删除该记录?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let params = {
        id: row.id
      }
      console.log('params', params)
      ElMessage({
        type: 'success',
        message: 'Delete completed'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}

const handleClick = () => {
  console.log(props.title)
}

//取消
const cancel = () => {
  if (type.value === 1) ruleForm.value.resetFields()
  emit('update:dialogVisible', false)
}
</script>

<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
  >
    <template v-if="type == 1">
      <el-form ref="ruleForm" :model="state.ruleForm" :rules="state.rules" label-width="100px">
        <el-form-item :label="title" prop="remark">
          <el-input v-model="state.ruleForm.remark" clearable type="text"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template v-else>
      <el-table :border="true" :data="state.dataList">
        <el-table-column property="createTime" label="更新时间" align="center" width="150"></el-table-column>
        <el-table-column property="createName" label="更新人" align="center" width="200"></el-table-column>
        <el-table-column property="v" :label="title" align="center"></el-table-column>
        <el-table-column property="remark" label="备注" align="center"></el-table-column>
        <el-table-column property="enable" align="center" label="操作">
          <template #default="scope">
            <el-button link @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template v-if="type == 1" #footer>
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="handleClick">确 定</el-button>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss"></style>
