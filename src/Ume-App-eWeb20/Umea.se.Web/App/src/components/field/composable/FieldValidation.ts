import { ValidationRuleType } from '@/models/Enums';
import { IFieldOptions } from '@/models/IForm';
import { IValidation } from '@/models/IValidation';
import { FieldMeta } from 'vee-validate';
import { computed, ComputedRef } from 'vue';

interface IUseFieldValidationParams {
	validationScope: string;
	validationId: string;
	id: ComputedRef<string>;
	fieldOptions: ComputedRef<IFieldOptions>;
	isPersonalNumber?: boolean;
}
interface IUseFieldValidation {
	isRequired: ComputedRef<boolean>;
	readOnly: ComputedRef<boolean>;
	getValidationId: ComputedRef<string>;
	validationRules: ComputedRef<string>;
	isSuccess: (meta: FieldMeta<unknown>) => boolean;
	getValidationIcon: (meta: FieldMeta<unknown>, errors: string[]) => string;
}

export const useFieldValidation = ({
	validationScope,
	validationId,
	id,
	fieldOptions,
	isPersonalNumber,
}: IUseFieldValidationParams): IUseFieldValidation => {
	/**
	 * Get validation id for field. Used by Vee-validation.
	 * @return {string} Id for field used in validation
	 */
	const getValidationId = computed(() => {
		return (
			validationScope +
			'.' +
			id.value +
			(validationId ? '.' + validationId : '')
		);
	});
	const validation = computed(() => {
		return {
			rules: fieldOptions.value.validation || [],
		} as IValidation;
	});

	function extractValidationRules(): string {
		if (validation.value?.rules?.length > 0) {
			const output = Array.prototype.map
				.call(validation.value.rules, (rule) => {
					switch (rule.type) {
						case ValidationRuleType.CharLimit:
						case ValidationRuleType.MaxDate:
						case ValidationRuleType.MinDate:
						case ValidationRuleType.ValidOrgNumber:
							return rule.type + ':' + (rule.value ?? '');
					}
					return rule.type;
				})
				.join('|');

			return output;
		} else {
			return '';
		}
	}

	const validationRules = computed(() => {
		if (isPersonalNumber) {
			return extractValidationRules() + '|' + 'validPersNumber';
		} else {
			return extractValidationRules();
		}
	});

	/**
	 * Check if this field is required
	 * @return {boolean} True if required, false if not
	 */
	const isRequired = computed(() => {
		return validationRules.value.indexOf('required') !== -1;
	});

	const readOnly = computed(() => {
		return fieldOptions.value.readOnly
			? fieldOptions.value.readOnly
			: false;
	});

	/**
	 * Check if the value has any errors
	 */
	function isError(errors: string[]): boolean {
		return !!errors.length;
	}

	/**
	 * Check if the value has changed and validation is correct
	 */
	function isSuccess(meta: FieldMeta<unknown>): boolean {
		return meta.valid;
	}

	/**
	 * Validation icon to show if field was validated correctly or has error
	 */
	function getValidationIcon(
		meta: FieldMeta<unknown>,
		errors: string[]
	): string {
		return isSuccess(meta)
			? 'check_circle'
			: isError(errors)
			? 'warning'
			: '';
	}

	return {
		isRequired,
		readOnly,
		getValidationId,
		validationRules,
		isSuccess,
		getValidationIcon,
	};
};
