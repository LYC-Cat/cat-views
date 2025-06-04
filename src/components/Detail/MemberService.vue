<template>
  <div class="member-service-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>会员服务中心</h1>
      <p>管理您的会员账户，享受专属服务</p>
    </div>


    <!-- 主要功能区域 -->
    <el-tabs v-model="activeTab" class="main-tabs">
      <!-- 账户充值 -->
      <el-tab-pane label="账户充值" name="recharge">
        <template #label>
          <span class="tab-label">
            <el-icon><CreditCard /></el-icon>
            账户充值
          </span>
        </template>

        <el-row :gutter="20">
          <el-col :xs="24" :lg="12">
            <el-card>
              <template #header>
                <div class="card-title">
                  <el-icon><CreditCard /></el-icon>
                  <span>账户充值</span>
                </div>
              </template>

              <el-form :model="rechargeForm" label-width="80px">
                <el-form-item label="会员电话">
                  <el-input
                      v-model="rechargeForm.phone"
                      type="string"
                      placeholder="请输入会员电话"
                      size="large"
                  >
                    <template #prepend>member</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="充值金额">
                  <el-input
                      v-model="rechargeForm.account"
                      type="string"
                      placeholder="请输入充值金额"
                      size="large"
                  >
                    <template #prepend>¥</template>
                  </el-input>
                </el-form-item>


                <el-form-item>
                  <el-button type="primary" @click="handleRecharge" size="large" class="recharge-btn">
                    立即充值
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>

        </el-row>
      </el-tab-pane>


      <!-- 交易记录 -->
      <el-tab-pane label="交易记录" name="history">
        <template #label>
          <span class="tab-label">
            <el-icon><Document /></el-icon>
            交易记录
          </span>
        </template>

        <el-card>
          <template #header>
            <div class="card-title">
              <el-icon><Document /></el-icon>
              <span>交易记录</span>
            </div>
          </template>

          <el-table :data="transactionHistory" stripe>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="scope">
                <span :class="scope.row.amount.startsWith('+') ? 'amount-positive' : 'amount-negative'">
                  {{ scope.row.amount }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="日期" width="150" />

          </el-table>
        </el-card>
      </el-tab-pane>


    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import {
  CreditCard,
  Document,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import service from "@/utils/request.js";

// 响应式数据
const activeTab = ref('recharge')


const rechargeForm = ref({
  phone: '',
  account: ''
})

const transactionHistory = ref([
  {
    time:212,
    amount: '+100.00',
  }

])

const handleRecharge = () => {
  console.log('充值表单数据:', rechargeForm.value);
  const account=parseInt(rechargeForm.value.account)
  service.post("/api/account", rechargeForm.value)
    .then(response => {
      if (response.code === 200) {
        ElMessage.success('充值成功！');
        transactionHistory.value.push({
          time: new Date().toLocaleString(),
          amount: `+${account}`
        })
        // 清空表单
        rechargeForm.value.account = '';
        rechargeForm.value.phone = '';
      } else {
        ElMessage.error(response.message || '充值失败，请稍后再试。');
      }
    })
    .catch(error => {
      console.error('充值请求失败:', error);
      ElMessage.error('充值请求失败，请稍后再试。');
    });

}

</script>

<style scoped>
.member-service-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: bold;
}

.page-header p {
  font-size: 1.1rem;
  opacity: 0.9;
}


.main-tabs {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}


.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}


.recharge-btn {
  width: 100%;
  height: 50px;
  font-size: 1.1rem;
}



.referral-info h4 {
  margin: 0 0 8px 0;
  font-weight: bold;
}

.referral-info p {
  margin: 0;
  color: #666;
}


@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>