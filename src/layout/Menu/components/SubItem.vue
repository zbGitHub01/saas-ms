<template>
  <template v-for="subItem in props.menuList" :key="subItem.path">
    <template v-if="!subItem.hide">
      <el-sub-menu v-if="subItem.children && subItem.children.length" :index="subItem.path">
        <template #title>
          <el-icon>
            <component v-if="isElIcon(subItem.icon)" :is="subItem.icon" />
            <svg-icon v-else :name="subItem.icon" />
          </el-icon>
          <span>{{ subItem.menuName }}</span>
        </template>
        <SubItem :menu-list="subItem.children" />
      </el-sub-menu>
      <el-menu-item v-else :index="subItem.path">
        <el-icon>
          <component v-if="isElIcon(subItem.icon)" :is="subItem.icon" />
          <svg-icon v-else :name="subItem.icon" />
        </el-icon>
        <template v-if="!subItem.isLink" #title>
          <span>{{ subItem.menuName }}</span>
        </template>
        <template v-else #title>
          <a class="menu-href" :href="subItem.isLink" target="_blank">{{ subItem.title }}</a>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup>
import { capitalized } from '@/utils/validate'
const props = defineProps({
  menuList: Array
})

const isElIcon = icon => capitalized.test(icon)
</script>

<style lang="scss">
.menu-href {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: #bdbdc0;
  text-decoration: none;
}
</style>
