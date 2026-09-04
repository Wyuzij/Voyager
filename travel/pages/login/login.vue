<template>
    <view class="login-container">
        <view class="bg-layer">
            <view class="paper-texture"></view>
            <view class="map-pattern"></view>
            <view class="vintage-frame"></view>
        </view>

        <view class="login-header">
            <view class="stamp-collection">
                <view class="stamp stamp-1">
                    <text class="stamp-text">VOYAGER</text>
                </view>
                <view class="stamp stamp-2">
                    <text class="stamp-text">旅行</text>
                </view>
            </view>
            <view class="logo-area">
                <view class="logo-emblem">
                    <text class="emblem-icon">◈</text>
                </view>
            </view>
            <text class="app-title">行迹</text>
            <text class="app-subtitle">探索世界，发现美好</text>
        </view>

        <view class="login-form">
            <view class="form-card">
                <view class="form-header">
                    <text class="form-title">欢迎回来</text>
                    <text class="form-desc">登录开启您的旅程</text>
                </view>

                <view class="input-group">
                    <view class="input-label">
                        <text class="label-text">手机号</text>
                    </view>
                    <view class="input-wrapper">
                        <view class="input-icon">
                            <text class="icon-text">◉</text>
                        </view>
                        <input class="form-input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号"
                            placeholder-class="placeholder" />
                    </view>
                </view>

                <view class="input-group">
                    <view class="input-label">
                        <text class="label-text">验证码</text>
                    </view>
                    <view class="code-row">
                        <view class="input-wrapper flex-1">
                            <view class="input-icon">
                                <text class="icon-text">◇</text>
                            </view>
                            <input class="form-input" v-model="code" type="number" maxlength="6" placeholder="请输入验证码"
                                placeholder-class="placeholder" />
                        </view>
                        <view class="code-btn" :class="{ disabled: countdown > 0 }" @click="sendCode">
                            <text class="code-text" v-if="countdown > 0">{{ countdown }}s</text>
                            <text class="code-text" v-else>获取验证码</text>
                        </view>
                    </view>
                </view>

                <view class="agreement-row">
                    <view class="checkbox-wrapper" @click="toggleAgree">
                        <view class="checkbox" :class="{ checked: agreed }">
                            <text class="check-icon" v-if="agreed">✓</text>
                        </view>
                        <view class="agreement-text">
                            <text class="text">我已阅读并同意</text>
                            <text class="link" @click.stop="showAgreement">《用户协议》</text>
                        </view>
                    </view>
                </view>

                <view class="login-btn" @click="handleLogin">
                    <view class="btn-bg"></view>
                    <view class="btn-shine"></view>
                    <text class="btn-text">登 录</text>
                </view>

                <view class="quick-login" @click="quickLogin">
                    <text class="quick-icon">⚡</text>
                    <text class="quick-text">快捷登录</text>
                </view>
            </view>
        </view>

        <view class="other-login">
            <view class="divider">
                <view class="divider-line"></view>
                <text class="divider-text">其他登录方式</text>
                <view class="divider-line"></view>
            </view>
            <view class="social-icons">
                <view class="social-btn wechat" @click="wechatLogin">
                    <view class="social-icon">
                        <text class="icon">W</text>
                    </view>
                    <text class="social-label">微信</text>
                </view>
                <view class="social-btn alipay" @click="alipayLogin">
                    <view class="social-icon">
                        <text class="icon">Z</text>
                    </view>
                    <text class="social-label">支付宝</text>
                </view>
            </view>
        </view>

        <view class="footer-stamp">
            <text class="footer-text">Est. 2024</text>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { login, sendCode as apiSendCode } from '../../api/auth.js'

const phone = ref('')
const code = ref('')
const countdown = ref(0)
const agreed = ref(false)
let timer = null

function toggleAgree() {
    agreed.value = !agreed.value
}

function isValidPhone(value) {
    return /^1[3-9]\d{9}$/.test(String(value || ''))
}

function showAgreement() {
    uni.showModal({
        title: '用户协议',
        content: '登录后，行迹会在本机保存你的资料、收藏、订单与浏览记录，仅用于演示预订和行程规划，不会发起真实扣款。',
        showCancel: false
    })
}

function persistUser(user) {
    uni.setStorageSync('userInfo', user)
    uni.setStorageSync('token', user.token)
    uni.$emit('userLogin', user)
}

function sendCode() {
    if (countdown.value > 0) return
    if (!isValidPhone(phone.value)) {
        uni.showToast({ title: '请输入正确的11位手机号', icon: 'none' })
        return
    }

    apiSendCode(phone.value).then(res => {
        const demoCode = res?.data?.code
        uni.showToast({
            title: demoCode ? `验证码已发送（演示码 ${demoCode}）` : '验证码已发送',
            icon: 'none',
            duration: 2500
        })
        startCountdown()
    }).catch(() => {
        uni.showToast({ title: '发送失败，请重试', icon: 'none' })
    })
}

function startCountdown() {
    countdown.value = 60
    timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer)
        }
    }, 1000)
}

function handleLogin() {
    if (!isValidPhone(phone.value)) {
        uni.showToast({ title: '请输入正确的11位手机号', icon: 'none' })
        return
    }

    if (!code.value || code.value.length !== 6) {
        uni.showToast({ title: '请输入 6 位验证码', icon: 'none' })
        return
    }

    if (!agreed.value) {
        uni.showToast({ title: '请先同意用户协议', icon: 'none' })
        return
    }

    login(phone.value, code.value).then(res => {
        const payload = res.data || {}
        const nested = payload.userInfo || {}
        const userInfo = {
            id: nested.id || payload.id || Date.now(),
            nickname: nested.nickname || payload.nickname || '行迹旅人',
            avatar: nested.avatar || payload.avatar || '/static/logo.png',
            phone: nested.phone || payload.phone || phone.value,
            token: payload.token || nested.token
        }
        persistUser(userInfo)
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => { uni.navigateBack() }, 1500)
    }).catch(err => {
        uni.showToast({ title: err.msg || '登录失败，请重试', icon: 'none' })
    })
}

function quickLogin() {
    persistUser({
        id: 1001,
        nickname: '行迹旅人',
        avatar: '/static/logo.png',
        phone: '13800138000',
        token: 'default_token_' + Date.now()
    })
    uni.showToast({ title: '登录成功', icon: 'success' })
    setTimeout(() => { uni.navigateBack() }, 1500)
}

function wechatLogin() {
    // #ifdef H5
    uni.showToast({ title: '网页预览请用「快捷登录」', icon: 'none' })
    return
    // #endif
    uni.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
            const userInfo = res.userInfo
            persistUser({
                nickname: userInfo.nickName,
                avatar: userInfo.avatarUrl,
                token: 'wechat_token_' + Date.now()
            })
            uni.showToast({ title: '微信登录成功', icon: 'success' })
            setTimeout(() => { uni.navigateBack() }, 1500)
        },
        fail: (err) => {
            uni.showToast({ title: '取消授权', icon: 'none' })
        }
    })
}

function alipayLogin() {
    // #ifdef H5
    uni.showToast({ title: '网页预览请用「快捷登录」', icon: 'none' })
    return
    // #endif
    persistUser({
        id: 1003,
        nickname: '支付宝用户',
        avatar: '/static/logo.png',
        phone: '',
        token: 'alipay_token_' + Date.now()
    })
    uni.showToast({ title: '支付宝登录成功', icon: 'success' })
    setTimeout(() => { uni.navigateBack() }, 1500)
}
</script>

<style>
page {
    background: #F5E6D3;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-container {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(180deg, #F5E6D3 0%, #E8D5B5 50%, #D4C4B0 100%);
    overflow: hidden;
}

.bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.paper-texture {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.04;
}

.map-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='none' stroke='%23C75B39' stroke-opacity='0.05' stroke-width='0.5'/%3E%3C/svg%3E");
    opacity: 0.8;
}

.vintage-frame {
    position: absolute;
    top: 40rpx;
    left: 40rpx;
    right: 40rpx;
    bottom: 40rpx;
    border: 2rpx solid rgba(199, 91, 57, 0.2);
    border-radius: 20rpx;
    pointer-events: none;
}

.login-header {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 120rpx 40rpx 40rpx;
}

.stamp-collection {
    position: absolute;
    top: 80rpx;
    right: 60rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.stamp {
    padding: 8rpx 16rpx;
    border: 3rpx solid #C75B39;
    border-radius: 8rpx;
    transform: rotate(-8deg);
    opacity: 0.8;
}

.stamp-2 {
    transform: rotate(5deg);
    align-self: flex-end;
}

.stamp-text {
    font-size: 18rpx;
    color: #C75B39;
    font-weight: 700;

    letter-spacing: 2rpx;
}

.logo-area {
    margin-bottom: 24rpx;
}

.logo-emblem {
    width: 140rpx;
    height: 140rpx;
    background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 32rpx rgba(199, 91, 57, 0.3);
    transform: rotate(-3deg);
}

.emblem-icon {
    font-size: 64rpx;
    color: #fff;
}

.app-title {
    font-size: 56rpx;
    color: #2D1810;
    font-weight: 700;

    margin-bottom: 8rpx;
    letter-spacing: 8rpx;
}

.app-subtitle {
    font-size: 26rpx;
    color: #8B7355;
    letter-spacing: 4rpx;
}

.login-form {
    position: relative;
    z-index: 10;
    padding: 0 40rpx;
}

.form-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 32rpx;
    padding: 48rpx 40rpx;
    box-shadow: 0 16rpx 48rpx rgba(45, 24, 16, 0.12);
    border: 1rpx solid rgba(199, 91, 57, 0.1);
}

.form-header {
    text-align: center;
    margin-bottom: 40rpx;
}

.form-title {
    font-size: 40rpx;
    color: #2D1810;
    font-weight: 700;

    display: block;
    margin-bottom: 8rpx;
}

.form-desc {
    font-size: 26rpx;
    color: #8B7355;
}

.input-group {
    margin-bottom: 32rpx;
}

.input-label {
    margin-bottom: 12rpx;
}

.label-text {
    font-size: 26rpx;
    color: #5D4E3C;
    font-weight: 500;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background: #FDF8F3;
    border-radius: 20rpx;
    padding: 0 24rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s ease;
}

.input-wrapper:focus-within {
    background: #fff;
    border-color: #C75B39;
    box-shadow: 0 0 0 4rpx rgba(199, 91, 57, 0.1);
}

.input-icon {
    width: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-text {
    font-size: 28rpx;
    color: #C75B39;
}

.form-input {
    flex: 1;
    height: 96rpx;
    font-size: 30rpx;
    color: #2D1810;
}

.placeholder {
    color: #B8A590;
}

.code-row {
    display: flex;
    gap: 16rpx;
}

.flex-1 {
    flex: 1;
}

.code-btn {
    width: 200rpx;
    height: 96rpx;
    background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(199, 91, 57, 0.3);
}

.code-btn.disabled {
    background: #E8D5B5;
    box-shadow: none;
}

.code-text {
    font-size: 26rpx;
    color: #fff;
    font-weight: 600;
}

.code-btn.disabled .code-text {
    color: #8B7355;
}

.agreement-row {
    margin-bottom: 32rpx;
}

.checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.checkbox {
    width: 40rpx;
    height: 40rpx;
    border: 2rpx solid #C75B39;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.checkbox.checked {
    background: #C75B39;
}

.check-icon {
    font-size: 24rpx;
    color: #fff;
}

.agreement-text {
    display: flex;
    font-size: 24rpx;
}

.text {
    color: #8B7355;
}

.link {
    color: #C75B39;
    font-weight: 500;
}

.login-btn {
    position: relative;
    height: 100rpx;
    border-radius: 50rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
}

.btn-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #C75B39 0%, #2D1810 100%);
}

.btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shine 3s infinite;
}

@keyframes shine {
    0% {
        left: -100%;
    }

    50%,
    100% {
        left: 100%;
    }
}

.btn-text {
    position: relative;
    z-index: 10;
    font-size: 34rpx;
    color: #fff;
    font-weight: 600;
    letter-spacing: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.quick-login {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 24rpx;
    background: linear-gradient(135deg, #F5E6D3 0%, #E8D5B5 100%);
    border-radius: 50rpx;
}

.quick-icon {
    font-size: 28rpx;
    color: #C75B39;
}

.quick-text {
    font-size: 28rpx;
    color: #2D1810;
    font-weight: 500;
}

.other-login {
    position: relative;
    z-index: 10;
    padding: 60rpx 40rpx 40rpx;
}

.divider {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 40rpx;
}

.divider-line {
    flex: 1;
    height: 1rpx;
    background: rgba(199, 91, 57, 0.3);
}

.divider-text {
    font-size: 24rpx;
    color: #8B7355;
    white-space: nowrap;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 80rpx;
}

.social-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
}

.social-icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(45, 24, 16, 0.1);
}

.social-icon .icon {
    font-size: 40rpx;
    color: #fff;
    font-weight: 600;
}

.wechat .social-icon {
    background: linear-gradient(135deg, #07C160 0%, #10B981 100%);
}

.alipay .social-icon {
    background: linear-gradient(135deg, #1677FF 0%, #0958D9 100%);
}

.social-label {
    font-size: 24rpx;
    color: #8B7355;
}

.footer-stamp {
    position: absolute;
    bottom: 60rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
}

.footer-text {
    font-size: 22rpx;
    color: rgba(199, 91, 57, 0.5);

    letter-spacing: 4rpx;
}
</style>
