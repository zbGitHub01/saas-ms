<script setup>
import { ref, reactive, toRefs, getCurrentInstance, onBeforeMount, onMounted } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
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

const { tableData } = toRefs(props)
const instance = getCurrentInstance()?.proxy

const state = reactive({
  dataArr: []
})
state.dataArr = instance?.$deepCopy(tableData.value, true)

const lastDropVisible = ref(false)
const thirdDropVisible = ref(false)
const visibleChangeLast = value => {
  lastDropVisible.value = value
  // console.log(props.currType)
}
const visibleChangeThird = value => {
  thirdDropVisible.value = value
}

const handleDel = row => {
  console.log(row)
  ElMessageBox.confirm('确定删除？').then(
    () => true,
    () => false
  )
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
          <el-col :span="props.currType !== '分产品委案' ? 18 : 8" style="text-align: center">
            <div class="grid" style="justify-content: space-between; margin-left: 60px">机构</div>
          </el-col>
          <el-col v-if="props.currType === '分产品委案'" :span="5" style="text-align: center">
            <div class="grid">
              <span>上月回款率</span>
              <el-dropdown trigger="click" style="margin-top: 5px" @visible-change="visibleChangeLast" @command="handleCommand">
                <span>
                  <el-icon v-if="!lastDropVisible"><ArrowDownBold /></el-icon>
                  <el-icon v-else><ArrowUpBold /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>金额回款率降序</el-dropdown-item>
                    <el-dropdown-item>户数回款率降序</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-col>
          <el-col v-if="props.currType === '分产品委案'" :span="5" style="text-align: center">
            <div class="grid">
              <span>近3月回款率</span>
              <el-dropdown trigger="click" style="margin-top: 5px" @command="handleCommand" @visible-change="visibleChangeThird">
                <span>
                  <el-icon v-if="!thirdDropVisible"><ArrowDownBold /></el-icon>
                  <el-icon v-else><ArrowUpBold /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>金额回款率降序</el-dropdown-item>
                    <el-dropdown-item>户数回款率降序</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
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
                <el-col :span="props.currType !== '分产品委案' ? 18 : 8" style="text-align: left">
                  <svg-icon name="list" class="mover" />
                  <span class="org_name">{{ item.orgName }}</span>
                </el-col>
                <el-col v-if="props.currType === '分产品委案'" :span="5" style="text-align: center">
                  <div class="num_style">金额：{{ item.amount }}%</div>
                  <div class="num_style">户数：{{ item.households }}%</div>
                </el-col>
                <el-col v-if="props.currType === '分产品委案'" :span="5" style="text-align: center">
                  <div class="num_style">金额：{{ item.amount }}%</div>
                  <div class="num_style">户数：{{ item.households }}%</div>
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
  height: 40px;
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
    height: 40px;
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
</style>
