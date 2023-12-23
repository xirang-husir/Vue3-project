<script setup>
import {
  useManageStore,
  useCategoriesStore,
  useStudentStore,
  useTeacherStore,
  usePagination
} from '@/stores'
import { ref, computed, onMounted, watch } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import quillEditor from '@/components/QuillEditor.vue'

// 响应式引用存储输入框的值
const searchQuery = ref('')
const manageStore = useManageStore()
const works = computed(() => manageStore.getManageList())
// 计算属性来过滤列表
const filteredWorks = computed(() => {
  // 返回基于搜索查询过滤后的列表
  return works.value.filter((work) => {
    // 检查每个字段是否包含搜索字符串
    return Object.values(work).some((value) =>
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
const { pagination, paginatedData, pageCount } = usePagination(filteredWorks, 4)
// 监听，模糊搜索时重置分页
watch(filteredWorks, () => {
  pagination.value.currentPage = 1
})
const title = ref('新增作品')
const workCategoryOptions = useCategoriesStore().getLocalCategory()
const workSubCategoryOptions = ref({})
const workCategoryOptionsChange = (value) => {
  console.log(value)
  workSubCategoryOptions.value = workCategoryOptions.find(
    (item) => item.category_name == value
  )
  addDialogData.value.workSubCategory = ''
}
const studentInfoOptions = useStudentStore().getLocalStudentList()
const teacherInfoOptions = useTeacherStore().getLocalTeacherList()
const showAddWorkDialog = () => {
  title.value = '新增作品'
  dialogVisible.value = true
}
const handleClose = (done) => {
  done()
}
const dialogVisible = ref(false)

const deleteWork = (row) => {
  console.log(row.id)
  manageStore.deleteManage(row.id)
  ElMessage({
    message: '删除成功',
    type: 'success'
  })
}
const editParticipants = (row) => {
  editParticipantsDialogVisible.value = true
  editParticipantsDialogData.value = row
  console.log(row)
}
const addDialogData = ref({
  // 作品编号
  id: '',
  //作品名称
  workName: '',
  //作品大分类
  workCategory: '',
  //作品小分类
  workSubCategory: '',
  //作品描述
  workDescription: '',
  // 学校
  school: '',
  // 作品状态
  workStatus: '',
  // 作品学生组
  workStudentGroup: [],
  // 作品教师组
  workTeacherGroup: [],
  workStudentGroup1: [],
  workTeacherGroup1: []
})
const sureAdd = () => {
  if (title.value == '编辑作品') {
    manageStore.editManage(addDialogData.value)
    ElMessage({
      message: '编辑成功',
      type: 'success'
    })
    cancelAdd()
    return
  }
  console.log(addDialogData.value, workSubCategoryOptions.value)
  workSubCategoryOptions.value = workCategoryOptions.find(
    (item) => item.category_name == addDialogData.value.workCategory
  )
  if (
    addDialogData.value.workStudentGroup1.length >
    workSubCategoryOptions.value.player_limit[1]
  ) {
    ElMessage({
      message: '学生人数超过限制',
      type: 'error'
    })
    return
  }
  if (
    addDialogData.value.workStudentGroup1.length <
    workSubCategoryOptions.value.player_limit[0]
  ) {
    ElMessage({
      message: '学生人数不足',
      type: 'error'
    })
    return
  }
  if (
    addDialogData.value.workTeacherGroup1.length >
    workSubCategoryOptions.value.teacher_limit
  ) {
    ElMessage({
      message: '教师人数超过限制',
      type: 'error'
    })
    return
  }
  // 查询添加的大类别在作品管理中的数量
  const workCategoryNum = works.value.filter(
    (item) => item.workCategory == addDialogData.value.workCategory
  ).length
  // 判断添加的大类别是否超过限制
  if (
    workCategoryNum >=
    workCategoryOptions.find(
      (item) => item.category_name == addDialogData.value.workCategory
    ).qualify_limit.limit
  ) {
    ElMessage({
      message: '大类别数量超过限制',
      type: 'error'
    })
    return
  }

  for (let item of addDialogData.value.workStudentGroup1) {
    addDialogData.value.workStudentGroup.push(
      studentInfoOptions.find((item1) => item1.studentId == item)
    )
  }
  for (let item of addDialogData.value.workTeacherGroup1) {
    addDialogData.value.workTeacherGroup.push(
      teacherInfoOptions.find((item1) => item1.employeeId == item)
    )
  }

  manageStore.addManage(addDialogData.value)
  ElMessage({
    message: '新增成功',
    type: 'success'
  })
  cancelAdd()
}

const selectStudent = () => {
  console.log(addDialogData.value.workStudentGroup1)
}
const selectTeacher = () => {
  console.log(addDialogData.value.workTeacherGroup1)
}
const cancelAdd = () => {
  dialogVisible.value = false
  addDialogData.value = {
    id: '',
    workName: '',
    workCategory: '',
    workSubCategory: '',
    workDescription: '',
    school: '',
    workStatus: '',
    workStudentGroup: [],
    workTeacherGroup: [],
    workStudentGroup1: [],
    workTeacherGroup1: []
  }
}

const editParticipantsDialogVisible = ref(false)
const editParticipantsDialogData = ref({})

const cancelEditParticipants = () => {
  editParticipantsDialogVisible.value = false
  editParticipantsDialogData.value = {}
  addDialogData.value = {
    id: '',
    workName: '',
    workCategory: '',
    workSubCategory: '',
    workDescription: '',
    school: '',
    workStatus: '',
    workStudentGroup: [],
    workTeacherGroup: [],
    workStudentGroup1: [],
    workTeacherGroup1: []
  }
}
const sureEditParticipants = () => {
  console.log(editParticipantsDialogData.value)
  manageStore.editManage(editParticipantsDialogData.value)
  ElMessage({
    message: '编辑成功',
    type: 'success'
  })
  cancelEditParticipants()
}

const deleteCategoryStudentHandler = (index) => {
  console.log(index)
  editParticipantsDialogData.value.workStudentGroup.splice(index, 1)
}
// const deleteCategoryTeacherHandler = (index) => {
//   console.log(index)
//   editParticipantsDialogData.value.workTeacherGroup.splice(index, 1)
// }

const innerVisibleStudent = ref(false)
const innerVisibleTeacher = ref(false)
// 选择学生
const selectStudentDialog = () => {
  console.log(addDialogData.value.workStudentGroup1)
  addDialogData.value.workStudentGroup1.forEach((item) => {
    if (
      !editParticipantsDialogData.value.workStudentGroup.find(
        (item1) => item1.studentId == item
      )
    ) {
      editParticipantsDialogData.value.workStudentGroup.push(
        studentInfoOptions.find((item1) => item1.studentId == item)
      )
    }
  })
  innerVisibleStudent.value = false
}
// 选择老师
const selectTeacherDialog = () => {
  console.log(addDialogData.value.workTeacherGroup1)
  addDialogData.value.workTeacherGroup1.forEach((item) => {
    if (
      !editParticipantsDialogData.value.workTeacherGroup.find(
        (item1) => item1.employeeId == item
      )
    ) {
      editParticipantsDialogData.value.workTeacherGroup.push(
        teacherInfoOptions.find((item1) => item1.employeeId == item)
      )
    }
  })

  innerVisibleTeacher.value = false
}

const addInnerStudent = () => {
  addDialogData.value.workStudentGroup1 =
    editParticipantsDialogData.value.workStudentGroup.map(
      (item) => item.studentId
    )
  innerVisibleStudent.value = true
}

const addInnerTeacher = () => {
  addDialogData.value.workTeacherGroup1 =
    editParticipantsDialogData.value.workTeacherGroup.map(
      (item) => item.employeeId
    )
  innerVisibleTeacher.value = true
}
// 详情查看
const detailParticipantsDialogVisible = ref(false)
const viewDetails = (row) => {
  detailParticipantsDialogVisible.value = true
  // console.log(row)
  editParticipantsDialogData.value = row
}

const editWorkDialog = (row) => {
  title.value = '编辑作品'
  dialogVisible.value = true
  addDialogData.value = row
  addDialogData.value.workStudentGroup1 = row.workStudentGroup.map(
    (item) => item.studentId
  )
  addDialogData.value.workTeacherGroup1 = row.workTeacherGroup.map(
    (item) => item.employeeId
  )
  // console.log(addDialogData.value)
}
// 富文本编辑器
const onRichText = (value) => {
  console.log(value)
  addDialogData.value.workDescription = value
}
</script>
<template>
  <page-container title="作品管理">
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
            @click="showAddWorkDialog"
            >添加作品</el-button
          >
        </el-col>
      </el-row>
    </template>
    <el-table v-loading="loading" :data="paginatedData" style="width: 100%">
      <el-table-column prop="id" label="作品编号" width="100"></el-table-column>
      <el-table-column prop="workCategory" label="作品大类" align="center" />
      <el-table-column prop="workSubCategory" label="作品小类" align="center" />
      <el-table-column prop="workName" label="作品名称" align="center" />
      <el-table-column prop="workDescription" label="作品简介" align="center">
        <template v-slot="{ row }">
          <div v-html="row.workDescription"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template #default="{ row, $index }">
          <el-button @click="editParticipants(row, $index)"
            >编辑参赛人员
          </el-button>
          <el-button @click="editWorkDialog(row, $index)"
            >编辑作品信息
          </el-button>
          <el-button type="primary" @click="viewDetails(row, $index)"
            >全部详情</el-button
          >
          <el-button @click="deleteWork(row, $index)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="这里暂时空空如也"></el-empty>
      </template>
    </el-table>
  </page-container>

  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :before-close="handleClose"
    width="800px"
  >
    <el-form :model="addDialogData">
      <!--      作品编号-->
      <el-form-item label="作品编号">
        <el-input v-model="addDialogData.id"></el-input>
      </el-form-item>
      <el-form-item label="作品大类">
        <el-select
          v-model="addDialogData.workCategory"
          placeholder="请选择"
          @change="workCategoryOptionsChange"
        >
          <el-option
            v-for="item in workCategoryOptions"
            :key="item.category_name"
            :label="item.category_name"
            :value="item.category_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作品小类">
        <el-select v-model="addDialogData.workSubCategory" placeholder="请选择">
          <el-option
            v-for="item in workSubCategoryOptions.subcategory_name"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作品名称">
        <el-input v-model="addDialogData.workName"></el-input>
      </el-form-item>
      <el-form-item label="作品简介">
        <!--        富文本-->
        <quill-editor
          :value="addDialogData.workDescription"
          @updateValue="onRichText"
        />
        <!--        <el-input v-model="addDialogData.workDescription" type="textarea" :rows="4"></el-input>-->
      </el-form-item>
      <el-form-item label="学校">
        <el-input v-model="addDialogData.school"></el-input>
      </el-form-item>
      <!--      // 作品状态-->
      <el-form-item label="作品状态">
        <el-radio-group v-model="addDialogData.workStatus">
          <el-radio :label="1">已上推</el-radio>
          <el-radio :label="0">未上推</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--      // 下拉选择学生信息-->
      <el-form-item label="学生信息" v-if="title == '新增作品'">
        <el-select
          v-model="addDialogData.workStudentGroup1"
          placeholder="请选择"
          multiple
          @change="selectStudent()"
        >
          <el-option
            v-for="item in studentInfoOptions"
            :key="item.studentId"
            :label="item.name"
            :value="item.studentId"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--      // 下拉选择教师信息-->
      <el-form-item label="教师信息" v-if="title == '新增作品'">
        <el-select
          v-model="addDialogData.workTeacherGroup1"
          placeholder="请选择"
          multiple
          @change="selectTeacher"
        >
          <el-option
            v-for="item in teacherInfoOptions"
            :key="item.employeeId"
            :label="item.name"
            :value="item.employeeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <!--      底部提交按钮-->
      <span class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </span>
    </el-form>
  </el-dialog>
  <!--  编辑参赛人员-->
  <el-dialog
    v-model="editParticipantsDialogVisible"
    title="编辑参赛人员"
    :before-close="handleClose"
    width="800px"
  >
    <!--      展示学生的列表-->
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <h2>学生管理</h2>
      <el-button
        type="primary"
        size="small"
        @click="addInnerStudent"
        style="margin-left: 20px"
        >添加学生
      </el-button>
    </div>
    <el-table
      :data="editParticipantsDialogData.workStudentGroup"
      style="width: 100%"
    >
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="studentId" label="学号" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="grade" label="年级" align="center" />
      <el-table-column prop="major" label="专业" align="center" />
      <el-table-column prop="education" label="学历" align="center" />
      <!--      可以删除一行学生信息-->
      <el-table-column label="操作" align="center">
        <template v-slot="{ $index }">
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCategoryStudentHandler($index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    添加学生的dialog-->
    <el-dialog
      v-model="innerVisibleStudent"
      width="300px"
      title="添加学生"
      append-to-body
    >
      <!--      选择学生的选择框-->
      <el-select
        v-model="addDialogData.workStudentGroup1"
        placeholder="请选择"
        multiple
        @change="selectStudentDialog()"
      >
        <el-option
          v-for="item in studentInfoOptions"
          :key="item.studentId"
          :label="item.name"
          :value="item.studentId"
        ></el-option>
      </el-select>
    </el-dialog>

    <!--      展示教师的列表-->
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <h2 style="margin-top: 20px">教师管理</h2>
      <el-button
        type="primary"
        size="small"
        @click="addInnerTeacher"
        style="margin-left: 20px; margin-top: 20px"
        >添加教师
      </el-button>
      <!--      选择老师的弹窗-->
      <el-dialog
        v-model="innerVisibleTeacher"
        width="300px"
        title="添加教师"
        append-to-body
      >
        <el-select
          v-model="addDialogData.workTeacherGroup1"
          placeholder="请选择"
          multiple
          @change="selectTeacherDialog()"
        >
          <el-option
            v-for="item in teacherInfoOptions"
            :key="item.employeeId"
            :label="item.name"
            :value="item.employeeId"
          ></el-option>
        </el-select>
      </el-dialog>
    </div>
    <el-table
      :data="editParticipantsDialogData.workTeacherGroup"
      style="width: 100%"
    >
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="employeeId" label="工号" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="title" label="职称" align="center" />
      <!--      删除操作-->
      <el-table-column label="操作" align="center">
        <template v-slot="{ $index }">
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCategoryTeacherHandler($index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--      底部提交按钮-->
    <div class="dialog-footer" style="margin-top: 20px">
      <el-button @click="cancelEditParticipants">取 消</el-button>
      <el-button type="primary" @click="sureEditParticipants">确 定</el-button>
    </div>
  </el-dialog>
  <!--  全部详情的dialog-->
  <el-dialog
    v-model="detailParticipantsDialogVisible"
    title="全部详情"
    :before-close="handleClose"
    width="800px"
  >
    <el-form :model="editParticipantsDialogData" label-width="auto">
      <el-form-item label="作品编号">
        <el-input v-model="editParticipantsDialogData.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="作品大类">
        <el-input
          v-model="editParticipantsDialogData.workCategory"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="作品小类">
        <el-input
          v-model="editParticipantsDialogData.workSubCategory"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="作品名称">
        <el-input
          v-model="editParticipantsDialogData.workName"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="作品简介">
        <el-input
          v-model="editParticipantsDialogData.workDescription"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="学校">
        <el-input
          v-model="editParticipantsDialogData.school"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="作品状态">
        <div>
          {{ editParticipantsDialogData.workStatus == 1 ? '已上推' : '未上推' }}
        </div>
      </el-form-item>
      <el-form-item label="学生信息">
        <el-table
          :data="editParticipantsDialogData.workStudentGroup"
          style="width: 100%"
        >
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="studentId" label="学号" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="grade" label="年级" align="center" />
          <el-table-column prop="major" label="专业" align="center" />
          <el-table-column prop="education" label="学历" align="center" />
        </el-table>
      </el-form-item>
      <el-form-item label="教师信息">
        <el-table
          :data="editParticipantsDialogData.workTeacherGroup"
          style="width: 100%"
        >
          <el-table-column prop="name" label="姓名" align="center" />
          <el-table-column prop="employeeId" label="工号" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="title" label="职称" align="center" />
        </el-table>
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
.page-pagination {
  position: fixed;
  left: 222px;
  bottom: 75px;
  width: 300px;
  padding: 10px 0;
  z-index: 10;
}
</style>
