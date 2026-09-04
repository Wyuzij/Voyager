<template>
	<view class="page">
		<app-navbar title="确认预订"></app-navbar>

		<view class="spot" v-if="spot">
			<image class="cover" :src="spot.images[0]" mode="aspectFill"></image>
			<view class="spot-info">
				<text class="name">{{ spot.title }}</text>
				<text class="addr">{{ spot.location.address }}</text>
				<text class="price">¥{{ spot.price }} / 人</text>
			</view>
		</view>

		<view class="card">
			<view class="field">
				<text class="label">游玩日期</text>
				<picker mode="date" :value="form.visitDate" :start="today" @change="onDate">
					<view class="picker-value">
						<text class="value">{{ form.visitDate || '选择日期' }}</text>
						<u-icon name="arrow-right" color="#B8A590" size="14"></u-icon>
					</view>
				</picker>
			</view>
			<view class="field">
				<text class="label">人数</text>
				<u-number-box
					v-model="form.quantity"
					:min="1"
					:max="9"
					integer
					color="#C75B39"
					bgColor="#F5E6D3"
					:buttonSize="28"
					@change="onQtyChange"
				></u-number-box>
			</view>
			<view class="field">
				<text class="label">联系人</text>
				<input class="input" v-model="form.contactName" placeholder="请输入姓名" />
			</view>
			<view class="field">
				<text class="label">手机号</text>
				<input class="input" v-model="form.contactPhone" type="number" maxlength="11" placeholder="用于接收入园提醒" />
			</view>
		</view>

		<view class="card">
			<view class="field" @click="pickCoupon">
				<text class="label">优惠券</text>
				<view class="picker-value">
					<text class="value">{{ selectedCoupon ? selectedCoupon.title : (coupons.length ? '选择优惠券' : '暂无可用') }}</text>
					<u-icon name="arrow-right" color="#B8A590" size="14"></u-icon>
				</view>
			</view>
			<view class="bill">
				<text>票价小计</text>
				<text>¥{{ subtotal }}</text>
			</view>
			<view class="bill" v-if="discount">
				<text>优惠</text>
				<text class="minus">-¥{{ discount }}</text>
			</view>
			<view class="bill total">
				<text>应付</text>
				<text>¥{{ payAmount }}</text>
			</view>
		</view>

		<view class="submit-wrap">
			<u-button
				type="primary"
				shape="circle"
				:text="'提交订单 · ¥' + payAmount"
				:customStyle="{ height: '48px', fontSize: '16px' }"
				@click="submit"
			></u-button>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSpotById } from '../../utils/catalog.js'
import { calcCouponDiscount, createOrder, getAvailableCoupons, requireLogin, seedCoupons, useCoupon } from '../../utils/user-store.js'

const spot = ref(null)
const today = ref('')
const coupons = ref([])
const selectedCoupon = ref(null)
const form = ref({
	visitDate: '',
	quantity: 1,
	contactName: '',
	contactPhone: ''
})

const subtotal = computed(() => (spot.value?.price || 0) * form.value.quantity)
const discount = computed(() => calcCouponDiscount(selectedCoupon.value, subtotal.value))
const payAmount = computed(() => Math.max(0, subtotal.value - discount.value))

onLoad((options) => {
	const d = new Date()
	today.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
	form.value.visitDate = today.value

	const user = uni.getStorageSync('userInfo') || {}
	form.value.contactName = user.nickname || ''
	form.value.contactPhone = String(user.phone || '').replace(/\*/g, '') || ''

	spot.value = getSpotById(options.id)
	if (!spot.value) {
		uni.showToast({ title: '景点不存在', icon: 'none' })
		return
	}
	seedCoupons()
	refreshCoupons()
})

function refreshCoupons() {
	coupons.value = getAvailableCoupons(subtotal.value)
	if (selectedCoupon.value && !coupons.value.find((c) => c.id === selectedCoupon.value.id)) {
		selectedCoupon.value = null
	}
}

function onDate(e) {
	form.value.visitDate = e.detail.value
}

function onQtyChange() {
	refreshCoupons()
}

function pickCoupon() {
	refreshCoupons()
	if (!coupons.value.length) {
		uni.showToast({ title: '暂无可用优惠券', icon: 'none' })
		return
	}
	const items = ['不使用优惠券', ...coupons.value.map((c) => c.title)]
	uni.showActionSheet({
		itemList: items,
		success: (res) => {
			if (res.tapIndex === 0) selectedCoupon.value = null
			else selectedCoupon.value = coupons.value[res.tapIndex - 1]
		}
	})
}

function submit() {
	if (!requireLogin()) return
	if (!spot.value) return
	if (!form.value.visitDate) {
		uni.showToast({ title: '请选择游玩日期', icon: 'none' })
		return
	}
	if (!form.value.contactName.trim()) {
		uni.showToast({ title: '请填写联系人', icon: 'none' })
		return
	}
	if (!/^1[3-9]\d{9}$/.test(form.value.contactPhone)) {
		uni.showToast({ title: '请填写正确手机号', icon: 'none' })
		return
	}

	const order = createOrder({
		spotId: spot.value.id,
		itemTitle: spot.value.title,
		image: spot.value.images[0],
		location: spot.value.location.address,
		quantity: form.value.quantity,
		unitPrice: spot.value.price,
		couponId: selectedCoupon.value?.id || '',
		couponTitle: selectedCoupon.value?.title || '',
		discount: discount.value,
		totalPrice: payAmount.value,
		visitDate: form.value.visitDate,
		contactName: form.value.contactName.trim(),
		contactPhone: form.value.contactPhone
	})
	if (selectedCoupon.value) useCoupon(selectedCoupon.value.id)

	uni.showToast({ title: '订单已创建', icon: 'success' })
	setTimeout(() => {
		uni.redirectTo({ url: '/pages/orders/orders' })
	}, 800)
	return order
}
</script>

<style>
.page { min-height: 100vh; background: #FDF8F3; padding-bottom: 180rpx; }
.spot { margin: 12rpx 32rpx 20rpx; background: #fff; border-radius: 20rpx; overflow: hidden; }
.cover { width: 100%; height: 280rpx; }
.spot-info { padding: 20rpx 24rpx 24rpx; display: flex; flex-direction: column; gap: 8rpx; }
.name { font-size: 32rpx; font-weight: 700; color: #2D1810; }
.addr { font-size: 24rpx; color: #8B7355; }
.price { font-size: 28rpx; color: #C75B39; font-weight: 600; }
.card { margin: 0 32rpx 20rpx; background: #fff; border-radius: 20rpx; padding: 8rpx 24rpx; }
.field { display: flex; align-items: center; justify-content: space-between; min-height: 96rpx; border-bottom: 1rpx solid #F0E6D8; }
.field:last-child { border-bottom: none; }
.label { font-size: 28rpx; color: #5D4E3C; }
.picker-value { display: flex; align-items: center; gap: 8rpx; }
.value, .input { font-size: 28rpx; color: #2D1810; text-align: right; }
.input { width: 360rpx; }
.bill { display: flex; justify-content: space-between; padding: 16rpx 0; font-size: 26rpx; color: #8B7355; }
.minus { color: #2E7D32; }
.total { font-size: 30rpx; color: #2D1810; font-weight: 700; }
.submit-wrap { position: fixed; left: 32rpx; right: 32rpx; bottom: 40rpx; z-index: 20; }
</style>
