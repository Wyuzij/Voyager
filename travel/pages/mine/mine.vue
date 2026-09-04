<template>
	<view class="content">
		<view class="glass-header">
			<view class="header-content">
				<view class="user-section" @click="goToLogin" v-if="!isLoginStatus">
					<u-avatar size="56" bgColor="#C75B39" icon="account-fill"></u-avatar>
					<view class="login-hint">
						<text class="hint-title">点击登录</text>
						<text class="hint-desc">解锁行程规划与预订</text>
					</view>
					<u-icon name="arrow-right" color="#B8A590" size="16"></u-icon>
				</view>
				<view class="user-section" v-else>
					<u-avatar :src="userInfo.avatar || '/static/logo.png'" size="56"></u-avatar>
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
			<view class="menu-card">
				<u-cell-group :border="false">
					<u-cell title="我的订单" isLink @click="goToOrders">
						<template #icon>
							<view class="icon-box terracotta"><u-icon name="order" color="#fff" size="18"></u-icon></view>
						</template>
					</u-cell>
					<u-cell title="优惠券" isLink @click="goToCoupons">
						<template #icon>
							<view class="icon-box sand"><u-icon name="coupon" color="#fff" size="18"></u-icon></view>
						</template>
					</u-cell>
					<u-cell title="浏览历史" isLink :border="false" @click="goToHistory">
						<template #icon>
							<view class="icon-box moss"><u-icon name="clock" color="#fff" size="18"></u-icon></view>
						</template>
					</u-cell>
				</u-cell-group>
			</view>
		</view>

		<view class="menu-section">
			<text class="section-title">其他</text>
			<view class="menu-card">
				<u-cell-group :border="false">
					<u-cell title="设置" isLink @click="goToSettings">
						<template #icon>
							<view class="icon-box clay"><u-icon name="setting" color="#fff" size="18"></u-icon></view>
						</template>
					</u-cell>
					<u-cell title="关于我们" isLink :border="false" @click="goToAbout">
						<template #icon>
							<view class="icon-box ink"><u-icon name="info-circle" color="#fff" size="18"></u-icon></view>
						</template>
					</u-cell>
					<u-cell v-if="isLoginStatus" title="退出登录" :border="false" @click="handleLogout">
						<template #icon>
							<view class="icon-box rust"><u-icon name="close-circle" color="#fff" size="18"></u-icon></view>
						</template>
					</u-cell>
				</u-cell-group>
			</view>
		</view>
		<custom-tabbar current="mine"></custom-tabbar>
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { clearUserInfo } from '../../utils/auth.js'
import { getStats, requireLogin } from '../../utils/user-store.js'

const userInfo = ref({ nickname: '', avatar: '' })
const favoriteCount = ref(0)
const historyCount = ref(0)
const orderCount = ref(0)
const isLoginStatus = ref(false)

onShow(() => {
	uni.hideTabBar({ fail() {} })
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
	min-height: 100vh;
	background: #FDF8F3;
	padding-bottom: 24rpx;
}

.glass-header {
	padding: 96rpx 40rpx 36rpx;
	background: linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 100%);
}

.user-section {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 32rpx;
}

.login-hint,
.user-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.hint-title,
.nickname {
	font-size: 40rpx;
	font-weight: 700;
	color: #2D1810;
}

.hint-desc,
.user-desc {
	font-size: 26rpx;
	color: #8B7355;
}

.stats-grid {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 24rpx;
	padding: 28rpx 16rpx;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-value {
	font-size: 40rpx;
	font-weight: 700;
	color: #C75B39;
	margin-bottom: 6rpx;
}

.stat-label {
	font-size: 22rpx;
	color: #8B7355;
}

.stat-divider {
	width: 1rpx;
	height: 56rpx;
	background: #F0E6D8;
}

.menu-section {
	margin: 8rpx 32rpx 24rpx;
}

.menu-card {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
}

.section-title {
	display: block;
	font-size: 24rpx;
	color: #8B7355;
	padding: 8rpx 8rpx 16rpx;
}

.icon-box {
	width: 56rpx;
	height: 56rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 16rpx;
}

.terracotta { background: #C75B39; }
.sand { background: #D08A3A; }
.moss { background: #6B8F71; }
.clay { background: #8B7355; }
.ink { background: #5D4E3C; }
.rust { background: #B23A2F; }
</style>
