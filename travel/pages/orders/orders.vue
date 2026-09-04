<template>
	<view class="page">
		<app-navbar title="我的订单"></app-navbar>
		<view class="header">
			<u-tabs :list="tabs" :current="tabIndex" :scrollable="false" lineColor="#C75B39" :activeStyle="{ color: '#C75B39', fontWeight: '600' }" :inactiveStyle="{ color: '#8B7355' }" @change="onTabChange"></u-tabs>
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
			<u-empty mode="order" text="暂无订单" icon-color="#C75B39">
				<u-button type="primary" shape="circle" size="small" text="去看看" @click="goHome"></u-button>
			</u-empty>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppNavbar from '../../components/app-navbar/app-navbar.vue'
import { onShow } from '@dcloudio/uni-app'
import { getOrders, statusText, updateOrder } from '../../utils/user-store.js'

const tab = ref('all')
const orders = ref([])
const tabs = [
	{ key: 'all', name: '全部' },
	{ key: 'pending', name: '待支付' },
	{ key: 'paid', name: '已支付' },
	{ key: 'used', name: '已使用' }
]
const tabIndex = computed(() => Math.max(0, tabs.findIndex((item) => item.key === tab.value)))

function onTabChange(e) {
	const next = tabs[e.index]
	if (next) tab.value = next.key
}

const filtered = computed(() => {
	if (tab.value === 'all') return orders.value
	return orders.value.filter((item) => item.status === tab.value)
})

onShow(() => {
	orders.value = getOrders()
})

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
.header { padding: 8rpx 8rpx 12rpx; background: #FDF8F3; }
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
