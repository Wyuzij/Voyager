<template>
	<u-tabbar
		:value="current"
		@change="onChange"
		:fixed="true"
		:placeholder="true"
		:safeAreaInsetBottom="true"
		:zIndex="980"
		activeColor="#C75B39"
		inactiveColor="#8B7355"
		backgroundColor="#FFFFFF"
		borderColor="#F0E6D8"
	>
		<u-tabbar-item text="首页" icon="home-fill" name="home"></u-tabbar-item>
		<u-tabbar-item text="规划" icon="map-fill" name="plan"></u-tabbar-item>
		<u-tabbar-item text="收藏" icon="heart-fill" name="favorite"></u-tabbar-item>
		<u-tabbar-item text="我的" icon="account-fill" name="mine"></u-tabbar-item>
	</u-tabbar>
</template>

<script setup>
import { onMounted } from 'vue'

defineProps({
	current: {
		type: String,
		default: 'home'
	}
})

const routes = {
	home: '/pages/index/index',
	plan: '/pages/plan/plan',
	favorite: '/pages/favorite/favorite',
	mine: '/pages/mine/mine'
}

onMounted(() => {
	uni.hideTabBar({ fail() {} })
})

function onChange(name) {
	const url = routes[name]
	if (url) uni.switchTab({ url })
}
</script>
