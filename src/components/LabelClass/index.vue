<script setup>
import { onBeforeMount, onMounted, computed, toRefs } from 'vue'

const props = defineProps({
  labelData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  //是否需要flex居中，默认居中
  isSpaceAround: {
    type: Boolean,
    default: true
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

//金额千分位格式化
const amountFormat = value => {
  console.log(value.toLocaleString())
  return value ? Number(value).toLocaleString() : value
}

onBeforeMount(() => {})

//动态计算labelItem的宽度
onMounted(() => {
  const labelItemParArr = document.getElementsByClassName('item-style')
  for (let i = 0; i <= labelItemParArr.length - 1; i++) {
    for (let j = 0; j <= labelItemParArr[i].getElementsByClassName('item_warp').length - 1; j++) {
      labelItemParArr[i].getElementsByClassName('item_warp')[j].style.width = `${
        100 / labelItemParArr[i].getElementsByClassName('item_warp').length
      }%`
    }
  }
})
</script>

<template>
  <div class="style-label">
    <div :class="itemStyle">
      <div v-for="(item, index) in props.labelData" :key="index" class="item_warp">
        <div class="img_warp">
          <el-icon v-if="!!item.eplusIcon" class="icon">
            <component :is="item.eplusIcon"></component>
          </el-icon>
          <svg-icon v-else style="width: 100%; height: 100%" :name="item.customizeIcon" />
        </div>
        <div class="title_warp">
          <div class="items">{{ item.labelTitle }}</div>
          <div class="item items1">
            {{ item.isHaveRmbSign ? '￥' : '' }}{{ item.isAmountFormat ? amountFormat(item.value) : item.value || 0 }}
          </div>
        </div>
      </div>
    </div>
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
  justify-content: space-between;
}
.isBkgColor {
  background-color: var(--color-main-bg);
}

.style-label {
  border-radius: 5px;
  .item_warp {
    display: flex;
    display: -webkit-flex;
    // width: 19%;
    height: 94px;
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
    margin-right: 20px;
    // box-shadow: 0px 0px 8px 2px lightgrey;
    &:last-child {
      margin-right: 0;
    }
    .img_warp {
      display: inline-block;
      line-height: 35px;
      width: 15.6%;
      min-width: 40px;
      height: 50px;
      margin-right: 20px;
      img {
        width: 35px;
        height: 35px;
      }
      .icon {
        font-size: 50px;
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
        word-break: keep-all;
      }
      .items1 {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
}
</style>
