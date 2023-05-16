<script setup>
import { ref, reactive } from 'vue'
import labelList from '../config/labelList.js'

const props = defineProps({
  drawerFormVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:drawerFormVisible'])

const size = ref('default')
const labelPosition = ref('right')

const sizeForm = reactive({
  name: '委外处置库',
  region: [
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000'
  ],
  type: [
    '“360”借条',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟'
  ],
  caseType: '默认',
  history: '隐藏',
  caseDate: '2021-12-31',
  isAuto: '不自动收回',
  notes: '打发发发大啊达大ddddddddddddddddddddddddd大啊啊啊啊啊啊发发发',
  resource: ''
})

const handleClose = () => {
  emit('update:drawerFormVisible', false)
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
    <el-form ref="form" style="width: 90%" :model="sizeForm" label-width="auto" :label-position="labelPosition" :size="size">
      <el-form-item label="案件分库">
        <div>{{ sizeForm.name }}</div>
      </el-form-item>
      <el-form-item label="案人模型">
        <div v-for="(item, index) in sizeForm.region" :key="index" class="listStyle">
          <span>{{ item }}</span>
        </div>
      </el-form-item>
      <el-form-item label="包含产品">
        <div v-for="(item, index) in sizeForm.type" :key="index" class="listStyle">
          <span>{{ item }}</span>
        </div>
      </el-form-item>
      <div class="specialItem">
        <el-form-item width="20%" label="委案类型">
          <div>{{ sizeForm.caseType }}</div>
        </el-form-item>
        <el-form-item width="20%" label="历史处置记录">
          <div>{{ sizeForm.history }}</div>
        </el-form-item>
        <el-form-item width="20%" label="委案到期日">
          <div>{{ sizeForm.caseDate }}</div>
        </el-form-item>
        <el-form-item width="20%" label="是否自动收回">
          <div>{{ sizeForm.isAuto }}</div>
        </el-form-item>
        <el-form-item width="20%" label="备注">
          <div>{{ sizeForm.notes }}</div>
        </el-form-item>
      </div>
      <div class="spacing"></div>
      <el-form-item label="Resources" prop="resource" style="padding-top: 20px">
        <el-radio-group v-model="sizeForm.resource">
          <el-radio label="Sponsorship" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <div class="spacing"></div>
      <LabelClass :label-data="labelList" :is-bkg-color="false" :is-space-around="true" />
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
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
  background: #f2f2f2;
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
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
