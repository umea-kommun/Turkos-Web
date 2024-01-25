import {
	FormFieldType,
	MutationType,
	ValidationRuleAllowedFields,
} from '@/models/Enums';
import {
	IFormField,
	IItemListField,
	IItem,
	IRootState,
	ISingleValueField,
} from '@/models/IForm';
import { useTConfirmDialog } from '@turkos/components';
import {
	deleteFieldDisplayRules,
	isFieldUsedInDisplayRules,
	isFieldUsedInIntegration,
} from '@/store/utils';
import { useI18n } from 'vue-i18n';
import { Store } from 'vuex';
import { IValidationRule } from '@/models/IValidation';

interface IAdminFieldTypeProps {
	store?: Store<IRootState>;
}

enum FieldChangeLostData {
	DisplayRules = 'displayRules',
	ItemHelpText = 'itemHelpText',
	ValidationRules = 'validationRules',
	UsedInIntegration = 'usedInIntegration',
	DataSource = 'dataSource',
	DataSourceKept = 'dataSourceKept',
	PredefinedValue = 'predefinedValue',
	ContactField = 'contactField',
	ReadOnly = 'readOnly',
}

const CAN_CHANGE_BETWEEN = [
	[
		FormFieldType.CheckBox,
		FormFieldType.RadioButton,
		FormFieldType.SelectList,
	],
	[
		FormFieldType.TextBox,
		FormFieldType.TextArea,
		FormFieldType.Numeric,
		FormFieldType.PersonalNumber,
		FormFieldType.DatePicker,
		FormFieldType.HiddenTextBox,
	],
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAdminFieldType = ({ store }: IAdminFieldTypeProps) => {
	const { tConfirmDialogAsync } = useTConfirmDialog();
	const { t } = useI18n();

	const updateSingleValueFieldType = (
		field: ISingleValueField,
		newType: FormFieldType
	): ISingleValueField => {
		const newField: ISingleValueField = { ...field, type: newType };

		// Clear predefined value and readonly attribute
		newField.value = '';
		delete newField.fieldOptions.readOnly;

		// Remove validation rules that the new field type can not have
		if (newField.fieldOptions.validation?.length) {
			newField.fieldOptions.validation =
				newField.fieldOptions.validation.filter((validation) => {
					return ValidationRuleAllowedFields[
						validation.type
					]?.includes(newType);
				});
		}

		// Clean out field attributes that could only be used in old type
		switch (field.type) {
			case FormFieldType.TextBox:
				if (newField.fieldOptions.useAsContactField) {
					delete newField.fieldOptions.useAsContactField;
					newField.fieldOptions.validation = [];
				}
				break;
			case FormFieldType.HiddenTextBox:
				delete newField.fieldOptions.showToUser;
				break;
			case FormFieldType.Numeric:
				// Remove any display rules that are connect to this Numeric field
				// Since the display rules for numeric fields only apply to numeric fields, we remove them
				deleteFieldDisplayRules(field.guid);
				delete newField.fieldOptions.allowDecimals;
				break;
		}
		// Clean out field attributes that can't be applied to new type
		switch (newField.type) {
			case FormFieldType.DatePicker:
				if (newField.fieldOptions?.dataSource?.dataSourceName) {
					delete newField.fieldOptions.dataSource;
				}
				break;
		}

		store?.commit(MutationType.ReplaceFormField, {
			fieldId: newField.id,
			newField,
		});
		return newField;
	};

	const updateItemListFieldType = (
		field: IItemListField,
		newType: FormFieldType
	): IItemListField => {
		const newField: IItemListField = { ...field, type: newType };

		if (newType === FormFieldType.SelectList) {
			// Clear help text if turning into select list
			newField.fieldOptions.items =
				(newField as IItemListField).fieldOptions?.items?.map(
					(item) => ({ ...item, helptext: '' })
				) ?? [];

			const hasMultipleChecked =
				newField.fieldOptions.items?.filter((item) => item.isChecked)
					.length > 1;

			// If multiple values preselected, allow multiple choices
			if (hasMultipleChecked) {
				newField.fieldOptions.allowMultipleChoices = true;
			}
		}

		// Allow one preselected value if radio
		if (newType === FormFieldType.RadioButton) {
			let hasPreselected = false;
			newField.fieldOptions.items =
				newField.fieldOptions?.items?.map((item) => {
					if (item.isChecked && !hasPreselected) {
						hasPreselected = true;
						return item;
					} else {
						return { ...item, isChecked: false };
					}
				}) ?? [];
		}

		store?.commit(MutationType.ReplaceFormField, {
			fieldId: newField.id,
			newField,
		});
		return newField;
	};

	const updateFormFieldType = async (
		field: IFormField,
		newType: FormFieldType
	): Promise<boolean> => {
		const oldType = field.type as FormFieldType;
		if (oldType === newType) {
			return true;
		}
		switch (newType) {
			case FormFieldType.CheckBox:
			case FormFieldType.RadioButton:
			case FormFieldType.SelectList:
				updateItemListFieldType(field, newType);
				return true;
			case FormFieldType.TextBox:
			case FormFieldType.TextArea:
			case FormFieldType.Numeric:
			case FormFieldType.PersonalNumber:
			case FormFieldType.DatePicker:
			case FormFieldType.HiddenTextBox:
				updateSingleValueFieldType(field as ISingleValueField, newType);
				return true;
		}

		return false;
	};

	const allowedNewTypes = (fieldTypes: FormFieldType[]): FormFieldType[] => {
		const allowedTypes = CAN_CHANGE_BETWEEN.find((a) =>
			a.includes(fieldTypes[0])
		);
		if (allowedTypes) {
			if (fieldTypes.every((v) => allowedTypes?.includes(v))) {
				return allowedTypes;
			}
		}
		return [];
	};

	/** Return a list of data that will be lost after type change */
	const fieldTypeChangeDataLoss = (
		field: IFormField,
		newType: FormFieldType
	): FieldChangeLostData[] => {
		const lostData: FieldChangeLostData[] = [];
		if (
			field.type === FormFieldType.Numeric &&
			newType !== FormFieldType.Numeric &&
			isFieldUsedInDisplayRules(field.guid)
		) {
			lostData.push(FieldChangeLostData.DisplayRules);
		}

		if (
			newType === FormFieldType.SelectList &&
			(field.type === FormFieldType.CheckBox ||
				field.type === FormFieldType.RadioButton) &&
			(field.fieldOptions.items as IItem[]).some((i) => i.helptext)
		) {
			lostData.push(FieldChangeLostData.ItemHelpText);
		}

		// Check if used as a contact field
		if (
			field.fieldOptions.useAsContactField &&
			newType !== FormFieldType.TextBox
		) {
			lostData.push(FieldChangeLostData.ContactField);
		}

		// Check if there is a predefined value
		if ((field as ISingleValueField)?.value?.length) {
			lostData.push(FieldChangeLostData.PredefinedValue);
		}

		// Check if read only
		if (field.fieldOptions.readOnly) {
			lostData.push(FieldChangeLostData.ReadOnly);
		}

		// Check if any validation rules will be lost
		if (
			field.fieldOptions.validation?.length &&
			!field.fieldOptions.validation?.every(
				(validation: IValidationRule) =>
					ValidationRuleAllowedFields[validation.type]?.includes(
						newType
					)
			)
		) {
			lostData.push(FieldChangeLostData.ValidationRules);
		}

		if (field.fieldOptions?.dataSource?.dataSourceName) {
			if (newType === FormFieldType.DatePicker) {
				// Warn that data source will be removed
				lostData.push(FieldChangeLostData.DataSource);
			} else {
				// Warn that the field has a data source
				lostData.push(FieldChangeLostData.DataSourceKept);
			}
		}

		// Warn if field is used in an integration
		if (isFieldUsedInIntegration(field.guid)) {
			lostData.push(FieldChangeLostData.UsedInIntegration);
		}
		return lostData;
	};

	const changeFieldTypes = async (
		fields: IFormField[],
		newType: FormFieldType
	): Promise<boolean> => {
		let dataThatWillBeLost: FieldChangeLostData[] = [];
		fields.forEach((field) => {
			dataThatWillBeLost = dataThatWillBeLost.concat(
				fieldTypeChangeDataLoss(field, newType)
			);
		});
		dataThatWillBeLost = [...new Set(dataThatWillBeLost)]; // Keep only unique values
		if (dataThatWillBeLost.length) {
			const accepted = await tConfirmDialogAsync(
				t('component.adminChangeFieldType.lostData.title'),
				dataThatWillBeLost
					.map((lostData) =>
						t('component.adminChangeFieldType.lostData.' + lostData)
					)
					.join('\n\n') +
					'\n\n' +
					t('component.adminChangeFieldType.lostData.confirmContinue')
			);
			if (!accepted) {
				return false;
			}
		}

		for (const field of fields) {
			await updateFormFieldType(field, newType);
		}

		return true;
	};

	return { allowedNewTypes, changeFieldTypes };
};
