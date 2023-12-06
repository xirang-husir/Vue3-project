<script setup>
// 在Vue3 CompositiopnAPI中
// 1.获取路由对象 router 使用 useRouter
// const router = useRouter()
// 2.获取路由参数 route 使用 useRoute
// const route = useRoute()
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, useCounterStore } from '@/stores'
const router = useRouter()
const route = useRoute()
const goList = () => {
  router.push('/list')
  console.log(route, router)
}
const userStore = useUserStore()
const counterStore = useCounterStore()
</script>

<template>
  <div>我是App</div>
  <test-demo></test-demo>
  <el-button @click="$router.push('/home')">跳首页</el-button>
  <el-button @click="goList">跳列表页</el-button>
  <el-button type="info">Info</el-button>
  <el-button type="warning">Warning</el-button>

  <p>{{ userStore.token }}</p>
  <el-button @click="userStore.setToken('asdh a ashdih ')">登录</el-button>
  <el-button @click="userStore.removeToken">退出</el-button>
  <hr />
  <p>{{ counterStore.count }}</p>
  <el-button @click="counterStore.add(2)"> 加法</el-button>
</template>

<style scoped></style>
