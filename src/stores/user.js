import { ref, computed } from 'vue'
import { createGlobalState } from '@vueuse/core'

const useUserStore = createGlobalState(() => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  const defaultUsers = [
    { id: 1, username: 'admin', password: 'admin123', name: '管理员', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', name: '普通用户', role: 'user' }
  ]

  const isLoggedIn = computed(() => !!token.value)

  const login = (username, password) => {
    const found = defaultUsers.find(u => u.username === username && u.password === password)
    if (found) {
      const { password: _, ...userInfo } = found
      user.value = userInfo
      token.value = `token_${Date.now()}_${username}`
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(userInfo))
      return { success: true }
    }
    return { success: false, message: '用户名或密码错误' }
  }

  const register = (username, password, name) => {
    const exists = defaultUsers.find(u => u.username === username)
    if (exists) {
      return { success: false, message: '用户名已存在' }
    }
    const newUser = {
      id: defaultUsers.length + 1,
      username,
      password,
      name,
      role: 'user'
    }
    defaultUsers.push(newUser)
    return { success: true }
  }

  const logout = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser)
      token.value = storedToken
    }
  }

  checkAuth()

  return { user, token, isLoggedIn, login, register, logout }
})

export default useUserStore