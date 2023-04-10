<template>
  <div class="select-wrap">
    <el-select v-model="tenantId">
      <el-option v-for="item in tenantList" :key="item.tenantId" :label="item.name" :value="item.tenantId" />
    </el-select>
    <el-button class="btn" type="primary" @click="onSubmit">确 定</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Apis from '@/api/modules/user'
import { useGlobalStore } from '@/store'

const router = useRouter()
const globalStore = useGlobalStore()
const tenantId = ref(null)
const tenantList = ref([])
const fetchTenantList = async () => {
  const { code, data } = await Apis.findTenantList()
  if (code === 200 && data.length) {
    tenantList.value = data
    tenantId.value = data[0].tenantId
    console.log(data)
  }
}
fetchTenantList()

const onSubmit = async () => {
  const result = await globalStore.chooseTenant(tenantId.value)
  if (result) {
    await router.replace('/')
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
