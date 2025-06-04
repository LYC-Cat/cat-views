<template>
  <el-container class="app-container">
    <!-- 头部区域 -->
    <el-header class="header">
      <div class="logo">会员管理系统</div>
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


        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="main">
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>


</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { User, Star, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {useRouter} from "vue-router";

var router = useRouter();
router.beforeEach((to, from) => {
  console.log('Navigating to:', to.path)
})

// 添加用户名显示
const username = ref(localStorage.getItem('username') || 'admin')

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

        router.push('/login').then(() => {
          ElMessage.success('已退出登录')
        })

      })
      .catch(() => {
        ElMessage.info('已取消退出')
      })
}

</script>

<style scoped>
.app-container {
  height: 100vh;
  width: 100%;
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

.el-menu-vertical {
  border-right: none;
}
</style>