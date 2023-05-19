<template>
  <json-editor-vue class="editor" v-model="jsonContent" @blur="handleBlur" />

  <el-button type="primary" @click="checkJson">确定</el-button>
</template>

<script setup>
import { ref } from 'vue'
// 引入vue-json-editor模块
import JsonEditorVue from 'json-editor-vue3'
import menuData from '@/store/menu.json'

let jsonContent = ref(menuData) // json数据

const handleBlur = (editor) => {
  console.log(editor, '-----editor')
}
const checkJson = () => {
  console.log(jsonContent.value, '-----value')
}
</script>
<style scoped lang="scss">
.editor {
  height: 80%;
}
</style>
