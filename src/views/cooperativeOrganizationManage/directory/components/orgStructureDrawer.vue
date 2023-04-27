<template>
  <el-drawer v-model="drawer" size="88%" :direction="direction" :before-close="handleClose">
    <template #header>
      <h4>角色权限</h4>
    </template>
    <template #default>
      <el-table :data="state.tableData" row-key="id" border>
        <el-table-column label="组织架构" prop="date" min-width="150" align="center"></el-table-column>
        <el-table-column label="员工数量" prop="name" min-width="150" align="center"></el-table-column>
      </el-table>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
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
defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
