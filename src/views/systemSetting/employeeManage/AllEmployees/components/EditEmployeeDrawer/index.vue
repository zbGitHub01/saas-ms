<template>
  <el-drawer
    class="drawer"
    title="员工详情"
    :model-value="props.drawerVisible"
    size="900px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    @open="handleOpen"
  >
    <template #default>
      <el-descriptions :column="4">
        <el-descriptions-item label="姓名">张兮兮</el-descriptions-item>
        <el-descriptions-item label="性别">男</el-descriptions-item>
        <el-descriptions-item label="手机号">15167696520</el-descriptions-item>
        <el-descriptions-item label="证件号">320826199107080622</el-descriptions-item>
        <el-descriptions-item label="邮箱" :span="2">huangfudaoying@donganzichan.cn</el-descriptions-item>
        <el-descriptions-item label="钉钉">张兮兮</el-descriptions-item>
        <el-descriptions-item label="系统工号">ZK49124</el-descriptions-item>
      </el-descriptions>
      <EmployeeInfo v-if="!isEdit" v-model="tabActive" />
      <EmployeeForm ref="employeeFormRef" v-else v-model="tabActive" />
    </template>
    <template #footer>
      <template v-if="!isEdit">
        <el-button @click="beforeClose">关 闭</el-button>
        <el-button type="primary" @click="onEdit">编 辑</el-button>
      </template>
      <template v-else>
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">保 存</el-button>
      </template>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import EmployeeInfo from './EmployeeInfo.vue'
import EmployeeForm from './EmployeeForm.vue'

const props = defineProps({
  drawerVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:drawerVisible'])

const isEdit = ref(false)
const loading = ref(false)
const tabActive = ref('1')
const employeeFormRef = ref()
const handleOpen = () => {}
const beforeClose = () => {
  tabActive.value = '1'
  emit('update:drawerVisible', false)
}
const onEdit = () => {
  isEdit.value = true
}
const onCancel = () => {
  isEdit.value = false
}
const onSubmit = () => {
  const postData = {
    ...employeeFormRef.value.form
  }
  console.log(postData)
}
</script>

<style lang="scss" scoped></style>
