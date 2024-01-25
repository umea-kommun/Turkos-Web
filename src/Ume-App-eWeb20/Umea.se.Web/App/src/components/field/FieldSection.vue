<template>
	<div class="field-section" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-section-field-options :field="props.field" />
				</template>

				<template v-slot:display>
					<display-options :field="props.field" />
				</template>
			</field-options-content>
		</div>
		<!-- VIEW/EDIT/PRINT -->
		<BaseTitle
			v-if="mode === 'VIEW' || mode === 'EDIT' || mode === 'PRINT'"
			:title="title"
			:alert="mode === 'VIEW' ? '' : value"
			:extraInfo="mode === 'VIEW' ? '' : helpText"
			:mode="mode === 'PRINT' ? 'PRINT' : 'DEFAULT'"
		></BaseTitle>
	</div>
</template>

<script setup lang="ts">
import { PropType, toRef } from 'vue';
import BaseTitle from '@/components/base/BaseTitle.vue';
import FieldOptionsContent from '@/components/admin/AdminFieldOptions/FieldOptionsContent.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminSectionFieldOptions from '../admin/AdminFieldOptions/AdminSectionFieldOptions.vue';
import { FormMode } from '@/models/Enums';
import { ISingleValueField } from '@/models/IForm';
import { useSingleValueField } from './composable/SingleValueField';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';

/**
 * Component to divide a form in sections. A section contains a title and an optional description.
 */

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
});

// Use our composable singleValueField, we pass props and the emit function
const { value, helpText, title } = useSingleValueField({
	mode: props.mode,
	field: toRef(props, 'field'),
});
</script>

<style scoped lang="scss">
.field-section {
	&.edit-mode,
	&.print-mode,
	&.view-mode {
		margin-top: 25px;
		&:first-child {
			margin-top: 0;
		}
		.base-title label {
			padding-bottom: 0 !important;
		}
	}
}
</style>
