/**
 * 本地用户数据：浏览历史、订单、优惠券、设置、收藏规范化。
 * 小程序未接真实交易后台，这些能力全部落在本地存储。
 */

import { getSpotById, formatLocation } from './catalog.js'
import { isLogin } from './auth.js'

const KEYS = {
	history: 'browse_history',
	orders: 'user_orders',
	coupons: 'user_coupons',
	settings: 'user_settings',
	favorites: 'favorites',
	seeded: 'user_store_seeded'
}

function read(key, fallback) {
	try {
		const raw = uni.getStorageSync(key)
		if (raw === '' || raw === undefined || raw === null) return fallback
		if (typeof raw === 'string') {
			try {
				return JSON.parse(raw)
			} catch {
				return raw
			}
		}
		return raw
	} catch {
		return fallback
	}
}

function write(key, value) {
	uni.setStorageSync(key, value)
}

export function normalizeSpot(item = {}) {
	const catalog = item.id ? getSpotById(item.id) : null
	const image = item.image || item.img || catalog?.images?.[0] || ''
	const locationText = typeof item.location === 'string'
		? item.location
		: (item.location?.address || formatLocation(catalog) || '')

	return {
		id: item.id || catalog?.id,
		title: item.title || item.name || catalog?.title || '未命名景点',
		image,
		img: image,
		location: locationText,
		price: item.price ?? catalog?.price ?? 0,
		originalPrice: item.originalPrice ?? catalog?.originalPrice ?? null,
		rating: item.rating || catalog?.rating || '4.8',
		sold: item.sold ?? catalog?.sold ?? 0,
		tag: item.tag || item.tags?.[0] || catalog?.tags?.[0] || '',
		distance: item.distance || catalog?.distance || '',
		latitude: item.latitude || item.location?.latitude || catalog?.location?.latitude,
		longitude: item.longitude || item.location?.longitude || catalog?.location?.longitude
	}
}

export function requireLogin() {
	if (isLogin()) return true
	uni.navigateTo({ url: '/pages/login/login' })
	return false
}

export function getFavorites() {
	const list = read(KEYS.favorites, [])
	return Array.isArray(list) ? list.map(normalizeSpot) : []
}

export function saveFavorites(list) {
	write(KEYS.favorites, (list || []).map(normalizeSpot))
}

export function getHistory() {
	const list = read(KEYS.history, [])
	return Array.isArray(list) ? list : []
}

export function addHistory(spot) {
	const item = normalizeSpot(spot)
	if (!item.id) return
	const list = getHistory().filter((row) => String(row.id) !== String(item.id))
	list.unshift({
		...item,
		viewedAt: Date.now()
	})
	write(KEYS.history, list.slice(0, 50))
}

export function removeHistory(id) {
	write(KEYS.history, getHistory().filter((row) => String(row.id) !== String(id)))
}

export function clearHistory() {
	write(KEYS.history, [])
}

export function getOrders() {
	const list = read(KEYS.orders, [])
	return Array.isArray(list) ? list : []
}

export function createOrder(payload) {
	const order = {
		id: `ORD${Date.now()}${Math.floor(Math.random() * 900 + 100)}`,
		orderNo: `XJ${Date.now()}`,
		spotId: payload.spotId,
		itemTitle: payload.itemTitle,
		image: payload.image,
		location: payload.location,
		quantity: Number(payload.quantity) || 1,
		unitPrice: Number(payload.unitPrice) || 0,
		couponId: payload.couponId || '',
		couponTitle: payload.couponTitle || '',
		discount: Number(payload.discount) || 0,
		totalPrice: Number(payload.totalPrice) || 0,
		visitDate: payload.visitDate || '',
		contactName: payload.contactName || '',
		contactPhone: payload.contactPhone || '',
		status: 'pending',
		createTime: Date.now(),
		payTime: 0
	}
	const list = getOrders()
	list.unshift(order)
	write(KEYS.orders, list)
	return order
}

export function updateOrder(id, patch) {
	const list = getOrders().map((order) => (
		String(order.id) === String(id) ? { ...order, ...patch } : order
	))
	write(KEYS.orders, list)
	return list.find((order) => String(order.id) === String(id))
}

export function getDefaultCoupons() {
	const now = Date.now()
	const expire = now + 90 * 24 * 60 * 60 * 1000
	return [
		{
			id: 'CPN_NEW20',
			title: '新用户立减',
			desc: '首次预订立减 20 元，满 50 可用',
			type: 'amount',
			amount: 20,
			threshold: 50,
			expireAt: expire,
			used: false
		},
		{
			id: 'CPN_WEEK90',
			title: '周末 9 折',
			desc: '周末出行享 9 折，无门槛',
			type: 'percent',
			percent: 0.9,
			threshold: 0,
			expireAt: expire,
			used: false
		},
		{
			id: 'CPN_FULL30',
			title: '满减券',
			desc: '满 200 减 30',
			type: 'amount',
			amount: 30,
			threshold: 200,
			expireAt: expire,
			used: false
		}
	]
}

export function seedCoupons() {
	if (read(KEYS.seeded, false)) {
		const existing = getCoupons()
		if (existing.length) return existing
	}
	const coupons = getDefaultCoupons()
	write(KEYS.coupons, coupons)
	write(KEYS.seeded, true)
	return coupons
}

export function getCoupons() {
	const list = read(KEYS.coupons, [])
	return Array.isArray(list) && list.length ? list : seedCoupons()
}

export function getAvailableCoupons(total = 0) {
	const now = Date.now()
	return getCoupons().filter((coupon) => (
		!coupon.used &&
		coupon.expireAt > now &&
		total >= (coupon.threshold || 0)
	))
}

export function calcCouponDiscount(coupon, total) {
	if (!coupon || total < (coupon.threshold || 0)) return 0
	if (coupon.type === 'percent') {
		return Math.round(total * (1 - Number(coupon.percent)))
	}
	return Math.min(Number(coupon.amount) || 0, total)
}

export function useCoupon(id) {
	const list = getCoupons().map((coupon) => (
		coupon.id === id ? { ...coupon, used: true, usedAt: Date.now() } : coupon
	))
	write(KEYS.coupons, list)
}

export function getSettings() {
	return {
		notify: true,
		locationEnabled: true,
		...read(KEYS.settings, {})
	}
}

export function saveSettings(patch) {
	const next = { ...getSettings(), ...patch }
	write(KEYS.settings, next)
	return next
}

export function clearLocalCache({ keepLogin = true } = {}) {
	write(KEYS.history, [])
	write(KEYS.favorites, [])
	uni.removeStorageSync('trip_plan')
	if (!keepLogin) {
		uni.removeStorageSync('userInfo')
		uni.removeStorageSync('token')
	}
}

export function getStats() {
	return {
		favoriteCount: getFavorites().length,
		historyCount: getHistory().length,
		orderCount: getOrders().length
	}
}

export function formatTime(ts) {
	if (!ts) return ''
	const date = new Date(ts)
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	const hh = String(date.getHours()).padStart(2, '0')
	const mm = String(date.getMinutes()).padStart(2, '0')
	return `${y}-${m}-${d} ${hh}:${mm}`
}

export function statusText(status) {
	return {
		pending: '待支付',
		paid: '已支付',
		used: '已使用',
		cancelled: '已取消'
	}[status] || status
}
