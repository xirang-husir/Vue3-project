<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  Expand,
  SwitchButton,
  DataBoard,
  ArrowDown,
  List
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { onMounted, onBeforeUnmount } from 'vue'
// 全屏模式
const fullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handleKeyPress = (event) => {
  if (event.keyCode === 122) {
    fullScreen()
  }
}
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/echarts/page">
          <el-icon><DataBoard /></el-icon>
          <span>数据可视化</span>
        </el-menu-item>
        <el-menu-item index="/works/manage">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>作品管理</span>
        </el-menu-item>
        <el-menu-item index="/works/channel">
          <el-icon>
            <Management />
          </el-icon>
          <span>频道管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>管理员选项</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon>
              <User />
            </el-icon>
            <span>管理员信息</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop />
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon>
              <EditPen />
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/student/profile">
          <el-icon>
            <Management />
          </el-icon>
          <span>参赛学生信息</span>
        </el-menu-item>
        <el-menu-item index="/teacher/profile">
          <el-icon><List /></el-icon>
          <span>指导老师信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 中间内容区域 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header>
        <div class="tabber">
          <div class="tabber_left">
            <!-- 顶部左侧 -->
            <el-icon style="margin-right: 10px"><Expand /></el-icon>
            <!-- 左侧面包屑 -->
            <el-breadcrumb separator-icon="ArrowRight">
              <el-breadcrumb-item :to="{ path: '/' }"
                >管理员选项</el-breadcrumb-item
              >
              <el-breadcrumb-item>管理员信息</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="tabber_right">
            <!-- 右侧的按钮区域 -->
            <el-button
              size="small"
              icon="Refresh"
              circle
              @click="updateRefsh"
            ></el-button>
            <el-button
              size="small"
              icon="FullScreen"
              circle
              @click="fullScreen"
            ></el-button>
            <el-popover
              placement="bottom"
              title="主题设置"
              :width="300"
              trigger="hover"
            >
              <!-- 系统设置 -->
              <el-form>
                <el-form-item label="主题颜色">
                  <el-color-picker
                    @change="setColor"
                    v-model="color"
                    size="small"
                    show-alpha
                    :predefine="predefineColors"
                  />
                </el-form-item>
                <el-form-item label="暗黑模式">
                  <el-switch
                    @change="changeDark"
                    v-model="dark"
                    class="mt-2"
                    style="margin-left: 24px"
                    inline-prompt
                    active-icon="MoonNight"
                    inactive-icon="Sunny"
                  />
                </el-form-item>
              </el-form>
              <template #reference>
                <el-button size="small" icon="Setting" circle></el-button>
              </template>
            </el-popover>
            <span style="margin: 10px">管理员：<strong>husir</strong></span>
            <el-dropdown placement="bottom-end">
              <span class="el-dropdown__box">
                <el-avatar :src="avatar" />
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile" :icon="User"
                    >基本资料</el-dropdown-item
                  >
                  <el-dropdown-item command="avatar" :icon="Crop"
                    >更换头像</el-dropdown-item
                  >
                  <el-dropdown-item command="password" :icon="EditPen"
                    >重置密码</el-dropdown-item
                  >
                  <el-dropdown-item command="logout" :icon="SwitchButton"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <!-- 主要内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>大赛作品管理系统 ©2023-12 Created by husir</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;
    // background-color: #999;

    &__logo {
      height: 120px;
      // background: url('@/assets/login-bg-1.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 0px;
    padding-right: 0px;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      margin-right: 10px;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
    .tabber {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
    }

    .tabber_left {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
    .tabber_right {
      display: flex;
      align-items: center;
      margin-left: 20px;
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
