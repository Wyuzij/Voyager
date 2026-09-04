import { ref } from 'vue'

// 用户信息
export const userInfo = ref(null)

// 初始化用户信息
export function initUserInfo() {
    const user = uni.getStorageSync('userInfo')
    if (user) {
        userInfo.value = user
    }
}

// 设置用户信息
export function setUserInfo(user) {
    userInfo.value = user
    uni.setStorageSync('userInfo', user)
}

// 清除用户信息
export function clearUserInfo() {
    userInfo.value = null
    uni.removeStorageSync('userInfo')
    uni.removeStorageSync('token')
}

// 检查是否登录
export function isLogin() {
    return !!uni.getStorageSync('token')
}

// 获取 Token
export function getToken() {
    return uni.getStorageSync('token')
}