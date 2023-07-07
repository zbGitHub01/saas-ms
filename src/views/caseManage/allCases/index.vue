<template>
  <div class="card-wrap">
    <el-tabs class="mb16" v-model="tabActive">
      <el-tab-pane v-if="authStore.tabVisible('MANAGE_CASE')" label="可管理案件" name="MANAGE_CASE">
        <ManageableCases />
      </el-tab-pane>
      <el-tab-pane v-if="authStore.tabVisible('ENTRUST_CASE')" label="已委托案件" name="ENTRUST_CASE">
        <EntrustedCases />
      </el-tab-pane>
      <el-tab-pane v-if="authStore.tabVisible('APPOINT_DISPOSE_CASE')" label="委派处置案件" name="APPOINT_DISPOSE_CASE">
        <DelegatedCases />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ManageableCases from './ManageableCases/index.vue'
import EntrustedCases from './EntrustedCases/index.vue'
import DelegatedCases from './DelegatedCases/index.vue'
import { useAuthStore } from '@/store/modules/auth'
const authStore = useAuthStore()
const tabActive = ref(authStore.tabPage.tabActive || '')
</script>

<style lang="scss" scoped></style>
