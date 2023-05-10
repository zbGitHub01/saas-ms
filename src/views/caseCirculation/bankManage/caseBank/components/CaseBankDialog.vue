<template>
  <el-dialog
    v-model="dialogVisible"
    title="案件分库"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <div class="flx-justify-between allTab">
        <div class="flx-justify-between tab">
          <el-icon class="icon"><Memo /></el-icon>
          <div>
            <div class="title">选中案件数</div>
            <div class="money">{{ props.distInfo.caseNum }}</div>
          </div>
        </div>
        <div class="flx-justify-between tab">
          <el-icon class="icon"><UserFilled /></el-icon>
          <div>
            <div class="title">选中案件人数</div>
            <div class="money">{{ props.distInfo.personNum }}</div>
          </div>
        </div>
        <div class="flx-justify-between tab">
          <el-icon class="icon"><Money /></el-icon>
          <div>
            <div class="title">预计分库金额</div>
            <div class="money">{{ props.distInfo.totalAmount }}</div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <el-form :model="form" ref="ruleFormRef">
        <el-form-item label="操作维度" prop="isWithProductPublicDebt">
          <el-radio-group v-model="form.isWithProductPublicDebt" @change="radioChange">
            <el-radio :label="1">案人</el-radio>
            <el-radio :label="0">案件</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标案件库">
          <el-select clearable v-model="form.bank" placeholder="请选择目标案件库">
            <el-option v-for="item in resouerdistList" :key="item.itemId" :label="item.itemText" :value="item.itemId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
const form: any = reactive({
  isWithProductPublicDebt: 1,
  bank: null
})
const originFormData = JSON.parse(JSON.stringify(form))
// 接收props数据
const props = defineProps<{
  distInfo: any //委案数据
  resouerdistList: any[] //目标案件库
  sourceStoreId: any
}>()
const emits = defineEmits(['getTableData', 'fetchCaseDistSelect', 'toggleSelection'])
// 打开弹窗
const dialogVisible = ref(false)
const open = () => {
  dialogVisible.value = true
  Object.assign(form, originFormData)
}
defineExpose({
  open
})
// 确认委派
const submitForm = () => {
  let params = {
    taskId: props.distInfo.taskId,
    sourceStoreId: props.sourceStoreId, //当前所在库的id
    targetStoreId: form.bank
  }
  console.log(params)
  // 请求
  // await caseEntrustSave(params)
  ElMessage.success('分库成功！')
  emits('toggleSelection')
  emits('getTableData')
  dialogVisible.value = false
}
// 取消
const cancelSubmit = () => {
  dialogVisible.value = false
}
const radioChange = val => {
  emits('fetchCaseDistSelect', 1, !!val)
}
</script>
  
<style lang="scss" scoped>
.allTab {
  height: 40px;
  margin-bottom: 40px;
  .tab {
    width: 33%;
    height: 40px;
    border-radius: 2px;
    padding: 5px;
    justify-content: flex-start;
    .icon {
      font-size: 35px;
      margin-right: 4px;
      // color: blue;
    }
    .title {
      color: #cccccc;
    }
    .money {
      font-weight: 500;
    }
  }
}
</style>
  