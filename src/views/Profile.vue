<template>
  <el-container class="home-container">
    <el-aside width="200px">
      <div class="logo">📚 图书馆</div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
      >
        <el-menu-item index="/">
          <span>图书管理</span>
        </el-menu-item>
        <el-menu-item index="/profile">
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="header-content">
          <h3>欢迎, {{ state.user?.name }}</h3>
          <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>

      <el-main>
        <div class="content-card">
          <h2>👤 个人中心</h2>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>
                  <span>基本信息</span>
                </template>
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="用户名">
                    {{ state.user?.username }}
                  </el-descriptions-item>
                  <el-descriptions-item label="昵称">
                    {{ state.user?.name }}
                  </el-descriptions-item>
                  <el-descriptions-item label="角色">
                    <el-tag :type="state.user?.role === 'admin' ? 'danger' : 'success'">
                      {{ state.user?.role === 'admin' ? '管理员' : '普通用户' }}
                    </el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card shadow="hover">
                <template #header>
                  <span>系统信息</span>
                </template>
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="图书总数">
                    {{ bookCount }}
                  </el-descriptions-item>
                  <el-descriptions-item label="系统版本">
                    v1.0.0
                  </el-descriptions-item>
                  <el-descriptions-item label="技术栈">
                    Vue3 + Element Plus
                  </el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-col>
          </el-row>

          <el-card shadow="hover" style="margin-top: 20px">
            <template #header>
              <span>修改密码</span>
            </template>
            <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px" style="max-width: 400px">
              <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="pwdForm.oldPassword" type="password" show-password />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="pwdForm.newPassword" type="password" show-password />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="pwdForm.confirmPassword" type="password" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleChangePwd">修改密码</el-button>
                <el-button @click="pwdFormRef?.resetFields()">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'

const router = useRouter()
const { state, logout } = useUserStore()
const activeMenu = ref('/profile')
const pwdFormRef = ref(null)

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const bookCount = computed(() => {
  const books = localStorage.getItem('books')
  return books ? JSON.parse(books).length : 0
})

const validateConfirm = (rule, value, callback) => {
  if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' }
  ]
}

const handleChangePwd = async () => {
  if (!pwdFormRef.value) return
  try {
    await pwdFormRef.value.validate()
    if (pwdForm.oldPassword !== 'admin123' && pwdForm.oldPassword !== 'user123') {
      ElMessage.error('原密码错误')
      return
    }
    ElMessage.success('密码修改成功')
    pwdFormRef.value.resetFields()
  } catch {
    // 验证失败
  }
}

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}

.el-aside {
  background: #304156;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  background: #2b3a4a;
}

.sidebar-menu {
  border: none;
  background: #304156;
}

.sidebar-menu .el-menu-item {
  color: #bfcbd9;
}

.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-menu-item.is-active {
  background: #263445;
  color: #409eff;
}

.el-header {
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.content-card h2 {
  margin-bottom: 20px;
  color: #333;
}
</style>