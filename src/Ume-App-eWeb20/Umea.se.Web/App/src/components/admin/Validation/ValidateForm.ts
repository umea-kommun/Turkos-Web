import {
	FormFieldType,
	FormFollowUpActivation,
	FormType,
	IntegrationType,
	MutationType,
	ValidationRuleType,
} from '@/models/Enums';
import {
	IAdminFormError,
	IDisplayRuleGroup,
	IForm,
	IFormField,
	IRootState,
	ISingleValueField,
} from '@/models/IForm';
import { computed, ComputedRef, watch } from 'vue';
import { useStore } from 'vuex';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { validFormPath } from '@/plugins/validation';
import moment from 'moment';
import Config from '@/utils/Config';
import { Helper } from '@/utils/helper';

interface IValidateFormParams {
	form: ComputedRef<IForm>;
}

const validDate = (dateStr: string): boolean => {
	const maxDate = moment(Config.VUE_APP_FIELD_DEFAULT_MAX_DATE);
	const minDate = moment(Config.VUE_APP_FIELD_DEFAULT_MIN_DATE);
	const date = moment(dateStr, true);
	if (
		date.isValid() &&
		date.isSameOrBefore(maxDate) &&
		date.isSameOrAfter(minDate)
	) {
		return true;
	}
	return false;
};

export const useValidateForm = ({ form }: IValidateFormParams): void => {
	const store = useStore<IRootState>();
	const { t } = useI18n();

	const isLinkExternal = computed(
		() => form.value?.attributes.type === FormType.LinkExternal
	);

	const formErrors = computed({
		get: () => store.state.admin?.formErrors ?? [],
		set: (newErrors: IAdminFormError[]) => {
			store.commit(MutationType.UpdateAdminState, {
				prop: 'formErrors',
				value: newErrors,
			});
		},
	});

	const validateDisplayGroup = (
		group: IDisplayRuleGroup,
		field: IFormField,
		stepIndex: number
	): IAdminFormError[] => {
		let errors: IAdminFormError[] = [];

		group.conditions.forEach((condition) => {
			if (!condition.conditionQuestion) {
				errors.push({
					type: 'Field',
					attribute: 'conditionQuestion',
					msg: t(
						'component.adminValidationManager.formValidation.fieldMissingDisplayRuleQuestion'
					),
					fieldTab: 2,
					fieldId: field.id,
					stepIndex,
				});
			}
			if (!condition.conditionChoice) {
				errors.push({
					type: 'Field',
					attribute: 'conditionQuestion',
					msg: t(
						'component.adminValidationManager.formValidation.fieldMissingDisplayRuleChoice'
					),
					fieldTab: 2,
					fieldId: field.id,
					stepIndex,
				});
			}
			if (!condition.conditionResponse) {
				errors.push({
					type: 'Field',
					attribute: 'conditionQuestion',
					msg: t(
						'component.adminValidationManager.formValidation.fieldMissingDisplayRuleResponse'
					),
					fieldTab: 2,
					fieldId: field.id,
					stepIndex,
				});
			}
		});

		group.groups.forEach((childGroup) => {
			const groupErrors = validateDisplayGroup(
				childGroup,
				field,
				stepIndex
			);
			if (groupErrors.length) {
				errors = errors.concat(groupErrors);
			}
		});
		return errors;
	};

	const validateField = (
		field: IFormField,
		stepIndex: number
	): IAdminFormError[] => {
		let fieldErrors: IAdminFormError[] = [];

		// Missing title
		if (field.type !== FormFieldType.Section && !field.title?.length) {
			fieldErrors.push({
				type: 'Field',
				attribute: 'title',
				fieldTab: 1,
				msg: t(
					'component.adminValidationManager.formValidation.fieldMissingTitle'
				),
				fieldId: field.id,
				stepIndex: stepIndex,
			});
		}

		// Missing parameter in data source
		if (
			field.fieldOptions.dataSource?.dataSourceName &&
			field.fieldOptions.dataSource?.options
				?.dependsOnDataSourceSearchParameter &&
			!field.fieldOptions.dataSource?.options
				?.dependsOnDataSourceSearchParameters?.length
		) {
			fieldErrors.push({
				type: 'Field',
				attribute: 'searchParameter',
				fieldTab: 3,
				msg: t(
					'component.adminValidationManager.formValidation.dataSourceMissingParameter'
				),
				fieldId: field.id,
				stepIndex: stepIndex,
			});
		}
		// Parameter of wrong field type in data source
		else if (
			field.fieldOptions.dataSource?.dataSourceName &&
			field.fieldOptions.dataSource?.options
				?.dependsOnDataSourceSearchParameter &&
			field.fieldOptions.dataSource?.options
				?.dependsOnDataSourceSearchParameters?.length
		) {
			const paramField = Helper.findFieldByGuid(
				field.fieldOptions.dataSource?.options
					?.dependsOnDataSourceSearchParameters[0],
				form.value
			);

			if (
				!(
					paramField?.type === FormFieldType.TextBox ||
					(paramField?.type === FormFieldType.SelectList &&
						paramField?.fieldOptions?.allowMultipleChoices !==
							true) ||
					paramField?.type === FormFieldType.SelectSearchList ||
					paramField?.type === FormFieldType.RadioButton
				)
			) {
				fieldErrors.push({
					type: 'Field',
					attribute: 'searchParameter',
					fieldTab: 3,
					msg: t(
						'component.adminValidationManager.formValidation.dataSourceBadParameter'
					),
					fieldId: field.id,
					stepIndex: stepIndex,
				});
			}
		}

		// Missing attribute in data source
		if (
			field.fieldOptions.dataSource?.dataSourceName &&
			!field.fieldOptions.dataSource?.options?.itemProperty &&
			field.type !== FormFieldType.Table
		) {
			fieldErrors.push({
				type: 'Field',
				attribute: 'dataSourceField',
				fieldTab: 3,
				msg: t(
					'component.adminValidationManager.formValidation.dataSourceMissingAttribute'
				),
				fieldId: field.id,
				stepIndex: stepIndex,
			});
		}

		// Missing display rule response
		if (field.displayRuleGroup?.displayRuleGroupGuid) {
			const displayErrors = validateDisplayGroup(
				field.displayRuleGroup,
				field,
				stepIndex
			);
			if (displayErrors.length) {
				fieldErrors = fieldErrors.concat(displayErrors);
			}
		}

		// Table missing minRows and not using autofill
		if (
			field.type === FormFieldType.Table &&
			!(field.fieldOptions.minRows > 0) &&
			!field.fieldOptions.autofillNumberOfRows
		) {
			fieldErrors.push({
				type: 'Field',
				attribute: 'minRows',
				fieldTab: 1,
				msg: t(
					'component.adminValidationManager.formValidation.tableMissingMinRows'
				),
				fieldId: field.id,
				stepIndex: stepIndex,
			});
		}

		// Validate date field
		if (field.type === FormFieldType.DatePicker) {
			if ((field as ISingleValueField).value) {
				// Validate predefined date value
				if (!validDate((field as ISingleValueField).value)) {
					fieldErrors.push({
						type: 'Field',
						attribute: 'value',
						fieldTab: 1,
						msg: t(
							'component.adminValidationManager.formValidation.invalidFieldDate',
							{ fieldName: field.title }
						),
						fieldId: field.id,
						stepIndex: stepIndex,
					});
				}
			}
			const maxDateRule = (
				field as ISingleValueField
			)?.fieldOptions?.validation?.find(
				(v) => v.type === ValidationRuleType.MaxDate
			);
			const minDateRule = (
				field as ISingleValueField
			)?.fieldOptions?.validation?.find(
				(v) => v.type === ValidationRuleType.MinDate
			);
			// Validate max date rule
			if (
				maxDateRule &&
				(!maxDateRule.value || !validDate(maxDateRule.value as string))
			) {
				fieldErrors.push({
					type: 'Field',
					attribute: 'maxDate-validation',
					fieldTab: 1,
					msg: t(
						'component.adminValidationManager.formValidation.invalidFieldDate',
						{ fieldName: field.title }
					),
					fieldId: field.id,
					stepIndex: stepIndex,
				});
			}
			// Validate min date rule
			if (
				minDateRule &&
				(!minDateRule.value || !validDate(minDateRule.value as string))
			) {
				fieldErrors.push({
					type: 'Field',
					attribute: 'minDate-validation',
					fieldTab: 1,
					msg: t(
						'component.adminValidationManager.formValidation.invalidFieldDate',
						{ fieldName: field.title }
					),
					fieldId: field.id,
					stepIndex: stepIndex,
				});
			}
		}

		return fieldErrors;
	};

	const validateSettings = (): IAdminFormError[] => {
		const errors: IAdminFormError[] = [];
		const attr = form.value?.attributes;
		if (!attr) {
			return errors;
		}

		// General options
		if (!attr.title?.length) {
			errors.push({
				type: 'Setting',
				attribute: 'title',
				msg: t(
					'component.adminValidationManager.formValidation.formMissingTitle'
				),
			});
		}
		if (!attr.path?.length) {
			errors.push({
				type: 'Setting',
				attribute: 'path',
				msg: t(
					'component.adminValidationManager.formValidation.formMissingPath'
				),
			});
		} else if (!validFormPath(attr.path)) {
			errors.push({
				type: 'Setting',
				attribute: 'path',
				msg: t(
					'component.adminValidationManager.formValidation.validFormPath'
				),
			});
		} else if (!store.state.admin?.pathUnique) {
			errors.push({
				type: 'Setting',
				attribute: 'path',
				msg: t('app.error.400.FormPathNotUnique'),
			});
		}
		if (
			(!attr.receiver || Object.keys(attr.receiver).length === 0) &&
			!isLinkExternal.value
		) {
			errors.push({
				type: 'Setting',
				attribute: 'receiver',
				msg: t(
					'component.adminValidationManager.formValidation.formMissingReceiver'
				),
			});
		}
		if (!attr.pM3 || Object.keys(attr.pM3).length === 0) {
			errors.push({
				type: 'Setting',
				attribute: 'pm3',
				msg: t(
					'component.adminValidationManager.formValidation.formMissingPm3'
				),
			});
		}
		if (!attr.lifeSituations?.length) {
			errors.push({
				type: 'Setting',
				attribute: 'lifeSituation',
				msg: t(
					'component.adminValidationManager.formValidation.formMissingLifeSituation'
				),
			});
		}
		if (!attr.categories?.length) {
			errors.push({
				type: 'Setting',
				attribute: 'category',
				msg: t(
					'component.adminValidationManager.formValidation.formMissingCategory'
				),
			});
		}
		if (!attr.gDPR?.dataControllers?.length && !isLinkExternal.value) {
			errors.push({
				type: 'Setting',
				attribute: 'gdpr',
				msg: t(
					'component.adminValidationManager.formValidation.formMissingGdpr'
				),
			});
		}

		// User requirements
		if (
			(!attr.userRequirement.authClient?.length ||
				(attr.userRequirement.authClient.length === 1 &&
					attr.userRequirement.authClient[0] === '')) &&
			!isLinkExternal.value
			// when an e-service is created authClient = [''], so we need to check for that
		) {
			errors.push({
				type: 'Setting',
				attribute: 'authClients',
				msg: t(
					'component.adminValidationManager.formValidation.formMissingAuthClients'
				),
			});
		}
		if (
			attr.userRequirement.multipleLegitimation &&
			!attr.userRequirement.contactPaths?.length
		) {
			errors.push({
				type: 'Setting',
				attribute: 'contactPaths',
				msg: t(
					'component.adminValidationManager.formValidation.formMissingContactPaths'
				),
			});
		}
		if (attr.userRequirement.multipleLegitimation) {
			if (
				!(
					parseInt(attr.userRequirement.numberOfDaysToAnswer) >= 5 &&
					parseInt(attr.userRequirement.numberOfDaysToAnswer) <= 30
				)
			) {
				errors.push({
					type: 'Setting',
					attribute: 'multipleLegitimationNumberOfDaysToAnswer',
					msg: t(
						'component.adminValidationManager.formValidation.formMissingNumberOfDaysToAnswer'
					),
				});
			}
		}

		if (
			form.value.attributes.integrations.length < 2 &&
			!isLinkExternal.value
		) {
			if (
				form.value.attributes.integrations.length === 0 ||
				form.value.attributes.integrations[0].type ===
					IntegrationType.EmailNotification
			) {
				errors.push({
					type: 'Email',
					attribute: 'emailIntegrations',
					msg: t(
						'component.adminValidationManager.formValidation.formMissingIntegration'
					),
				});
			}
		}

		if (
			form.value.attributes.followUp.activation ===
			FormFollowUpActivation.Manual
		) {
			// Required and only numbers allowed
			if (
				!/^\d+$/.test(
					form.value.attributes.followUp.averageTreatmentTime
				)
			) {
				errors.push({
					type: 'CES',
					attribute: 'averageTreatmentTime',
					msg: t(
						'component.adminValidationManager.formValidation.missingAverageTreatmentTime'
					),
				});
			}
		}

		// Validate schedule dates
		if (form.value.attributes.dateSchedule.active) {
			if (
				!form.value.attributes.dateSchedule.from ||
				!validDate(form.value.attributes.dateSchedule.from)
			) {
				errors.push({
					type: 'Setting',
					attribute: 'schedule-from',
					msg: t(
						'component.adminValidationManager.formValidation.invalidScheduleDate'
					),
				});
			}
			if (
				!form.value.attributes.dateSchedule.to ||
				!validDate(form.value.attributes.dateSchedule.to)
			) {
				errors.push({
					type: 'Setting',
					attribute: 'schedule-to',
					msg: t(
						'component.adminValidationManager.formValidation.invalidScheduleDate'
					),
				});
			}
		}

		if (isLinkExternal.value && !form.value?.attributes.linkUrl.length) {
			errors.push({
				type: 'Setting',
				attribute: 'link-external',
				msg: t(
					'component.adminValidationManager.formValidation.linkExternal'
				),
			});
		}

		return errors;
	};

	const validateIntegrations = (): IAdminFormError[] => {
		const errors: IAdminFormError[] = [];
		if (!form.value?.attributes) {
			return [];
		}

		form.value.attributes.integrations.forEach((integration) => {
			if (integration.type === IntegrationType.NavetFardtjanst) {
				const navetFields = integration.options
					.find((option) => option.key === 'navetFields')
					?.value?.split(',');
				if (navetFields?.length) {
					// Check if there exists fields with the same name
					// Navet can't handle multiple fields with the same name
					const selectedFieldNames: string[] = [];
					form.value.attributes.steps.forEach((step) => {
						step.fields.forEach((field) => {
							if (navetFields.indexOf(field.guid) > -1) {
								selectedFieldNames.push(field.title);
							}
						});
					});
					const duplicates = selectedFieldNames.filter(
						(item, index) =>
							selectedFieldNames.indexOf(item) !== index
					);
					if (duplicates?.length) {
						errors.push({
							type: 'Integration',
							attribute: 'integration-' + integration.id,
							msg: t(
								'component.adminValidationManager.formValidation.navetFieldsWithSameName',
								{
									fieldName: duplicates[0],
								}
							),
						});
					}
				}
			}
		});

		return errors;
	};

	const validateForm = (): void => {
		let errors: IAdminFormError[] = [];

		// Validate settings
		const settingErrors = validateSettings();
		if (settingErrors.length) {
			errors = errors.concat(settingErrors);
		}

		// Validate integrations
		const integrationErrors = validateIntegrations();
		if (integrationErrors.length) {
			errors = errors.concat(integrationErrors);
		}

		// Validate all fields
		form.value?.attributes.steps.forEach((step, stepIndex) => {
			step.fields.forEach((field) => {
				const fieldErrors = validateField(field, stepIndex);
				if (fieldErrors.length) {
					errors = errors.concat(fieldErrors);
				}
			});
		});

		formErrors.value = errors;
	};
	validateForm();

	const validateFormDebounce = useDebounceFn(() => {
		// Debounced function so we only run validation at most every 1000ms
		validateForm();
	}, 1000);

	watch(
		() => store.state.form,
		() => {
			validateFormDebounce();
		},
		{
			deep: true,
		}
	);
};
