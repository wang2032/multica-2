<template>
  <el-config-provider :locale="zhCn">
    <div class="app-container">
      <el-container>
        <el-header>
          <div class="header-content">
            <h1>📚 图书管理系统</h1>
            <el-button type="primary" @click="showAddDialog">添加图书</el-button>
          </div>
        </el-header>
        <el-main>
          <BookList
            :books="books"
            :categories="categories"
            @edit="handleEdit"
            @delete="handleDelete"
            @refresh="loadBooks"
          />
        </el-main>
      </el-container>
    </div>

    <BookDialog
      v-model="dialogVisible"
      :book="currentBook"
      :categories="categories"
      :is-edit="isEdit"
      @submit="handleSubmit"
    />
  </el-config-provider>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import BookList from './components/BookList.vue'
import BookDialog from './components/BookDialog.vue'

const books = ref([])
const categories = ref(['文学', '科技', '历史', '艺术', '教育', '儿童'])
const dialogVisible = ref(false)
const currentBook = ref(null)
const isEdit = ref(false)

const defaultBooks = [
  { id: 1, title: '红楼梦', author: '曹雪芹', category: '文学', price: 59.00, stock: 10, publishDate: '2020-05-01' },
  { id: 2, title: '三体', author: '刘慈欣', category: '科技', price: 68.00, stock: 5, publishDate: '2019-06-01' },
  { id: 3, title: '明朝那些事儿', author: '当年明月', category: '历史', price: 188.00, stock: 8, publishDate: '2021-01-01' },
  { id: 4, title: '西方美术史', author: '蒋勋', category: '艺术', price: 88.00, stock: 3, publishDate: '2018-09-01' },
  { id: 5, title: '百年孤独', author: '加西亚·马尔克斯', category: '文学', price: 45.00, stock: 12, publishDate: '2017-03-01' },
]

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
    await ElMessageBox.confirm(
      `确定要删除《${book.title}》吗？`,
      '删除确认',
      { type: 'warning' }
    )
    books.value = books.value.filter(b => b.id !== book.id)
    saveBooks()
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

const handleSubmit = (bookData) => {
  if (isEdit.value) {
    const index = books.value.findIndex(b => b.id === bookData.id)
    if (index !== -1) {
      books.value[index] = bookData
    }
    ElMessage.success('修改成功')
  } else {
    bookData.id = Math.max(...books.value.map(b => b.id), 0) + 1
    books.value.unshift(bookData)
    ElMessage.success('添加成功')
  }
  saveBooks()
}

onMounted(() => {
  loadBooks()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.el-header {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.header-content h1 {
  font-size: 24px;
  color: #333;
}

.el-main {
  padding: 20px;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}
</style>