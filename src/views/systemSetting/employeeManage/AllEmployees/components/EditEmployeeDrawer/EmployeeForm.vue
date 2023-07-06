<template>
  <el-form class="form" :model="form" label-width="110" inline>
    <el-tabs class="tabs" :model-value="props.modelValue" @tabClick="tabClick">
      <el-tab-pane label="在职信息" name="1">
        <el-form-item label="所属部门">
          <el-cascader
            ref="cascaderRef"
            v-model="form.deptId"
            :options="deptTree"
            :props="{ checkStrictly: true, label: 'itemText', value: 'itemId' }"
            clearable
            placeholder="请选择所属部门"
            @change="deptChange"
          />
        </el-form-item>
        <div>
          <el-form-item label="工号">
            <el-input v-model="form.jobNo" placeholder="请输入工号" />
          </el-form-item>
          <el-form-item label="在职状态">
            <el-select v-model="form.isDimission" placeholder="请选择在职状态">
              <el-option label="在职" :value="0"></el-option>
              <el-option label="离职" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="星级">
            <el-select v-model="form.starLevel" placeholder="请选择星级">
              <el-option label="1星" :value="1"></el-option>
              <el-option label="2星" :value="2"></el-option>
              <el-option label="3星" :value="3"></el-option>
              <el-option label="4星" :value="4"></el-option>
              <el-option label="5星" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否接案">
            <el-select v-model="form.isAcceptCase" placeholder="请选择是否接案">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入职日期">
            <el-date-picker v-model="form.entryDate" value-format="YYYY-MM-DD" type="date" placeholder="请选择入职日期" />
          </el-form-item>
          <el-form-item label="离职日期">
            <el-date-picker v-model="form.dimissionDate" value-format="YYYY-MM-DD" type="date" placeholder="请选择离职日期" />
          </el-form-item>
          <el-form-item label="合同起始日期">
            <el-date-picker
              v-model="form.contractStartDate"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择合同起始日期"
            />
          </el-form-item>
          <el-form-item label="合同结束日期">
            <el-date-picker
              v-model="form.contractEndDate"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择合同结束日期"
            />
          </el-form-item>
        </div>
      </el-tab-pane>
      <el-tab-pane label="个人资料" name="2">
        <el-form-item v-for="item in props.otherInfo.personalData" :key="item.label" :label="item.label">
          <el-input v-if="item.formType === 'text'" v-model="item.value" :placeholder="'请输入' + item.label" />
          <el-date-picker
            v-else-if="item.formType === 'date'"
            v-model="item.value"
            value-format="YYYY-MM-DD"
            type="date"
            :placeholder="'请选择' + item.label"
          />
          <el-select v-else-if="item.formType === 'select'" v-model="item.value" :placeholder="'请选择' + item.label">
            <el-option v-for="option in item.data" :key="option.value" :label="option.label" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="面试考评" name="3">
        <el-form-item v-for="item in props.otherInfo.interviewEvaluation" :key="item.label" :label="item.label">
          <el-input v-model="item.value" :placeholder="'请输入' + item.label" />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="新人培训" name="4">
        <el-form-item v-for="item in props.otherInfo.orientation" :key="item.label" :label="item.label">
          <el-input v-if="item.formType === 'text'" v-model="item.value" :placeholder="'请输入' + item.label" />
          <el-date-picker
            v-else-if="item.formType === 'date'"
            v-model="item.value"
            value-format="YYYY-MM-DD"
            type="date"
            :placeholder="'请选择' + item.label"
          />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="档案记录" name="5">
        <el-row>
          <el-col :span="12">
            <template v-for="(item, index) in props.otherInfo.caseRecordFile" :key="item.label">
              <el-form-item v-if="index % 2 === 0" class="label-block" :label="item.label">
                <UploadImg
                  v-if="item.type === 'image'"
                  v-model:image-file="item.value[0]"
                  width="230px"
                  height="120px"
                  @check-validate="uploadImageChange(item)"
                >
                  <template #empty>
                    <el-icon><Picture /></el-icon>
                    <span>请上传身份证正面</span>
                  </template>
                </UploadImg>
                <UploadFile v-else-if="item.type === 'file'" v-model:file-list="item.value" :limit="0"></UploadFile>
              </el-form-item>
            </template>
          </el-col>
          <el-col :span="12">
            <template v-for="(item, index) in props.otherInfo.caseRecordFile" :key="item.label">
              <el-form-item v-if="index % 2 === 1" class="label-block" :label="item.label">
                <UploadImg
                  v-if="item.type === 'image'"
                  v-model:image-file="item.value[0]"
                  width="230px"
                  height="120px"
                  @check-validate="uploadImageChange(item)"
                >
                  <template #empty>
                    <el-icon><Picture /></el-icon>
                    <span>请上传身份证反面</span>
                  </template>
                </UploadImg>
                <UploadFile v-else-if="item.type === 'file'" v-model:file-list="item.value" :limit="0"></UploadFile>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { useCommonStore } from '@/store/modules/common'
import { UploadImg, UploadFile } from '@/components/Upload'

const commonStore = useCommonStore()
const deptTree = computed(() => commonStore.dropdownList.DEPT_TREE)

const props = defineProps({
  modelValue: {
    type: String,
    default: '1'
  },
  employeeInfo: {
    type: Object,
    default: () => {
      return {}
    }
  },
  otherInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['update:modelValue'])

const cascaderRef = ref()
const tabClick = val => {
  emit('update:modelValue', val.paneName)
}
const form = reactive({
  deptId: null,
  deptName: null,
  jobNo: null,
  isDimission: null,
  starLevel: null,
  isAcceptCase: null,
  entryDate: null,
  dimissionDate: null,
  contractStartDate: null,
  contractEndDate: null
})
const deptChange = () => {
  form.deptName = cascaderRef.value.getCheckedNodes()[0].label
}
const setForm = () => {
  // if (props.employeeInfo.deptId) {
  //   form.deptId = getPathByKey(props.employeeInfo.deptId, deptTree.value).map(item => item.id)
  // }
  form.deptId = props.employeeInfo.deptId
  form.deptName = props.employeeInfo.deptName
  form.jobNo = props.employeeInfo.jobNo
  form.isDimission = props.employeeInfo.isDimission
  form.starLevel = props.employeeInfo.starLevel
  form.isAcceptCase = props.employeeInfo.isAcceptCase
  form.entryDate = props.employeeInfo.entryDate
  form.dimissionDate = props.employeeInfo.dimissionDate
  form.contractStartDate = props.employeeInfo.contractStartDate
  form.contractEndDate = props.employeeInfo.contractEndDate
}
const uploadImageChange = item => {
  if (!item.value[0]) {
    item.value.splice(0, 1)
  }
}
defineExpose({ form, setForm })
</script>

<style lang="scss" scoped>
.form {
  :deep(.el-input) {
    width: 210px;
  }
  :deep(.el-form-item) {
    margin-right: 70px;
  }
}
.form-item-block {
  display: flex;
}
.label-block {
  display: block;
  :deep(.el-form-item__label) {
    justify-content: flex-start;
    width: 100% !important;
  }
}
.tabs {
  :deep(.el-tabs__active-bar) {
    transition: none;
  }
}
</style>
