<template>
	<view class="content">
		<view class="header">
			<view class="header-content">
				<view class="title-group">
					<text class="page-title">旅行规划</text>
					<text class="page-subtitle">AI智能行程助手</text>
				</view>
			</view>
		</view>

		<view class="basket-section" v-if="!tripPlan && !isLoading && savedSpots.length">
			<view class="basket-card">
				<view class="basket-head">
					<text class="basket-title">行程篮 · {{ savedSpots.length }}</text>
					<text class="basket-clear" @click="clearSavedSpots">清空</text>
				</view>
				<view class="basket-item" v-for="spot in savedSpots" :key="spot.id">
					<view class="basket-main" @click="openSavedSpot(spot)">
						<text class="basket-name">{{ spot.name }}</text>
						<text class="basket-addr">{{ spot.address }}</text>
					</view>
					<text class="basket-remove" @click="removeSavedSpot(spot)">移除</text>
				</view>
			</view>
		</view>

		<!-- ========== 表单 ========== -->
		<view class="form-section" v-if="!tripPlan && !isLoading">
			<view class="form-card">
				<view class="form-group">
					<view class="form-label">
						<u-icon name="map-fill" color="#C75B39" size="16"></u-icon>
						<text class="label-text">目的地城市</text>
					</view>
					<view class="form-input city-picker" @click="openCityPicker">
						<text class="city-value" v-if="formData.city">{{ formData.city }}</text>
						<text class="city-placeholder" v-else>请选择或搜索目的地城市</text>
						<u-icon name="arrow-right" color="#B8A590" size="14"></u-icon>
					</view>
					<view class="hot-cities">
						<view class="hot-city" :class="{ active: formData.city === city }"
							v-for="city in hotCities" :key="city" @click="selectCity(city)">
							<text class="hot-city-text">{{ city }}</text>
						</view>
					</view>
				</view>

				<view class="form-group">
					<view class="form-label">
						<u-icon name="calendar-fill" color="#C75B39" size="16"></u-icon>
						<text class="label-text">出行日期</text>
					</view>
					<view class="date-range">
						<picker mode="date" :value="formData.start_date" @change="onStartDateChange">
							<view class="date-item">
								<text class="date-label">出发</text>
								<text class="date-value">{{ formData.start_date || '选择日期' }}</text>
							</view>
						</picker>
						<text class="date-separator">→</text>
						<picker mode="date" :value="formData.end_date" @change="onEndDateChange">
							<view class="date-item">
								<text class="date-label">返回</text>
								<text class="date-value">{{ formData.end_date || '选择日期' }}</text>
							</view>
						</picker>
					</view>
					<text class="days-hint" v-if="formData.travel_days > 0">共 {{ formData.travel_days }} 天行程</text>
				</view>

				<view class="form-group">
					<view class="form-label">
						<u-icon name="car-fill" color="#C75B39" size="16"></u-icon>
						<text class="label-text">交通方式</text>
					</view>
					<view class="option-group">
						<view class="option-item" :class="{ active: formData.transportation === '公共交通' }"
							@click="formData.transportation = '公共交通'">
							<u-icon name="car" color="#8B7355" size="18"></u-icon>
							<text class="option-text">公共交通</text>
						</view>
						<view class="option-item" :class="{ active: formData.transportation === '自驾' }"
							@click="formData.transportation = '自驾'">
							<u-icon name="car-fill" color="#8B7355" size="18"></u-icon>
							<text class="option-text">自驾</text>
						</view>
						<view class="option-item" :class="{ active: formData.transportation === '步行' }"
							@click="formData.transportation = '步行'">
							<u-icon name="man" color="#8B7355" size="18"></u-icon>
							<text class="option-text">步行</text>
						</view>
					</view>
				</view>

				<view class="form-group">
					<view class="form-label">
						<u-icon name="home-fill" color="#C75B39" size="16"></u-icon>
						<text class="label-text">住宿偏好</text>
					</view>
					<view class="option-group">
						<view class="option-item" :class="{ active: formData.accommodation === '经济型酒店' }"
							@click="formData.accommodation = '经济型酒店'">
							<text class="option-text">经济型</text>
						</view>
						<view class="option-item" :class="{ active: formData.accommodation === '舒适型酒店' }"
							@click="formData.accommodation = '舒适型酒店'">
							<text class="option-text">舒适型</text>
						</view>
						<view class="option-item" :class="{ active: formData.accommodation === '豪华型酒店' }"
							@click="formData.accommodation = '豪华型酒店'">
							<text class="option-text">豪华型</text>
						</view>
					</view>
				</view>

				<view class="form-group">
					<view class="form-label">
						<u-icon name="heart-fill" color="#C75B39" size="16"></u-icon>
						<text class="label-text">旅行偏好（可多选）</text>
					</view>
					<view class="tags-group">
						<view class="tag-item" :class="{ active: formData.preferences.includes(tag) }"
							v-for="tag in preferenceTags" :key="tag" @click="togglePreference(tag)">
							<text class="tag-text">{{ tag }}</text>
						</view>
					</view>
				</view>

				<view class="form-group">
					<view class="form-label">
						<u-icon name="edit-pen-fill" color="#C75B39" size="16"></u-icon>
						<text class="label-text">额外要求（可选）</text>
					</view>
					<textarea class="form-textarea" v-model="formData.free_text_input"
						placeholder="例如：希望多安排博物馆，避开爬山路线..."
						placeholder-class="textarea-placeholder" />
				</view>

				<u-button type="primary" shape="circle" text="开始规划" :customStyle="{ height: '48px', fontSize: '16px' }" @click="submitPlan"></u-button>
			</view>
		</view>

		<!-- ========== 加载态 ========== -->
		<view class="loading-section" v-if="isLoading">
			<view class="loading-content">
				<view class="loading-animation">
					<view class="loading-ring"></view>
					<view class="loading-dot dot-1"></view>
					<view class="loading-dot dot-2"></view>
					<view class="loading-dot dot-3"></view>
				</view>
				<text class="loading-text">AI正在为您规划行程...</text>
				<text class="loading-step">{{ loadingSteps[currentStep] }}</text>
				<!-- 步骤进度条 -->
				<view class="loading-progress">
					<view class="progress-dot" :class="{ active: currentStep >= 0 }"></view>
					<view class="progress-line" :class="{ active: currentStep >= 1 }"></view>
					<view class="progress-dot" :class="{ active: currentStep >= 1 }"></view>
					<view class="progress-line" :class="{ active: currentStep >= 2 }"></view>
					<view class="progress-dot" :class="{ active: currentStep >= 2 }"></view>
					<view class="progress-line" :class="{ active: currentStep >= 3 }"></view>
					<view class="progress-dot" :class="{ active: currentStep >= 3 }"></view>
				</view>
				<text class="loading-hint">预计需要1-3分钟，请耐心等待</text>
			</view>
		</view>

		<!-- ========== 结果展示 ========== -->
		<trip-plan-display v-if="tripPlan && !isLoading" :trip-plan="tripPlan" @back="resetForm"
			@navigate-to="navigateToAttraction" />

		<!-- ========== 底部操作栏 ========== -->
		<view class="bottom-action" v-if="tripPlan && !isLoading">
			<view class="reset-btn" @click="resetForm">
				<text class="reset-text">重新规划</text>
			</view>
		</view>

		<view class="city-mask" v-if="showCityPicker" @click="closeCityPicker">
			<view class="city-sheet" @click.stop>
				<view class="city-sheet-header">
					<text class="city-sheet-title">选择城市</text>
					<text class="city-sheet-close" @click="closeCityPicker">关闭</text>
				</view>
				<view class="city-search">
					<input class="city-search-input" :value="cityKeyword" confirm-type="search"
						placeholder="搜索城市，如杭州、成都" placeholder-class="city-search-placeholder"
						@input="onCitySearchInput" />
				</view>
				<scroll-view class="city-list" scroll-y>
					<view class="city-empty" v-if="filteredCities.length === 0">
						<text class="city-empty-text">没有匹配的城市，可直接使用搜索词</text>
						<view class="city-row" v-if="cityKeyword.trim()" @click="selectCity(cityKeyword.trim())">
							<text class="city-row-text">使用「{{ cityKeyword.trim() }}」</text>
						</view>
					</view>
					<view class="city-row" v-for="city in filteredCities" :key="city"
						:class="{ active: formData.city === city }" @click="selectCity(city)">
						<text class="city-row-text">{{ city }}</text>
					</view>
				</scroll-view>
			</view>
		</view>
		<custom-tabbar current="plan"></custom-tabbar>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { planTrip } from '../../api/backend-api.js'
import { TripManager } from '../../utils/trip-manager.js'
import TripPlanDisplay from '../../components/trip-plan-display.vue'

const preferenceTags = ['历史文化', '美食', '自然风光', '购物', '拍照打卡', '亲子', '博物馆', '古镇', '登山', '海滨']
const hotCities = ['北京', '上海', '杭州', '成都', '西安', '广州', '南京', '重庆', '苏州', '厦门']
const cityOptions = [
	'北京', '上海', '天津', '重庆',
	'杭州', '宁波', '温州', '绍兴', '嘉兴', '湖州', '金华', '舟山',
	'南京', '苏州', '无锡', '扬州', '常州', '南通', '镇江', '徐州',
	'广州', '深圳', '珠海', '佛山', '中山', '东莞', '惠州', '汕头',
	'成都', '都江堰', '乐山', '宜宾', '泸州', '南充',
	'西安', '咸阳', '宝鸡', '延安',
	'武汉', '宜昌', '襄阳',
	'长沙', '张家界', '岳阳', '凤凰',
	'厦门', '福州', '泉州', '漳州', '武夷山',
	'青岛', '济南', '烟台', '威海', '泰安', '曲阜',
	'昆明', '大理', '丽江', '西双版纳', '香格里拉',
	'桂林', '南宁', '北海', '阳朔',
	'贵阳', '黄果树', '荔波',
	'拉萨', '林芝', '日喀则',
	'乌鲁木齐', '喀什', '伊犁',
	'兰州', '敦煌', '嘉峪关', '张掖',
	'银川', '西宁', '青海湖',
	'哈尔滨', '长春', '沈阳', '大连',
	'合肥', '黄山', '芜湖',
	'南昌', '景德镇', '庐山',
	'郑州', '洛阳', '开封',
	'石家庄', '承德', '秦皇岛',
	'太原', '大同', '平遥',
	'呼和浩特', '海口', '三亚', '香港', '澳门', '台北'
]

const loadingSteps = ['搜索景点信息...', '查询天气数据...', '推荐住宿酒店...', '智能生成行程...']
const currentStep = ref(0)
let stepTimer = null

const formData = ref({
	city: '',
	start_date: '',
	end_date: '',
	travel_days: 1,
	transportation: '公共交通',
	accommodation: '经济型酒店',
	preferences: [],
	free_text_input: ''
})

const showCityPicker = ref(false)
const cityKeyword = ref('')
const filteredCities = computed(() => {
	const kw = cityKeyword.value.trim()
	if (!kw) return cityOptions
	return cityOptions.filter((city) => city.includes(kw))
})

const isLoading = ref(false)
const tripPlan = ref(null)
const savedSpots = ref([])

onShow(() => {
	uni.hideTabBar({ fail() {} })
	savedSpots.value = TripManager.getPlan()
})

onLoad(() => {
	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(today.getDate() + 1)

	formData.value.start_date = formatDate(today)
	formData.value.end_date = formatDate(tomorrow)
	updateDays()
})

function formatDate(date) {
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

function updateDays() {
	if (formData.value.start_date && formData.value.end_date) {
		const start = new Date(formData.value.start_date)
		const end = new Date(formData.value.end_date)
		const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
		formData.value.travel_days = diff > 0 ? diff : 1
	}
}

function onStartDateChange(e) {
	formData.value.start_date = e.detail.value
	updateDays()
}

function onEndDateChange(e) {
	formData.value.end_date = e.detail.value
	updateDays()
}

function openCityPicker() {
	cityKeyword.value = ''
	showCityPicker.value = true
}

function closeCityPicker() {
	showCityPicker.value = false
}

function onCitySearchInput(e) {
	cityKeyword.value = (e.detail && e.detail.value) || (e.target && e.target.value) || ''
}

function selectCity(city) {
	formData.value.city = city
	showCityPicker.value = false
	cityKeyword.value = ''
}

function togglePreference(tag) {
	const index = formData.value.preferences.indexOf(tag)
	if (index > -1) {
		formData.value.preferences.splice(index, 1)
	} else {
		formData.value.preferences.push(tag)
	}
}

function startStepAnimation() {
	currentStep.value = 0
	stepTimer = setInterval(() => {
		if (currentStep.value < loadingSteps.length - 1) {
			currentStep.value++
		}
	}, 30000) // 每30秒推进一个步骤
}

function stopStepAnimation() {
	if (stepTimer) {
		clearInterval(stepTimer)
		stepTimer = null
	}
	currentStep.value = 0
}

async function submitPlan() {
	if (!formData.value.city.trim()) {
		uni.showToast({ title: '请输入目的地城市', icon: 'none' })
		return
	}

	if (!formData.value.start_date || !formData.value.end_date) {
		uni.showToast({ title: '请选择出行日期', icon: 'none' })
		return
	}

	isLoading.value = true
	startStepAnimation()

	try {
		const request = {
			city: formData.value.city.trim(),
			start_date: formData.value.start_date,
			end_date: formData.value.end_date,
			travel_days: formData.value.travel_days,
			transportation: formData.value.transportation,
			accommodation: formData.value.accommodation,
			preferences: [...formData.value.preferences],
			free_text_input: [
				formData.value.free_text_input || '',
				savedSpots.value.length
					? `行程篮已选：${savedSpots.value.map((s) => s.name).join('、')}`
					: ''
			].filter(Boolean).join('；')
		}

		console.log('发送请求:', JSON.stringify(request))

		const response = await planTrip(request)

		console.log('响应:', response)

		if (response.success && response.data) {
			tripPlan.value = response.data
			uni.showToast({ title: '规划完成', icon: 'success' })
		} else {
			throw new Error(response.message || '规划失败')
		}
	} catch (error) {
		console.error('规划失败:', error)
		uni.showModal({
			title: '规划失败',
			content: error.msg || error.message || '请检查后端服务是否启动，或稍后重试',
			showCancel: false
		})
	} finally {
		isLoading.value = false
		stopStepAnimation()
	}
}

function resetForm() {
	tripPlan.value = null
	formData.value = {
		city: '',
		start_date: '',
		end_date: '',
		travel_days: 1,
		transportation: '公共交通',
		accommodation: '经济型酒店',
		preferences: [],
		free_text_input: ''
	}

	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(today.getDate() + 1)
	formData.value.start_date = formatDate(today)
	formData.value.end_date = formatDate(tomorrow)
	formData.value.travel_days = 2
}

function removeSavedSpot(spot) {
	TripManager.removeSpot(spot.id)
	savedSpots.value = TripManager.getPlan()
}

function clearSavedSpots() {
	TripManager.clearPlan()
	savedSpots.value = []
}

function openSavedSpot(spot) {
	if (spot.id) {
		uni.navigateTo({ url: `/pages/detail/detail?id=${spot.id}` })
	}
}

function navigateToAttraction(attraction) {
	if (attraction.location) {
		uni.openLocation({
			latitude: attraction.location.latitude,
			longitude: attraction.location.longitude,
			name: attraction.name,
			address: attraction.address,
			scale: 18,
			fail: () => {
				// #ifdef H5
				const url = `https://uri.amap.com/marker?position=${attraction.location.longitude},${attraction.location.latitude}&name=${encodeURIComponent(attraction.name || '')}`
				window.open(url, '_blank')
				// #endif
			}
		})
	} else {
		uni.showToast({ title: '暂无位置信息', icon: 'none' })
	}
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
	padding-bottom: 40rpx;
}

/* ========== 头部 ========== */
.header {
	padding: 88rpx 32rpx 24rpx;
	background: linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 100%);
}

.header-content {
	display: flex;
	align-items: center;
}

.title-group {
	display: flex;
	flex-direction: column;
}

.page-title {
	font-size: 40rpx;
	color: #2D1810;
	font-weight: 700;
}

.page-subtitle {
	font-size: 22rpx;
	color: #8B7355;
	margin-top: 4rpx;
}

/* ========== 表单 ========== */
.basket-section {
	padding: 0 32rpx 20rpx;
}

.basket-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(45, 24, 16, 0.06);
}

.basket-head {
	display: flex;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.basket-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #2D1810;
}

.basket-clear, .basket-remove {
	font-size: 24rpx;
	color: #C75B39;
}

.basket-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 0;
	border-top: 1rpx solid #F0E6D8;
}

.basket-main {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.basket-name {
	font-size: 28rpx;
	color: #2D1810;
	font-weight: 600;
}

.basket-addr {
	font-size: 22rpx;
	color: #8B7355;
}

.form-section {
	padding: 0 32rpx;
}

.form-card {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 4rpx 16rpx rgba(45, 24, 16, 0.06);
}

.form-group {
	margin-bottom: 32rpx;
}

.form-label {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 16rpx;
}

.label-icon {
	font-size: 28rpx;
}

.label-text {
	font-size: 28rpx;
	color: #2D1810;
	font-weight: 600;
}

.form-input {
	width: 100%;
	padding: 20rpx 24rpx;
	background: #FDF8F3;
	border-radius: 16rpx;
	font-size: 28rpx;
	color: #2D1810;
	box-sizing: border-box;
}

.city-picker {
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 88rpx;
}

.city-value {
	font-size: 28rpx;
	color: #2D1810;
}

.city-placeholder {
	font-size: 28rpx;
	color: #B8A590;
}

.city-arrow {
	font-size: 36rpx;
	color: #C75B39;
	line-height: 1;
}

.hot-cities {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-top: 16rpx;
}

.hot-city {
	padding: 10rpx 20rpx;
	background: #FDF8F3;
	border-radius: 24rpx;
	border: 2rpx solid transparent;
}

.hot-city.active {
	background: rgba(199, 91, 57, 0.1);
	border-color: #C75B39;
}

.hot-city-text {
	font-size: 24rpx;
	color: #5D4E3C;
}

.hot-city.active .hot-city-text {
	color: #C75B39;
	font-weight: 600;
}

.city-mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 999;
	background: rgba(45, 24, 16, 0.45);
	display: flex;
	align-items: flex-end;
	justify-content: center;
}

.city-sheet {
	width: 100%;
	max-height: 72vh;
	background: #fff;
	border-radius: 28rpx 28rpx 0 0;
	padding: 28rpx 28rpx 40rpx;
	box-sizing: border-box;
}

.city-sheet-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.city-sheet-title {
	font-size: 32rpx;
	color: #2D1810;
	font-weight: 700;
}

.city-sheet-close {
	font-size: 26rpx;
	color: #C75B39;
}

.city-search {
	margin-bottom: 16rpx;
}

.city-search-input {
	width: 100%;
	height: 80rpx;
	padding: 0 24rpx;
	background: #FDF8F3;
	border-radius: 16rpx;
	font-size: 28rpx;
	color: #2D1810;
	box-sizing: border-box;
}

.city-search-placeholder {
	color: #B8A590;
}

.city-list {
	height: 52vh;
}

.city-row {
	padding: 24rpx 8rpx;
	border-bottom: 1rpx solid #F0E6D8;
}

.city-row.active {
	background: rgba(199, 91, 57, 0.06);
}

.city-row-text {
	font-size: 28rpx;
	color: #2D1810;
}

.city-empty {
	padding: 24rpx 8rpx;
}

.city-empty-text {
	font-size: 24rpx;
	color: #8B7355;
}

.input-placeholder {
	color: #B8A590;
}

.date-range {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.date-item {
	flex: 1;
	padding: 20rpx 24rpx;
	background: #FDF8F3;
	border-radius: 16rpx;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.date-label {
	font-size: 22rpx;
	color: #8B7355;
}

.date-value {
	font-size: 28rpx;
	color: #2D1810;
	font-weight: 500;
}

.date-separator {
	font-size: 32rpx;
	color: #C75B39;
}

.days-hint {
	font-size: 22rpx;
	color: #C75B39;
	margin-top: 12rpx;
	text-align: center;
	display: block;
}

.option-group {
	display: flex;
	gap: 16rpx;
	flex-wrap: wrap;
}

.option-item {
	padding: 16rpx 24rpx;
	background: #FDF8F3;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	gap: 8rpx;
	border: 2rpx solid transparent;
	transition: 0.2s;
}

.option-item.active {
	background: #FFF9F5;
	border-color: #C75B39;
}

.option-icon {
	font-size: 28rpx;
}

.option-text {
	font-size: 26rpx;
	color: #2D1810;
	font-weight: 500;
}

.tags-group {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.tag-item {
	padding: 12rpx 20rpx;
	background: #FDF8F3;
	border-radius: 20rpx;
	border: 2rpx solid transparent;
	transition: 0.2s;
}

.tag-item.active {
	background: #FFF9F5;
	border-color: #C75B39;
}

.tag-text {
	font-size: 26rpx;
	color: #2D1810;
}

.form-textarea {
	width: 100%;
	min-height: 160rpx;
	padding: 20rpx 24rpx;
	background: #FDF8F3;
	border-radius: 16rpx;
	font-size: 28rpx;
	color: #2D1810;
	box-sizing: border-box;
}

.textarea-placeholder {
	color: #B8A590;
}

.submit-btn {
	background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
	border-radius: 48rpx;
	padding: 28rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(199, 91, 57, 0.3);
	margin-top: 40rpx;
	transition: transform 0.15s;
}

.submit-btn:active {
	transform: scale(0.95);
}

.btn-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
}

/* ========== 加载态 ========== */
.loading-section {
	padding: 60rpx 32rpx;
}

.loading-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
}

/* 加载动画 - 旋转环 + 跳动点 */
.loading-animation {
	position: relative;
	width: 120rpx;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.loading-ring {
	width: 100rpx;
	height: 100rpx;
	border: 5rpx solid #F5E6D3;
	border-top-color: #C75B39;
	border-radius: 50%;
	animation: spin 1.2s linear infinite;
}

.loading-dot {
	position: absolute;
	width: 14rpx;
	height: 14rpx;
	background: #E8A090;
	border-radius: 50%;
	opacity: 0;
	animation: dotPulse 2s ease-in-out infinite;
}

.dot-1 {
	top: 10rpx;
	right: 15rpx;
	animation-delay: 0s;
}

.dot-2 {
	bottom: 10rpx;
	right: 15rpx;
	animation-delay: 0.7s;
}

.dot-3 {
	left: 15rpx;
	bottom: 10rpx;
	animation-delay: 1.4s;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

@keyframes dotPulse {
	0%,
	100% {
		opacity: 0;
		transform: scale(0.5);
	}
	50% {
		opacity: 1;
		transform: scale(1.2);
	}
}

.loading-text {
	font-size: 32rpx;
	color: #2D1810;
	font-weight: 600;
}

.loading-step {
	font-size: 26rpx;
	color: #C75B39;
	font-weight: 500;
}

/* 步骤进度条 */
.loading-progress {
	display: flex;
	align-items: center;
	gap: 0;
}

.progress-dot {
	width: 16rpx;
	height: 16rpx;
	background: #E8D5B5;
	border-radius: 50%;
	transition: background 0.5s, transform 0.5s;
}

.progress-dot.active {
	background: #C75B39;
	transform: scale(1.3);
}

.progress-line {
	width: 80rpx;
	height: 3rpx;
	background: #E8D5B5;
	transition: background 0.5s;
}

.progress-line.active {
	background: linear-gradient(90deg, #C75B39, #E8A090);
}

.loading-hint {
	font-size: 24rpx;
	color: #B8A590;
	margin-top: 8rpx;
}

/* ========== 底部 ========== */
.bottom-action {
	position: fixed;
	bottom: 100rpx;
	left: 0;
	right: 0;
	padding: 24rpx 32rpx;
	background: #fff;
	box-shadow: 0 -4rpx 20rpx rgba(45, 24, 16, 0.08);
	z-index: 10;
}

.reset-btn {
	background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
	border-radius: 48rpx;
	padding: 28rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.15s;
}

.reset-btn:active {
	transform: scale(0.95);
}

.reset-text {
	font-size: 32rpx;
	color: #fff;
	font-weight: 600;
}
</style>
