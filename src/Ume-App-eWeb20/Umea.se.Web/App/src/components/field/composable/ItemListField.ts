import { FormMode, MutationType, ValidationRuleType } from '@/models/Enums';
import {
	IRootState,
	IItem,
	IItemFieldOptions,
	IItemListField,
} from '@/models/IForm';
import { IValidationRule } from '@/models/IValidation';
import { Helper } from '@/utils/helper';
import { computed, ComputedRef, Ref, WritableComputedRef } from 'vue';
import { useStore } from 'vuex';

interface IItemListFieldParams {
	mode: FormMode;
	field: Ref<IItemListField>;
	emit: any;
}
interface IItemListFieldReturn {
	fieldOptions: ComputedRef<IItemFieldOptions>;
	checkedItemsPreviewValue: ComputedRef<string>;
	id: ComputedRef<string>;
	title: WritableComputedRef<string>;
	items: WritableComputedRef<IItem[]>;
	checkedItems: WritableComputedRef<IItem[]>;
	selectedItem: WritableComputedRef<IItem>;
	helpText: WritableComputedRef<string>;
	required: WritableComputedRef<boolean>;
	allowMultipleChoices: WritableComputedRef<boolean>;
	loadingDataSource: ComputedRef<boolean>;
	storeUpdateFormField(value: any, property: string): void;
}

export const useItemListField = ({
	field,
	emit,
}: IItemListFieldParams): IItemListFieldReturn => {
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
	 * Updates store NO debounce
	 * @param value The value we want to update in the store
	 * @param property Name of the property we want to update. ex: 'title'
	 */
	function emitUpdatedOptionsEvent(options: any): void {
		emit('updatedOptions', { newOptions: options });
	}

	const items = computed({
		/**
		 * Get items from state
		 * @return {IItem[]} A list with items
		 */
		get: () => {
			return Helper.deepCopy(fieldOptions.value.items || []) as IItem[];
		},
		/**
		 * Set items in state
		 * @param {IItem} items - Items to set
		 */
		set: (items: IItem[]) => {
			const options = fieldOptions.value;
			options.items = items;
			emitUpdatedOptionsEvent(options);
		},
	});

	const checkedItems = computed({
		/**
		 * Get checked items in state
		 * @return {IItem[]} Items that are checked
		 */
		get: () => {
			return items.value.filter((item) => item.isChecked);
		},
		/**
		 * Set checked items in state
		 * Used for checkbox that want's a array for v-model binding.
		 * @param {IItem[]} item - Items (checkbox) that are checked
		 */
		set: (checkedItems: IItem[]) => {
			// We must update isChecked since this isn't done when binding.
			// Parameter checkedItems is only a list of checkbox's that are checked but boolean isChecked is not changed
			items.value.forEach((item) => {
				let isChecked = false;
				// We could set item.isChecked direct, but this way we only change the one that needs change
				isChecked = checkedItems.some((d) => d.id === item.id);

				// Set isChecked flag in the computed items
				if (isChecked !== item.isChecked) {
					item.isChecked = isChecked;
				}
			});

			// Send all items to store
			emitUpdatedOptionsEvent({
				...fieldOptions.value,
				items: items.value,
			});
		},
	});

	const checkedItemsPreviewValue = computed(() => {
		return checkedItems.value
			? checkedItems.value.map((element) => element.title).join('<br />')
			: '';
	});

	const selectedItem = computed({
		/** Get selected item in state
		 * @return {IItem} Item that is selected
		 */
		get: () => {
			return items.value.find((item) => item.isChecked || false) as IItem;
		},
		/**
		 * Set selected items in state.
		 * Used for radiobutton and selectlist that want's a single value for v-model binding.
		 * @param {IItem} item - Item (ex: radiobutton) that is selected
		 */
		set: (selectedItem: IItem) => {
			if (selectedItem && typeof selectedItem !== 'string') {
				// We must update isChecked since this isn't done when binding.
				items.value.forEach((item) => {
					let isChecked = false;
					// We could set item.isChecked direct, but this way we only change the one that needs change?
					isChecked = item.id === selectedItem.id;

					// Set isChecked flag in the computed items
					if (isChecked !== item.isChecked) {
						item.isChecked = isChecked;
					}
				});

				// Send all items to store
				emitUpdatedOptionsEvent({
					...fieldOptions.value,
					items: items.value,
				});

				if (field.value.displayRuleMultipleLegitimation) {
					if (fieldOptions.value.contactInfo) {
						// We must update isChecked since this isn't done when binding.
						fieldOptions.value.contactInfo.forEach((item) => {
							let isSelected = false;
							// We could set item.isChecked direct, but this way we only change the one that needs change?
							isSelected = item.id === selectedItem.id;

							// Set isChecked flag in the computed items
							if (isSelected !== item.isSelected) {
								item.isSelected = isSelected;
							}
						});
						// We must update isChecked since this isn't done when binding.
						fieldOptions.value.items?.forEach((item) => {
							let isChecked = false;
							// We could set item.isChecked direct, but this way we only change the one that needs change?
							isChecked = item.id === selectedItem.id;

							// Set isChecked flag in the computed items
							if (isChecked !== item.isChecked) {
								item.isChecked = isChecked;
							}
						});
						const str = JSON.stringify(
							fieldOptions.value.contactInfo,
							null,
							2
						);

						// Send all items to store
						emitUpdatedOptionsEvent({
							...fieldOptions.value,
							contactInfo: fieldOptions.value.contactInfo,
						});
					}
				}
			}
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

	const allowMultipleChoices = computed({
		get: () => {
			return fieldOptions.value.allowMultipleChoices ?? false;
		},
		set: (value: boolean) => {
			const options = fieldOptions.value;
			options.allowMultipleChoices = value;

			if (!value) {
				// We need to make sure not multiple items are marked as preselected.
				let foundPreSelectedItem = false;
				options.items?.forEach((item) => {
					if (item.isChecked && !foundPreSelectedItem) {
						foundPreSelectedItem = true;
					} else {
						item.isChecked = false;
					}
				});
			}

			emitUpdatedOptionsEvent(options);
		},
	});

	const loadingDataSource = computed(() => {
		return (
			store.state.fieldsLoadingDataSource.indexOf(field.value.guid) > -1
		);
	});

	return {
		fieldOptions,
		checkedItemsPreviewValue,
		id,
		title,
		items,
		checkedItems,
		selectedItem,
		helpText,
		required,
		allowMultipleChoices,
		storeUpdateFormField,
		loadingDataSource,
	};
};
