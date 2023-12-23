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
        player_limit: [1, 3],
        teacher_limit: 2,
        qualify_limit: {
          limit: 3
        }
      },
      {
        category_name: '微课与教学辅助',
        subcategory_name: [
          '计算机基础与应用类课程微课（或教学辅助课件）',
          '中、小学数学或自然科学课程微课（或教学辅助课件）',
          '汉语言文学（限于唐诗宋词）微课（或教学辅助课件）',
          '虚拟实验平台'
        ],
        player_limit: [1, 3],
        teacher_limit: 2,
        qualify_limit: {
          limit: 3
        }
      },
      {
        category_name: '物联网应用',
        subcategory_name: ['城市管理', '医药卫生', '运动健身', '数字生活'],
        player_limit: [1, 3],
        teacher_limit: 2,
        qualify_limit: {
          limit: 3
        }
      },
      {
        category_name: '信息可视化设计',
        subcategory_name: [
          '信息图形设计',
          '动态信息影像（MG 动画）',
          '交互信息设计',
          '数据可视化'
        ],
        player_limit: [1, 3],
        teacher_limit: 2,
        qualify_limit: {
          limit: 3,
          limitType: {
            subType: ['信息图形设计', '动态信息影像（MG 动画）'],
            limit: 2
          }
        }
      }
    ]
  }),
  actions: {
    addCategory(newCategoryData) {
      this.categories.push(newCategoryData)
      this.localCategory()
    },
    localCategory() {
      localStorage.setItem('categories', JSON.stringify(this.categories))
    },
    getLocalCategory() {
      const categoriesList = localStorage.getItem('categories')
      if (categoriesList) {
        this.categories = JSON.parse(categoriesList)
        return this.categories
      } else {
        return this.categories
      }
    },
    editCategory(updatedCategoryData) {
      const index = this.categories.findIndex(
        (item) => item.category_name === updatedCategoryData.category_name
      )
      this.categories[index] = updatedCategoryData
      this.localCategory()
    },
    deleteCategory(index) {
      this.categories.splice(index, 1)
      this.localCategory()
    }
  }
})
