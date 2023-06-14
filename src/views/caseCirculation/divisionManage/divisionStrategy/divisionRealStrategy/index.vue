<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabsStore } from '@/store/modules/tabs'
import tableColumnList from './config/tableColumnList.js'
import queryList from './config/queryList.js'

const formFieldsList = [
  {
    type: 'upload',
    label: '分案文件',
    prop: 'fileList',
    limit: 1,
    uploadTips: 'jpg/png files with a size less than 500KB.',
    action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15'
  }
]

const state = reactive({
  tableData: [],
  orgName: '',
  progressData: [0, 0]
})

const dialogFormVisible = ref(false)
const tabStore = useTabsStore()
const router = useRouter()
const route = useRoute()
state.orgName = route.query.orgName

//返回后退按钮
const handleBack = () => {
  tabStore.removeTabs('/caseCirculation/divisionManage/divisionStrategy/divisionRealStrategy')
  router.replace({ name: 'divisionStrategy' })
}

//导入分案策略
const handleImport = () => {
  dialogFormVisible.value = true
}

const handleClose = () => {
  dialogFormVisible.value = false
}
</script>

<template>
  <div class="card-wrap">
    <div class="table_head">
      <div>
        <el-icon :size="30" @click="handleBack"><ArrowLeft /></el-icon>
        <span>{{ state.orgName }}</span>
      </div>
    </div>
    <div class="spacing"></div>
    <div style="margin-top: 20px">
      <FormWrap :query-list="queryList" @search="handleSearch" @reset="handleReset">
        <template #default>
          <FormClass ref="formClass" label-width="102px" :fields="queryList" />
        </template>
      </FormWrap>
    </div>
    <!--label-->
    <div class="activity_wrap">
      <div class="text_wrap">
        <div>产品金额</div>
        <div>
          <div>
            <span>已分派</span>
            <span class="num">25895622.58</span>
          </div>
          <div>
            <span>未分派</span>
            <span class="num">3654998.56</span>
          </div>
        </div>
      </div>
      <div class="text_wrap">
        <div>产品户数</div>
        <div>
          <div>
            <span>已分派</span>
            <span class="num">1225</span>
          </div>
          <div>
            <span>未分派</span>
            <span class="num">365</span>
          </div>
        </div>
      </div>
      <div class="text_wrap time">
        <div>产品当前分案进程</div>
        <div class="progress">
          <span v-if="progress === null">当前未执行分案</span>

          <div v-else>
            <div style="text-align: right">
              <span>{{ state.progressData[0] }}</span>
              /
              <span>{{ state.progressData[1] }}</span>
            </div>
            <el-progress :show-text="false" :stroke-width="15" style="width: 100%" :percentage="parseInt(progress)"></el-progress>
          </div>
        </div>
      </div>
    </div>
    <!--table-->
    <div class="spacing"></div>
    <div class="body_style">
      <OperationBar>
        <template #tool>
          <el-button type="primary" plain @click="handleClick">清空设置</el-button>
          <el-button type="primary" plain @click="handleClick">自动分配金额</el-button>
          <el-button type="primary" plain @click="handleClick">下载CPE分案等级表</el-button>
          <el-button type="primary" @click="handleImport">导入分案策略</el-button>
          <el-button type="primary" @click="handleClick">批量修改</el-button>
          <el-button type="danger" @click="handleClick">执行分案</el-button>
        </template>
      </OperationBar>
      <TableClass
        :table-data="state.tableData"
        :column-list="tableColumnList"
        :pagination="false"
        @edit-save="handleEditSave"
        @change-status="handleChange"
      ></TableClass>
    </div>
    <DialogForm
      v-model:dialogFormVisible="dialogFormVisible"
      title="导入分案策略"
      width="30%"
      :form-fields="formFieldsList"
      @close="handleClose"
    />
  </div>
</template>

<style scoped lang="scss">
.table_head {
  width: 100%;
  height: 50px;
  div {
    display: flex;
    align-items: center;
    span {
      font-size: 18px;
      font-weight: bold;
    }
    svg {
      cursor: pointer;
    }
  }
}

.activity_wrap {
  width: 100%;
  margin-top: -20px;
  background: #f5f7fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 0px 0px 0px rgb(0 0 0 / 6%);
  .text_wrap {
    width: 30%;
    padding: 20px 0;
    height: 120px;
    background: #fff;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-weight: 500px;
    font-size: 16px;
    > div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      > div {
        display: flex;
        flex-direction: column;
        width: 50%;
        .num {
          margin-top: 10px;
          color: #4d7cfe;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    &:not(:first-child) {
      margin-left: 20px;
      padding-left: 20px;
    }
  }
  .time {
    width: 40%;
    > div {
      > div {
        width: 100%;
      }
    }
    .progress {
      justify-content: center;
      align-items: center;
      flex: 1;
      color: #999999;
      font-weight: 400;
    }
  }
}
.body_style {
  padding-top: 20px;
}
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
</style>
