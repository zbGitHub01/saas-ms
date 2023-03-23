<template>
  <div class="card-wrap">
    <el-tabs v-model="tabActive" @tab-click="tabClick">
      <el-tab-pane label="待审批" name="1"></el-tab-pane>
      <el-tab-pane label="已拒绝/已撤销" name="2"></el-tab-pane>
      <el-tab-pane label="待结清" name="3"></el-tab-pane>
      <el-tab-pane label="已生效" name="4"></el-tab-pane>
      <el-tab-pane label="已失效" name="5"></el-tab-pane>
    </el-tabs>
    <FormWrap>
      <template #default>
        <el-form :model="searchForm">
          <el-form-item label="产品">
            <el-input v-model="searchForm.name"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </FormWrap>
    <div style="height: 4000px"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const tabActive = ref('1')
const searchForm = reactive({
  name: ''
})
const tabClick = () => {
  console.log(tabActive.value)
}
</script>

<style lang="scss" scoped></style>
