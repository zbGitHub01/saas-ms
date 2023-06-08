<script setup>
import { reactive, ref } from 'vue'
import More from './component/more.vue'
import MoreDialog from './component/moreDialog.vue'
import TagDialog from './component/tagDialog.vue'
import descriptionList from './config/descriptionList.js'

const messageData = {
  userName: '王尼玛',
  idno: '5113811987******18',
  sex: '	男',
  ethnicity: '汉族',
  marital: '已婚',
  regAddrProvince: '四川省',
  regAddrCity: '东州市',
  regAddrArea: '不知道哪区',
  regAddr: '四川省南充市阆中市彭城镇白安村*组**号',
  qq: '1402266051',
  mail: '1402266051@qq.com',
  companyName: '崇州诚信汽修厂',
  companyAddr: '四川省成都市崇州市崇阳镇金盆地大道***号',
  post: '维修部',
  homeAddr: '四川省成都市崇州市崇阳镇兰岛*栋三单元*号',
  caseTagAlertUserList: [
    { tagAlertName: '欠款', isShare: 0 },
    { tagAlertName: '信誉差', isShare: 1 }
  ]
}
const state = reactive({
  type: 1,
  title: '',
  key: '',
  labelShow: false
})

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
    <el-descriptions class="margin-top" :column="3" size="default" border>
      <el-descriptions-item v-for="(item, index) in descriptionList" :key="index">
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
    <MoreDialog v-model:dialog-visible="dialogVisible" :title="state.title" :type="state.type" />
    <!--预警标签-->
    <TagDialog v-model:tag-visible="tagVisible" :type="state.type" />
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
</style>
