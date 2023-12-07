<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const countdown = ref(10)
const redirect = () => {
  router.push('/login')
}
let timer = null
const enter = () => {
  if (timer) {
    clearTimeout(timer)
  }
  redirect()
}
// 当组件挂载完成时开始倒计时
onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      enter()
    }
  }, 1000)
})
// 当组件即将卸载的时候清除定时器
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>
<template>
  <div class="welcome-page">
    <h2>
      亲爱的管理员,您即将在{{ countdown }}秒后进入大赛后台管理系统...Are you
      ready?
    </h2>
    <el-button @click="enter">Let's go!</el-button>
  </div>
</template>
<style scoped>
.welcome-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  color: #303133;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
}
/* .welcome-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  text-align: center;
} */

.welcome-page h2 {
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 20px;
}
</style>
