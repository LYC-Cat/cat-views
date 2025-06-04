<script setup>
import { ref } from 'vue'

import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
import { useRouter } from 'vue-router'
import router from "@/router/index.js";


//form data
const form =ref({
  account:"17772392311",
  password:'123456',
  agree:true
})
//rules
const rules = {
  account: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 14, message: '密码长度为6-14个字符', trigger: 'blur' },
  ],
  agree: [
    {
      validator: (rule, value, callback) => {
        console.log(value)
        // 自定义校验逻辑
        // 勾选就通过 不勾选就不通过
        if (value) {
          callback()
        } else {
          callback(new Error('请勾选协议'))
        }
      }
    }
  ]
}
const doLogin=()=>{
  router.push("/")
}


</script>
<template>
<div class="login-container">
  <div class="card">
      <el-card >
        <h1 style="text-align: center">登录页面</h1>
        <div class="form">
          <el-form ref="formRef" :model="form" :rules="rules" label-position="right" label-width="60px" status-icon>
            <el-form-item prop="account" label="账户">
              <el-input v-model="form.account" />
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="form.password" />
            </el-form-item>
            <el-form-item prop="agree" label-width="22px">
              <el-checkbox size="large" v-model="form.agree">
                我已同意隐私条款和服务条款
              </el-checkbox>
            </el-form-item>
            <el-button  size="large" class="subBtn" @click="doLogin">点击登录</el-button>
          </el-form>
        </div>

      </el-card>
  </div>
</div>
</template>
<style>
.login-container{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.card{
  width: 600px;
  height: 300px;
  text-align: center;

}


</style>