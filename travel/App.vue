<script>
import { seedCoupons } from './utils/user-store.js'

export default {
	onLaunch: function () {
		console.log('App Launch - Voyager 行迹')
		seedCoupons()
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
:root {
	--primary-color: #C75B39;
	--primary-light: #E8A090;
	--primary-dark: #8B4513;
	--secondary-color: #2D1810;
	--accent-color: #FF9800;
	--success-color: #4CAF50;
	--warning-color: #FF9800;
	--error-color: #C75B39;

	--text-primary: #2D1810;
	--text-secondary: #5D4E3C;
	--text-tertiary: #8B7355;
	--text-light: #B8A590;

	--bg-primary: #FDF8F3;
	--bg-secondary: #F5E6D3;
	--bg-tertiary: #E8D5B5;
	--bg-card: #FFFFFF;

	--border-color: #E8D5B5;
	--border-light: #F0E6D8;
	--shadow-light: 0 4rpx 20rpx rgba(45, 24, 16, 0.06);
	--shadow-medium: 0 4rpx 16rpx rgba(45, 24, 16, 0.08);
	--shadow-heavy: 0 8rpx 32rpx rgba(45, 24, 16, 0.12);
}

page {
	background-color: var(--bg-secondary);
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: var(--text-primary);
}

.card {
	background: var(--bg-card);
	border-radius: 24rpx;
	box-shadow: var(--shadow-light);
	overflow: hidden;
	border: 1rpx solid rgba(199, 91, 57, 0.08);
}

.card:active {
	transform: scale(0.98);
}

.btn-primary {
	background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
	color: #ffffff;
	border: none;
	border-radius: 48rpx;
	padding: 24rpx 48rpx;
	font-size: 32rpx;
	font-weight: 600;
	box-shadow: 0 8rpx 24rpx rgba(199, 91, 57, 0.3);
}

.btn-primary:active {
	transform: translateY(2rpx);
	box-shadow: 0 4rpx 12rpx rgba(199, 91, 57, 0.3);
}

.btn-secondary {
	background: var(--bg-secondary);
	color: var(--text-primary);
	border: none;
	border-radius: 24rpx;
	padding: 20rpx 32rpx;
	font-size: 28rpx;
	font-weight: 500;
}

.section-indicator {
	width: 8rpx;
	height: 32rpx;
	background: linear-gradient(180deg, var(--primary-color) 0%, var(--primary-light) 100%);
	border-radius: 4rpx;
}

.stamp {
	background: rgba(199, 91, 57, 0.1);
	border: 2rpx solid var(--primary-color);
	color: var(--primary-color);
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
	font-size: 20rpx;
	font-weight: 600;
	font-family: 'Noto Serif SC', serif;
}

.tag {
	display: inline-flex;
	align-items: center;
	padding: 6rpx 16rpx;
	background: rgba(199, 91, 57, 0.1);
	color: var(--primary-color);
	font-size: 22rpx;
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

.price {
	color: var(--primary-color);
	font-weight: 700;
	font-family: 'Noto Serif SC', serif;
}

.price-currency {
	font-size: 24rpx;
	font-weight: 500;
}

.price-value {
	font-size: 40rpx;
	font-weight: 700;
}

.placeholder {
	color: var(--text-light);
}

.divider {
	height: 1rpx;
	background: var(--border-color);
	margin: 24rpx 0;
}

.hover-lift {
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:active {
	transform: translateY(-2rpx);
	box-shadow: var(--shadow-heavy);
}

.glass {
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
}

.shadow-sm {
	box-shadow: var(--shadow-light);
}

.shadow-md {
	box-shadow: var(--shadow-medium);
}

.shadow-lg {
	box-shadow: var(--shadow-heavy);
}

.rounded-sm {
	border-radius: 12rpx;
}

.rounded-md {
	border-radius: 16rpx;
}

.rounded-lg {
	border-radius: 24rpx;
}

.rounded-xl {
	border-radius: 32rpx;
}

.text-primary {
	color: var(--text-primary);
}

.text-secondary {
	color: var(--text-secondary);
}

.text-tertiary {
	color: var(--text-tertiary);
}

.text-accent {
	color: var(--primary-color);
}

.text-white {
	color: #ffffff;
}

.font-serif {
	font-family: 'Noto Serif SC', serif;
}

/* #ifdef H5 */
@media (min-width: 768px) {
	html,
	body {
		background:
			radial-gradient(ellipse at 18% 0%, rgba(199, 91, 57, 0.16), transparent 48%),
			#1c1612;
		min-height: 100%;
	}

	body::before {
		content: '行迹 · 网页预览';
		position: fixed;
		top: 20px;
		left: 28px;
		z-index: 9999;
		color: #e8d5b5;
		font-size: 13px;
		letter-spacing: 0.18em;
		opacity: 0.72;
		pointer-events: none;
	}

	uni-app {
		width: 390px !important;
		max-width: 390px;
		height: min(844px, calc(100vh - 48px));
		margin: 24px auto !important;
		border-radius: 28px;
		overflow: hidden;
		box-shadow:
			0 0 0 10px #2a211c,
			0 0 0 12px #c75b39,
			0 30px 80px rgba(0, 0, 0, 0.45);
	}
}
/* #endif */
</style>
