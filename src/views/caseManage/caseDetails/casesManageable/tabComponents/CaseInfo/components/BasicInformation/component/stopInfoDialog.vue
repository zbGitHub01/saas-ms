<script setup>
import { reactive, computed } from 'vue'
import { downArrayBufferFile } from '@/api/arrayBuffer'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:dialogVisible'])

const state = reactive({
  detailData: {},
  dialog: {
    title: '暂停明细',
    show: false
  },
  leftProp: [
    {
      prop: 'reason',
      name: '暂停原因'
    },
    {
      prop: 'pauseEndTime',
      name: '暂停至'
    }
  ],
  rightProp: [
    {
      prop: 'createTime',
      name: '暂停时间'
    },
    {
      prop: 'createName',
      name: '暂停提交人'
    }
  ]
})

const pauseUrlText = computed(() => {
  return eval('(' + state.detailData.pauseUrl + ')')
})

const handleOpen = () => {
  console.log('打开前')
}

const onDownload = url => {
  downArrayBufferFile(url)
}

const close = () => {
  emit('update:dialogVisible', false)
}
</script>

<template>
  <el-dialog
    :model-value="props.dialogVisible"
    title="暂停明细"
    width="35%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="handleOpen"
    @close="close"
  >
    <div style="display: flex">
      <div style="width: 260px">
        <div v-for="item in state.leftProp" :key="item.prop" style="display: flex; margin-bottom: 12px">
          <div style="width: 70px; color: #999">{{ item.name }}：</div>
          <div>{{ state.detailData[item.prop] }}</div>
        </div>
      </div>
      <div style="margin-left: 20px">
        <div v-for="item in state.rightProp" :key="item.prop" style="display: flex; margin-bottom: 12px">
          <div style="width: 84px; color: #999">{{ item.name }}：</div>
          <div>{{ state.detailData[item.prop] }}</div>
        </div>
      </div>
    </div>
    <div style="display: flex; padding-top: 30px">
      <div style="width: 260px">
        <div style="width: 70px; color: #999; margin-bottom: 8px">暂停备注：</div>
        <div>{{ state.detailData.remark }}</div>
      </div>
      <div style="margin-left: 20px">
        <div style="width: 84px; color: #999; margin-bottom: 8px">凭证附件：</div>
        <div v-for="(item, index) in pauseUrlText" :key="index" class="item-url" @click="onDownload(item.fileUrl)">
          {{ item.fileName }}
        </div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="close">关 闭</el-button>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
:deep(.el-dialog__body) {
  padding: 10px 40px !important;
  margin: 0 !important;
  .item-url {
    width: 200px;
    border: 1px solid #ececec;
    border-radius: 50px;
    padding: 0 10px;
    overflow: hidden;
    line-height: 30px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    margin-bottom: 12px;
    cursor: pointer;
  }
}
</style>
