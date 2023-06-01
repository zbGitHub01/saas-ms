<template>
  <div class="page-wrap">
    <div v-for="(item, index) in templateData" :key="index">
      <div class="item-warp">
        <div class="img-warp">
          <img class="img" :src="index < 2 ? accessAvatar : accessLogo" />
        </div>
        <div class="content-wrap" v-if="index < 2">
          <span class="node-name">{{ item.nodeName }}</span>
          <div class="flx-align-center" v-if="index === 1">
            <span
              style="color: #7F7F80"
              class="ft800 mr8"
              v-if="item.handlerName"
            >{{ item.handlerName }}</span>
            <div class="select_warp" v-if="item.handlerName">
              <span class="btn" @click="onSelect('edit', item)">重选</span>
              <span class="btn btn1" @click="onRemoveInvite(item)">移除</span>
            </div>
            <div @click="onSelect('edit', item)" v-else>
              <span class="item-add">追加审批人</span>
            </div>
          </div>
          <div class="content-input">
            <span>{{ item.step === 1 ? '准入邀请工单发出后' : '准入工单生成后' }}</span>
            <el-input-number
              class="input-number"
              @change="changeDay(item)"
              :min="0"
              :controls="false"
              v-model="item.day"
            ></el-input-number>
            <span>{{ item.step === 1 ? '天内，如未能提交准入审核则自动失效' : '天内，如邀请人未能完成审批则审批工单失效' }}</span>
          </div>
        </div>
        <div class="content-wrap" v-else>
          <span class="node-name">{{ item.nodeName }}</span>
          <div class="flx-align-center">
            <span
              style="color: #7F7F80"
              class="ft800 mr8"
              v-if="item.handlerName"
            >{{ item.handlerName }}</span>
            <div class="select_warp">
              <span
                class="btn"
                :class="!item.handlerName && 'w84'"
                @click="onSelect('edit', item)"
              >{{item.handlerName ? '重选':'添加审批人'}}</span>
              <span v-if="index !== 2" class="btn btn1" @click="onRemove(item.id)">移除</span>
            </div>
          </div>
          <div class="content-input">
            <span>上一步审批通过后</span>
            <el-input-number
              class="input-number"
              @change="changeDay(item)"
              :min="0"
              :controls="false"
              v-model="item.day"
            ></el-input-number>
            <span>天内，如该审批环节未进行审批则审批工单失效</span>
          </div>
        </div>
      </div>
      <div class="arrow-rd">
        <img class="img" :src="accessArrow" />
      </div>
    </div>
    <div class="item-warp">
      <div class="img-warp">
        <img class="img" :src="accessPlus" />
      </div>
      <div class="content-wrap" @click="onSelect('add')">
        <span class="item-add">+ 添加审批人</span>
      </div>
    </div>
    <div class="arrow-rd">
      <img class="img" :src="accessArrow" />
    </div>
    <div class="item-warp">
      <div class="img-warp">
        <img class="img" :src="accessFinish" />
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
import accessAvatar from '@/assets/images/access-avatar.png'
import accessLogo from '@/assets/images/access-logo.png'
import accessArrow from '@/assets/images/access-arrow.png'
import accessPlus from '@/assets/images/access-plus.png'
import accessFinish from '@/assets/images/access-finish.png'
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
// 移除邀请人审批
const onRemoveInvite = async (item: any) => {
  const params = {
    applyType: 3, //审批业务类型 1-减免审批 2-认领审批 3-机构准入审批
    ...item,
    optionId: props.categoryId,
    handlerId: 0,
    handlerName: ''
  }
  const { code, msg } = await Apis.configTmplSave(params)
  if (code !== 200) return
  getConfigList()
  ElMessage.success(msg)
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
:deep(.input-number.el-input-number.is-without-controls .el-input__wrapper) {
  font-size: 12px !important;
  padding: 0 !important;
}
.ft800 {
  font-weight: 800 !important;
}
.w84 {
  width: 84px !important;
}
.page-wrap {
  display: flex;
  flex-direction: column;
  padding: 30px 100px;
  height: calc(100% - 20px);
  overflow-y: auto;
  align-items: flex-start;
  .item-warp {
    display: flex;
    align-items: center;
    .content-wrap {
      margin-left: 10px;
      font-size: 12px;
    }
    span {
      display: block;
      margin-bottom: 4px;
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      color: #7f7f80;
    }
    .node-name {
      font-weight: 800;
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
    .input-number {
      width: 40px;
      height: 20px;
      font-size: 12px;
      margin: 0 8px;
    }

    .item-add {
      width: 89px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid #4d7cfe;
      font-size: 12px;
      text-align: center;
      line-height: 24px;
      color: #4d7cfe;
      cursor: pointer;
    }
    .item-end {
      color: #4d7cfe;
    }
    .select_warp {
      display: flex;
      .btn {
        cursor: pointer;
        width: 34px;
        height: 16px;
        border-radius: 3px;
        border: 1px solid #4d7cfe;
        margin-right: 6px;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
        color: #4d7cfe;
      }
      .btn1 {
        border: 1px solid #d9001b;
        color: #d9001b;
      }
    }
    .img-warp {
      .img {
        width: 32px;
        height: 32px;
        margin-bottom: 2px;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0);
      }
    }
  }
  .arrow-rd .img {
    width: 9px;
    height: 41px;
    margin: 20px 48px;
  }
}
</style>
