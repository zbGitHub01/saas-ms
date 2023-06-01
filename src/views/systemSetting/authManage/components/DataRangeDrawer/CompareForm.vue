<template>
  <template v-if="compareData.valueInputType.includes('dropdown')">
    <el-select :model-value="props.modelValue" :multiple="compareData.valueInputType === 'dropdown-multi'" @change="selectChange">
      <el-option
        v-for="item in compareData.valueDropdownList || []"
        :key="item.id"
        :label="item.name"
        :value="item.value"
      ></el-option>
    </el-select>
  </template>
  <template v-if="compareData.valueInputType === 'text'">
    <el-input :model-value="props.modelValue" @change="inputChange"></el-input>
  </template>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  modelValue: {
    // type: String || Array || null,
    default: null
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['update:modelValue'])

const compareData = computed(() => props.data)
const selectChange = value => {
  console.log(value, '---value')
  emit('update:modelValue', value)
}
const inputChange = value => {
  console.log(value, '---input')
  emit('update:modelValue', value)
}
</script>

<style lang="scss" scoped></style>
