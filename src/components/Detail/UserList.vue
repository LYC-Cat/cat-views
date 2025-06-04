<template>
  <div class="user-list">
    <!-- 添加按钮 -->
    <div class="mb-4">
      <el-button type="primary" @click="showAddDialog">新增用户</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"/>
      <el-table-column prop="userName" label="姓名" width="180"/>
      <el-table-column prop="phone" label="电话" width="180"/>
      <el-table-column prop="password" label="密码" width="180"/>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 添加/编辑用户对话框 -->
  <!-- 对话框表单优化 -->
  <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加用户' : '编辑用户'" width="40%">
    <el-form :model="userForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="userForm.userName"/>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="userForm.phone"/>
      </el-form-item>
      <el-form-item label="密码" v-if="dialogType === 'add'">
        <el-input v-model="userForm.password" show-password/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveUser">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus'
import service from "@/utils/request.js";

const tableData = ref([

])
//对话框
const dialogVisible = ref(false)
const dialogType = ref('add')
//form data
const userForm = ref({
  userName: '',
  phone: '',
  password: ''
})
//获取 userlist
const userList = async () => {
  try {
    const res = await service.get("/api/user")
    tableData.value = res.data.map(item => ({
      id: item.id,
      userName: item.userName,
      phone: item.phone,
      password: item.password
    }))
  } catch (error) {
    console.error(error);
  }
}
onMounted(() => {
  userList();
});

//
// 操作处理
const handleEdit = (row) => {
  dialogType.value = 'edit'
  userForm.value = { ...row }
  dialogVisible.value = true
}
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该用户?', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await service.delete(`/api/user/${row.id}`)
    ElMessage.success('删除成功')
    userList()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 保存用户（新增/修改）
const saveUser = async () => {
  try {
    const api = dialogType.value === 'add'
        ? service.post('/api/user', userForm.value)
        : service.put('/api/user', userForm.value)

    await api
    ElMessage.success('操作成功')
    dialogVisible.value = false
    userList()
  } catch (err) {
    console.error(err)
  }
}

// 打开添加对话框
const showAddDialog = () => {
  dialogType.value = 'add'
  userForm.value = { username: '', phone: '', password: '' }
  dialogVisible.value = true
}


</script>

<style lang="scss" scoped>
.user-list {
  height: 1200px;
  width: 100%;

}
</style>
