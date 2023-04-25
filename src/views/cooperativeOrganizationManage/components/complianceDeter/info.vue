<template>
  <div style="height: 100%">
    <div class="pt12">
      <span>处置经验判断：</span>
      <span style="font-weight: bold">{{ complianceInfo.companyTypeName }}</span>
    </div>
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      :size="formSize"
      label-position="right"
      class="form-wrap"
      label-width="0px"
    >
      <div class="form-list" style="padding-bottom: 18px">
        <div
          v-for="(headItem, headIndex) in formHead"
          :key="headIndex"
          style="font-size: 14px"
          :style="{ width: headItem.width }"
        >{{ headItem.name }}</div>
      </div>
      <div>
        <div v-for="(scoreItem, scoreIndex) in form.scoreList" :key="scoreIndex" class="form-list">
          <div :style="{ width: formHead[0].width }">
            <div class="score-name">{{ scoreItem.name }}</div>
          </div>
          <div :style="{ width: formHead[1].width }">
            <el-form-item label :prop="`scoreList.${scoreIndex}.score`" :rules="rules.scoreItem">
              <el-input
                style="width: 120px"
                v-model="scoreItem.score"
                placeholder="请输入分数"
                @change="changeScore(scoreItem, scoreIndex)"
              ></el-input>
            </el-form-item>
          </div>
          <div :style="{ width: formHead[2].width }">
            <el-tooltip placement="top">
              <template #content>
                <div
                  v-for="(jsonItem, jsonIndex) in scoreItem.json"
                  :key="jsonIndex"
                  class="json-list"
                >
                  <div style="width: 80px">{{ jsonItem.scoreCriteria }}</div>
                  <div style="width: 80px">{{ jsonItem.scoreValue }}</div>
                </div>
              </template>
              <el-icon class="score-icon">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
          <div :style="{ width: formHead[3].width }">
            <el-form-item label prop="remark">
              <el-input style="width: 140px" placeholder="请输入备注" v-model="scoreItem.remark"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="form-list" style="flex-direction: column">
        <div style="display: flex">
          <div style="font-weight: bold; margin-top: 8px">综合得分：</div>
          <div class="total-score">{{ form.score }}</div>
        </div>
        <div class="tag-list">
          <el-form-item label="判定标签：" label-width="94px" prop="tagId" size="small">
            <el-radio-group v-model="form.tagId">
              <el-radio
                size="small"
                v-for="(tagItem, tagIndex) in tagList"
                :key="tagIndex"
                :label="tagItem.id"
                border
              >{{ tagItem.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <div class="result-wrap" style="flex-direction: column">
        <div class="mb18">
          <div>
            <span style="font-weight: bold">准入结论：</span>
            <span>{{ complianceInfo.companyTypeName }} ≥ {{ complianceInfo.score }} 予以准入</span>
          </div>
          <div style="display: flex; margin: 12px 0 0 80px">
            <el-radio-group v-model="form.accessType" class="score-standard" size="small">
              <el-radio-button :label="1">拒绝准入</el-radio-button>
              <el-radio-button :label="0">予以准入</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div v-if="form.accessType === 1">
          <el-form-item label="拒绝原因总结：" label-width="122px" prop="reasonId">
            <el-select
              clearable
              style="width: 330px"
              v-model="form.reasonId"
              filterable
              @change="changeReasonId"
              placeholder="请选择拒绝原因"
            >
              <el-option
                v-for="item in refuseReasonList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <div v-if="form.reasonId" style="margin: -10px 0 0 120px; font-size: 14px">
            拒绝后
            <span style="color: #f00">{{ form.day }}</span>
            天内拒绝再次进入准入流程
          </div>
        </div>
      </div>
      <div class="mt20">
        <el-form-item label="备注：" label-width="54px" prop="remark">
          <el-input
            style="width: 400px"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="请输入备注"
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="info-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">提 交</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Apis from '@/api/modules/cooperativeOrganization'
import ApisCommon from '@/api/modules/common'
const emits = defineEmits(['handleClose', 'getList'])
const props = defineProps({
  isBlackListHit: {
    type: Boolean
  }
})
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const tagList = ref([])
const refuseReasonList = ref([])
const complianceInfo = ref({})
const formHead = [
  {
    name: '打分项',
    width: '150px'
  },
  {
    name: '评分',
    width: '140px'
  },
  {
    name: '评分标准',
    width: '90px'
  },
  {
    name: '备注',
    width: '150px'
  }
]
const form = reactive({
  score: 0,
  tagId: '',
  reasonId: '',
  accessType: 1,
  remark: '',
  scoreList: [{}],
  day: ''
})
const defaultForm = JSON.parse(JSON.stringify(form))
const rules = reactive<FormRules>({
  scoreItem: [{ required: true, message: '请输入分数', trigger: 'blur' }],
  tagId: [{ required: true, message: '请选择判定标签', trigger: 'change' }],
  reasonId: [{ required: true, message: '请选择拒绝原因', trigger: 'change' }]
})
// 拒绝原因
const changeReasonId = () => {
  form.day = form.reasonId ? refuseReasonList.value.filter(item => item.id == form.reasonId)[0].day : ''
}
// 计算总得分
const changeScore = (scoreItem: any, scoreIndex: number) => {
  form.score = 0
  const temArray = form.scoreList.filter((item, index) => scoreIndex !== index)
  const temScoreArr = Array.from(temArray, ({ score }) => score)
  temScoreArr.forEach(val => {
    form.score += Number(val)
  })
  form.score += Number(scoreItem.score)
}
const onClose = () => {
  ruleFormRef.value?.resetFields()
  emits('handleClose')
}
const doSave = () => {
  const params = {
    logId: complianceInfo.value.logId,
    ...form
  }
  const temArray = []
  params.scoreList.forEach(item => {
    const { id, json, name, score, remark } = item
    const temItem = {
      id,
      json,
      name,
      score,
      remark
    }
    temArray.push(temItem)
  })
  params.approveJson = JSON.stringify(temArray)
  // params.accessType = this.form.data.score < complianceInfo.value.score ? 1 : 0
  params.tagName = tagList.value.filter(item => item.id === form.tagId)[0].name
  params.reason = params.reasonId ? refuseReasonList.value.filter(item => item.id === form.reasonId)[0].name : ''
  delete params.scoreList
  registerApprove(params)
}
// 合规审批
const registerApprove = async (params: any) => {
  const { code, data } = await Apis.registerAuditComplianceApprove(params)
  if (code !== 200) return
  emits('getList')
  ElMessage.success('操作成功')
  onClose()
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      doSave()
    }
  })
}
const handleData = (val: any) => {
  // Object.assign(form, defaultForm)
  complianceInfo.value = val
  getInfoData()
}
// 获取数据 type 0:审批失效设置 1:准入更新配置 2:拒绝原因和准入周期设置 3:合规评分卡配置 4:机构退出原因配置 5:机构类型标准 6:判定标签
const getInfoData = async () => {
  const data3 = await ApisCommon.findConfigList({ type: 3, orgCategoryId: complianceInfo.value.orgCategoryId })
  if (data3.code !== 200) return
  const temData = data3.data || []
  temData.forEach((item: any) => {
    item.json = JSON.parse(item.json)
    item.json = item.json.filter((child: any) => child.scoreValue)
    item.remark = ''
  })
  form.scoreList = JSON.parse(JSON.stringify(temData))
  const data6 = await ApisCommon.findConfigList({ type: 6, orgCategoryId: complianceInfo.value.orgCategoryId })
  if (data6.code !== 200) return
  tagList.value = data6.data || []

  const data2 = await ApisCommon.findConfigList({ type: 2, orgCategoryId: complianceInfo.value.orgCategoryId })
  if (data2.code !== 200) return
  refuseReasonList.value = data2.data || []
}
defineExpose({
  handleData
})
</script>

<style lang="scss" scoped>
.form-wrap {
  height: calc(100% - 70px);
  overflow-y: auto;
  .form-list {
    display: flex;
    margin-top: 18px;
    border-bottom: 1px solid #eee;
  }
  .score-name {
    width: 130px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 6px;
    font-weight: bold;
  }
  .total-score {
    font-weight: bold;
    font-size: 28px;
    color: #f00;
    margin-left: 115px;
    width: 80px;
  }
  .score-icon {
    width: 24px;
    font-size: 24px;
    margin-top: 4px;
    margin-left: 22px;
    cursor: pointer;
    color: #999;
  }
  .tag-list {
    margin-top: 12px;
    margin-left: -10px;
    flex: 1;
    .el-form-item__label {
      line-height: 48px;
    }
    .el-radio {
      margin-bottom: 10px;
      margin-left: 0px;
      margin-right: 10px;
    }
    .el-radio__input {
      display: none;
    }
  }
  .result-wrap {
    display: flex;
    margin-top: 18px;
  }
  .score-standard {
    .el-radio-button .el-radio-button__inner {
      border: 1px solid #dcdfe6 !important;
      border-radius: 4px !important;
      margin-right: 12px;
      box-shadow: none !important;
    }
    .el-radio-button__inner:hover {
      color: #606266;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #fff !important;
      background: #11a144;
      border: 1px solid #11a144;
    }
    .el-radio-button:first-child .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #fff !important;
      background: #11a144;
      background: #f00 !important;
      border: 1px solid #f00 !important;
    }
  }
  .actived-standard {
    font-weight: bold;
    color: #fff;
    font-size: 16px;
    background: #11a144;
    border: 1px solid #11a144;
  }
  .no-allow {
    background: #f00 !important;
    border: 1px solid #f00 !important;
  }
}
.json-list {
  display: flex;
  height: 36px;
  line-height: 36px;
  div {
    width: 80px;
    text-align: center;
    border: 1px solid #fff;
    margin-left: -1px;
    margin-top: -1px;
  }
}
.info-footer {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
