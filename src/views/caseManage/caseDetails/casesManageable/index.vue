<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import Api from '@/api/modules/casesManageable'
import { ElMessage } from 'element-plus'
import useCaseStore from '@/store/modules/caseInfo.js'
import ReductionDialog from './components/reductionDialog/index.vue'
import tabComponentObj from './tabComponents/index.js'
import { CapitalDialog } from './config/dialogBtnConfig.js'
import operaBtnConfig from './config/operaBtnConfig.js'
import tabList from './config/tabList.js'

const state = reactive({
  reductionTableData: [],
  selectData: [],
  reductionRuleForm: {
    caseNoList: [], // 申请减免案件
    promiseTime: null,
    reductionMoney: null,
    attachment: [],
    reductionReasonId: null,
    reductionType: 2,
    refundName: null,
    refundPhone: null,
    relation: null,
    remark: null
  },
  dialogBtnJson: {
    dialogBtnTitle: '',
    formFieldsList: [],
    dialogRuleForm: {},
    width: '',
    rules: {}
  }
})

const caseInfoStore = useCaseStore()

const route = useRoute()
caseInfoStore.caseId = route.query?.caseId

state.reductionTableData = [
  {
    caseNo: 'MSD-JHKED-072',
    storeName: '待分配库',
    orgTitle: '测试机构136',
    residueAmount: 120227.17,
    caseStatusText: '暂停|特殊原因'
  },
  { caseNo: 'BE-BQ-0001001', storeName: '委外处置库', orgTitle: '测试机构28888', residueAmount: 20, caseStatusText: '正常' }
]

const tabActive = ref(0)
const reductionDialogVisible = ref(false)
const dialogFormVisible = ref(false)

const handleClick = item => {
  if (item.btnText === '申请减免') reductionDialogVisible.value = true
  if (item.btnText === '录入资方信息') {
    state.dialogBtnJson = CapitalDialog
    console.log(state.dialogBtnJson)
    dialogFormVisible.value = true
  }
}

const handleSubmit = async obj => {
  const params = {
    ...obj,
    caseId: route.query?.caseId
  }
  try {
    await Api.investorName(params)
    ElMessage.success('成功录入资方信息!')
    dialogFormVisible.value = false
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="card-wrap">
    <div style="height: 45px">
      <el-button
        v-for="(item, index) in operaBtnConfig"
        :key="index"
        :type="item.type"
        :plain="item.plain"
        :icon="!item.isCustomize ? item.iconName : ''"
        @click="handleClick(item)"
      >
        <template v-if="item.isCustomize">
          <svg-icon class="svgClass" :name="item.iconName" />
          &nbsp;
        </template>
        {{ item.btnText }}
      </el-button>
    </div>
    <el-tabs v-model="tabActive" class="mb20">
      <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="index">
        <div class="spacing"></div>
        <component :is="tabComponentObj[item.component]" v-if="tabActive === index"></component>
      </el-tab-pane>
    </el-tabs>
    <!--申请减免dialog-->
    <ReductionDialog v-model:reduction-dialog-visible="reductionDialogVisible" />
    <!--各类操作按钮弹窗-->
    <DialogForm
      v-model:dialog-form-visible="dialogFormVisible"
      :width="state.dialogBtnJson.width"
      :rule-form="state.dialogBtnJson.dialogRuleForm"
      :title="state.dialogBtnJson.dialogBtnTitle"
      :rules="state.dialogBtnJson.rules"
      :form-fields="state.dialogBtnJson.formFieldsList"
      @submit="handleSubmit"
    />
  </div>
</template>
<style scoped lang="scss">
.special {
  :deep(.el-form-item__content) {
    display: block;
  }
}
:deep(.el-tabs__header) {
  margin: 0;
}
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
