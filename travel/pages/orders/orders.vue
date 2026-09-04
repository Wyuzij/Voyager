<template>
	<view class="page">
		<view class="header">
			<view class="nav">
				<text class="back" @click="goBack">←</text>
				<text class="title">我的订单</text>
				<text class="ghost"></text>
			</view>
			<view class="tabs">
				<view class="tab" :class="{ active: tab === item.key }" v-for="item in tabs" :key="item.key"
					@click="tab = item.key">
					<text>{{ item.label }}</text>
				</view>
			</view>
		</view>

		<view class="list" v-if="filtered.length">
			<view class="card" v-for="order in filtered" :key="order.id">
				<view class="card-top">
					<text class="order-no">{{ order.orderNo }}</text>
					<text class="status" :class="order.status">{{ statusText(order.status) }}</text>
				</view>
				<view class="card-body" @click="goSpot(order.spotId)">
					<image class="thumb" :src="order.image" mode="aspectFill"></image>
					<view class="meta">
						<text class="name">{{ order.itemTitle }}</text>
						<text class="sub">游玩日期 {{ order.visitDate || '待定' }} · {{ order.quantity }}人</text>
						<text class="sub">{{ order.location }}</text>
					</view>
				</view>
				<view class="card-foot">
					<text class="price">¥{{ order.totalPrice }}</text>
					<view class="actions">
						<view class="btn ghost-btn" v-if="order.status === 'pending'" @click="cancelOrder(order)">取消</view>
						<view class="btn primary" v-if="order.status === 'pending'" @click="payOrder(order)">去支付</view>
						<view class="btn ghost-btn" v-if="order.status === 'paid'" @click="useOrder(order)">核销使用</view>
					</view>
				</view>
			</view>
		</view>

		<view class="empty" v-else>
			<text class="empty-icon">◈</text>
			<text class="empty-title">暂无订单</text>
			<text class="empty-desc">去景点详情页即可预订</text>
			<view class="btn primary" @click="goHome">去看看</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getOrders, statusText, updateOrder } from '../../utils/user-store.js'

const tab = ref('all')
const orders = ref([])
const tabs = [
	{ key: 'all', label: '全部' },
	{ key: 'pending', label: '待支付' },
	{ key: 'paid', label: '已支付' },
	{ key: 'used', label: '已使用' }
]

const filtered = computed(() => {
	if (tab.value === 'all') return orders.value
	return orders.value.filter((item) => item.status === tab.value)
})

onShow(() => {
	orders.value = getOrders()
})

function goBack() {
	uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/mine/mine' }) })
}

function goHome() {
	uni.switchTab({ url: '/pages/index/index' })
}

function goSpot(id) {
	if (!id) return
	uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

function payOrder(order) {
	uni.showModal({
		title: '确认支付',
		content: `支付 ¥${order.totalPrice} 预订「${order.itemTitle}」？\n演示环境不会产生真实扣款。`,
		success: (res) => {
			if (!res.confirm) return
			updateOrder(order.id, { status: 'paid', payTime: Date.now() })
			orders.value = getOrders()
			uni.showToast({ title: '支付成功', icon: 'success' })
		}
	})
}

function cancelOrder(order) {
	uni.showModal({
		title: '取消订单',
		content: '确定取消这张待支付订单？',
		success: (res) => {
			if (!res.confirm) return
			updateOrder(order.id, { status: 'cancelled' })
			orders.value = getOrders()
			uni.showToast({ title: '已取消', icon: 'none' })
		}
	})
}

function useOrder(order) {
	uni.showModal({
		title: '核销门票',
		content: '到达景区后出示此订单即可入园。确认核销？',
		success: (res) => {
			if (!res.confirm) return
			updateOrder(order.id, { status: 'used' })
			orders.value = getOrders()
			uni.showToast({ title: '已核销', icon: 'success' })
		}
	})
}
</script>

<style>
.page { min-height: 100vh; background: #FDF8F3; padding-bottom: 60rpx; }
.header { padding: 88rpx 32rpx 12rpx; background: linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 100%); }
.nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24rpx; }
.back, .ghost { width: 64rpx; font-size: 36rpx; color: #2D1810; }
.title { font-size: 36rpx; font-weight: 700; color: #2D1810; }
.tabs { display: flex; gap: 12rpx; }
.tab { padding: 12rpx 24rpx; border-radius: 28rpx; background: #fff; color: #8B7355; font-size: 24rpx; }
.tab.active { background: #C75B39; color: #fff; }
.list { padding: 24rpx 32rpx; }
.card { background: #fff; border-radius: 24rpx; padding: 24rpx; margin-bottom: 20rpx; box-shadow: 0 4rpx 20rpx rgba(45,24,16,0.06); }
.card-top { display: flex; justify-content: space-between; margin-bottom: 16rpx; }
.order-no { font-size: 22rpx; color: #8B7355; }
.status { font-size: 22rpx; color: #C75B39; }
.status.paid { color: #2E7D32; }
.status.used { color: #8B7355; }
.status.cancelled { color: #B8A590; }
.card-body { display: flex; gap: 20rpx; }
.thumb { width: 160rpx; height: 120rpx; border-radius: 16rpx; background: #F5E6D3; }
.meta { flex: 1; display: flex; flex-direction: column; gap: 8rpx; }
.name { font-size: 30rpx; font-weight: 600; color: #2D1810; }
.sub { font-size: 24rpx; color: #8B7355; }
.card-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 20rpx; padding-top: 16rpx; border-top: 1rpx dashed #E8D5B5; }
.price { font-size: 36rpx; font-weight: 700; color: #C75B39; }
.actions { display: flex; gap: 12rpx; }
.btn { padding: 12rpx 24rpx; border-radius: 28rpx; font-size: 24rpx; }
.primary { background: linear-gradient(135deg, #C75B39, #E8A090); color: #fff; }
.ghost-btn { background: #F5E6D3; color: #5D4E3C; }
.empty { display: flex; flex-direction: column; align-items: center; padding: 120rpx 40rpx; }
.empty-icon { font-size: 72rpx; color: #C75B39; margin-bottom: 20rpx; }
.empty-title { font-size: 32rpx; font-weight: 600; color: #2D1810; }
.empty-desc { font-size: 26rpx; color: #8B7355; margin: 12rpx 0 32rpx; }
</style>
