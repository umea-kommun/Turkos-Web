import { FormFieldType } from '@/models/Enums';
import {
	IFormField,
	IItem,
	ISingleValueField,
	ITableColumn,
	ITableField,
	ITableRow,
} from '@/models/IForm';
import { Helper } from '@/utils/helper';
import { ref, Ref } from 'vue';

interface IAbstractTableParams {
	field: Ref<ITableField>;
	tableFields: Ref<IFormField[]>;
	tableRows: Ref<ITableRow[]>;
	emit?: any;
}

interface IAbstractTableReturn {
	mounted(): void;
	addRow(): void;
	updateRowValue(rowGuid: string, fieldGuid: string, $event: any): void;
	deleteRow(rowGuid: string): void;
	copyField(field: any, tableRow: any): IFormField;
}

export const useAbstractTable = ({
	field,
	tableFields,
	tableRows,
	emit,
}: IAbstractTableParams): IAbstractTableReturn => {
	const isItemFiller = ref<string>('');

	function newRow(): ITableRow {
		const columns: ITableColumn[] = [];
		tableFields.value.forEach((field) => {
			let isItem = field.fieldOptions.items ? true : false;
			let value = '';
			if (field.fieldOptions.dataSource) {
				if (field.fieldOptions.dataSource.options.itemFiller) {
					isItemFiller.value =
						field.fieldOptions.dataSource.options.itemFiller;
					isItem = true;
				}
				if (
					field.type.toLowerCase() ===
						FormFieldType.SelectList.toLowerCase() ||
					field.type.toLowerCase() ===
						FormFieldType.CheckBox.toLowerCase() ||
					field.type.toLowerCase() ===
						FormFieldType.RadioButton.toLowerCase()
				) {
					isItem = true;
				}
			}
			if (isItem) {
				if (
					isItemFiller.value &&
					field.type.toLowerCase() ===
						FormFieldType.SelectList.toLowerCase()
				) {
					value = '0';
				} else {
					field.fieldOptions.items.forEach((element: any) => {
						if (element.isChecked) {
							value = element.id;
						}
					});
				}
			} else {
				value = (field as ISingleValueField).value;
			}
			columns.push({
				fieldGuid: field.guid,
				value,
				isItem,
			} as ITableColumn);
		});
		return { guid: Helper.generateUuid(), columns };
	}

	function mounted(): void {
		let min = field.value.fieldOptions.minRows || 0;
		let max = field.value.fieldOptions.maxRows || 0;
		if (min > 0 && max === 0) {
			max = 1;
		}
		// let i = min;
		const fieldCopy = tableFields.value.find(
			(f) =>
				f.fieldOptions.dataSource &&
				f.fieldOptions.dataSource.options &&
				f.fieldOptions.dataSource.options.itemFiller
		);
		if (
			!fieldCopy &&
			tableRows.value.length < max &&
			tableRows.value.length === 0
		) {
			for (min; min > 0; min--) {
				tableRows.value.push(newRow());
			}

			emit('updatedRows', { tableRows: tableRows.value });
		}
	}

	function addRow(): void {
		tableRows.value.push(newRow());
		if (isItemFiller.value) {
			// if field is itemFiller, copy data values.
			const fieldItemsCopy: any = [];
			tableRows.value.forEach((item) => {
				item.columns.forEach((field) => {
					const tableField = tableFields.value.find(
						(f) => f.guid === field.fieldGuid
					) as IFormField;
					if (
						field.isItem &&
						field.items &&
						tableField.fieldOptions.dataSource.options.itemFiller
					) {
						field.items.forEach((element: any) => {
							if (
								fieldItemsCopy.findIndex(
									(f: any) => f.id === element.id
								) === -1
							) {
								fieldItemsCopy.push({
									id: element.id,
									title: element.title,
									value: element.value,
									disabled: element.disabled,
								});
							}
						});
						fieldItemsCopy.forEach((element: any) => {
							if (
								field.value.toString() !== '0' &&
								element.id.toString() === field.value.toString()
							) {
								element.disabled = true;
							}
						});
					} else if (field.isItem) {
						if (
							tableField.fieldOptions.dataSource.options
								.itemFiller
						) {
							field.items = fieldItemsCopy;
						} else {
							field.items = [];
						}
					}
				});
			});
		}
		emit('updatedRows', { tableRows: tableRows.value });
	}

	function deleteRow(rowGuid: string): void {
		if (isItemFiller.value) {
			const myItem = tableRows.value.find((f) => f.guid === rowGuid);
			if (myItem) {
				const myItemValue = myItem.columns.find((f) => f.isItem);
				if (myItemValue) {
					tableRows.value.forEach((item) => {
						item.columns.forEach((field) => {
							if (field.isItem && field.items) {
								field.items.forEach((element: any) => {
									if (
										element.id.toString() ===
										myItemValue.value.toString()
									) {
										element.disabled = false;
									}
								});
							}
						});
					});
				}
			}
		}
		const index = tableRows.value.findIndex((f) => f.guid === rowGuid);
		tableRows.value.splice(index, 1);
		emit('updatedRows', { tableRows: tableRows.value });
	}

	function copyField(field: any, tableRow: any): IFormField {
		const fieldCopy = Helper.deepCopy(field);
		const row = tableRow.columns.find(
			(c: any) => c.fieldGuid === fieldCopy.guid
		);
		if (!row) {
			return fieldCopy;
		}
		if (row.isItem) {
			if (row.value || row.items) {
				if (row.contactInfos) {
					fieldCopy.fieldOptions.contactInfo = row.contactInfos;
				}
				if (
					fieldCopy.fieldOptions.items &&
					fieldCopy.fieldOptions.items.length > 0
				) {
					fieldCopy.fieldOptions.items.forEach((item: any) => {
						item.isChecked = false;
					});
					if (
						typeof row.value === 'string' ||
						row.value instanceof String
					) {
						row.value.split(',').forEach((checkItemId: any) => {
							if (checkItemId !== '') {
								if (
									fieldCopy.fieldOptions.items.findIndex(
										(f: any) => f.id === checkItemId
									) > -1
								) {
									fieldCopy.fieldOptions.items.find(
										(f: any) => f.id === checkItemId
									).isChecked = true;
								} else {
									if (
										fieldCopy.fieldOptions.items.find(
											(f: any) => f.value === checkItemId
										)
									) {
										fieldCopy.fieldOptions.items.find(
											(f: any) => f.value === checkItemId
										).isChecked = true;
									}
								}
							}
						});
					}
				} else {
					if (row.items && row.items.length > 0) {
						fieldCopy.fieldOptions.items = [];
						let first = true;
						row.items.forEach((element: any) => {
							fieldCopy.fieldOptions.items.push({
								id: element.id,
								isChecked: first,
								title: element.title,
								value: element.value,
								disabled: element.disabled,
							} as IItem);
							first = false;
						});

						if (!Array.isArray(row.value)) {
							fieldCopy.fieldOptions.items.forEach(
								(element: any) => {
									if (
										row.value === element.id ||
										row.value === element.id.toString()
									) {
										element.isChecked = true;
									} else {
										element.isChecked = false;
									}
								}
							);
						}
					} else {
						fieldCopy.fieldOptions.items = [];
					}
				}
			}
		} else {
			fieldCopy.value = row.value;
		}
		return fieldCopy;
	}

	function updateRowValue(
		rowGuid: string,
		fieldGuid: string,
		$event: any
	): void {
		const row = tableRows.value.find((f) => f.guid === rowGuid);
		if (!row) {
			throw new Error('Row missing with guid ' + rowGuid);
		}
		const column = row.columns.find((c) => c.fieldGuid === fieldGuid);
		if (!column) {
			throw new Error('Column missing with guid ' + fieldGuid);
		}

		if ('newValue' in $event) {
			column.value = $event.newValue;
			column.isItem = false;
		} else if ($event.newOptions && $event.newOptions.items) {
			const checkedItems = $event.newOptions.items.filter(
				(f: any) => f.isChecked
			);
			column.value = checkedItems.map((i: IItem) => i.id).join(',');
			column.isItem = true;
		} else {
			console.error(
				'Unable to update row values with this payload',
				$event
			);
		}

		const valuelista: any = [];
		tableRows.value.forEach((item) => {
			item.columns.forEach((field) => {
				const tableField = tableFields.value.find(
					(f) => f.guid === field.fieldGuid
				) as IFormField;
				if (
					field.isItem &&
					field.items &&
					tableField.fieldOptions.dataSource.options.itemFiller
				) {
					if (field.value.toString() !== '0') {
						valuelista.push(field.value);
					}
				}
			});
		});

		tableRows.value.forEach((item) => {
			item.columns.forEach((field) => {
				const tableField = tableFields.value.find(
					(f) => f.guid === field.fieldGuid
				) as IFormField;
				if (
					field.isItem &&
					field.items &&
					tableField.fieldOptions.dataSource.options.itemFiller
				) {
					field.items.forEach((element: any) => {
						if (
							valuelista.findIndex(
								(f: any) =>
									f.toString() === element.id.toString()
							) !== -1 &&
							field.value.toString() !== element.id.toString()
						) {
							element.disabled = true;
						} else {
							element.disabled = false;
						}
					});
				}
			});
		});
		emit('updatedRows', { tableRows: tableRows.value });
	}

	return {
		mounted,
		addRow,
		updateRowValue,
		deleteRow,
		copyField,
	};
};
