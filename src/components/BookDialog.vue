<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑图书' : '添加图书'"
    width="500px"
    @closed="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="书名" prop="title">
        <el-input v-model="formData.title" placeholder="请输入书名" />
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-input v-model="formData.author" placeholder="请输入作者" />
      </el-form-item>

      <el-form-item label="分类" prop="category">
        <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
          <el-option
            v-for="cat in categories"
            :key="cat"
            :label="cat"
            :value="cat"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="价格" prop="price">
        <el-input-number
          v-model="formData.price"
          :min="0"
          :precision="2"
          :step="1"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="库存" prop="stock">
        <el-input-number
          v-model="formData.stock"
          :min="0"
          :step="1"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="出版日期" prop="publishDate">
        <el-date-picker
          v-model="formData.publishDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  book: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
  isEdit: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const formRef = ref(null)
const formData = ref({
  id: null,
  title: '',
  author: '',
  category: '',
  price: 0,
  stock: 0,
  publishDate: ''
})

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const rules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  publishDate: [{ required: true, message: '请选择出版日期', trigger: 'change' }]
}

watch(() => props.book, (newBook) => {
  if (newBook) {
    formData.value = { ...newBook }
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('submit', { ...formData.value })
    handleClose()
  } catch {
    ElMessage.error('请检查表单填写')
  }
}

const handleClose = () => {
  formRef.value?.resetFields()
  visible.value = false
}
</script>