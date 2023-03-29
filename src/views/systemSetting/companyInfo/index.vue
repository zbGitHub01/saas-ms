<template>
  <div class="card-wrap">
    <div>主管理员变更</div>
    <div>
      当前主管理员：
      <span>赵千寻 / 13545456778</span>
    </div>
    <el-button type="primary" plain style="margin: 20px 0 20px 110px" @click="editInfo(1)">修改</el-button>
    <el-divider />
    <div>租户企业信息</div>
    <table class="mt20 table">
      <tbody>
        <tr>
          <td>企业名</td>
          <td>可口可乐有限公司</td>
          <td></td>
          <td></td>
          <td>租户ID</td>
          <td>00001</td>
        </tr>
        <tr>
          <td>注册人姓名</td>
          <td>王小二</td>
          <td></td>
          <td></td>
          <td>注册时间</td>
          <td>2021-08-07 23:23:32</td>
        </tr>
        <tr>
          <td>注册手机号</td>
          <td>
            13344646464
            <el-button type="primary" link @click="editInfo(2)">编辑</el-button>
          </td>
          <td>注册来源</td>
          <td>自主注册</td>
          <td>认证通过时间</td>
          <td>2021-08-08 23:23:30</td>
        </tr>
        <tr>
          <td>主管理员</td>
          <td>王小二/15776756858</td>
          <td>主管理员账号</td>
          <td>15776756858</td>
          <td>租户账号数</td>
          <td>35</td>
        </tr>
      </tbody>
    </table>
    <!-- 图片可点击放大 -->
    <div class="flx-justify-between mt20" style="align-items: flex-start">
      <div style="width: 720px">
        <div class="font">营业执照</div>
        <!-- <img src="../../../assets/images/500.png" alt="avatar" style="width: 360px; height: 150px" /> -->
        <el-image
          style="width: 500px; height: 200px"
          :src="url"
          :zoom-rate="1.2"
          :preview-src-list="srcList"
          :initial-index="1"
          fit="cover"
        />
        <div class="mt15 font">统一社会信用代码</div>
        <div class="mt15">3333</div>
      </div>
      <div style="width: 720px">
        <div class="font">法定代表人身份证照</div>
        <div class="flx-justify-between">
          <img src="../../../assets/images/500.png" alt="avatar" style="width: 250px; height: 110px" />
          <img src="../../../assets/images/500.png" alt="avatar" style="width: 250px; height: 110px" />
        </div>
        <div class="mt15 font">法定代表人</div>
        <div class="mt15">3333</div>
        <div class="mt15 font">法定代表人身份证号</div>
        <div class="mt15">3333</div>
      </div>
    </div>
    <div class="mt30 font">办公地点</div>
    <div class="mt15">浙江省/杭州市/下城区 大街888号能上天大厦8幢166层188号</div>
    <div class="mt30 font">公司logo</div>
    <div>
      <SingleImageUploader v-model="state.info.picture" :width="'120px'" :height="'120px'"/>
      <!-- <img src="../../../assets/images/500.png" alt="avatar" style="width: 150px; height: 80px" /> -->
      <div>请上传宽高比例1:1的图片</div>
    </div>
    <!-- <el-button type="danger" plain @click="toLogout" class="mt40">申请注销</el-button> -->
    <EditDialog ref="editDialog" @getTableData="getTableData" :selectData="selectDataSub"/>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import EditDialog from './components/EditDialog.vue'
import SingleImageUploader from '@/components/UploadFile/SingleImageUploader.vue'
const isEditing = ref<boolean>(false)
const editDialog = ref()
const selectData = reactive({
  peopleList: [] as any[], //员工列表
  roleList: [] as any[], //角色列表
})
const selectDataSub = reactive({
  peopleList: [] as any[], //员工列表
  roleList: [] as any[], //角色列表
})
onMounted(() => {
  getTableData()
  getSelecData()
})
// 图片再处理
const url = ref<String>('')
const srcList = reactive([''])
// 公司信息
const state = reactive({
  info: {
    peopleId: null,
    roleId: null,
    picture: '',
  },
})
// 获取公司信息
const getTableData = async () => {
  const params = {
    companyId: 1
  }
  // 请求得到数据
  // const { code, data, msg } = await xx(params)
  // if(code !== 200){
  //   return ElMessage.error(msg)
  // }
  const infoSub = {
    peopleId: 1,
    roleId: 1,
    peopleName: '王小二',
    phone: '12345678910',
    picture: '',
  }
  state.info = infoSub
}
// 获取下拉
const getSelecData = async () => {
  // 请求得到数据
  // const { code, data, msg } = await xx(form)
  // if(code !== 200){
  //   return ElMessage.error(msg)
  // }
  selectData.peopleList = [
    {
      id: 1,
      text:'张三'
    },
    {
      id: 2,
      text:'李思'
    },
    {
      id: 3,
      text:'王五'
    },
    {
      id: 4,
      text:'八嘎'
    },
  ]
  selectData.roleList = [
    {
      id: 1,
      text: '超级管理员',
    },
    {
      id: 2,
      text: '经理',
    },
    {
      id: 3,
      text: '财务',
    },
    {
      id: 4,
      text: '技术',
    }
  ]
}
// 编辑 1修改主管理员 2修改注册手机号
const editInfo = (type: number) => {
  if(type === 1){
    // 剔除原始角色和账号
    selectDataSub.peopleList = selectData.peopleList.filter(item=>{return item.id !== state.info.peopleId})
    selectDataSub.roleList = selectData.roleList.filter(item=>{return item.id !== state.info.roleId})
  }
  isEditing.value = true
  editDialog.value.open(state.info, type)
  console.log('编辑')
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  tr {
    td {
      height: 30px;
      line-height: 30px;
      padding-left: 5px;
      border: 2px solid #f0f2f5;
      color: #909399;
      &:nth-child(2n) {
        color: black;
        font-weight: 500;
      }
    }
  }
}
</style>
