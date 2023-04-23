<template>
  <el-drawer
    v-model="drawer"
    size="1280"
    :direction="direction"
    :before-close="handleClose"
    append-to-body
    class="compliance-detail-drawer"
  >
    <template #default>
      <div style="display: flex; height: 100%">
        <div style="width: 670px">
          <h4>机构详情</h4>
          <div class="approval-type" v-if="props.approveType !== '0'">
            <img
              :src="`/src/assets/images/approval-${Number(props.approveType)}.png`"
              alt="approveType"
            />
          </div>
          <div class="flx-align-center pt10 pb10">
            <div class="mr40">
              <span class="color-999">机构名：</span>
              {{ state.detail.orgName }}
            </div>
            <div class="mr40">
              <span class="color-999">注册人姓名：</span>
              {{ state.detail.userName }}
            </div>
            <div class="mr40">
              <span class="color-999">注册手机号：</span>
              {{ state.detail.phone }}
            </div>
          </div>
          <div style="height: calc(100% - 66px)">
            <access-data :scrollTop="260" accessId="compliance-personal-info"></access-data>
          </div>
        </div>
        <div class="pl30 pr10">
          <h4>合规判定</h4>
          <div style="height: calc(100% - 20px)">
            <compliance-info v-model:isVisible="drawer" v-if="props.approveType === '0'"></compliance-info>
            <compliance-result v-else></compliance-result>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import accessData from './../../components/accessData/index.vue'
import complianceInfo from './../../components/complianceDeter/info.vue'
import complianceResult from './../../components/complianceDeter/result.vue'
// import { getUserMenuPermission, addOrUpdateUserMenuPermission } from '@/api/modules/user'
const props = defineProps<{
  approveType: string
}>()
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
  state.detail = {
    approveType: 1
  }
  drawer.value = true
  // state.detail = detail

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
// const basicInfoDialogRef = ref()
// const onBasicInfo = () => {
//   basicInfoDialogRef.value.open()
// }
// const historyEditionRef = ref()
// const onHistoryEdition = () => {
//   const data = {}
//   historyEditionRef.value.open(data)
// }
const imgUrl = computed(() => {
  const type = Number(state.detail.approveType)
  return `@/assets/images/approval-${type}.png`
})
defineExpose({
  open
})
</script>

<style scoped lang="scss">
.color-999 {
  color: #999;
}
</style>
<style lang="scss">
.compliance-detail-drawer {
  position: relative;
  .el-drawer__header {
    margin-bottom: 0;
  }
  .el-drawer__body {
    padding-top: 0;
  }
  .approval-type {
    position: absolute;
    width: 99px;
    height: 80px;
    left: 80px;
    top: 16px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
