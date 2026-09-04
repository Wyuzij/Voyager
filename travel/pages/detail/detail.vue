<template>
	<view class="content">
		<view class="image-header">
			<image :src="detail.image" mode="aspectFill" class="header-image"></image>
			<view class="header-gradient"></view>
			<view class="header-actions">
				<view class="action-btn" @click="goBack">
					<text class="action-icon">←</text>
				</view>
				<view class="action-btn" @click="shareSpot">
					<text class="action-icon">↗</text>
				</view>
			</view>
			<view class="image-overlay">
				<view class="breadcrumb">
					<text class="breadcrumb-text">首页</text>
					<text class="breadcrumb-sep">›</text>
					<text class="breadcrumb-text">景点</text>
					<text class="breadcrumb-sep">›</text>
					<text class="breadcrumb-current">{{ detail.title }}</text>
				</view>
			</view>
		</view>

		<view class="scroll-content">
			<view class="title-card">
				<view class="title-header">
					<view class="tag" v-if="detail.tag">{{ detail.tag }}</view>
					<view class="rating-box">
						<text class="rating-score">{{ detail.rating || '4.9' }}</text>
						<view class="rating-stars">
							<text class="star">★</text>
							<text class="star">★</text>
							<text class="star">★</text>
							<text class="star">★</text>
							<text class="star">★</text>
						</view>
					</view>
				</view>
				<text class="main-title">{{ detail.title }}</text>
				<view class="location-row">
					<view class="location-pin">
						<text class="pin-icon">⌖</text>
					</view>
					<text class="location-text">{{ detail.location }}</text>
					<text class="distance-text">| {{ detail.distance || '2.3km' }}</text>
				</view>
			</view>

			<view class="stats-card">
				<view class="stat-item">
					<text class="stat-value">{{ detail.sold || '2356' }}</text>
					<text class="stat-label">已售</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-value">{{ detail.reviewCount || '1289' }}</text>
					<text class="stat-label">评论</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-value">{{ detail.favoriteCount || '856' }}</text>
					<text class="stat-label">收藏</text>
				</view>
			</view>

			<view class="price-card">
				<view class="price-section">
					<text class="price-label">人均</text>
					<view class="price-row">
						<text class="currency">¥</text>
						<text class="current-price">{{ detail.price }}</text>
						<text class="original-price" v-if="detail.originalPrice">¥{{ detail.originalPrice }}</text>
					</view>
				</view>
				<view class="discount-badge" v-if="detail.originalPrice">
					<text class="discount-text">{{ Math.round(detail.price / detail.originalPrice * 10) }}折</text>
				</view>
			</view>

			<view class="info-section">
				<view class="section-title-row">
					<view class="section-indicator"></view>
					<text class="section-title">景点介绍</text>
				</view>
				<view class="description-card">
					<text class="description-text">{{ detail.description || '正在加载景点介绍…' }}</text>
				</view>
			</view>

			<view class="info-section">
				<view class="section-title-row">
					<view class="section-indicator"></view>
					<text class="section-title">游玩贴士</text>
				</view>
				<view class="tips-card">
					<view class="tip-row">
						<view class="tip-icon-wrap">
							<text class="tip-icon">◷</text>
						</view>
						<view class="tip-content">
							<text class="tip-label">开放时间</text>
							<text class="tip-value">{{ detail.openTime || '08:00 - 18:00' }}</text>
						</view>
					</view>
					<view class="tip-divider"></view>
					<view class="tip-row">
						<view class="tip-icon-wrap">
							<text class="tip-icon">☁</text>
						</view>
						<view class="tip-content">
							<text class="tip-label">建议游玩</text>
							<text class="tip-value">{{ detail.recommendedDuration || '2-4小时' }}</text>
						</view>
					</view>
					<view class="tip-divider"></view>
					<view class="tip-row">
						<view class="tip-icon-wrap">
							<text class="tip-icon">☎</text>
						</view>
						<view class="tip-content">
							<text class="tip-label">联系电话</text>
							<text class="tip-value">{{ detail.phone || '400-800-2024' }}</text>
						</view>
					</view>
					<view class="tip-divider"></view>
					<view class="tip-row">
						<view class="tip-icon-wrap">
							<text class="tip-icon">ⓘ</text>
						</view>
						<view class="tip-content">
							<text class="tip-label">适合人群</text>
							<text class="tip-value">{{ detail.suitable || '亲子/情侣/团队' }}</text>
						</view>
					</view>
				</view>
			</view>

			<view class="info-section">
				<view class="section-title-row">
					<view class="section-indicator"></view>
					<text class="section-title">景点位置</text>
				</view>
				<view class="map-card">
					<map id="map" class="map" :latitude="latitude" :longitude="longitude" :scale="14" :markers="markers"
						:show-location="true" @markertap="markertap">
					</map>
					<view class="map-info">
						<view class="map-address">
							<text class="address-text">{{ detail.location }}</text>
						</view>
						<view class="map-button" @click="openMapApp">
							<text class="map-button-text">导航前往</text>
							<text class="map-arrow">→</text>
						</view>
					</view>
				</view>
			</view>

			<view class="info-section">
				<view class="section-title-row">
					<view class="section-indicator"></view>
					<text class="section-title">游客点评</text>
					<text class="section-more" @click="showAllReviews">查看全部</text>
				</view>
				<view class="reviews-list">
					<view class="review-card" v-for="(review, index) in reviews" :key="index">
						<view class="review-header">
							<image class="review-avatar" :src="review.avatar" mode="aspectFill"></image>
							<view class="review-info">
								<text class="review-name">{{ review.name }}</text>
								<view class="review-meta">
									<text class="review-rating">★ {{ review.rating }}</text>
									<text class="review-date">{{ review.date }}</text>
								</view>
							</view>
						</view>
						<text class="review-content">{{ review.content }}</text>
						<view class="review-images" v-if="review.images">
							<image class="review-image" v-for="(img, i) in review.images" :key="i" :src="img"
								mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</view>

			<view class="bottom-spacer"></view>
		</view>

		<view class="bottom-bar">
			<view class="bottom-left">
				<view class="bottom-action" @click="toggleFavorite">
					<text class="bottom-icon">{{ isFavorite ? '♥' : '♡' }}</text>
					<text class="bottom-label">{{ isFavorite ? '已收藏' : '收藏' }}</text>
				</view>
				<view class="bottom-action" @click="contactService">
					<text class="bottom-icon">💬</text>
					<text class="bottom-label">客服</text>
				</view>
			</view>
			<view class="buy-button" @click="buyNow">
				<text class="buy-button-text">立即预订</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { getReviewList, getSpotDetail } from '../../api/api.js'
import { addHistory, getFavorites, normalizeSpot, requireLogin, saveFavorites } from '../../utils/user-store.js'

const SERVICE_PHONE = '4008002024'

const detail = ref({
	id: '',
	title: '',
	image: '',
	price: 0,
	originalPrice: null,
	location: '',
	rating: '4.8',
	sold: '0',
	reviewCount: '0',
	favoriteCount: '0',
	distance: '',
	description: '',
	tag: '',
	openTime: '',
	recommendedDuration: '',
	phone: SERVICE_PHONE,
	suitable: '亲子/情侣/团队'
})

const favorites = ref([])
const isFavorite = ref(false)
const latitude = ref(39.9042)
const longitude = ref(116.4074)
const markers = ref([])
const reviews = ref([])

onShareAppMessage(() => ({
	title: detail.value.title || '行迹 · 发现好去处',
	path: `/pages/detail/detail?id=${detail.value.id}`
}))

onLoad((options) => {
	if (options.id) detail.value.id = options.id
	loadFavorites()
	loadDetail()
})

function applySpot(spot) {
	const card = normalizeSpot({
		id: spot.id,
		title: spot.title,
		image: spot.images?.[0] || spot.image,
		location: spot.location,
		price: spot.price,
		originalPrice: spot.originalPrice,
		rating: spot.rating,
		sold: spot.sold
	})
	detail.value = {
		...detail.value,
		...card,
		image: card.image,
		description: spot.description || '',
		tag: spot.tags?.[0] || spot.tag || '',
		reviewCount: spot.reviewCount || 0,
		favoriteCount: spot.favoriteCount || getFavorites().length,
		openTime: spot.openTime || '08:00 - 18:00',
		recommendedDuration: spot.recommendedDuration || '2-4小时',
		phone: spot.phone || SERVICE_PHONE,
		suitable: spot.suitable || '亲子/情侣/团队'
	}
	latitude.value = spot.location?.latitude || card.latitude || 39.9042
	longitude.value = spot.location?.longitude || card.longitude || 116.4074
	isFavorite.value = favorites.value.some((fav) => String(fav.id) === String(detail.value.id))
	markers.value = [{
		id: 1,
		latitude: latitude.value,
		longitude: longitude.value,
		title: detail.value.title,
		width: 30,
		height: 30
	}]
	addHistory(detail.value)
}

function loadFavorites() {
	favorites.value = getFavorites()
	isFavorite.value = favorites.value.some((fav) => String(fav.id) === String(detail.value.id))
}

async function loadDetail() {
	if (!detail.value.id) return
	try {
		const res = await getSpotDetail(detail.value.id)
		if (res.code === 1 && res.data) {
			applySpot(res.data)
		}
	} catch (e) {
		console.error('加载详情失败', e)
	}
	loadReviews()
}

async function loadReviews() {
	try {
		const res = await getReviewList(detail.value.id, 1, 10)
		if (res.code === 1 && res.data?.list) {
			reviews.value = res.data.list.map((item) => ({
				name: item.name || item.userNickname,
				avatar: item.avatar || item.userAvatar,
				rating: item.rating,
				date: item.date || (item.createTime || '').slice(0, 10),
				content: item.content,
				images: item.images || []
			}))
		}
	} catch (e) {
		reviews.value = []
	}
}

function showAllReviews() {
	if (!reviews.value.length) {
		uni.showToast({ title: '暂无更多点评', icon: 'none' })
		return
	}
	const preview = reviews.value.map((item) => `${item.name} ${item.rating}分：${item.content}`).join('\n\n')
	uni.showModal({
		title: '游客点评',
		content: preview.slice(0, 500),
		showCancel: false
	})
}

function toggleFavorite() {
	loadFavorites()
	const index = favorites.value.findIndex((fav) => String(fav.id) === String(detail.value.id))
	if (index > -1) {
		favorites.value.splice(index, 1)
		isFavorite.value = false
		uni.showToast({ title: '已取消收藏', icon: 'none' })
	} else {
		favorites.value.unshift(normalizeSpot(detail.value))
		isFavorite.value = true
		uni.showToast({ title: '已收藏', icon: 'success' })
	}
	saveFavorites(favorites.value)
}

function goBack() {
	uni.navigateBack({ fail: () => uni.switchTab({ url: '/pages/index/index' }) })
}

function shareSpot() {
	const text = `${detail.value.title} · ${detail.value.location}`
	// #ifdef H5
	if (typeof navigator !== 'undefined' && navigator.share) {
		navigator.share({ title: detail.value.title, text }).catch(() => copyShareText(text))
		return
	}
	copyShareText(text)
	return
	// #endif
	uni.setClipboardData({
		data: text,
		success: () => uni.showToast({ title: '已复制，可发给朋友', icon: 'none' })
	})
}

function copyShareText(text) {
	uni.setClipboardData({
		data: text,
		success: () => uni.showToast({ title: '链接文案已复制', icon: 'none' })
	})
}

function contactService() {
	const phone = (detail.value.phone || SERVICE_PHONE).replace(/\D/g, '')
	uni.showActionSheet({
		itemList: [`拨打客服 ${detail.value.phone || SERVICE_PHONE}`, '复制电话'],
		success: (res) => {
			if (res.tapIndex === 0) {
				uni.makePhoneCall({
					phoneNumber: phone,
					fail: () => copyShareText(phone)
				})
			} else {
				copyShareText(phone)
			}
		}
	})
}

function buyNow() {
	if (!requireLogin()) return
	if (!detail.value.id) {
		uni.showToast({ title: '景点信息未加载', icon: 'none' })
		return
	}
	uni.navigateTo({ url: `/pages/booking/booking?id=${detail.value.id}` })
}

function markertap() {
	console.log('点击了标记点')
}

function openMapApp() {
	uni.openLocation({
		latitude: latitude.value,
		longitude: longitude.value,
		name: detail.value.title,
		address: detail.value.location,
		scale: 14,
		fail: () => {
			// #ifdef H5
			const url = `https://uri.amap.com/marker?position=${longitude.value},${latitude.value}&name=${encodeURIComponent(detail.value.title || '')}`
			window.open(url, '_blank')
			// #endif
		}
	})
}
</script>

<style>
page {
	background: #FDF8F3;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.content {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background: #FDF8F3;
}

.image-header {
	position: relative;
	width: 100%;
	height: 560rpx;
	overflow: hidden;
}

.header-image {
	width: 100%;
	height: 100%;
}

.header-gradient {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 280rpx;
	background: linear-gradient(180deg, rgba(45, 24, 16, 0.5) 0%, transparent 100%);
}

.header-actions {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	padding: 88rpx 32rpx 0;
	z-index: 10;
}

.action-btn {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10px);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.15);
}

.action-icon {
	font-size: 36rpx;
	color: #2D1810;
}

.image-overlay {
	position: absolute;
	bottom: 24rpx;
	left: 32rpx;
	z-index: 10;
}

.breadcrumb {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.breadcrumb-text {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.breadcrumb-sep {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.5);
}

.breadcrumb-current {
	font-size: 24rpx;
	color: #fff;
	font-weight: 500;
}

.scroll-content {
	padding: 0 32rpx;
	margin-top: -48rpx;
	position: relative;
	z-index: 10;
}

.title-card {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.08);
	border: 1rpx solid rgba(199, 91, 57, 0.08);
}

.title-header {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.tag {
	background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
	color: #fff;
	font-size: 22rpx;
	padding: 8rpx 20rpx;
	border-radius: 12rpx;
	font-weight: 500;
}

.rating-box {
	display: flex;
	align-items: center;
	gap: 8rpx;
	background: #FFF9E6;
	padding: 8rpx 16rpx;
	border-radius: 12rpx;
}

.rating-score {
	font-size: 28rpx;
	color: #FF9800;
	font-weight: 700;
}

.rating-stars {
	display: flex;
}

.star {
	font-size: 16rpx;
	color: #FF9800;
}

.main-title {
	font-size: 44rpx;
	color: #2D1810;
	font-weight: 700;

	line-height: 1.3;
	display: block;
	margin-bottom: 16rpx;
}

.location-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.location-pin {
	width: 40rpx;
	height: 40rpx;
	background: rgba(199, 91, 57, 0.1);
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.pin-icon {
	font-size: 20rpx;
	color: #C75B39;
}

.location-text {
	font-size: 26rpx;
	color: #8B7355;
	flex: 1;
}

.distance-text {
	font-size: 24rpx;
	color: #B8A590;
}

.stats-card {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.08);
	border: 1rpx solid rgba(199, 91, 57, 0.08);
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-value {
	font-size: 40rpx;
	color: #2D1810;
	font-weight: 700;

	margin-bottom: 4rpx;
}

.stat-label {
	font-size: 24rpx;
	color: #8B7355;
}

.stat-divider {
	width: 1rpx;
	height: 64rpx;
	background: #E8D5B5;
}

.price-card {
	background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 8rpx 24rpx rgba(199, 91, 57, 0.3);
}

.price-section {
	display: flex;
	flex-direction: column;
}

.price-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-bottom: 4rpx;
}

.price-row {
	display: flex;
	align-items: baseline;
}

.currency {
	font-size: 32rpx;
	color: #fff;
	font-weight: 500;
}

.current-price {
	font-size: 64rpx;
	color: #fff;
	font-weight: 700;

}

.original-price {
	font-size: 28rpx;
	color: rgba(255, 255, 255, 0.6);
	text-decoration: line-through;
	margin-left: 12rpx;
}

.discount-badge {
	background: rgba(255, 255, 255, 0.2);
	padding: 12rpx 24rpx;
	border-radius: 16rpx;
}

.discount-text {
	font-size: 28rpx;
	color: #fff;
	font-weight: 600;
}

.info-section {
	margin-bottom: 24rpx;
}

.section-title-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-bottom: 16rpx;
}

.section-indicator {
	width: 8rpx;
	height: 32rpx;
	background: linear-gradient(180deg, #C75B39 0%, #E8A090 100%);
	border-radius: 4rpx;
}

.section-title {
	font-size: 32rpx;
	color: #2D1810;
	font-weight: 600;

}

.section-more {
	font-size: 24rpx;
	color: #C75B39;
	margin-left: auto;
}

.description-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 28rpx;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
	border: 1rpx solid rgba(199, 91, 57, 0.06);
}

.description-text {
	font-size: 28rpx;
	color: #5D4E3C;
	line-height: 1.8;
}

.tips-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 8rpx 0;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
	border: 1rpx solid rgba(199, 91, 57, 0.06);
}

.tip-row {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 24rpx 28rpx;
}

.tip-icon-wrap {
	width: 56rpx;
	height: 56rpx;
	background: linear-gradient(135deg, #F5E6D3 0%, #E8D5B5 100%);
	border-radius: 14rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tip-icon {
	font-size: 28rpx;
	color: #C75B39;
}

.tip-content {
	flex: 1;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.tip-label {
	font-size: 28rpx;
	color: #8B7355;
}

.tip-value {
	font-size: 28rpx;
	color: #2D1810;
	font-weight: 500;
}

.tip-divider {
	height: 1rpx;
	background: #F0E6D8;
	margin: 0 28rpx;
}

.map-card {
	background: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
	border: 1rpx solid rgba(199, 91, 57, 0.06);
}

.map {
	width: 100%;
	height: 300rpx;
}

.map-info {
	padding: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.map-address {
	flex: 1;
}

.address-text {
	font-size: 26rpx;
	color: #5D4E3C;
}

.map-button {
	display: flex;
	align-items: center;
	gap: 8rpx;
	background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
	padding: 16rpx 28rpx;
	border-radius: 28rpx;
}

.map-button-text {
	font-size: 26rpx;
	color: #fff;
	font-weight: 500;
}

.map-arrow {
	font-size: 24rpx;
	color: #fff;
}

.reviews-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.review-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
	border: 1rpx solid rgba(199, 91, 57, 0.06);
}

.review-header {
	display: flex;
	gap: 16rpx;
	margin-bottom: 16rpx;
}

.review-avatar {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
}

.review-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.review-name {
	font-size: 28rpx;
	color: #2D1810;
	font-weight: 600;
	margin-bottom: 4rpx;
}

.review-meta {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.review-rating {
	font-size: 24rpx;
	color: #FF9800;
}

.review-date {
	font-size: 22rpx;
	color: #B8A590;
}

.review-content {
	font-size: 26rpx;
	color: #5D4E3C;
	line-height: 1.7;
	display: block;
	margin-bottom: 16rpx;
}

.review-images {
	display: flex;
	gap: 12rpx;
}

.review-image {
	width: 160rpx;
	height: 120rpx;
	border-radius: 12rpx;
}

.bottom-spacer {
	height: 160rpx;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 140rpx;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 32rpx 20px;
	box-shadow: 0 -4rpx 20rpx rgba(45, 24, 16, 0.08);
	z-index: 100;
}

.bottom-left {
	display: flex;
	gap: 40rpx;
}

.bottom-action {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
}

.bottom-icon {
	font-size: 36rpx;
	color: #8B7355;
}

.bottom-label {
	font-size: 22rpx;
	color: #8B7355;
}

.buy-button {
	flex: 1;
	height: 96rpx;
	background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
	border-radius: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 32rpx;
	box-shadow: 0 8rpx 24rpx rgba(199, 91, 57, 0.3);
}

.buy-button-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
}

.buy-button:active {
	transform: scale(0.98);
}
</style>
