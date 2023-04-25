<template>
  <div class="page-wrap">
    <div v-for="(item, index) in templateData" :key="index">
      <div class="item-warp">
        <div class="img-warp">
          <img class="img" :src="index < 3 ? defaultAvatar : orgAvatar" />
          <div class="arrow-rd">
            <svg-icon name="long-arrow-rd" />
          </div>
        </div>
        <div class="content-wrap" v-if="index < 2">
          <span>{{ item.nodeName }}</span>
          <span style="color: #7f7f7f">{{ item.handlerName }}</span>
          <div class="content-input">
            <span>{{ item.step === 1 ? '准入邀请工单发出后' : '准入工单生成后' }}</span>
            <el-input-number
              style="width: 80px; margin: 0 10px"
              @change="changeDay(item)"
              :min="0"
              :controls="false"
              v-model="item.day"
            ></el-input-number>
            <span>{{ item.step === 1 ? '天内，如未能提交准入审核则自动失效' : '天内，如邀请人未能完成审批则审批工单失效' }}</span>
          </div>
        </div>
        <div class="content-wrap" v-else>
          <span>{{ item.nodeName }}</span>
          <span style="color: #7f7f7f">{{ item.handlerName }}</span>
          <div class="select_warp">
            <span class="btn" @click="onSelect('edit', item)">重选</span>
            <span v-if="index !== 2" class="btn btn1" @click="onRemove(item.id)">移除</span>
          </div>
          <div class="content-input">
            <span>上一步审批通过后</span>
            <el-input-number
              style="width: 80px; margin: 0 10px"
              @change="changeDay(item)"
              :min="0"
              :controls="false"
              v-model="item.day"
            ></el-input-number>
            <span>天内，如该审批环节未进行审批则审批工单失效</span>
          </div>
        </div>
      </div>
    </div>
    <div class="item-warp">
      <div class="img-warp">
        <img class="img" src="https://pic.sucaibar.com/pic/201307/16/311d33c37b.png" />
        <div class="arrow-rd">
          <svg-icon name="long-arrow-rd" />
        </div>
      </div>
      <div class="content-wrap" @click="onSelect('add')">
        <span class="item-add">添加审批人</span>
      </div>
    </div>
    <div class="item-warp">
      <div class="img-warp">
        <img
          class="img"
          src="https://bexceed.com.au/wp-content/uploads/2019/02/kisspng-fingerprint-comcast-circle-symbol-technology-tick-5acb37d7297ac2.3455009315232675431699.jpg"
        />
      </div>
      <div class="content-wrap">
        <span class="item-end">审批结束</span>
      </div>
    </div>
    <approver-dialog ref="approverDialogRef" @update-item="updateItem"></approver-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import defaultAvatar from '@/assets/images/ava.png'
import orgAvatar from '@/assets/images/logo1.png'
import approverDialog from './approverDialog.vue'
import { ElMessage } from 'element-plus'
import { useConfirm } from '@/hooks/useConfirm'
import Apis from '@/api/modules/cooperativeOrganization'
const props = defineProps<{
  categoryId: string
}>()
const templateData = ref([])
const selectData = ref({
  type: '',
  day: '',
  nodeName: '',
  step: '',
  id: ''
})
const approverDialogRef = ref()
// 添加重选审批人
const onSelect = (type: string, item?: any) => {
  selectData.value = {
    ...item,
    type
  }
  approverDialogRef.value.open(item)
}
//移除审批人
const onRemove = async (id: number) => {
  await useConfirm('移除当前审批人', Apis.configTmplDel, { id })
  getConfigList()
}
//更新节点
const updateItem = (item: any) => {
  const { type, day, nodeName, step, id } = selectData.value
  let temItem = {
    day: type === 'edit' ? day : 0,
    nodeName: type === 'edit' ? nodeName : '准入审批',
    step: type === 'edit' ? step : '',
    id: type === 'edit' ? id : '',
    handlerId: item.id,
    handlerName: item.name
  }
  let params = {
    ...temItem
  }
  type === 'add' && delete params.id
  otherConfigTmplSave(params)
}
// 改变天数
const changeDay = async (item: any) => {
  await otherConfigTmplSave({ ...item })
}
// 保存
const otherConfigTmplSave = async (item: any) => {
  const params = {
    applyType: 3, //审批业务类型 1-减免审批 2-认领审批 3-机构准入审批
    ...item,
    optionId: props.categoryId
  }
  const { code, msg } = await Apis.configTmplSave(params)
  if (code !== 200) return
  getConfigList()
  ElMessage.success(msg)
}
// type 0:审批失效设置 1:准入更新配置 2:拒绝原因和准入周期设置 3:合规评分卡配置 4:机构退出原因配置 5:机构类型标准 6:判定标签
const getConfigList = async () => {
  let param = {
    optionId: props.categoryId
  }
  const { code, data } = await Apis.configTmplList(param)
  if (code !== 200) return
  const data2 = data.sort(compare('step'))
  templateData.value = data2
}
// 排序
const compare = (p: string) => {
  //这是比较函数
  return function (m: any, n: any) {
    let a = m[p]
    let b = n[p]
    return a - b //升序
  }
}
defineExpose({
  getConfigList
})
</script>

<style scoped lang="scss">
.page-wrap {
  display: flex;
  flex-direction: column;
  padding: 30px 100px;
  height: 100%;
  overflow-y: auto;
  align-items: flex-start;
  .item-warp {
    height: 130px;
    display: flex;
    .content-wrap {
      margin-left: 6px;
    }
    span {
      display: block;
      margin-bottom: 5px;
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 14px;
      color: #333;
    }
    .content-input {
      display: flex;
      align-items: center;
      span {
        font-weight: normal;
      }
    }
    .item-add {
      width: 84px;
      height: 22px;
      margin-top: 10px;
      border: 1px solid #02a7f0;
      border-radius: 5px;
      text-align: center;
      line-height: 22px;
      color: #02a7f0;
      cursor: pointer;
    }
    .item-end {
      margin-top: 10px;
    }
    .select_warp {
      display: flex;
      .btn {
        cursor: pointer;
        width: 45px;
        height: 20px;
        border: 1px solid #02a7f0;
        border-radius: 5px;
        margin-right: 5px;
        text-align: center;
        line-height: 20px;
        font-size: 13px;
        color: #02a7f0;
      }
      .btn1 {
        border: 1px solid #d9001b;
        color: #d9001b;
      }
    }
    .img-warp {
      .img {
        width: 36px;
        height: 36px;
        margin-bottom: 2px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0);
      }
      .arrow-rd {
        font-size: 88px;
        margin-left: -26px;
        margin-top: -22px;
        width: 20px;
      }
    }
  }
}
</style>
