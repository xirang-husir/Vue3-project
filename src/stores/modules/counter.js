import { defineStore } from 'pinia'
import { ref } from 'vue'
// 数字计数器模块
export const useCounterStore = defineStore('big-count', () => {
  // 定义数据
  const count = ref(100)
  // 定义操作数据的方法
  const add = (n) => {
    count.value += n
  }

  return {
    count,
    add
  }
})
