/**
 * API Layer Unit Tests
 * Tests the business logic layer that wraps HTTP calls
 */
import { describe, test, expect, beforeEach, vi } from 'vitest'

const mockRequest = vi.fn()

global.uni = {
	request: mockRequest,
	getStorageSync: vi.fn((key) => {
		if (key === 'token') return 'mock_token_123'
		return null
	}),
	showToast: vi.fn(),
	setStorageSync: vi.fn()
}

vi.mock('../../utils/mock-api.js', () => ({
	MockAPI: {
		getBanner: () => ({
			code: 1,
			data: { bannerList: [{ id: 999, title: 'Mock Banner' }] }
		}),
		getHomeList: (page = 1, pageSize = 10) => ({
			code: 1,
			data: {
				list: Array.from({ length: Math.min(pageSize, 50) }, (_, i) => ({
					id: i + 1,
					title: `景点${i + 1}`,
					rating: '4.5',
					price: 100
				})),
				total: 50,
				page,
				pageSize
			}
		}),
		addFavorite: (spotId) => ({ code: 1, msg: '收藏成功', data: { spotId } }),
		removeFavorite: (spotId) => ({ code: 1, msg: '取消收藏成功', data: { spotId } })
	}
}))

describe('API Layer - Success Cases', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('getHomeList resolves with data on successful API call', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				code: 1,
				data: {
					list: [{ id: 1, title: '景点1' }],
					total: 1
				}
			}
		})

		const { getHomeList } = await import('../../api/api.js')
		const result = await getHomeList(1, 10)

		expect(result.code).toBe(1)
		expect(result.data.list).toBeDefined()
		expect(result.data.total).toBe(1)
	})

	test('getBanner resolves with banner list on success', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				code: 1,
				data: {
					bannerList: [{ id: 1, title: 'Banner1' }]
				}
			}
		})

		const { getBanner } = await import('../../api/api.js')
		const result = await getBanner()

		expect(result.code).toBe(1)
		expect(result.data.bannerList).toBeDefined()
		expect(result.data.bannerList.length).toBeGreaterThan(0)
	})

	test('getSpotDetail passes correct id parameter', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				code: 1,
				data: { id: 123, title: '测试景点' }
			}
		})

		const { getSpotDetail } = await import('../../api/api.js')
		const result = await getSpotDetail(123)

		expect(result.code).toBe(1)
		expect(result.data.id).toBe(123)
		expect(mockRequest).toHaveBeenCalled()
		const callConfig = mockRequest.mock.calls[0][0]
		expect(callConfig.data).toEqual({ id: 123 })
	})
})

describe('API Layer - Mock Fallback', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('getHomeList falls back to mock when request fails', async () => {
		mockRequest.mockRejectedValueOnce(new Error('Network error'))

		const { getHomeList } = await import('../../api/api.js')
		const result = await getHomeList(1, 10)

		expect(result.code).toBe(1)
		expect(result.data.list.length).toBeGreaterThan(0)
		expect(result.data.list.length).toBeLessThanOrEqual(50)
	})

	test('getBanner falls back to mock when request fails', async () => {
		mockRequest.mockRejectedValueOnce(new Error('Network error'))

		const { getBanner } = await import('../../api/api.js')
		const result = await getBanner()

		expect(result.code).toBe(1)
		expect(result.data.bannerList).toBeDefined()
		expect(result.data.bannerList[0].id).toBe(999)
	})

	test('getFavoriteList falls back to mock when request fails', async () => {
		mockRequest.mockRejectedValueOnce(new Error('Network error'))

		const { getFavoriteList } = await import('../../api/api.js')
		const result = await getFavoriteList(1, 10)

		expect(result.code).toBe(1)
		expect(result.data.list).toBeDefined()
	})
})

describe('API Layer - Pagination', () => {
	test('getHomeList passes correct pagination parameters', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { code: 1, data: { list: [], total: 0, page: 2, pageSize: 20 } }
		})

		const { getHomeList } = await import('../../api/api.js')
		await getHomeList(2, 20)

		expect(mockRequest).toHaveBeenCalled()
		const callConfig = mockRequest.mock.calls[0][0]
		expect(callConfig.data).toEqual({ page: 2, pageSize: 20 })
	})

	test('getReviewList passes correct spotId and pagination', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { code: 1, data: { list: [], total: 0 } }
		})

		const { getReviewList } = await import('../../api/api.js')
		await getReviewList(123, 1, 10)

		expect(mockRequest).toHaveBeenCalled()
		const callConfig = mockRequest.mock.calls[0][0]
		expect(callConfig.data).toEqual({ spotId: 123, page: 1, pageSize: 10 })
	})
})
