<template>
	<div :class="'print-text-box' + (spacing ? ' spacing' : '')">
		<p class="label" :style="'padding-bottom: ' + height + 'px'">
			<strong>{{ title }}</strong>
		</p>
		<small v-if="helpText">{{ helpText }}</small>
	</div>
</template>

<script setup lang="ts">
/**
 * Component that renders a textbox sutiable for a on-paper-ui
 */
defineProps({
	title: {
		type: String,
		default: 'Write something...',
	},
	helpText: {
		type: String,
		default: '',
	},
	height: {
		type: Number,
		default: 32,
	},
	spacing: {
		type: Boolean,
		default: true,
	},
});
</script>

<style scoped lang="scss">
.print-text-box {
	page-break-inside: avoid;

	.label {
		border: #333 solid 1px;
		padding: 3px 3px 32px;
		border-radius: 4px;
		margin-bottom: 4px;
	}
}

.print-text-box.spacing {
	min-height: 80px;
	margin-top: 15px;
}
</style>
