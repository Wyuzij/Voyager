<template>
    <view class="content">
        <view class="glass-header">
            <view class="header-bg"></view>
            <view class="header-content">
                <view class="user-section" @click="goToLogin" v-if="!isLoginStatus">
                    <view class="avatar-placeholder">
                        <text class="avatar-icon">◉</text>
                    </view>
                    <view class="login-hint">
                        <text class="hint-title">点击登录</text>
                        <text class="hint-desc">解锁更多精彩功能</text>
                    </view>
                </view>
                <view class="user-section" v-else>
                    <image class="avatar" :src="userInfo.avatar || '/static/logo.png'" mode="aspectFill"></image>
                    <view class="user-info">
                        <text class="nickname">{{ userInfo.nickname || '游客' }}</text>
                        <text class="user-desc">探索世界，发现美好</text>
                    </view>
                </view>
                <view class="stats-grid">
                    <view class="stat-item" @click="goToFavorites">
                        <text class="stat-value">{{ favoriteCount }}</text>
                        <text class="stat-label">收藏</text>
                    </view>
                    <view class="stat-divider"></view>
                    <view class="stat-item" @click="goToHistory">
                        <text class="stat-value">{{ historyCount }}</text>
                        <text class="stat-label">浏览</text>
                    </view>
                    <view class="stat-divider"></view>
                    <view class="stat-item" @click="goToOrders">
                        <text class="stat-value">{{ orderCount }}</text>
                        <text class="stat-label">订单</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="menu-section">
            <text class="section-title">我的服务</text>
            <view class="menu-list">
                <view class="menu-item" @click="goToOrders">
                    <view class="menu-left">
                        <view class="icon-box gradient-blue">
                            <text class="menu-icon">◈</text>
                        </view>
                        <text class="menu-text">我的订单</text>
                    </view>
                    <view class="menu-right">
                        <text class="menu-arrow">›</text>
                    </view>
                </view>
                <view class="menu-item" @click="goToCoupons">
                    <view class="menu-left">
                        <view class="icon-box gradient-orange">
                            <text class="menu-icon">◇</text>
                        </view>
                        <text class="menu-text">优惠券</text>
                    </view>
                    <view class="menu-right">
                        <text class="menu-arrow">›</text>
                    </view>
                </view>
                <view class="menu-item" @click="goToHistory">
                    <view class="menu-left">
                        <view class="icon-box gradient-purple">
                            <text class="menu-icon">◷</text>
                        </view>
                        <text class="menu-text">浏览历史</text>
                    </view>
                    <view class="menu-right">
                        <text class="menu-arrow">›</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="menu-section">
            <text class="section-title">其他</text>
            <view class="menu-list">
                <view class="menu-item" @click="goToSettings">
                    <view class="menu-left">
                        <view class="icon-box gradient-cyan">
                            <text class="menu-icon">⚙</text>
                        </view>
                        <text class="menu-text">设置</text>
                    </view>
                    <view class="menu-right">
                        <text class="menu-arrow">›</text>
                    </view>
                </view>
                <view class="menu-item" @click="goToAbout">
                    <view class="menu-left">
                        <view class="icon-box gradient-pink">
                            <text class="menu-icon">◉</text>
                        </view>
                        <text class="menu-text">关于我们</text>
                    </view>
                    <view class="menu-right">
                        <text class="menu-arrow">›</text>
                    </view>
                </view>
                <view class="menu-item logout-item" @click="handleLogout" v-if="isLoginStatus">
                    <view class="menu-left">
                        <view class="icon-box gradient-red">
                            <text class="menu-icon">✕</text>
                        </view>
                        <text class="menu-text logout-text">退出登录</text>
                    </view>
                    <view class="menu-right">
                        <text class="menu-arrow">›</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { clearUserInfo } from '../../utils/auth.js'
import { getStats, requireLogin } from '../../utils/user-store.js'

const userInfo = ref({
    nickname: '',
    avatar: ''
})
const favoriteCount = ref(0)
const historyCount = ref(0)
const orderCount = ref(0)
const isLoginStatus = ref(false)

onShow(() => {
    loadUserInfo()
    loadStats()
})

function loadUserInfo() {
    const user = uni.getStorageSync('userInfo')
    if (user && uni.getStorageSync('token')) {
        userInfo.value = user
        isLoginStatus.value = true
    } else {
        userInfo.value = { nickname: '', avatar: '' }
        isLoginStatus.value = false
    }
}

function loadStats() {
    const stats = getStats()
    favoriteCount.value = stats.favoriteCount
    historyCount.value = stats.historyCount
    orderCount.value = stats.orderCount
}

function goToFavorites() {
    uni.switchTab({ url: '/pages/favorite/favorite' })
}

function goToOrders() {
    if (!requireLogin()) return
    uni.navigateTo({ url: '/pages/orders/orders' })
}

function goToCoupons() {
    if (!requireLogin()) return
    uni.navigateTo({ url: '/pages/coupons/coupons' })
}

function goToHistory() {
    uni.navigateTo({ url: '/pages/history/history' })
}

function goToSettings() {
    uni.navigateTo({ url: '/pages/settings/settings' })
}

function goToAbout() {
    uni.showModal({
        title: '关于我们',
        content: 'Voyager v1.0.0\n探索世界，发现美好',
        showCancel: false
    })
}

function goToLogin() {
    uni.navigateTo({ url: '/pages/login/login' })
}

function handleLogout() {
    uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
            if (res.confirm) {
                clearUserInfo()
                userInfo.value = { nickname: '', avatar: '' }
                isLoginStatus.value = false
                uni.showToast({ title: '已退出登录', icon: 'success' })
            }
        }
    })
}
</script>

<style>
.content {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #f2f2f7;
    padding-bottom: 40rpx;
}

.glass-header {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 100rpx 40rpx 40rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
}

.header-bg {
    display: none;
}

.header-content {
    position: relative;
    z-index: 10;
}

.user-section {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
}

.avatar-placeholder {
    width: 120rpx;
    height: 120rpx;
    background: linear-gradient(135deg, #007AFF 0%, #0A84FF 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 28rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
}

.avatar-icon {
    font-size: 52rpx;
    color: #fff;
}

.avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: 28rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.login-hint,
.user-info {
    display: flex;
    flex-direction: column;
}

.hint-title,
.nickname {
    font-size: 40rpx;
    font-weight: 700;
    color: #1c1c1e;
    margin-bottom: 8rpx;
    letter-spacing: -0.5rpx;
}

.hint-desc,
.user-desc {
    font-size: 26rpx;
    color: #8e8e93;
}

.stats-grid {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 20rpx;
    padding: 32rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-item:active {
    transform: scale(0.95);
}

.stat-value {
    font-size: 44rpx;
    font-weight: 700;
    color: #1c1c1e;
    margin-bottom: 8rpx;
}

.stat-label {
    font-size: 24rpx;
    color: #8e8e93;
}

.stat-divider {
    width: 1rpx;
    height: 64rpx;
    background: #e5e5ea;
}

.menu-section {
    margin-top: 32rpx;
    padding: 0 32rpx;
}

.section-title {
    font-size: 28rpx;
    color: #8e8e93;
    padding: 0 0 20rpx;
    font-weight: 500;
    display: block;
}

.menu-list {
    background: #ffffff;
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 28rpx;
    border-bottom: 1rpx solid #e5e5ea;
    transition: background 0.2s ease;
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-item:active {
    background: #f2f2f7;
}

.menu-left {
    display: flex;
    align-items: center;
}

.icon-box {
    width: 72rpx;
    height: 72rpx;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
}

.gradient-blue {
    background: linear-gradient(135deg, #007AFF 0%, #0A84FF 100%);
}

.gradient-orange {
    background: linear-gradient(135deg, #FF9500 0%, #FF5E3A 100%);
}

.gradient-purple {
    background: linear-gradient(135deg, #AF52DE 0%, #BF5AF2 100%);
}

.gradient-cyan {
    background: linear-gradient(135deg, #5AC8FA 0%, #64D2FF 100%);
}

.gradient-pink {
    background: linear-gradient(135deg, #FF2D55 0%, #FF375F 100%);
}

.gradient-red {
    background: linear-gradient(135deg, #FF3B30 0%, #FF453A 100%);
}

.menu-icon {
    font-size: 32rpx;
    color: #fff;
}

.menu-text {
    font-size: 30rpx;
    color: #1c1c1e;
    font-weight: 500;
}

.logout-text {
    color: #FF3B30;
}

.menu-right {
    display: flex;
    align-items: center;
}

.menu-arrow {
    font-size: 40rpx;
    color: #c7c7cc;
    font-weight: 300;
}

.logout-item {
    border-bottom: none;
}
</style>
