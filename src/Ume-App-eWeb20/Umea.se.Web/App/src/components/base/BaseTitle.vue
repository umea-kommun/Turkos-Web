<template>
	<div :class="mode + ' base-title'">
		<label class="title">
			{{ title }}
		</label>
		<div v-if="mode === 'PRINT'">
			<em v-html="alert"></em>
			<div>
				<em v-html="extraInfo"></em>
			</div>
		</div>
		<div v-if="mode === 'DEFAULT' && alert" class="base-title-description">
			<div v-html="alert"></div>
			<v-btn
				v-if="extraInfo"
				class="ma-0 mb-4"
				variant="outlined"
				color="primary"
				@click="showExtraInformation"
				>{{ $t('component.fieldSection.readMore') }}</v-btn
			>
		</div>
		<base-dialog ref="dialog" :text="extraInfo" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseDialog from '@/components/base/BaseDialog.vue';

defineProps({
	/**
	 * Text to be displayed as title
	 */
	title: String,
	/**
	 * Optional, text to be displayed as extra info below title
	 */
	alert: {
		type: String,
		default: '',
	},
	/**
	 * Optional, either PRINT or DEFAULT
	 */
	mode: {
		type: String,
		default: 'DEFAULT',
	},
	/**
	 * Optional, text to be displayed as popup if there is helpText
	 */
	extraInfo: {
		type: String,
		default: '',
	},
});

const dialog = ref<InstanceType<typeof BaseDialog> | null>(null);
function showExtraInformation(): void {
	dialog.value?.open();
}
</script>

<style scoped lang="scss">
.base-title {
	&.PRINT {
		margin-top: 20px;
	}

	.title {
		font-size: size(20);
		display: block;
		padding-bottom: 10px;
	}
}

.base-title,
.base-title label,
.base-title div {
	page-break-inside: avoid;
	page-break-after: avoid;
	break-after: avoid;
	page-break-before: avoid;
	break-before: avoid;
}
</style>
