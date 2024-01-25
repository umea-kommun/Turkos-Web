<template>
	<div class="field-text-search-box" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-search-field-options :field="props.field" />
				</template>

				<template v-slot:display>
					<display-options :field="props.field" />
				</template>

				<template v-slot:data>
					<admin-data-search-options
						:field="props.field"
						:single-entity="false"
					/>
				</template>

				<template v-slot:integration>
					<admin-integration-options :field="props.field" />
				</template>
			</field-options-content>
		</div>

		<!-- EDIT -->
		<base-form-field
			v-if="mode === 'EDIT'"
			:label="title"
			:label-for="'field-' + id"
			:isRequired="isRequired"
			:admin-preview-label="
				adminPreview && $t('component.fieldSelectSearchList.newField')
			"
		>
			<v-layout>
				<v-col class="select-wrap pa-0">
					<v-text-field
						v-model="searchValue"
						@keyup.enter="dropboxEnter"
						@keydown="keyDown"
						:id="'field-' + id"
						density="compact"
						single-line
						autocomplete="off"
						role="combobox"
						color="primary"
						aria-autocomplete="list"
						:aria-activedescendant="activeMenuItem"
					>
						<template v-slot:append-inner>
							<div
								v-if="selectedItemValue"
								style="cursor: pointer"
							>
								<a @click.prevent="onClearClicked()">
									<v-icon icon="clear" />
								</a>
							</div>
							<div
								v-if="filteredItems.length"
								style="cursor: pointer"
							>
								<a @click.prevent="listVisible = !listVisible">
									<v-icon
										:icon="
											listVisible && filteredItems.length
												? 'arrow_drop_up'
												: 'arrow_drop_down'
										"
									/>
								</a>
							</div>
						</template>
					</v-text-field>
					<v-menu
						v-model="listVisible"
						:activator="'#field-' + id"
						:max-height="200"
						:class="'v-menu-' + id"
						location="bottom start"
						origin="top start"
					>
						<v-list v-if="filteredItems.length">
							<v-list-item
								v-for="item in filteredItems"
								:key="item.id"
								:id="'menu-item-' + item.id"
								@click.prevent="selectedItem = item"
								tabindex="-1"
								>{{ item.title }}</v-list-item
							>
						</v-list>
					</v-menu>
				</v-col>
				<v-col class="pa-0 pl-1">
					<v-btn
						color="primary"
						variant="outlined"
						role="menuitem"
						:loading="loadingData"
						@click="onClick()"
					>
						<span>
							{{ buttonText }}
						</span>
					</v-btn>
				</v-col>
			</v-layout>
			<div class="errorMessage">{{ errorMessage }}</div>
		</base-form-field>

		<!-- VIEW -->
		<div v-if="mode === 'VIEW'">
			<form-field-preview
				:title="title"
				:value="selectedItemTitle"
				:id="id"
			></form-field-preview>
		</div>

		<!-- PRINT -->
		<div v-if="mode === 'PRINT'">
			<PrintCheckBoxList
				:title="title"
				:helpText="helpText"
				:items="items"
				:multiple="false"
			></PrintCheckBoxList>
		</div>
	</div>
</template>

<script setup lang="ts">
import { MutationType, ErrorCode, FormMode } from '@/models/Enums';
import BaseFormField from '@/components/base/BaseFormField.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import PrintCheckBoxList from './print/PrintCheckBoxList.vue';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminSearchFieldOptions from '@/components/admin/AdminFieldOptions/AdminSearchFieldOptions.vue';
import AdminDataSearchOptions from '../admin/AdminFieldOptions/AdminDataSearchOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';
import { IItem, IRootState, ISingleValueField } from '@/models/IForm';
import { Helper } from '@/utils/helper';
import { computed, inject, PropType, ref, toRef, watch } from 'vue';
import { useSingleValueField } from './composable/SingleValueField';
import { useFieldValidation } from './composable/FieldValidation';
import { useFieldMenuNavigation } from './composable/FieldMenuNavigation';
import {
	checkIfFieldHasChild,
	whichFieldsAreMyChildren,
	getNewValueFromObject,
} from '@/store/utils';
import DataSourceApplier from '@/plugins/dataService/DataSourceApplier';
import DataSourceSearchApplier from '@/plugins/dataService/DataSourceSearchApplier';

import { useStore } from 'vuex';

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

const store = useStore<IRootState>();
const emit = defineEmits(['updatedValue', 'updatedOptions']);

const listVisible = ref(false);
const searchValue = ref('');
const selectedItemValue = ref('');
const loadingData = ref(false);
const errorMessage = ref<string>('');

let tempValue = '';

const { id, helpText, title, fieldOptions } = useSingleValueField({
	mode: props.mode,
	field: toRef(props, 'field'),
	emit,
});

const { getValidationId, isRequired } = useFieldValidation({
	validationId: props.validationId,
	validationScope: props.validationScope,
	fieldOptions,
	id,
});

function showList(): void {
	listVisible.value = true;
}
const { keyDown, activeMenuItem } = useFieldMenuNavigation({ id, showList });

const buttonText = computed(() => {
	return fieldOptions.value.buttonText
		? fieldOptions.value.buttonText
		: 'false'; // fix this, could default to t('sök')
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
	get: () => {
		return Helper.deepCopy(
			(fieldOptions.value as any).items || []
		) as IItem[];
	},
	set: (items: IItem[]) => {
		const options = fieldOptions.value;
		(options as any).items = items;
		emitUpdatedOptionsEvent(options);
	},
});

const filteredItems = computed(() => {
	const filtered = items.value.filter((item) => {
		if (
			item.title?.length &&
			item.title.toLowerCase().indexOf(searchValue.value.toLowerCase()) >
				-1
		) {
			return true;
		}
		return false;
	});
	return filtered;
});

const selectedItem = computed({
	get: () => {
		return items.value.find((item) => item.isChecked || false) as IItem;
	},
	set: (updatedSelectedItem: IItem) => {
		listVisible.value = false;
		let selectedValue: string = '';
		if (updatedSelectedItem && typeof updatedSelectedItem === 'string') {
			selectedValue = updatedSelectedItem;
		} else if (updatedSelectedItem) {
			selectedValue = updatedSelectedItem.title ?? '';
		}
		searchValue.value = selectedValue;

		const filteredItems = items.value.filter(
			(element) =>
				element.title?.toLowerCase() === selectedValue.toLowerCase()
		);
		if (updatedSelectedItem && filteredItems.length === 1) {
			// We must update isChecked since this isn't done when binding.
			items.value.forEach((item) => {
				let isChecked = false;
				// We could set item.isChecked direct, but this way we only change the one that needs change?
				isChecked =
					item.id === updatedSelectedItem.id ||
					item.id === filteredItems[0].id;

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

			selectedItemValue.value = selectedItem.value?.value ?? '';
		} else {
			selectedItemValue.value = '';
		}
	},
});

const selectedItemTitle = computed(() => {
	if (selectedItem.value) {
		return selectedItem.value.title || '';
	}
	return '';
});

const dataSourceApplier = inject('$dataSourceApplier') as DataSourceApplier;

const dataSourceSearchApplier = inject(
	'$dataSourceSearchApplier'
) as DataSourceSearchApplier;

async function getData(): Promise<IItem[]> {
	if (searchValue.value !== '') {
		loadingData.value = true;
		const dataSourceSearchAppliera = dataSourceSearchApplier;
		const dataSourceName = (props.field.fieldOptions as any)
			.searchDataSource.dataSourceName;
		const dataSourceData =
			await dataSourceSearchAppliera.fetchDataSourcesUsedInForm(
				dataSourceName,
				searchValue.value
			);
		errorMessage.value =
			dataSourceData.get(dataSourceName)?.toString() ===
			ErrorCode.NoData.toString()
				? 'Hittar inget resultat för ' +
				  searchValue.value +
				  ', kontrollera att du har skrivit rätt'
				: '';
		if (dataSourceData.size > 0) {
			const dataListan = dataSourceData.get(dataSourceName);
			if (typeof dataListan !== 'string') {
				loadingData.value = false;
				return dataListan as IItem[];
			}
		}
		loadingData.value = false;
	}
	return [];
}

async function getDataAndFilter(): Promise<void> {
	const filter = items.value.filter((element) =>
		element.title?.toLowerCase().includes(tempValue.toLowerCase())
	);
	if (filter.length === 0) {
		items.value = [];
		items.value = await getData();
	} else if (filter.length === 1 && items.value.length === 1) {
		const filter2 = items.value.filter(
			(element) =>
				element.title?.toLowerCase() === tempValue.toLowerCase()
		);
		if (filter2.length === 0) {
			items.value = [];
			items.value = await getData();
		}
	} else if (filter.length === 1) {
		selectedItem.value = filter[0];
		document.getElementById('field-' + id.value)?.blur();
	}
}

function checkForErrorMessage(data: any): void {
	if (data && typeof data === 'string') {
		if (data === ErrorCode.NoLegalOwnersFound) {
			errorMessage.value =
				errorMessage.value === ''
					? 'Det finns ingen lagfarenägare'
					: errorMessage.value + ' och ingen lagfarenägare';
		} else if (data === ErrorCode.NoPropertyAreasFound) {
			errorMessage.value =
				errorMessage.value === ''
					? 'Det finns inget område'
					: errorMessage.value + ' och inget område';
		} else if (data === ErrorCode.NoData) {
			errorMessage.value =
				errorMessage.value === ''
					? 'Det finns ingen data'
					: errorMessage.value === 'Det finns ingen data'
					? errorMessage.value
					: errorMessage.value + ' och ingen data';
		}
	}
}

async function applyDataSourceToTableFields(
	dataSourceData: any,
	field: any,
	tableFields: any
): Promise<void> {
	const newFieldRows: any[] = [];
	const newOpts = JSON.parse(JSON.stringify(field.fieldOptions));
	dataSourceData.forEach((data: any) => {
		const columns: any[] = [];
		tableFields.forEach((tableField: any) => {
			const newValueFromObject = getNewValueFromObject(data, tableField);
			if (newValueFromObject.fieldProperty === 'value') {
				columns.push({
					fieldGuid: tableField.guid,
					value: newValueFromObject.newValue,
					isItem: false,
				});
			} else {
				let first;
				if (newValueFromObject.newValue.length > 0) {
					const item = newValueFromObject.newValue[0];
					first = item.id;
				}
				columns.push({
					fieldGuid: tableField.guid,
					items: newValueFromObject.newValue,
					value: first,
					isItem: true,
				});
			}
		});
		newFieldRows.push({
			guid: Helper.generateUuid(),
			columns,
		});
	});
	if (newFieldRows.length > 0) {
		newOpts.tableRows = newFieldRows;
		if (newOpts.autofillNumberOfRows) {
			newOpts.minRows = newFieldRows.length;
			newOpts.maxRows = newFieldRows.length;
		}
	} else {
		const columns: any[] = [];
		tableFields.forEach((tableField: any) => {
			columns.push({
				fieldGuid: tableField.guid,
				value: '',
				isItem: false,
			});
		});
		newOpts.tableRows = [
			{
				guid: Helper.generateUuid(),
				columns,
			},
		];
	}
	newOpts.searchResponse = null;
	store.commit(MutationType.UpdateFormFieldTableRows, {
		fieldId: field.id,
		newValue: newOpts,
	});
}

function saveUpdatedFormField(
	fieldId: string,
	newValue: any,
	fieldProperty: string
): void {
	store.commit(MutationType.UpdateFormField, {
		fieldId,
		newValue,
		fieldProperty,
	});
}

async function GenerateValue(
	dataSourceAppliera: any,
	searchValue: string,
	searchParameter: string,
	myChildren: any
): Promise<void> {
	const dataSourceData = await dataSourceAppliera.fetchDataSourcesUsedInForm(
		store.state.form,
		searchValue,
		searchParameter
	);
	if (dataSourceData.size > 0) {
		myChildren.forEach((field: any) => {
			const data = dataSourceData.get(field.dataSourceName);
			if (!field.tableType && !field.fieldOptions.tableGuid) {
				checkForErrorMessage(data);
				const newValueFromObject = getNewValueFromObject(data, field);
				saveUpdatedFormField(
					field.id,
					newValueFromObject.newValue,
					newValueFromObject.fieldProperty
				);
			} else if (field.tableType) {
				const tableFields = myChildren.filter(
					(f: any) => f.fieldOptions.tableGuid === field.guid
				);
				if (data) {
					if (typeof data === 'string') {
						checkForErrorMessage(data);
						const newOpts = {
							...field.fieldOptions,
							tableRows: [],
						};
						store.commit(MutationType.UpdateFormFieldTableRows, {
							fieldId: field.id,
							newValue: newOpts,
						});
					} else {
						applyDataSourceToTableFields(data, field, tableFields);
					}
				} else {
					const newFieldOpts = {
						...field.fieldOptions,
						tableRows: [],
					};
					store.commit(MutationType.UpdateFormFieldTableRows, {
						fieldId: field.id,
						newValue: newFieldOpts,
					});
				}
			}
		});
	} else {
		myChildren.forEach((field: any) => {
			if (!field.tableType && !field.fieldOptions.tableGuid) {
				if (field.singleField) {
					saveUpdatedFormField(field.id, '', 'value');
				} else {
					const items: any = [];
					const newValue = { ...field.fieldOptions, items };
					saveUpdatedFormField(field.id, newValue, 'fieldOptions');
				}
			} else if (field.tableType) {
				const newFieldOpts = {
					...field.fieldOptions,
					tableRows: [],
				};
				store.commit(MutationType.UpdateFormFieldTableRows, {
					fieldId: field.id,
					newValue: newFieldOpts,
				});
			}
		});
	}
}

async function onClearClicked(): Promise<void> {
	searchValue.value = '';
	errorMessage.value = '';
	selectedItemValue.value = '';

	// Uncheck all items
	emitUpdatedOptionsEvent({
		...fieldOptions.value,
		items: items.value.map((item) => ({ ...item, isChecked: false })),
	});

	const dataSourceAppliera = dataSourceApplier;
	const dataSourceSpecifications =
		await dataSourceAppliera.fetchDataSourceSpecifications();
	if (store.state.form) {
		const myChildren = whichFieldsAreMyChildren(
			props.field.guid,
			store.state.form,
			dataSourceSpecifications
		);
		GenerateValue(
			dataSourceAppliera,
			'',
			myChildren[0].searchParameter,
			myChildren
		);
	}
}

function dropboxEnter(): void {
	getDataAndFilter();
}

function onClick(): void {
	getDataAndFilter();
}

watch(searchValue, (val) => {
	if (val && val.length > 2) {
		tempValue = val;
	}
});

watch(selectedItemValue, async () => {
	if (selectedItemValue.value && store.state.form) {
		loadingData.value = false;
		if (
			checkIfFieldHasChild(props.field.guid, store.state.form) &&
			selectedItem.value &&
			selectedItem.value.id !== ''
		) {
			errorMessage.value = '';
			const dataSourceAppliera = dataSourceApplier;
			const dataSourceSpecifications =
				await dataSourceAppliera.fetchDataSourceSpecifications();
			const myChildren = whichFieldsAreMyChildren(
				props.field.guid,
				store.state.form,
				dataSourceSpecifications
			);
			await GenerateValue(
				dataSourceAppliera,
				selectedItemValue.value,
				myChildren[0].searchParameter,
				myChildren
			);
			errorMessage.value =
				errorMessage.value === ''
					? ''
					: errorMessage.value +
					  ' till detta resultat, kontrollera att du har skrivit rätt';
		}
	}
});

watch(items, (newItems, prevItems) => {
	if (items.value.length > 0) {
		if (
			items.value.length === 1 &&
			!selectedItem.value &&
			prevItems.length === 0
		) {
			selectedItem.value = items.value[0];
			listVisible.value = false;
		} else {
			if (selectedItem.value) {
				document.getElementById('field-' + id.value)?.blur();
			} else {
				if (!listVisible.value) {
					document.getElementById('field-' + id.value)?.click();
					document.getElementById('field-' + id.value)?.focus();
				}
			}
		}
		loadingData.value = false;
	}
});
</script>

<style scoped lang="scss">
.select-wrap {
	flex: auto;
}
.errorMessage {
	color: $error;
}
:deep(.v-field__input) {
	padding-left: 0;
}
</style>
