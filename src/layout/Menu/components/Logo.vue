<template>
  <div class="logo flx-center" @click="handleClick">
    <img v-if="!props.isCollapse" src="@/assets/images/logo-white.png" alt="logo" />
    <img v-else class="logo-mini" src="@/assets/images/logo1.png" alt="logo" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const props = defineProps({
  isCollapse: Boolean
})
const route = useRoute()
const handleClick = () => {
  console.log(route.hash)
}
</script>

<style lang="scss" scoped>
.logo {
  position: relative;
  box-sizing: border-box;
  height: 95px;
  margin-bottom: 12px;
  img {
    width: 156px;
    height: 36px;
    object-fit: contain;
    margin-right: 8px;
  }
  .logo-mini {
    width: 39px;
    height: 39px;
  }
}
</style>
