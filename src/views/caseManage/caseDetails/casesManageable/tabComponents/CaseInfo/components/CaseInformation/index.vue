<script setup>
import { reactive, ref, toRefs } from 'vue'
import Api from '@/api/modules/casesManageable'
import More from './component/more.vue'
import MoreDialog from './component/moreDialog.vue'
import TagDialog from './component/tagDialog.vue'
import descriptionList from './config/descriptionList.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  messageData: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['getCaseInfo'])

const { messageData } = toRefs(props)

const state = reactive({
  type: 1,
  title: '',
  key: '',
  labelShow: false,
  historyData: [],
  customAlertTagList: [],
  sysAlertTagList: []
})

const moreDialog = ref(null)
const tagDialog = ref(null)
const dialogVisible = ref(false)
const tagVisible = ref(false)

const open = (item, val) => {
  state.type = item
  if (val !== 7) dialogVisible.value = true
  switch (val) {
    // case 2:
    //   state.title = 'qq'
    //   state.key = 'qq'
    //   break
    // case 3:
    //   state.title = '邮箱'
    //   state.key = 'mail'
    //   break
    // case 4:
    //   state.title = '单位名称'
    //   state.key = 'company_name'
    //   break
    // case 5:
    //   state.title = '单位地址'
    //   state.key = 'company_addr'
    //   break
    // case 6:
    //   state.title = '家庭住址'
    //   state.key = 'home_addr'
    //   break
    case 7:
      tagVisible.value = true
      break
    default:
      break
  }
  if (item === 2 && val != 7) {
    console.log(item, val)
    //   this.getCaseRecordList()
  } else if (item === 1 && val === 7) {
    tagAlertList()
  } else if (item === 2 && val === 7) {
    tagAlertLogList()
  }
}

//获取预警标签
const tagAlertList = async () => {
  state.customAlertTagList = []
  state.sysAlertTagList = []
  let params = {
    caseUserId: messageData.value.caseUserId
  }
  const { data } = await Api.getTagAlert(params)
  console.log(data)
  //假数据
  state.sysAlertTagList = [
    {
      isShare: true,
      markCount: 0,
      tagAlertId: 11,
      tagAlertName: '公检法机关'
    },
    {
      isShare: 0,
      markCount: 0,
      tagAlertId: 12,
      tagAlertName: '其他政府机关、事业单位'
    },
    {
      isShare: 0,
      markCount: 0,
      tagAlertId: 13,
      tagAlertName: '敏感职业-新闻媒体'
    }
  ]
  state.customAlertTagList = [
    {
      isShare: 0,
      markCount: 0,
      tagAlertId: 11,
      tagAlertName: '公检法机关'
    },
    {
      isShare: 0,
      markCount: 0,
      tagAlertId: 12,
      tagAlertName: '其他政府机关、事业单位'
    },
    {
      isShare: 0,
      markCount: 0,
      tagAlertId: 13,
      tagAlertName: '敏感职业-新闻媒体'
    }
  ]
}

const updateCaseInfo = async data => {
  try {
    await Api.updateCaseInfo(data)
    ElMessage.success('更新成功')
    moreDialog?.value.resetForm()
    dialogVisible.value = false
    emit('getCaseInfo')
  } catch (error) {
    console.log(error)
  }
}

//是否共享
const changeShare = val => {
  state.customAlertTagList.map(item => {
    if (item.tagAlertId === val.tagAlertId) return
    item.isShare = 0
  })
}

//历史记录分页切换
const tagAlertLogList = async (page, pageSize) => {
  const pageInfo = {
    page: page ? page : 1,
    pageSize: pageSize ? pageSize : 10,
    caseUserId: messageData.value.caseUserId
  }
  const data = await Api.caseExtLog(pageInfo)
  state.historyData = data.data
  tagDialog.value.setPage(data.page)
  tagDialog.value.setPageSize(data.pageSize)
  tagDialog.value.setPageTotal(data.total)
}

//预警标签提交
const handleCommit = async (sysAlertTagList, customAlertTagList) => {
  const newSysAlertTagList = sysAlertTagList.value.filter(item => !!item.isShare)
  const newCustomAlertTagList = customAlertTagList.value.filter(item => !!item.isShare)
  const tagAlertIdList = [...newSysAlertTagList, ...newCustomAlertTagList].map(item => item.tagAlertId)
  const postData = {
    caseUserId: messageData.value.caseUserId,
    isShare: 1,
    tagAlertIdList
  }
  try {
    await Api.updateTagAlert(postData)
    ElMessage.success('操作成功')
    tagVisible.value = false
    emit('getCaseInfo')
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
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
    <!--查看明细弹窗-->
    <MoreDialog
      ref="moreDialog"
      v-model:dialog-visible="dialogVisible"
      :title="state.title"
      :message-data="messageData"
      :type="state.type"
      @update-case-info="updateCaseInfo"
    />
    <!--预警标签-->
    <TagDialog
      v-if="tagVisible"
      ref="tagDialog"
      v-model:tag-visible="tagVisible"
      :history-data="historyData"
      :sys-alert-tag-list="state.sysAlertTagList"
      :custom-alert-tag-list="state.customAlertTagList"
      :type="state.type"
      @commit="handleCommit"
      @change-share="changeShare"
      @tag-alert-log-list="tagAlertLogList"
    />
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
</style>
