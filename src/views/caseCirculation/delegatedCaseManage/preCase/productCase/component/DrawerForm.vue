<script setup>
import { ref, reactive, toRefs } from 'vue'
import AddCorporation from './AddCorporation.vue'
import deepCopy from '@/utils/deepCopy.js'
import DragTable from './dragTable.vue'
import labelList from '../config/labelList.js'

const props = defineProps({
  drawerFormVisible: {
    type: Boolean,
    default: false
  },
  sizeForm: {
    type: Object,
    default: () => {}
  },
  //机构数组
  tableData: {
    type: Array,
    default: () => []
  }
})

const { sizeForm } = toRefs(props)

const emit = defineEmits(['update:drawerFormVisible', 'caseCfgSave'])

const size = ref('default')
const labelPosition = ref('right')

const state = reactive({
  newTableData: [] //新添加的机构数组
})
const { tableData } = toRefs(props)

const dragTables = ref()
const addCorporation = ref()

const onSubmit = () => {
  const dataObj = deepCopy(dragTables.value.dataArr, true)
  dataObj.map(item => (item.area = item.area.join(',')))
  const data = {
    entrustId: sizeForm.value.entrustId,
    entrustInfoList: dataObj
  }
  emit('caseCfgSave', data)
}

//取消配置
const handleClose = () => {
  //退出配置重置机构数组
  state.newTableData = []
  addCorporation.value.resetRightValue()
  emit('update:drawerFormVisible', false)
}

//删除本地新添加的机构
const updateNewTableData = val => {
  state.newTableData = state.newTableData.filter(item => item.orgId !== val.orgId)
}

const dialogVisible = ref(false)

const handleAddCorporation = () => {
  dialogVisible.value = true
}

const handleSubmit = arr => {
  state.newTableData = arr
  dialogVisible.value = false
}
</script>

<template>
  <el-drawer
    :model-value="props.drawerFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    size="90%"
    @close="handleClose"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">
        <el-icon class="closeClass" @click="close"><ArrowLeft /></el-icon>
        委案配置
      </h4>
    </template>
    <el-form ref="form" style="width: 90%" label-width="auto" :label-position="labelPosition" :size="size">
      <el-form-item label="案件分库">
        <div>{{ sizeForm.storeName || '' }}</div>
      </el-form-item>
      <el-form-item label="委案产品">
        <div v-for="(item, index) in sizeForm.productList" :key="index" class="listStyle">
          <span>{{ item }}</span>
        </div>
      </el-form-item>
      <div class="specialItem">
        <el-form-item width="20%" label="委案类型">
          <div>{{ sizeForm.entrustType }}</div>
        </el-form-item>
        <el-form-item width="20%" label="历史处置记录">
          <div>{{ sizeForm.isHideHisFollowRecord === 0 ? '不隐藏' : '隐藏' }}</div>
        </el-form-item>
        <el-form-item width="20%" label="委案到期日">
          <div>{{ sizeForm.recoverDate || '' }}</div>
        </el-form-item>
        <el-form-item width="20%" label="是否自动收回">
          <div>{{ sizeForm.isAutoRecycle === 0 ? '不自动收回' : '自动收回' }}</div>
        </el-form-item>
        <el-form-item width="20%" label="备注">
          <div>{{ sizeForm.remark }}</div>
        </el-form-item>
      </div>
      <div class="spacing"></div>
      <LabelClass :label-data="labelList" :is-bkg-color="false" :is-space-around="true" />
      <div class="line"></div>
      <DragTable ref="dragTables" :table-data="tableData" :new-table-data="state.newTableData" @del-org="updateNewTableData" />
      <el-form-item style="margin-top: 20px">
        <el-button type="primary" icon="Plus" plain @click="handleAddCorporation">添加机构</el-button>
        <el-button type="primary" plain>导入委案计划</el-button>
        <el-button type="primary" link>下载导入模板</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <!--添加机构弹窗-->
  <AddCorporation ref="addCorporation" v-model:dialog-visible="dialogVisible" @submit="handleSubmit" />
</template>

<style lang="scss" scoped>
.closeClass {
  position: relative;
  top: 2px;
  margin-right: 20px;
  cursor: pointer;
}
.listStyle {
  margin-bottom: 10px;
  padding: 0 10px;
  color: #4d7cfe;
  border: 1px solid #02a7f0;
  border-radius: 5px;
  &:not(:last-child) {
    margin-right: 10px;
  }
}
.specialItem {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  :deep(.el-form-item) {
    width: 20%;
    .el-form-item__content {
      align-items: normal;
      word-break: break-all;
    }
  }
}
:deep(.el-form-item__label) {
  color: #aaaaaa;
  font-weight: bolder;
}
:deep(.el-input__wrapper) {
  width: 100%;
}
.line {
  margin-bottom: 30px;
  width: 100%;
  height: 1px;
  border: 1px dashed #aaaaaa;
}
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
.svg-span {
  display: flex;
  width: 50px !important;
  height: 100% !important;
  margin: 0 10px 0 -12px;
  align-items: center;
  background: #f2f2f2;
  svg {
    height: 60% !important;
  }
}
:deep(.el-table) {
  --el-table-border: none;
  .el-table__row {
    margin-bottom: 20px;
  }
  .el-table__row > .el-table__cell {
    &:not(:first-child) > .cell {
      height: 100%;
      border-top: 2px solid #e0dddd;
      border-bottom: 2px solid #e0dddd;
      & .col-style {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        height: 50px;
      }
    }
    &:first-child + .el-table__cell > .cell {
      border-left: 2px solid #e0dddd;
      & > div > span:first-child {
        width: 40px;
        height: 60%;
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
    &:last-child > .cell {
      border-right: 2px solid #e0dddd;
    }
  }
}
.el-form > .el-form-item:last-child {
  :deep(.el-form-item__content) {
    justify-content: flex-end;
  }
}
.radio-style {
  margin-right: 10px;
  border-radius: 5px;
  :deep(.el-radio-button__inner) {
    color: #02a7f0;
    border-radius: 5px;
    border: 1px solid #02a7f0;
  }
  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    background: #02a7f0 !important;
    color: white !important;
  }
}
</style>
