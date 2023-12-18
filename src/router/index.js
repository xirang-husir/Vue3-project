import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
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
      path: '/welcome/home',
      component: () => import('@/views/welcome/welcomePage.vue')
    }, // 欢迎页面
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      meta: {
        title: '',
        hidden: false,
        icon: ''
      },
      redirect: '/welcome/home',
      children: [
        {
          path: '/echarts/page',
          component: () => import('@/views/echarts/EchartsPage.vue'),
          meta: {
            hidden: false,
            title: '数据可视化',
            icon: 'DataBoard'
          }
        }, // echarts图表
        {
          path: '/manage',
          component: () => import('@/views/works/WorksManage.vue'),
          meta: {
            hidden: false,
            title: '作品管理',
            icon: 'Promotion'
          }
        }, // 作品管理
        {
          path: '/channel',
          component: () => import('@/views/works/WorksChannel.vue'),
          meta: {
            hidden: false,
            title: '频道管理',
            icon: 'Management'
          }
        }, // 频道管理（作品的频道）

        {
          path: 'student/profile',
          component: () => import('@/views/student/StudentProfile.vue'),
          meta: {
            hidden: false,
            title: '参赛学生',
            icon: 'Management'
          }
        }, // 参赛学生信息
        {
          path: 'teacher/profile',
          component: () => import('@/views/teacher/TeacherProfile.vue'),
          meta: {
            hidden: false,
            title: '指导老师',
            icon: 'List'
          }
        } // 指导老师信息
      ]
    },
    // 管理员选项
    {
      path: '/user',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      meta: {
        hidden: false,
        title: '管理员选项',
        icon: 'UserFilled'
      },
      redirect: '/user/profile',
      children: [
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue'),
          meta: {
            hidden: false,
            title: '管理员信息',
            icon: 'User'
          }
        }, // 管理员信息
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue'),
          meta: {
            hidden: false,
            title: '更换头像',
            icon: 'Star'
          }
        }, // 管理员头像
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue'),
          meta: {
            hidden: false,
            title: '管理员密码',
            icon: 'EditPen'
          }
        } // 管理员密码（重置）
      ]
    }
  ]
})

//登录访问拦截，如果没有登录就不能访问除登录页以外的页面
router.beforeEach((to) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
  return true
})
export default router
