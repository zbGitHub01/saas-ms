<template>
  <el-dialog
    v-model="dialogVisible"
    title="实时委案"
    width="700px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelSubmit"
  >
    <span>
      <LabelClass
        v-if="state.labelObjData && Object.keys(state.labelObjData).length"
        :labelData="state.CaseLabelData3"
        :label-obj="state.labelObjData"
        :isSpaceAround="true"
        :isBkgColor="false"
      />
      <el-divider></el-divider>
      <el-form :model="form" ref="ruleFormRef" label-position="right" label-width="150px" :rules="rules" v-if="!last">
        <el-form-item label="案件分库：" prop="storeId">
          <el-select clearable v-model="form.storeId" filterable placeholder="请选择案件分库">
            <el-option
              v-for="item in selectData.bankList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作维度：" prop="entrustStrategy">
          <el-radio-group v-model="form.entrustStrategy">
            <el-radio :label="1">案人</el-radio>
            <el-radio :label="2">案件</el-radio>
            <el-radio :label="3">库内剩余共债</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标机构：" prop="orgId" class="form-item__inline">
          <el-select clearable v-model="categoryId" filterable placeholder="机构分类" @change="changeCategory">
            <el-option v-for="item in selectData.categoryData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select clearable v-model="form.orgId" filterable placeholder="请选择目标机构">
            <el-option v-for="item in state.orgList" :key="item.itemId" :label="item.itemText" :value="item.itemId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委案类型：" prop="entrustType">
          <el-select v-model="form.entrustType" placeholder="请选择委案类型" clearable>
            <el-option
              v-for="item in selectData.caseTypeList"
              :key="item.itemId"
              :label="item.itemText"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委派间隔期数：" prop="duringMonth">
          <el-select clearable v-model="form.duringMonth" placeholder="请选择委派间隔期数">
            <el-option label="不限" :value="0"></el-option>
            <el-option label="1个月" :value="1"></el-option>
            <el-option label="2个月" :value="2"></el-option>
            <el-option label="3个月" :value="3"></el-option>
            <el-option label="4个月" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <div style="color: rgb(170, 170, 170); margin: -5px 0 10px 128px">指案件被重新分派给历史同一家处置机构的间隔期</div>
        <el-form-item label="历史处置记录：" prop="isHideHisFollowRecord">
          <el-radio-group v-model="form.isHideHisFollowRecord">
            <el-radio :label="1">隐藏</el-radio>
            <el-radio :label="0">不隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="委案到期日：" prop="recoverDateStr">
          <el-date-picker
            v-model="form.recoverDateStr"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label=" 是否自动收回：" prop="isAutoRecover">
          <el-radio-group v-model="form.isAutoRecover">
            <el-radio :label="0">不自动收回</el-radio>
            <el-radio :label="1">自动收回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span v-else>
        <p class="item-title mb10">委派目标调整</p>
        <div class="color_warp">
          <el-radio-group v-model="adjustType" @change="handleStatus">
            <el-radio :label="1">调整案人数</el-radio>
            <el-radio :label="2">调整委案金额</el-radio>
          </el-radio-group>
          <div class="num_warp" v-if="adjustType === 1">
            <span>案人数调整为：</span>
            <el-input-number
              v-model="adjustNum"
              :min="1"
              :max="state.lastData.personNum"
              controls-position="right"
              @change="handleChange"
            ></el-input-number>
            <span class="unit">人</span>
          </div>
          <div class="num_warp" v-else>
            <span>委案金额调整为：</span>
            <el-input-number
              v-model="adjustNum"
              :min="0"
              :max="state.lastData.totalAmount"
              controls-position="right"
              @change="handleChange"
            ></el-input-number>
            <span class="unit">元</span>
          </div>
        </div>
        <p class="item-title mt10 mb10">委派预览</p>
        <div class="color_warp">
          <p class="mb10">
            目标机构：
            <span>{{ state.lastData.orgInfo.orgName }}</span>
          </p>
          <div class="item-position">
            <p>
              委派案件数：
              <span>{{ state.lastData.orgInfo.caseNum }}</span>
            </p>
            <p>
              委案金额：
              <span>{{ state.lastData.orgInfo.totalAmount }}</span>
            </p>
          </div>
        </div>
        <div class="remark_warp">
          <label>备注：</label>
          <el-input clearable type="textarea" v-model="remark"></el-input>
        </div>
      </span>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="last = false" v-if="last" style="float: left">上一步</el-button>
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="nextStep(ruleFormRef)" v-if="!last">下一步</el-button>
        <el-button type="primary" @click="submitForm" v-if="last">确认委派</el-button>
      </span>
    </template>
  </el-dialog>
</template>
  
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, computed } from 'vue'
import moment from 'moment'
import Apis from '@/api/modules/caseManage'
import CaseLabelData3 from '@/constants/CaseLabelData3' //查询数据
import { useGlobalStore } from '@/store/index'
const globalStore = useGlobalStore()
const tenantId = computed(() => globalStore.tenantId)
const form = reactive({
  entrustStrategy: 1,
  // batchId: null,
  entrustType: null,
  duringMonth: null,
  isAutoRecover: 0,
  recoverDateStr: moment(moment().format('YYYY-MM-DD')).endOf('month').format('YYYY-MM-DD'), //当月最后一天
  isHideHisFollowRecord: 1,
  orgId: null,
  storeId: null //分库
})
const originFormData = JSON.parse(JSON.stringify(form))
const state = reactive({
  lastData: {},
  paramsSub: {}, //操作项参数
  CaseLabelData3, //查询统计数据标头
  labelObjData: {}, //查询统计数据值
  orgList: [] //机构下拉
})
const adjustNum = ref(0)
const adjustType = ref(1)
const remark = ref('')
const last = ref(false)
const categoryId = ref()
// 接收props数据
const props = defineProps({
  selectData: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['getTableData', 'toggleSelection'])
// 校验规则
const ruleFormRef = ref()
const rules = reactive({
  storeId: [{ required: true, message: '请选择分库', trigger: 'change' }],
  orgId: [{ required: true, message: '请选择目标机构', trigger: 'change' }],
  entrustType: [{ required: true, message: '请选择委案类型', trigger: 'change' }],
  isHideHisFollowRecord: [{ required: true, message: '请选择历史处置记录', trigger: 'change' }],
  recoverDateStr: [{ required: true, message: '请选择委案到期日', trigger: 'change' }],
  duringMonth: [{ required: true, message: '请选择委派间隔期数', trigger: 'change' }],
  isAutoRecover: [{ required: true, message: '请选择是否自动收回', trigger: 'change' }]
})
// 打开弹窗
const dialogVisible = ref(false)
const open = paramsSub => {
  dialogVisible.value = true
  Object.assign(form, originFormData)
  last.value = false
  state.paramsSub = { ...paramsSub }
  // 委案类型默认为 默认
  const entrustItem = props.selectData.caseTypeList.find(item => item.itemText === '默认')
  if (entrustItem) {
    form.entrustType = entrustItem.itemId
  }
}
defineExpose({
  open
})
// 下一步
const nextStep = formEl => {
  if (!formEl) return
  formEl.validate(async valid => {
    if (valid) {
      let params = Object.assign({}, form, state.paramsSub)
      // params['batchId'] = props.selectData.defalutType
      const { data } = await Apis.caseEntrustSelect(params)
      // const data = {
      //   adjustNum: 2,
      //   adjustType: 1,
      //   orgInfo: '{"totalAmount":2309,"orgName":"公司名称T79","caseNum":2,"personNum":4,"orgId":101}',
      //   caseNum: 2,
      //   personNum: 4,
      //   totalAmount: 32342,
      //   taskId: 2309
      // }
      state.lastData = { ...data }
      state.labelObjData = { ...data }
      state.lastData.orgInfo = JSON.parse(state.lastData.orgInfo)
      adjustType.value = state.lastData.adjustType
      adjustNum.value = state.lastData.adjustNum
      last.value = true
    }
  })
}
// 改变状态
const handleStatus = val => {
  adjustNum.value = val === 1 ? state.lastData.orgInfo.personNum : state.lastData.orgInfo.totalAmount
  adjustType.value = val
}
// 刷新委案数据
const handleChange = async () => {
  let params = {
    adjustType: adjustType.value,
    adjustNum: adjustNum.value,
    taskId: state.lastData.taskId
  }
  const { data } = await Apis.caseAllotRefresh(params)
  state.lastData.orgInfo = JSON.parse(data.orgInfo)
  // state.lastData.orgInfo = JSON.parse('{"totalAmount":2308,"orgName":"公司名称T79","caseNum":2,"personNum":4,"orgId":101}')
}
// 确认委派
const submitForm = async () => {
  const params = {
    adjustType: adjustType.value,
    adjustNum: adjustNum.value,
    remark: remark.value,
    taskId: state.lastData.taskId
  }
  await Apis.caseEntrustSave(params)
  ElMessage.success('委派成功！')
  emits('toggleSelection')
  emits('getTableData')
  dialogVisible.value = false
}
// 取消
const cancelSubmit = () => {
  ruleFormRef.value?.resetFields()
  state.orgList = []
  categoryId.value = null
  dialogVisible.value = false
}
const changeCategory = async val => {
  if (val) {
    const params = {
      categoryId: val,
      tenantId: tenantId.value
    }
    const { data } = await Apis.relationOrgList(params)
    state.orgList = data
  } else {
    form.orgId = null
    state.orgList = []
  }
}
</script>
  
<style lang="scss" scoped>
.item-title {
  font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
  font-weight: 700;
  font-style: normal;
  color: #7f7f7f;
  font-size: 14px;
}
.color_warp {
  width: 100%;
  padding: 20px;
  background: rgba(255, 255, 204, 1);
  p {
    span {
      font-weight: 700;
    }
  }
  .item-position {
    display: flex;
    justify-content: flex-start;
    p {
      width: 50%;
      span {
        font-size: 20px;
      }
    }
  }
  .num_warp {
    margin-top: 20px;
    .unit {
      margin-left: 10px;
      font-size: 18px;
    }
  }
}
.remark_warp {
  display: flex;
  justify-content: flex-start;
  margin: 20px 0;
  label {
    width: 50px;
  }
}
:deep(.form-item__inline) {
  .el-form-item__content {
    gap: 4px;
    display: flex;
    .el-input {
      width: 150px;
    }
  }
}
</style>
  