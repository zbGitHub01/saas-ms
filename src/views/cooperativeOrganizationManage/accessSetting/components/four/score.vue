<template>
  <div class="one-wrap">
    <div class="title-wrap">评分项和评分标准</div>
    <div class="score-wrap mt20">
      <div style="display: flex">
        <div class="title-wrap" style="width: 240px">评分项</div>
        <div style="display: flex; flex-wrap: wrap; width: 60%">
          <div v-for="index in 3" :key="index" class="title-wrap" style="width: 33%">评分标准/评分值</div>
        </div>
      </div>
      <div v-for="(item, index) in scoreList" :key="index" class="data-list">
        <div style="width: 240px">
          <el-input v-model="item.name" clearable style="width: 200px" placeholder="评分项"></el-input>
        </div>
        <div style="display: flex; flex-wrap: wrap; width: 60%">
          <div
            style="width: 33%; margin-bottom: 20px"
            v-for="(score, scoreIndex) in item.json"
            :key="scoreIndex"
          >
            <el-input
              v-model="score.scoreCriteria"
              class="score-criteria"
              style="width: 50%"
              placeholder="评分标准"
            ></el-input>
            <el-input-number
              v-model="score.scoreValue"
              class="score-value"
              :min="0"
              :controls="false"
              style="width: 30%"
              placeholder="评分值"
            ></el-input-number>
            <span
              class="mt4"
              v-if="item.json.length > 3"
              style="color: #999; margin-left: 8px; cursor: pointer"
              @click="delStandard(item, scoreIndex)"
            >
              <el-icon>
                <CircleClose />
              </el-icon>
            </span>
          </div>
        </div>
        <div class="mt4">
          <el-button
            type="primary"
            v-if="item.json.length < 6"
            size="small"
            plain
            @click="addStandard(item)"
          >+标准</el-button>
          <el-button type="primary" @click="onSave(item)" size="small">保存</el-button>
          <el-button
            type="primary"
            size="small"
            v-if="scoreList.length > 1"
            plain
            @click="delScore(item, index)"
          >删除</el-button>
        </div>
      </div>
      <el-button type="primary" style="margin: 20px 0 40px" @click="addScore" size="small">+评分项</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Apis from '@/api/modules/cooperativeOrganization'
import { CircleClose } from '@element-plus/icons-vue'
import { useConfirm } from '@/hooks/useConfirm'
import { ElMessage } from 'element-plus'
const props = defineProps<{
  optionIds: string
}>()
const scoreList = ref<any[]>([])
// 保存
const onSave = async (item: any) => {
  const params = {
    type: 3,
    ...item,
    optionId: props.optionIds
  }
  params.json = JSON.stringify(params.json)
  let data
  if (item.id) {
    data = await Apis.configUpdate(params)
  } else {
    data = await Apis.configAdd(params)
  }
  if (data.code !== 200) return
  const msg = item.id ? '修改成功' : '新增成功'
  ElMessage.success(msg)
  getTableData()
}
// 添加评分项
const addScore = () => {
  const temItem = {
    json: [
      {
        scoreCriteria: '',
        scoreValue: ''
      },
      {
        scoreCriteria: '',
        scoreValue: ''
      },
      {
        scoreCriteria: '',
        scoreValue: ''
      }
    ],
    name: ''
  }
  scoreList.value.push(temItem)
}
// 删除评分项
const delScore = async (item: any, index: number) => {
  if (item.id) {
    await useConfirm('要删除该条评分项', Apis.configDelete, { id: item.id })
    getTableData()
  } else {
    await scoreList.value.splice(index, 1)
  }
}
// 添加标准
const addStandard = (item: any) => {
  const temItem = {
    scoreCriteria: '',
    scoreValue: ''
  }
  item.json.push(temItem)
  scoreList.value = JSON.parse(JSON.stringify(scoreList.value))
}
// 删除标准
const delStandard = (item: any, index: number) => {
  item.json.splice(index, 1)
  scoreList.value = JSON.parse(JSON.stringify(scoreList.value))
}
// type 0:审批失效设置 1:准入更新配置 2:拒绝原因和准入周期设置 3:合规评分卡配置 4:机构退出原因配置 5:机构类型标准 6:判定标签
const getTableData = async () => {
  const params = {
    type: 3,
    optionId: props.optionIds
  }
  const { code, data } = await Apis.configList(params)
  if (code !== 200) return
  if (data.length > 0) {
    data.forEach((item: any) => {
      item.json = JSON.parse(item.json)
    })
    scoreList.value = JSON.parse(JSON.stringify(data))
  } else {
    scoreList.value = [
      {
        json: [
          {
            scoreCriteria: '',
            scoreValue: ''
          },
          {
            scoreCriteria: '',
            scoreValue: ''
          },
          {
            scoreCriteria: '',
            scoreValue: ''
          }
        ],
        name: ''
      }
    ]
  }
}
defineExpose({
  getTableData
})
</script>

<style scoped lang="scss">
.one-wrap {
  // width: 100%;
  border-bottom: 1px solid #ddd;
  .title-wrap {
    font-weight: bold;
  }
}
.score-wrap {
  .data-list {
    display: flex;
    padding-top: 20px;
    border-bottom: 1px dashed #eee;
  }
}
</style>
<style lang="scss">
.score-wrap {
  .score-criteria .el-input__wrapper {
    border-radius: 4px 0 0 4px !important;
    line-height: 32px !important;
    margin-top: -1px !important;
  }
  .el-input-number .el-input__inner {
    line-height: 32px !important;
  }
  .score-value .el-input__wrapper {
    border-radius: 0 4px 4px 0 !important;
    margin-left: -1px !important;
    line-height: 32px !important;
  }
  .el-input-number .el-input__inner {
    text-align: left !important;
  }
}
</style>
