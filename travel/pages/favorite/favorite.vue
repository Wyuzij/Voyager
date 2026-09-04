<template>
    <view class="content">
        <view class="header-section">
            <view class="header-content">
                <text class="page-title">我的收藏</text>
                <u-badge v-if="favoriteList.length" :value="favoriteList.length" bgColor="#C75B39" :offset="[0, 0]"></u-badge>
            </view>
            <text class="page-subtitle">收藏您心仪的目的地</text>
        </view>

        <view class="list-section" v-if="favoriteList.length">
            <view class="favorite-item" v-for="(item, index) in favoriteList" :key="index" @click="goToDetail(item)">
                <view class="item-image-wrapper">
                    <image :src="item.image" mode="aspectFill" class="item-image"></image>
                    <view class="item-rank" v-if="index < 3">
                        <text class="rank-num">{{ index + 1 }}</text>
                    </view>
                </view>
                <view class="item-content">
                    <view class="item-header">
                        <text class="item-title">{{ item.title }}</text>
                        <view class="rating-tag">
                            <u-icon name="star-fill" color="#C75B39" size="12"></u-icon>
                            <text class="rating-value">{{ item.rating || '4.8' }}</text>
                        </view>
                    </view>
                    <view class="item-meta">
                        <view class="item-location">
                            <u-icon name="map" color="#8B7355" size="12"></u-icon>
                            <text>{{ item.location }}</text>
                        </view>
                        <text class="item-sold">{{ item.sold || '1000' }}人已购</text>
                    </view>
                    <view class="item-footer">
                        <view class="price-info">
                            <text class="currency">¥</text>
                            <text class="item-price">{{ item.price }}</text>
                            <text class="original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
                        </view>
                        <view class="delete-button" @click.stop="removeFavorite(index)">
                            <u-icon name="trash" color="#C75B39" size="16"></u-icon>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="empty-state" v-else>
            <u-empty mode="favor" text="暂无收藏" icon-color="#C75B39">
                <u-button type="primary" shape="circle" text="去探索" size="small" @click="goToHome"></u-button>
            </u-empty>
        </view>
		<custom-tabbar current="favorite"></custom-tabbar>
    </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getFavorites, saveFavorites } from '../../utils/user-store.js'

const favoriteList = ref([])

const placeholderImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80',
    'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=400&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80'
]

onShow(() => {
    uni.hideTabBar({ fail() {} })
    loadFavorites()
})

function loadFavorites() {
    favoriteList.value = getFavorites().map((item, index) => ({
        ...item,
        image: item.image && String(item.image).startsWith('http') ? item.image : placeholderImages[index % placeholderImages.length]
    }))
}

function removeFavorite(index) {
    uni.showModal({
        title: '提示',
        content: '确定要取消收藏吗？',
        success: (res) => {
            if (res.confirm) {
                favoriteList.value.splice(index, 1)
                saveFavorites(favoriteList.value)
                uni.showToast({ title: '已取消收藏', icon: 'success' })
            }
        }
    })
}

function goToDetail(item) {
    uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}

function goToHome() {
    uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style>
.content {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #FDF8F3;
    padding-bottom: 24rpx;
}

.header-section {
    background: linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 100%);
    padding: 100rpx 40rpx 32rpx;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 12rpx;
}

.page-title {
    font-size: 52rpx;
    font-weight: 700;
    color: #2D1810;
    letter-spacing: -1rpx;
}

.count-badge {
    background: linear-gradient(135deg, #007AFF 0%, #0A84FF 100%);
    padding: 8rpx 20rpx;
    border-radius: 16rpx;
}

.count-text {
    font-size: 26rpx;
    color: #fff;
    font-weight: 600;
}

.page-subtitle {
    font-size: 28rpx;
    color: #8B7355;
}

.list-section {
    padding: 32rpx;
}

.favorite-item {
    display: flex;
    background: #ffffff;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease;
}

.favorite-item:active {
    transform: scale(0.98);
}

.item-image-wrapper {
    position: relative;
    width: 280rpx;
    height: 240rpx;
    flex-shrink: 0;
}

.item-image {
    width: 100%;
    height: 100%;
    display: block;
}

.item-rank {
    position: absolute;
    top: 16rpx;
    left: 16rpx;
    width: 56rpx;
    height: 56rpx;
    background: linear-gradient(135deg, #FF9500 0%, #FF5E3A 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(255, 149, 0, 0.4);
}

.rank-num {
    font-size: 28rpx;
    color: #fff;
    font-weight: 700;
}

.item-content {
    flex: 1;
    padding: 28rpx 28rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12rpx;
}

.item-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #2D1810;
    flex: 1;
    margin-right: 12rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 1.4;
}

.rating-tag {
    background: #F8E8E2;
    padding: 6rpx 16rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    gap: 6rpx;
}

.rating-value {
    font-size: 24rpx;
    color: #C75B39;
    font-weight: 600;
}

.item-meta {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    margin-bottom: 16rpx;
}

.item-location {
    display: flex;
    align-items: center;
    gap: 6rpx;
    font-size: 26rpx;
    color: #8B7355;
}

.item-sold {
    font-size: 26rpx;
    color: #8B7355;
}

.item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price-info {
    display: flex;
    align-items: baseline;
    gap: 4rpx;
}

.currency {
    font-size: 26rpx;
    color: #C75B39;
    font-weight: 600;
}

.item-price {
    font-size: 40rpx;
    color: #C75B39;
    font-weight: 700;
}

.original-price {
    font-size: 26rpx;
    color: #c7c7cc;
    text-decoration: line-through;
}

.delete-button {
    width: 64rpx;
    height: 64rpx;
    background: #F8E8E2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.delete-button:active {
    transform: scale(0.9);
}

.delete-icon {
    font-size: 28rpx;
    color: #fff;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 600rpx;
    padding: 60rpx 32rpx;
}

.empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.empty-icon {
    width: 160rpx;
    height: 160rpx;
    background: linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(10, 132, 255, 0.1) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
    font-size: 80rpx;
    color: #007AFF;
}

.empty-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1c1c1e;
    margin-bottom: 16rpx;
}

.empty-desc {
    font-size: 28rpx;
    color: #8e8e93;
    margin-bottom: 48rpx;
}

.explore-button {
    background: linear-gradient(135deg, #007AFF 0%, #0A84FF 100%);
    padding: 28rpx 80rpx;
    border-radius: 56rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.3);
}

.explore-button:active {
    transform: scale(0.95);
}

.explore-text {
    font-size: 30rpx;
    color: #fff;
    font-weight: 600;
    letter-spacing: 1rpx;
}
</style>
