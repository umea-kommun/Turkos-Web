<template>
	<div class="field-text-area" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-single-field-options
						@updated-value="(a) => emit('updatedValue', a)"
						:field="props.field"
						:show-read-only="true"
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
		<Field
			v-if="mode === 'EDIT'"
			:name="getValidationId"
			:label="title"
			v-model="value"
			v-slot="{ field, errors, meta }"
			:keepValue="true"
			:rules="adminPreview ? '' : validationRules"
			:standalone="adminPreview"
		>
			<base-form-field
				:label="title"
				:label-for="getValidationId"
				:isRequired="isRequired"
				:errorDisplay="!!errors.length"
				:admin-preview-label="
					adminPreview && $t('component.fieldTextArea.newField')
				"
			>
				<v-textarea
					v-bind="field"
					ref="textArea"
					autocomplete="off"
					:id="getValidationId"
					:required="isRequired"
					:success="isSuccess(meta)"
					density="compact"
					:readonly="readOnly"
					:append-inner-icon="readOnly ? 'lock' : undefined"
					:color="errors.length ? 'error' : 'primary'"
					:error="!!errors.length"
					:aria-describedby="
						!!errors.length ? 'error-' + getValidationId : null
					"
				>
				</v-textarea>
				<!-- Help text -->
				<HelpText
					:helpText="helpText"
					:errors="errors"
					:getValidationId="getValidationId"
					:fieldValid="meta.valid"
				>
				</HelpText>
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
			<PrintTextBox
				:title="title"
				:helpText="helpText"
				:height="240"
			></PrintTextBox>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FormMode } from '@/models/Enums';
import PrintTextBox from './print/PrintTextBox.vue';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import AdminSingleFieldOptions from '../admin/AdminFieldOptions/AdminSingleFieldOptions.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminDataOptions from '../admin/AdminFieldOptions/AdminDataOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import { Field } from 'vee-validate';
import { ComponentPublicInstance, onMounted, PropType, ref, toRef } from 'vue';
import { ISingleValueField } from '@/models/IForm';
import { useSingleValueField } from './composable/SingleValueField';
import { useFieldValidation } from './composable/FieldValidation';
import HelpText from './helpAndError/HelpAndErrorText.vue';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';

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

const { id, value, helpText, title, fieldOptions } = useSingleValueField({
	mode: props.mode,
	field: toRef(props, 'field'),
	emit,
});

const { getValidationId, validationRules, isSuccess, isRequired, readOnly } =
	useFieldValidation({
		validationId: props.validationId,
		validationScope: props.validationScope,
		fieldOptions,
		id,
	});

const textArea = ref(null);
onMounted(() => {
	if (value.value.length && textArea.value) {
		// If field has an initial value we need to forceUpdate, otherwise the value wont be visible until focus event
		// Hopefully this will be fixed in a later Vuetify version
		(textArea.value as ComponentPublicInstance).$forceUpdate();
	}
});
</script>

<style scoped lang="scss">
.field-text-area {
	&.edit-mode,
	&.print-mode,
	&.view-mode {
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
		.v-messages__message {
			line-height: inherit;
		}
		:deep(.v-input__details) {
			display: none;
		}
	}
}
</style>
