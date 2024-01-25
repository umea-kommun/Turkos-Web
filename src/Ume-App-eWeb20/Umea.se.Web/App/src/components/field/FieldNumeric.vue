<template>
	<div class="field-numeric-box" :class="fieldModeClass(mode)">
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
			:rules="adminPreview ? '' : getValidationRules"
			:standalone="adminPreview"
		>
			<base-form-field
				:id="'label' + id"
				:label="title"
				:label-for="getValidationId"
				:isRequired="isRequired"
				:errorDisplay="!!errors.length"
				:admin-preview-label="
					adminPreview && $t('component.fieldNumeric.newField')
				"
			>
				<ume-text-field
					v-bind="field"
					:id="getValidationId"
					:readonly="readOnly"
					:success="!readOnly && isSuccess(meta)"
					:required="isRequired"
					density="compact"
					:error="!!errors.length"
					:aria-labelledby="'label' + id"
					:aria-readonly="readOnly"
					:aria-describedby="
						!!errors.length ? 'error-' + getValidationId : null
					"
					:append-inner-icon="readOnly ? 'lock' : undefined"
					:inputmode="allowDecimals ? 'decimal' : 'numeric'"
				/>
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
				:value="previewValue"
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
import FieldOptionsContent from '@/components/admin/AdminFieldOptions/FieldOptionsContent.vue';
import AdminSingleFieldOptions from '@/components/admin/AdminFieldOptions/AdminSingleFieldOptions.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminDataOptions from '../admin/AdminFieldOptions/AdminDataOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import PrintTextBox from './print/PrintTextBox.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import { Field } from 'vee-validate';
import { computed, PropType, ref, toRef } from 'vue';
import { FormMode } from '@/models/Enums';
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

// To use emit we have to define what the component emits
const emit = defineEmits(['updatedValue']);

// Use our composable singleValueField, we pass props and the emit function
const { id, helpText, title, allowDecimals, fieldOptions } =
	useSingleValueField({
		mode: props.mode,
		field: toRef(props, 'field'),
		emit,
	});

const userHasEnteredAComma = ref(true);
const value = computed({
	get: () => {
		let val = props.field?.value ?? '';
		// If the user has entered a comma for decimals, we want don't want them to see that is is replaced by a "."
		if (userHasEnteredAComma.value) {
			val = val.replace('.', ',');
		}
		return val;
	},
	set: (value: string) => {
		userHasEnteredAComma.value = value.indexOf(',') > -1;
		emit('updatedValue', { newValue: value.replace(',', '.') });
	},
});

const previewValue = computed(() => {
	if (allowDecimals.value) {
		return value.value.replace('.', ',');
	}
	return value.value;
});

// Use our composable fieldValidation
const { getValidationId, validationRules, isSuccess, isRequired, readOnly } =
	useFieldValidation({
		validationId: props.validationId,
		validationScope: props.validationScope,
		fieldOptions,
		id,
	});

const getValidationRules = computed(() => {
	if (allowDecimals.value) {
		return 'validNumberWithDecimals|' + validationRules.value;
	} else {
		return 'validNumber|' + validationRules.value;
	}
});
</script>
