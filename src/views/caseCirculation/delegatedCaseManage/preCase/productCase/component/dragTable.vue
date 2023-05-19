<script setup>
import { toRefs, reactive, onBeforeMount, onMounted, getCurrentInstance } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { regionData } from 'element-china-area-data' //区域级联
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  currType: {
    type: String,
    default: null
  },
  tableData: {
    type: Array,
    default: () => []
  }
})

const state = reactive({
  dataArr: [],
  regionOptions: regionData
})

const { tableData } = toRefs(props)
const { proxy } = getCurrentInstance()

state.dataArr = proxy.$deepCopy(tableData.value, true)

const handleDel = row => {
  console.log(row)
  ElMessageBox.confirm('确定删除？').then(
    () => true,
    () => false
  )
}

const optionsProp = {
  value: 'label',
  label: 'label',
  children: 'children',
  checkStrictly: true,
  multiple: true
}

//拖拽开始的事件
const onStart = () => {
  console.log('开始拖拽')
}

//拖拽结束的事件
const onEnd = () => {
  console.log('结束拖拽')
}
onBeforeMount(() => {})
onMounted(() => {})
</script>

<template>
  <div>
    <div class="order_warp">
      <el-row>
        <el-col :span="2">
          <div class="grid">委案顺序</div>
        </el-col>
        <el-col :span="22" style="display: flex">
          <el-col :span="8" style="text-align: center">
            <div class="grid" style="justify-content: space-between; margin-left: 60px">机构</div>
          </el-col>
          <el-col :span="10">
            <div class="grid">优先属地</div>
          </el-col>
          <el-col :span="4" style="text-align: center">
            <div class="grid">委案金额</div>
          </el-col>
          <el-col :span="2">
            <div class="grid">操作</div>
          </el-col>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col :span="2">
        <div v-for="(item, index) in state.dataArr" :key="index" class="org_warp">
          <el-row class="show_wrap first-nth-show_wrap">
            <el-col :span="2">
              <span class="num">{{ index + 1 }}</span>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="22">
        <draggable
          v-model="state.dataArr"
          chosen-class="chosen"
          ghost-class="ghost"
          force-fallback="true"
          group="people"
          animation="300"
          handle=".mover"
          @start="onStart"
          @end="onEnd"
        >
          <transition-group>
            <div v-for="(item, index) in state.dataArr" :key="index" class="org_warp">
              <el-row class="show_wrap">
                <el-col :span="8" style="text-align: left">
                  <svg-icon name="list" class="mover" />
                  <span class="org_name">{{ item.orgName }}</span>
                </el-col>
                <el-col :span="10" style="text-align: center">
                  <el-cascader
                    v-model="item.regions"
                    style="width: 98%"
                    size="small"
                    :props="optionsProp"
                    :options="state.regionOptions"
                  />
                </el-col>

                <el-col :span="4" style="text-align: center">
                  <el-input-number
                    v-model="item.entrustAmount"
                    :min="0"
                    size="mini"
                    :controls="false"
                    @input="handleInput(item)"
                  ></el-input-number>
                </el-col>
                <el-col :span="2" style="text-align: center">
                  <el-icon style="color: red; cursor: pointer" @click="handleDel"><DeleteFilled /></el-icon>
                </el-col>
              </el-row>
            </div>
          </transition-group>
        </draggable>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped lang="scss">
.order_warp {
  width: 100%;
  margin-bottom: 20px;
  transition: all linear 0.3s;
  .grid {
    font-weight: 700;
    font-style: normal;
    color: rgb(85, 85, 85);
    font-size: 13px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.mover {
  margin: 0 10px;
}
.org_warp {
  width: 100%;
  height: 60px;
  margin: 20px 0;
  display: flex;
  .num {
    width: 5%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-weight: 700;
    font-style: normal;
    color: rgb(51, 51, 51);
  }
  .first-nth-show_wrap {
    justify-content: center;
  }
  .show_wrap {
    width: 100%;
    height: 60px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    .org {
      font-weight: 700;
      font-style: normal;
      color: rgb(127, 127, 127);
      font-size: 13px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .org_name {
        margin: 0 10px;
      }
    }
    .num_style {
      font-size: 13px;
    }
  }
}
.red {
  color: rgb(248, 26, 74);
}
.chosen {
  box-shadow: 0px 0px 5px 0px rgba(3, 178, 247, 0.425);
}
.ghost {
  box-shadow: 0px 0px 5px 0px rgb(8, 117, 241);
}
:deep(.el-cascader) {
  .el-input__wrapper {
    height: 48px !important;
  }
  .el-cascader__tags {
    height: 100%;
    overflow-y: auto;
  }
}
</style>
