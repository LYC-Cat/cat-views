<template>
  <div class="member-list">
    <!-- 添加按钮 -->
    <div class="mb-4">
      <el-button type="primary" @click="showAddDialog">新增用户</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="Id" width="180"/>
      <el-table-column prop="userId" label="用户id" width="180"/>
      <el-table-column prop="name" label="会员姓名" width="180"/>
      <el-table-column prop="account" label="会员账户"/>
      <el-table-column prop="address" label="会员地址" width="180"/>
      <el-table-column prop="phone" label="会员电话" width="180"/>
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
  <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加用户' : '编辑用户'" width="40%">
    <el-form :model="memberForm" label-width="80px">
<!--      <el-form-item label="id">-->
<!--        <el-input v-model="memberForm.id" />-->
<!--      </el-form-item>-->
      <el-form-item label="会员姓名">
        <el-input v-model="memberForm.name"/>
      </el-form-item>
      <el-form-item label="用户id">
        <el-input v-model="memberForm.userId"/>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="memberForm.phone"/>
      </el-form-item>
      <el-form-item label="账号余额">
        <el-input v-model="memberForm.account"/>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="memberForm.address"/>
      </el-form-item>
<!--      <el-form-item label="密码" v-if="dialogType === 'add'">-->
<!--        <el-input v-model="memberForm.password" show-password/>-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveUser">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import service from "@/utils/request.js";
import { ElMessageBox, ElMessage } from "element-plus";
import qs from 'qs';

// 新增响应式声明
const tableData = ref([]) // 初始化空数组
const dialogVisible = ref(false)
const dialogType = ref('add')
const memberForm=ref({
  userId: '',
  name: '',
  account: '',
  phone: '',
  address: ''
})

// 修改后的加载方法
const loadMembers = async () => {
  try {
    const res = await service.get('/api/member')
    console.log(res.data)
    // 正确访问数据路径 [6,8](@ref)
      tableData.value = res.data.map(item => ({
        id: item.id,
        userId: item.userId,
        name: item.name,
        account: item.account,
        phone: item.phone,
        address: item.address
      }))

  } catch (error) {
    ElMessage.error('数据加载失败')
    console.error('API Error:', error) // 调试输出
  }
}

onMounted(() => {
  loadMembers()
})
// 删除操作（简化刷新逻辑）
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该会员？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await service.delete(`/api/member/${row.id}`)
    ElMessage.success('删除成功')
    loadMembers()
  } catch (error) {
    if (error !== 'cancel') {
      console.log(error)
      ElMessage.error('删除失败')
    }
  }
}
// 操作处理
const handleEdit = (row) => {
  dialogType.value = 'edit'
  memberForm.value = { ...row }
  console.log("hehwqe")
  console.log(memberForm)
  console.log(memberForm.value.id)
  dialogVisible.value = true
}
// 保存用户（新增/修改）

const saveUser = async () => {
  try {
    console.log("begin")
    console.log(memberForm.value.id)
    const api = dialogType.value === 'add'
        ? service.post('/api/member', memberForm.value)
        : service.put(`/api/member/${memberForm.value.id}`, memberForm.value)

    await api
    ElMessage.success('操作成功')
    dialogVisible.value = false
    loadMembers()
  } catch (err) {
    console.error(err)
  }
}
// 打开添加对话框
const showAddDialog = () => {
  dialogType.value = 'add'
 memberForm.value = {
    userId: '',
    name: '',
    account: '',
    phone: '',
    address: ''
  }
  dialogVisible.value = true
}





</script>


<style lang="scss" scoped>
.member-list {
  height: 1200px;
}
</style>
