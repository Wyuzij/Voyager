import { get, post } from './http.js'
import { MockAPI } from '../utils/mock-api.js'

export function sendCode(phone) {
    return post('/user/sendCode', { phone }).catch(() => {
        console.log('[Mock] 使用本地数据: sendCode')
        return MockAPI.sendCode(phone)
    })
}

export function login(phone, code) {
    return post('/user/login', { phone, code }).catch(() => {
        console.log('[Mock] 使用本地数据: login')
        return MockAPI.login(phone, code)
    })
}

export function logout() {
    return post('/user/logout').catch(() => {
        return { code: 1, msg: 'success' }
    })
}

export function getUserInfo() {
    return get('/user/info').catch(() => {
        console.log('[Mock] 使用本地数据: getUserInfo')
        return MockAPI.getUserInfo()
    })
}

export function getOrderList(page = 1, pageSize = 10) {
    return get('/order/list', { page, pageSize }).catch(() => {
        console.log('[Mock] 使用本地数据: getOrderList')
        return MockAPI.getOrderList(null, page, pageSize)
    })
}
