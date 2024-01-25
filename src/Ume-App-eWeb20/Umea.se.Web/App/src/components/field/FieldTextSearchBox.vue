<template>
	<div class="field-text-search-box" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-search-field-options
						@updated-value="(a) => emit('updatedValue', a)"
						:field="props.field"
					/>
				</template>

				<template v-slot:display>
					<display-options :field="props.field" />
				</template>

				<template v-slot:data>
					<admin-data-search-options
						:field="props.field"
						:single-entity="true"
					/>
				</template>

				<template v-slot:integration>
					<admin-integration-options :field="props.field" />
				</template>
			</field-options-content>
		</div>

		<!-- EDIT -->
		<Field
			v-if="mode === 'EDIT'"
			:name="getValidationId"
			:label="title"
			v-model="value"
			v-slot="{ field: innerField, errors, meta }"
			:keepValue="true"
			:rules="adminPreview ? '' : validationRules"
			:standalone="adminPreview"
		>
			<base-form-field
				v-if="mode === 'EDIT'"
				:label="title"
				:label-for="getValidationId"
				:isRequired="isRequired"
				:errorDisplay="!!errors.length"
				:admin-preview-label="
					adminPreview && $t('component.fieldTextSearchBox.newField')
				"
				><DataServiceFieldButton
					:field="field"
					:buttonText="buttonText"
					:value="value"
					:findValue="getSearchResponse()"
				>
					<v-text-field
						autocomplete="off"
						v-bind="innerField"
						:id="getValidationId"
						:hint="helpText"
						:readonly="readOnly"
						:error-messages="errors"
						:append-inner-icon="
							!foundValue
								? 'warning'
								: readOnly
								? 'lock'
								: getValidationIcon(meta, errors)
						"
						:persistent-hint="readOnly"
						:success="!readOnly && isSuccess(meta)"
						:error="!foundValue"
						:required="isRequired"
						density="compact"
						single-line
						:model-value="value"
					>
					</v-text-field>
				</DataServiceFieldButton>
				{{ getSearchResponseDisplay() }}
			</base-form-field>
		</Field>

		<!-- VIEW -->
		<div v-if="mode === 'VIEW'">
			<form-field-preview
				:title="title"
				:value="value"
				:id="id"
			></form-field-preview>
		</div>

		<!-- PRINT -->
		<div v-if="mode === 'PRINT'">
			<PrintTextBox :title="title" :helpText="helpText"></PrintTextBox>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType, ref, toRef } from 'vue';
import { FormFieldIcon, FormMode } from '@/models/Enums';
import BaseFormField from '@/components/base/BaseFormField.vue';
import PrintTextBox from './print/PrintTextBox.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminSearchFieldOptions from '@/components/admin/AdminFieldOptions/AdminSearchFieldOptions.vue';
import AdminDataSearchOptions from '../admin/AdminFieldOptions/AdminDataSearchOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import { ISingleValueField } from '@/models/IForm';
import { Field } from 'vee-validate';
import { useSingleValueField } from './composable/SingleValueField';
import { useFieldValidation } from './composable/FieldValidation';
import { useI18n } from 'vue-i18n';
import { fieldModeClass } from './composable/FieldUtils';

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

const { t } = useI18n();

const emit = defineEmits(['updatedValue']);

const { id, value, helpText, title, fieldOptions } = useSingleValueField({
	mode: props.mode,
	field: toRef(props, 'field'),
	emit,
});

const {
	getValidationId,
	validationRules,
	isSuccess,
	isRequired,
	readOnly,
	getValidationIcon,
} = useFieldValidation({
	validationId: props.validationId,
	validationScope: props.validationScope,
	fieldOptions,
	id,
});

const foundValue = ref<boolean>(true);

const buttonText = computed(() => fieldOptions.value.buttonText || false);

function getSearchResponse(): string {
	if (props.field.fieldOptions.searchResponse) {
		if (
			props.field.fieldOptions.searchResponse.searchFoundResult === true
		) {
			return props.field.fieldOptions.searchResponse.response;
		}
	}
	return '';
}

function getSearchResponseDisplay(): string {
	if (props.field.fieldOptions.searchResponse) {
		if (
			props.field.fieldOptions.searchResponse.searchFoundResult === false
		) {
			foundValue.value = false;
		} else {
			foundValue.value = true;
		}
		return props.field.fieldOptions.searchResponse.response;
	}
	return '';
}

function getComboBoxTitle(): string {
	return t('component.fieldTextSearchBox.title');
}

function getComboBoxDescription(): string {
	return t('component.fieldTextSearchBox.description');
}

function getComboBoxIcon(): string {
	return FormFieldIcon.FieldTextSearchBox;
}
</script>

<style scoped lang="scss">
:deep(.v-field__input) {
	padding: 0;
}
:deep(.v-input__details) {
	padding: 0 !important;
	margin-bottom: 4px;
}
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
</style>
