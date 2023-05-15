<script>
import { computed, reactive, ref, getCurrentInstance, toRefs } from 'vue'
export default {
  props: {
    //是否需要分页，默认有
    pagination: {
      type: Boolean,
      default: () => true
    },
    //是否需要序号列，默认无
    isOrderNumber: {
      type: Boolean,
      default: () => false
    },
    //是否开启多选功能，默认关闭
    isSelection: {
      type: Boolean,
      default: () => false
    },
    //table头部JSON,Array类型，必传
    columnList: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    //table数据，数组类型，必传
    tableData: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    //是否开启斑马样式，默认关闭
    stripe: {
      type: Boolean,
      default: () => false
    },
    //序号列是否固定，默认不固定
    orderFixed: {
      type: Boolean || String,
      default: () => false
    },
    //行合并的关键参数
    spanRowParam: {
      type: String,
      default: () => null
    },
    //需要行合并的列号
    spanColArray: {
      type: Array,
      default: () => []
    },
    //单元格style样式方法
    cellStyle: {
      type: Function,
      default: null
    },
    total: {
      type: Number,
      required: true,
      default: 0
    }
  },
  emits: ['handleOperation', 'query', 'changeStatus', 'operaClick', 'editSave'],
  setup(props, { emit }) {
    const state = reactive({
      currentPage: 1,
      currSelectedList: [],
      currEditObj: {},
      pageSize: 10,
      pageSizes: [10, 50, 100, 200]
    })

    let { columnList, spanRowParam, tableData, spanColArray } = toRefs(props)

    const columnListData = computed(() => {
      const list = []
      columnList.value.forEach(e => {
        if (e.label) {
          list.push(e)
        }
      })
      return list
    })
    const changeStatus = row => {
      emit('changeStatus', row)
    }
    const operaClick = row => {
      emit('operaClick', row)
    }
    const handleSizeChange = val => {
      state.pageSize = val
      state.currentPage = 1
      emit('query', state.pageSize, state.currentPage)
    }
    const handleCurrentChange = val => {
      state.currentPage = val
      emit('query', state.pageSize, state.currentPage)
    }
    const handleSelectionChange = val => {
      state.currSelectedList = val
      multipleSelection.value = val
    }

    //通过父组件传递的合并字段参数进行计算行合并规则
    const spanRow = computed(() => {
      let numArr = [1]
      const dataArr = tableData.value
      for (let i = 0; i < dataArr.length; i++) {
        for (let j = i + 1; j < dataArr.length; j++) {
          // 主条件可变更 这里spanMethodParam为是否相等的条件
          if (dataArr[j][spanRowParam.value] === dataArr[i][spanRowParam.value]) {
            //设置边界问题 如果当前numArr[j]已经为0 说明已经循环比较结束 跳出循环
            if (numArr[j] === 0) break
            //合并行数 + 1
            numArr[i] += 1
            //相同值的行数除了合并行第一行累加，其余设为0
            numArr[j] = 0
          } else {
            //条件不相等那就push 一个1 代表不同值的单独行
            numArr.push(1)
            //将刚开始比较的索引重置为第一次遇到不相同值的行数 使之重新逐后比较
            i = j
          }
        }
      }
      return numArr
    })

    //行合并
    const objectSpanMethod = ({ column, rowIndex }) => {
      const spanRowValue = spanRow.value
      const rowSpan = spanRowValue[rowIndex]
      if (spanColArray.value.includes(column.property)) {
        // 0为被合并的一行
        if (rowSpan !== 0) {
          return [rowSpan, 1]
        } else {
          return [0, 0]
        }
      }
    }

    //通知父组件编辑修改的内容，清空当前修改编辑的单元格焦点对象
    const handleEditSave = row => {
      emit('editSave', row)
      Object.keys(state.currEditObj).forEach(key => delete state.currEditObj[key])
    }

    //获取当前修改编辑的单元格
    const handleEditUpdate = (row, prop) => {
      state.currEditObj['id'] = row.id
      state.currEditObj['prop'] = prop
    }

    //table单元格数组转字符串
    const getCellString = (arr, key) => {
      if (arr.length < 0) return
      let str = ''
      arr.map((item, index) => {
        if (!item[key]) return
        str += index + 1 === arr.length ? item[key] : item[key] + ','
      })
      return str
    }

    const { proxy } = getCurrentInstance()
    const multipleSelection = ref([])
    const toggleSelection = rows => {
      const ultipleTabInstance = proxy.$refs.multipleTableRef
      if (rows) {
        rows.forEach(row => {
          ultipleTabInstance.toggleRowSelection(row, undefined)
        })
      } else {
        ultipleTabInstance.clearSelection()
      }
    }

    return {
      state,
      spanRow,
      columnListData,
      objectSpanMethod,
      operaClick,
      changeStatus,
      getCellString,
      handleSizeChange,
      handleCurrentChange,
      toggleSelection,
      handleEditSave,
      handleEditUpdate,
      handleSelectionChange
    }
  }
}
</script>

<template>
  <div>
    <!-- 是否开启多选 -->
    <div v-if="isSelection" class="select-style">
      <span>选中项：{{ state.currSelectedList.length }}</span>
      &nbsp;
      <el-button class="cancel" type="primary" link @click="toggleSelection()">取消</el-button>
    </div>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      :stripe="stripe"
      style="width: 100%"
      :span-method="objectSpanMethod"
      :cell-style="cellStyle"
      @selection-change="handleSelectionChange"
    >
      <!-- 是否需要开启多选 -->
      <el-table-column v-if="isSelection" type="selection" width="55" />
      <!-- 是否需要序号列 -->
      <el-table-column v-if="isOrderNumber" :fixed="orderFixed" align="center" label="序号" type="index" width="80" />
      <!-- 列表数据 -->
      <el-table-column
        v-for="(item, index) in columnListData"
        :key="item.id || index"
        :prop="item.prop"
        :formatter="item.formatter"
        :label="item.label"
        :fixed="item.fixed || null"
        :width="item.width ? item.width : 180"
        :style="item.style"
        align="center"
      >
        <!--如果有多级表头-->
        <!--暂只支持两层多级表头，需要更复杂的多级表头不适用该table组件-->
        <template v-if="!!item.childColumn">
          <el-table-column
            v-for="(childItem, childIndex) in item.childColumn"
            :key="childIndex.id || childIndex"
            :prop="childItem.prop"
            :label="childItem.label"
            :formatter="childItem.formatter"
            :fixed="childItem.fixed || null"
            :width="childItem.width ? childItem.width : 180"
            :style="childItem.style"
            align="center"
          >
            <template #default="{ row }">
              <!--Popover弹出框-->
              <template v-if="childItem.isPopover">
                <el-popover :visible="false">
                  <template #reference>
                    <el-tag>{{ row[childItem.prop][0][childItem.popoverProp] }}</el-tag>
                  </template>
                </el-popover>
                &nbsp;
                <el-popover
                  v-if="row[childItem.prop].length > 1"
                  :effect="childItem.popoverLight || 'light'"
                  trigger="hover"
                  placement="top"
                  width="auto"
                >
                  <template #default>
                    <!--popoverProp为显示字段的key-->
                    <div>{{ getCellString(row[childItem.prop], childItem.popoverProp) }}</div>
                  </template>
                  <template #reference>
                    <el-tag>+{{ row[childItem.prop].length - 1 }}</el-tag>
                  </template>
                </el-popover>
              </template>
              <!-- 是否需要switch操作按钮 -->
              <el-switch v-if="childItem.isSwitch" v-model="row[childItem.prop]" @change="changeStatus(row)" />
              <!-- 是否需要button按钮 -->
              <el-button v-if="childItem.operaBtn" link type="primary" @click="operaClick(row)">
                {{ childItem.operaBtnName }}
              </el-button>
              <!-- 是否需要input-number编辑器，注：需要table数据中有id字段 -->
              <template v-if="childItem.enableEdit">
                <template v-if="state.currEditObj.id === row.id && state.currEditObj.prop === childItem.prop">
                  <el-input-number v-model="row[childItem.prop]" size="small" controls-position="right"></el-input-number>
                  <br />
                  <el-button link type="primary" @click="handleEditSave(row)">保存</el-button>
                </template>
                <template v-else>
                  <span style="margin-right: 5px">{{ row[childItem.prop] }}</span>
                  <el-button link type="primary" @click="handleEditUpdate(row, childItem.prop)">修改</el-button>
                </template>
              </template>
            </template>
          </el-table-column>
        </template>

        <!--如果不是多级表头-->
        <template v-if="!item.childColumn" #default="{ row }">
          <!--Popover弹出框-->
          <template v-if="item.isPopover">
            <el-popover :visible="false">
              <template #reference>
                <el-tag>{{ row[item.prop][0][item.popoverProp] }}</el-tag>
              </template>
            </el-popover>
            &nbsp;
            <el-popover
              v-if="row[item.prop].length > 1"
              :effect="item.popoverLight || 'light'"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <!--popoverProp为显示字段的key-->
                <div>{{ getCellString(row[item.prop], item.popoverProp) }}</div>
              </template>
              <template #reference>
                <el-tag>+{{ row[item.prop].length - 1 }}</el-tag>
              </template>
            </el-popover>
          </template>
          <!-- 是否需要switch操作按钮 -->
          <el-switch v-if="item.isSwitch" v-model="row[item.prop]" @change="changeStatus(row)" />
          <!-- 是否需要button按钮 -->
          <el-button v-if="item.operaBtn" link type="primary" @click="operaClick(row)">
            {{ item.operaBtnName }}
          </el-button>
          <!-- 是否需要input-number编辑器，注：需要table数据中有id字段 -->
          <template v-if="item.enableEdit">
            <template v-if="state.currEditObj.id === row.id && state.currEditObj.prop === item.prop">
              <el-input-number v-model="row[item.prop]" size="small" controls-position="right"></el-input-number>
              <br />
              <el-button link type="primary" @click="handleEditSave(row)">保存</el-button>
            </template>
            <template v-else>
              <span style="margin-right: 5px">{{ row[item.prop] }}</span>
              <el-button link type="primary" @click="handleEditUpdate(row, item.prop)">修改</el-button>
            </template>
          </template>
        </template>
      </el-table-column>
      <slot name="operation" />
    </el-table>
    <!-- 分页器 -->
    <div v-if="pagination" class="pagination">
      <el-pagination
        v-model:current-page="state.currentPage"
        v-model:page-size="state.pageSize"
        :page-sizes="state.pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 32px 16px;
}
.select-style {
  display: flex;
  display: -webkit-flex;
  margin-bottom: 6px;
}
:deep(.cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
