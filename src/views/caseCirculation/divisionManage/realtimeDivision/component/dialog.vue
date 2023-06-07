<script setup>
import { reactive, onBeforeMount, onMounted, defineExpose } from 'vue'
import labelList from './labelList.js'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  depData: {
    type: Array,
    default: () => []
  },
  cpeData: {
    type: Array,
    default: () => []
  },
  labelData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits([
  'update:dialogVisible',
  'getUserList',
  'caseAllotNext',
  'caseAllotRefresh',
  'caseAllotAdjust',
  'caseAllotSave'
])

const state = reactive({
  defaultProps: {
    children: 'children',
    label: 'departmentName'
  },
  selectData: [],
  peopleType: 1,
  caseType: 0,
  moneyType: 0,
  active: 1,
  last: false,
  getRowKeys(row) {
    return row.userId
  }
})

defineExpose({
  setLast: val => (state.last = val)
})

const activeStyle = {
  background: '#007aff',
  color: '#fff'
}

//选择CPE
const handleSelectionChange = val => {
  state.selectData = val
}

//下一步操作
const handleLast = () => {
  let arr = []
  state.selectData.forEach(item => arr.push(item.userId))
  emit('caseAllotNext', arr)
}
const click = () => {
  console.log('childLast', state.last)
}

//已案人人数分
const handleByPeople = () => {
  state.active = 1
  state.peopleType = 1
  state.caseType = 0
  state.moneyType = 0
}
//以案件数均分
const handleByCase = () => {
  state.active = 2
  state.peopleType = 0
  state.caseType = 1
  state.moneyType = 0
}
//以委案金额均分
const handleByMoney = () => {
  state.active = 3
  state.peopleType = 0
  state.caseType = 0
  state.moneyType = 1
}

//调值案人
const handLeadJustNum = val => {
  this.$emit('caseAllotAdjust', props.labelData.allotInfo)
  console.log(val)
}
//调值案件
const handleCaseNum = val => {
  this.$emit('caseAllotAdjust', props.labelData.allotInfo)
  console.log(val)
}
//调值总数
const handleAllotAmount = val => {
  this.$emit('caseAllotAdjust', props.labelData.allotInfo)
  console.log(val)
}

//合计
const getSummaries = param => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '总价'
      return
    }
    const values = data.map(item => Number(item[column.property]))
    if (!values.every(value => isNaN(value))) {
      sums[index] = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!isNaN(value)) prev + curr
        else prev
      }, 0)
      sums[index] = Math.round((sums[index] * 1000) / 10) / 100
    } else sums[index] = ''
  })
  return sums
}

//上一步
const handleFront = () => {
  state.last = false
}
//取消
const handleCancel = () => {
  emit('update:dialogVisible', false)
}
//确定提交
const handleConfirm = () => {
  let params = {
    allotInfo: props.labelData.allotInfo
  }
  emit('caseAllotSave', params)
}

//重新分配
const handleClick = () => {
  emit('caseAllotRefresh', state.active)
}

//选择CPE
const handleNodeClick = data => {
  let departmentId = data.departmentId
  emit('getUserList', departmentId)
}

const handleClose = () => {
  emit('update:dialogVisible', false)
}

onBeforeMount(() => {})
onMounted(() => {})
</script>

<template>
  <el-dialog :model-value="props.dialogVisible" title="案件分派" width="60%" :before-close="handleClose">
    <div>
      <LabelClass :label-data="labelList" :is-bkg-color="false" />
    </div>
    <template v-if="!state.last">
      <div class="table">
        <div class="table-warp">
          <div class="title" @click="click">选择CPE</div>
          <div class="dep-warp">
            <div class="item item1">
              <el-tree :data="props.depData" :props="state.defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
            <div class="item">
              <el-table
                ref="subcontractorTable"
                :data="props.cpeData"
                border
                height="369px"
                :row-key="state.getRowKeys"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" :reserve-selection="true" align="center" width="50"></el-table-column>
                <el-table-column prop="username" align="center" label="CPE"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="table-warp table-warp1">
          <div class="title">已选CPE</div>
          <div class="item">
            <el-table :data="state.selectData" height="369px" border style="width: 100%">
              <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
              <el-table-column prop="username" align="center" label="CPE"></el-table-column>
            </el-table>
            <div class="line"></div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="handleLast">下一步</el-button>
      </div>
    </template>
    <template v-else>
      <div class="table-warp idea-warp">
        <div class="title">分派方案</div>
        <div class="dep-warp">
          <div class="item2">
            <div class="btn-warp">
              <el-button type="primary" plain :style="state.active === 1 ? activeStyle : ''" @click="handleByPeople">
                以案人人数均分
              </el-button>
              <el-button type="primary" plain :style="state.active === 2 ? activeStyle : ''" @click="handleByCase">
                以案件数均分
              </el-button>
              <el-button type="primary" plain :style="state.active === 3 ? activeStyle : ''" @click="handleByMoney">
                以委案金额均分
              </el-button>
            </div>
            <div class="btn-warp">
              <el-button link icon="Refresh" @click="handleClick">重新分配</el-button>
            </div>
          </div>
          <div class="item3">
            <el-table
              ref="Summaries"
              :data="props.labelData.allotInfo"
              height="369"
              :summary-method="getSummaries"
              show-summary
              style="width: 100%"
              border
            >
              <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
              <el-table-column prop="cpeName" align="center" label="CPE"></el-table-column>
              <el-table-column prop="personNum" align="center" label="分派案人数">
                <template #default="{ row }">
                  <div>
                    <span v-if="state.peopleType === 0">{{ row.personNum }}</span>
                    <el-input-number
                      v-else
                      v-model="row.personNum"
                      class="input_class"
                      @change="handLeadJustNum(row)"
                      @blur="handLeadJustNum(row)"
                    ></el-input-number>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="caseNum" align="center" label="分派案件数">
                <template #default="{ row }">
                  <div>
                    <span v-if="state.caseType === 0">{{ row.caseNum }}</span>
                    <el-input-number
                      v-else
                      v-model="row.caseNum"
                      class="input_class"
                      @change="handleCaseNum(row)"
                      @blur="handleCaseNum(row)"
                    ></el-input-number>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="allotAmount" align="center" label="分派委案金额">
                <template #default="{ row }">
                  <div>
                    <span v-if="state.moneyType === 0">{{ row.allotAmount }}</span>
                    <el-input-number
                      v-else
                      v-model="row.allotAmount"
                      class="input_class"
                      @change="handleAllotAmount(row)"
                      @blur="handleAllotAmount(row)"
                    ></el-input-number>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button style="float: left" @click="handleFront">上一步</el-button>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确认委派</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.el-dialog__body {
  padding: 0 20px !important;
}
.el-divider__text.is-left {
  left: 0;
  padding: 0;
  color: #aaaaaa;
}
.table {
  height: 400px;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-button .el-button--primary .is-plain .active {
    background: #007aff;
    color: #fff;
  }
}
.input_class {
  width: 150px;
  :deep(.el-input) {
    width: 150px;
  }
}

.table-warp {
  width: 65%;
  margin-top: 10px;
  height: 400px;
  border: 1px solid #ebeef5;
  border-right: none;
  .el-table--border,
  .el-table--group {
    border: none;
  }
  .dep-warp {
    width: 100%;
    height: 369px;
    display: flex;
    justify-content: flex-start;
    .item {
      width: 50%;
    }
    .item1 {
      border-right: 1px solid #ebeef5;
    }
    .item2 {
      width: 30%;
      height: 100%;
      border-right: 1px solid #ebeef5;
      .btn-warp {
        width: 100%;
        height: 50%;
        border-bottom: 1px dotted #ebeef5;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .el-button {
          width: 50%;
          margin: 10px auto;
          border-radius: 5px;
        }
      }
    }
    .item3 {
      width: 70%;
    }
  }
  .title {
    width: 100%;
    height: 30px;
    padding: 0 10px;
    line-height: 30px;
    font-weight: 700;
    font-size: 14px;
    color: rgb(127, 127, 127);
    border-bottom: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
  }
}
.table-warp1 {
  width: 30%;
}
.idea-warp {
  width: 100%;
  border-right: none;
}
.dialog-footer {
  padding: 10px 0 20px 0;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: right;
}
</style>
