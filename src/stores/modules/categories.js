// 作品分类相关配置仓库
import { defineStore } from 'pinia'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [
      {
        category_name: '软件应用与开发',
        subcategory_name: [
          'Web 应用与开发',
          '管理信息系统',
          '移动应用开发（非游戏类）',
          '算法设计与应用'
        ],
        player_limit: '1~3',
        teacher_limit: '不多于2人',
        qualify_limit: '不多于3件'
      },
      {
        category_name: '微课与教学辅助',
        subcategory_name: [
          '计算机基础与应用类课程微课（或教学辅助课件）',
          '中、小学数学或自然科学课程微课（或教学辅助课件）',
          '汉语言文学（限于唐诗宋词）微课（或教学辅助课件）',
          '虚拟实验平台'
        ],
        player_limit: '1~3',
        teacher_limit: '不多于2人',
        qualify_limit: '不多于3件'
      },
      {
        category_name: '物联网应用',
        subcategory_name: ['城市管理', '医药卫生', '运动健身', '数字生活'],
        player_limit: '1~3',
        teacher_limit: '不多于2人',
        qualify_limit: '不多于3件'
      },
      {
        category_name: '信息可视化设计',
        subcategory_name: [
          '信息图形设计',
          '动态信息影像（MG 动画）',
          '交互信息设计',
          '数据可视化'
        ],
        player_limit: '1~3',
        teacher_limit: '不多于2人',
        qualify_limit: '不多于3件，包括信息图形设计和MG动画作品合计不多于1件'
      }
    ],
    actions: {
      addCategory(newCategoryData) {
        this.categories.push(newCategoryData)
      },
      editCategory(index, updatedCategoryData) {
        this.categories[index] = updatedCategoryData
      },
      deleteCategory(index) {
        this.categories.splice(index, 1)
      }
    }
  })
})
