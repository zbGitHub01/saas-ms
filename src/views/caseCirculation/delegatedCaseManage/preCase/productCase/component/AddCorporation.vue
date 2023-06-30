<script setup>
import { reactive, toRefs } from 'vue'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  orgList: {
    type: Array,
    default: () => []
  }
})

const { orgList } = toRefs(props)

const emit = defineEmits(['update:dialogVisible', 'submit'])

const state = reactive({
  orgValue: '',
  checkAll: false,
  rightCities: [],
  isIndeterminate: false
})
const handleCheckedCitiesChange = value => {
  let arr = []
  value.map(item => {
    arr.push(item.orgId)
  })
  // this.form.orgIdList=arr
  state.rightCities = value
  // let checkedCount = value.length
  // state.checkAll = checkedCount === state.lastData.length
  // this.isIndeterminate = checkedCount > 0 && checkedCount < this.lastData.length
}

//全选
const handleCheckAllChange = val => {
  let arr = []
  orgList.value.map(item => {
    arr.push(item.orgId)
  })
  state.rightCities = val ? orgList.value : []
  state.isIndeterminate = false
}

const handleClose = () => {
  state.rightCities = []
  state.checkAll = false
  emit('update:dialogVisible', false)
}

const handleSubmit = () => {
  emit('submit', state.rightCities)
  // state.rightCities = []
  // state.checkAll = false
}

//重置选择项
const resetRightValue = () => {
  state.rightCities = []
  state.checkAll = false
}

defineExpose({
  resetRightValue
})
</script>

<template>
  <el-dialog :model-value="props.dialogVisible" title="添加机构" width="45%" :before-close="handleClose">
    <div class="checkbox">
      <div class="checkbox-warp">
        <el-input v-model="state.orgValue" clearable placeholder="请输入内容">
          <template #append>
            <el-button icon="Search" />
          </template>
        </el-input>
        <el-checkbox v-model="state.checkAll" :indeterminate="state.isIndeterminate" @change="handleCheckAllChange">
          全选
        </el-checkbox>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group v-model="state.rightCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in orgList" :key="item.orgId" style="display: block" :label="item">
            {{ item.itemText }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div style="width: 30px; height: 350px; line-height: 350px">
        <el-icon class="d-caret"><DCaret /></el-icon>
      </div>
      <div class="checkbox-warp">
        <div style="margin: 15px 0"></div>
        <el-checkbox-group v-model="state.rightCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in state.rightCities" :key="item.orgId" style="display: block" :label="item">
            {{ item.itemText }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.checkbox {
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
}
.checkbox-warp {
  width: 40%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  border-radius: 4px;
  background-color: #fff;
  margin-right: 20px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
  .el-input {
    width: 100%;
  }
}
.d-caret {
  transform: rotate(90deg);
}
</style>
