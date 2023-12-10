// layout组件相关配置仓库
import { defineStore } from 'pinia'

export const useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //控制菜单折叠还是收起控制
      refsh: false //控制刷新效果
    }
  }
})
