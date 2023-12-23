<script setup>
import { useTeacherStore, usePagination } from '@/stores'
import { ref, computed, onMounted, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const teacherStore = useTeacherStore()
console.log(teacherStore, 'teacherStore')
const teacherList = computed(() => teacherStore.getLocalTeacherList())
// 响应式引用存储输入框的值
const searchQuery = ref('')
// 计算属性来过滤列表
const teacherListResult = computed(() => {
  // 返回基于搜索查询过滤后的列表
  return teacherList.value.filter((category) => {
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
  teacherListResult,
  8
)
// 监听，模糊搜索时重置分页
watch(teacherListResult, () => {
  pagination.value.currentPage = 1
})
//删除教师信息
const deleteTeacher = (row) => {
  console.log(row.employeeId)
  teacherStore.deleteTeacher(row.employeeId)
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}
const title = ref('新增教师')
const dialogVisible = ref(false)
const editDialogData = ref({
  name: '',
  employeeId: '',
  username: '',
  email: '',
  phoneNumber: '',
  title: '',
  isJudge: '',
  school: '',
  college: '',
  idType: '',
  idNumber: '',
  avatar: ''
})
const editTeacher = (row) => {
  console.log(row)
  title.value = '编辑教师'
  dialogVisible.value = true
  editDialogData.value = row
}
const handleClose = (done) => {
  done()
  dialogVisible.value = false
}
const sureEdit = () => {
  console.log(editDialogData.value)
  if (title.value == '新增教师') {
    const result = teacherStore.addTeacher(editDialogData.value)
    if (result) {
      ElMessage({
        message: '新增成功',
        type: 'success'
      })
    } else {
      ElMessage({
        message: '新增失败',
        type: 'error'
      })
    }
  } else {
    teacherStore.editTeacher(editDialogData.value)
    ElMessage({
      message: '编辑成功',
      type: 'success'
    })
  }
  dialogVisible.value = false
}
const addTeacher = () => {
  dialogVisible.value = true
  title.value = '新增教师'
  editDialogData.value = {
    name: '',
    employeeId: '',
    username: '',
    email: '',
    phoneNumber: '',
    title: '',
    isJudge: '',
    school: '',
    college: '',
    idType: '',
    idNumber: '',
    avatar: ''
  }
}
const handleFileUpload = (uploadFile) => {
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    editDialogData.value.avatar = reader.result
    console.log(editDialogData.value.avatar)
  }
}
const detailDialogVisible = ref(false)
const teacherDetail = (row) => {
  console.log(row)
  detailDialogVisible.value = true
  editDialogData.value = row
}
</script>

<template>
  <page-container title="教师信息">
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
            @click="addTeacher"
            >新增教师</el-button
          >
        </el-col>
      </el-row>
    </template>
    <el-table style="width: 100%" v-loading="loading" :data="paginatedData">
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="employeeId" label="工号" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="email" label="邮箱" align="center" />
      <el-table-column prop="phoneNumber" label="电话" align="center" />
      <el-table-column prop="title" label="职称" align="center" />
      <el-table-column prop="isJudge" label="是否为评委" align="center">
        <template v-slot="{ row }">
          <span>{{ row.isJudge ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template v-slot="{ row }">
          <el-button type="primary" size="small" @click="teacherDetail(row)"
            >详情</el-button
          >
          <el-button size="small" @click="editTeacher(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteTeacher(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有这里暂时空空如也"></el-empty>
      </template>
    </el-table>
  </page-container>

  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :before-close="handleClose"
    width="800px"
  >
    <el-form :model="editDialogData">
      <el-form-item label="姓名">
        <el-input v-model="editDialogData.name"></el-input>
      </el-form-item>
      <el-form-item label="工号">
        <el-input
          v-model="editDialogData.employeeId"
          :disabled="title == '编辑教师' ? true : false"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="editDialogData.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editDialogData.email"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="editDialogData.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item label="职称">
        <el-input v-model="editDialogData.title"></el-input>
      </el-form-item>
      <el-form-item label="是否为评委">
        <el-radio-group v-model="editDialogData.isJudge">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学校">
        <el-input v-model="editDialogData.school"></el-input>
      </el-form-item>
      <el-form-item label="学院">
        <el-input v-model="editDialogData.college"></el-input>
      </el-form-item>
      <el-form-item label="证件类型">
        <el-input v-model="editDialogData.idType"></el-input>
      </el-form-item>
      <el-form-item label="证件号码">
        <el-input v-model="editDialogData.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="照片">
        <el-upload
          class="avatar-uploader"
          action="#"
          :limit="1"
          :show-file-list="false"
          :on-change="handleFileUpload"
        >
          <img
            v-if="editDialogData.avatar"
            :src="editDialogData.avatar"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="sureEdit">提交</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="detailDialogVisible"
    title="教师详情"
    :before-close="handleClose"
    width="800px"
  >
    <el-form>
      <el-form-item label="姓名">
        <div>{{ editDialogData.name }}</div>
      </el-form-item>
      <el-form-item label="工号">
        <div>{{ editDialogData.employeeId }}</div>
      </el-form-item>
      <el-form-item label="用户名">
        <div>{{ editDialogData.username }}</div>
      </el-form-item>
      <el-form-item label="邮箱">
        <div>{{ editDialogData.email }}</div>
      </el-form-item>
      <el-form-item label="电话">
        <div>{{ editDialogData.phoneNumber }}</div>
      </el-form-item>
      <el-form-item label="职称">
        <div>{{ editDialogData.title }}</div>
      </el-form-item>
      <el-form-item label="是否为评委">
        <div>{{ editDialogData.isJudge ? '是' : '否' }}</div>
      </el-form-item>
      <el-form-item label="学校">
        <div>{{ editDialogData.school }}</div>
      </el-form-item>
      <el-form-item label="学院">
        <div>{{ editDialogData.college }}</div>
      </el-form-item>
      <el-form-item label="证件类型">
        <div>{{ editDialogData.idType }}</div>
      </el-form-item>
      <el-form-item label="证件号码">
        <div>{{ editDialogData.idNumber }}</div>
      </el-form-item>
      <el-form-item label="照片">
        <img
          style="width: 100px; height: 100px"
          v-if="editDialogData.avatar"
          :src="editDialogData.avatar"
          class="avatar"
        />
      </el-form-item>
    </el-form>
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
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.page-pagination {
  position: fixed;
  left: 222px;
  bottom: 75px;
  width: 300px;
  padding: 10px 0;
  z-index: 10;
}
</style>
