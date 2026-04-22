<template>
  <div class="book-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>图书列表</span>
          <el-button type="primary" @click="$emit('refresh')">刷新数据</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索书名或作者..."
          clearable
          style="width: 300px; margin-right: 16px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select v-model="filterCategory" placeholder="全部分类" clearable style="width: 150px">
          <el-option
            v-for="cat in categories"
            :key="cat"
            :label="cat"
            :value="cat"
          />
        </el-select>
      </div>

      <el-table :data="filteredBooks" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="书名" min-width="150" />
        <el-table-column prop="author" label="作者" width="120" />
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
        <el-table-column prop="stock" label="库存" width="100">
          <template #default="{ row }">
            <el-tag :type="row.stock > 5 ? 'success' : row.stock > 0 ? 'warning' : 'danger'">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishDate" label="出版日期" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="$emit('edit', row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="$emit('delete', row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="filteredBooks.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Edit, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  books: { type: Array, default: () => [] },
  categories: { type: Array, default: () => [] }
})

defineEmits(['edit', 'delete', 'refresh'])

const loading = ref(false)
const searchKeyword = ref('')
const filterCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredBooks = computed(() => {
  let result = props.books

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      b => b.title.toLowerCase().includes(kw) || b.author.toLowerCase().includes(kw)
    )
  }

  if (filterCategory.value) {
    result = result.filter(b => b.category === filterCategory.value)
  }

  const start = (currentPage.value - 1) * pageSize.value
  return result.slice(start, start + pageSize.value)
})
</script>

<style scoped>
.book-list {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  margin-bottom: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>