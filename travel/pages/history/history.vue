<template>
	<view class="page">
		<app-navbar title="浏览历史">
			<template #right>
				<text class="clear" v-if="list.length" @click="clearAll">清空</text>
			</template>
		</app-navbar>
		<view class="header">
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
				<view class="remove" @click.stop="removeItem(item)">
					<u-icon name="close" color="#B8A590" size="16"></u-icon>
				</view>
			</view>
		</view>

		<view class="empty" v-else>
			<u-empty mode="history" text="还没有浏览记录" icon-color="#C75B39">
				<u-button type="primary" shape="circle" size="small" text="去发现" @click="goHome"></u-button>
			</u-empty>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import AppNavbar from '../../components/app-navbar/app-navbar.vue'
import { onShow } from '@dcloudio/uni-app'
import { clearHistory, formatTime, getHistory, removeHistory } from '../../utils/user-store.js'

const list = ref([])

onShow(() => {
	list.value = getHistory()
})

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
.header { padding: 8rpx 32rpx 16rpx; }
.clear { font-size: 26rpx; color: #C75B39; padding-right: 8rpx; }
.subtitle { display: block; font-size: 24rpx; color: #8B7355; }
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
