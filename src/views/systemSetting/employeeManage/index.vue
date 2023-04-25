<template>
  <div class="card-wrap">
    <el-tabs v-model="tabActive">
      <el-tab-pane v-if="authStore.tabVisible('ALL_EMPLOYEE')" label="所有员工" name="ALL_EMPLOYEE">
        <AllEmployees />
      </el-tab-pane>
      <el-tab-pane v-if="authStore.tabVisible('ORG_DEPT')" label="机构部门" name="ORG_DEPT">
        <OrgDepartment />
      </el-tab-pane>
      <el-tab-pane v-if="authStore.tabVisible('ORG_POSITION')" label="机构职位" name="ORG_POSITION">
        <OrgPosition />
      </el-tab-pane>
      <el-tab-pane v-if="authStore.tabVisible('ORG_ROLE')" label="机构角色" name="ORG_ROLE">
        <OrgRole />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import AllEmployees from './AllEmployees/index.vue'
import OrgDepartment from './OrgDepartment/index.vue'
import OrgPosition from './OrgPosition/index.vue'
import OrgRole from './OrgRole/index.vue'

const authStore = useAuthStore()

const tabActive = ref(authStore.tabPage.tabActive)
</script>

<style lang="scss" scoped></style>
