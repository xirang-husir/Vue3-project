<script setup>
import { useCategoriesStore } from '@/stores'
import { ref, computed } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
// 响应式引用存储输入框的值
const searchQuery = ref('')
// 计算属性来过滤列表
const filteredCategories = computed(() => {
  // 返回基于搜索查询过滤后的列表
  return categories.value.filter((category) => {
    // 检查每个字段是否包含搜索字符串
    return Object.values(category).some((value) =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})
const categoriesStore = useCategoriesStore()

const categories = computed(() => categoriesStore.categories)

const addCategoryHandler = () => {
  const newCategoryData = {
    category_name: '',
    subcategory_name: [],
    player_limit: '',
    teacher_limit: '',
    qualify_limit: ''
  }
  categoriesStore.addCategory(newCategoryData)
}

const editCategoryHandler = (category, index) => {
  console.log('编辑类别:', category)
  // 假设有新数据
  const updatedCategoryData = { ...category, category_name: '更新后的类别名称' }
  categoriesStore.editCategory(index, updatedCategoryData)
}

const deleteCategoryHandler = (index) => {
  categoriesStore.deleteCategory(index)
}
</script>

<template>
  <page-container title="作品类别">
    <template #extra>
      <el-row type="flex" align="middle" justify="end">
        <el-col
          :span="24"
          style="display: flex; justify-content: flex-end; align-items: center"
        >
          <el-input
            prefix-icon="el-icon-search"
            v-model="searchQuery"
            placeholder="搜索..."
            style="margin-right: 750px"
          ></el-input>
          <el-button
            type="primary"
            size="middle"
            @click="addCategoryHandler"
            style="margin-right: 80px"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
    </template>

    <el-table :data="filteredCategories" style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column
        prop="category_name"
        label="大类名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="subcategory_name" label="小类名称列表" width="260">
        <template v-slot="{ row }">
          <span>{{ row.subcategory_name.join(', ') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="player_limit"
        label="参赛队人员上限"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="teacher_limit"
        label="指导教师人员上限"
        width="180"
      ></el-table-column>
      <el-table-column
        prop="qualify_limit"
        label="国赛队伍上限"
        width="200"
      ></el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" width="200">
        <template v-slot="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="editCategoryHandler(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCategoryHandler($index)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>
<style scoped></style>
