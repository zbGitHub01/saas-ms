<script setup>
import { ref, reactive, computed } from 'vue'
import useCaseStore from '@/store/modules/caseInfo.js'
import Api from '@/api/modules/casesManageable'
import TagTipsHeader from './tagTipsHeader/index.vue'
import componentsObj from './components/index.js'

const caseInfoStore = useCaseStore()

const state = reactive({
  messageData: {}
})

const getCaseInfoData = async () => {
  const { data } = await Api.getCaseInfoList({ caseId: caseInfoStore?.caseId })
  state.messageData = data
}
getCaseInfoData()

//判断组件传值是否为空 解决异步传值组件渲染取不到props值的问题
const isEmpty = computed(() => Object.keys(state.messageData).length > 0)

const activeNames = ref(['1', '2', '3', '4', '5'])

const handleChange = val => {
  console.log(val)
}
</script>

<template>
  <div>
    <!--标签提示块-->
    <TagTipsHeader :message-data="state.messageData" />
    <!--信息板块-->
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="基础信息" name="1">
        <component :is="componentsObj['BasicInformation']" v-if="isEmpty" :message-data="state.messageData"></component>
      </el-collapse-item>
      <el-collapse-item title="案人资料" name="2">
        <component
          :is="componentsObj['CaseInformation']"
          v-if="isEmpty"
          :message-data="state.messageData"
          @get-case-info="getCaseInfoData"
        ></component>
      </el-collapse-item>
      <el-collapse-item title="联系方式" name="3">
        <component :is="componentsObj['ContactInformation']"></component>
      </el-collapse-item>
      <el-collapse-item title="借款/转让信息" name="4">
        <component :is="componentsObj['LoanTransferInformation']" v-if="isEmpty" :message-data="state.messageData"></component>
      </el-collapse-item>
      <el-collapse-item title="处置金额/还款方式" name="5">
        <component :is="componentsObj['DisposalRepayInformation']" v-if="isEmpty" :message-data="state.messageData"></component>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: bold;
  &::before {
    content: '';
    height: 30px;
    width: 10px;
    border-left: 3px solid #02a7f0;
  }
}
</style>
