<template>
	<div class="print-check-box-list">
		<p class="label">
			<strong>{{ title }}</strong
			><br />
			<small v-if="multiple && items.length > 1">
				{{ $t('component.PrintCheckBoxList.oneOrMoreSelections') }}
			</small>
			<small v-if="informOnlyOneSelectionAllowed()">
				{{ $t('component.PrintCheckBoxList.oneSelectionOnly') }}
			</small>
		</p>
		<p class="option" v-for="item in items" :key="item.id">
			<v-icon size="large" class="icon_crop_square" icon="crop_square" />
			<span>{{ item.title }}</span>
		</p>
		<small v-if="helpText">{{ helpText }}</small>
	</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IItem } from '@/models/IForm';

/**
 * Component that renders a list of check boxes, sutiable for a on-paper-ui
 */

const props = defineProps({
	title: {
		type: String,
		default: '',
	},
	helpText: {
		type: String,
		default: '',
	},
	multiple: {
		type: Boolean,
		default: true,
	},
	items: {
		type: Array as PropType<IItem[]>,
		required: true,
	},
});

function informOnlyOneSelectionAllowed(): boolean {
	let shouldInform = false;
	if (!props.multiple && props.items.length > 1) {
		// Try to find out if this is something other than a yes-no question
		const otherThanYesNoOptions = props.items.filter(
			(item) =>
				['ja', 'nej'].indexOf((item.title || '').toLowerCase()) === -1
		);
		shouldInform = otherThanYesNoOptions.length > 0;
	}
	return shouldInform;
}
</script>

<style scoped lang="scss">
.print-check-box-list {
	min-height: 85px;
	margin-top: 20px;

	.option {
		margin: 10px 0;
	}
}

.print-check-box-list,
.print-check-box-list p {
	page-break-inside: avoid;
}
</style>
