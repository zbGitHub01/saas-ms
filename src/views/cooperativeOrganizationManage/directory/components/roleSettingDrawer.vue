<template>
  <el-drawer v-model="drawer" size="88%" :direction="direction" :before-close="handleClose">
    <template #header>
      <h4>角色设置</h4>
    </template>
    <template #default>
      <el-table :data="state.tableData">
        <el-table-column label="角色名称" prop="name" min-width="150"></el-table-column>
        <el-table-column label="角色描述" prop="name" min-width="150"></el-table-column>
        <el-table-column label="使用人数" prop="name" min-width="150"></el-table-column>
        <el-table-column label="创建时间" prop="name" min-width="150"></el-table-column>
      </el-table>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
// import { getUserMenuPermission, addOrUpdateUserMenuPermission } from '@/api/modules/user'
const drawer = ref(false)
const direction = ref('rtl')
interface stateParams {
  [key: string]: any
  detail: any
  tableData: any[]
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
  const data = Array(10).fill({ name: '东岸科技' })
  state.tableData = data
}
defineExpose({
  open
})
</script>

<style scoped lang="scss"></style>
