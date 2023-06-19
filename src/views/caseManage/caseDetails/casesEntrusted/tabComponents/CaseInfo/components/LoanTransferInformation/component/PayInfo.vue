<script setup>
import { reactive, computed, toRefs, onBeforeMount, onMounted } from 'vue'
import descriptionList from '../config/descriptionList.js'

const props = defineProps({
  activeName: {
    type: Number,
    default: null
  },
  messageData: {
    type: Object,
    default: () => {}
  }
})

const { messageData, activeName } = toRefs(props)

const state = reactive({
  customFieldList: []
})

const activeDescriptionList = computed(() => {
  let activeDescriptionList = []
  if (activeName.value === 1) {
    //借款周期不需要loanPeriod
    activeDescriptionList = descriptionList.filter(item => item.prop !== 'loanPeriod')
  } else {
    //activeName !== 1 时不需要展示的字段
    const arr = [
      'loanPeriodType',
      'loanPeriodNum',
      'loanPeriodDuration',
      'loanPeriodRepay',
      'loanProduct',
      'loanPlace',
      'loanProductPrice',
      'loanFirstAmount'
    ]
    activeDescriptionList = descriptionList.filter(item => !arr.includes(item.prop))
  }
  return activeDescriptionList
})

onBeforeMount(() => {})
onMounted(() => {
  let currIndex = -1
  if (!messageData.value.caseCustomFieldList) return
  messageData.value.caseCustomFieldList.forEach((item, index) => {
    if (index % 3 === 0) {
      state.customFieldList.push([item])
      currIndex++
    } else {
      state.customFieldList[currIndex].push(item)
    }
  })
})
</script>

<template>
  <div>
    <table style="width: 100%; margin-bottom: 20px" class="detail_newTable">
      <tr v-for="(item, index) in customFieldList" :key="index">
        <div v-for="(field, cIndex) in item" :key="cIndex">
          <th>{{ field.fieldName }}</th>
          <td>{{ field.fieldValue }}</td>
        </div>
      </tr>
    </table>

    <el-descriptions class="margin-top" :column="3" size="default" border>
      <el-descriptions-item v-for="(item, index) in activeDescriptionList" :key="index" align="center" width="120px">
        <template #label>
          <div class="cell-item">{{ item.label }}</div>
        </template>
        {{ messageData[item.prop] }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<style scoped lang="scss"></style>
