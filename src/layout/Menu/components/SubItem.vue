<template>
  <template v-for="subItem in props.menuList" :key="subItem.webPath">
    <template v-if="!subItem.hide">
      <el-sub-menu v-if="subItem.children && subItem.children.length" :index="subItem.webPath">
        <template #title>
          <el-icon v-if="subItem.icon">
            <component :is="subItem.icon" v-if="isElIcon(subItem.icon)" />
            <svg-icon v-else :name="subItem.icon" />
          </el-icon>
          <el-icon v-else size="6">
            <svg-icon :name="activeMatched.includes(subItem.webPath) ? 'dot-solid' : 'dot'" />
          </el-icon>
          <span>{{ subItem.name }}</span>
        </template>
        <SubItem :menu-list="subItem.children" />
      </el-sub-menu>
      <el-menu-item v-else :index="subItem.webPath">
        <el-icon v-if="subItem.icon">
          <component :is="subItem.icon" v-if="isElIcon(subItem.icon)" />
          <svg-icon v-else :name="subItem.icon" />
        </el-icon>
        <el-icon v-else size="6">
          <svg-icon :name="activePath === subItem.webPath ? 'dot-solid' : 'dot'" />
        </el-icon>
        <template v-if="!subItem.isLink" #title>
          <span>{{ subItem.name }}</span>
        </template>
        <template v-else #title>
          <a class="menu-href" :href="subItem.isLink" target="_blank">{{ subItem.title }}</a>
        </template>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { capitalized } from '@/utils/validate'

const props = defineProps({
  menuList: Array
})
const route = useRoute()

const isElIcon = icon => capitalized.test(icon)
const activePath = computed(() => route.path)
const activeMatched = computed(() => route.matched.map(item => item.path))
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
