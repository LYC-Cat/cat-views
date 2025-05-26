<template>
  <el-container class="app-container">
    <!-- 头部区域 -->
    <el-header class="header">
      <div class="logo">logo或标题</div>
      <div class="user-info">
        <span>{{ username }}</span>
        <el-button type="danger" size="small" class="logout-btn" @click="handleLogout">退出登录</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <h3 class="aside-title">菜单</h3>
        <el-menu
            router
            :default-active="$route.path"
            default-active="1-1"
            class="el-menu-vertical"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><user /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/userlist">用户列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>
              <el-icon><star /></el-icon>
              <span>会员管理</span>
            </template>
            <el-menu-item index="/members">会员列表</el-menu-item>
            <el-menu-item index="/member-service">会员充值</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="3">
            <template #title>
              <el-icon><document /></el-icon>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/orders">订单列表</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="main">
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>

  <!-- 添加/编辑用户对话框 -->
  <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="30%"
  >
    <el-form :model="userForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="userForm.username" />
      </el-form-item>
      <el-form-item label="住址">
        <el-input v-model="userForm.address" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { User, Star, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {useRouter} from "vue-router";
// 搜索相关
const searchUsername = ref('')

var router = useRouter();
// 可通过路由守卫打印调试
router.beforeEach((to, from) => {
  console.log('Navigating to:', to.path)
})
// 表格数据
const tableData = ref([
  {
    id: 1,
    username: '张三',
    address: '阿斯顿'
  },
  {
    id: 2,
    username: '李四',
    address: 'ASFDF'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' 或 'edit'
const userForm = reactive({
  id: null,
  username: '',
  address: ''
})
const editingIndex = ref(-1)

// 添加用户名显示
const username = ref(localStorage.getItem('username') || '用户')

// 添加退出登录方法
const handleLogout = () => {
  ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        // 清除登录信息
        localStorage.removeItem('token')
        localStorage.removeItem('username')

        // 跳转到登录页
        // 在实际应用中，这里应该使用 Vue Router 进行路由跳转
        // router.push('/login')
        // window.location.href = '/login'
        router.push('/login').then(() => {
          ElMessage.success('已退出登录')
        })

      })
      .catch(() => {
        ElMessage.info('已取消退出')
      })
}

// 搜索用户
const handleSearch = () => {
  // 实际应用中这里会调用API获取数据
  ElMessage.success('查询成功')
}

// 添加用户
const handleAddUser = () => {
  dialogType.value = 'add'
  userForm.id = null
  userForm.username = ''
  userForm.address = ''
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  dialogType.value = 'edit'
  editingIndex.value = tableData.value.findIndex(item => item.id === row.id)
  userForm.id = row.id
  userForm.username = row.username
  userForm.address = row.address
  dialogVisible.value = true
}

// 删除用户
const handleDelete = (row) => {
  ElMessageBox.confirm(
      `确定要删除用户 ${row.username} 吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        // 实际应用中这里会调用API删除数据
        const index = tableData.value.findIndex(item => item.id === row.id)
        if (index !== -1) {
          tableData.value.splice(index, 1)
        }
        ElMessage.success('删除成功')
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
}

// 保存用户
const saveUser = () => {
  if (!userForm.username) {
    ElMessage.warning('用户名不能为空')
    return
  }

  if (dialogType.value === 'add') {
    // 添加用户
    const newId = tableData.value.length > 0
        ? Math.max(...tableData.value.map(item => item.id)) + 1
        : 1

    tableData.value.push({
      id: newId,
      username: userForm.username,
      address: userForm.address
    })

    ElMessage.success('添加成功')
  } else {
    // 编辑用户
    if (editingIndex.value !== -1) {
      tableData.value[editingIndex.value] = {
        id: userForm.id,
        username: userForm.username,
        address: userForm.address
      }
    }

    ElMessage.success('修改成功')
  }

  dialogVisible.value = false
}

// 分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  // 实际应用中这里会重新加载数据
}

// 页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  // 实际应用中这里会重新加载数据
}

// 页面加载时获取数据
onMounted(() => {
  // 实际应用中这里会调用API获取初始数据
})
</script>

<style scoped>
.app-container {
  height: 100vh;
  width: 100%;
}
.el-main {
  border: 2px solid blue;
}

.header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  margin-left: 10px;
}

.aside {
  background-color: #545c64;
  color: #fff;
}

.aside-title {
  padding: 15px 0;
  text-align: center;
  margin: 0;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.main {
  background-color: #f5f7fa;
  padding: 20px;
}

.search-area {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.pagination-area {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pagination-info {
  margin-right: 15px;
}

.el-menu-vertical {
  border-right: none;
}
</style>