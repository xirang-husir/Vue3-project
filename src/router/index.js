import { createRouter, createWebHistory } from 'vue-router'
// createRouter创建路由实例
// 配置history模式
// 1.history模式：createWebHistory 地址栏不带 #
// 2.hash模式：createWebHashHistory 地址栏带 #
const router = createRouter({
  // import.meta.env.BASE_URL: vite中的环境变量，就是vite.config.js中的base 配置项
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
