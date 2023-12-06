import { createRouter, createWebHistory } from 'vue-router'
// createRouter创建路由实例
// 配置history模式
// 1.history模式：createWebHistory 地址栏不带 #
// 2.hash模式：createWebHashHistory 地址栏带 #
const router = createRouter({
  // import.meta.env.BASE_URL: vite中的环境变量，就是vite.config.js中的base 配置项
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/welcome/home',
      children: [
        {
          path: '/welcome/home',
          component: () => import('@/views/welcome/welcomePage.vue')
        }, // 欢迎页面
        {
          path: '/echarts/page',
          component: () => import('@/views/echarts/EchartsPage.vue')
        }, // echarts图表
        {
          path: '/works/manage',
          component: () => import('@/views/works/WorksManage.vue')
        }, // 作品管理
        {
          path: '/works/channel',
          component: () => import('@/views/works/WorksChannel.vue')
        }, // 频道管理（作品的频道）
        {
          path: 'user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        }, // 用户信息
        {
          path: 'user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        }, // 用户头像
        {
          path: 'user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }, // 用户密码（重置）
        {
          path: 'student/profile',
          component: () => import('@/views/student/StudentProfile.vue')
        }, // 参赛学生信息
        {
          path: 'teacher/profile',
          component: () => import('@/views/teacher/TeacherProfile.vue')
        } // 指导老师信息
      ]
    }
  ]
})

export default router
