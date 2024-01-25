<template>
	<div class="admin-validation-manager" v-if="availableRules?.length">
		<base-form-field
			:id="'label-' + id"
			:labelFor="id"
			:label="$t('app.admin.field.validation')"
		>
			<admin-select-list
				:id="id"
				v-model="selectedValidationRules"
				:items="availableRules"
				item-value="ruleType"
				multiple
				chips
				:helpText="$t('app.admin.field.validationHelpText')"
				:disabled="!!props.field.fieldOptions.useAsContactField"
			/>
		</base-form-field>

		<!-- Char limit -->
		<admin-text-box
			v-if="hasCharLimit"
			v-model="charLimit"
			:label="
				$t(
					'component.adminValidationManager.validation.types.charLimit'
				)
			"
			:id="'charLimit-' + id"
		/>

		<!-- Min date -->
		<admin-date-picker
			v-if="hasMinDate"
			v-model="minDate"
			:label="
				$t('component.adminValidationManager.validation.types.minDate')
			"
			:id="'minDate-' + id"
			:max-date="hasMaxDate ? maxDate : undefined"
			:required="true"
		/>

		<!-- Max date -->
		<admin-date-picker
			v-if="hasMaxDate"
			v-model="maxDate"
			:label="
				$t('component.adminValidationManager.validation.types.maxDate')
			"
			:id="'maxDate-' + id"
			:min-date="hasMinDate ? minDate : undefined"
			:required="true"
		/>

		<!-- Org number -->
		<div v-if="hasOrgNumber" class="validation-box">
			<admin-select-list
				:id="'orgNumberFormat-' + id"
				:label="
					$t(
						'component.adminValidationManager.validation.orgNumberFormat.label'
					)
				"
				:help-text="
					$t(
						'component.adminValidationManager.validation.orgNumberFormat.helpText'
					)
				"
				:items="availableOrgNumberFormats"
				v-model="orgNumberFormat"
				multiple
			/>
			<admin-switch
				:id="'orgNumberOutput-' + id"
				:label="
					$t(
						'component.adminValidationManager.validation.orgNumberFormat.doFormatOutput'
					)
				"
				:help-text="
					$t(
						'component.adminValidationManager.validation.orgNumberFormat.doFormatOutputHelpText'
					)
				"
				v-model="orgNumberDoFormatOutput"
			/>
			<admin-select-list
				v-if="orgNumberDoFormatOutput"
				:id="'orgNumberOutputFormat-' + id"
				:label="
					$t(
						'component.adminValidationManager.validation.orgNumberFormat.formatOutput'
					)
				"
				:items="availableOrgNumberFormats"
				v-model="orgNumberOutputFormat"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminDatePicker from '@/components/field/admin/AdminDatePicker.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import { useSingleValueField } from '@/components/field/composable/SingleValueField';
import {
	FormMode,
	FormFieldType,
	ValidationRuleType,
	ValidationRuleAllowedFields,
	ValidOrgNumberFormats,
} from '@/models/Enums';
import { IRootState, ISingleValueField } from '@/models/IForm';
import { IValidationRule } from '@/models/IValidation';
import { computed, PropType, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { Helper } from '@/utils/helper';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	field: {
		type: Object as PropType<ISingleValueField>,
		required: true,
	},
});

const { t } = useI18n();

const store = useStore<IRootState>();

const emit = defineEmits(['updatedValue']);

const { fieldOptions, storeUpdateFormField } = useSingleValueField({
	mode: FormMode.Admin,
	field: toRef(props, 'field'),
	emit,
});

const allRules = computed(
	() =>
		// All available validation rules except required
		store.state.validationRuleTypes?.filter(
			(rule) => rule.type !== ValidationRuleType.Required
		)
);

const availableRules = computed(() => {
	return allRules.value
		?.filter((rule) => {
			// Filter out rules that are not applicable to current field
			const allowFields = ValidationRuleAllowedFields[rule.type];
			if (allowFields?.length) {
				return (
					allowFields.indexOf(props.field.type as FormFieldType) > -1
				);
			}
			return true;
		})
		.map((rule) => ({
			title: t(
				`component.adminValidationManager.validation.types.${rule.type}`
			),
			ruleType: rule.type,
		}));
});

const selectedValidationRules = computed({
	get: () => {
		// field personal number always has ValidPersNumber selected.
		if (props.field.type === FormFieldType.PersonalNumber) {
			return [ValidationRuleType.ValidPersNumber];
		}

		return (
			fieldOptions.value.validation
				?.map((rule) => rule.type)
				.filter(
					// Don't show required rule in list
					(ruleType) => ruleType !== ValidationRuleType.Required
				) ?? []
		);
	},
	set: (ruleTypes: ValidationRuleType[]) => {
		if (allRules.value?.length) {
			const rules: IValidationRule[] = [];

			// Convert ValidationRuleType to IValidationRule
			for (const ruleType of ruleTypes) {
				const alreadySelectedRule = fieldOptions.value.validation?.find(
					(rule) => rule.type === ruleType
				);
				if (alreadySelectedRule) {
					rules.push(alreadySelectedRule);
				} else {
					const rule = allRules.value?.find(
						(availableRule) => availableRule.type === ruleType
					);
					if (rule) {
						rules.push(rule);
					}
				}
			}

			const newFieldOptions = { ...fieldOptions.value };
			// If "required" rule is active, we don't want to remove it by overwriting rules
			const requiredRule = newFieldOptions.validation?.find(
				(rule) => rule.type === ValidationRuleType.Required
			);
			if (requiredRule) {
				rules.push(requiredRule);
			}

			newFieldOptions.validation = rules;
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		}
	},
});

const getValidationValue = (type: ValidationRuleType): string => {
	const rule = props.field.fieldOptions.validation?.find(
		(rule) => rule.type === type
	);
	if (rule != null) {
		return rule.value?.toString() ?? '';
	}
	return '';
};
const setValidationValue = (type: ValidationRuleType, value: string): void => {
	const newFieldOptions = Helper.deepCopy(props.field.fieldOptions);
	const rule = newFieldOptions.validation?.find((rule) => rule.type === type);
	if (rule != null) {
		rule.value = value;
		storeUpdateFormField(newFieldOptions, 'fieldOptions');
	}
};

// Char limit
const hasCharLimit = computed(() => {
	return !!props.field.fieldOptions.validation?.find(
		(rule) => rule.type === ValidationRuleType.CharLimit
	);
});
const charLimit = computed({
	get: () => getValidationValue(ValidationRuleType.CharLimit),
	set: (value: string) =>
		setValidationValue(ValidationRuleType.CharLimit, value),
});

// Min date
const hasMinDate = computed(() => {
	return !!props.field.fieldOptions.validation?.find(
		(rule) => rule.type === ValidationRuleType.MinDate
	);
});
const minDate = computed({
	get: () => getValidationValue(ValidationRuleType.MinDate),
	set: (value: string) =>
		setValidationValue(ValidationRuleType.MinDate, value),
});

// Max date
const hasMaxDate = computed(() => {
	return !!props.field.fieldOptions.validation?.find(
		(rule) => rule.type === ValidationRuleType.MaxDate
	);
});
const maxDate = computed({
	get: () => getValidationValue(ValidationRuleType.MaxDate),
	set: (value: string) =>
		setValidationValue(ValidationRuleType.MaxDate, value),
});

const hasOrgNumber = computed(() => {
	return !!props.field.fieldOptions.validation?.find(
		(rule) => rule.type === ValidationRuleType.ValidOrgNumber
	);
});
const availableOrgNumberFormats = computed(() =>
	Object.values(ValidOrgNumberFormats).map((format) => ({
		title: t(
			'component.adminValidationManager.validation.orgNumberFormat.' +
				format
		),
		value: format,
	}))
);
const orgNumberFormat = computed({
	get: () =>
		getValidationValue(ValidationRuleType.ValidOrgNumber)
			.split(',')
			.filter((s) => s.length),
	set: (value: string[]) => {
		setValidationValue(ValidationRuleType.ValidOrgNumber, value.join(','));
	},
});

const getValidationData = (
	type: ValidationRuleType
): { [key: string]: unknown } => {
	const rule = props.field.fieldOptions.validation?.find(
		(rule) => rule.type === type
	);
	if (rule?.data) {
		return rule.data;
	}
	return {};
};
const setValidationData = (
	type: ValidationRuleType,
	value: { [key: string]: unknown }
): void => {
	const newFieldOptions = Helper.deepCopy(props.field.fieldOptions);
	const rule = newFieldOptions.validation?.find((rule) => rule.type === type);
	if (rule != null) {
		rule.data = value;
		storeUpdateFormField(newFieldOptions, 'fieldOptions');
	}
};

const orgNumberOutputFormat = computed({
	get: () =>
		(getValidationData(ValidationRuleType.ValidOrgNumber)
			?.outputFormat as string) ?? '',
	set: (outputFormat: string) => {
		const data = {
			...getValidationData(ValidationRuleType.ValidOrgNumber),
			outputFormat,
		};
		setValidationData(ValidationRuleType.ValidOrgNumber, data);
	},
});
const orgNumberDoFormatOutput = computed({
	get: () =>
		!!getValidationData(ValidationRuleType.ValidOrgNumber)?.doFormatOutput,
	set: (doFormatOutput: boolean) => {
		const data = {
			...getValidationData(ValidationRuleType.ValidOrgNumber),
			doFormatOutput,
		};
		setValidationData(ValidationRuleType.ValidOrgNumber, data);
		if (!orgNumberOutputFormat.value) {
			orgNumberOutputFormat.value = ValidOrgNumberFormats.Short;
		}
	},
});
</script>

<style scoped lang="scss">
.admin-validation-manager {
	.v-select {
		:deep(.v-field__input) {
			padding: 0;

			.v-select__selection,
			.v-autocomplete__selection {
				margin: 0;
				padding: 8px 8px 14px;
			}
		}
	}

	.validation-box {
		border-left: solid 2px #ccc;
		padding-left: 12px;
	}
}
</style>
