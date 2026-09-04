<template>
	<view class="custom-tabbar">
		<u-tabbar
			:value="current"
			@change="onChange"
			:fixed="true"
			:placeholder="true"
			:safeAreaInsetBottom="true"
			activeColor="#C75B39"
			inactiveColor="#8B7355"
			:bgColor="#FFFFFF"
			:border="true"
		>
			<u-tabbar-item text="首页" icon="home-fill" name="home"></u-tabbar-item>
			<u-tabbar-item text="规划" icon="map-fill" name="plan"></u-tabbar-item>
			<u-tabbar-item text="收藏" icon="heart-fill" name="favorite"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account-fill" name="mine"></u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
	current: {
		type: String,
		default: 'home'
	}
})

const emit = defineEmits(['change'])

function onChange(name) {
	emit('change', name)
}
</script>

<style scoped>
.custom-tabbar {
	/* 自定义样式 */
}
</style>
