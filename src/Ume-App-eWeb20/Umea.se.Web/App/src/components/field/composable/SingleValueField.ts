import {
	ContactFields,
	FormMode,
	MutationType,
	ValidationRuleType,
} from '@/models/Enums';
import { IFieldOptions, IRootState, ISingleValueField } from '@/models/IForm';
import { IValidationRule } from '@/models/IValidation';
import { Helper } from '@/utils/helper';
import { computed, ComputedRef, Ref, WritableComputedRef } from 'vue';
import { useStore } from 'vuex';

interface ISingleValueFieldParams {
	mode: FormMode | string;
	field: Ref<ISingleValueField>;
	emit?: any;
}
interface ISingleValueFieldReturn {
	fieldOptions: ComputedRef<IFieldOptions>;
	id: ComputedRef<string>;
	title: WritableComputedRef<string>;
	value: WritableComputedRef<string>;
	helpText: WritableComputedRef<string>;
	readOnly: WritableComputedRef<boolean>;
	required: WritableComputedRef<boolean>;
	allowDecimals: WritableComputedRef<boolean>;
	useAsContactField: WritableComputedRef<ContactFields | undefined>;
	storeUpdateFormField(value: any, property: string): void;
}

export const useSingleValueField = ({
	field,
	emit,
}: ISingleValueFieldParams): ISingleValueFieldReturn => {
	const store = useStore<IRootState>();

	const fieldOptions = computed(() => {
		return field.value.fieldOptions
			? Helper.deepCopy(field.value.fieldOptions)
			: {};
	});

	/**
	 * Get Id from state
	 * @return {string} Id for field
	 */
	const id = computed(() => {
		return (field ? (field.value.id ? field.value.id : '') : '').toString();
	});

	/**
	 * Updates store NO debounce
	 * @param value The value we want to update in the store
	 * @param property Name of the property we want to update. ex: 'title'
	 */
	function storeUpdateFormField(value: any, property: string): void {
		store.commit(MutationType.UpdateFormField, {
			fieldId: id.value,
			newValue: value,
			fieldProperty: property,
		});
	}

	/**
	 * Updates store NO debounce
	 * @param value The value we want to update in the store
	 * @param item Name of the item we want to update. ex: 'address'
	 */
	function storeUpdateFormUserContactInfo(value: string, item: string): void {
		store.commit(MutationType.UpdateFormUserContactInfo, {
			newValue: value,
			item,
		});
	}

	/**
	 * Get title from state
	 * @return {string} Title for field
	 */
	const title = computed({
		get: () => {
			return field ? (field.value.title ? field.value.title : '') : '';
		},
		set: (newTitle: string) => {
			storeUpdateFormField(newTitle, 'title');
		},
	});

	/**
	 * Get helpText from state
	 * @return {string} HelpText for field
	 */
	const helpText = computed({
		get: () => {
			return field
				? field.value.helpText
					? field.value.helpText
					: ''
				: '';
		},
		set: (newHelpText: string) => {
			storeUpdateFormField(newHelpText, 'helpText');
		},
	});

	/**
	 * Get and set value from state
	 */
	const value = computed({
		get: () => field.value?.value ?? '',
		set: (value: string) => {
			emit('updatedValue', { newValue: value });

			if (fieldOptions.value.useAsContactField) {
				storeUpdateFormUserContactInfo(
					value,
					fieldOptions.value.useAsContactField
				);
			}
		},
	});

	const readOnly = computed({
		get: () => {
			return fieldOptions.value.readOnly
				? fieldOptions.value.readOnly
				: false;
		},
		set: (newValue: boolean) => {
			const newFieldOptions = { ...fieldOptions.value };
			newFieldOptions.readOnly = newValue;
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		},
	});

	const useAsContactField = computed({
		get: () => {
			return fieldOptions.value.useAsContactField;
		},
		set: (newValue: ContactFields | undefined) => {
			const newFieldOptions = { ...fieldOptions.value };
			if (newValue) {
				newFieldOptions.useAsContactField = newValue;

				// Get all rules from state
				const allRules = store.state.validationRuleTypes;

				if (newValue === ContactFields.Email) {
					// Only apply email and required rule
					newFieldOptions.validation = allRules?.filter(
						(rule) =>
							rule.type === ValidationRuleType.Email ||
							rule.type === ValidationRuleType.Required
					);
				} else if (newValue === ContactFields.Phonenumber) {
					// Only apply phone number and required rule
					newFieldOptions.validation = allRules?.filter(
						(rule) =>
							rule.type === ValidationRuleType.Phonenumber ||
							rule.type === ValidationRuleType.Required
					);
				}
			} else {
				delete newFieldOptions.useAsContactField;

				// Clear all validation rules (should we do this?)
				newFieldOptions.validation = [];
			}
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		},
	});

	const validation = computed({
		get: () => {
			return fieldOptions.value.validation?.length
				? fieldOptions.value.validation
				: [];
		},
		set: (rules: IValidationRule[]) => {
			const newFieldOptions = { ...fieldOptions.value };
			newFieldOptions.validation = rules;
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		},
	});

	const required = computed({
		get: () => {
			return !!validation.value?.find(
				(v) => v.type === ValidationRuleType.Required
			);
		},
		set: (value: boolean) => {
			if (value) {
				const rules = store.state.validationRuleTypes
					? store.state.validationRuleTypes
					: [];
				const requiredRule = rules.find((rule) => {
					return rule.type === ValidationRuleType.Required;
				});
				if (requiredRule) {
					validation.value = [...validation.value, requiredRule];
				}
			} else {
				validation.value = validation.value?.filter(
					(rule) => rule.type !== ValidationRuleType.Required
				);
			}
		},
	});

	const allowDecimals = computed({
		get: () => {
			return fieldOptions.value.allowDecimals
				? fieldOptions.value.allowDecimals
				: false;
		},
		set: (newValue: boolean) => {
			const newFieldOptions = { ...fieldOptions.value };
			newFieldOptions.allowDecimals = newValue;
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		},
	});

	// We have to return everything that the parent should have access to.
	return {
		fieldOptions,
		id,
		title,
		value,
		helpText,
		readOnly,
		required,
		allowDecimals,
		useAsContactField,
		storeUpdateFormField,
	};
};
