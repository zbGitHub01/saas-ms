<script setup>
import { ref, reactive } from 'vue'
import { ElMessageBox } from 'element-plus'
import AddCorporation from './AddCorporation.vue'
import labelList from '../config/labelList.js'

const props = defineProps({
  drawerFormVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:drawerFormVisible'])

const size = ref('default')
const labelPosition = ref('right')

const sizeForm = reactive({
  name: '委外处置库',
  region: [
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000',
    '测试组一（省份）',
    '上个月委案金额为10000至15000'
  ],
  type: [
    '“360”借条',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟',
    '还呗',
    '佰仟'
  ],
  caseType: '默认',
  history: '隐藏',
  caseDate: '2021-12-31',
  isAuto: '不自动收回',
  notes: '打发发发大啊达大ddddddddddddddddddddddddd大啊啊啊啊啊啊发发发',
  resource: '',
  productList: ['"360"借条', '还呗', '佰仟'],
  currProduct: ''
})

const state = reactive({
  tableData: [
    {
      date: '杭州温泽企业管理有限公司贵阳分公司',
      name: 'Tom',
      caseMoney: 8000,
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '前海中英投（深圳）投资有限公司',
      name: 'Tom',
      caseMoney: 8000,
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '前海中英投（深圳）投资有限公司',
      name: 'Tom',
      caseMoney: 8000,
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '前海中英投（深圳）投资有限公司',
      name: 'Tom',
      caseMoney: 8000,
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '苏州微合力网络科技有限公司',
      name: 'Tom',
      caseMoney: 8000,
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '湖南荣辉法律咨询服务有限公司',
      name: 'Tom',
      caseMoney: 8000,
      address: 'No. 189, Grove St, Los Angeles'
    }
  ]
})

const handleClose = () => {
  emit('update:drawerFormVisible', false)
}
const lastDropVisible = ref(false)
const thirdDropVisible = ref(false)
const visibleChangeLast = value => {
  lastDropVisible.value = value
  console.log(sizeForm.resource)
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

const dialogVisible = ref(false)

const handleAddCorporation = () => {
  dialogVisible.value = true
}

const handleSubmit = arr => {
  dialogVisible.value = false
  arr.map(item => state.tableData.push(item))
}
</script>

<template>
  <el-drawer
    :model-value="props.drawerFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    size="90%"
    @close="handleClose"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">
        <el-icon class="closeClass" @click="close"><ArrowLeft /></el-icon>
        委案配置
      </h4>
    </template>
    <el-form ref="form" style="width: 90%" :model="sizeForm" label-width="auto" :label-position="labelPosition" :size="size">
      <el-form-item label="案件分库">
        <div>{{ sizeForm.name }}</div>
      </el-form-item>
      <el-form-item label="案人模型">
        <div v-for="(item, index) in sizeForm.region" :key="index" class="listStyle">
          <span>{{ item }}</span>
        </div>
      </el-form-item>
      <el-form-item label="包含产品">
        <div v-for="(item, index) in sizeForm.type" :key="index" class="listStyle">
          <span>{{ item }}</span>
        </div>
      </el-form-item>
      <div class="specialItem">
        <el-form-item width="20%" label="委案类型">
          <div>{{ sizeForm.caseType }}</div>
        </el-form-item>
        <el-form-item width="20%" label="历史处置记录">
          <div>{{ sizeForm.history }}</div>
        </el-form-item>
        <el-form-item width="20%" label="委案到期日">
          <div>{{ sizeForm.caseDate }}</div>
        </el-form-item>
        <el-form-item width="20%" label="是否自动收回">
          <div>{{ sizeForm.isAuto }}</div>
        </el-form-item>
        <el-form-item width="20%" label="备注">
          <div>{{ sizeForm.notes }}</div>
        </el-form-item>
      </div>
      <div class="spacing"></div>
      <el-form-item prop="resource" style="padding-top: 20px">
        <el-radio-group v-model="sizeForm.resource">
          <el-radio label="综合委案" />
          <el-radio label="分产品委案" />
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="sizeForm.resource === '分产品委案'" prop="currProduct">
        <el-radio-group v-model="sizeForm.currProduct" size="large">
          <el-radio-button v-for="(item, index) in sizeForm.productList" :key="index" class="radio-style" :label="item" />
        </el-radio-group>
      </el-form-item>
      <div class="spacing"></div>
      <LabelClass :label-data="labelList" :is-bkg-color="false" :is-space-around="true" />
      <div class="line"></div>
      <el-table :data="state.tableData" style="width: 90%">
        <el-table-column type="index" label="委案顺序" align="center" width="120" />
        <el-table-column prop="date" label="机构" align="center">
          <template #default="scope">
            <div class="col-style" style="justify-content: left">
              <span class="svg-span"><svg-icon name="list" /></span>
              <span>{{ scope.row.date }}</span>
            </div>
          </template>
        </el-table-column>
        <template v-if="sizeForm.resource === '分产品委案'">
          <el-table-column prop="date" align="center" width="180">
            <template #header>
              <div>
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
            </template>
            <template #default="scope">
              <div class="col-style" style="flex-direction: column">
                <span>金额：0.916%</span>
                <span>户数：0.916%</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" align="center" width="180">
            <template #header>
              <div>
                <span>近3月回款率</span>
                <el-dropdown
                  trigger="click"
                  style="margin-top: 5px"
                  @command="handleCommand"
                  @visible-change="visibleChangeThird"
                >
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
            </template>
            <template #default="scope">
              <div class="col-style" style="flex-direction: column">
                <span>金额：0.916%</span>
                <span>户数：0.916%</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column prop="name" align="center" label="委案金额" width="180">
          <template #default="scope">
            <div class="col-style">
              <span><el-input v-model="scope.row.caseMoney"></el-input></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template #default="{ row }">
            <div class="col-style">
              <span>
                <el-button link circle type="danger" @click="handleDel(row)">
                  <el-icon style="font-size: 30px"><CircleClose /></el-icon>
                </el-button>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item style="margin-top: 20px">
        <el-button type="primary" icon="Plus" plain @click="handleAddCorporation">添加机构</el-button>
        <el-button type="primary" plain>导入委案计划</el-button>
        <el-button type="primary" link>下载导入模板</el-button>
      </el-form-item>
      <el-form-item>
        <el-button>取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
  <!--添加机构弹窗-->
  <AddCorporation v-model:dialog-visible="dialogVisible" @submit="handleSubmit" />
</template>

<style lang="scss" scoped>
.closeClass {
  position: relative;
  top: 2px;
  margin-right: 20px;
  cursor: pointer;
}
.listStyle {
  margin-bottom: 10px;
  padding: 0 10px;
  background: #f2f2f2;
  &:not(:last-child) {
    margin-right: 10px;
  }
}
.specialItem {
  width: 100%;
  display: flex;
  display: -webkit-flex;
  :deep(.el-form-item) {
    width: 20%;
    .el-form-item__content {
      align-items: normal;
      word-break: break-all;
    }
  }
}
:deep(.el-form-item__label) {
  color: #aaaaaa;
  font-weight: bolder;
}
:deep(.el-input__wrapper) {
  width: 100%;
}
.line {
  margin-bottom: 30px;
  width: 100%;
  height: 1px;
  border: 1px dashed #aaaaaa;
}
.spacing {
  height: 10px;
  margin: 0 -20px 0;
  background-color: var(--color-main-bg);
}
.svg-span {
  display: flex;
  width: 50px !important;
  height: 100% !important;
  margin: 0 10px 0 -12px;
  align-items: center;
  background: #f2f2f2;
  svg {
    height: 60% !important;
  }
}
:deep(.el-table) {
  --el-table-border: none;
  .el-table__row {
    margin-bottom: 20px;
  }
  .el-table__row > .el-table__cell {
    &:not(:first-child) > .cell {
      height: 100%;
      border-top: 2px solid #e0dddd;
      border-bottom: 2px solid #e0dddd;
      & .col-style {
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        height: 50px;
      }
    }
    &:first-child + .el-table__cell > .cell {
      border-left: 2px solid #e0dddd;
      & > div > span:first-child {
        width: 40px;
        height: 60%;
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
    &:last-child > .cell {
      border-right: 2px solid #e0dddd;
    }
  }
}
.el-form > .el-form-item:last-child {
  :deep(.el-form-item__content) {
    justify-content: flex-end;
  }
}
.radio-style {
  margin-right: 10px;
  border-radius: 5px;
  :deep(.el-radio-button__inner) {
    color: #02a7f0;
    border-radius: 5px;
    border: 1px solid #02a7f0;
  }
  .el-radio-button__original-radio:checked + .el-radio-button__inner {
    background: #02a7f0 !important;
    color: white !important;
  }
}
</style>
