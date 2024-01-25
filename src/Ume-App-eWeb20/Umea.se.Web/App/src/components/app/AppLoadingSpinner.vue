<template>
	<div>
		<v-progress-circular
			v-if="isVisible"
			class="app-loading-spinner"
			:width="3"
			color="green"
			indeterminate
			aria-busy="true"
		></v-progress-circular>
	</div>
</template>

<script setup lang="ts">
defineProps({
	isVisible: {
		type: Boolean,
		default: false,
	},
});
</script>

<style scoped lang="scss">
div {
	width: 100%;
}
.app-loading-spinner {
	height: 32px;
	width: 32px;
	margin: 50px auto 50px;
	display: block;
}
</style>
