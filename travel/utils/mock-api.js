/**
 * 本地模拟接口。景点走稳定目录，订单/优惠券走本地存储。
 */

import { SPOT_CATALOG, getSpotById, filterSpots, paginateSpots, cloneSpot } from './catalog.js'
import { createOrder as storeCreateOrder, getOrders } from './user-store.js'

function ok(data, msg = 'success') {
	return { code: 1, msg, data }
}

function createUser(overrides = {}) {
	return {
		id: overrides.id || 1001,
		nickname: overrides.nickname || '行迹旅人',
		avatar: overrides.avatar || '/static/logo.png',
		phone: overrides.phone || '138****8000',
		token: overrides.token || `mock_token_${Date.now()}`,
		...overrides
	}
}

function reviewsFor(spotId) {
	const spot = getSpotById(spotId)
	const title = spot?.title || '这里'
	return [
		{
			id: Number(`${spotId}01`),
			name: '旅行者阿明',
			userNickname: '旅行者阿明',
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
			userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
			rating: 5,
			date: '2026.04.18',
			createTime: '2026-04-18T10:00:00Z',
			content: `${title}比照片里更耐看，建议早到避开人流。讲解很值，走完正好半天。`,
			images: spot?.images?.slice(0, 2) || []
		},
		{
			id: Number(`${spotId}02`),
			name: '镜头里的周末',
			userNickname: '镜头里的周末',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
			userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
			rating: 4.6,
			date: '2026.03.22',
			createTime: '2026-03-22T16:20:00Z',
			content: '光线好的时候特别出片，周边餐饮也方便。带老人的话注意路线长短。',
			images: []
		}
	]
}

export const MockAPI = {
	getBanner() {
		return ok({
			bannerList: SPOT_CATALOG.slice(0, 5).map((spot, index) => ({
				id: index + 1,
				title: spot.title,
				image: spot.images[0],
				type: 'spot',
				targetId: spot.id
			}))
		})
	},

	getHomeList(page = 1, pageSize = 10, extra = {}) {
		const list = filterSpots({
			keyword: extra.keyword,
			theme: extra.theme,
			city: extra.city
		})
		return ok(paginateSpots(list, page, pageSize))
	},

	getSpotDetail(id) {
		const spot = getSpotById(id)
		if (!spot) {
			return { code: 0, msg: '景点不存在', data: null }
		}
		return ok(spot)
	},

	getFavoriteList(page = 1, pageSize = 10) {
		return ok(paginateSpots(SPOT_CATALOG.slice(0, 8).map(cloneSpot), page, pageSize))
	},

	login(phone) {
		const token = `mock_token_${Date.now()}`
		const userInfo = createUser({
			phone: String(phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
			nickname: '行迹旅人',
			token
		})
		return ok({
			token,
			...userInfo,
			userInfo
		})
	},

	sendCode() {
		return ok({ code: '123456' })
	},

	getUserInfo() {
		return ok(createUser())
	},

	getOrderList(page = 1, pageSize = 10) {
		const orders = getOrders()
		return ok(paginateSpots(orders, page, pageSize))
	},

	getReviewList(spotId, page = 1, pageSize = 10) {
		return ok(paginateSpots(reviewsFor(spotId), page, pageSize))
	},

	searchSpots(keyword, page = 1, pageSize = 10) {
		return ok(paginateSpots(filterSpots({ keyword }), page, pageSize))
	},

	getNearbySpots(_latitude, _longitude, page = 1, pageSize = 10) {
		const beijing = filterSpots({ city: '北京' })
		return ok(paginateSpots(beijing.length ? beijing : SPOT_CATALOG, page, pageSize))
	},

	getHotSpots(page = 1, pageSize = 10) {
		const hot = [...SPOT_CATALOG].sort((a, b) => Number(b.rating) - Number(a.rating))
		return ok(paginateSpots(hot, page, pageSize))
	},

	getRecommendSpots(page = 1, pageSize = 10) {
		return ok(paginateSpots(SPOT_CATALOG.filter((s) => s.tags.includes('热门推荐')), page, pageSize))
	},

	createOrder(orderData) {
		return ok(storeCreateOrder(orderData))
	},

	addFavorite(spotId) {
		return ok({ spotId }, '收藏成功')
	},

	removeFavorite(spotId) {
		return ok({ spotId }, '取消收藏成功')
	}
}

export { createUser }
