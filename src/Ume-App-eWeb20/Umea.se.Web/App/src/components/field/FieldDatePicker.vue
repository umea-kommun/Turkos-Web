<template>
	<div class="field-date-picker" :class="fieldModeClass(mode)">
		<!--ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-single-field-options
						@updated-value="(a) => emit('updatedValue', a)"
						:field="props.field"
					/>
				</template>

				<template v-slot:display>
					<display-options :field="props.field" />
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
			:rules="adminPreview ? '' : getValidationRules()"
			:standalone="adminPreview"
		>
			<base-form-field
				:id="'label' + id"
				:label="title"
				:labelSuffix="$t('component.fieldDatePicker.dateExpression')"
				:label-for="getValidationId"
				:isRequired="isRequired"
				:errorDisplay="!!errors.length"
				:admin-preview-label="
					adminPreview && $t(`component.fieldDatePicker.newField`)
				"
			>
				<t-date-picker
					ref="datepicker"
					:id="getValidationId"
					v-bind="field"
					:success="!readOnly && isSuccess(meta)"
					:error="!!errors.length"
					:aria-labelledby="'label' + id"
					:aria-readonly="readOnly"
					:aria-describedby="
						!!errors.length ? 'error-' + getValidationId : null
					"
					autocomplete="off"
					:readonly="readOnly"
					:required="isRequired"
					:min="minDate"
					:max="maxDate"
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
				:value="value"
			></form-field-preview>
		</div>

		<!-- PRINT -->
		<div v-if="mode === 'PRINT'">
			<PrintTextBox :title="title" :helpText="helpText"></PrintTextBox>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ValidationRuleType } from '@/models/Enums';
import PrintTextBox from './print/PrintTextBox.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import HelpText from '@/components/field/helpAndError/HelpAndErrorText.vue';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import AdminSingleFieldOptions from '../admin/AdminFieldOptions/AdminSingleFieldOptions.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import { TDatePicker } from '@turkos/components';
import { Field } from 'vee-validate';
import { computed, PropType, ref, toRef } from 'vue';
import { FormMode } from '@/models/Enums';
import { ISingleValueField } from '@/models/IForm';
import { useSingleValueField } from './composable/SingleValueField';
import { useFieldValidation } from './composable/FieldValidation';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';
import Config from '@/utils/Config';

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

const DEFAULT_MIN_DATE = Config.VUE_APP_FIELD_DEFAULT_MIN_DATE;
const DEFAULT_MAX_DATE = Config.VUE_APP_FIELD_DEFAULT_MAX_DATE;

// Use our composable singleValueField, we pass props and the emit function
const { id, value, helpText, title, fieldOptions } = useSingleValueField({
	mode: props.mode,
	field: toRef(props, 'field'),
	emit,
});

// Use our composable fieldValidation
const { getValidationId, validationRules, isSuccess, isRequired, readOnly } =
	useFieldValidation({
		validationId: props.validationId,
		validationScope: props.validationScope,
		fieldOptions,
		id,
	});

const datepicker = ref<{ valid: boolean } | null>(null);
function getValidationRules(): string {
	// If no min/max date specified, set to default.
	const rules = validationRules.value.split('|');
	if (!rules.find((rule) => rule.indexOf(ValidationRuleType.MinDate) === 0)) {
		rules.push(`${ValidationRuleType.MinDate}:${DEFAULT_MIN_DATE}`);
	}
	if (!rules.find((rule) => rule.indexOf(ValidationRuleType.MaxDate) === 0)) {
		rules.push(`${ValidationRuleType.MaxDate}:${DEFAULT_MAX_DATE}`);
	}
	const rulesString = rules.join('|');

	if (datepicker?.value?.valid === false) {
		// If the date is invalid, use the invalidDate rule to display a error message
		if (isRequired.value) {
			// We want to show error message that says that the date is invalid and not that the field is required.
			const rulesWithoutRequired = rules
				.filter((rule) => rule !== ValidationRuleType.Required)
				.join('|');
			return 'validDate|' + rulesWithoutRequired + '|invalidDate';
		}
		return 'validDate|' + rulesString + '|invalidDate';
	} else {
		return 'validDate|' + rulesString;
	}
}

const minDate = computed(() => {
	const rule = fieldOptions.value.validation?.find(
		(rule) => rule.type === ValidationRuleType.MinDate
	);

	if (!rule || !rule.value) {
		return DEFAULT_MIN_DATE;
	}

	return rule.value.toString();
});
const maxDate = computed(() => {
	const rule = fieldOptions.value.validation?.find(
		(rule) => rule.type === ValidationRuleType.MaxDate
	);

	if (!rule || !rule.value) {
		return DEFAULT_MAX_DATE;
	}
	return rule.value.toString();
});
</script>

<style scoped lang="scss"></style>
