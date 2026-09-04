<template>
	<u-tabbar
		:value="current"
		@change="onChange"
		:fixed="true"
		:placeholder="true"
		:safeAreaInsetBottom="true"
		activeColor="#C75B39"
		inactiveColor="#8B7355"
		bgColor="#FFFFFF"
	>
		<u-tabbar-item text="首页" icon="home-fill" name="home"></u-tabbar-item>
		<u-tabbar-item text="规划" icon="map-fill" name="plan"></u-tabbar-item>
		<u-tabbar-item text="收藏" icon="heart-fill" name="favorite"></u-tabbar-item>
		<u-tabbar-item text="我的" icon="account-fill" name="mine"></u-tabbar-item>
	</u-tabbar>
</template>

<script>
export default {
	data() {
		return {
			current: 'home'
		}
	},
	methods: {
		onChange(name) {
			const routes = {
				home: '/pages/index/index',
				plan: '/pages/plan/plan',
				favorite: '/pages/favorite/favorite',
				mine: '/pages/mine/mine'
			}
			if (routes[name]) {
				uni.switchTab({ url: routes[name] })
			}
		}
	}
}
</script>
