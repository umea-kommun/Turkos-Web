import { FormMode, MutationType, ValidationRuleType } from '@/models/Enums';
import { ITableFieldOptions, IRootState, ITableField } from '@/models/IForm';
import { IValidationRule } from '@/models/IValidation';
import { Helper } from '@/utils/helper';
import { computed, ComputedRef, Ref, WritableComputedRef } from 'vue';
import { useStore } from 'vuex';

interface ITableFieldParams {
	mode: FormMode | string;
	field: Ref<ITableField>;
	emit?: any;
}
interface ITableFieldReturn {
	fieldOptions: ComputedRef<ITableFieldOptions>;
	id: ComputedRef<string>;
	title: WritableComputedRef<string>;
	helpText: WritableComputedRef<string>;
	minRows: WritableComputedRef<string>;
	maxRows: WritableComputedRef<string>;
	autofillNumberOfRows: WritableComputedRef<boolean>;
	rowDisplay: WritableComputedRef<string>;
	objectName: WritableComputedRef<string>;
	storeUpdateFormField(value: any, property: string): void;
}

export const useTableField = ({
	field,
	emit,
}: ITableFieldParams): ITableFieldReturn => {
	const store = useStore<IRootState>();

	const fieldOptions = computed(() => {
		return field.value.fieldOptions
			? Helper.deepCopy(field.value.fieldOptions)
			: ({} as ITableFieldOptions);
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
	 * Get rowDisplay from state
	 * @return {string} RowDisplay for field
	 */
	const rowDisplay = computed({
		get: () => {
			return fieldOptions.value.rowDisplay
				? fieldOptions.value.rowDisplay
				: 'tableRows';
		},
		set: (newRowDisplay: string) => {
			const newFieldOptions = { ...fieldOptions.value };
			newFieldOptions.rowDisplay = newRowDisplay;
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		},
	});

	/**
	 * Get objectName from state
	 * @return {string} ObjectName for field
	 */
	const objectName = computed({
		get: () => {
			return fieldOptions.value.objectName
				? fieldOptions.value.objectName
				: '';
		},
		set: (newObjectName: string) => {
			const newFieldOptions = { ...fieldOptions.value };
			newFieldOptions.objectName = newObjectName;
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		},
	});

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
	 * Get minRows from state
	 * @return {string} MinRows for field
	 */
	const minRows = computed({
		get: () => {
			return fieldOptions.value.minRows
				? fieldOptions.value.minRows.toString()
				: '';
		},
		set: (newMinRows: string) => {
			const newFieldOptions = { ...fieldOptions.value };
			newFieldOptions.minRows = Number(newMinRows);
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		},
	});

	/**
	 * Get maxRows from state
	 * @return {string} MaxRows for field
	 */
	const maxRows = computed({
		get: () => {
			return fieldOptions.value.maxRows
				? fieldOptions.value.maxRows.toString()
				: '';
		},
		set: (newMaxRows: string) => {
			const newFieldOptions = { ...fieldOptions.value };
			newFieldOptions.maxRows = Number(newMaxRows);
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		},
	});

	const autofillNumberOfRows = computed({
		get: () => {
			return fieldOptions.value.autofillNumberOfRows
				? fieldOptions.value.autofillNumberOfRows
				: false;
		},
		set: (newAutofillNumberOfRows: boolean) => {
			const newFieldOptions = { ...fieldOptions.value };
			newFieldOptions.autofillNumberOfRows = newAutofillNumberOfRows;
			storeUpdateFormField(newFieldOptions, 'fieldOptions');
		},
	});

	// We have to return everything that the parent should have access to.
	return {
		fieldOptions,
		id,
		title,
		helpText,
		minRows,
		maxRows,
		autofillNumberOfRows,
		rowDisplay,
		objectName,
		storeUpdateFormField,
	};
};
