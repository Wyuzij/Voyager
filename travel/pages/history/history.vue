<template>
	<view class="page">
		<view class="header">
			<view class="nav">
				<text class="back" @click="goBack">←</text>
				<text class="title">浏览历史</text>
				<text class="clear" v-if="list.length" @click="clearAll">清空</text>
				<text class="ghost" v-else></text>
			</view>
			<text class="subtitle">最近看过的 {{ list.length }} 个目的地</text>
		</view>

		<view class="list" v-if="list.length">
			<view class="row" v-for="item in list" :key="item.id" @click="goDetail(item)">
				<image class="thumb" :src="item.image" mode="aspectFill"></image>
				<view class="body">
					<text class="name">{{ item.title }}</text>
					<text class="loc">{{ item.location }}</text>
					<text class="time">{{ formatTime(item.viewedAt) }}</text>
				</view>
				<text class="remove" @click.stop="removeItem(item)">✕</text>
			</view>
		</view>

		<view class="empty" v-else>
			<text class="empty-icon">◷</text>
			<text class="empty-title">还没有浏览记录</text>
			<view class="btn" @click="goHome">去发现</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { clearHistory, formatTime, getHistory, removeHistory } from '../../utils/user-store.js'

const list = ref([])

onShow(() => {
	list.value = getHistory()
})

function goBack() {
	uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/mine/mine' }) })
}

function goHome() {
	uni.switchTab({ url: '/pages/index/index' })
}

function goDetail(item) {
	uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}

function removeItem(item) {
	removeHistory(item.id)
	list.value = getHistory()
}

function clearAll() {
	uni.showModal({
		title: '清空浏览历史',
		content: '确定清空全部浏览记录？',
		success: (res) => {
			if (!res.confirm) return
			clearHistory()
			list.value = []
		}
	})
}
</script>

<style>
.page { min-height: 100vh; background: #FDF8F3; }
.header { padding: 88rpx 32rpx 24rpx; background: linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 100%); }
.nav { display: flex; align-items: center; justify-content: space-between; }
.back, .ghost { width: 80rpx; font-size: 36rpx; color: #2D1810; }
.clear { font-size: 26rpx; color: #C75B39; }
.title { font-size: 36rpx; font-weight: 700; color: #2D1810; }
.subtitle { display: block; margin-top: 12rpx; font-size: 24rpx; color: #8B7355; }
.list { padding: 8rpx 32rpx 40rpx; }
.row { display: flex; align-items: center; gap: 20rpx; background: #fff; border-radius: 20rpx; padding: 20rpx; margin-bottom: 16rpx; }
.thumb { width: 140rpx; height: 108rpx; border-radius: 14rpx; background: #F5E6D3; }
.body { flex: 1; display: flex; flex-direction: column; gap: 6rpx; }
.name { font-size: 30rpx; font-weight: 600; color: #2D1810; }
.loc, .time { font-size: 22rpx; color: #8B7355; }
.remove { width: 48rpx; text-align: center; color: #B8A590; }
.empty { display: flex; flex-direction: column; align-items: center; padding: 140rpx 40rpx; }
.empty-icon { font-size: 72rpx; color: #C75B39; }
.empty-title { margin: 20rpx 0 32rpx; color: #8B7355; }
.btn { background: #C75B39; color: #fff; padding: 16rpx 48rpx; border-radius: 32rpx; }
</style>
