<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref, onMounted } from 'vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const loading = ref(true)
// 模拟加载效果
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 750)
})

// 表单ref定义
const pwdFormRef = ref(null)
// 用户store
const userStore = useUserStore()
// 路由
const router = useRouter()
// 表单数据定义
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 表单校验规则定义
const validatePasswordLength = (rule, value, callback) => {
  if (value.length < 6 || value.length > 15) {
    callback(new Error('密码长度需为6-15位'))
  } else {
    callback()
  }
}

const validateNewPassword = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能和原密码相同'))
  } else {
    if (pwdForm.value.re_pwd && value !== pwdForm.value.re_pwd) {
      pwdFormRef.value.validateField('re_pwd')
    }
    callback()
  }
}

const validateRePassword = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单校验规则
const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { validator: validatePasswordLength, trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePasswordLength, trigger: 'blur' },
    { validator: validateNewPassword, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePasswordLength, trigger: 'blur' },
    { validator: validateRePassword, trigger: 'blur' }
  ]
}

// 提交表单方法
const submitForm = async () => {
  await pwdFormRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('密码修改成功')

  // 密码修改成功后，退出重新登录
  // 清空本地存储的 token 和 个人信息
  userStore.setToken('')
  userStore.setUser({})

  // 拦截登录
  router.push('/login')
}

// 重置表单方法
const resetForm = () => {
  pwdFormRef.value.resetFields()
}
</script>
<template>
  <page-container v-loading="loading" title="修改密码">
    <el-form
      :model="pwdForm"
      :rules="rules"
      ref="pwdFormRef"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          v-model="pwdForm.old_pwd"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="pwdForm.new_pwd"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input
          v-model="pwdForm.re_pwd"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">修改密码</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
<style scope>
.el-form {
  width: 500px;
}

.el-form-item {
  margin-bottom: 30px;
}
</style>
