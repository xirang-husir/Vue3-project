import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'
// 用户模块token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    // 定义数据
    const token = ref('')
    // 定义操作数据的方法
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const user = ref({})
    // 重新获取用户信息
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }
    // 清空用户信息使用
    const setUser = (obj) => {
      user.value = obj
    }

    return {
      token,
      setToken,
      removeToken,
      getUser,
      setUser,
      user
    }
  },
  {
    persist: true
  }
)
