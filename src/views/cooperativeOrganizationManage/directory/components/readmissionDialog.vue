<template>
  <el-dialog v-model="dialogVisible" title="重新准入" width="450px" :before-close="handleClose">
    <div style="margin: 0 40px">
      <div v-if="link.type === 1">
        <div class="text-wrap">确定重新准入吗？</div>
      </div>
      <div v-if="link.type === 2">
        <div class="text-wrap">
          该合作机构
          <span class="color-f00">{{ link.date }}</span>
          前处在合作准入冷却期，确定强制重新准入吗？
        </div>
      </div>
      <div v-if="link.type === 3">
        <div>
          请告知对方,
          <span class="color-f00">{{ link.user }}</span>
          的准入邀请已准备完成，对方可通过以下方式完成准入：
        </div>
        <div class="mt20">1、打开以下链接，以注册手机号此处替换为注册手机号登 录后即可进入准入流程</div>
        <div class="mt8 mb10" style="color: #3178ff">{{ link.url }}</div>
        <el-button type="primary" plain v-copy="link.url">复制准入链接地址</el-button>
        <div class="mt20">2、登录作业系统后进入“合作机构管理”-“上游合作邀请管理” 页面，完成准入(如该机构所有原因已离职则无法使用该方式)</div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <template v-if="link.type !== 3">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="doSave()">确认</el-button>
        </template>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// import { otherRegisterUrlCreate, otherRegisterRestart } from '@/api/orgmanage'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false)
interface linkData {
  type: number
  url: string
  user: string
  date: string
}
const link = reactive<linkData>({
  type: 1,
  url: 'https://www.dongancloud.com/#/about',
  user: '张三',
  date: '2020-01-01'
})
const emits = defineEmits(['getTableData'])
const open = () => {
  // getParentDeptment()
  link.type = 2
  dialogVisible.value = true
}
const getParentDeptment = async (id: number) => {
  // const { code, data } = await parentDept({ id })
  // if (code !== 200) return
  // form.parentId = data?.depId
}
const doSave = async () => {
  if (link.type === 1) {
    // const { code, data } = await addDeptment({ id })
    // // if (code !== 200) return
    // ElMessage.success('邀请链接成功')
    // link.type = 2
  }
  // const { code, data } = await addDeptment({ id })
  // if (code !== 200) return
  ElMessage.success('邀请链接成功')
  link.type = 2
  // emits('getTableData')
  // handleClose()
}
const handleClose = () => {
  dialogVisible.value = false
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.dialog-footer button:first-child {
  margin-right: 10px;
}
.text-wrap {
  font-weight: bold;
  text-align: center;
}
.color-f00 {
  color: #f00;
}
</style>
