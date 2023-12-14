import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import '@/assets/main.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 暗黑模式的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
