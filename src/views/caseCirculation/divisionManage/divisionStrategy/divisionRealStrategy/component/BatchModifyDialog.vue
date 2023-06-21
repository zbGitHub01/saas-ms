<script setup>
import { reactive, toRefs } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])

const state = reactive({
  cpeLevelList: ['A', 'B', 'C', 'D', 'E'],
  allEditData: {
    gradeType: null,
    cpeLevel: null,
    allotAmount: null
  },
  cpeLevelData: [
    {
      allotAmount: 0,
      title: '<1100'
    },
    {
      allotAmount: 0,
      title: '1100-2000'
    },
    {
      allotAmount: 0,
      title: '2000-5000'
    },
    {
      allotAmount: 0,
      title: '5000-10000'
    },
    {
      allotAmount: 0,
      title: '>=10000'
    }
  ]
})

const { cpeLevelList, allEditData, cpeLevelData } = toRefs(state)

const handleCancel = () => {
  emit('update:visible')
}

const handleOk = () => {
  emit('handleSave')
}
</script>

<template>
  <!-- 批量修改 -->
  <el-dialog :model-value="props.visible" title="批量修改" width="30%" :destroy-on-close="true">
    <div>
      <label>分案等级：</label>
      <el-select v-model="allEditData.cpeLevel" clearable placeholder="请选择分案等级" style="width: 80%; margin-bottom: 20px">
        <el-option v-for="item in cpeLevelList" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </div>
    <template v-if="value === 2">
      <div>
        <label>分案金额：</label>
        <el-input-number
          v-model="allEditData.allotAmount"
          :min="0"
          :controls="false"
          placeholder="请输入分案金额"
          style="width: 80%"
        ></el-input-number>
      </div>
    </template>
    <template v-else>
      <el-table
        ref="table"
        :data="cpeLevelData"
        :header-cell-style="{ background: '#F8F9FB' }"
        :row-style="{ height: 48 + 'px' }"
        :cell-style="{ padding: 0 + 'px' }"
        style="margin-top: 20px"
        max-height="500"
        border
      >
        <el-table-column property="title" label="客单区间" align="center" />
        <el-table-column property="allotAmount" label="分案金额" align="center">
          <template #default="scope">
            <el-input-number v-model="scope.row.allotAmount" :min="0" :controls="false"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleOk">保 存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss"></style>
