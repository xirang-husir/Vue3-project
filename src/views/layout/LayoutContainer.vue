<script setup>
import avatar from '@/assets/default.png'
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useLayOutSettingStore, useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
// 管理员信息渲染
const userStore = useUserStore()
onMounted(() => {
  userStore.getUser()
})
// 顶部面包屑
let $route = useRoute()
// 刷新功能实现
let layOutSettingStore = useLayOutSettingStore()
let flag = ref(true)
//监听仓库内部数据是否发生变化,如果发生变化，说明用户点击过刷新按钮
watch(
  () => layOutSettingStore.refsh,
  () => {
    //点击刷新按钮:路由组件销毁
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  }
)
const updateRefsh = () => {
  layOutSettingStore.refsh = !layOutSettingStore.refsh
}
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
// 菜单收缩
let LayOutSettingStore = useLayOutSettingStore()
const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
// 系统设置（主题颜色与暗黑模式）
const drawer = ref(false)

//进行暗黑模式的切换
const dark = ref(false)
const changeDark = () => {
  //获取HTML根节点
  let html = document.documentElement
  //判断HTML标签是否有类名dark
  dark.value ? (html.className = 'dark') : (html.className = '')
}
// 主题颜色
const color = ref('')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
//主题颜色的设置
const setColor = () => {
  //通知js修改根节点的样式对象的属性与属性值
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
  html.style.setProperty('--el-button-bg-color', color.value)
  html.style.setProperty('--el-button-primary-border-color', color.value)
}
const router = useRouter()
const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    userStore.removeToken()
    userStore.setUser()
    router.push('/login')
  } else {
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :class="{ fold: LayOutSettingStore.fold ? true : false }">
      <div class="el-aside">
        <div class="el-aside__logo">
          <img src="@/assets/layout-logo-1.png" alt="Logo" />
          <div class="text">大赛作品管理系统</div>
        </div>
      </div>
      <el-menu
        :collapse="LayOutSettingStore.fold ? true : false"
        active-text-color="yellowgreen"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/echarts/page">
          <el-icon><DataBoard /></el-icon>
          <template #title>
            <span>数据可视化</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/channel">
          <el-icon>
            <Promotion />
          </el-icon>
          <template #title><span>作品频道</span></template>
        </el-menu-item>
        <el-menu-item index="/manage">
          <el-icon>
            <Management />
          </el-icon>
          <template #title><span>作品管理</span></template>
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
          <template #title><span>参赛学生信息</span></template>
        </el-menu-item>
        <el-menu-item index="/teacher/profile">
          <el-icon><List /></el-icon>
          <template #title><span>指导老师信息</span></template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 中间内容区域 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header>
        <div class="tabber">
          <!-- 左侧按钮区域 -->
          <div class="tabber_left">
            <!-- 顶部左侧 -->
            <el-icon style="margin-right: 10px" @click="changeIcon"
              ><component
                :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"
              ></component
            ></el-icon>
            <!-- 左侧面包屑 -->
            <el-breadcrumb separator-icon="ArrowRight">
              <!-- 动态展示匹配到的路由信息 -->
              <el-breadcrumb-item
                v-for="(item, index) in $route.matched"
                :key="index"
                v-show="item.meta.title"
                :to="item.path"
              >
                <el-icon style="margin: 0 5px">
                  <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 右侧的按钮区域 -->
          <div class="tabber_right">
            <!-- 刷新 -->
            <el-button
              size="small"
              icon="Refresh"
              circle
              @click="updateRefsh"
            ></el-button>
            <!-- 全屏 -->
            <el-button
              size="small"
              icon="FullScreen"
              circle
              @click="fullScreen"
            ></el-button>
            <!-- 设置按钮 -->
            <el-button
              size="small"
              icon="Setting"
              circle
              @click="drawer = true"
            ></el-button>
            <!-- 主题设置的抽屉 -->
            <el-drawer
              v-model="drawer"
              title="I am the title"
              :with-header="false"
            >
              <el-form>
                <el-form-item label="主题颜色"
                  ><el-color-picker
                    @change="setColor"
                    v-model="color"
                    show-alpha
                    :predefine="predefineColors"
                    size="big"
                /></el-form-item>
                <el-form-item label="暗黑模式">
                  <el-switch
                    @change="changeDark"
                    v-model="dark"
                    class="mt-2"
                    style="margin-left: 24px"
                    inline-prompt
                    active-icon="MoonNight"
                    inactive-icon="Sunny"
                    size="big"
                  />
                </el-form-item>
              </el-form>
            </el-drawer>
            <!-- 管理员头像与昵称 -->
            <span style="margin: 10px"
              >管理员：<strong>{{
                userStore.user.nickname || userStore.user.username
              }}</strong></span
            >
            <!-- 管理员下拉选项 -->
            <el-dropdown placement="bottom-end" @command="handleCommand">
              <span class="el-dropdown__box">
                <el-avatar :src="userStore.user.user_pic || avatar" />
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile" icon="User"
                    >基本资料</el-dropdown-item
                  >
                  <el-dropdown-item command="avatar" icon="Crop"
                    >更换头像</el-dropdown-item
                  >
                  <el-dropdown-item command="password" icon="EditPen"
                    >重置密码</el-dropdown-item
                  >
                  <el-dropdown-item command="logout" icon="SwitchButton"
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
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <!-- 渲染layout一级路由组件的子路由 -->
            <component :is="Component" v-if="flag" />
          </transition>
        </router-view>
      </el-main>
      <el-footer>大赛作品管理系统 ©2023-12 Created by husir</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  // 左侧菜单栏
  .el-aside {
    width: 200px;
    // background-color: #232323;
    background-color: #001529;
    transition: all 0.4s;
    overflow: hidden;
    &__logo {
      display: flex;
      align-items: center;
      padding-left: 3px;
      margin-top: 10px;
    }

    &__logo img {
      height: 50px;
      width: 45px;
    }
    &__logo .text {
      margin-left: 10px;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
    }
    &.fold {
      width: 49px;
      overflow: hidden; // 添加overflow: hidden;以避免在折叠时出现滚动条
      transition: all 0.4s; // 添加过渡动画
    }
    .el-menu {
      border-right: none;
      background-color: #001529;
    }
  }
  // 顶部导航栏
  .el-header {
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
    // 添加针对 'dark' 类的样式定义
    &.dark {
      .el-header {
        background-color: #333; // 修改为暗黑模式的颜色
        color: #fff; // 修改为暗黑模式的颜色
      }

      .el-main {
        background-color: #222; // 修改为暗黑模式的颜色
        color: #fff; // 修改为暗黑模式的颜色
      }

      .el-footer {
        background-color: #333; // 修改为暗黑模式的颜色
        color: #fff; // 修改为暗黑模式的颜色
      }
    }
  }
  // 底部
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
  // 刷新业务
  .fade-enter-from {
    opacity: 0;
    transform: scale(0);
  }

  .fade-enter-active {
    transition: all 0.3s;
  }

  .fade-enter-to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
