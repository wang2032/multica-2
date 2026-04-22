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
          <h2>📖 图书列表</h2>

          <div class="toolbar">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索书名或作者"
              style="width: 200px"
              clearable
            />
            <el-select v-model="filterCategory" placeholder="选择分类" clearable style="width: 150px">
              <el-option
                v-for="cat in categories"
                :key="cat"
                :label="cat"
                :value="cat"
              />
            </el-select>
            <el-button type="primary" @click="showAddDialog">添加图书</el-button>
          </div>

          <el-table :data="filteredBooks" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="title" label="书名" />
            <el-table-column prop="author" label="作者" />
            <el-table-column prop="category" label="分类" width="100">
              <template #default="{ row }">
                <el-tag type="info">{{ row.category }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="100">
              <template #default="{ row }">
                ¥{{ row.price.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="80" />
            <el-table-column prop="publishDate" label="出版日期" width="120" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[5, 10, 20, 50]"
              layout="total, sizes, prev, pager, next"
            />
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>

  <BookDialog
    v-model="dialogVisible"
    :book="currentBook"
    :categories="categories"
    :is-edit="isEdit"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../stores/user'
import BookDialog from '../components/BookDialog.vue'

const router = useRouter()
const { state, logout } = useUserStore()

const activeMenu = ref('/')
const searchKeyword = ref('')
const filterCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const currentBook = ref(null)
const isEdit = ref(false)

const categories = ref(['文学', '科技', '历史', '艺术', '教育', '儿童'])

const defaultBooks = [
  { id: 1, title: '红楼梦', author: '曹雪芹', category: '文学', price: 59.00, stock: 10, publishDate: '2020-05-01' },
  { id: 2, title: '三体', author: '刘慈欣', category: '科技', price: 68.00, stock: 5, publishDate: '2019-06-01' },
  { id: 3, title: '明朝那些事儿', author: '当年明月', category: '历史', price: 188.00, stock: 8, publishDate: '2021-01-01' },
  { id: 4, title: '西方美术史', author: '蒋勋', category: '艺术', price: 88.00, stock: 3, publishDate: '2018-09-01' },
  { id: 5, title: '百年孤独', author: '加西亚·马尔克斯', category: '文学', price: 45.00, stock: 12, publishDate: '2017-03-01' },
]

const books = ref([])

const loadBooks = () => {
  const stored = localStorage.getItem('books')
  if (stored) {
    books.value = JSON.parse(stored)
  } else {
    books.value = [...defaultBooks]
    saveBooks()
  }
}

const saveBooks = () => {
  localStorage.setItem('books', JSON.stringify(books.value))
}

const filteredBooks = computed(() => {
  let result = books.value

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(b =>
      b.title.toLowerCase().includes(kw) ||
      b.author.toLowerCase().includes(kw)
    )
  }

  if (filterCategory.value) {
    result = result.filter(b => b.category === filterCategory.value)
  }

  return result
})

const total = computed(() => filteredBooks.value.length)

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredBooks.value.slice(start, start + pageSize.value)
})

const showAddDialog = () => {
  currentBook.value = {
    title: '',
    author: '',
    category: categories.value[0],
    price: 0,
    stock: 0,
    publishDate: ''
  }
  isEdit.value = false
  dialogVisible.value = true
}

const handleEdit = (book) => {
  currentBook.value = { ...book }
  isEdit.value = true
  dialogVisible.value = true
}

const handleDelete = async (book) => {
  try {
    await ElMessageBox.confirm(`确定要删除《${book.title}》吗？`, '删除确认', { type: 'warning' })
    books.value = books.value.filter(b => b.id !== book.id)
    saveBooks()
    ElMessage.success('删除成功')
  } catch {
    // 取消
  }
}

const handleSubmit = (bookData) => {
  if (isEdit.value) {
    const index = books.value.findIndex(b => b.id === bookData.id)
    if (index !== -1) books.value[index] = bookData
    ElMessage.success('修改成功')
  } else {
    bookData.id = Math.max(...books.value.map(b => b.id), 0) + 1
    books.value.unshift(bookData)
    ElMessage.success('添加成功')
  }
  saveBooks()
}

const handleLogout = () => {
  logout()
  router.push('/login')
}

onMounted(() => {
  loadBooks()
})
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

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>