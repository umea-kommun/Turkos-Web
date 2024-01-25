<template>
	<div class="admin-checkbox" :class="{ active: modelValue }">
		<div class="label-wrap">
			<label :for="id">{{ label }}</label>
			<span class="help-text">{{ helpText }}</span>
		</div>

		<ul class="checkbox-wrap">
			<li v-for="item in items" :key="item.id">
				<v-checkbox
					v-model="value"
					:value="item"
					color="primary"
					:disabled="item.disabled"
					:label="item.title"
					hideDetails
				/>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { IItem } from '@/models/IForm';

const props = defineProps({
	id: { type: String, required: true },
	modelValue: {
		type: Array as PropType<IItem[]>,
		required: true,
	},
	items: {
		type: Array as PropType<IItem[]>,
		required: true,
	},
	label: String,
	helpText: String,
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
	get: () => {
		return props.modelValue;
	},
	set: (newValue: IItem[]) => {
		emit('update:modelValue', newValue);
	},
});
</script>

<style scoped lang="scss">
.admin-checkbox {
	margin-bottom: 10px;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	flex-flow: column wrap;
	.label-wrap {
		display: flex;
		flex-direction: column;
		flex: 1;
		label {
			padding-right: 20px;
		}

		.help-text {
			opacity: 0.8;
			font-size: size(14);
			padding-right: 20px;
		}
	}

	.checkbox-wrap {
		display: flex;
		flex-direction: column;
		list-style: none;

		:deep(.v-checkbox .v-selection-control) {
			height: 100%;
		}
	}
}
</style>
