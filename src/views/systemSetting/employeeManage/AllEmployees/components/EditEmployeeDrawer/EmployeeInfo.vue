<template>
  <el-tabs class="tabs" :model-value="props.modelValue" @tabClick="tabClick">
    <el-tab-pane label="在职信息" name="1">
      <el-descriptions class="descriptions" :column="3">
        <el-descriptions-item label="所属部门" width="33%">{{ props.employeeInfo.deptName }}</el-descriptions-item>
        <el-descriptions-item label="工号">{{ props.employeeInfo.jobNo }}</el-descriptions-item>
        <el-descriptions-item label="在职状态">{{ dimissionConfig[props.employeeInfo.isDimission] || '' }}</el-descriptions-item>
        <el-descriptions-item label="星级">{{ starLevelList[props.employeeInfo.starLevel - 1] || '' }}</el-descriptions-item>
        <el-descriptions-item label="是否接案">
          {{ acceptCaseConfig[props.employeeInfo.isAcceptCase] || '' }}
        </el-descriptions-item>
        <el-descriptions-item label="入职日期">{{ props.employeeInfo.entryDate }}</el-descriptions-item>
        <el-descriptions-item label="离职日期">{{ props.employeeInfo.dimissionDate }}</el-descriptions-item>
        <el-descriptions-item label="合同起始日期">{{ props.employeeInfo.contractStartDate }}</el-descriptions-item>
        <el-descriptions-item label="合同结束日期">{{ props.employeeInfo.contractEndDate }}</el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
    <el-tab-pane label="个人资料" name="2">
      <el-descriptions class="descriptions" :column="3">
        <el-descriptions-item
          v-for="item in props.otherInfo.personalData"
          :key="item.label"
          :label="item.label + '：'"
          :span="item.span"
          :width="item.width"
        >
          {{ item.formType === 'select' && !!item.value ? item.data[item.value].label : item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
    <el-tab-pane label="面试考评" name="3">
      <el-descriptions class="descriptions" :column="3">
        <el-descriptions-item
          v-for="item in props.otherInfo.interviewEvaluation"
          :key="item.label"
          :label="item.label + '：'"
          :width="item.width"
          :label-class-name="item.labelClassName"
        >
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
    <el-tab-pane label="新人培训" name="4">
      <el-descriptions class="descriptions" :column="3">
        <el-descriptions-item
          v-for="item in props.otherInfo.orientation"
          :key="item.label"
          :label="item.label + '：'"
          :width="item.width"
        >
          {{ item.value }}
        </el-descriptions-item>
      </el-descriptions>
    </el-tab-pane>
    <el-tab-pane label="档案记录" name="5">
      <el-descriptions class="descriptions-block" :column="2">
        <el-descriptions-item v-for="item in props.otherInfo.caseRecordFile" :key="item.label" :label="item.label + '：'">
          <span v-if="!item.value.length">--</span>
          <el-image v-else-if="item.type === 'image'" class="card-img" :src="item.value[0].url"></el-image>
          <template v-else-if="item.type === 'file'">
            <el-button v-for="file in item.value" :key="file.url" type="primary" link @click="handleOpen(file)">{{ file.name }}</el-button>
          </template>
        </el-descriptions-item>
<!--        <el-descriptions-item label="身份证正面：" width="50%">-->
<!--          <el-image-->
<!--            class="card-img"-->
<!--            src="//asfile.donganzichan.cn/assets/image/20220623/b2a2ae4a3223435aa0cf67304658e188.gif"-->
<!--          ></el-image>-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item label="身份证反面：">-->
<!--          <el-image-->
<!--            class="card-img"-->
<!--            src="//asfile.donganzichan.cn/assets/image/20220623/b2a2ae4a3223435aa0cf67304658e188.gif"-->
<!--          ></el-image>-->
<!--        </el-descriptions-item>-->
<!--        <el-descriptions-item label="应聘面试登记表：">&#45;&#45;</el-descriptions-item>-->
<!--        <el-descriptions-item label="应聘人员问卷调查表：">&#45;&#45;</el-descriptions-item>-->
<!--        <el-descriptions-item label="面试评估表："></el-descriptions-item>-->
<!--        <el-descriptions-item label="入职登记表："></el-descriptions-item>-->
<!--        <el-descriptions-item label="工资卡确认单："></el-descriptions-item>-->
<!--        <el-descriptions-item label="薪资确认单："></el-descriptions-item>-->
<!--        <el-descriptions-item label="承诺书："></el-descriptions-item>-->
<!--        <el-descriptions-item label="劳动合同："></el-descriptions-item>-->
<!--        <el-descriptions-item label="保密协议："></el-descriptions-item>-->
<!--        <el-descriptions-item label="签收单："></el-descriptions-item>-->
<!--        <el-descriptions-item label="员工行为守则："></el-descriptions-item>-->
<!--        <el-descriptions-item label="质量管理责任制度："></el-descriptions-item>-->
<!--        <el-descriptions-item label="近一年的社保缴纳记录/工资流水："></el-descriptions-item>-->
<!--        <el-descriptions-item label="征信报告："></el-descriptions-item>-->
<!--        <el-descriptions-item label="离职证明："></el-descriptions-item>-->
<!--        <el-descriptions-item label="体检报告："></el-descriptions-item>-->
      </el-descriptions>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref } from 'vue'

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
const dimissionConfig = ['在职', '离职']
const starLevelList = ['1星', '2星', '3星', '4星', '5星']
const acceptCaseConfig = ['否', '是']
const tabClick = val => {
  emit('update:modelValue', val.paneName)
}
const handleOpen = file => {
  window.open(file.url)
}
</script>

<style lang="scss" scoped>
.tabs {
  :deep(.el-tabs__active-bar) {
    transition: none;
  }
}
.descriptions {
  :deep(.el-descriptions__label) {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  :deep(.w100) {
    width: 112px;
    margin-left: -13px;
  }
}
.descriptions-block {
  :deep(.el-descriptions__content) {
    display: block;
    margin-top: 10px;
  }
}
.card-img {
  width: 230px;
  height: 120px;
}
</style>
