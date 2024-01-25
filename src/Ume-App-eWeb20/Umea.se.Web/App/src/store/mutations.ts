// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck FIX THIS - remove this comment
import { IComment, ITableRow } from '@/models/IForm';
import {
	FormFieldType,
	Medium,
	MessageEvent,
	MutationType,
	ValidationRuleType,
	ValidOrgNumberFormats,
	MessageTextsVariablesForBackend,
} from '@/models/Enums';
import {
	IForm,
	IUserContactInfo,
	IContactInfo,
	IPm3,
	ITemplate,
	IUser,
	IUserLegitimation,
	IMultipleSigningByLink,
	IEServiceErrorMessage,
} from '@/models/IForm';
import {
	findStepIndex,
	FormFieldLookup,
	findFormFieldInStep,
	findStep,
	isVisibleDisplayRuleGroup,
	addConditionToGroup,
	deleteConditionFromGroup,
	addGroupToGroup,
	deleteGroupFromGroup,
	updateAdminMotherFields,
} from '@/store/utils';
import {
	ISingleValueField,
	IRootState,
	IIntegration,
	IFormStep,
	IFormField,
	IDisplayRule,
} from '@/models/IForm';
import { FormFieldInterface } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import { isVisible } from '@/store/utils';
import {
	getAnonymousContactInfo,
	getAgeToday,
	getAgeThisYear,
	getNewAgeInXDay,
	formatOrgNumber,
} from './helper';
import i18next from '@/plugins/i18next';
import Config from '@/utils/Config';

export default {
	[MutationType.GetGdpr]: (state: IRootState, payload) => {
		state.gdpr = payload || [];
	},
	[MutationType.UpdateGdpr]: (state: IRootState, payload) => {
		if (!state.gdpr) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}

		const index = state.gdpr.findIndex((f) => f.id === payload.id);

		if (index === -1) {
			state.gdpr.push(payload);
		} else {
			try {
				state.gdpr.splice(index, 1, payload);
			} catch (error) {
				throw new Error(
					'Unable to update gdpr ' + state.gdpr[index].title
				);
			}
		}
	},
	[MutationType.DeleteGdpr]: (state: IRootState, payload) => {
		if (!state.gdpr) {
			throw new Error(
				'Trying to delete a gdpr when no gdpr is present in the state store!'
			);
		}
		const gdprIndex = state.gdpr.findIndex((d) => d.id === payload.id);
		if (gdprIndex > -1) {
			// Delete GDPR in store.
			state.gdpr.splice(gdprIndex, 1);
		} else {
			throw new Error('Could not find gdpr to delete in state store!');
		}
	},
	[MutationType.SetError]: (state: IRootState, { error, userMessage }) => {
		state.error = error;
		if (userMessage) {
			state.errorUserMessage = userMessage;
		} else {
			state.errorUserMessage = null;
		}
	},
	getValidationRuleTypes: (state: IRootState, payload) => {
		state.validationRuleTypes = payload;
	},
	[MutationType.GetInitialFormGroups]: (state: IRootState, payload) => {
		state.initialForms = payload.forms;
		state.initialGroups = payload.groups;
	},
	[MutationType.GetForms]: (state: IRootState, payload) => {
		state.forms = payload;
	},
	[MutationType.GetPublicForm]: (
		state: IRootState,
		payload: IForm | null
	) => {
		// This is a alias for GetForm, that can be used by vuex-plugins to decorate
		// the form data before it gets displayed to end-user
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		addFormDataToState(state, payload);
	},
	[MutationType.GetForm]: (state: IRootState, payload: IForm | null) => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		addFormDataToState(state, payload);
	},
	[MutationType.GetPublicFormInfo]: (
		state: IRootState,
		payload: IForm | null
	) => {
		// This is used to fetch form info (title, description, ...)
		// that can be displayed while the rest of the form is loading.
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		addFormDataToState(state, payload);
	},
	[MutationType.GetPm3]: (state: IRootState, payload) => {
		state.pm3 = payload || [];
	},
	[MutationType.UpdatePm3]: (state: IRootState, payload) => {
		if (!state.pm3) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}

		const index = state.pm3.findIndex((f) => f.id === payload.id);

		if (!payload.id) {
			// Needed for mocked data
			payload.id =
				state.pm3.sort((s1: IPm3, s2: IPm3) => s2.id! - s1.id!)[0].id! +
				1;
		}

		if (index === -1) {
			state.pm3.push(payload);
		} else {
			try {
				state.pm3.splice(index, 1, payload);
			} catch (error) {
				throw new Error(
					'Unable to update pm3 ' + state.pm3[index].title
				);
			}
		}
	},
	[MutationType.DeletePm3]: (state: IRootState, payload) => {
		if (!state.pm3) {
			throw new Error(
				'Trying to delete a pm3 when no pm3 is present in the state store!'
			);
		}
		const pm3Index = state.pm3.findIndex((d) => d.id === payload.id);
		if (pm3Index > -1) {
			// Delete receiver in store.
			state.pm3.splice(pm3Index, 1);
		} else {
			throw new Error('Could not find pm3 to delete in state store!');
		}
	},
	[MutationType.GetLifeSituation]: (state: IRootState, payload) => {
		state.lifeSituations = payload || [];
	},
	[MutationType.UpdateLifeSituation]: (state: IRootState, payload) => {
		if (!state.lifeSituations) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}

		const index = state.lifeSituations.findIndex(
			(f) => f.id === payload.id
		);

		if (index === -1) {
			state.lifeSituations.push(payload);
		} else {
			try {
				state.lifeSituations.splice(index, 1, payload);
			} catch (error) {
				throw new Error(
					'Unable to update lifeSituation ' +
						state.lifeSituations[index].title
				);
			}
		}
	},
	[MutationType.DeleteLifeSituation]: (state: IRootState, payload) => {
		if (!state.lifeSituations) {
			throw new Error(
				'Trying to delete a lifeSituation when no lifesituation is present in the state store!'
			);
		}
		const lifeSituationIndex = state.lifeSituations.findIndex(
			(d) => d.id === payload.id
		);
		if (lifeSituationIndex > -1) {
			// Delete receiver in store.
			state.lifeSituations.splice(lifeSituationIndex, 1);
		} else {
			throw new Error(
				'Could not find lifeSituation to delete in state store!'
			);
		}
	},
	[MutationType.GetCategories]: (state: IRootState, payload) => {
		state.categories = payload || [];
	},
	[MutationType.UpdateCategory]: (state: IRootState, payload) => {
		if (!state.categories) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		const index = state.categories.findIndex((f) => f.id === payload.id);
		if (index === -1) {
			state.categories.push(payload);
		} else {
			try {
				state.categories.splice(index, 1, payload);
			} catch (error) {
				throw new Error(
					'Unable to update lifeSituation ' +
						state.categories[index].title
				);
			}
		}
	},
	[MutationType.DeleteCategory]: (state: IRootState, payload) => {
		if (!state.categories) {
			throw new Error(
				'Trying to delete a lifeSituation when no lifesituation is present in the state store!'
			);
		}
		const categoryIndex = state.categories.findIndex(
			(d) => d.id === payload.id
		);
		if (categoryIndex > -1) {
			// Delete receiver in store.
			state.categories.splice(categoryIndex, 1);
		} else {
			throw new Error(
				'Could not find category to delete in state store!'
			);
		}
	},
	[MutationType.GetReceivers]: (state: IRootState, payload) => {
		state.receivers = payload || [];
	},
	[MutationType.UpdatedReceiver]: (state: IRootState, payload) => {
		if (!state.receivers) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}

		const index = state.receivers.findIndex(
			(item) => item.id === payload.id
		);

		if (index === -1) {
			state.receivers.push(payload);
		} else {
			try {
				state.receivers.splice(index, 1, payload);
			} catch (error) {
				throw new Error(
					'Unable to update receiver ' + state.receivers[index].title
				);
			}
		}
	},
	[MutationType.DeleteReceiver]: (state: IRootState, payload) => {
		if (!state.receivers) {
			throw new Error(
				'Trying to delete a receiver when no receivers is present in the state store!'
			);
		}
		const receiverIndex = state.receivers.findIndex(
			(d) => d.id === payload.id
		);
		if (receiverIndex > -1) {
			// Delete receiver in store.
			state.receivers.splice(receiverIndex, 1);
		} else {
			throw new Error(
				'Could not find receiver to delete in state store!'
			);
		}
	},
	[MutationType.GetTemplates]: (state: IRootState, payload) => {
		state.templates = payload || [];
	},
	[MutationType.GetEcos]: (state: IRootState, payload) => {
		state.ecos = payload || [];
	},
	[MutationType.UpdateEcos]: (state: IRootState, payload) => {
		if (!state.ecos) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		const index = state.ecos.findIndex((f) => f.id === payload.id);
		if (!payload.id) {
			// Needed for mocked data
			payload.id =
				state.ecos.sort(
					(s1: ITemplate, s2: ITemplate) => s2.id! - s1.id!
				)[0].id! + 1;
		}
		if (index === -1) {
			state.ecos.push(payload);
		} else {
			try {
				state.ecos.splice(index, 1, payload);
			} catch (error) {
				throw new Error(
					'Unable to update pm3 ' + state.ecos[index].title
				);
			}
		}
	},
	[MutationType.DeleteEcos]: (state: IRootState, payload) => {
		if (!state.ecos) {
			throw new Error(
				'Trying to delete a pm3 when no pm3 is present in the state store!'
			);
		}
		const ecosIndex = state.ecos.findIndex((d) => d.id === payload.id);
		if (ecosIndex > -1) {
			// Delete receiver in store.
			state.ecos.splice(ecosIndex, 1);
		} else {
			throw new Error('Could not find pm3 to delete in state store!');
		}
	},
	[MutationType.UpdateTemplate]: (state: IRootState, payload) => {
		if (state.templates) {
			const index = state.templates.findIndex(
				(item) => item.id === payload.id
			);
			if (index === -1) {
				state.templates.push(payload);
			} else {
				try {
					state.templates.splice(index, 1, payload);
				} catch (error) {
					throw new Error(
						'Unable to update receiver ' +
							state.templates[index].title
					);
				}
			}
		}
	},
	[MutationType.DeleteTemplate]: (state: IRootState, payload) => {
		if (state.templates) {
			const templateIndex = state.templates.findIndex(
				(d) => d.id === payload.id
			);
			if (templateIndex > -1) {
				// Delete receiver in store.
				state.templates.splice(templateIndex, 1);
			} else {
				throw new Error(
					'Could not find receiver to delete in state store!'
				);
			}
		}
	},
	[MutationType.FormSent]: (state: IRootState, payload) => {
		state.result = payload;
	},
	[MutationType.TruncateForm]: (state: IRootState) => {
		state.form = null;
		state.formHasUnsavedChanges = false;
		state.lastCommentAddedDate = undefined;
	},
	[MutationType.GetEServiceErrorMessage]: (
		state: IRootState,
		{ message }
	) => {
		state.eServiceErrorMessage = {
			errorMessage: message,
		} as IEServiceErrorMessage;
	},
	[MutationType.GetMultipleSigning]: (
		state: IRootState,
		{ formData, formGuid, contactId }
	) => {
		if (formData && formData !== '') {
			const data = JSON.parse(formData);
			if (
				state.user.socialSecurityNumber ===
				data.userContactInfo.socialSecurityNumber
			) {
				state.multipleSigningByLink = {
					formGuid,
					contactId,
					isMultipleSigningByLink: true,
				} as IMultipleSigningByLink;
				state.user.userContactInfo = data.userContactInfo;
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				addFormDataToState(state, data.form);
			}
		}
	},

	[MutationType.GetMultipleSigningParameters]: (
		state: IRootState,
		{ isCancelled, isSigned, hasExpired, wrongUser }
	) => {
		let isWrongUser = false;
		if (
			isCancelled === false &&
			isSigned === false &&
			hasExpired === false
		) {
			isWrongUser = wrongUser;
		}
		state.multipleSigningByLink = {
			linkHasBeenCancelled: isCancelled,
			linkIsAlreadySigned: isSigned,
			linkHasExpired: hasExpired,
			isWrongUserForLink: isWrongUser ? wrongUser : false,
		} as IMultipleSigningByLink;
	},

	[MutationType.AddFormField]: (
		state: IRootState,
		o: { stepId: string; data: IFormField; index: number | null }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		if (!o.data.id) {
			o.data.id = Helper.generateTempId();
		}
		if (!o.data.guid) {
			o.data.guid = Helper.generateUuid();
		}
		const step = findStep(state.form, o.stepId);
		if (o.index != null) {
			// put field in an exact place in list
			// If you have a lot fields (60+) and insert at a low index
			// .splice will be really slow (600ms+, tested in chrome and firefox)
			// But .slice and ...spread seems to have consistent behavior
			// step.fields.splice(o.index, 0, o.data);
			step.fields = [
				...step.fields.slice(0, o.index),
				o.data,
				...step.fields.slice(o.index),
			];
		} else {
			// add field to list
			step.fields.push(o.data);
		}
		state.formHasUnsavedChanges = true;
	},

	[MutationType.AddFormFields]: (
		state: IRootState,
		o: {
			stepId: string;
			stepIndex: number;
			data: IFormField[];
			nearFieldId: string | null;
		}
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		let step = findStep(state.form, o.stepId);
		if (o.stepIndex !== -1) {
			step = state.form.attributes.steps[o.stepIndex];
		}

		o.data.forEach((field) => {
			if (!field.id) {
				field.id = Helper.generateTempId();
			}
			if (!field.guid) {
				field.guid = Helper.generateUuid();
			}
			if (o.nearFieldId) {
				// put field in an exact place in list
				const index = step.fields.findIndex(
					(field) => field.id === o.nearFieldId
				);
				step.fields.splice(index, 0, field);
			} else {
				// add field to list
				step.fields.push(field);
			}
		});
		state.formHasUnsavedChanges = true;
	},
	/**
	 * Replace form field in state
	 */
	[MutationType.ReplaceFormField]: (
		state: IRootState,
		{ fieldId, newField }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		// Find stepIndex and field in state
		const stepIndex = findStepIndex(state.form, fieldId);
		const field = findFormFieldInStep(state.form, stepIndex, fieldId);

		if (field) {
			Object.assign(field, newField);
			state.formHasUnsavedChanges = true;
		}
	},

	/**
	 * Update form field in state
	 */
	[MutationType.UpdateFormField]: (
		state: IRootState,
		{ fieldId, newValue, fieldProperty }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		// Find stepIndex and field in state
		const stepIndex = findStepIndex(state.form, fieldId);
		const field = findFormFieldInStep(state.form, stepIndex, fieldId);
		// Update specific property on field in state
		if (fieldProperty !== undefined) {
			try {
				(field as any)[fieldProperty] = newValue;
				state.formHasUnsavedChanges = true;
			} catch (error) {
				throw new Error('Unable to update form field ' + field.title);
			}
		} else {
			console.warn('fieldProperty can not be undefined');
		}
	},
	/**
	 * Update form field in state
	 */
	[MutationType.UpdateFormFieldDisplayRuleGroupQueryOption]: (
		state: IRootState,
		{ fieldId, displayRuleGroupGuid, newValue, fieldProperty }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		// Find stepIndex and field in state
		const stepIndex = findStepIndex(state.form, fieldId);
		const field = findFormFieldInStep(state.form, stepIndex, fieldId);
		// Update specific property on field in state
		if (fieldProperty !== undefined) {
			try {
				if (
					(field as any)[fieldProperty].displayRuleGroupGuid ===
					displayRuleGroupGuid
				) {
					(field as any)[fieldProperty].queryOption = newValue;
				}
				state.formHasUnsavedChanges = true;
			} catch (error) {
				throw new Error('Unable to update form field ' + field.title);
			}
		} else {
			console.warn('fieldProperty can not be undefined');
		}
		updateAdminMotherFields();
	},

	/**
	 * Update form field in state
	 */
	[MutationType.UpdateFormFieldDisplayRuleGroup]: (
		state: IRootState,
		{ fieldId, displayRuleGroupGuid, newValue, fieldProperty }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		// Find stepIndex and field in state
		const stepIndex = findStepIndex(state.form, fieldId);
		const field = findFormFieldInStep(state.form, stepIndex, fieldId);
		// Update specific property on field in state
		if (fieldProperty !== undefined) {
			try {
				if (
					(field as any)[fieldProperty].displayRuleGroupGuid ===
					displayRuleGroupGuid
				) {
					if (
						(field as any)[fieldProperty].displayRuleGroupGuid ===
						newValue.displayRuleGroupGuid
					) {
						(field as any)[fieldProperty].queryOption =
							newValue.queryOption;
						(field as any)[fieldProperty].conditions =
							newValue.conditions;
						(field as any)[fieldProperty].groups = newValue.groups;
					} else {
						const group = (field as any)[fieldProperty].groups.find(
							(f) =>
								f.displayRuleGroupGuid ===
								newValue.displayRuleGroupGuid
						);
						if (group) {
							group.queryOption = newValue.queryOption;
							group.conditions = newValue.conditions;
							group.groups = newValue.groups;
						} else {
							(field as any)[fieldProperty].groups.push(newValue);
						}
					}
				} else {
					addGroupToGroup(
						(field as any)[fieldProperty].groups,
						displayRuleGroupGuid,
						newValue
					);
				}
				state.formHasUnsavedChanges = true;
			} catch (error) {
				throw new Error('Unable to update form field ' + field.title);
			}
		} else {
			console.warn('fieldProperty can not be undefined');
		}
		updateAdminMotherFields();
	},
	/**
	 * Update form field in state
	 */
	[MutationType.UpdateFormFieldDisplayRuleGroupCondition]: (
		state: IRootState,
		{ fieldId, displayRuleGroupGuid, newValue, fieldProperty }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		// Find stepIndex and field in state
		const stepIndex = findStepIndex(state.form, fieldId);
		const field = findFormFieldInStep(state.form, stepIndex, fieldId);
		// Update specific property on field in state
		if (fieldProperty !== undefined) {
			try {
				if (
					(field as any)[fieldProperty].displayRuleGroupGuid ===
					displayRuleGroupGuid
				) {
					const condition = (field as any)[
						fieldProperty
					].conditions.find(
						(f) => f.conditionGuid === newValue.conditionGuid
					);
					if (condition) {
						condition.conditionChoice = newValue.conditionChoice;
						condition.conditionQuestion =
							newValue.conditionQuestion;
						condition.conditionResponse =
							newValue.conditionResponse;
						condition.conditionResponse2 =
							newValue.conditionResponse2;
						condition.conditionQuestionType =
							newValue.conditionQuestionType;
					} else {
						(field as any)[fieldProperty].conditions.push(newValue);
					}
				} else {
					addConditionToGroup(
						(field as any)[fieldProperty].groups,
						displayRuleGroupGuid,
						newValue
					);
				}
				state.formHasUnsavedChanges = true;
			} catch (error) {
				throw new Error('Unable to update form field ' + field.title);
			}
		} else {
			console.warn('fieldProperty can not be undefined');
		}
		updateAdminMotherFields();
	},

	/**
	 * Update form field in state
	 */
	[MutationType.RemoveConditionFromDisplayRuleGroup]: (
		state: IRootState,
		{ fieldId, conditionGuid, fieldProperty, removeIfEmpty }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		// Find stepIndex and field in state
		const stepIndex = findStepIndex(state.form, fieldId);
		const field = findFormFieldInStep(state.form, stepIndex, fieldId);
		// Update specific property on field in state
		if (fieldProperty !== undefined) {
			try {
				const index = (field as any)[
					fieldProperty
				].conditions.findIndex(
					(f) => f.conditionGuid === conditionGuid
				);
				if (index > -1) {
					(field as any)[fieldProperty].conditions.splice(index, 1);

					if (
						removeIfEmpty &&
						(field as any)[fieldProperty].conditions.length === 0 &&
						(field as any)[fieldProperty].groups.length === 0
					) {
						(field as any)[fieldProperty] = {};
					}
				} else {
					deleteConditionFromGroup(
						(field as any)[fieldProperty].groups,
						conditionGuid,
						removeIfEmpty
					);
				}
				state.formHasUnsavedChanges = true;
			} catch (error) {
				throw new Error('Unable to update form field ' + field.title);
			}
		} else {
			console.warn('fieldProperty can not be undefined');
		}
		updateAdminMotherFields();
	},

	/**
	 * Update form field in state
	 */
	[MutationType.RemoveGroupFromDisplayRuleGroup]: (
		state: IRootState,
		{ fieldId, displayRuleGroupGuid, fieldProperty }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		// Find stepIndex and field in state
		const stepIndex = findStepIndex(state.form, fieldId);
		const field = findFormFieldInStep(state.form, stepIndex, fieldId);
		// Update specific property on field in state
		if (fieldProperty !== undefined) {
			try {
				const index = (field as any)[fieldProperty].groups.findIndex(
					(f) => f.displayRuleGroupGuid === displayRuleGroupGuid
				);
				if (index > -1) {
					(field as any)[fieldProperty].groups.splice(index, 1);
				} else {
					deleteGroupFromGroup(
						(field as any)[fieldProperty].groups,
						displayRuleGroupGuid
					);
				}
				state.formHasUnsavedChanges = true;
			} catch (error) {
				throw new Error('Unable to update form field ' + field.title);
			}
		} else {
			console.warn('fieldProperty can not be undefined');
		}
		updateAdminMotherFields();
	},

	[MutationType.DeleteFormField]: (state: IRootState, { fieldId }) => {
		if (!state.form || !state.form!.attributes.steps) {
			throw new Error(
				'Trying to delete a field when no form or steps is present in the state store!'
			);
		}
		const stepIndex = findStepIndex(state.form, fieldId);
		const field = findFormFieldInStep(state.form, stepIndex, fieldId);
		// Did we find a field.
		if (field) {
			const fields = state.form.attributes.steps[stepIndex].fields;
			const fieldIndex = fields.findIndex((d) => d.id === fieldId);

			// Delete step in store.
			state.form.attributes.steps[stepIndex].fields.splice(fieldIndex, 1);
			state.formHasUnsavedChanges = true;
		} else {
			throw new Error('Could not find field to delete in state store!');
		}
	},

	/**
	 * Push step forward
	 */
	[MutationType.PushStepForward]: (state: IRootState, { stepIndex }) => {
		if (
			state.form &&
			state.form.attributes.steps &&
			state.form.attributes.steps.length > stepIndex
		) {
			// exchange sort index with step that is ahead
			const stepToMoveForward = state.form.attributes.steps[stepIndex];
			const stepAHead = state.form.attributes.steps[stepIndex + 1];
			const sortIndexOfStepToPush = stepToMoveForward.sortIndex;
			const sortIndexOfStepAHead = stepAHead.sortIndex;
			stepAHead.sortIndex = sortIndexOfStepToPush;
			stepToMoveForward.sortIndex = sortIndexOfStepAHead;
			// resort the steps by sort index
			state.form.attributes.steps = state.form.attributes.steps.sort(
				(s1, s2) => s1.sortIndex - s2.sortIndex
			);
			state.formHasUnsavedChanges = true;
		}
	},

	/**
	 * Push step backward
	 */
	[MutationType.PushStepBackward]: (state: IRootState, { stepIndex }) => {
		if (state.form && state.form.attributes.steps && stepIndex > 0) {
			// exchange sort index with step that is behind
			const stepToMoveBack = state.form.attributes.steps[stepIndex];
			const stepBehind = state.form.attributes.steps[stepIndex - 1];
			const sortIndexOfStepToMoveBack = stepToMoveBack.sortIndex;
			const sortIndexOfStepBehind = stepBehind.sortIndex;
			stepBehind.sortIndex = sortIndexOfStepToMoveBack;
			stepToMoveBack.sortIndex = sortIndexOfStepBehind;
			// resort the steps by sort index
			state.form.attributes.steps = state.form.attributes.steps.sort(
				(s1, s2) => s1.sortIndex - s2.sortIndex
			);
			state.formHasUnsavedChanges = true;
		}
	},

	/**
	 * Add new step
	 */
	[MutationType.AddFormStep]: (state: IRootState, { data }) => {
		if (state.form) {
			let maxSortIndex = 0;
			if (!state.form.attributes.steps) {
				state.form.attributes.steps = [];
			} else if (state.form.attributes.steps.length) {
				maxSortIndex = state.form.attributes.steps.reduce(
					(step1: IFormStep, step2: IFormStep) => {
						return step1.sortIndex > step2.sortIndex
							? step1
							: step2;
					}
				).sortIndex;
			}

			const step: IFormStep = {
				// Generates new id with value less than 0
				id: Helper.generateTempId(),
				title: '',
				description: '',
				fields: [],
				sortIndex: maxSortIndex + 1,
				type: 'step',
			};

			// Update if we passed in data that should be updated in the new step.
			if (data) {
				step.title = data.title ? data.title : step.title;
				step.description = data.description
					? data.description
					: step.description;
			}
			// Add step
			state.form!.attributes.steps.push(step);
			state.formHasUnsavedChanges = true;
		} else {
			throw new Error('No steps in store!');
		}
	},
	/**
	 * Update step information, does not update fields inside step!
	 */
	[MutationType.UpdateFormStep]: (
		state: IRootState,
		{ id, propertyName, newValue }
	) => {
		if (state.form!.attributes!.steps && propertyName) {
			const step = findStep(state.form!, id);
			if (step) {
				state.formHasUnsavedChanges = true;
				step[propertyName] = newValue;
			} else {
				throw new Error('Could not find step to update!');
			}
		}
	},

	/**
	 * Delete a step
	 */
	[MutationType.DeleteFormStep]: (state: IRootState, { stepId }) => {
		if (state.form!.attributes!.steps && stepId) {
			const steps = state.form!.attributes.steps;
			if (!steps || steps.length === 0) {
				throw new Error('No steps in store to delete!');
			}
			const stepIndex = steps.findIndex((d) => d.id === stepId);
			// Did we find a step.
			if (stepIndex >= 0) {
				// Delete step in store.
				state.formHasUnsavedChanges = true;
				state.form!.attributes.steps.splice(stepIndex, 1);
			} else {
				throw new Error('Could not delete last step in form!');
			}
		}
	},
	[MutationType.ApplyIntegrationData]: (
		state: IRootState,
		{ data, stepIndex, id }
	) => {
		if (state.form && data) {
			const field1 = findFormFieldInStep(
				state.form,
				stepIndex,
				id
			) as IIntegration;
			Object.keys(field1.dataMapping).forEach((key) => {
				if (state.form) {
					const field2 = findFormFieldInStep(
						state.form,
						stepIndex,
						key
					);
					switch (FormFieldLookup.getInstanceOf(field2)) {
						case FormFieldInterface.SingleValueField:
							(field2 as ISingleValueField).value =
								data.attributes[key];
							break;
						default:
							throw new Error(
								'Unable to update form field of type ' +
									field2.type
							);
					}
				}
			});
		}
	},

	/**
	 * Updates a property on the form
	 */
	[MutationType.UpdateFormProperty]: (
		state: IRootState,
		{ newValue, fieldProperty }
	) => {
		if (state.form) {
			const formProperty = state.form!.attributes;
			// Update specific property on form
			if (fieldProperty !== undefined) {
				try {
					state.formHasUnsavedChanges = true;
					if (
						fieldProperty === 'comments' &&
						!state.lastCommentAddedDate &&
						state.form.attributes.messageTextscomments &&
						state.form.attributes.comments.length
					) {
						const lastAddedComment = state.form.attributes
							.comments[0] as IComment;
						state.lastCommentAddedDate = new Date(
							lastAddedComment.timestamp
						);
					}
					(formProperty as any)[fieldProperty] = newValue;
				} catch (error) {
					throw new Error(
						'Unable to update form property ' + formProperty
					);
				}
			}
		}
	},

	[MutationType.CreateMessageTextsFromDefault]: (state: IRootState) => {
		if (!state.form.attributes.messageTexts?.length) {
			state.formHasUnsavedChanges = true;
			state.form.attributes.messageTexts = [
				{
					messageEvent: MessageEvent.Send,
					medium: Medium.Email,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.messageTextSend',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							numberOfDays:
								MessageTextsVariablesForBackend.NumberOfDays,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.subjectSend',
						{
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus,
						}
					),
					id: '1',
				},
				{
					messageEvent: MessageEvent.Send_second,
					medium: Medium.Email,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.messageTextSendSecond',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus,
							urlEserviceEmail:
								MessageTextsVariablesForBackend.UrlEserviceEmail,
							numberOfDays:
								MessageTextsVariablesForBackend.NumberOfDays,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.subjectSendSecond'
					),
					id: '2',
				},
				{
					messageEvent: MessageEvent.Accept,
					medium: Medium.Email,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.messageTextAccept',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.subjectAccept'
					),
					id: '3',
				},
				{
					messageEvent: MessageEvent.Reject,
					medium: Medium.Email,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.messageTextReject',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.subjectReject'
					),
					id: '4',
				},
				{
					messageEvent: MessageEvent.Reminder,
					medium: Medium.Email,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.messageTextReminder',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnReminders,
							urlEserviceEmail:
								MessageTextsVariablesForBackend.UrlEserviceEmail,
							numberOfDays:
								MessageTextsVariablesForBackend.NumberOfDays,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.subjectReminder'
					),
					id: '5',
				},
				{
					messageEvent: MessageEvent.Last_reminder,
					medium: Medium.Email,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.messageTextLastReminder',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnReminders,
							urlEserviceEmail:
								MessageTextsVariablesForBackend.UrlEserviceEmail,
							numberOfDays:
								MessageTextsVariablesForBackend.NumberOfDays,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.subjectLastReminder'
					),
					id: '6',
				},
				{
					messageEvent: MessageEvent.Closed_due_to_no_response,
					medium: Medium.Email,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.messageTextClosedDueToNoResponse',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian1ShowsWhenExpired,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnExpired,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.email.subjectClosedDueToNoResponse'
					),
					id: '7',
				},

				{
					messageEvent: MessageEvent.Send,
					medium: Medium.Sms,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.sms.messageTextSend',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							numberOfDays:
								MessageTextsVariablesForBackend.NumberOfDays,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: '',
					id: '8',
				},
				{
					messageEvent: MessageEvent.Send_second,
					medium: Medium.Sms,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.sms.messageTextSendSecond',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus,
							numberOfDays:
								MessageTextsVariablesForBackend.NumberOfDays,
							urlEserviceSms:
								MessageTextsVariablesForBackend.UrlEserviceSms,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: '',
					id: '9',
				},
				{
					messageEvent: MessageEvent.Accept,
					medium: Medium.Sms,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.sms.messageTextAccept',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: '',
					id: '10',
				},
				{
					messageEvent: MessageEvent.Reject,
					medium: Medium.Sms,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.sms.messageTextReject',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: '',
					id: '11',
				},
				{
					messageEvent: MessageEvent.Reminder,
					medium: Medium.Sms,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.sms.messageTextReminder',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnReminders,
							urlEserviceSms:
								MessageTextsVariablesForBackend.UrlEserviceSms,
							numberOfDays:
								MessageTextsVariablesForBackend.NumberOfDays,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: '',
					id: '12',
				},
				{
					messageEvent: MessageEvent.Last_reminder,
					medium: Medium.Sms,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.sms.messageTextLastReminder',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnReminders,
							urlEserviceSms:
								MessageTextsVariablesForBackend.UrlEserviceSms,
							numberOfDays:
								MessageTextsVariablesForBackend.NumberOfDays,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: '',
					id: '13',
				},
				{
					messageEvent: MessageEvent.Closed_due_to_no_response,
					medium: Medium.Sms,
					message: i18next.global.tc(
						'component.adminForm.userRequirements.multipleLegitimation.messageTextsDefaults.sms.messageTextClosedDueToNoResponse',
						{
							vh: MessageTextsVariablesForBackend.FornameAndLastnameGuardian1ShowsWhenExpired,
							title: MessageTextsVariablesForBackend.EserviceTitleShowsOnExpired,
							email: Config.VUE_APP_EMAIL_ADDRESS_FEEDBACK,
						}
					),
					subject: '',
					id: '14',
				},
			];
		}
	},

	/**
	 * Updates a messageText
	 */
	[MutationType.UpdateMessageTexts]: (
		state: IRootState,
		{ attribute, mediumProperty, messageEventProperty, newValue }
	) => {
		if (state.form) {
			const messageTexts = state.form!.attributes.messageTexts;
			// Update message property on messageTexts
			if (
				messageEventProperty !== undefined &&
				mediumProperty !== undefined
			) {
				try {
					state.formHasUnsavedChanges = true;
					const itemToUpdate = messageTexts.find(
						(item) =>
							item.medium === mediumProperty &&
							item.messageEvent === messageEventProperty
					);
					if (itemToUpdate) {
						itemToUpdate[attribute] = newValue;
					}
				} catch (error) {
					throw new Error(
						'Unable to update message "' +
							newValue +
							'" on message event "' +
							messageEventProperty +
							'"'
					);
				}
			}
		}
	},

	/**
	 * Updates integration on the form
	 */
	[MutationType.UpdateFormIntegration]: (
		state: IRootState,
		{ integrationId, newValue }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}

		if (newValue.integrationType) {
			/** integrationType is not stored in the db (for now), so we don't want to
			 * store it in the state either, to avoid any confusion
			 */
			delete newValue.integrationType;
		}

		const integrations = state.form!.attributes.integrations;
		if (integrations) {
			const index = integrations.findIndex((f) => f.id === integrationId);

			if (index === -1) {
				state.formHasUnsavedChanges = true;
				newValue.id = Helper.generateTempId();
				state.form!.attributes.integrations.push(newValue);
			} else {
				try {
					state.formHasUnsavedChanges = true;
					state.form!.attributes.integrations.splice(
						index,
						1,
						newValue
					);
				} catch (error) {
					throw new Error(
						'Unable to update integration ' +
							state.form!.attributes.integrations[index].id
					);
				}
			}
		}
	},

	/**
	 * Delete integration on the form
	 */
	[MutationType.DeleteFormIntegration]: (
		state: IRootState,
		{ integrationId }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to delete value when no form is present in the state store'
			);
		}
		const index = state.form!.attributes.integrations.findIndex(
			(f) => f.id === integrationId
		);
		if (index > -1) {
			state.form!.attributes.integrations.splice(index, 1);
			state.formHasUnsavedChanges = true;
		} else {
			throw new Error(
				'Could not find integration to delete in state store!'
			);
		}
	},

	/**
	 * Updates or create display rule
	 */
	updateDisplayRule: (state: IRootState, { displayRuleGuid, newValue }) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		const index = state.form.attributes.displayRules.findIndex(
			(f) => f.guid === displayRuleGuid
		);
		if (index === -1) {
			newValue.colorCode =
				'#' + Math.floor(Math.random() * 0xffffff).toString(16);
			state.form!.attributes.displayRules.push(newValue);
		} else {
			try {
				state.form!.attributes.displayRules.splice(index, 1, newValue);
			} catch (error) {
				throw new Error(
					'Unable to update display rule ' +
						state.form!.attributes.displayRules[index].guid
				);
			}
		}
		state.formHasUnsavedChanges = true;
	},

	/**
	 * Delete display rule
	 */
	deleteDisplayRule: (state: IRootState, { dispalyRuleGuid }) => {
		if (!state.form) {
			throw new Error(
				'Trying to delete value when no form is present in the state store'
			);
		}
		const index = state.form!.attributes.displayRules.findIndex(
			(f) => f.guid === dispalyRuleGuid
		);
		if (index > -1) {
			state.form!.attributes.displayRules.splice(index, 1);
			state.formHasUnsavedChanges = true;
			state.form.attributes.steps.forEach((step) => {
				step.fields.forEach((element) => {
					if (element.displayRuleGuids.length > 0) {
						element.displayRuleGuids.forEach((dp) => {
							if (dp.guid === dispalyRuleGuid) {
								const index =
									element.displayRuleGuids.findIndex(
										(f) => f === dp
									);
								if (index > -1) {
									element.displayRuleGuids.splice(index, 1);
								}
							}
						});
					}
				});
			});
		} else {
			throw new Error(
				'Could not find display rule to delete in state store!'
			);
		}
	},

	/**
	 * Updates a property on the forms followup
	 */
	[MutationType.UpdateFormFollowUpProperty]: (
		state: IRootState,
		{ newValue, fieldProperty }
	) => {
		if (state.form) {
			const formFollowUpProperty = state.form!.attributes.followUp;
			// Update specific property on form
			if (formFollowUpProperty !== undefined) {
				try {
					state.formHasUnsavedChanges = true;
					(formFollowUpProperty as any)[fieldProperty] = newValue;
				} catch (error) {
					throw new Error(
						'Unable to update form follow up property ' +
							formFollowUpProperty
					);
				}
			}
		}
	},

	/**
	 * Remove values from hidden fields
	 */
	[MutationType.RemoveValuesFromHiddenFields]: (
		state: IRootState,
		{ availableMetaDataLista }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		const form = state.form;
		const visibleFields: IFormField[] = [];
		if (state.form.attributes.userContactInfos) {
			state.form.attributes.userContactInfos.forEach((userContact) => {
				userContact.id = '0';
			});
		}
		state.form.attributes.steps.forEach((step) => {
			step.fields.forEach((field) => {
				if (
					field.displayRuleGuids &&
					field.displayRuleGuids.length > 0
				) {
					const displayRules = [] as IDisplayRule[];
					field.displayRuleGuids.forEach((f) => {
						displayRules.push(
							form.attributes.displayRules.filter(
								(r) => r.guid === f.guid
							)[0]
						);
					});
					displayRules.forEach((displayRule) => {
						if (isVisible(displayRule, visibleFields, form)) {
							visibleFields.push(field);
						}
					});
				} else if (
					field.displayRuleGroup &&
					field.displayRuleGroup.displayRuleGroupGuid
				) {
					if (
						isVisibleDisplayRuleGroup(
							field,
							form,
							availableMetaDataLista
						)
					) {
						visibleFields.push(field);
					}
				} else {
					visibleFields.push(field);
				}
			});
			step.fields.forEach((field) => {
				if (!visibleFields.find((f) => f.guid === field.guid)) {
					(field as ISingleValueField).value = '';
					state.formHasUnsavedChanges = true;
				} else if (field.type === 'FieldTable') {
					(field.fieldOptions.tableRows as ITableRow[])?.forEach(
						(tableRow) => {
							const columns: ITableColumn[] = [];
							tableRow.columns.forEach((column) => {
								if (
									visibleFields.find(
										(f) => f.guid === column.fieldGuid
									)
								) {
									columns.push(column);
								}
							});
							tableRow.columns = columns;
						}
					);
				}
			});
		});
	},

	/**
	 * Format value of fields that need it
	 */
	[MutationType.FormatFormFieldOutput]: (state: IRootState) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}

		state.form.attributes.steps.forEach((step) => {
			step.fields.forEach((field) => {
				if (field.fieldOptions?.validation?.length) {
					(
						field as ISingleValueField
					).fieldOptions.validation.forEach((validation) => {
						if (
							validation.type ===
								ValidationRuleType.ValidOrgNumber &&
							validation.data?.doFormatOutput &&
							validation.data?.outputFormat &&
							(field as ISingleValueField).value
						) {
							// Update value to a formatted organizational number
							(field as ISingleValueField).value =
								formatOrgNumber(
									field.value,
									validation.data
										.outputFormat as ValidOrgNumberFormats
								);
						}
					});
				}
			});
		});
	},

	/**
	 * Updates users legitimation
	 */
	[MutationType.UpdateFormUsersLegitimations]: (
		state: IRootState,
		{ refId, name, legitimizedMethod, legitimizedDateTime }
	) => {
		if (!state.form!.attributes.usersLegitimations) {
			state.form!.attributes.usersLegitimations =
				[] as IUserLegitimation[];
		}
		state.form!.attributes.usersLegitimations.push({
			refId,
			name,
			legitimizedMethod,
			legitimizedDateTime,
		} as IUserLegitimation);
	},

	/**
	 * Updates users contact information
	 */
	[MutationType.UpdateFormUserContactInfo]: (
		state: IRootState,
		{ socialSecurityNumber, newValue, item }
	) => {
		if (!state.user!.userContactInfo) {
			state.user!.userContactInfo = {} as IUserContactInfo;
		}
		const userContactInfo = state.user!.userContactInfo;
		(userContactInfo as any)[item] = newValue;
	},

	/**
	 * Updates users contact information
	 */
	[MutationType.UpdateFormContactInfos]: (
		state: IRootState,
		{ newValue }
	) => {
		if (!state.form!.attributes.userContactInfos) {
			state.form!.attributes.userContactInfos = [] as IContactInfo[];
		}
		state.form!.attributes.userContactInfos = newValue;
	},

	/**
	 * Updates users contact information
	 */
	[MutationType.UpdateFormContactInfo]: (
		state: IRootState,
		{ socialSecurityNumber, newValue, item }
	) => {
		if (!state.form!.attributes.userContactInfos) {
			state.form!.attributes.userContactInfos = [] as IContactInfo[];
		}
		const userContactInfos = state.form!.attributes.userContactInfos.filter(
			(f) => f.socialSecurityNumber === socialSecurityNumber
		)[0];
		(userContactInfos as any)[item] = newValue;
	},

	[MutationType.UserLogIn]: (
		state: IRootState,
		{ jwtPayload, rawJwt, authClientName }
	) => {
		let ageToday = 0;
		let ageThisYear = 0;
		let newAgeInXDays = 0;
		if (jwtPayload.socialSecurityNumber) {
			ageToday = getAgeToday(jwtPayload.socialSecurityNumber);
			ageThisYear = getAgeThisYear(jwtPayload.socialSecurityNumber);
			newAgeInXDays = getNewAgeInXDay(jwtPayload.socialSecurityNumber);
		}
		const userContactInfo = {
			socialSecurityNumber: jwtPayload.socialSecurityNumber || '?',
			firstName: jwtPayload.firstName || '',
			lastName: jwtPayload.lastName || '',
			address: jwtPayload.address || '',
			postalNumber: jwtPayload.postalNumber || '',
			city: jwtPayload.city || '',
			phoneNumber: jwtPayload.phoneNumber || '',
			email: jwtPayload.email || '',
			authClientName,
			ageToday: ageToday,
			ageThisYear: ageThisYear,
			newAgeInXDays: newAgeInXDays,
		} as IUserContactInfo;
		state.user = {
			...jwtPayload,
			token: rawJwt,
			isAuthenticated: true,
			userContactInfo,
			authClientName,
		} as IUser;
	},

	[MutationType.UserEnterPage]: (state: IRootState, { userId }) => {
		if (!state.user.userId) {
			state.user.userId = userId;
		}
	},

	[MutationType.RemoveForm]: (state: IRootState, { formId }) => {
		if (state.forms && state.forms.length) {
			state.forms.splice(
				state.forms.findIndex((f, i) => f.id === formId),
				1
			);
		}
	},

	[MutationType.UpdateForm]: (state: IRootState, { form }) => {
		if (state.forms && state.forms.length) {
			state.forms.push(form);
		}
	},

	[MutationType.UserLogOut]: (state: IRootState) => {
		state.user = {
			...getAnonymousContactInfo(),
			isAuthenticated: false,
			userId: '',
			authClientName: '',
		};
		state.form = null;
	},

	[MutationType.CopyFields]: (
		state: IRootState,
		{ fieldsJson, methodChoice, formId }
	) => {
		state.fieldsCopyMemory.copiedFields = fieldsJson;
		state.fieldsCopyMemory.methodChoice = methodChoice;
		state.fieldsCopyMemory.formId = formId;
	},

	[MutationType.AddFieldsIdsToPasteHistory]: (
		state: IRootState,
		{ idsOfPastedFields }
	) => {
		const history = state.fieldsCopyMemory.history;
		history.unshift({ id: idsOfPastedFields, time: new Date().getTime() });
		// We only need to remember a couple of the last pasted fields
		if (history.length > 10) {
			history.splice(-1); // remove last
		}
		state.fieldsCopyMemory.history = history;
	},

	/**
	 * Update form fieldTable fields tablerows options in state
	 */
	[MutationType.UpdateFormFieldTableRows]: (
		state: IRootState,
		{ fieldId, newValue }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		const stepIndex = findStepIndex(state.form, fieldId);
		const fieldTable = findFormFieldInStep(state.form, stepIndex, fieldId);
		if (fieldTable) {
			const fieldOptions = fieldTable.fieldOptions;
			try {
				fieldTable.fieldOptions = {
					maxRows: fieldOptions!.maxRows
						? fieldOptions!.maxRows
						: newValue.maxRows,
					minRows: fieldOptions!.minRows
						? fieldOptions!.minRows
						: newValue.minRows,
					dataSource: fieldOptions!.dataSource,
					dataSourceData: fieldOptions!.dataSourceData,
					autofillNumberOfRows: fieldOptions!.autofillNumberOfRows,
					searchResponse: newValue.searchResponse,
					objectName: newValue.objectName,
					columnWidth: newValue.columnWidth,
					tableGuid: newValue.tableGuid,
					tableRows: newValue.tableRows,
					rowDisplay: newValue.rowDisplay,
				};
			} catch (error) {
				throw new Error(
					'Unable to update form field ' + fieldTable.title
				);
			}
		}
	},
	/**
	 * Update form fieldTable fields tablerows options in state
	 */
	[MutationType.UpdateFormFieldTableData]: (
		state: IRootState,
		{ fieldId, newValue }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		const stepIndex = findStepIndex(state.form, fieldId);
		const fieldTable = findFormFieldInStep(state.form, stepIndex, fieldId);
		if (fieldTable) {
			const fieldOptions = fieldTable.fieldOptions;
			try {
				fieldTable.fieldOptions = {
					maxRows: fieldOptions!.maxRows,
					minRows: fieldOptions!.minRows,
					dataSource: fieldOptions!.dataSource,
					tableRows: fieldOptions!.tableRows,
					dataSourceData: newValue,
				};
			} catch (error) {
				throw new Error(
					'Unable to update form field ' + fieldTable.title
				);
			}
		}
	},

	/**
	 * Delete form fieldTable fields options in state
	 */
	[MutationType.DeleteFormFieldTableFields]: (
		state: IRootState,
		{ fieldId, newValue }
	) => {
		if (!state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		const stepIndex = findStepIndex(state.form, fieldId);
		const fieldTable = findFormFieldInStep(state.form, stepIndex, fieldId);
		const tableFields = state.form.attributes.steps[
			stepIndex
		].fields.filter(
			(field) => field.fieldOptions!.tableGuid === fieldTable.guid
		);
		if (tableFields.length > 0) {
			tableFields.forEach((element) => {
				const fieldOptions = element.fieldOptions;
				try {
					element.fieldOptions = {
						columnWith: fieldOptions!.columnWith,
						tableGuid: fieldOptions!.tableGuid,
					};
					state.formHasUnsavedChanges = true;
				} catch (error) {
					throw new Error(
						'Unable to update form field ' + element.title
					);
				}
			});
		}
	},

	/**
	 * Store title of last used form.
	 */
	[MutationType.UpdateLastFormTitle]: (state: IRootState, formTitle) => {
		state.lastFormTitle = formTitle;
	},

	[MutationType.SetMTCaptchaIsTriggered]: (state: IRootState, payload) => {
		state.mtCaptcha.isTriggered = payload;
	},

	[MutationType.SetMTCaptchaIsVerified]: (state: IRootState, payload) => {
		state.mtCaptcha.isVerified = payload;
	},
	[MutationType.NewAdminState]: (state: IRootState) => {
		state.admin = {
			activeStep: 1,
			activeFieldId: null,
			haveSavedAnyChanges: false,
			selectedFields: [],
			formErrors: [],
			motherFields: {},
			pathUnique: true,
			usedFiles: [],
		};
	},
	[MutationType.UpdateAdminState]: (state: IRootState, { prop, value }) => {
		if (state.admin) {
			state.admin[prop] = value;
		}
	},

	[MutationType.FieldLoadingDataSourceReset]: (state: IRootState) => {
		state.fieldsLoadingDataSource = [];
	},
	[MutationType.FieldLoadingDataSourceStart]: (state: IRootState, guid) => {
		state.fieldsLoadingDataSource.push(guid);
	},
	[MutationType.FieldLoadingDataSourceDone]: (state: IRootState, guid) => {
		const index = state.fieldsLoadingDataSource.findIndex(
			(g) => g === guid
		);
		if (index > -1) {
			state.fieldsLoadingDataSource.splice(index, 1);
		}
	},
	[MutationType.GetBanner]: (state: IRootState, payload) => {
		if (payload?.length) {
			state.banner = payload[0];
		}
	},
	[MutationType.UpdateBanner]: (state: IRootState, payload) => {
		state.banner = payload;
	},
	[MutationType.FormReplaceBlobUriWithSource]: (
		state: IRootState,
		{ blobUri, imageUrl }: { blobUri: string; imageUrl: string }
	) => {
		// Replace blob uri in the e-service with an actual image url.
		if (state.form) {
			// Form description
			state.form.attributes.description =
				state.form.attributes.description.replaceAll(blobUri, imageUrl);

			state.form.attributes.steps.forEach((step) => {
				step.fields.forEach((field) => {
					// Section field
					if (field.type === FormFieldType.Section) {
						field.value = field.value.replaceAll(blobUri, imageUrl);
						field.helpText = field.helpText.replaceAll(
							blobUri,
							imageUrl
						);
					}
				});
			});
		}
	},
	[MutationType.SetActiveInput](state, payload: HTMLTextAreaElement | null) {
		if (typeof payload === 'string' && payload.includes('tiny')) {
			// TinyMCE
			state.activeTextAreaInput = null;
		} else {
			// HTMLTextAreaElement
			state.activeTextAreaInput = payload;
		}
	},
	[MutationType.InsertAtCursor](state, payload: string) {
		if (!state.activeTextAreaInput) {
			// TinyMCE
			state.insertAtCursor = payload;
		} else {
			// HTMLTextAreaElement
			const textarea = state.activeTextAreaInput;

			if (textarea) {
				const start = textarea.selectionStart;
				const end = textarea.selectionEnd;

				textarea.value =
					textarea.value.substring(0, start) +
					payload +
					textarea.value.substring(end);

				textarea.selectionStart = textarea.selectionEnd =
					start + payload.length;

				textarea.dispatchEvent(new Event('input'));
			}
			state.activeTextAreaInput = null;
		}
	},
	[MutationType.CleartInsertAtCursor](state) {
		state.insertAtCursor = null;
	},
};

const addFormDataToState = (state: IRootState, payload: any): void => {
	state.form = null;
	if (payload && payload.attributes.steps) {
		payload.attributes.steps.forEach((step) => {
			step.fields = step.fields.sort(
				(f1, f2) => f1.sortIndex - f2.sortIndex
			);
		});
		payload.attributes.steps = payload.attributes.steps.sort(
			(s1, s2) => s1.sortIndex - s2.sortIndex
		);
	}
	state.form = payload;
	state.formHasUnsavedChanges = false;
	state.lastCommentAddedDate = undefined;
};
