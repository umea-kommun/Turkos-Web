<template>
	<div class="field-hidden-text-box" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-single-field-options
						@updated-value="(a) => emit('updatedValue', a)"
						:field="props.field"
						:show-help-text="false"
						:show-required="false"
					/>
				</template>

				<template v-slot:display>
					<display-options :field="props.field" />
				</template>

				<template v-slot:data>
					<admin-data-options :field="props.field" />
				</template>

				<template v-slot:integration>
					<admin-integration-options :field="props.field" />
				</template>
			</field-options-content>
		</div>

		<!-- EDIT -->
		<div v-if="mode === 'EDIT' && !adminPreview">
			<form-field-preview
				:title="title"
				:value="value"
			></form-field-preview>
		</div>
		<div v-if="mode === 'EDIT' && adminPreview" class="admin-preview">
			<form-field-preview
				:title="
					title ? title : $t('component.fieldHiddenTextBox.newField')
				"
				:value="value"
			></form-field-preview>
		</div>

		<!-- VIEW -->
		<div v-if="mode === 'VIEW'">
			<form-field-preview
				:title="title"
				:value="value"
				:id="id"
			></form-field-preview>
		</div>

		<!-- PRINT -->
		<div v-if="mode === 'PRINT' && showToUser">
			<PrintTextBox :title="title" :helpText="helpText"></PrintTextBox>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FormMode } from '@/models/Enums';
import PrintTextBox from './print/PrintTextBox.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import AdminSingleFieldOptions from '../admin/AdminFieldOptions/AdminSingleFieldOptions.vue';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminDataOptions from '../admin/AdminFieldOptions/AdminDataOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';
import { useSingleValueField } from './composable/SingleValueField';
import { ISingleValueField } from '@/models/IForm';
import { computed, onMounted, PropType, toRef } from 'vue';

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

const { id, value, helpText, title, fieldOptions, storeUpdateFormField } =
	useSingleValueField({
		mode: props.mode,
		field: toRef(props, 'field'),
		emit,
	});

onMounted(() => {
	if (props.mode === 'EDIT') {
		if (fieldOptions.value?.showToUser === undefined) {
			storeUpdateFormField(
				{ ...fieldOptions.value, showToUser: false },
				'fieldOptions'
			);
		}
	}
});

const showToUser = computed({
	get: () => {
		return fieldOptions.value.showToUser
			? fieldOptions.value.showToUser
			: false;
	},
	set: (checked: boolean) => {
		storeUpdateFormField(
			{ ...fieldOptions.value, showToUser: checked },
			'fieldOptions'
		);
	},
});
</script>

<style scoped lang="scss">
:deep(.v-input--is-readonly .v-text-field__details) {
	padding-bottom: 8px;
}

:deep(.v-input--is-readonly input) {
	cursor: default;
	opacity: 0.8;
}
:deep(.v-input--is-readonly .v-input__slot) {
	background: #f9f9f9;
}

.field-hidden-text-box {
	.admin-preview {
		padding: 8px 0 3px;
	}
}
</style>
