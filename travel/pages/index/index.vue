<template>
	<view class="content">
		<view class="hero-section">
			<view class="hero-header">
				<view class="greeting">
					<text class="greeting-time">{{ timeOfDay }}</text>
					<text class="greeting-text">{{ greeting }}</text>
				</view>
				<view class="avatar-wrapper">
					<view class="avatar-ring">
						<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
					</view>
					<view class="status-dot"></view>
				</view>
			</view>

			<view class="location-card">
				<view class="location-left">
					<view class="compass-icon">
						<u-icon name="map-fill" color="#C75B39" size="20"></u-icon>
					</view>
					<view class="location-info">
						<text class="location-city">{{ cityName }}</text>
						<text class="location-district">{{ districtName }}</text>
					</view>
				</view>
				<view class="weather-chip">
					<u-icon :name="weatherIconName" color="#C75B39" size="16"></u-icon>
					<text class="weather-temp">{{ weatherTemp }}</text>
				</view>
			</view>

			<view class="search-bar">
				<u-search
					v-model="keyword"
					placeholder="搜索目的地、景点或主题"
					:showAction="false"
					bgColor="#FFFFFF"
					shape="round"
					:height="36"
					@search="onSearch"
					@change="onSearchInput"
				></u-search>
			</view>
		</view>

		<view class="discovery-scroll">
			<view class="section-label">
				<view class="label-line"></view>
				<text class="label-text">发现</text>
			</view>
			<scroll-view class="theme-scroll" scroll-x>
				<view class="theme-cards">
					<view class="theme-card theme-1" :class="{ selected: activeTheme === '文化之旅' }" @click="selectTheme('文化之旅')">
						<view class="theme-overlay"></view>
						<view class="theme-badge">UNESCO</view>
						<view class="theme-content">
							<text class="theme-name">文化之旅</text>
							<text class="theme-count">{{ themeCounts['文化之旅'] }}个目的地</text>
						</view>
						<view class="theme-trail">
							<text class="trail-dots">●●●</text>
						</view>
					</view>
					<view class="theme-card theme-2" :class="{ selected: activeTheme === '自然探秘' }" @click="selectTheme('自然探秘')">
						<view class="theme-overlay"></view>
						<view class="theme-badge">Nature</view>
						<view class="theme-content">
							<text class="theme-name">自然探秘</text>
							<text class="theme-count">{{ themeCounts['自然探秘'] }}个目的地</text>
						</view>
						<view class="theme-trail">
							<text class="trail-dots">●●●</text>
						</view>
					</view>
					<view class="theme-card theme-3" :class="{ selected: activeTheme === '周末逃离' }" @click="selectTheme('周末逃离')">
						<view class="theme-overlay"></view>
						<view class="theme-badge">Weekend</view>
						<view class="theme-content">
							<text class="theme-name">周末逃离</text>
							<text class="theme-count">{{ themeCounts['周末逃离'] }}个目的地</text>
						</view>
						<view class="theme-trail">
							<text class="trail-dots">●●●</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="nearby-section">
			<view class="section-header">
				<view class="section-title-group">
					<view class="stamp-icon">
						<text class="stamp-text">近</text>
					</view>
					<text class="section-title">附近的风景</text>
				</view>
				<view class="view-toggle">
					<u-subsection
						:list="['列表', '地图']"
						:current="viewMode === 'list' ? 0 : 1"
						activeColor="#C75B39"
						bgColor="#F5E6D3"
						:fontSize="12"
						mode="button"
						@change="onViewModeChange"
					></u-subsection>
				</view>
			</view>

			<view class="map-panel" v-if="viewMode === 'map'">
				<map class="nearby-map" :latitude="mapCenter.latitude" :longitude="mapCenter.longitude" :scale="11"
					:markers="mapMarkers" @markertap="onMarkerTap"></map>
			</view>

			<view class="empty-filter" v-if="!isLoading && flowList.length === 0">
				<u-empty mode="search" text="没有找到相关目的地" icon-color="#C75B39"></u-empty>
			</view>

			<view class="spots-list" v-if="viewMode === 'list'">
				<view class="spot-card" v-for="(item, index) in flowList" :key="item.id" @click="goToDetail(item)">
					<view class="spot-image-wrapper">
						<image :src="item.img" mode="aspectFill" class="spot-image"></image>
						<view class="distance-badge">
							<text class="distance-value">{{ item.distance || '1.8km' }}</text>
						</view>
					</view>
					<view class="spot-details">
						<view class="spot-header">
							<text class="spot-title">{{ item.title }}</text>
							<view class="rating-badge">
								<u-icon name="star-fill" color="#C75B39" size="12"></u-icon>
								<text class="rating-value">{{ item.rating || '4.8' }}</text>
							</view>
						</view>
						<view class="spot-meta">
							<view class="meta-item">
								<u-icon name="map" color="#8B7355" size="13"></u-icon>
								<text class="meta-text">{{ item.location || '北京市朝阳区' }}</text>
							</view>
						</view>
						<view class="spot-tags">
							<u-tag v-if="index % 2 === 0" text="热门推荐" size="mini" bgColor="#F8E8E2" color="#C75B39" borderColor="#F0D0C4"></u-tag>
							<u-tag v-if="index % 3 === 0" text="5A景区" size="mini" bgColor="#EEF4F4" color="#5D8A8E" borderColor="#D5E4E5"></u-tag>
							<u-tag v-if="index % 4 === 0" text="亲子首选" size="mini" bgColor="#FFF3E0" color="#E65100" borderColor="#FFE0B2"></u-tag>
						</view>
						<view class="spot-footer">
							<view class="price-group">
								<text class="price-currency">¥</text>
								<text class="price-value">{{ item.price || 299 }}</text>
								<text class="price-unit">/人</text>
							</view>
							<view class="action-buttons">
								<view class="action-btn plan-btn" @click.stop="planRoute(item)">
									<u-icon name="plus-circle-fill" color="#FFFFFF" size="16"></u-icon>
									<text class="action-text">规划</text>
								</view>
								<view class="action-btn fav-btn" :class="{ active: isFavorite(item) }"
									@click.stop="toggleFavorite(item)">
									<u-icon :name="isFavorite(item) ? 'heart-fill' : 'heart'" :color="isFavorite(item) ? '#C75B39' : '#8B7355'" size="18"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="loading-indicator" v-if="isLoading">
			<u-loading-icon mode="circle" color="#C75B39"></u-loading-icon>
			<text class="loading-text">加载中...</text>
		</view>

		<u-loadmore v-if="!isLoading && flowList.length > 0" :status="hasMore ? 'loadmore' : 'nomore'" color="#8B7355" line></u-loadmore>

		<view class="bottom-spacer"></view>
		<custom-tabbar current="home"></custom-tabbar>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app'
import { getHomeList } from '../../api/api.js'
import { getWeather, reverseGeocode } from '../../api/backend-api.js'
import { getThemeCount } from '../../utils/catalog.js'
import { getFavorites, normalizeSpot, saveFavorites } from '../../utils/user-store.js'
import { TripManager } from '../../utils/trip-manager.js'

const PAGE_SIZE = 10

const keyword = ref('')
const activeTheme = ref('')
const viewMode = ref('list')
const cityName = ref('北京市')
const districtName = ref('朝阳区')
const weatherTemp = ref('24°C')
const weatherIconName = ref('star-fill')
const flowList = ref([])
const favorites = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const hasMore = computed(() => currentPage.value <= totalPages.value)
const themeCounts = {
	文化之旅: getThemeCount('文化之旅'),
	自然探秘: getThemeCount('自然探秘'),
	周末逃离: getThemeCount('周末逃离')
}
const mapCenter = computed(() => ({
	latitude: flowList.value[0]?.latitude || 39.9042,
	longitude: flowList.value[0]?.longitude || 116.4074
}))
const mapMarkers = computed(() => flowList.value.filter((item) => item.latitude && item.longitude).map((item, index) => ({
	id: Number(item.id) || index + 1,
	latitude: item.latitude,
	longitude: item.longitude,
	title: item.title,
	width: 28,
	height: 28
})))

let searchTimer = null

const timeOfDay = computed(() => {
	const hour = new Date().getHours()
	if (hour < 6) return '凌晨'
	if (hour < 9) return '清晨'
	if (hour < 12) return '上午'
	if (hour < 14) return '中午'
	if (hour < 18) return '下午'
	if (hour < 22) return '傍晚'
	return '夜晚'
})

const greeting = computed(() => {
	const hour = new Date().getHours()
	if (hour < 6) return '夜深了，注意休息'
	if (hour < 9) return '早安，今天去哪探索？'
	if (hour < 12) return '上午好，旅途开始'
	if (hour < 14) return '午后时光，适合出发'
	if (hour < 18) return '下午好，风景正当时'
	if (hour < 22) return '傍晚时分，华灯初上'
	return '夜幕降临，静享时光'
})

const placeholderImages = [
	'https://picsum.photos/seed/spot1/400/300',
	'https://picsum.photos/seed/spot2/400/300',
	'https://picsum.photos/seed/spot3/400/300',
	'https://picsum.photos/seed/spot4/400/300'
]

onLoad(() => {
	loadFavorites()
	loadMore()
	locateAndWeather()
})

onShow(() => {
	uni.hideTabBar({ fail() {} })
	loadFavorites()
})

onReachBottom(() => {
	if (viewMode.value === 'list') loadMore()
})

function mapListItem(item, index) {
	const card = normalizeSpot({
		id: item.id,
		title: item.title,
		image: item.images?.[0] || item.img || item.image,
		location: item.location,
		price: item.price,
		originalPrice: item.originalPrice,
		rating: item.rating,
		sold: item.sold,
		distance: item.distance,
		latitude: item.location?.latitude || item.latitude,
		longitude: item.location?.longitude || item.longitude
	})
	return {
		...card,
		tag: item.tags?.[0] || item.tag || card.tag,
		img: card.image || placeholderImages[index % placeholderImages.length]
	}
}

async function loadMore() {
	if (isLoading.value || !hasMore.value) return

	isLoading.value = true
	try {
		const res = await getHomeList(currentPage.value, PAGE_SIZE, {
			keyword: keyword.value,
			theme: activeTheme.value
		})
		if (res.code === 1 && res.data && res.data.list) {
			const newItems = res.data.list.map(mapListItem)
			flowList.value = currentPage.value === 1 ? newItems : [...flowList.value, ...newItems]
			totalPages.value = res.data.totalPages || 1
			currentPage.value++
		}
	} catch (e) {
		console.error(e)
	} finally {
		isLoading.value = false
	}
}

function resetAndLoad() {
	currentPage.value = 1
	totalPages.value = 1
	flowList.value = []
	loadMore()
}

function onSearch() {
	resetAndLoad()
}

function onSearchInput() {
	clearTimeout(searchTimer)
	searchTimer = setTimeout(() => resetAndLoad(), 320)
}

function loadFavorites() {
	favorites.value = getFavorites()
}

function isFavorite(item) {
	return favorites.value.some((fav) => String(fav.id) === String(item.id))
}

function toggleFavorite(item) {
	const index = favorites.value.findIndex((fav) => String(fav.id) === String(item.id))
	if (index > -1) {
		favorites.value.splice(index, 1)
		uni.showToast({ title: '已取消收藏', icon: 'none' })
	} else {
		favorites.value.unshift(normalizeSpot(item))
		uni.showToast({ title: '已收藏', icon: 'success' })
	}
	saveFavorites(favorites.value)
}

function weatherIconOf(text) {
	if (!text) return 'star-fill'
	if (text.includes('雨') || text.includes('雪')) return 'minus-circle-fill'
	if (text.includes('云') || text.includes('阴') || text.includes('雾')) return 'more-circle-fill'
	return 'star-fill'
}

function onViewModeChange(index) {
	viewMode.value = index === 1 ? 'map' : 'list'
}

async function locateAndWeather() {
	const settings = uni.getStorageSync('user_settings') || {}
	if (settings.locationEnabled === false) {
		loadWeather(cityName.value)
		return
	}
	uni.getLocation({
		type: 'gcj02',
		success: async (res) => {
			try {
				const geo = await reverseGeocode(res.longitude, res.latitude)
				const data = geo?.data || {}
				if (data.city) cityName.value = data.city
				if (data.district) districtName.value = data.district
				loadWeather(data.city || cityName.value)
			} catch {
				loadWeather(cityName.value)
			}
		},
		fail: () => loadWeather(cityName.value)
	})
}

async function loadWeather(city) {
	try {
		const res = await getWeather(String(city).replace(/市$/, ''))
		const first = res?.data?.[0]
		if (first) {
			weatherTemp.value = `${first.day_temp}°C`
			weatherIconName.value = weatherIconOf(first.day_weather)
		}
	} catch {
		weatherTemp.value = '24°C'
	}
}

function goToDetail(item) {
	uni.navigateTo({ url: `/pages/detail/detail?id=${item.id}` })
}

function planRoute(item) {
	const result = TripManager.addSpot(item)
	if (result.success) {
		uni.showToast({ title: '已添加到行程', icon: 'success' })
		setTimeout(() => {
			uni.switchTab({ url: '/pages/plan/plan' })
		}, 1000)
	} else {
		uni.showToast({ title: result.msg, icon: 'none' })
	}
}

function selectTheme(theme) {
	activeTheme.value = activeTheme.value === theme ? '' : theme
	resetAndLoad()
}

function onMarkerTap(e) {
	const markerId = e.detail?.markerId
	const item = flowList.value.find((spot) => Number(spot.id) === Number(markerId))
	if (item) goToDetail(item)
}
</script>

<style>
page {
	background: #FDF8F3;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.content {
	min-height: 100vh;
	background: #FDF8F3;
	padding-bottom: 24rpx;
}

.hero-section {
	padding: 88rpx 32rpx 40rpx;
	background: linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 100%);
	position: relative;
}

.hero-section::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 200rpx;
	background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4C4B0' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	opacity: 0.5;
}

.hero-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 32rpx;
	position: relative;
	z-index: 1;
}

.greeting {
	display: flex;
	flex-direction: column;
}

.greeting-time {
	font-size: 24rpx;
	color: #8B7355;
	font-weight: 400;
	margin-bottom: 4rpx;
}

.greeting-text {
	font-size: 40rpx;
	color: #2D1810;
	font-weight: 600;
}

.avatar-wrapper {
	position: relative;
}

.avatar-ring {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	border: 3rpx solid #C75B39;
	padding: 4rpx;
	background: #fff;
}

.avatar {
	width: 100%;
	height: 100%;
	border-radius: 50%;
}

.status-dot {
	width: 20rpx;
	height: 20rpx;
	background: #4CAF50;
	border-radius: 50%;
	position: absolute;
	bottom: 4rpx;
	right: 4rpx;
	border: 3rpx solid #FDF8F3;
}

.location-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.08);
	border: 1rpx solid rgba(199, 91, 57, 0.1);
	position: relative;
	z-index: 1;
}

.location-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.compass-icon {
	width: 64rpx;
	height: 64rpx;
	background: #F8E8E2;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.compass-needle {
	font-size: 32rpx;
	color: #fff;
	transform: rotate(45deg);
}

.location-info {
	display: flex;
	flex-direction: column;
}

.location-city {
	font-size: 32rpx;
	font-weight: 600;
	color: #2D1810;

}

.location-district {
	font-size: 24rpx;
	color: #8B7355;
	margin-top: 4rpx;
}

.weather-chip {
	display: flex;
	align-items: center;
	gap: 8rpx;
	background: #FFF9E6;
	padding: 12rpx 20rpx;
	border-radius: 24rpx;
	border: 1rpx solid #E8D5B5;
}

.weather-icon {
	font-size: 28rpx;
}

.weather-temp {
	font-size: 28rpx;
	color: #2D1810;
	font-weight: 500;
}

.search-bar {
	position: relative;
	z-index: 1;
	padding: 4rpx 0;
}

.search-inner {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 40rpx;
	padding: 24rpx 32rpx;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.08);
	border: 1rpx solid rgba(199, 91, 57, 0.1);
}

.search-icon {
	font-size: 32rpx;
	color: #8B7355;
	margin-right: 16rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #2D1810;
}

.search-placeholder {
	color: #B8A590;
}

.discovery-scroll {
	padding: 0 32rpx;
	margin-bottom: 40rpx;
}

.section-label {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 24rpx;
}

.label-line {
	width: 8rpx;
	height: 32rpx;
	background: linear-gradient(180deg, #C75B39 0%, #E8A090 100%);
	border-radius: 4rpx;
}

.label-text {
	font-size: 28rpx;
	color: #8B7355;
	font-weight: 500;
	letter-spacing: 4rpx;
}

.theme-scroll {
	width: 100%;
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
}

.theme-cards {
	display: flex;
	gap: 24rpx;
	padding-bottom: 16rpx;
}

.theme-card {
	position: relative;
	width: 320rpx;
	height: 200rpx;
	border-radius: 24rpx;
	overflow: hidden;
	flex-shrink: 0;
}

.theme-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(180deg, rgba(45, 24, 16, 0.1) 0%, rgba(45, 24, 16, 0.7) 100%);
	z-index: 1;
}

.theme-badge {
	position: absolute;
	top: 16rpx;
	left: 16rpx;
	background: rgba(255, 255, 255, 0.95);
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
	z-index: 2;
}

.stamp-text {
	font-size: 20rpx;
	color: #C75B39;
	font-weight: 700;

}

.theme-content {
	position: absolute;
	bottom: 20rpx;
	left: 20rpx;
	z-index: 2;
}

.theme-name {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;

	display: block;
	margin-bottom: 4rpx;
}

.theme-count {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.8);
}

.theme-trail {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	z-index: 2;
}

.trail-dots {
	font-size: 16rpx;
	color: rgba(255, 255, 255, 0.6);
	letter-spacing: 4rpx;
}

.theme-1 .theme-overlay {
	background: linear-gradient(180deg, rgba(45, 24, 16, 0.2) 0%, rgba(123, 163, 168, 0.8) 100%);
}

.theme-2 .theme-overlay {
	background: linear-gradient(180deg, rgba(45, 24, 16, 0.2) 0%, rgba(85, 139, 47, 0.8) 100%);
}

.theme-3 .theme-overlay {
	background: linear-gradient(180deg, rgba(45, 24, 16, 0.2) 0%, rgba(255, 152, 0, 0.7) 100%);
}

.theme-card.selected {
	box-shadow: 0 0 0 4rpx #C75B39;
}

.map-panel {
	margin-bottom: 24rpx;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
}

.nearby-map {
	width: 100%;
	height: 420rpx;
}

.empty-filter {
	padding: 40rpx 0 20rpx;
	text-align: center;
}

.empty-filter-text {
	font-size: 26rpx;
	color: #8B7355;
}

.nearby-section {
	padding: 0 32rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.section-title-group {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.stamp-icon {
	width: 40rpx;
	height: 40rpx;
	background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transform: rotate(-5deg);
}

.stamp-icon .stamp-text {
	font-size: 18rpx;
	color: #fff;
}

.section-title {
	font-size: 36rpx;
	color: #2D1810;
	font-weight: 700;

}

.view-toggle {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.toggle-option {
	font-size: 26rpx;
	color: #B8A590;
}

.toggle-option.active {
	color: #C75B39;
	font-weight: 600;
}

.toggle-sep {
	color: #E8D5B5;
}

.spots-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.spot-card {
	background: #fff;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
	border: 1rpx solid rgba(199, 91, 57, 0.08);
}

.spot-image-wrapper {
	position: relative;
	height: 200rpx;
}

.spot-image {
	width: 100%;
	height: 100%;
}

.distance-badge {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	background: rgba(45, 24, 16, 0.75);
	backdrop-filter: blur(10px);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.distance-value {
	font-size: 22rpx;
	color: #fff;
}

.spot-details {
	padding: 24rpx;
}

.spot-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12rpx;
}

.spot-title {
	font-size: 32rpx;
	color: #2D1810;
	font-weight: 600;

	flex: 1;
	margin-right: 16rpx;
}

.rating-badge {
	display: flex;
	align-items: center;
	gap: 4rpx;
	background: #FFF9E6;
	padding: 6rpx 12rpx;
	border-radius: 8rpx;
}

.rating-star {
	font-size: 20rpx;
	color: #FF9800;
}

.rating-value {
	font-size: 24rpx;
	color: #2D1810;
	font-weight: 600;
}

.spot-meta {
	margin-bottom: 16rpx;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.meta-icon {
	font-size: 24rpx;
	color: #8B7355;
}

.meta-text {
	font-size: 24rpx;
	color: #8B7355;
}

.spot-tags {
	display: flex;
	gap: 12rpx;
	margin-bottom: 20rpx;
}

.tag {
	background: rgba(199, 91, 57, 0.1);
	color: #C75B39;
	font-size: 22rpx;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
}

.tag-secondary {
	background: rgba(123, 163, 168, 0.15);
	color: #5D8A8E;
}

.tag-tertiary {
	background: rgba(255, 152, 0, 0.1);
	color: #E65100;
}

.spot-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 20rpx;
	border-top: 1rpx dashed #E8D5B5;
}

.price-group {
	display: flex;
	align-items: baseline;
}

.price-currency {
	font-size: 24rpx;
	color: #C75B39;
	font-weight: 500;
}

.price-value {
	font-size: 40rpx;
	color: #C75B39;
	font-weight: 700;

}

.price-unit {
	font-size: 22rpx;
	color: #8B7355;
	margin-left: 4rpx;
}

.action-buttons {
	display: flex;
	gap: 16rpx;
}

.action-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6rpx;
	padding: 12rpx 20rpx;
	border-radius: 12rpx;
	background: #F5E6D3;
	transition: all 0.2s ease;
}

.plan-btn {
	background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
}

.plan-btn .action-icon,
.plan-btn .action-text {
	color: #fff;
	font-size: 24rpx;
}

.fav-btn .action-icon {
	font-size: 28rpx;
	color: #8B7355;
}

.fav-btn.active .action-icon {
	color: #C75B39;
}

.action-btn:active {
	transform: scale(0.95);
}

.loading-indicator {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
}

.loading-dots {
	display: flex;
	gap: 12rpx;
}

.dot {
	width: 16rpx;
	height: 16rpx;
	background: #C75B39;
	border-radius: 50%;
	animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
	animation-delay: -0.32s;
}

.dot:nth-child(2) {
	animation-delay: -0.16s;
}

@keyframes bounce {

	0%,
	80%,
	100% {
		transform: scale(0);
	}

	40% {
		transform: scale(1);
	}
}

.loading-text {
	margin-top: 16rpx;
	font-size: 24rpx;
	color: #8B7355;
}

.no-more {
	display: flex;
	justify-content: center;
	padding: 40rpx 0;
}

.no-more-text {
	font-size: 24rpx;
	color: #B8A590;
}

.bottom-spacer {
	height: 40rpx;
}
</style>
