<template>
	<view class="page">
		<app-navbar title="设置"></app-navbar>

		<view class="group">
			<u-cell-group :border="false">
				<u-cell title="消息通知">
					<template #right-icon>
						<u-switch v-model="settings.notify" activeColor="#C75B39" @change="toggleNotify"></u-switch>
					</template>
				</u-cell>
				<u-cell title="定位服务" :border="false">
					<template #right-icon>
						<u-switch v-model="settings.locationEnabled" activeColor="#C75B39" @change="toggleLocation"></u-switch>
					</template>
				</u-cell>
			</u-cell-group>
		</view>

		<view class="group">
			<u-cell-group :border="false">
				<u-cell title="用户协议" isLink @click="showAgreement"></u-cell>
				<u-cell title="隐私说明" isLink @click="showPrivacy"></u-cell>
				<u-cell title="关于行迹" :border="false" value="v1.0.0" @click="showAbout"></u-cell>
			</u-cell-group>
		</view>

		<view class="group">
			<u-cell-group :border="false">
				<u-cell title="清除缓存" isLink :border="false" @click="clearCache"></u-cell>
			</u-cell-group>
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

function toggleNotify(val) {
	settings.value = saveSettings({ notify: !!val })
}

function toggleLocation(val) {
	settings.value = saveSettings({ locationEnabled: !!val })
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
.page {
	min-height: 100vh;
	background: #FDF8F3;
}

.group {
	margin: 24rpx 32rpx;
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
}
</style>
