<script setup>
import { useCategoriesStore, usePagination } from '@/stores'
import { ref, computed, onMounted, watch } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
// 响应式引用存储输入框的值
const searchQuery = ref('')
const categoriesStore = useCategoriesStore()
const categories = computed(() => categoriesStore.getLocalCategory())
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
// 定义一个 loading 变量，用于控制加载状态
const loading = ref(true)
// 模拟加载效果
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 750)
})
// 分页逻辑调用
const { pagination, paginatedData, pageCount } = usePagination(
  filteredCategories,
  4
)
// 监听，模糊搜索时重置分页
watch(filteredCategories, () => {
  pagination.value.currentPage = 1
})
// 添加分类
const addCategory = () => {
  titleTip.value = '新增作品类别'
  dialogVisible.value = true
}
const handleClose = () => {
  editDialogData.value = {
    category_name: '',
    subcategory_name: [],
    subcategory_name_tag: '',
    player_limit: [],
    player_limit1: '',
    player_limit2: '',
    teacher_limit: '',
    qualify_limit: {
      limit: '',
      limitType: {
        subType: [],
        limit: ''
      }
    }
  }
  dialogVisible.value = false
}

const dialogVisible = ref(false)
// 编辑分类
const editDialogData = ref({
  category_name: '',
  subcategory_name: [],
  subcategory_name_tag: '',
  player_limit: [],
  player_limit1: '',
  player_limit2: '',
  teacher_limit: '',
  qualify_limit: {
    limit: '',
    limitType: {
      subType: [],
      limit: ''
    }
  }
})

const closeTag = (index) => {
  editDialogData.value.subcategory_name.splice(index, 1)
}
// 添加小类
const add_subcategory_name_tag = () => {
  if (editDialogData.value.subcategory_name_tag) {
    editDialogData.value.subcategory_name.push(
      editDialogData.value.subcategory_name_tag
    )
    editDialogData.value.subcategory_name_tag = ''
  }
}
// 取消弹窗
const cancelAdd = () => {
  dialogVisible.value = false
  editDialogData.value = {
    category_name: '',
    subcategory_name: [],
    subcategory_name_tag: '',
    player_limit: [],
    player_limit1: '',
    player_limit2: '',
    teacher_limit: '',
    qualify_limit: {
      limit: '',
      limitType: {
        subType: [],
        limit: ''
      }
    }
  }
}
// 删除分类
const deleteCategoryHandler = (index) => {
  console.log(index)
  categoriesStore.deleteCategory(index)
  setTimeout(() => {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
  }, 500)
}
const titleTip = ref('新增作品类别')
const editCategoryHandler = (row, index) => {
  titleTip.value = '编辑作品类别'
  console.log(row.qualify_limit, index)
  editDialogData.value.category_name = row.category_name
  editDialogData.value.subcategory_name = row.subcategory_name
  editDialogData.value.teacher_limit = row.teacher_limit
  editDialogData.value.player_limit1 = row.player_limit[0]
  editDialogData.value.player_limit2 = row.player_limit[1]
  editDialogData.value.qualify_limit.limit = row.qualify_limit.limit
  if (row.qualify_limit.limitType) {
    editDialogData.value.qualify_limit.limitType.subType =
      row.qualify_limit.limitType.subType
    editDialogData.value.qualify_limit.limitType.limit =
      row.qualify_limit.limitType.limit
  } else {
    editDialogData.value.qualify_limit.limitType.subType = []
    editDialogData.value.qualify_limit.limitType.limit = ''
  }
  dialogVisible.value = true
}

const sure = () => {
  editDialogData.value.player_limit = [
    editDialogData.value.player_limit1,
    editDialogData.value.player_limit2
  ]
  if (titleTip.value == '新增作品类别') {
    categoriesStore.addCategory(editDialogData.value)
    ElMessage({
      message: '新增成功',
      type: 'success'
    })
  } else {
    categoriesStore.editCategory(editDialogData.value)
    ElMessage({
      message: '编辑成功',
      type: 'success'
    })
  }
  dialogVisible.value = false
  editDialogData.value = {
    category_name: '',
    subcategory_name: [],
    subcategory_name_tag: '',
    player_limit: [],
    player_limit1: '',
    player_limit2: '',
    teacher_limit: '',
    qualify_limit: {
      limit: '',
      limitType: {
        subType: [],
        limit: ''
      }
    }
  }
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
            style="margin-right: 80px"
            @click="addCategory"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
    </template>

    <el-table v-loading="loading" :data="paginatedData" style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="category_name"
        label="大类名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="subcategory_name"
        label="小类名称列表"
        align="center"
      >
        <template v-slot="{ row }">
          <span>{{ row.subcategory_name.join(', ') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="player_limit"
        label="参赛队人员上限"
        align="center"
      >
        <template v-slot="{ row }">
          <span>{{ row.player_limit[0] }} ~ {{ row.player_limit[1] }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="teacher_limit"
        label="指导教师人员上限"
        align="center"
      >
        <template v-slot="{ row }">
          <span>不多于{{ row.teacher_limit }}人</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="qualify_limit"
        label="入围国赛作品数"
        align="center"
      >
        <template v-slot="{ row }">
          <span>不多于{{ row.qualify_limit.limit }}个</span>
          <span
            v-if="
              row.qualify_limit.limitType &&
              row.qualify_limit.limitType.subType.length > 0
            "
          >
            ,{{ row.qualify_limit.limitType.subType.join(', ') }}合计不多于{{
              row.qualify_limit.limitType.limit
            }}个
          </span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作" align="center">
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
  </page-container>

  <el-dialog
    v-model="dialogVisible"
    :title="titleTip"
    :before-close="handleClose"
    width="800px"
  >
    <el-form>
      <el-form-item label="大类名称">
        <el-input v-model="editDialogData.category_name"></el-input>
      </el-form-item>
      <el-form-item label="小类名称">
        <el-tag
          v-for="(item, index) in editDialogData.subcategory_name"
          :key="index"
          closable
          @close="closeTag(index)"
          >{{ item }}</el-tag
        >
        <el-input
          v-model="editDialogData.subcategory_name_tag"
          placeholder="回车以添加"
          @change="add_subcategory_name_tag"
        ></el-input>
      </el-form-item>
      <el-form-item label="参赛队人员上限">
        <el-input-number
          v-model="editDialogData.player_limit1"
          :min="1"
          :max="10"
        ></el-input-number>
        <span> ~ </span>
        <el-input-number
          v-model="editDialogData.player_limit2"
          :min="editDialogData.player_limit1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="指导教师人员上限">
        <el-input-number
          v-model="editDialogData.teacher_limit"
          :min="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="入围国赛作品数">
        <el-input-number
          v-model="editDialogData.qualify_limit.limit"
          :min="1"
        ></el-input-number>
        <el-select
          v-model="editDialogData.qualify_limit.limitType.subType"
          multiple
          placeholder="请选择"
          style="margin-left: 10px"
        >
          <el-option
            v-for="item in editDialogData.subcategory_name"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <span>合计不多于</span>
        <el-input-number
          v-model="editDialogData.qualify_limit.limitType.limit"
          :min="1"
          :max="10"
        ></el-input-number
        ><span>个</span>
      </el-form-item>
    </el-form>
    <span class="dialog-footer">
      <el-button @click="cancelAdd">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </span>
  </el-dialog>
  <div class="page-pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pageCount * pagination.pageSize"
      v-model:current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<style scoped>
.page-pagination {
  position: fixed;
  left: 222px;
  bottom: 75px;
  width: 300px;
  padding: 10px 0;
  z-index: 10;
}
</style>
