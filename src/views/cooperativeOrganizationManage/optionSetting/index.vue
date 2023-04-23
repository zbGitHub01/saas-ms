<template>
  <div class="card-wrap setting-wrap">
    <div style="width: 48%; margin-right: 2%">
      <option-setting
        ref="optionSetting"
        :state-data="categoryState"
        @get-select-list="getSelectList"
      ></option-setting>
    </div>
    <div style="width: 48%">
      <option-setting
        ref="optionSetting"
        :state-data="taskModelState"
        @get-select-list="getSelectList"
      ></option-setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import optionSetting from '../components/optionSetting/index.vue'
import Apis from '@/api/modules/cooperativeOrganization'
const categoryState = reactive({
  head: [
    {
      key: 'name',
      title: '机构分类选项'
    }
  ],
  data: [],
  type: 'ORG_CATEGORY',
  detail: {
    title: '机构分类选项',
    isForm: true,
    name: '机构分类',
    label: '机构分类:',
    placeholder: '请输入机构分类'
  }
})
const taskModelState = reactive({
  head: [
    {
      key: 'id',
      title: 'ID'
    },
    {
      key: 'name',
      title: '作业模式选项'
    }
  ],
  data: [],
  type: 'ORG_TASK_MODEL',
  detail: {
    title: '作业模式选项',
    name: '作业模式',
    label: '作业模式:',
    placeholder: '请输入作业模式'
  }
})

//获取列表数据
const getSelectList = async () => {
  let param = {
    codes: 'ORG_CATEGORY,ORG_TASK_MODEL'
  }
  const { code, data } = await Apis.optionList(param)
  if (code !== 200) return
  categoryState.data = data?.ORG_CATEGORY ?? []
  taskModelState.data = data?.ORG_TASK_MODEL ?? []
}
onMounted(async () => {
  getSelectList()
})
</script>

<style scoped lang="scss">
.setting-wrap {
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
}
</style>
