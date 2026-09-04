<template>
  <view class="trip-plan">
    <!-- ========== 头部 ========== -->
    <view class="plan-header">
      <view class="header-bg"></view>
      <view class="header-content">
        <view class="back-btn" @click="$emit('back')">
          <text class="back-icon">←</text>
        </view>
        <view class="title-group">
          <text class="plan-city">{{ tripPlan.city }}</text>
          <text class="plan-date">{{ tripPlan.start_date }} ~ {{ tripPlan.end_date }}</text>
        </view>
      </view>
    </view>

    <!-- ========== 概览条 ========== -->
    <view class="plan-summary">
      <view class="summary-item" v-if="tripPlan.weather_info && tripPlan.weather_info.length">
        <text class="summary-icon">🌡️</text>
        <view class="summary-text">
          <text class="summary-label">天气</text>
          <text class="summary-value">{{ tripPlan.weather_info[0].day_weather }} {{ tripPlan.weather_info[0].day_temp }}°</text>
        </view>
      </view>
      <view class="summary-divider" v-if="tripPlan.weather_info && tripPlan.weather_info.length"></view>
      <view class="summary-item">
        <text class="summary-icon">📅</text>
        <view class="summary-text">
          <text class="summary-label">天数</text>
          <text class="summary-value">{{ tripPlan.days.length }}天</text>
        </view>
      </view>
      <view class="summary-divider"></view>
      <view class="summary-item" v-if="tripPlan.budget && tripPlan.budget.total">
        <text class="summary-icon">💰</text>
        <view class="summary-text">
          <text class="summary-label">预算</text>
          <text class="summary-value">¥{{ tripPlan.budget.total }}</text>
        </view>
      </view>
      <view class="summary-item" v-else>
        <text class="summary-icon">🎒</text>
        <view class="summary-text">
          <text class="summary-label">行程</text>
          <text class="summary-value">{{ tripPlan.days.length }}天{{ countTotalAttractions() }}景</text>
        </view>
      </view>
    </view>

    <!-- ========== 每日行程 ========== -->
    <view class="days-container">
      <view class="day-card" v-for="(day, dayIndex) in tripPlan.days" :key="dayIndex">
        <!-- 日期标题 -->
        <view class="day-header">
          <view class="day-badge">
            <text class="day-num">{{ day.day_index + 1 }}</text>
          </view>
          <view class="day-info">
            <text class="day-date">{{ day.date }}</text>
            <text class="day-desc">{{ day.description }}</text>
          </view>
          <!-- 当天天气 -->
          <view class="day-weather" v-if="tripPlan.weather_info && tripPlan.weather_info[dayIndex]">
            <text class="weather-icon">{{ getWeatherIcon(tripPlan.weather_info[dayIndex].day_weather) }}</text>
            <view class="weather-detail">
              <text class="weather-temp">{{ tripPlan.weather_info[dayIndex].day_temp }}° / {{ tripPlan.weather_info[dayIndex].night_temp }}°</text>
              <text class="weather-wind" v-if="tripPlan.weather_info[dayIndex].wind_direction">
                {{ tripPlan.weather_info[dayIndex].wind_direction }} {{ tripPlan.weather_info[dayIndex].wind_power }}
              </text>
            </view>
          </view>
        </view>

        <!-- 交通与住宿标签 -->
        <view class="day-tags" v-if="day.transportation || day.accommodation">
          <text class="day-tag transport-tag" v-if="day.transportation">{{ day.transportation }}</text>
          <text class="day-tag accom-tag" v-if="day.accommodation">{{ day.accommodation }}</text>
        </view>

        <!-- 景点 -->
        <view class="day-section" v-if="day.attractions && day.attractions.length">
          <view class="section-title">
            <text class="section-icon">📍</text>
            <text class="section-text">景点</text>
          </view>
          <view class="attraction-list">
            <view class="attraction-item" v-for="(attr, attrIndex) in day.attractions" :key="attrIndex"
              @click="$emit('navigateTo', attr)">
              <!-- 景点图片 -->
              <view class="attr-image-wrap" v-if="attr.image_url">
                <image class="attr-image" :src="attr.image_url" mode="aspectFill" />
              </view>
              <view class="attr-rank" v-else>{{ attrIndex + 1 }}</view>
              <view class="attr-content">
                <view class="attr-name-row">
                  <text class="attr-name">{{ attr.name }}</text>
                  <text class="attr-category" v-if="attr.category && attr.category !== '景点'">{{ attr.category }}</text>
                </view>
                <text class="attr-desc" v-if="attr.description">{{ attr.description }}</text>
                <view class="attr-meta">
                  <text class="attr-time" v-if="attr.visit_duration">⏱️ {{ attr.visit_duration }}分钟</text>
                  <text class="attr-price" v-if="attr.ticket_price">💰 ¥{{ attr.ticket_price }}</text>
                  <text class="attr-addr" v-if="attr.address">{{ attr.address }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 餐饮 -->
        <view class="day-section" v-if="day.meals && day.meals.length">
          <view class="section-title">
            <text class="section-icon">🍽️</text>
            <text class="section-text">餐饮</text>
          </view>
          <view class="meal-list">
            <view class="meal-item" v-for="(meal, mealIndex) in day.meals" :key="mealIndex">
              <text class="meal-type">{{ getMealTypeText(meal.type) }}</text>
              <view class="meal-content">
                <view class="meal-info">
                  <text class="meal-name">{{ meal.name }}</text>
                  <text class="meal-desc" v-if="meal.description && meal.description !== meal.name">{{ meal.description }}</text>
                </view>
                <text class="meal-price" v-if="meal.estimated_cost">¥{{ meal.estimated_cost }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 酒店 -->
        <view class="day-section" v-if="day.hotel && day.hotel.name">
          <view class="section-title">
            <text class="section-icon">🏨</text>
            <text class="section-text">住宿</text>
          </view>
          <view class="hotel-card">
            <view class="hotel-header">
              <text class="hotel-name">{{ day.hotel.name }}</text>
              <text class="hotel-type" v-if="day.hotel.type">{{ day.hotel.type }}</text>
            </view>
            <text class="hotel-address" v-if="day.hotel.address">📍 {{ day.hotel.address }}</text>
            <view class="hotel-meta">
              <text class="hotel-price" v-if="day.hotel.estimated_cost">¥{{ day.hotel.estimated_cost }}/晚</text>
              <text class="hotel-range" v-if="day.hotel.price_range">· {{ day.hotel.price_range }}</text>
              <text class="hotel-distance" v-if="day.hotel.distance">· {{ day.hotel.distance }}</text>
            </view>
            <view class="hotel-rating" v-if="day.hotel.rating">
              <text>⭐ {{ day.hotel.rating }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- ========== 预算明细 ========== -->
    <view class="budget-section" v-if="tripPlan.budget && tripPlan.budget.total">
      <view class="budget-title">
        <text class="budget-icon">💰</text>
        <text class="budget-text">预算明细</text>
      </view>
      <view class="budget-grid">
        <view class="budget-item">
          <text class="budget-value">¥{{ tripPlan.budget.total_attractions || 0 }}</text>
          <text class="budget-label">景点门票</text>
        </view>
        <view class="budget-item">
          <text class="budget-value">¥{{ tripPlan.budget.total_hotels || 0 }}</text>
          <text class="budget-label">酒店住宿</text>
        </view>
        <view class="budget-item">
          <text class="budget-value">¥{{ tripPlan.budget.total_meals || 0 }}</text>
          <text class="budget-label">餐饮美食</text>
        </view>
        <view class="budget-item">
          <text class="budget-value">¥{{ tripPlan.budget.total_transportation || 0 }}</text>
          <text class="budget-label">交通出行</text>
        </view>
      </view>
      <view class="budget-total">
        <text class="total-label">全程预估</text>
        <text class="total-value">¥{{ tripPlan.budget.total }}</text>
      </view>
    </view>

    <!-- ========== 旅行建议 ========== -->
    <view class="suggestion-section" v-if="tripPlan.overall_suggestions">
      <view class="suggestion-title">
        <text class="suggestion-icon">💡</text>
        <text class="suggestion-text">旅行建议</text>
      </view>
      <text class="suggestion-content">{{ tripPlan.overall_suggestions }}</text>
    </view>

    <!-- 底部间距 -->
    <view class="bottom-spacer"></view>
  </view>
</template>

<script setup>
const props = defineProps({
  tripPlan: {
    type: Object,
    required: true
  }
})

function getWeatherIcon(weather) {
  if (!weather) return '🌤️'
  if (weather.includes('晴')) return '☀️'
  if (weather.includes('云') || weather.includes('阴')) return '⛅'
  if (weather.includes('雨')) return '🌧️'
  if (weather.includes('雪')) return '❄️'
  if (weather.includes('雾') || weather.includes('霾')) return '🌫️'
  return '🌤️'
}

function getMealTypeText(type) {
  const map = {
    breakfast: '🌅 早餐',
    lunch: '☀️ 午餐',
    dinner: '🌙 晚餐',
    snack: '🍪 小吃'
  }
  return map[type] || type
}

function countTotalAttractions() {
  let count = 0
  if (props.tripPlan.days) {
    props.tripPlan.days.forEach(day => {
      if (day.attractions) count += day.attractions.length
    })
  }
  return count
}
</script>

<style>
.trip-plan {
  min-height: 100vh;
  background: #FDF8F3;
}

.plan-header {
  position: relative;
  padding: 88rpx 32rpx 24rpx;
  background: linear-gradient(180deg, #F5E6D3 0%, #FDF8F3 100%);
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
  opacity: 0.1;
}

.header-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.back-btn {
  width: 72rpx;
  height: 72rpx;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(45, 24, 16, 0.1);
}

.back-btn:active {
  transform: scale(0.92);
}

.back-icon {
  font-size: 32rpx;
  color: #2D1810;
}

.title-group {
  display: flex;
  flex-direction: column;
}

.plan-city {
  font-size: 40rpx;
  color: #2D1810;
  font-weight: 700;
}

.plan-date {
  font-size: 22rpx;
  color: #8B7355;
  margin-top: 4rpx;
}

/* ========== 概览条 ========== */
.plan-summary {
  margin: 0 32rpx 24rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 4rpx 16rpx rgba(45, 24, 16, 0.06);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.summary-icon {
  font-size: 40rpx;
}

.summary-text {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 20rpx;
  color: #8B7355;
}

.summary-value {
  font-size: 26rpx;
  color: #2D1810;
  font-weight: 600;
}

.summary-divider {
  width: 1rpx;
  height: 60rpx;
  background: #E8D5B5;
}

/* ========== 每日行程卡 ========== */
.days-container {
  padding: 0 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.day-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(45, 24, 16, 0.06);
}

.day-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.day-badge {
  width: 64rpx;
  height: 64rpx;
  background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.day-num {
  font-size: 28rpx;
  color: #fff;
  font-weight: 700;
}

.day-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.day-date {
  font-size: 22rpx;
  color: #8B7355;
}

.day-desc {
  font-size: 28rpx;
  color: #2D1810;
  font-weight: 600;
}

.day-weather {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: #F5E6D3;
  border-radius: 20rpx;
  flex-shrink: 0;
}

.weather-icon {
  font-size: 28rpx;
}

.weather-detail {
  display: flex;
  flex-direction: column;
}

.weather-temp {
  font-size: 22rpx;
  color: #2D1810;
  font-weight: 600;
}

.weather-wind {
  font-size: 18rpx;
  color: #8B7355;
}

/* 交通/住宿标签 */
.day-tags {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.day-tag {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.transport-tag {
  background: #E8F4FD;
  color: #3A7CA5;
}

.accom-tag {
  background: #F5E6D3;
  color: #8B7355;
}

/* ========== 景点列表 ========== */
.day-section {
  margin-top: 20rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.section-icon {
  font-size: 28rpx;
}

.section-text {
  font-size: 26rpx;
  color: #8B7355;
  font-weight: 600;
}

.attraction-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.attraction-item {
  display: flex;
  gap: 16rpx;
  padding: 16rpx;
  background: #FDF8F3;
  border-radius: 16rpx;
  transition: transform 0.15s;
}

.attraction-item:active {
  transform: scale(0.98);
  background: #F5E6D3;
}

.attr-rank {
  width: 40rpx;
  height: 40rpx;
  background: linear-gradient(135deg, #C75B39 0%, #E8A090 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.attr-image-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.attr-image {
  width: 100%;
  height: 100%;
}

.attr-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.attr-name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.attr-name {
  font-size: 28rpx;
  color: #2D1810;
  font-weight: 600;
}

.attr-category {
  font-size: 20rpx;
  color: #C75B39;
  background: #FFF9F5;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
  border: 1rpx solid #E8A090;
}

.attr-desc {
  font-size: 24rpx;
  color: #8B7355;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.attr-meta {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.attr-time {
  font-size: 22rpx;
  color: #8B7355;
}

.attr-price {
  font-size: 22rpx;
  color: #C75B39;
  font-weight: 600;
}

.attr-addr {
  font-size: 20rpx;
  color: #B8A590;
}

/* ========== 餐饮列表 ========== */
.meal-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.meal-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 12rpx 16rpx;
  background: #FDF8F3;
  border-radius: 12rpx;
}

.meal-type {
  font-size: 24rpx;
  color: #2D1810;
  font-weight: 600;
  flex-shrink: 0;
}

.meal-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12rpx;
  min-width: 0;
}

.meal-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}

.meal-name {
  font-size: 26rpx;
  color: #2D1810;
  font-weight: 500;
}

.meal-desc {
  font-size: 22rpx;
  color: #8B7355;
  line-height: 1.3;
}

.meal-price {
  font-size: 24rpx;
  color: #C75B39;
  font-weight: 600;
  flex-shrink: 0;
}

/* ========== 酒店卡片 ========== */
.hotel-card {
  padding: 16rpx;
  background: #FDF8F3;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.hotel-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.hotel-name {
  font-size: 28rpx;
  color: #2D1810;
  font-weight: 600;
}

.hotel-type {
  font-size: 20rpx;
  color: #8B7355;
  background: #F5E6D3;
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
}

.hotel-address {
  font-size: 24rpx;
  color: #8B7355;
}

.hotel-meta {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-wrap: wrap;
}

.hotel-price {
  font-size: 22rpx;
  color: #C75B39;
  font-weight: 600;
}

.hotel-range {
  font-size: 22rpx;
  color: #8B7355;
}

.hotel-distance {
  font-size: 22rpx;
  color: #8B7355;
}

.hotel-rating {
  font-size: 22rpx;
  color: #8B7355;
  margin-top: 4rpx;
}

/* ========== 预算 ========== */
.budget-section {
  margin: 24rpx 32rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(45, 24, 16, 0.06);
}

.budget-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 20rpx;
}

.budget-icon {
  font-size: 28rpx;
}

.budget-text {
  font-size: 26rpx;
  color: #8B7355;
  font-weight: 600;
}

.budget-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.budget-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  background: #FDF8F3;
  border-radius: 12rpx;
}

.budget-value {
  font-size: 28rpx;
  color: #C75B39;
  font-weight: 700;
}

.budget-label {
  font-size: 22rpx;
  color: #8B7355;
  margin-top: 4rpx;
}

.budget-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #E8D5B5;
}

.total-label {
  font-size: 26rpx;
  color: #2D1810;
  font-weight: 600;
}

.total-value {
  font-size: 32rpx;
  color: #C75B39;
  font-weight: 700;
}

/* ========== 建议 ========== */
.suggestion-section {
  margin: 0 32rpx 32rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(45, 24, 16, 0.06);
}

.suggestion-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 16rpx;
}

.suggestion-icon {
  font-size: 28rpx;
}

.suggestion-text {
  font-size: 26rpx;
  color: #8B7355;
  font-weight: 600;
}

.suggestion-content {
  font-size: 26rpx;
  color: #2D1810;
  line-height: 1.6;
}

/* ========== 底部 ========== */
.bottom-spacer {
  height: 160rpx;
}
</style>
