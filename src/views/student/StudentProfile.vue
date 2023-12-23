<script setup>
import { useStudentStore, usePagination } from '@/stores'
import { ref, computed, onMounted, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const studentStore = useStudentStore()
console.log(studentStore, 'studentStore')
const studentList = computed(() => studentStore.getLocalStudentList())
// 响应式引用存储输入框的值
const searchQuery = ref('')
// 计算属性来过滤列表
const studentListResult = computed(() => {
  // 返回基于搜索查询过滤后的列表
  return studentList.value.filter((category) => {
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
  studentListResult,
  4
)
// 监听，模糊搜索时重置分页
watch(studentListResult, () => {
  pagination.value.currentPage = 1
})
//删除学生信息
const deleteStudent = (row, index) => {
  console.log(row, index)
  studentStore.deleteStudent(row.studentId)
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}
const title = ref('新增学生')
const dialogVisible = ref(false)
const editDialogData = ref({
  name: '',
  studentId: '',
  username: '',
  grade: '',
  major: '',
  education: '',
  email: '',
  phoneNumber: '',
  idType: '',
  idNumber: '',
  admissionYear: '',
  graduationYear: '',
  school: '',
  avatar: ''
})
const editStudent = (row) => {
  console.log(row)
  title.value = '编辑学生'
  dialogVisible.value = true
  editDialogData.value = row
}
const handleClose = (done) => {
  done()
  dialogVisible.value = false
}
const sureEdit = () => {
  console.log(editDialogData.value)
  if (title.value == '新增学生') {
    const result = studentStore.addStudent(editDialogData.value)
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
    studentStore.editStudent(editDialogData.value)
    ElMessage({
      message: '编辑成功',
      type: 'success'
    })
  }
  dialogVisible.value = false
}
const addStudent = () => {
  dialogVisible.value = true
  title.value = '新增学生'
  editDialogData.value = {
    name: '',
    studentId: '',
    username: '',
    grade: '',
    major: '',
    education: '',
    email: '',
    phoneNumber: '',
    idType: '',
    idNumber: '',
    admissionYear: '',
    graduationYear: '',
    school: '',
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
const studentDetail = (row) => {
  console.log(row)
  detailDialogVisible.value = true
  editDialogData.value = row
}
</script>
<template>
  <page-container title="学生信息">
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
            @click="addStudent"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
    </template>
    <el-table style="width: 100%" v-loading="loading" :data="paginatedData">
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="studentId" label="学号" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="grade" label="年级" align="center" />
      <el-table-column prop="major" label="专业" align="center" />
      <el-table-column prop="education" label="学历" align="center" />
      <el-table-column label="操作" width="220">
        <template v-slot="{ row, $index }">
          <el-button size="small" @click="studentDetail(row)">详情</el-button>
          <el-button size="small" @click="editStudent(row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="deleteStudent(row, $index)"
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
    width="800px"
    :before-close="handleClose"
  >
    <el-form :model="editDialogData" label-width="auto">
      <el-form-item label="姓名">
        <el-input v-model="editDialogData.name" />
      </el-form-item>
      <el-form-item label="学号">
        <el-input
          v-model="editDialogData.studentId"
          :disabled="title == '编辑学生' ? true : false"
        />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="editDialogData.username" />
      </el-form-item>
      <el-form-item label="年级">
        <el-input v-model="editDialogData.grade" />
      </el-form-item>
      <el-form-item label="专业">
        <el-input v-model="editDialogData.major" />
      </el-form-item>
      <el-form-item label="学历">
        <el-input v-model="editDialogData.education" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editDialogData.email" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="editDialogData.phoneNumber" />
      </el-form-item>
      <el-form-item label="证件类型">
        <el-input v-model="editDialogData.idType" />
      </el-form-item>
      <el-form-item label="证件号码">
        <el-input v-model="editDialogData.idNumber" />
      </el-form-item>
      <el-form-item label="入学年份">
        <el-input v-model="editDialogData.admissionYear" />
      </el-form-item>
      <el-form-item label="毕业年份">
        <el-input v-model="editDialogData.graduationYear" />
      </el-form-item>
      <el-form-item label="学校">
        <el-input v-model="editDialogData.school" />
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
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sureEdit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="detailDialogVisible"
    title="学生详情"
    width="800px"
    :before-close="handleClose"
  >
    <el-form>
      <el-form-item label="姓名">
        <div>{{ editDialogData.name }}</div>
      </el-form-item>
      <el-form-item label="学号">
        <div>{{ editDialogData.studentId }}</div>
      </el-form-item>
      <el-form-item label="用户名">
        <div>{{ editDialogData.username }}</div>
      </el-form-item>
      <el-form-item label="年级">
        <div>{{ editDialogData.grade }}</div>
      </el-form-item>
      <el-form-item label="专业">
        <div>{{ editDialogData.major }}</div>
      </el-form-item>
      <el-form-item label="学历">
        <div>{{ editDialogData.education }}</div>
      </el-form-item>
      <el-form-item label="邮箱">
        <div>{{ editDialogData.email }}</div>
      </el-form-item>
      <el-form-item label="电话">
        <div>{{ editDialogData.phoneNumber }}</div>
      </el-form-item>
      <el-form-item label="证件类型">
        <div>{{ editDialogData.idType }}</div>
      </el-form-item>
      <el-form-item label="证件号码">
        <div>{{ editDialogData.idNumber }}</div>
      </el-form-item>
      <el-form-item label="入学年份">
        <div>{{ editDialogData.admissionYear }}</div>
      </el-form-item>
      <el-form-item label="毕业年份">
        <div>{{ editDialogData.graduationYear }}</div>
      </el-form-item>
      <el-form-item label="学校">
        <div>{{ editDialogData.school }}</div>
      </el-form-item>
      <el-form-item label="头像">
        <div>
          <img
            style="width: 100px; height: 100px"
            v-if="editDialogData.avatar"
            :src="editDialogData.avatar"
            class="avatar"
          />
        </div>
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
