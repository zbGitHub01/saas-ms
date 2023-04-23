<template>
  <div>
    <el-drawer
      v-model="drawer"
      size="88%"
      :direction="direction"
      :before-close="handleClose"
      append-to-body
    >
      <template #header>
        <h4>机构详情</h4>
      </template>
      <template #default>
        <div class="flx-align-center pb10">
          <div class="w33">
            <span class="color-999">机构名：</span>
            {{ state.detail.orgName }}
          </div>
          <div class="w33">
            <span class="color-999">注册人姓名：</span>
            {{ state.detail.userName }}
          </div>
          <div class="w33">
            <span class="color-999">注册手机号：</span>
            {{ state.detail.phone }}
          </div>
        </div>
        <div class="flx-align-center">
          <h3>基础合作信息</h3>
          <el-divider content-position="right" style="flex: 1">
            <el-button type="primary" plain round @click="onBasicInfo">编辑</el-button>
          </el-divider>
        </div>
        <div class="flx-align-center pb4">
          <div class="w33">
            <span class="color-999">机构分类：</span>
            {{ state.detail.orgName }}
          </div>
          <div class="w33">
            <span class="color-999">委外经理：</span>
            {{ state.detail.userName }}
          </div>
          <div class="w33">
            <span class="color-999">对接邮箱：</span>
            {{ state.detail.phone }}
          </div>
        </div>
        <div class="flx-align-center pb10">
          <div class="w33">
            <span class="color-999">作业模式：</span>
            {{ state.detail.orgName }}
          </div>
          <div class="w33">
            <span class="color-999">备注：</span>
            {{ state.detail.orgName }}
          </div>
          <div class="w33">
            <span class="color-999">限制IP地址：</span>
            {{ state.detail.userName }}
          </div>
        </div>
        <div class="flx-align-center">
          <h3>准入资料</h3>
          <el-divider content-position="right" style="flex: 1">
            <el-button type="primary" plain round @click="onHistoryEdition">查看历史准入版本</el-button>
          </el-divider>
        </div>
        <div class="flx-align-center pb10">
          <div class="w25">
            <span class="color-999">评定标签：</span>
            {{ state.detail.orgName }}
          </div>
          <div class="w25">
            <span class="color-999">准入时间：</span>
            {{ state.detail.userName }}
          </div>
          <div class="w25">
            <span class="color-999">合规审批人：</span>
            {{ state.detail.userName }}
          </div>
          <div class="w25">
            <span class="color-999">终审人：</span>
            {{ state.detail.userName }}
          </div>
        </div>
        <div style="height: calc(100% - 220px)">
          <access-data :scrollTop="420" accessId="org-personal-info"></access-data>
        </div>
      </template>
    </el-drawer>
    <basic-info-dialog ref="basicInfoDialogRef"></basic-info-dialog>
    <history-edition ref="historyEditionRef"></history-edition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import basicInfoDialog from './basicInfoDialog.vue'
import historyEdition from './historyEdition.vue'
import accessData from './../../components/accessData/index.vue'
// import { getUserMenuPermission, addOrUpdateUserMenuPermission } from '@/api/modules/user'
const drawer = ref(false)
const direction = ref('rtl')
interface User {
  id: number
  date: string
  name: string
  address: string
  hasChildren?: boolean
  children?: User[]
}
interface stateParams {
  [key: string]: any
  detail: any
  tableData: User[]
}
const state = reactive<stateParams>({
  detail: {},
  tableData: [],
  value4: []
})
const handleClose = () => {
  drawer.value = false
}
const open = (detail: any) => {
  drawer.value = true
  state.detail = detail
  getUserList()
}

const getUserList = async () => {
  // const { code, data } = await getUserMenuPermission({
  //   globalUserUuid: state.detail.globalUserUuid,
  //   roleId: state.detail.roleId
  // })
  // if (code !== 200) return
  state.tableData = [
    {
      id: 1,
      date: '2016-05-02',
      name: 'wangxiaohu',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      id: 2,
      date: '2016-05-04',
      name: 'wangxiaohu',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      id: 3,
      date: '2016-05-01',
      name: 'wangxiaohu',
      address: 'No. 189, Grove St, Los Angeles',
      children: [
        {
          id: 31,
          date: '2016-05-01',
          name: 'wangxiaohu',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          id: 32,
          date: '2016-05-01',
          name: 'wangxiaohu',
          address: 'No. 189, Grove St, Los Angeles'
        }
      ]
    },
    {
      id: 4,
      date: '2016-05-03',
      name: 'wangxiaohu',
      address: 'No. 189, Grove St, Los Angeles'
    }
  ]
}
const basicInfoDialogRef = ref()
const onBasicInfo = () => {
  basicInfoDialogRef.value.open()
}
const historyEditionRef = ref()
const onHistoryEdition = () => {
  const data = {}
  historyEditionRef.value.open(data)
}
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.color-999 {
  color: #999;
}
.w33 {
  width: 33%;
}
.w25 {
  width: 25%;
}
</style>
