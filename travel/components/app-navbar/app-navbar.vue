<template>
	<u-navbar
		:title="title"
		:autoBack="autoBack"
		:bgColor="bgColor"
		leftIcon="arrow-left"
		leftIconColor="#2D1810"
		:placeholder="true"
		:border="false"
		:fixed="true"
		:titleStyle="titleStyle"
	>
		<template #right>
			<slot name="right"></slot>
		</template>
	</u-navbar>
</template>

<script setup>
defineProps({
	title: { type: String, default: '' },
	autoBack: { type: Boolean, default: true },
	bgColor: { type: String, default: '#F5E6D3' }
})

const titleStyle = {
	color: '#2D1810',
	fontWeight: '700',
	fontSize: '16px'
}
</script>
