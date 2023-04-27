<template>
  <div>
    <div class="banner-wrap">
      <div class="info-container">
        <h1>Hi，{{ userInfo.username }}</h1>
        <p class="message">今天又是充满希望的一天！</p>
        <p class="user-id">
          账号ID：
          <strong>{{ userInfo.id }}</strong>
        </p>
      </div>
      <img class="banner" :src="bannerUrl" alt="banner" />
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="header">
          <div class="title">通知消息</div>
          <el-tabs v-model="notIfMessage">
            <el-tab-pane v-for="(item, index) in notIfMessageTabs" :key="index" :name="index">
              <template #label>
                <span>
                  {{ item.label }}
                  <strong class="strong">{{ item.count }}</strong>
                </span>
              </template>
            </el-tab-pane>
          </el-tabs>
          <el-button size="small" type="primary">一键已读</el-button>
        </div>
        <el-empty :image="tool2Url" description="暂无通知消息" />
      </el-col>
      <el-col :span="8">
        <div class="header">
          <div class="title">业务待办事项</div>
        </div>
        <el-empty :image="tool1Url" description="暂无通知消息" />
      </el-col>
      <el-col :span="8">
        <div class="header">
          <div class="title">个人待办事项</div>
          <el-tabs v-model="todoActive">
            <el-tab-pane v-for="(item, index) in todoList" :key="index" :name="index">
              <template #label>
                <span>
                  {{ item.label }}
                  <strong class="strong">{{ item.count }}</strong>
                </span>
              </template>
            </el-tab-pane>
          </el-tabs>
          <el-button size="small" type="primary" :icon="Plus"></el-button>
        </div>
<!--        <div class="matter-list">-->
<!--          <div class="matter">-->
<!--            <span>今日待办事项001</span>-->
<!--            <span class="icons">-->
<!--              <el-icon class="icon" color="#22d779"><CircleCheckFilled /></el-icon>-->
<!--              <el-icon class="icon" color="#8e8e8e"><DeleteFilled /></el-icon>-->
<!--            </span>-->
<!--          </div>-->
<!--          <div class="matter">-->
<!--            <span>今日待办事项002</span>-->
<!--            <span class="icons">-->
<!--              <el-icon class="icon" color="#22d779"><CircleCheckFilled /></el-icon>-->
<!--              <el-icon class="icon" color="#8e8e8e"><DeleteFilled /></el-icon>-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
        <div class="calendar-wrap">
          <el-calendar v-model="newDate" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGlobalStore } from '@/store'
import { Plus } from '@element-plus/icons-vue'
import bannerUrl from '@/assets/images/home-img.png'
import tool1Url from '@/assets/images/tool1.png'
import tool2Url from '@/assets/images/tool2.png'

const globalStore = useGlobalStore()
const userInfo = computed(() => globalStore.userInfo)
const newDate = ref(new Date())
const notIfMessage = ref(0)
const todoActive = ref(0)
const notIfMessageTabs = ref([
  { label: '全部', count: 2 },
  { label: '已读', count: 2 },
  { label: '未读', count: 0 }
])
const todoList = ref([
  { label: '待办', count: 0 },
  { label: '完成', count: 0 }
])
</script>

<style lang="scss" scoped>
.banner-wrap {
  display: flex;
  justify-content: space-between;
  background-color: white;
  padding: 28px 50px;
  margin-bottom: 20px;
  .banner {
    width: 460px;
    height: 332px;
  }
  .info-container {
    h1 {
      font-size: 34px;
      font-weight: 500;
      margin: 68px 0 10px;
    }
    .message,
    .user-id {
      font-size: 22px;
    }
    .user-id {
      color: #666;
      margin-top: 30px;
      strong {
        color: #ff3445;
      }
    }
  }
}
.calendar-wrap {
  width: 100%;
  :deep(.el-calendar-table .el-calendar-day) {
    height: auto;
    text-align: center;
  }
  :deep(.el-calendar-table td) {
    border: none;
  }
}
.header {
  display: flex;
  align-items: center;
  height: 62px;
  background-color: white;
  border-radius: 4px;
  padding-left: 20px;
  padding-right: 12px;
  margin-bottom: 10px;
  .title {
    font-weight: bold;
    font-size: 18px;
    margin-right: 40px;
  }
  .el-button {
    margin-left: auto;
  }
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
  :deep(.el-tabs__nav-wrap) {
    .el-tabs__item {
      color: #666;
      height: 34px;
      &.is-active {
        color: #333;
      }
    }
    &:after {
      content: none;
    }
  }
  .strong {
    font-weight: 500;
    color: var(--el-color-primary);
  }
}
.el-empty {
  height: 364px;
  background-color: white;
}
.matter-list {
  .matter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background-color: white;
    margin-bottom: 10px;
    .icon {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
