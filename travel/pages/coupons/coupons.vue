<template>
	<view class="page">
		<view class="header">
			<view class="nav">
				<text class="back" @click="goBack">←</text>
				<text class="title">优惠券</text>
				<text class="ghost"></text>
			</view>
			<view class="tabs">
				<view class="tab" :class="{ active: onlyUnused === true }" @click="onlyUnused = true"><text>可使用</text></view>
				<view class="tab" :class="{ active: onlyUnused === false }" @click="onlyUnused = false"><text>全部</text></view>
			</view>
		</view>

		<view class="list">
			<view class="ticket" :class="{ used: coupon.used || expired(coupon) }" v-for="coupon in visible" :key="coupon.id">
				<view class="left">
					<text class="amount" v-if="coupon.type === 'amount'">¥{{ coupon.amount }}</text>
					<text class="amount" v-else>{{ Math.round(coupon.percent * 10) }}折</text>
					<text class="rule">满{{ coupon.threshold || 0 }}可用</text>
				</view>
				<view class="right">
					<text class="name">{{ coupon.title }}</text>
					<text class="desc">{{ coupon.desc }}</text>
					<text class="expire">有效期至 {{ expireText(coupon.expireAt) }}</text>
					<text class="badge" v-if="coupon.used">已使用</text>
					<text class="badge" v-else-if="expired(coupon)">已过期</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getCoupons, seedCoupons } from '../../utils/user-store.js'

const coupons = ref([])
const onlyUnused = ref(true)

const visible = computed(() => {
	if (!onlyUnused.value) return coupons.value
	return coupons.value.filter((item) => !item.used && !expired(item))
})

onShow(() => {
	seedCoupons()
	coupons.value = getCoupons()
})

function expired(coupon) {
	return coupon.expireAt < Date.now()
}

function expireText(ts) {
	const date = new Date(ts)
	return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

function goBack() {
	uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/mine/mine' }) })
}
</script>

<style>
.page { min-height: 100vh; background: #FDF8F3; }
.header { padding: 88rpx 32rpx 12rpx; background: linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 100%); }
.nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24rpx; }
.back, .ghost { width: 64rpx; font-size: 36rpx; color: #2D1810; }
.title { font-size: 36rpx; font-weight: 700; color: #2D1810; }
.tabs { display: flex; gap: 12rpx; }
.tab { padding: 12rpx 24rpx; border-radius: 28rpx; background: #fff; color: #8B7355; font-size: 24rpx; }
.tab.active { background: #C75B39; color: #fff; }
.list { padding: 24rpx 32rpx; }
.ticket { display: flex; background: #fff; border-radius: 20rpx; overflow: hidden; margin-bottom: 20rpx; box-shadow: 0 4rpx 16rpx rgba(45,24,16,0.06); }
.ticket.used { opacity: 0.5; }
.left { width: 180rpx; background: linear-gradient(180deg, #C75B39, #E8A090); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24rpx 8rpx; }
.amount { font-size: 44rpx; font-weight: 700; }
.rule { font-size: 20rpx; opacity: 0.85; margin-top: 8rpx; }
.right { flex: 1; padding: 24rpx; display: flex; flex-direction: column; gap: 8rpx; }
.name { font-size: 30rpx; font-weight: 600; color: #2D1810; }
.desc, .expire { font-size: 22rpx; color: #8B7355; }
.badge { font-size: 22rpx; color: #C75B39; }
</style>
