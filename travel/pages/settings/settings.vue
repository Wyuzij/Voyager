<template>
	<view class="page">
		<view class="header">
			<view class="nav">
				<text class="back" @click="goBack">←</text>
				<text class="title">设置</text>
				<text class="ghost"></text>
			</view>
		</view>

		<view class="group">
			<view class="row">
				<text class="label">消息通知</text>
				<switch :checked="settings.notify" color="#C75B39" @change="toggleNotify" />
			</view>
			<view class="row">
				<text class="label">定位服务</text>
				<switch :checked="settings.locationEnabled" color="#C75B39" @change="toggleLocation" />
			</view>
		</view>

		<view class="group">
			<view class="row" @click="showAgreement">
				<text class="label">用户协议</text>
				<text class="arrow">›</text>
			</view>
			<view class="row" @click="showPrivacy">
				<text class="label">隐私说明</text>
				<text class="arrow">›</text>
			</view>
			<view class="row" @click="showAbout">
				<text class="label">关于行迹</text>
				<text class="value">v1.0.0</text>
			</view>
		</view>

		<view class="group">
			<view class="row" @click="clearCache">
				<text class="label">清除缓存</text>
				<text class="arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { clearLocalCache, getSettings, saveSettings } from '../../utils/user-store.js'

const settings = ref({ notify: true, locationEnabled: true })

onShow(() => {
	settings.value = getSettings()
})

function goBack() {
	uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/mine/mine' }) })
}

function toggleNotify(e) {
	settings.value = saveSettings({ notify: !!e.detail.value })
}

function toggleLocation(e) {
	settings.value = saveSettings({ locationEnabled: !!e.detail.value })
}

function showAgreement() {
	uni.showModal({
		title: '用户协议',
		content: '使用行迹即表示你同意：本地保存登录态、收藏、订单与浏览记录，仅用于演示预订与行程规划，不上传真实支付信息。',
		showCancel: false
	})
}

function showPrivacy() {
	uni.showModal({
		title: '隐私说明',
		content: '定位仅用于展示附近城市与天气；头像与昵称只存在本机。演示订单不会产生真实扣款。',
		showCancel: false
	})
}

function showAbout() {
	uni.showModal({
		title: '关于行迹',
		content: 'Voyager / 行迹 v1.0.0\n探索世界，发现美好\nAI 行程规划 + 景点导览',
		showCancel: false
	})
}

function clearCache() {
	uni.showModal({
		title: '清除缓存',
		content: '将清空浏览历史、收藏和行程篮，登录状态会保留。',
		success: (res) => {
			if (!res.confirm) return
			clearLocalCache({ keepLogin: true })
			uni.showToast({ title: '已清除', icon: 'success' })
		}
	})
}
</script>

<style>
.page { min-height: 100vh; background: #FDF8F3; }
.header { padding: 88rpx 32rpx 24rpx; background: linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 100%); }
.nav { display: flex; align-items: center; justify-content: space-between; }
.back, .ghost { width: 64rpx; font-size: 36rpx; color: #2D1810; }
.title { font-size: 36rpx; font-weight: 700; color: #2D1810; }
.group { margin: 24rpx 32rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.row { display: flex; align-items: center; justify-content: space-between; padding: 28rpx 24rpx; border-bottom: 1rpx solid #F0E6D8; }
.row:last-child { border-bottom: none; }
.label { font-size: 28rpx; color: #2D1810; }
.value, .arrow { font-size: 26rpx; color: #8B7355; }
</style>
