<script setup>
import CryptoJS from 'crypto-js'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const isRegister = ref(false)
const form = ref()
// 用于提交的form数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 整个表单的校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const register = async () => {
  // 注册成功之前，先进行校验
  await form.value.validate()
  await userRegisterService(formModel.value)
  // console.log('开始注册', res)
  ElMessage.success('注册成功')
  isRegister.value = false
}
const userStore = useUserStore()
const router = useRouter()
const rememberMe = ref(false)
// 登录成功之前预校验
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  // 如果用户选中了记住密码，将加密后的用户名和密码存储到localStorage
  if (rememberMe.value) {
    localStorage.setItem('rememberMe', 'true')
    localStorage.setItem('username', formModel.value.username)
    const encryptedPassword = CryptoJS.AES.encrypt(
      formModel.value.password,
      'secret key 123'
    ).toString()
    localStorage.setItem('password', encryptedPassword)
  } else {
    // 如果用户没有选择记住密码，清除localStorage中的信息
    localStorage.removeItem('rememberMe')
    localStorage.removeItem('username')
    localStorage.removeItem('password')
  }
  ElMessage.success('登录成功')
  router.push('/echarts/page')
}
// 记住密码
onMounted(() => {
  if (localStorage.getItem('rememberMe') === 'true') {
    formModel.value.username = localStorage.getItem('username')
    const encryptedPassword = localStorage.getItem('password')
    if (encryptedPassword) {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, 'secret key 123')
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8)
      formModel.value.password = originalPassword
    }
    rememberMe.value = true
  }
})
// 切换时重置表单内容
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="13" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册模块 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1 class="title">管理员注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            已有账号？← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录模块 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1 class="title">管理员登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            没有账号？注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
      url('@/assets/login-bg-1.png') no-repeat 58% center / 400px auto,
      url('@/assets/login-bg-2.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
