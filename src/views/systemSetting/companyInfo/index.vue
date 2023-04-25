<template>
  <div class="card-wrap">
    <div class="flx-align-center title mb20">
      <div>主管理员变更</div>
      <div class="admin">
        {{ state.tenantInfo.admin }}
      </div>
      <div class="phone ml10">{{ state.tenantInfo.adminPhone }}</div>
      <el-button
        link
        type="primary"
        plain
        @click="edit(1)"
        :disabled="isEditing"
        style="margin-left: 30px; text-decoration: underline"
      >
        修改
      </el-button>
    </div>
    <div class="ge"></div>
    <div class="flx-justify-between mb20 mt20">
      <div class="title">租户企业信息</div>
      <div>
        <el-button plain type="primary" @click="editInfo" v-if="!isEditing">编辑</el-button>
        <el-button plain @click="canceEdit" v-if="isEditing">取消</el-button>
        <el-button plain type="primary" @click="submit" v-if="isEditing">确定</el-button>
      </div>
    </div>
    <el-descriptions title="" :column="3" size="large" border>
      <!-- <template #extra>
      <el-button type="primary">Operation</el-button>
    </template> -->
      <el-descriptions-item label-align="center">
        <template #label>
          <div class="cell-item">公司名</div>
        </template>
        <div v-if="!isEditing">{{ state.tenantInfo.name }}</div>
        <el-input v-else v-model="state.tenantInfo.name" clearable placeholder="请输入公司名"></el-input>
      </el-descriptions-item>
      <el-descriptions-item label-align="center">
        <template #label>
          <div class="cell-item">注册人姓名</div>
        </template>
        <div v-if="!isEditing">{{ state.tenantInfo.registrant }}</div>
        <el-input v-else v-model="state.tenantInfo.registrant" placeholder="请输入注册人姓名" clearable></el-input>
      </el-descriptions-item>
      <el-descriptions-item label-align="center">
        <template #label>
          <div class="cell-item">租户ID</div>
        </template>
        {{ state.tenantInfo.code }}
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">法人姓名</div>
        </template>
        <div v-if="!isEditing">{{ state.tenantInfo.legalPerson }}</div>
        <el-input v-else v-model="state.tenantInfo.legalPerson" clearable placeholder="请输入法人姓名"></el-input>
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">注册手机号</div>
        </template>
        <div class="flx-justify-between">
          <div>{{ state.tenantInfo.registerPhone }}</div>
          <el-button type="primary" link @click="edit(2)" :disabled="isEditing">编辑</el-button>
        </div>
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">租户账号数</div>
        </template>
        {{ state.tenantInfo.accountNum }}
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">法人身份证号</div>
        </template>
        <div v-if="!isEditing">{{ state.tenantInfo.legalPersonIdNo }}</div>
        <el-input
          v-else
          v-model="state.tenantInfo.legalPersonIdNo"
          clearable
          @change="changeIdNo($event)"
          placeholder="请输入法人身份证"
        ></el-input>
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">注册来源</div>
        </template>
        {{ state.tenantInfo.registerSource === 1 ? '自主注册' : state.tenantInfo.registerSource === 2 ? '平台添加' : null }}
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">注册邮箱</div>
        </template>
        <div v-if="!isEditing">{{ state.tenantInfo.mail }}</div>
        <el-input v-else v-model="state.tenantInfo.mail" clearable placeholder="请输入注册邮箱"></el-input>
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">统一社会信用代码</div>
        </template>
        <div v-if="!isEditing">{{ state.tenantInfo.socialCreditCode }}</div>
        <el-input v-else v-model="state.tenantInfo.socialCreditCode" clearable placeholder="请输入统一社会信用代码"></el-input>
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">注册时间</div>
        </template>
        {{ state.tenantInfo.registerTime }}
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">主管理员账号</div>
        </template>
        {{ state.tenantInfo.adminPhone }}
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center" :span="3">
        <template #label>
          <div class="cell-item">办公地点</div>
        </template>
        <div v-if="!isEditing">{{ state.tenantInfo.addressSub2 }}/{{ state.tenantInfo.address }}</div>
        <div v-else>
          <el-cascader
            v-model="state.tenantInfo.addressSub1"
            :options="selectData.areaList"
            placeholder="请选择区域"
            clearable
            :props="state.optionsProps"
            style="width: 100%"
          ></el-cascader>
          <el-input v-model="state.tenantInfo.address" clearable placeholder="请输入详细地址"></el-input>
        </div>
      </el-descriptions-item>
      <el-descriptions-item width="130" label-align="center">
        <template #label>
          <div class="cell-item">认证通过时间</div>
        </template>
        {{ state.tenantInfo.openTime }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="flx-justify-between" style="margin-top: 50px">
      <div class="picture1">
        <div class="font">营业执照</div>
        <div v-if="!isEditing">
          <el-image
            class="image"
            :src="state.tenantInfo.businessLicense"
            :zoom-rate="1.2"
            :preview-src-list="[state.tenantInfo.businessLicense]"
            :initial-index="1"
            fit="fill"
          >
            <template #error>
              <div class="doudi">
                <span>pic</span>
              </div>
            </template>
          </el-image>
        </div>
        <div v-else>
          <SingleImageUploader
            v-model="state.tenantInfo.businessLicense"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'240px'"
            :height="'140px'"
          />
        </div>
      </div>
      <div class="picture2">
        <div class="font">法定代表人身份证照</div>
        <div v-if="!isEditing" class="flx-justify-between">
          <el-image
            class="image"
            :src="state.tenantInfo.legalPersonFrontUrl"
            :zoom-rate="1.2"
            :preview-src-list="[state.tenantInfo.legalPersonFrontUrl]"
            :initial-index="1"
            fit="fill"
          >
            <template #error>
              <div class="doudi">
                <span>pic</span>
              </div>
            </template>
          </el-image>
          <el-image
            class="image"
            :src="state.tenantInfo.legalPersonBackUrl"
            :zoom-rate="1.2"
            :preview-src-list="[state.tenantInfo.legalPersonBackUrl]"
            :initial-index="1"
            fit="fill"
          >
            <template #error>
              <div class="doudi">
                <span>pic</span>
              </div>
            </template>
          </el-image>
        </div>
        <div v-else class="flx-justify-between">
          <SingleImageUploader
            v-model="state.tenantInfo.legalPersonFrontUrl"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'240px'"
            :height="'140px'"
          />
          <SingleImageUploader
            v-model="state.tenantInfo.legalPersonBackUrl"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'240px'"
            :height="'140px'"
          />
        </div>
      </div>
      <div class="picture3">
        <div class="font">公司logo</div>
        <div v-if="!isEditing">
          <el-image
            class="image"
            :src="state.tenantInfo.logo"
            :zoom-rate="1.2"
            :preview-src-list="[state.tenantInfo.logo]"
            :initial-index="1"
            fit="fill"
          >
            <template #error>
              <div class="doudi">
                <span>pic</span>
              </div>
            </template>
          </el-image>
        </div>
        <div v-else>
          <SingleImageUploader
            v-model="state.tenantInfo.logo"
            :actionSub="'/upms/client/sys-file/upload'"
            :width="'108px'"
            :height="'108px'"
          />
        </div>
        <div class="tip">请上传宽高比为1:1的图片</div>
      </div>
    </div>
    <!-- <el-button type="danger" plain @click="toLogout" class="mt40">申请注销</el-button> -->
    <ChangeRegisterDialog ref="changeRegisterDialog" @getTableData="getTableData" />
    <ChangeAdministratorsDialog ref="changeAdministratorsDialog" @getTableData="getTableData" :selectData="selectData" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ChangeRegisterDialog from './components/ChangeRegisterDialog.vue'
import ChangeAdministratorsDialog from './components/ChangeAdministratorsDialog.vue'
import SingleImageUploader from '@/components/UploadFile/SingleImageUploader.vue'
import { useGlobalStore } from '@/store'
import Apis1, { adminTenant } from '@/api/modules/company'
import Apis2 from '@/api/modules/common'
import { traverseDown } from '@/utils/traverse'
const globalStore = useGlobalStore()
const isEditing = ref<boolean>(false)
const changeAdministratorsDialog = ref()
const changeRegisterDialog = ref()
const selectData = reactive({
  peopleList: [] as any[], //员工列表
  roleList: [] as any[], //角色列表
  areaList: [] as any[] //省市区
})
const selectDataSub = reactive({
  peopleList: [] as any[], //员工列表
  roleList: [] as any[] //角色列表
})
onMounted(async () => {
  await getTableData()
  await getSelecData()
})
// 公司信息
const state: any = reactive({
  tenantId: null, //租户主键id
  tenantInfo: {} as any, //详情
  tenantInfoSub: {} as any, //租户详情数据备份
  optionsProps: {
    value: 'pin',
    label: 'name',
    children: 'children',
    checkStrictly: true
  }
})
// 获取公司信息
const getTableData = async () => {
  const { data } = await adminTenant(`${globalStore.tenantId}`)
  state.tenantInfo = data
  // 处理地址（省市区和详细地址）
  state.tenantInfo.addressSub1 = [
    (state.tenantInfo.provinceId || '') + ',' + (state.tenantInfo.provinceName || ''),
    (state.tenantInfo.cityId || '') + ',' + (state.tenantInfo.cityName || ''),
    (state.tenantInfo.areaId || '') + ',' + (state.tenantInfo.areaName || '')
  ]
  state.tenantInfo.addressSub2 = [state.tenantInfo.provinceName, state.tenantInfo.cityName, state.tenantInfo.areaName]
    .filter(el => !!el)
    .join('/')
  state.tenantInfoSub = JSON.parse(JSON.stringify(state.tenantInfo))
}
// 获取下拉
const getSelecData = async () => {
  // 获取员工账号
  const { data } = await Apis1.getEmployeeDrop({ tenantId: globalStore.tenantId })
  // 剔除原始账号
  selectData.peopleList = data.filter((item: any) => {
    if (item.id !== state.tenantInfo.adminId) {
      return item
    }
  })
  // 获取角色
  const { data: data2 } = await Apis2.dictDropdownList({ code: 'ROLE_LIST' })
  selectData.roleList = data2.ROLE_LIST

  // 获取省市区
  const { data: data3 } = await Apis2.areaTree()
  traverseDown(
    data3,
    node => {
      node.pin = node.id + ',' + node.name
    },
    null
  )
  selectData.areaList = data3
}
// 编辑基础信息
const editInfo = async () => {
  isEditing.value = true
}
// 取消编辑基础信息
const canceEdit = () => {
  // 修改表单数据为初始值
  state.tenantInfo = JSON.parse(JSON.stringify(state.tenantInfoSub))
  isEditing.value = false
}
// 确认编辑
const submit = async () => {
  // if(!changeRegisterPhone(state.tenantInfo.registerPhone)){
  //   return
  // }
  if (!changeIdNo(state.tenantInfo.legalPersonIdNo)) {
    return
  }
  // 请求
  const params = {
    admin: state.tenantInfo.admin,
    adminId: state.tenantInfo.adminId,
    adminPhone: state.tenantInfo.adminPhone,
    createId: state.tenantInfo.createId,
    createName: state.tenantInfo.createName,
    id: state.tenantInfo.id,
    registerTime: state.tenantInfo.registerTime,
    staffCount: state.tenantInfo.staffCount,
    state: state.tenantInfo.state,
    name: state.tenantInfo.name,
    registrant: state.tenantInfo.registrant,
    registrantPosition: state.tenantInfo.registrantPosition,
    registerPhone: state.tenantInfo.registerPhone,
    mail: state.tenantInfo.mail,
    businessLicense: state.tenantInfo.businessLicense, //营业执照
    logo: state.tenantInfo.logo,
    legalPersonFrontUrl: state.tenantInfo.legalPersonFrontUrl,
    legalPersonBackUrl: state.tenantInfo.legalPersonBackUrl,
    socialCreditCode: state.tenantInfo.socialCreditCode,
    address: state.tenantInfo.address,
    legalPerson: state.tenantInfo.legalPerson,
    legalPersonIdNo: state.tenantInfo.legalPersonIdNo,
    provinceId: 0,
    provinceName: '', //省
    cityId: 0,
    cityName: '', //市
    areaId: null,
    areaName: '' //区
  }
  state.tenantInfo.addressSub1 = state.tenantInfo.addressSub1 ? state.tenantInfo.addressSub1 : []
  params.provinceId = Number((state.tenantInfo.addressSub1[0] || '').split(',')[0]) || null
  params.provinceName = state.tenantInfo.addressSub1[0]?.split(',')[1] || undefined
  params.cityId = Number((state.tenantInfo.addressSub1[1] || '').split(',')[0]) || null
  params.cityName = state.tenantInfo.addressSub1[1]?.split(',')[1] || undefined
  params.areaId = Number((state.tenantInfo.addressSub1[2] || '').split(',')[0]) || null
  params.areaName = state.tenantInfo.addressSub1[2]?.split(',')[1] || undefined
  console.log(params)
  await Apis1.tenantEdit(params)
  ElMessage.success('修改成功！')
  isEditing.value = false
  getTableData()
}
// 编辑 1修改主管理员 2修改注册手机号
const edit = (type: number) => {
  type === 1 ? changeAdministratorsDialog.value.open(state.tenantInfo) : changeRegisterDialog.value.open(state.tenantInfo)
  console.log('编辑')
}
// 校验身份证
const changeIdNo = (event: any) => {
  // if (!event) {
  //   ElMessage.error('法定代表人身份证号不能为空！')
  //   return
  // }
  // if (event.length !== 18) {
  //   ElMessage.error('请输入正确的18位身份证号！')
  //   return
  // }
  return true
}
</script>

<style lang="scss" scoped>
.title {
  font-weight: 500;
  justify-content: flex-start;
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
  .admin {
    margin-left: 200px;
  }
  .phone {
    font-weight: 400;
    color: #666666;
    line-height: 22px;
  }
}
.ge {
  height: 10px;
  background-color: #f0f2f5;
  margin: 0 -20px 0 -20px;
}
.cell-item {
}
.picture1 {
  width: 240px;
  .image {
    width: 240px;
    height: 140px;
    border-radius: 2px;
  }
  .doudi {
    width: 240px;
    height: 140px;
    border-radius: 2px;
    background-color: #f5f5f5;
    text-align: center;
    span {
      line-height: 140px;
    }
  }
}
.picture2 {
  width: 500px;
  .image {
    width: 240px;
    height: 140px;
    border-radius: 2px;
  }
  .doudi {
    width: 240px;
    height: 140px;
    border-radius: 2px;
    background-color: #f5f5f5;
    text-align: center;
    span {
      line-height: 140px;
    }
  }
}
.picture3 {
  width: 160px;
  margin-right: 45px;
  .image {
    width: 108px;
    height: 108px;
    border-radius: 2px;
  }
  .doudi {
    width: 108px;
    height: 108px;
    border-radius: 2px;
    background-color: #f5f5f5;
    text-align: center;
    span {
      line-height: 108px;
    }
  }
  .tip {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    margin-top: 10px;
  }
}
.font {
  font-size: 18px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 22px;
  margin-bottom: 20px;
}
</style>
