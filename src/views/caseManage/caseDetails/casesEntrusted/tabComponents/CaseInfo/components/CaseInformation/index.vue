<script setup>
import { reactive, ref, toRefs } from 'vue'
// import Api from '@/api/modules/casesManageable'
// import Tags from './component/Tags.vue'
import descriptionList from './config/descriptionList.js'
// import { ElMessage } from 'element-plus'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  }
})

// const emit = defineEmits(['getCaseInfo'])

const { messageData } = toRefs(props)

const state = reactive({
  type: 1,
  title: '',
  key: '',
  labelShow: false
})

// const moreDialog = ref(null)
const dialogVisible = ref(false)
const tagVisible = ref(false)

const open = (item, val) => {
  state.type = item
  if (val !== 7) dialogVisible.value = true
  switch (val) {
    case 2:
      state.title = 'qq'
      state.key = 'qq'
      break
    case 3:
      state.title = '邮箱'
      state.key = 'mail'
      break
    case 4:
      state.title = '单位名称'
      state.key = 'company_name'
      break
    case 5:
      state.title = '单位地址'
      state.key = 'company_addr'
      break
    case 6:
      state.title = '家庭住址'
      state.key = 'home_addr'
      break
    case 7:
      tagVisible.value = true
      console.log(tagVisible.value)
      break
    default:
      break
  }
  if (item === 2 && val != 7) {
    console.log(item, val)
    //   this.getCaseRecordList()
    // } else if (item === 1 && val === 7) {
    //   this.tagAlertList()
    // } else if (item === 2 && val === 7) {
    //   this.tagAlertlogList()
  }
}
</script>

<template>
  <div>
    <!--预警标签-->
    <!-- <Tags class="tags_style" :case-info="caseInfo" @refresh="fetchNewCaseDetail" /> -->
    <el-descriptions class="margin-top" :column="3" size="default" border>
      <el-descriptions-item v-for="(item, index) in descriptionList" :key="index" align="center">
        <template #label>
          <div class="cell-item">{{ item.label }}</div>
        </template>
        <template v-if="!['regAddrProvince', 'caseTagAlertUserList'].includes(item.prop)">
          {{ messageData[item.prop] }}
        </template>
        <template v-if="item.prop === 'regAddrProvince'">
          {{ messageData.regAddrProvince }}{{ messageData.regAddrCity }}{{ messageData.regAddrArea }}
        </template>
        <template v-if="item.prop === 'caseTagAlertUserList'">
          <span
            v-for="(cItem, cIndex) in messageData.caseTagAlertUserList"
            :key="cIndex"
            class="label_warp"
            :class="cItem.isShare === 0 ? 'share_warp' : ''"
          >
            {{ cItem.tagAlertName }}
          </span>
        </template>
        <!--更多-->
        <More v-if="item.more" ref="more" :type="item.moreType" @open="open" />
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<style scoped lang="scss">
.label_warp {
  display: inline-block;
  padding: 5px;
  background-color: rgba(217, 0, 27, 1);
  color: #fff;
  margin-right: 5px;
}
.share_warp {
  background-color: rgba(245, 154, 35, 1);
}
:deep(.el-descriptions__label) {
  width: 180px !important;
}
:deep(.el-descriptions__content) {
  width: 350px !important;
}
.tags_style {
  margin: 15px;
}
</style>
