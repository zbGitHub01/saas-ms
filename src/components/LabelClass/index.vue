<script setup>
import { onBeforeMount, onMounted, computed, toRefs } from 'vue'

const props = defineProps({
  labelData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  //是否需要flex居中，默认不居中
  isSpaceAround: {
    type: Boolean,
    default: false
  },
  //是否需要背景色，默认开启
  isBkgColor: {
    type: Boolean,
    default: true
  }
})

const { isSpaceAround, isBkgColor } = toRefs(props)

const itemStyle = computed(() => {
  let styleStr = ''
  if (isSpaceAround.value && isBkgColor.value) styleStr = 'item-style isSpaceAround isBkgColor'
  if (isSpaceAround.value && !isBkgColor.value) styleStr = 'item-style isSpaceAround'
  if (!isSpaceAround.value && isBkgColor.value) styleStr = 'item-style isBkgColor'
  if (!isSpaceAround.value && !isBkgColor.value) styleStr = 'item-style'
  return styleStr
})

onBeforeMount(() => {})
onMounted(() => {})
</script>

<template>
  <div class="style-label">
    <div :class="itemStyle">
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
  align-items: center;
  flex-direction: inherit;
  margin: 0 -20px;
  // background-color: var(--color-main-bg);
  // justify-content: space-around;
}
.isSpaceAround {
  justify-content: space-around;
}
.isBkgColor {
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
