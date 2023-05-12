<script setup>
import { onBeforeMount, onMounted } from 'vue'

const props = defineProps({
  labelData: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

onBeforeMount(() => {})
onMounted(() => {})
</script>

<template>
  <div class="style-label">
    <div class="item-style">
      <div v-for="(item, index) in props.labelData" :key="index" class="item_warp">
        <div class="img_warp">
          <el-icon v-if="!!item.eplusIcon">
            <component :is="item.eplusIcon"></component>
          </el-icon>
          <svg-icon v-else style="width: 100%; height: 100%" :name="item.customizeIcon" />
        </div>
        <div class="title_warp">
          <div class="items">{{ item.labelTitle }}</div>
          <div class="item items1">{{ item.isHaveRmbSign ? '￥' : '' }}{{ item.value || 0 }}</div>
        </div>
      </div>
    </div>
    <div class="spacing"></div>
  </div>
</template>
<style scoped lang="scss">
.item-style {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  flex-direction: inherit;
  margin: 0 -20px;
  background-color: var(--color-main-bg);
}
.style-label {
  border-radius: 5px;
  .item_warp {
    width: 19%;
    height: 94px;
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
    // box-shadow: 0px 0px 8px 2px lightgrey;
    &:nth-child(2n) {
      margin: 0 20px;
    }
    .img_warp {
      display: inline-block;
      line-height: 35px;
      width: 15.6%;
      height: 50px;
      margin-right: 20px;
      img {
        width: 35px;
        height: 35px;
      }
    }
    .title_warp {
      display: inline-block;
      height: 50px;
      width: 70%;
      vertical-align: top;
      .items {
        width: 100%;
        height: 50%;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 25px;
      }
      .items1 {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
}
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
