import { ConditionChoice, FormFieldType, FormMode } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import {
	ICondition,
	IDisplayRuleGroup,
	IForm,
	IFormField,
	IItem,
} from './IForm';

export default class FormFieldHelper {
	public static createEmptyField(fieldType: FormFieldType): IFormField {
		const fieldTemplate = {} as IFormField;
		fieldTemplate.type = fieldType;
		fieldTemplate.id = Helper.generateTempId();
		fieldTemplate.guid = Helper.generateUuid();
		fieldTemplate.title = '';
		fieldTemplate.helpText = '';
		fieldTemplate.sortIndex = 0;
		fieldTemplate.mode = FormMode.Toolbox;
		fieldTemplate.fieldOptions = {};
		fieldTemplate.displayRuleGroup = null;

		if (fieldType === FormFieldType.Table) {
			fieldTemplate.fieldOptions.minRows = 1;
		}

		return fieldTemplate;
	}

	public static createFromCopy(originalField: IFormField): IFormField {
		const newField = Helper.deepCopy<IFormField>(originalField);
		newField.guid = Helper.generateUuid();
		// todo: this should in the future be taken away, we should only rely on guid
		newField.id = Helper.generateTempId();
		return newField;
	}

	public static displayConditionType(condition: ICondition): string {
		if (condition.conditionQuestionType) {
			if (
				condition.conditionQuestionType ===
					FormFieldType.CheckBox.toLowerCase() ||
				condition.conditionQuestionType ===
					FormFieldType.RadioButton.toLowerCase() ||
				condition.conditionQuestionType ===
					FormFieldType.SelectList.toLowerCase()
			) {
				return 'list';
			} else if (
				condition.conditionQuestionType ===
				FormFieldType.Numeric.toLowerCase()
			) {
				return 'numeric';
			} else if (
				condition.conditionQuestionType ===
					FormFieldType.TextBox.toLowerCase() ||
				condition.conditionQuestionType ===
					FormFieldType.TextArea.toLowerCase() ||
				condition.conditionQuestionType ===
					FormFieldType.DatePicker.toLowerCase() ||
				condition.conditionQuestionType ===
					FormFieldType.PersonalNumber.toLowerCase()
			) {
				if (
					condition.conditionChoice === ConditionChoice.NotEmpty ||
					condition.conditionChoice === ConditionChoice.Empty
				) {
					return '';
				} else if (
					condition.conditionChoice === ConditionChoice.Between
				) {
					return '2text';
				} else {
					return 'text';
				}
			}
		}
		return '';
	}

	/**
	 * Go over the display rules and make sure no display rule conditions are connected
	 * to a field that doesn't exist. Which could happen if you copy fields from one form
	 * to another. Also generate new guids for all conditions and groups
	 */
	private static clearDisconnectedDisplayRules(
		group: IDisplayRuleGroup,
		newFields: IFormField[],
		form: IForm
	): void {
		// Update guid for group
		group.displayRuleGroupGuid = Helper.generateUuid();

		if (group.conditions?.length) {
			group.conditions.forEach((condition) => {
				// Update guid for condition
				condition.conditionGuid = Helper.generateUuid();

				let conditionIsConnectedToField = false;
				// Check if the field that the display rule is connected to exists in the form
				for (const step of form.attributes.steps) {
					for (const field of step.fields) {
						if (field.guid === condition.conditionQuestion) {
							conditionIsConnectedToField = true;
							break;
						}
					}
				}
				// Or if it exists in the new pasted fields
				for (const field of newFields) {
					if (field.guid === condition.conditionQuestion) {
						conditionIsConnectedToField = true;
						break;
					}
				}
				if (!conditionIsConnectedToField) {
					// The connected field doesn't exist, clear the display rule
					condition.conditionQuestion = '';
					if (this.displayConditionType(condition) === 'list') {
						condition.conditionResponse = '';
					}
				}
			});
		}

		if (group.groups?.length) {
			group.groups.forEach((subGroup) =>
				this.clearDisconnectedDisplayRules(subGroup, newFields, form)
			);
		}
	}

	private static updateDisplayRuleGroupFieldGuid(
		group: IDisplayRuleGroup,
		oldAndNewGuidDict: { [key: string]: string }
	): void {
		if (group.groups?.length) {
			group.groups.forEach((subGroup) =>
				this.updateDisplayRuleGroupFieldGuid(
					subGroup,
					oldAndNewGuidDict
				)
			);
		}
		if (group.conditions?.length) {
			group.conditions.forEach((condition) => {
				// Update condition question
				if (oldAndNewGuidDict[condition.conditionQuestion]) {
					condition.conditionQuestion =
						oldAndNewGuidDict[condition.conditionQuestion];
				}
				// Update condition response
				if (oldAndNewGuidDict[condition.conditionResponse]) {
					condition.conditionResponse =
						oldAndNewGuidDict[condition.conditionResponse];
				}
			});
		}
	}

	public static createFromCopyOfFields(
		originalFields: IFormField[],
		form: IForm
	): IFormField[] {
		const newFields = Helper.deepCopy<IFormField[]>(originalFields);
		newFields.forEach((field) => {
			const oldFieldGuid = field.guid;
			const newFieldGuid = Helper.generateUuid();
			field.guid = newFieldGuid;
			// todo: this should in the future be taken away, we should only rely on guid
			field.id = Helper.generateTempId();

			// Store a relation between the old and new guid so we can update any display rules
			const oldAndNewGuidDict = {
				[oldFieldGuid]: newFieldGuid,
			};

			if (field.fieldOptions?.items?.length) {
				// Generate new id/guid for field items
				field.fieldOptions.items.forEach((item: IItem) => {
					const newUuid = Helper.generateUuid();
					oldAndNewGuidDict[item.id] = newUuid;
					item.id = newUuid;
				});
			}

			// When we update guid for the field, update any display rules connected to this field
			newFields.forEach((f) => {
				if (f.displayRuleGroup?.displayRuleGroupGuid) {
					this.updateDisplayRuleGroupFieldGuid(
						f.displayRuleGroup,
						oldAndNewGuidDict
					);
				}
			});
		});

		// clear any display rules that don't have a connection to a field in this form
		// and generate new guids for groups and conditions
		newFields.forEach((newField) => {
			if (newField.displayRuleGroup?.displayRuleGroupGuid) {
				this.clearDisconnectedDisplayRules(
					newField.displayRuleGroup,
					newFields,
					form
				);
			}
		});
		return newFields;
	}
}
