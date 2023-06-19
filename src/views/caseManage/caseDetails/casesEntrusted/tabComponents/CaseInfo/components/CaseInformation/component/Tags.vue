<script setup>
import { toRefs, ref, reactive } from 'vue'
// import { findBusinessInfo, tagAlertall, tagAlertlogList, tagAlertsave } from '@/api/casedetails'
// 客服接触次数
// export function findBusinessInfo(params) {
//   return request({
//     url: "/quality/complaint/getBusinessInfoByCaseUserId",
//     method: "get",
//     params
//   });
// }

//预警标签不分页
// export function tagAlertall(data) {
//   return request({
//     url: "/caseCenter/case/tagAlert/log/list/all",
//     method: "get",
//     params: data
//   });
// }

//预警标签历史记录
// export function tagAlertlogList(data) {
//   return request({
//     url: "/caseCenter/case/tagAlert/log/list",
//     method: "get",
//     params: data
//   });
// }

//添加记录
// export function tagAlertsave(data) {
//   return request({
//     url: "caseCenter/case/tagAlert/save",
//     method: "post",
//     data
//   });
// }

const props = defineProps({
  caseInfo: {
    type: Object,
    default: () => {
      return {
        caseTagAlertUserList: []
      }
    }
  },
  caseId: {
    type: Number,
    default: null
  }
})

const { caseInfo } = toRefs(props)

const state = reactive({
  // 客服接触数
  serviceInfo: {
    count: 0,
    appealTypeList: []
  },
  formData: {
    tagAlertId: null
  },
  tagList: [],
  historyList: [],
  total: 0,
  page: 1,
  pageSize: 10
})

const settingTagShow = ref(false)
const historyShow = ref(false)
const form = ref(null)

const handleClick = type => {
  console.log(type)
  if (type) historyShow.value = true
  else settingTagShow.value = true
}

const fetchBusinessInfo = async () => {
  // const { code, data } = await findBusinessInfo({ caseUserId: this.caseId })
  // if (code === 200) {
  //   this.serviceInfo.count = data.num
  //   this.serviceInfo.appealTypeList = data.businessInfoByCaseUserIdVOList
  // }
}
const fetchTagAlertList = async () => {
  // const { code, data } = await tagAlertall()
  // if (code === 200) {
  //   this.tagList = data
  // }
}
//获取预警标签历史
const fetchTagHistoryList = async () => {
  let params = {
    caseUserId: this.caseInfo.caseUserId,
    page: this.page,
    pageSize: this.pageSize
  }
  // const { code, data } = await tagAlertlogList(params)
  // console.log(data, '----history')
  // if (code === 200) {
  //   this.historyList = data.data
  //   this.total = data.total
  // }
}
const onSubmit = async () => {
  const postData = {
    caseUserId: this.caseInfo.caseUserId,
    operateStatus: 2,
    tagAlertId: this.formData.tagAlertId
  }
  // const { code } = await tagAlertsave(postData)
  // if (code === 200) {
  //   this.onCancel()
  //   this.$emit('refresh')
  // }
}

const onCancel = () => {
  form.value.resetFields()
  settingTagShow.value = false
}

fetchBusinessInfo()
fetchTagAlertList()
</script>

<template>
  <div class="tag-wrap">
    <div v-if="caseInfo.isHistoryComplaint === 1" class="complaint-history tip-text">
      <i class="el-icon-s-opportunity tip-icon"></i>
      <span>有投诉历史</span>
    </div>
    <el-divider v-if="caseInfo.isHistoryComplaint === 1" direction="vertical"></el-divider>
    <div v-if="!!state.serviceInfo.count" v-auth="'cpe_case_mng_info_service_count'" class="tag-box">
      <div class="complaint-service tip-text">
        <i class="el-icon-phone tip-icon"></i>
        <span>180天内客服接触次数：{{ serviceInfo.count }}</span>
      </div>
      <el-popover placement="top" trigger="hover">
        <el-table :data="serviceInfo.appealTypeList" :show-header="false">
          <el-table-column width="160" property="createTime"></el-table-column>
          <el-table-column width="140" property="workTypeText"></el-table-column>
        </el-table>
        <template #reference>
          <span class="look-type">查看诉求类型</span>
        </template>
      </el-popover>
      <el-divider style="margin-top: 6px" direction="vertical"></el-divider>
    </div>
    <div class="tag-box">
      <div v-for="tag in caseInfo.caseTagAlertUserList" :key="tag.tagAlertId" class="tag-item">
        <div class="tip-text" :style="{ backgroundColor: tag.isShare ? '#d9001b' : '#ff9921' }">
          <svg-icon class="tip-icon" icon-class="tag" />
          <span>{{ tag.tagAlertName }}</span>
        </div>
        <span class="flag">标记次数×{{ tag.markCount }}</span>
      </div>
      <el-dropdown placement="bottom-start" @command="handleClick">
        <el-button icon="Plus" style="padding: 6px"></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="0">
              <i class="el-icon-edit-outline"></i>
              标记标签
            </el-dropdown-item>
            <el-dropdown-item :command="1">
              <i class="el-icon-chat-dot-round"></i>
              历史记录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog v-model="historyShow" title="历史记录" width="650px" @open="fetchTagHistoryList">
      <div class="dialog-container">
        <el-table :data="historyList">
          <el-table-column prop="createTime" label="标记时间" align="canter" width="160" />
          <el-table-column prop="orgTitle" label="处置机构" align="canter" />
          <el-table-column prop="createName" label="cpe" align="canter" width="100" />
          <el-table-column prop="tagAlertName" label="标记标签" align="canter" />
        </el-table>
        <pagination v-model:page="page" v-model:limit="pageSize" :total="total" @pagination="fetchTagHistoryList" />
      </div>
    </el-dialog>
    <el-dialog v-model="settingTagShow" title="预警标签" width="500px">
      <div class="dialog-container">
        <el-form ref="form" :model="state.formData" style="margin-left: 80px">
          <el-form-item label="标签内容" prop="tagAlertId">
            <el-select v-model="state.formData.tagAlertId" clearable filterable>
              <el-option v-for="item in tagList" :key="item.tagAlertId" :value="item.tagAlertId" :label="item.tagAlertName" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.tag-wrap {
  display: flex;
  align-items: center;
  .tag-box {
    display: flex;
    align-items: center;
  }
}
.complaint-service {
  background-color: #f77896;
}
.complaint-history {
  background: #ff9921;
}
.tip-text {
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
}
.tip-icon {
  margin-right: 4px;
  font-size: 16px;
}
.look-type {
  color: #f77896;
  font-size: 14px;
  line-height: 28px;
  margin-left: 10px;
  cursor: pointer;
}
.tag-box {
  display: flex;
  font-size: 14px;
  align-items: center;
  .tag-item {
    display: flex;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
  .flag {
    margin-left: 6px;
    line-height: 28px;
    color: #999;
  }
}
</style>
