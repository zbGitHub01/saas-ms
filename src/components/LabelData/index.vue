<template>
  <div class="flx-justify-between allTab">
    <div class="flx-justify-between tab">
      <el-icon class="icon"><Memo /></el-icon>
      <div>
        <div class="title">案件数量</div>
        <div class="money">{{ labelData.money }}</div>
      </div>
    </div>
    <div class="flx-justify-between tab">
      <el-icon class="icon"><UserFilled /></el-icon>
      <div>
        <div class="title">案人人数</div>
        <div class="money">{{ labelData.money }}</div>
      </div>
    </div>
    <div class="flx-justify-between tab">
      <el-icon class="icon"><Money /></el-icon>
      <div>
        <div class="title">处置金额</div>
        <div class="money">{{ labelData.money }}</div>
      </div>
    </div>
    <div class="flx-justify-between tab">
      <el-icon class="icon"><Money /></el-icon>
      <div>
        <div class="title">已还金额</div>
        <div class="money">{{ labelData.money }}</div>
      </div>
    </div>
    <div class="flx-justify-between tab">
      <el-icon class="icon"><Money /></el-icon>
      <div>
        <div class="title">待还金额</div>
        <div class="money">{{ labelData.money }}</div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
// 接收props数据
const props = defineProps<{
  labelData: any
}>()
</script>
  
  <style lang="scss" scoped>
.allTab {
  height: 70px;
  background-color: var(--color-main-bg);
  align-items: flex-start;
  margin: 0 -20px;
  .tab {
    width: 18%;
    background-color: #ffffff;
    height: 60px;
    border-radius: 5px;
    padding: 10px;
    justify-content: flex-start;
    .icon {
      font-size: 40px;
      margin-right: 8px;
      // color: blue;
    }
    .title {
      color: #cccccc;
    }
    .money {
      font-weight: 500;
    }
  }
}
</style>
  