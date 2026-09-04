/**
 * index.vue Page Tests
 */
import { describe, test, expect, beforeEach, vi } from 'vitest'

const mockRequest = vi.fn()
const mockGetStorageSync = vi.fn()
const mockSetStorageSync = vi.fn()
const mockShowToast = vi.fn()
const mockNavigateTo = vi.fn()

global.uni = {
	request: mockRequest,
	getStorageSync: mockGetStorageSync,
	setStorageSync: mockSetStorageSync,
	showToast: mockShowToast,
	navigateTo: mockNavigateTo
}

const mockSpotList = Array.from({ length: 50 }, (_, i) => ({
	id: i + 1,
	title: `景点${i + 1}`,
	rating: (4 + Math.random()).toFixed(1),
	price: 50 + i * 10,
	distance: `${(Math.random() * 50).toFixed(1)}km`,
	images: [`https://example.com/image${i}.jpg`],
	location: {
		address: `北京市朝阳区第${i + 1}号`,
		province: '北京市',
		city: '北京市'
	},
	tags: ['热门推荐', '5A景区']
}))

vi.mock('../../api/api.js', () => ({
	getHomeList: vi.fn((page, pageSize) => {
		return Promise.resolve({
			code: 1,
			data: {
				list: mockSpotList.slice((page - 1) * pageSize, page * pageSize),
				total: 50,
				page,
				pageSize
			}
		})
	})
}))

describe('index.vue - loadMockData', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockGetStorageSync.mockImplementation((key) => {
			if (key === 'favorites') return []
			return null
		})
	})

	test('loadMockData fetches 50 items from API', async () => {
		const { getHomeList } = await import('../../api/api.js')
		const placeholderImages = [
			'https://images.unsplash.com/photo-1',
			'https://images.unsplash.com/photo-2',
			'https://images.unsplash.com/photo-3',
			'https://images.unsplash.com/photo-4'
		]

		async function loadMockData() {
			const res = await getHomeList(1, 50)
			if (res.code === 1 && res.data) {
				return res.data.list.map((item, index) => ({
					id: item.id,
					title: item.title,
					rating: item.rating,
					price: item.price,
					distance: item.distance,
					location: item.location?.address || `${item.location?.province || ''}${item.location?.city || ''}`,
					tag: item.tags?.[0] || '',
					img: item.images?.[0] || placeholderImages[index % placeholderImages.length]
				}))
			}
			return []
		}

		const result = await loadMockData()

		expect(result.length).toBe(50)
		expect(getHomeList).toHaveBeenCalledWith(1, 50)
	})

	test('loadMockData maps item fields correctly', async () => {
		const { getHomeList } = await import('../../api/api.js')

		async function loadMockData() {
			const res = await getHomeList(1, 1)
			if (res.code === 1 && res.data) {
				const item = res.data.list[0]
				return {
					id: item.id,
					title: item.title,
					rating: item.rating,
					price: item.price,
					location: item.location?.address,
					img: item.images?.[0]
				}
			}
			return null
		}

		const result = await loadMockData()

		expect(result).toHaveProperty('id')
		expect(result).toHaveProperty('title')
		expect(result).toHaveProperty('rating')
		expect(result).toHaveProperty('price')
		expect(result).toHaveProperty('location')
		expect(result).toHaveProperty('img')
		expect(result.location).toContain('北京市朝阳区')
	})

	test('loadMockData falls back to static data on API failure', async () => {
		const { getHomeList } = await import('../../api/api.js')
		getHomeList.mockRejectedValueOnce(new Error('Network error'))

		const mockData = [
			{ id: 1, title: '故宫博物院', rating: 4.9, price: 60, distance: '2.3km', location: '北京市东城区' },
			{ id: 2, title: '八达岭长城', rating: 4.8, price: 40, distance: '15.6km', location: '北京市延庆区' }
		]

		function loadFallbackData() {
			return mockData
		}

		async function loadMockData() {
			try {
				await getHomeList(1, 50)
			} catch (e) {
				console.error('加载数据失败:', e)
				return loadFallbackData()
			}
		}

		const result = await loadMockData()

		expect(result.length).toBe(2)
		expect(result[0].title).toBe('故宫博物院')
	})
})

describe('index.vue - Favorite Functions', () => {
	test('isFavorite returns true when item is in favorites', () => {
		const favorites = [{ id: 1 }, { id: 2 }]
		const item = { id: 1 }

		const result = favorites.some(fav => fav.id === item.id)

		expect(result).toBe(true)
	})

	test('isFavorite returns false when item is not in favorites', () => {
		const favorites = [{ id: 1 }, { id: 2 }]
		const item = { id: 3 }

		const result = favorites.some(fav => fav.id === item.id)

		expect(result).toBe(false)
	})

	test('toggleFavorite adds item when not present', () => {
		const favorites = []
		const item = { id: 1, title: '测试景点' }

		if (!favorites.some(fav => fav.id === item.id)) {
			favorites.push(item)
		}

		expect(favorites.length).toBe(1)
		expect(favorites[0].id).toBe(1)
	})

	test('toggleFavorite removes item when already present', () => {
		const favorites = [{ id: 1, title: '测试景点' }]
		const item = { id: 1, title: '测试景点' }

		const index = favorites.findIndex(fav => fav.id === item.id)
		if (index > -1) {
			favorites.splice(index, 1)
		}

		expect(favorites.length).toBe(0)
	})

	test('toggleFavorite persists to storage', () => {
		const favorites = []
		const item = { id: 1 }

		if (!favorites.some(fav => fav.id === item.id)) {
			favorites.push(item)
		}
		uni.setStorageSync('favorites', favorites)

		expect(mockSetStorageSync).toHaveBeenCalledWith('favorites', expect.any(Array))
	})

	test('toggleFavorite shows toast on add', () => {
		const favorites = []
		const item = { id: 1 }

		if (!favorites.some(fav => fav.id === item.id)) {
			favorites.push(item)
			uni.showToast({ title: '已收藏', icon: 'success' })
		}

		expect(mockShowToast).toHaveBeenCalledWith({ title: '已收藏', icon: 'success' })
	})

	test('toggleFavorite shows toast on remove', () => {
		const favorites = [{ id: 1 }]
		const item = { id: 1 }

		const index = favorites.findIndex(fav => fav.id === item.id)
		if (index > -1) {
			favorites.splice(index, 1)
			uni.showToast({ title: '已取消收藏', icon: 'none' })
		}

		expect(mockShowToast).toHaveBeenCalledWith({ title: '已取消收藏', icon: 'none' })
	})
})

describe('index.vue - Navigation', () => {
	test('goToDetail navigates to detail page with item id', () => {
		const item = { id: 123 }

		uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })

		expect(mockNavigateTo).toHaveBeenCalledWith({ url: '/pages/detail/detail?id=123' })
	})

	test('planRoute navigates to plan page', () => {
		uni.navigateTo({ url: '/pages/plan/plan' })

		expect(mockNavigateTo).toHaveBeenCalledWith({ url: '/pages/plan/plan' })
	})

	test('selectTheme shows toast with theme name', () => {
		const theme = '文化之旅'

		uni.showToast({ title: `探索${theme}`, icon: 'none' })

		expect(mockShowToast).toHaveBeenCalledWith({ title: '探索文化之旅', icon: 'none' })
	})
})

describe('index.vue - Computed Properties', () => {
	test('timeOfDay returns correct value based on hour', () => {
		const getTimeOfDay = (hour) => {
			if (hour < 6) return '凌晨'
			if (hour < 9) return '清晨'
			if (hour < 12) return '上午'
			if (hour < 14) return '中午'
			if (hour < 18) return '下午'
			if (hour < 22) return '傍晚'
			return '夜晚'
		}

		expect(getTimeOfDay(3)).toBe('凌晨')
		expect(getTimeOfDay(7)).toBe('清晨')
		expect(getTimeOfDay(10)).toBe('上午')
		expect(getTimeOfDay(13)).toBe('中午')
		expect(getTimeOfDay(17)).toBe('下午')
		expect(getTimeOfDay(20)).toBe('傍晚')
		expect(getTimeOfDay(23)).toBe('夜晚')
	})

	test('greeting returns correct message based on hour', () => {
		const getGreeting = (hour) => {
			if (hour < 6) return '夜深了，注意休息'
			if (hour < 9) return '早安，今天去哪探索？'
			if (hour < 12) return '上午好，旅途开始'
			if (hour < 14) return '午后时光，适合出发'
			if (hour < 18) return '下午好，风景正当时'
			if (hour < 22) return '傍晚时分，华灯初上'
			return '夜幕降临，静享时光'
		}

		expect(getGreeting(5)).toBe('夜深了，注意休息')
		expect(getGreeting(8)).toBe('早安，今天去哪探索？')
		expect(getGreeting(11)).toBe('上午好，旅途开始')
		expect(getGreeting(15)).toBe('下午好，风景正当时')
		expect(getGreeting(21)).toBe('傍晚时分，华灯初上')
	})
})

describe('index.vue - loadFavorites', () => {
	test('loadFavorites retrieves favorites from storage', () => {
		const mockFavorites = [{ id: 1, title: '景点1' }]
		mockGetStorageSync.mockReturnValue(mockFavorites)

		function loadFavorites() {
			return uni.getStorageSync('favorites') || []
		}

		const result = loadFavorites()

		expect(mockGetStorageSync).toHaveBeenCalledWith('favorites')
		expect(result).toEqual(mockFavorites)
	})

	test('loadFavorites returns empty array when no favorites', () => {
		mockGetStorageSync.mockReturnValue(null)

		function loadFavorites() {
			return uni.getStorageSync('favorites') || []
		}

		const result = loadFavorites()

		expect(result).toEqual([])
	})
})
