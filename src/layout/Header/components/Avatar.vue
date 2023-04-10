<template>
  <el-dropdown trigger="click">
    <div class="avatar">
      <img :src="avatar" alt="avatar" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="goUserInfo()">个人中心</el-dropdown-item>
        <el-dropdown-item @click="avatarChange">修改头像</el-dropdown-item>
        <el-dropdown-item @click="logout" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- 更换头像的弹窗 -->
  <!--  <el-dialog v-model="dialogVisible" title="更换头像" width="510px" :before-close="handleClose">-->
  <!--    <div style="display: flex">-->
  <!--      <SingleImageUploader v-model="avatar" />-->
  <!--      <div style="font-size: 13px; color: #bcbcb4; margin-left: 15px; margin-top: 80px">-->
  <!--        <h1>仅支持JPG、GIF、PNG格式图片。</h1>-->
  <!--        <h1>文件大小不超过1M。建议图片尺寸200*200 px</h1>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <template #footer>-->
  <!--      <span class="dialog-footer">-->
  <!--        <el-button @click="handleClose">取消</el-button>-->
  <!--        <el-button type="primary" @click="submitForm()">确认</el-button>-->
  <!--      </span>-->
  <!--    </template>-->
  <!--  </el-dialog>-->
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { useGlobalStore } from '@/store'
// import { SingleImageUploader } from '@/components/UploadFile'

const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()

// 预览图地址
const avatar = ref(globalStore.userInfo?.avatar)

// 点击修改头像
const dialogVisible = ref(false)
const avatarChange = () => {
  dialogVisible.value = true
}

// 取消、关闭弹窗
const handleClose = () => {
  // dialogVisible.value = false
  // if (globalStore.userInfo?.avatar) {
  //   avatar.value = globalStore.userInfo?.avatar
  // }
}

// 确定修改头像
const submitForm = async () => {
  // if (avatar.value == '') {
  //   if (globalStore.userInfo?.avatar) {
  //     avatar.value = globalStore.userInfo?.avatar
  //   }
  // }
  // avatar.value && (await updateAvatar({ avatar: avatar.value }))
  // const { data } = await getUserInfo()
  //
  // // ==== 更新全局store中的用户信息
  // globalStore.setUserInfo(data)
  // dialogVisible.value = false
}

// 退出登录
const logout = () => {
  ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    globalStore.logout()
  })
}

// 个人中心
const goUserInfo = () => {
  router.push('/systemSetting/employee/personal')
}
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
