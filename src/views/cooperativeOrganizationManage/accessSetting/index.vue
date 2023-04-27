<template>
  <div class="card-wrap" style="display: flex; height: 100%">
    <div style="width: 18%; border-right: 1px solid #efefef" class="pr20">
      <div class="card-title mb30">机构类型</div>
      <el-tabs tab-position="right" class="custom-tabs" v-model="categoryId" @tab-click="onTypeTab">
        <el-tab-pane
          :name="String(item.id)"
          :label="item.name"
          v-for="item in categoryData"
          :key="item.id"
          lazy
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div style="width: 82%; height: 100%">
      <div class="pl20 mb20">准入策略配置</div>
      <el-tabs class="pl20" v-model="pageTabName" @tab-click="onPageTab">
        <el-tab-pane
          :name="item.value"
          :label="item.label"
          v-for="item in pageTabData"
          :key="item.label"
        ></el-tab-pane>
      </el-tabs>
      <div class="content-wrap">
        <component :is="currentTab" ref="currentTabRef" :category-id="categoryId"></component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import one from './components/one.vue'
import two from './components/two.vue'
import three from './components/three.vue'
import four from './components/four/index.vue'
import five from './components/five.vue'
import Apis from '@/api/modules/cooperativeOrganization'
const categoryId = ref('')
const categoryData = ref([])
const currentTabRef = ref()
const pageTabName = ref('one')
const pageTabData = reactive([
  {
    label: '准入审批流和时效配置',
    value: 'one'
  },
  {
    label: '准入资料配置',
    value: 'two'
  },
  {
    label: '拒绝原因和重新准入设置',
    value: 'three'
  },
  {
    label: '合规评分卡配置',
    value: 'four'
  },
  {
    label: '机构退出原因配置',
    value: 'five'
  }
])
const onTypeTab = (e: any) => {
  pageTabName.value = 'one'
  categoryId.value = e.props.name
  getTableData()
}
const onPageTab = (e?: any) => {
  pageTabName.value = e.props.name
  getTableData()
}
const currentTab = computed(() => {
  switch (pageTabName.value) {
    case 'one':
      return one
    case 'two':
      return two
    case 'three':
      return three
    case 'four':
      return four
    case 'five':
      return five
    default:
      return one
  }
})
const getOptionList = async () => {
  let param = {
    codes: 'ORG_CATEGORY'
  }
  const { code, data } = await Apis.optionList(param)
  if (code !== 200) return
  categoryData.value = data?.ORG_CATEGORY ?? []
  categoryId.value = String(categoryData.value[0].id)
  getTableData()
}
const getTableData = () => {
  nextTick(() => {
    currentTabRef.value.getConfigList(categoryId.value)
  })
}
onMounted(async () => {
  getOptionList()
})
</script>

<style scoped lang="scss">
::v-deep .custom-tabs {
  overflow-y: auto;
  height: calc(100% - 52px);
  .el-tabs__header.is-right {
    float: initial !important;
  }
  .el-tabs__nav-wrap.is-right.is-scrollable {
    padding: 0 !important;
  }
  .el-tabs__nav-prev,
  .el-tabs__nav-next {
    display: none !important;
  }
  .el-tabs__nav-scroll {
    overflow-y: auto !important;
  }
  .el-tabs__item {
    border-bottom: 1px solid #efefef;
  }
  .el-tabs__nav-wrap.is-right::after {
    width: 0px !important;
  }
}
::v-deep .el-tabs__header {
  margin-bottom: 0px !important;
}
.content-wrap {
  height: calc(100% - 82px);
  overflow-x: auto;
  border-top: 10px solid #efefef;
  border-left: 10px solid #efefef;
}
</style>
