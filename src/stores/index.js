import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// import { useUserStore } from './modules/user'
// export { useUserStore }
// import { useCounterStore } from './modules/counter'
// export { useCounterStore }
// 统一导出
export * from './modules/user'
export * from './modules/setting'
export * from './modules/categories'
export * from './modules/manage'
export * from './modules/student'
export * from './modules/teacher'
export * from './modules/pagination'
