<template>
  <div class="member-service-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>会员服务中心</h1>
      <p>管理您的会员账户，享受专属服务</p>
    </div>

    <!-- 会员信息概览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :xs="24" :sm="8">
        <el-card class="level-card">
          <div class="card-header">
            <span>会员等级</span>
            <el-icon><Star /></el-icon>
          </div>
          <div class="card-content">
            <div class="level-name">{{ memberLevel }}</div>
            <el-progress
                :percentage="getLevelProgress()"
                :stroke-width="8"
                :show-text="false"
                color="#f6d55c"
            />
            <p class="level-tip">距离下一等级还需消费 ¥500</p>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="8">
        <el-card class="balance-card">
          <div class="card-header">
            <span>账户余额</span>
            <el-icon><Wallet /></el-icon>
          </div>
          <div class="card-content">
            <div class="balance-amount">¥{{ balance }}</div>
            <p class="balance-tip">可用余额</p>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="8">
        <el-card class="points-card">
          <div class="card-header">
            <span>积分余额</span>
            <el-icon><Star /></el-icon>
          </div>
          <div class="card-content">
            <div class="points-amount">2,580</div>
            <p class="points-tip">可兑换积分</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

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
                <el-form-item label="充值金额">
                  <el-input
                      v-model="rechargeForm.amount"
                      type="number"
                      placeholder="请输入充值金额"
                      size="large"
                  >
                    <template #prepend>¥</template>
                  </el-input>
                </el-form-item>

                <el-form-item label="快速充值">
                  <div class="quick-recharge">
                    <el-button
                        v-for="amount in quickRechargeAmounts"
                        :key="amount"
                        @click="handleQuickRecharge(amount)"
                        size="large"
                        class="quick-btn"
                    >
                      ¥{{ amount }}
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item label="支付方式">
                  <el-select v-model="rechargeForm.paymentMethod" placeholder="选择支付方式" size="large">
                    <el-option label="微信支付" value="wechat" />
                    <el-option label="支付宝" value="alipay" />
                    <el-option label="银行卡" value="card" />
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="handleRecharge" size="large" class="recharge-btn">
                    立即充值
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>

          <el-col :xs="24" :lg="12">
            <el-card>
              <template #header>
                <div class="card-title">
                  <el-icon><Money /></el-icon>
                  <span>充值优惠</span>
                </div>
              </template>

              <el-alert
                  title="充值满500元即可获得50元奖励金！"
                  type="success"
                  :closable="false"
                  show-icon
                  class="promo-alert"
              />

              <div class="promo-list">
                <div class="promo-item">
                  <span>充值 ¥200</span>
                  <el-tag type="success">送 ¥10</el-tag>
                </div>
                <div class="promo-item">
                  <span>充值 ¥500</span>
                  <el-tag type="success">送 ¥50</el-tag>
                </div>
                <div class="promo-item">
                  <span>充值 ¥1000</span>
                  <el-tag type="success">送 ¥120</el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 福利通知 -->
      <el-tab-pane label="福利通知" name="notifications">
        <template #label>
          <span class="tab-label">
            <el-icon><Bell /></el-icon>
            福利通知
            <el-badge v-if="unreadCount > 0" :value="unreadCount" class="notification-badge" />
          </span>
        </template>

        <el-card>
          <template #header>
            <div class="card-title">
              <el-icon><Bell /></el-icon>
              <span>福利通知</span>
            </div>
          </template>

          <div class="notifications-list">
            <div
                v-for="notification in notifications"
                :key="notification.id"
                :class="['notification-item', { 'unread': !notification.read }]"
                @click="markNotificationAsRead(notification.id)"
            >
              <div class="notification-icon">{{ getNotificationIcon(notification.type) }}</div>
              <div class="notification-content">
                <h4 class="notification-title">
                  {{ notification.title }}
                  <el-tag v-if="!notification.read" type="danger" size="small">新</el-tag>
                </h4>
                <p class="notification-text">{{ notification.content }}</p>
                <span class="notification-time">{{ notification.time }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 会员福利 -->
      <el-tab-pane label="会员福利" name="benefits">
        <template #label>
          <span class="tab-label">
            <span class="emoji-icon">🎁</span>
            会员福利
          </span>
        </template>

        <el-row :gutter="20" class="benefits-grid">
          <el-col :xs="24" :sm="12" v-for="(benefit, index) in memberBenefits" :key="index">
            <el-card class="benefit-card" shadow="hover">
              <template #header>
                <div class="benefit-header">
                  <span class="benefit-emoji">{{ benefit.emoji }}</span>
                  <span>{{ benefit.title }}</span>
                </div>
              </template>
              <p class="benefit-description">{{ benefit.description }}</p>
              <el-button type="primary" plain class="benefit-btn">立即使用</el-button>
            </el-card>
          </el-col>
        </el-row>

        <el-card class="referral-card">
          <template #header>
            <div class="card-title">
              <el-icon><User /></el-icon>
              <span>推荐好友</span>
            </div>
          </template>

          <div class="referral-content">
            <div class="referral-info">
              <h4>邀请好友奖励</h4>
              <p>成功邀请一位好友注册，您和好友都可获得50元奖励</p>
            </div>
            <el-button type="primary" size="large">
              <el-icon><Share /></el-icon>
              立即邀请
            </el-button>
          </div>
        </el-card>
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
            <el-table-column prop="type" label="交易类型" width="120" />
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="scope">
                <span :class="scope.row.amount.startsWith('+') ? 'amount-positive' : 'amount-negative'">
                  {{ scope.row.amount }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="150" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag type="success">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 用户数据表格 -->
      <el-tab-pane label="用户数据" name="userdata">
        <template #label>
          <span class="tab-label">
            <el-icon><User /></el-icon>
            用户数据
          </span>
        </template>

        <el-card>
          <template #header>
            <div class="card-title">
              <el-icon><User /></el-icon>
              <span>用户数据表格</span>
            </div>
          </template>

          <el-table :data="tableData" height="250" style="width: 100%">
            <el-table-column prop="userid" label="UserId" width="180" />
            <el-table-column prop="name" label="Name" width="180" />
            <el-table-column prop="account" label="Account">
              <template #default="scope">
                <span class="account-amount">¥{{ scope.row.account.toLocaleString() }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  CreditCard,
  Bell,
  Document,
  Star,
  Wallet,
  Money,
  User,
  Share
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const activeTab = ref('recharge')
const balance = ref(1580)
const memberLevel = ref('Gold')

const rechargeForm = ref({
  amount: '',
  paymentMethod: ''
})

const quickRechargeAmounts = [100, 200, 500, 1000]

const notifications = ref([
  {
    id: 1,
    title: "双倍积分活动",
    content: "本周末所有消费可获得双倍积分奖励",
    type: "promotion",
    time: "2小时前",
    read: false,
  },
  {
    id: 2,
    title: "生日专属福利",
    content: "您的生日月专属8折优惠券已到账",
    type: "benefit",
    time: "1天前",
    read: false,
  },
  {
    id: 3,
    title: "等级升级通知",
    content: "恭喜您升级为黄金会员，享受更多特权",
    type: "upgrade",
    time: "3天前",
    read: true,
  },
])

const memberBenefits = ref([
  { emoji: '⭐', title: "专属折扣", description: "享受会员专属9折优惠" },
  { emoji: '🎁', title: "生日礼品", description: "生日月免费礼品一份" },
  { emoji: '🚀', title: "优先服务", description: "享受优先客服支持" },
  { emoji: '💎', title: "积分翻倍", description: "消费积分获得翻倍奖励" },
])

const transactionHistory = ref([
  { id: 1, type: "充值", amount: "+500", date: "2024-01-15", status: "成功" },
  { id: 2, type: "消费", amount: "-120", date: "2024-01-14", status: "成功" },
  { id: 3, type: "充值", amount: "+200", date: "2024-01-12", status: "成功" },
  { id: 4, type: "退款", amount: "+80", date: "2024-01-10", status: "成功" },
])

// 用户数据表格
const tableData = ref([
  {
    userid: 1,
    name: 'Tom',
    account: 2000,
  },
  {
    userid: 2,
    name: '里斯',
    account: 203300,
  },
  {
    userid: 3,
    name: '加里奥',
    account: 2000,
  },
  {
    userid: 4,
    name: '艾希',
    account: 2000,
  },
])

// 计算属性
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// 方法
const getLevelProgress = () => {
  const levels = { Bronze: 25, Silver: 50, Gold: 75, Platinum: 100 }
  return levels[memberLevel.value] || 0
}

const getNotificationIcon = (type) => {
  switch (type) {
    case "promotion": return "🎉"
    case "benefit": return "🎁"
    case "upgrade": return "⭐"
    default: return "📢"
  }
}

const handleRecharge = () => {
  if (rechargeForm.value.amount) {
    balance.value += parseInt(rechargeForm.value.amount)
    rechargeForm.value.amount = ''
    ElMessage.success('充值成功！')
  }
}

const handleQuickRecharge = (amount) => {
  balance.value += amount
  ElMessage.success(`充值 ¥${amount} 成功！`)
}

const markNotificationAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
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

.overview-cards {
  margin-bottom: 30px;
}

.level-card, .balance-card, .points-card {
  background: linear-gradient(135deg, #f6d55c 0%, #f39c12 100%);
  border: none;
  color: white;
}

.balance-card {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.points-card {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.card-content {
  text-align: center;
}

.level-name, .balance-amount, .points-amount {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.level-tip, .balance-tip, .points-tip {
  font-size: 0.8rem;
  opacity: 0.8;
  margin: 0;
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

.emoji-icon {
  font-size: 1.2rem;
}

.notification-badge {
  margin-left: 5px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.quick-recharge {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.quick-btn {
  height: 50px;
}

.recharge-btn {
  width: 100%;
  height: 50px;
  font-size: 1.1rem;
}

.promo-alert {
  margin-bottom: 20px;
}

.promo-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.promo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}

.notification-item.unread {
  background: #e3f2fd;
  border-color: #2196f3;
}

.notification-item:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.notification-icon {
  font-size: 2rem;
}

.notification-content {
  flex: 1;
}

.notification-title {
  margin: 0 0 8px 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}

.notification-text {
  margin: 0 0 8px 0;
  color: #666;
}

.notification-time {
  font-size: 0.8rem;
  color: #999;
}

.benefits-grid {
  margin-bottom: 30px;
}

.benefit-card {
  height: 100%;
}

.benefit-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
}

.benefit-emoji {
  font-size: 1.5rem;
}

.benefit-description {
  color: #666;
  margin-bottom: 20px;
}

.benefit-btn {
  width: 100%;
}

.referral-card {
  margin-top: 20px;
}

.referral-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  border-radius: 10px;
}

.referral-info h4 {
  margin: 0 0 8px 0;
  font-weight: bold;
}

.referral-info p {
  margin: 0;
  color: #666;
}

.amount-positive {
  color: #67c23a;
  font-weight: bold;
}

.amount-negative {
  color: #f56c6c;
  font-weight: bold;
}

.account-amount {
  font-weight: bold;
  color: #409eff;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .referral-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .quick-recharge {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>