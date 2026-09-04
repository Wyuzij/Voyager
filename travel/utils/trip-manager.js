/**
 * 行程管理模块
 * 管理景点添加到行程的功能
 */

const STORAGE_KEY = 'trip_plan'

export const TripManager = {
	addSpot(spot) {
		const plan = this.getPlan()
		const exists = plan.some(item => item.id === spot.id)

		if (exists) {
			return { success: false, msg: '已添加过该景点' }
		}

		const tripSpot = {
			id: spot.id,
			name: spot.title || spot.name,
			address: spot.location?.address || spot.location || '',
			latitude: spot.location?.latitude || 39.9042,
			longitude: spot.location?.longitude || 116.4074,
			price: spot.price,
			img: spot.img || spot.images?.[0],
			addedAt: Date.now()
		}

		plan.push(tripSpot)
		this.savePlan(plan)

		return { success: true, msg: '已添加到行程', data: tripSpot }
	},

	removeSpot(spotId) {
		const plan = this.getPlan()
		const index = plan.findIndex(item => item.id === spotId)

		if (index === -1) {
			return { success: false, msg: '景点不在行程中' }
		}

		plan.splice(index, 1)
		this.savePlan(plan)

		return { success: true, msg: '已从行程移除' }
	},

	getPlan() {
		try {
			const data = uni.getStorageSync(STORAGE_KEY)
			if (!data) return []
			if (Array.isArray(data)) return data
			return JSON.parse(data)
		} catch (e) {
			console.error('读取行程失败:', e)
			return []
		}
	},

	savePlan(plan) {
		try {
			uni.setStorageSync(STORAGE_KEY, JSON.stringify(plan))
		} catch (e) {
			console.error('保存行程失败:', e)
		}
	},

	clearPlan() {
		try {
			uni.removeStorageSync(STORAGE_KEY)
		} catch (e) {
			console.error('清空行程失败:', e)
		}
	},

	isInPlan(spotId) {
		const plan = this.getPlan()
		return plan.some(item => item.id === spotId)
	},

	getCount() {
		return this.getPlan().length
	}
}

export default TripManager
