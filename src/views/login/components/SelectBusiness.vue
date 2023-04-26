<template>
  <div class="select-wrap">
    <el-select v-model="tenantId">
      <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.name" :value="item.tenantId" />
    </el-select>
    <el-button class="btn" type="primary" @click="onSubmit">确 定</el-button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGlobalStore } from '@/store'

const emit = defineEmits(['setPassword'])
const router = useRouter()
const globalStore = useGlobalStore()
const tenantId = ref(null)
const tenantList = computed(() => globalStore.tenantList)
const fetchTenantList = async () => {
  const data = await globalStore.fetchTenantList()
  if (data.length) {
    tenantId.value = data[0].tenantId
  } else {
    await globalStore.logout()
    emit('setPassword', 0)
    ElMessage.error('该账号没有租户，请重新登录')
  }
}
fetchTenantList()

const onSubmit = async () => {
  const data = await globalStore.chooseTenant(tenantId.value)
  if (!data) return
  await globalStore.fetchUserInfo()
  if (data.isSetPassword === 1) {
    await router.replace('/')
  } else {
    emit('setPassword', 2)
  }
}
</script>

<style lang="scss" scoped>
.select-wrap {
  width: 400px;
}
.btn {
  width: 100%;
  height: 46px;
  box-shadow: 0 10px 20px 0 rgba(49, 120, 255, 0.35);
  margin-top: 50px;
}
</style>
