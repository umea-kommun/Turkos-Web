<template>
	<div>
		<FieldTextBox
			:mode="props.mode"
			:field="props.field"
			:validation-scope="props.validationScope"
			:validation-id="props.validationId"
			:is-personal-number="true"
			@updatedValue="updatedValue"
			:admin-preview="adminPreview"
		>
		</FieldTextBox>
	</div>
</template>

<script setup lang="ts">
import { FormMode } from '@/models/Enums';
import FieldTextBox from './FieldTextBox.vue';
import { PropType } from 'vue';
import { ISingleValueField } from '@/models/IForm';

// Define props
const props = defineProps({
	mode: {
		type: String as PropType<FormMode>,
		default: 'EDIT',
	},
	field: {
		type: Object as PropType<ISingleValueField>,
		required: true,
	},
	validationScope: {
		type: String,
		default: '',
	},
	validationId: {
		type: String,
		default: '',
	},
	adminPreview: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['updatedValue']);

function updatedValue($event: unknown): void {
	emit('updatedValue', $event);
}
</script>
