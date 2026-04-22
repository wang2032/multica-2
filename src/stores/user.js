import { ref, computed, reactive } from 'vue'

const state = reactive({
  user: null,
  token: localStorage.getItem('token') || ''
})

const isLoggedIn = computed(() => !!state.token)

const defaultUsers = [
  { id: 1, username: 'admin', password: 'admin123', name: '管理员', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', name: '普通用户', role: 'user' }
]

export function useUserStore() {
  const login = (username, password) => {
    const found = defaultUsers.find(u => u.username === username && u.password === password)
    if (found) {
      const { password: _, ...userInfo } = found
      state.user = userInfo
      state.token = `token_${Date.now()}_${username}`
      localStorage.setItem('token', state.token)
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
    state.user = null
    state.token = ''
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      state.user = JSON.parse(storedUser)
      state.token = storedToken
    }
  }

  checkAuth()

  return { state, isLoggedIn, login, register, logout }
}

export default useUserStore