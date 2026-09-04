/**
 * HTTP Layer Unit Tests
 */
import { describe, test, expect, beforeEach, vi } from 'vitest'

const createMockRequestTask = () => ({
	abort: vi.fn()
})

const mockRequest = vi.fn((config) => {
	const requestTask = createMockRequestTask()
	const promise = new Promise((resolve, reject) => {
		setTimeout(() => {
			if (config.url.includes('fail')) {
				resolve({ data: null })
			} else {
				resolve({ data: { code: 1, data: {} } })
			}
		}, 10)
	})
	return Object.assign(promise, { abort: requestTask.abort })
})

global.uni = {
	request: mockRequest,
	getStorageSync: vi.fn((key) => {
		if (key === 'token') return 'mock_token_123'
		return null
	}),
	showToast: vi.fn(),
	setStorageSync: vi.fn()
}

describe('HTTP Layer', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockRequest.mockReset()
	})

	test('uni.request is called with correct parameters', async () => {
		mockRequest.mockImplementation((config) => {
			const promise = Promise.resolve({ data: { code: 1, data: { bannerList: [] } } })
			return Object.assign(promise, { abort: vi.fn() })
		})

		const { get } = await import('../../../travel/api/http.js')
		await get('/user/getBanner')

		expect(mockRequest).toHaveBeenCalled()
		const callConfig = mockRequest.mock.calls[0][0]
		expect(callConfig.url).toContain('/user/getBanner')
		expect(callConfig.method).toBe('GET')
	})

	test('request includes auth header when token exists', async () => {
		mockRequest.mockImplementation((config) => {
			const promise = Promise.resolve({ data: { code: 1, data: {} } })
			return Object.assign(promise, { abort: vi.fn() })
		})

		const { get } = await import('../../../travel/api/http.js')
		await get('/user/getBanner')

		const callConfig = mockRequest.mock.calls[0][0]
		expect(callConfig.header['Authorization']).toBe('Bearer mock_token_123')
	})

	test('request uses correct timeout', async () => {
		mockRequest.mockImplementation((config) => {
			const promise = Promise.resolve({ data: { code: 1, data: {} } })
			return Object.assign(promise, { abort: vi.fn() })
		})

		const { get } = await import('../../../travel/api/http.js')
		await get('/user/getBanner')

		const callConfig = mockRequest.mock.calls[0][0]
		expect(callConfig.timeout).toBe(5000)
	})

	test('rejects when response has no data', async () => {
		mockRequest.mockImplementation((config) => {
			const promise = Promise.resolve({ data: null })
			return Object.assign(promise, { abort: vi.fn() })
		})

		const { get } = await import('../../../travel/api/http.js')

		await expect(get('/user/getBanner')).rejects.toEqual({ msg: '请求失败' })
	})

	test('rejects when response code is not 1', async () => {
		mockRequest.mockImplementation((config) => {
			const promise = Promise.resolve({ data: { code: 0, msg: 'Error' } })
			return Object.assign(promise, { abort: vi.fn() })
		})

		const { get } = await import('../../../travel/api/http.js')

		await expect(get('/user/getBanner')).rejects.toEqual({ code: 0, msg: 'Error' })
	})

	test('rejects when request fails', async () => {
		mockRequest.mockImplementation((config) => {
			const promise = Promise.reject(new Error('Network error'))
			return Object.assign(promise, { abort: vi.fn() })
		})

		const { get } = await import('../../../travel/api/http.js')

		await expect(get('/user/getBanner')).rejects.toEqual({ msg: '网络请求失败，请检查网络连接' })
	})
})
