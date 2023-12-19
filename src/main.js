import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import '@/assets/main.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
// 将 Element Plus Icons Vue 导出的所有组件注册为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
