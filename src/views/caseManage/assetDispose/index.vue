<template>
    <div class="card-wrap">
        资产基础配置
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
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
  