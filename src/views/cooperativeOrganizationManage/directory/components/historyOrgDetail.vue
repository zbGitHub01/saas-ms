<template>
  <el-dialog
    v-model="dialogVisible"
    title="机构详情"
    width="900px"
    append-to-body
    :before-close="handleClose"
    top="5vh"
  >
    <div style="height: 670px">
      <div class="flx-align-center pb10">
        <div class="pr40">
          <span class="color-999">机构名：</span>
          {{ orgData.orgName }}
        </div>
        <div class="pr40">
          <span class="color-999">注册人姓名：</span>
          {{ orgData.userName }}
        </div>
        <div class="pr40">
          <span class="color-999">对接邮箱：</span>
          {{ orgData.phone }}
        </div>
      </div>
      <div style="height: calc(100% - 20px)">
        <access-data :scrollTop="220" accessId="history-personal-info"></access-data>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import accessData from './../../components/accessData/index.vue'
// import { otherRegisterLog } from '@/api/orgmanage'
const dialogVisible = ref(false)
const orgData = ref<any>()

const getTableData = async () => {
  const params = {}
  // const { code, data } = await otherRegisterLog(params)
  // if (code !== 200) return
  // state.tableData = data
  // state.total = data.total
}
const open = (data: any) => {
  orgData.value = data
  getTableData()
  dialogVisible.value = true
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
.color-999 {
  color: #999;
}
</style>
