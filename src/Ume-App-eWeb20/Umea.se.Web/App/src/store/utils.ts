import {
	FormStatus,
	FormFieldInterface,
	MutationType,
	IntegrationType,
} from './../models/Enums';
import {
	IForm,
	IFormField,
	FieldTypeInterfaceMapp,
	IFormStep,
	IItemListField,
	IDisplayRule,
	IUser,
	ITableFieldOptions,
	IItem,
	ISingleValueField,
	IDisplayRuleGroup,
	ICondition,
} from '@/models/IForm';
import { FormFieldType, ConditionChoice, QueryOption } from '@/models/Enums';
import store from '@/store/store';
import { Helper } from '@/utils/helper';
import { ISharepointFieldMapping } from '@/plugins/integrations/advanced-sharepoint/models';
import { SharepointIntegrationOptionKey } from '@/plugins/integrations/advanced-sharepoint/enums';
import { EmailIntegrationOptionKey } from '@/plugins/integrations/email/enums';

export const FormFieldLookup = {
	/**
	 * Returns which type of interface this particular field implements
	 * See also FormFieldInterface
	 * @param formField
	 */
	getInstanceOf(formField: IFormField): string {
		const requestedFormFieldType = formField.type.toLowerCase();
		let interfaceOutput: string = '';
		Object.keys(FieldTypeInterfaceMapp).forEach((formFieldInterface) => {
			const types: FormFieldType[] =
				FieldTypeInterfaceMapp[formFieldInterface];
			const found =
				types
					.map((type) => type.toLowerCase())
					.indexOf(requestedFormFieldType) > -1;
			if (found && interfaceOutput !== '') {
				throw new Error(
					'Found multiple interfaces for the same formFieldType'
				);
			} else if (found) {
				interfaceOutput = formFieldInterface;
			}
		});
		if (interfaceOutput === '') {
			throw new Error(
				`Interface could not be found for field of type "${formField.type}".
              Please check that you have added a mapping between fields of type "${formField.type}"
              and an appropriate interface to the "FieldTypeInterfaceMapp"`
			);
		}
		return interfaceOutput;
	},
};

export function findStepIndex(form: IForm, id: string): number {
	const steps = form.attributes.steps;
	let stepIndex;
	for (let i = 0; i < steps.length; i++) {
		const foundFields = steps[i].fields.filter(
			(field) => field.id.toString() === id.toString()
		);
		if (foundFields.length > 0) {
			stepIndex = i;
			break;
		}
	}
	if (stepIndex === undefined) {
		throw new Error(
			'Unable to find any step containing a field with id "' + id + '"'
		);
	}
	return stepIndex;
}

export function findFormFieldInStep(
	form: IForm,
	stepIndex: number,
	id: string
): IFormField {
	// Validate StepIndex
	if (stepIndex === undefined || stepIndex < 0) {
		throw new Error('Step could not be found!');
	}

	const found = form.attributes.steps[stepIndex].fields.filter(
		(field) => field.id.toString() === id.toString()
	);
	if (found.length === 0) {
		throw new Error('No field found with id ' + id);
	} else if (found.length > 1) {
		throw new Error('Found multiple fields with id=' + id);
	}
	return found[0] as IFormField;
}

export function findFormFieldByGuid(
	form: IForm,
	fieldGuid: string
): IFormField {
	let found;
	form.attributes.steps.every((step) => {
		found = step.fields.find((f) => {
			return f.guid === fieldGuid;
		});
		return found ? false : true; // if found we return false, which breaks the iteration
	});
	if (!found) {
		throw new Error('No field found with guid ' + fieldGuid);
	}
	return found as IFormField;
}

/**
 * Return the step in store
 * @param form The form in store
 * @param stepId The stepid we are looking fore
 */
export function findStep(form: IForm, stepId: string): IFormStep {
	const steps = form.attributes.steps;
	const step = steps.find(
		(s: IFormStep) => s.id.toString() === stepId.toString()
	);
	if (step === undefined) {
		throw new Error(`Unable to find any step with id "${stepId}"`);
	}
	return step;
}

// export function getContactPaths(): any { // FIX THIS
// 	return [
// 		{
// 			title: i18n.t(
// 				'component.adminForm.userRequirements.contactPaths.mail'
// 			),
// 			isChecked: false,
// 			value: 1,
// 			id: 1,
// 		},
// 		{
// 			title: i18n.tc(
// 				'component.adminForm.userRequirements.contactPaths.sms'
// 			),
// 			isChecked: false,
// 			value: 2,
// 			id: 2,
// 		},
// 		{
// 			title: i18n.tc(
// 				'component.adminForm.userRequirements.contactPaths.myMessages'
// 			),
// 			isChecked: false,
// 			value: 3,
// 			id: 3,
// 		},
// 		{
// 			title: i18n.tc(
// 				'component.adminForm.userRequirements.contactPaths.QR'
// 			),
// 			isChecked: false,
// 			value: 4,
// 			id: 4,
// 		},
// 	];
// }

function getAuthClients(
	authMetaData: Array<{ displayName: string; name: string }>
): Array<{ displayName: string; name: string; metadata: any }> {
	if (authMetaData) {
		return authMetaData.map((config) => {
			return {
				displayName: config.displayName,
				name: config.name,
				metadata: {
					metaDataType: 'IUser',
					metaDataParameter: 'authClientName',
				},
			};
		});
	} else {
		return [
			{
				name: 'Publik',
				displayName: 'Publika användare (via t.ex. BankID)',
				metadata: {
					metaDataType: 'IUser',
					metaDataParameter: 'authClientName',
				},
			},
		];
	}
}
function getMetaAge(
	name: string,
	displayName: string
): Array<{ displayName: string; name: string; metadata: any }> {
	return [
		{
			name: name,
			displayName: displayName,
			metadata: {
				metaDataType: 'IUser',
				metaDataParameter: 'age',
			},
		},
	];
}

export function getAvailableMetaDataLista(
	authMetaData: Array<{ displayName: string; name: string }>
): any {
	const a = authMetaData;
	return [
		{
			id: 1,
			guid: '206e9cc3-7889-4fee-8f2f-a4aee5960bba',
			displayName: 'Inloggning',
			metaDataList: getAuthClients(authMetaData),
			type: 'array',
		},
		{
			id: 2,
			guid: '506e9cc3-7889-4fee-8f2f-a4aee5960bbba',
			displayName: 'Ålder, idag',
			metaDataList: getMetaAge('ageToday', 'Ålder, idag'),
			type: 'numeric',
		},
		{
			id: 3,
			guid: '506e9cc3-7889-4fee-8f2f-a4aee5960bbbb',
			displayName: 'Ålder, i år',
			metaDataList: getMetaAge('ageThisYear', 'Ålder, i år'),
			type: 'numeric',
		},
		{
			id: 4,
			guid: '506e9cc3-7889-4fee-8f2f-a4aee5960bbbc',
			displayName: 'Ålder, antal dagar till ny ålder',
			metaDataList: getMetaAge(
				'newAgeInXDays',
				'Ålder, antal dagar till ny ålder'
			),
			type: 'numeric',
		},
	];
}

export function sleep(milliseconds: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function isVisibleMeta(displayRule: IDisplayRule, user: IUser): boolean {
	if (displayRule) {
		// Evaluate found display rule (this could possibly be cached)
		if (displayRule.metadata) {
			const metaData = JSON.parse(displayRule.metadata);
			if (
				metaData.metaDataType === 'IUser' &&
				metaData.metaDataParameter === 'authClientName'
			) {
				if (displayRule.fieldOptionId === user.authClientName) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		console.warn(
			'Field refering to a displayRule which is not present in the form'
		);
	}
	return true;
}

export function isVisible(
	displayRule: IDisplayRule,
	visibleFields: IFormField[],
	form: IForm
): boolean {
	if (displayRule) {
		// Evaluate found display rule (this could possibly be cached)

		if (displayRule.metadata === '') {
			const motherField = findFormFieldByGuid(
				form,
				displayRule.fieldGuid
			);
			const fieldInterface = FormFieldLookup.getInstanceOf(motherField);
			const isMotherInList = visibleFields.filter(
				(field) => field.guid === motherField.guid
			);
			if (fieldInterface !== FormFieldInterface.ItemListField) {
				console.warn(
					'Trying to evaluate a displayRule connected to a "mother" field which type is not supported. ' +
						'Only ItemListFields are supported, this field is a ' +
						fieldInterface
				);
			} else if (isMotherInList.length > 0) {
				const motherFieldItems = (
					(motherField as IItemListField).fieldOptions || {}
				).items;
				// We have found the items that will decide whether or not to display this child
				if (motherFieldItems) {
					const checkedItems = motherFieldItems.filter(
						(item) => item.isChecked
					);
					if (
						!checkedItems.find(
							(item) =>
								item.id &&
								item.id.toString() ===
									displayRule.fieldOptionId.toString()
						)
					) {
						// the checked items does not include the one expected by the display rule,
						// hence this child field should not be visible
						return false;
					}
				}
				if (motherField.displayRuleGuids.length > 0) {
					const displayRules = [] as IDisplayRule[];
					motherField.displayRuleGuids.forEach((f) => {
						displayRules.push(
							form.attributes.displayRules.filter(
								(r) => r.guid === f.guid
							)[0]
						);
					});
					displayRules.forEach((displayRule) => {
						if (!isVisible(displayRule, visibleFields, form)) {
							// This field should be displayed but the "mother" field shouldnt. This
							// means that this field gets hidden by-proxy
							return false;
						}
					});
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		console.warn(
			'Field refering to a displayRule which is not present in the form'
		);
	}
	return true;
}

export function isVisibleInAnotherStep(
	displayRule: IDisplayRule,
	form: IForm
): boolean {
	if (displayRule) {
		// Evaluate found display rule (this could possibly be cached)
		if (displayRule.metadata === '') {
			const motherField = findFormFieldByGuid(
				form,
				displayRule.fieldGuid
			);
			const fieldInterface = FormFieldLookup.getInstanceOf(motherField);
			if (fieldInterface !== FormFieldInterface.ItemListField) {
				console.warn(
					'Trying to evaluate a displayRule connected to a "mother" field which type is not supported. ' +
						'Only ItemListFields are supported, this field is a ' +
						fieldInterface
				);
			}
			let isMotherInOtherStep = false;
			form.attributes.steps.forEach((step) => {
				step.fields.forEach((field) => {
					if (displayRule.fieldGuid === field.guid) {
						field.fieldOptions.items.forEach((item: any) => {
							if (
								displayRule.fieldOptionId === item.id &&
								item.isChecked
							) {
								const displayRules = [] as IDisplayRule[];
								if (field.displayRuleGuids.length > 0) {
									field.displayRuleGuids.forEach((f) => {
										displayRules.push(
											form.attributes.displayRules.filter(
												(r) => r.guid === f.guid
											)[0]
										);
									});
								}
								if (displayRules.length === 0) {
									isMotherInOtherStep = true;
								} else {
									displayRules.forEach((innerDisplayRule) => {
										if (
											isVisibleInAnotherStep(
												innerDisplayRule,
												form
											)
										) {
											isMotherInOtherStep = true;
										}
									});
								}
							}
						});
					}
				});
			});
			return isMotherInOtherStep;
		} else {
			return false;
		}
	} else {
		console.warn(
			'Field refering to a displayRule which is not present in the form'
		);
	}
	return true;
}

export function checkIfFieldHasChild(fieldGuid: string, form: IForm): boolean {
	let check = false;
	form.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			if (
				field?.fieldOptions?.dataSource?.options
					?.dependsOnDataSourceSearchParameter
			) {
				if (
					fieldGuid ===
					field.fieldOptions.dataSource.options
						.dependsOnDataSourceSearchParameters[0]
				) {
					check = true;
				}
			}
		});
	});
	return check;
}

export function whichFieldsAreMyChildren(
	fieldGuid: string,
	form: IForm,
	dataSourceSpecifications: any
): any {
	const linkedToMe: any = [];
	form.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			if (
				field.fieldOptions &&
				field.fieldOptions.dataSource &&
				field.fieldOptions.dataSource.options &&
				field.fieldOptions.dataSource.options
					.dependsOnDataSourceSearchParameter
			) {
				if (
					fieldGuid ===
					field.fieldOptions.dataSource.options
						.dependsOnDataSourceSearchParameters[0]
				) {
					const dataSourceSpecification =
						dataSourceSpecifications.find(
							(f: any) =>
								f.dataSourceName ===
								field.fieldOptions.dataSource.dataSourceName
						) as any;
					linkedToMe.push({
						id: field.id,
						guid: field.guid,
						tableType:
							field.type.toLowerCase() ===
							FormFieldType.Table.toLowerCase(),
						dataSourceName:
							field.fieldOptions.dataSource.dataSourceName,
						itemProperty:
							field.fieldOptions.dataSource.options.itemProperty,
						searchParameter:
							dataSourceSpecification.searchParameter,
						fieldOptions: field.fieldOptions,
						singleField:
							field.type.toLowerCase() ===
								FormFieldType.DatePicker.toLowerCase() ||
							field.type.toLowerCase() ===
								FormFieldType.FileUpload.toLowerCase() ||
							field.type.toLowerCase() ===
								FormFieldType.HiddenTextBox.toLowerCase() ||
							field.type.toLowerCase() ===
								FormFieldType.Section.toLowerCase() ||
							field.type.toLowerCase() ===
								FormFieldType.TextArea.toLowerCase() ||
							field.type.toLowerCase() ===
								FormFieldType.TextBox.toLowerCase() ||
							field.type.toLowerCase() ===
								FormFieldType.TextSearchBox.toLowerCase() ||
							field.type.toLowerCase() ===
								FormFieldType.PersonalNumber.toLowerCase() ||
							field.type.toLowerCase() ===
								FormFieldType.Numeric.toLowerCase() ||
							field.type.toLowerCase() ===
								FormFieldType.Table.toLowerCase(),
					});
				}
			}
		});
	});
	return linkedToMe;
}

export function whichFieldAreMyParent(fieldGuid: string, form: IForm): any {
	let parent: any;
	form.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			if (field.guid === fieldGuid) {
				parent = field;
			}
		});
	});
	return parent;
}

export async function GenerateValueFromObject(
	store: any,
	data: any,
	myChildren: any
): Promise<void> {
	myChildren.forEach((field: any) => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const newValueFromObject = getNewValueFromObject(data, field);
		store.commit(MutationType.UpdateFormField, {
			fieldId: field.id,
			newValue: newValueFromObject.newValue,
			fieldProperty: newValueFromObject.fieldProperty,
		});
	});
}

export async function GenerateValue(
	store: any,
	dataSourceAppliera: any,
	searchValue: string,
	myChildren: any,
	fieldGuid: string
): Promise<void> {
	myChildren.forEach(async (field: any) => {
		if (!field.dataSourceName.includes('SingleEntity')) {
			store.commit(MutationType.FieldLoadingDataSourceStart, fieldGuid);
			const data =
				await dataSourceAppliera.fetchDataSourcesUsedInFormSearch(
					field.dataSourceName,
					searchValue
				);
			if (data) {
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				const newValueFromObject = getNewValueFromObject(data, field);
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newValueFromObject.newValue,
					fieldProperty: newValueFromObject.fieldProperty,
				});
			}
			store.commit(MutationType.FieldLoadingDataSourceDone, fieldGuid);
		} else {
			if (field.singleField) {
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: '',
					fieldProperty: 'value',
				});
			} else {
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: '',
					fieldProperty: 'fieldOptions',
				});
			}
		}
	});
}

export function getLista(
	dataListan: any,
	itemProperty: string,
	selectedTitle: any
): any {
	let selectedDataLista: any;
	dataListan.forEach((element: any) => {
		const elementValue = Object.keys(element).find((key) => {
			if (key.toLowerCase() === itemProperty.toLowerCase()) {
				return key;
			}
		});
		if (elementValue && element[elementValue] === selectedTitle) {
			selectedDataLista = element;
		}
	});
	return selectedDataLista;
}

export async function getValue(
	field: any,
	selectedItemTitle: string,
	value: any,
	dataSourceAppliera: any,
	dataSourceSpecifications: any
): Promise<any> {
	let returnValue: any;
	let selectedValue: string = '';
	const dataSourceSpecification = dataSourceSpecifications.find(
		(f: any) =>
			f.dataSourceName === field.fieldOptions.dataSource.dataSourceName
	) as any;
	if (typeof value === 'string') {
		selectedValue = value;
	} else if (typeof value === 'object') {
		selectedValue = value[dataSourceSpecification.searchParameter];
	}
	store.commit(MutationType.FieldLoadingDataSourceStart, field.guid);
	const dataListan =
		await dataSourceAppliera.fetchDataSourcesUsedInFormSearch(
			field.fieldOptions.dataSource.dataSourceName,
			selectedValue
		);
	if (dataListan) {
		const selectedDataLista = dataListan
			? getLista(
					dataListan,
					field.fieldOptions.dataSource.options.itemProperty,
					selectedItemTitle
			  )
			: '';
		if (selectedDataLista) {
			returnValue = selectedDataLista;
		}
	}
	store.commit(MutationType.FieldLoadingDataSourceDone, field.guid);
	return returnValue;
}

export async function getMyValue(
	field: any,
	dataSourceAppliera: any,
	dataSourceSpecifications: any,
	form: any
): Promise<any> {
	const myParent = whichFieldAreMyParent(
		field.fieldOptions.dataSource.options
			.dependsOnDataSourceSearchParameters[0],
		form
	);
	let returnValue: any;
	if (myParent) {
		if (
			myParent.type.toLowerCase() ===
				FormFieldType.DatePicker.toLowerCase() ||
			myParent.type.toLowerCase() ===
				FormFieldType.FileUpload.toLowerCase() ||
			myParent.type.toLowerCase() ===
				FormFieldType.HiddenTextBox.toLowerCase() ||
			myParent.type.toLowerCase() ===
				FormFieldType.Section.toLowerCase() ||
			myParent.type.toLowerCase() ===
				FormFieldType.TextArea.toLowerCase() ||
			myParent.type.toLowerCase() ===
				FormFieldType.TextBox.toLowerCase() ||
			myParent.type.toLowerCase() ===
				FormFieldType.TextSearchBox.toLowerCase() ||
			myParent.type.toLowerCase() ===
				FormFieldType.PersonalNumber.toLowerCase() ||
			myParent.type.toLowerCase() ===
				FormFieldType.Numeric.toLowerCase() ||
			myParent.type.toLowerCase() === FormFieldType.Table.toLowerCase()
		) {
			let selectedItem: any;
			if (field.fieldOptions.items.length > 0) {
				selectedItem = field.fieldOptions.items.filter(
					(f: any) => f.isChecked
				)[0];
			}
			returnValue = await getValue(
				field,
				selectedItem.title,
				myParent.value,
				dataSourceAppliera,
				dataSourceSpecifications
			);
		} else {
			const myParentSelectedItem = myParent.fieldOptions.items.filter(
				(f: any) => f.isChecked
			);
			const myParentFieldOption =
				myParent.fieldOptions as ITableFieldOptions;

			if (dataSourceAppliera.dataFetchedDataSources) {
				if (!myParentFieldOption.dataSource?.options?.itemProperty) {
					return;
				}
				let selectedItem: any;
				const parentList =
					dataSourceAppliera.dataFetchedDataSources.get(
						myParentFieldOption.dataSource.dataSourceName
					);
				const myParentSelectedDataLista = parentList
					? getLista(
							parentList,
							myParentFieldOption.dataSource.options.itemProperty,
							myParentSelectedItem[0].title
					  )
					: '';
				if (field.fieldOptions.items.length > 0) {
					selectedItem = field.fieldOptions.items.filter(
						(f: any) => f.isChecked
					)[0];
				}
				returnValue = await getValue(
					field,
					selectedItem.title,
					myParentSelectedDataLista,
					dataSourceAppliera,
					dataSourceSpecifications
				);
			} else {
				const myParentDataListan =
					await dataSourceAppliera.fetchDataSourcesUsedInFormSearch(
						field.fieldOptions.dataSource.dataSourceName,
						myParentSelectedItem[0].title
					);
				if (
					myParentDataListan &&
					myParentFieldOption.dataSource?.options.itemProperty
				) {
					const myParentSelectedDataLista = myParentDataListan
						? getLista(
								myParentDataListan,
								myParentFieldOption.dataSource.options
									.itemProperty,
								myParentSelectedItem[0].title
						  )
						: '';
					if (myParentSelectedDataLista) {
						let selectedItem: any;
						if (field.fieldOptions.items.length > 0) {
							selectedItem = field.fieldOptions.items.filter(
								(f: any) => f.isChecked
							)[0];
						}
						returnValue = await getValue(
							field,
							selectedItem.title,
							myParentSelectedDataLista,
							dataSourceAppliera,
							dataSourceSpecifications
						);
					}
				}
			}
		}
	}
	return returnValue;
}

export async function selectedItemChanged(
	store: any,
	selectedItem: any,
	field: any,
	dataSourceAppliera: any,
	dataSourceSpecifications: any,
	form: any
): Promise<void> {
	if (!selectedItem) {
		const myChildren = whichFieldsAreMyChildren(
			field.guid,
			form,
			dataSourceSpecifications
		);
		if (myChildren && myChildren.length > 0) {
			await GenerateValue(
				store,
				dataSourceAppliera,
				'',
				myChildren,
				field.guid
			);
		}
	} else {
		if (
			checkIfFieldHasChild(field.guid, form) &&
			selectedItem &&
			selectedItem.id !== ''
		) {
			const myChildren = whichFieldsAreMyChildren(
				field.guid,
				form,
				dataSourceSpecifications
			);
			if (
				field.fieldOptions &&
				field.fieldOptions.dataSource &&
				field.fieldOptions.dataSource.options &&
				field.fieldOptions.dataSource.options
					.dependsOnDataSourceSearchParameter
			) {
				myChildren.forEach(async (myChild: any) => {
					if (myChild.searchParameter === '') {
						const data =
							dataSourceAppliera.dataFetchedDataSources.get(
								field.fieldOptions.dataSource.dataSourceName
							);
						let newValue;
						if (data) {
							data.forEach((item: any) => {
								Object.keys(item).forEach((key) => {
									if (
										key.toLowerCase() ===
											field.fieldOptions.dataSource.options.itemProperty.toLowerCase() &&
										item[key].toLowerCase() ===
											selectedItem.title?.toLowerCase()
									) {
										const props = Object.keys(item).find(
											(k) =>
												k.toLowerCase() ===
												myChild.fieldOptions.dataSource.options.itemProperty.toLowerCase()
										);
										if (props) {
											newValue = item[props];
										}
									}
								});
							});
							store.commit(MutationType.UpdateFormField, {
								fieldId: myChild.id,
								newValue,
								fieldProperty: 'value',
							});
						}
					} else {
						const selectedParentValue = await getMyValue(
							field,
							dataSourceAppliera,
							dataSourceSpecifications,
							form
						);
						let selectedValue = '';
						if (typeof selectedParentValue === 'string') {
							selectedValue = selectedParentValue;
						} else if (typeof selectedParentValue === 'object') {
							selectedValue =
								selectedParentValue[myChild.searchParameter];
						}
						const dataListan =
							await dataSourceAppliera.fetchDataSourcesUsedInFormSearch(
								myChild.fieldOptions.dataSource.dataSourceName,
								selectedValue
							);
						if (dataListan) {
							await GenerateValueFromObject(
								store,
								dataListan,
								myChildren
							);
						}
					}
				});
			} else {
				myChildren.forEach(async (myChild: any) => {
					if (myChild.searchParameter === '') {
						const data =
							dataSourceAppliera.dataFetchedDataSources.get(
								field.fieldOptions.dataSource.dataSourceName
							);
						let newValue;
						if (data) {
							data.forEach((item: any) => {
								Object.keys(item).forEach((key) => {
									if (
										key.toLowerCase() ===
											field.fieldOptions.dataSource.options.itemProperty.toLowerCase() &&
										item[key].toLowerCase() ===
											selectedItem.title!.toLowerCase()
									) {
										const props = Object.keys(item).find(
											(k) =>
												k.toLowerCase() ===
												myChild.fieldOptions.dataSource.options.itemProperty.toLowerCase()
										);
										if (props) {
											newValue = item[props];
										}
									}
								});
							});
							store.commit(MutationType.UpdateFormField, {
								fieldId: myChild.id,
								newValue,
								fieldProperty: 'value',
							});
						}
					} else {
						const fieldOption =
							field.fieldOptions as ITableFieldOptions;
						if (!fieldOption.dataSource) {
							return;
						}
						const dataSourceDataTemp =
							await dataSourceAppliera.fetchDataSourcesUsedInFormUtanSearch(
								fieldOption.dataSource.dataSourceName
							);
						if (dataSourceDataTemp) {
							const dataListan = dataSourceDataTemp.get(
								fieldOption.dataSource.dataSourceName
							);
							if (
								!fieldOption.dataSource?.options?.itemProperty
							) {
								return;
							}
							const selectedDataLista = dataListan
								? getLista(
										dataListan,
										fieldOption.dataSource.options
											.itemProperty,
										selectedItem.title
								  )
								: '';
							if (selectedDataLista) {
								await GenerateValue(
									store,
									dataSourceAppliera,
									selectedDataLista[myChild.searchParameter],
									myChildren,
									field.guid
								);
							}
						}
					}
				});
			}
		}
	}
}

export function getItemPropertyValue(data: any, itemProperty: string): any {
	let returnValue = '';
	if (itemProperty.includes('.')) {
		const itemPropertyArray = itemProperty.split('.');
		const itemPropertyFirst = itemPropertyArray[0];
		let itemPropertyRest = '';
		itemPropertyArray.forEach((v) => {
			if (v !== itemPropertyFirst) {
				itemPropertyRest =
					itemPropertyRest === '' ? v : itemPropertyRest + '.' + v;
			}
		});
		Object.keys(data).forEach((key) => {
			if (key.toLowerCase() === itemPropertyFirst.toLowerCase()) {
				if (typeof data[key] === 'object') {
					returnValue = getItemPropertyValue(
						data[key],
						itemPropertyRest
					);
				} else {
					returnValue = data[key];
				}
			}
		});
	} else {
		Object.keys(data).forEach((key) => {
			if (key.toLowerCase() === itemProperty.toLowerCase()) {
				returnValue = data[key];
			}
		});
	}
	return returnValue;
}

export function getNewValueFromObject(data: any, field: any): any {
	if (field.singleField) {
		let newValue = '';
		if (data) {
			newValue = getItemPropertyValue(data, field.itemProperty);
		}
		return { newValue, fieldProperty: 'value' };
	} else {
		const items: any = [];
		if (data && typeof data !== 'string') {
			data.forEach((element: any) => {
				Object.keys(element).forEach((key) => {
					if (
						key.toLowerCase() === field.itemProperty.toLowerCase()
					) {
						items.push({
							title: element[key],
							value: element[key],
							id: element[key],
							isChecked: false,
						} as IItem);
					}
				});
			});
		}
		const newValue = { ...field.fieldOptions, items };
		return { newValue, fieldProperty: 'fieldOptions' };
	}
}

export function isValueField(object: any): object is ISingleValueField {
	return 'value' in object;
}

export function isVisibleDisplayRuleGroup(
	field: IFormField,
	form: IForm,
	availableMetaDataLista: any
): boolean {
	let isVisible = true;
	if (field.displayRuleGroup) {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		isVisible = checkConditions(
			field.displayRuleGroup.conditions,
			field.displayRuleGroup.queryOption,
			form,
			availableMetaDataLista
		);
		if (
			field.displayRuleGroup.queryOption === QueryOption.And &&
			isVisible &&
			field.displayRuleGroup.groups.length > 0
		) {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			isVisible = checkGroups(
				field.displayRuleGroup.groups,
				field.displayRuleGroup.queryOption,
				form,
				availableMetaDataLista
			);
		}
		if (
			field.displayRuleGroup.queryOption === QueryOption.Or &&
			!isVisible &&
			field.displayRuleGroup.groups.length > 0
		) {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			isVisible = checkGroups(
				field.displayRuleGroup.groups,
				field.displayRuleGroup.queryOption,
				form,
				availableMetaDataLista
			);
		}
	}
	return isVisible;
}

export function checkConditions(
	conditions: ICondition[],
	queryOption: string,
	form: IForm,
	availableMetaDataLista: any
): boolean {
	const isVisibles: boolean[] = [];
	conditions.forEach((condition) => {
		form.attributes.steps.forEach((step) => {
			step.fields.forEach((field) => {
				if (field.guid === condition.conditionQuestion) {
					const fieldIsVisible =
						!field?.displayRuleGroup?.displayRuleGroupGuid ||
						isVisibleDisplayRuleGroup(
							field,
							form,
							availableMetaDataLista
						);
					if (
						field.fieldOptions &&
						field.fieldOptions.items &&
						field.fieldOptions.items.length > 0
					) {
						field.fieldOptions.items.forEach((item: any) => {
							if (condition.conditionResponse === item.id) {
								if (
									item.isChecked &&
									condition.conditionChoice ===
										ConditionChoice.Like &&
									fieldIsVisible
								) {
									isVisibles.push(true);
								} else if (
									!item.isChecked &&
									condition.conditionChoice ===
										ConditionChoice.Not
								) {
									isVisibles.push(true);
								} else if (
									!fieldIsVisible &&
									condition.conditionChoice ===
										ConditionChoice.Not
								) {
									// If the field is not visible and condition is "not equals", it should return true?
									isVisibles.push(true);
								}
							}
						});
					} else if (isValueField(field)) {
						if (
							condition.conditionChoice ===
								ConditionChoice.GreaterThan &&
							fieldIsVisible
						) {
							const numericalValue = parseFloat(field.value);
							if (!isNaN(numericalValue)) {
								if (
									numericalValue >
									parseFloat(condition.conditionResponse)
								) {
									isVisibles.push(true);
								}
							}
						} else if (
							condition.conditionChoice ===
								ConditionChoice.GreaterThanOrEqual &&
							fieldIsVisible
						) {
							const numericalValue = parseFloat(field.value);
							if (!isNaN(numericalValue)) {
								if (
									numericalValue >=
									parseFloat(condition.conditionResponse)
								) {
									isVisibles.push(true);
								}
							}
						} else if (
							condition.conditionChoice ===
								ConditionChoice.LessThan &&
							fieldIsVisible
						) {
							const numericalValue = parseFloat(field.value);
							if (!isNaN(numericalValue)) {
								if (
									numericalValue <
									parseFloat(condition.conditionResponse)
								) {
									isVisibles.push(true);
								}
							}
						} else if (
							condition.conditionChoice ===
								ConditionChoice.LessThanOrEqual &&
							fieldIsVisible
						) {
							const numericalValue = parseFloat(field.value);
							if (!isNaN(numericalValue)) {
								if (
									numericalValue <=
									parseFloat(condition.conditionResponse)
								) {
									isVisibles.push(true);
								}
							}
						} else if (
							condition.conditionChoice ===
								ConditionChoice.StartsWith &&
							fieldIsVisible
						) {
							if (
								field.value
									.toLowerCase()
									.startsWith(
										condition.conditionResponse.toLowerCase()
									)
							) {
								isVisibles.push(true);
							}
						} else if (
							condition.conditionChoice ===
								ConditionChoice.EndsWith &&
							fieldIsVisible
						) {
							if (
								field.value
									.toLowerCase()
									.endsWith(
										condition.conditionResponse.toLowerCase()
									)
							) {
								isVisibles.push(true);
							}
						} else if (
							condition.conditionChoice ===
								ConditionChoice.Contains &&
							fieldIsVisible
						) {
							if (
								field.value
									.toLowerCase()
									.includes(
										condition.conditionResponse.toLowerCase()
									)
							) {
								isVisibles.push(true);
							}
						} else if (
							condition.conditionChoice === ConditionChoice.Empty
						) {
							//Is the field considered empty when hidden by display rule? what if it has a default value?
							if (field.value === '') {
								isVisibles.push(true);
							}
						} else if (
							condition.conditionChoice ===
							ConditionChoice.NotEmpty
						) {
							// Or is it not empty? One of them has to be true, right?
							if (field.value !== '') {
								isVisibles.push(true);
							}
						} else if (
							condition.conditionChoice ===
								ConditionChoice.Between &&
							fieldIsVisible
						) {
							if (
								field.value > condition.conditionResponse &&
								field.value < condition.conditionResponse2
							) {
								isVisibles.push(true);
							}
						}
					}
				}
			});
		});
	});
	conditions.forEach((condition) => {
		availableMetaDataLista.forEach((element: any) => {
			if (element.guid === condition.conditionQuestion) {
				if (element.type === 'numeric') {
					if (
						element.metaDataList &&
						element.metaDataList.length > 0 &&
						element.metaDataList[0].name === 'ageToday' &&
						store.state.user.userContactInfo?.ageToday &&
						store.state.user.userContactInfo?.ageToday > 0
					) {
						if (
							// eslint-disable-next-line @typescript-eslint/no-use-before-define
							isVisibleAgeOk(
								store.state.user.userContactInfo?.ageToday,
								condition.conditionResponse,
								condition.conditionChoice
							)
						) {
							isVisibles.push(true);
						}
					}
					if (
						element.metaDataList &&
						element.metaDataList.length > 0 &&
						element.metaDataList[0].name === 'ageThisYear' &&
						store.state.user.userContactInfo?.ageThisYear &&
						store.state.user.userContactInfo?.ageThisYear > 0
					) {
						if (
							// eslint-disable-next-line @typescript-eslint/no-use-before-define
							isVisibleAgeOk(
								store.state.user.userContactInfo?.ageThisYear,
								condition.conditionResponse,
								condition.conditionChoice
							)
						) {
							isVisibles.push(true);
						}
					}
					if (
						element.metaDataList &&
						element.metaDataList.length > 0 &&
						element.metaDataList[0].name === 'newAgeInXDays' &&
						store.state.user.userContactInfo?.newAgeInXDays &&
						store.state.user.userContactInfo?.newAgeInXDays
					) {
						if (
							// eslint-disable-next-line @typescript-eslint/no-use-before-define
							isVisibleAgeOk(
								store.state.user.userContactInfo?.newAgeInXDays,
								condition.conditionResponse,
								condition.conditionChoice
							)
						) {
							isVisibles.push(true);
						}
					}
				} else if (
					element.metaDataList &&
					element.metaDataList.length > 0
				) {
					element.metaDataList.forEach((item: any) => {
						const authClientName =
							store.state.user.authClientName === ''
								? 'Anonym'
								: store.state.user.authClientName;
						if (condition.conditionResponse === item.name) {
							if (
								condition.conditionResponse ===
									authClientName &&
								condition.conditionChoice ===
									ConditionChoice.Like
							) {
								isVisibles.push(true);
							} else if (
								condition.conditionResponse !==
									authClientName &&
								condition.conditionChoice ===
									ConditionChoice.Not
							) {
								isVisibles.push(true);
							}
						}
					});
				}
			}
		});
	});
	let isVisible = false;
	if (
		queryOption === QueryOption.And &&
		isVisibles.length === conditions.length
	) {
		isVisible = true;
	} else if (queryOption === QueryOption.Or && isVisibles.length > 0) {
		isVisible = true;
	}
	return isVisible;
}

function isVisibleAgeOk(
	userAge: number,
	conditionResponse: string,
	conditionChoice: ConditionChoice
): boolean {
	if (
		(conditionChoice === ConditionChoice.GreaterThanOrEqual &&
			userAge >= parseInt(conditionResponse)) ||
		(conditionChoice === ConditionChoice.GreaterThan &&
			userAge > parseInt(conditionResponse)) ||
		(conditionChoice === ConditionChoice.LessThanOrEqual &&
			userAge <= parseInt(conditionResponse)) ||
		(conditionChoice === ConditionChoice.LessThan &&
			userAge < parseInt(conditionResponse))
	) {
		return true;
	}
	return false;
}

export function checkGroups(
	groups: any,
	parentQueryOption: string,
	form: IForm,
	availableMetaDataLista: any
): boolean {
	let isVisible = false;
	const list: any = [];
	groups.forEach((group: any) => {
		let conditionIsVisible = checkConditions(
			group.conditions,
			group.queryOption,
			form,
			availableMetaDataLista
		);
		if (
			conditionIsVisible &&
			group.groups.length > 0 &&
			group.queryOption === QueryOption.And
		) {
			conditionIsVisible = checkGroups(
				group.groups,
				group.queryOption,
				form,
				availableMetaDataLista
			);
		} else if (
			!conditionIsVisible &&
			group.groups.length > 0 &&
			group.queryOption === QueryOption.Or
		) {
			conditionIsVisible = checkGroups(
				group.groups,
				group.queryOption,
				form,
				availableMetaDataLista
			);
		}
		list.push(conditionIsVisible);
	});
	if (parentQueryOption === QueryOption.And) {
		isVisible = list.every((element: any) => element);
	} else if (parentQueryOption === QueryOption.Or) {
		isVisible = list.includes(true);
	}
	return isVisible;
}

export function addGroupToGroup(
	groups: IDisplayRuleGroup[],
	dpRuleGroupGuid: string,
	newGroup: IDisplayRuleGroup
): void {
	let find = false;
	groups.forEach((group) => {
		if (group.displayRuleGroupGuid === dpRuleGroupGuid) {
			const group2 = group.groups.find(
				(f) => f.displayRuleGroupGuid === newGroup.displayRuleGroupGuid
			);
			if (group2) {
				group2.queryOption = newGroup.queryOption;
				group2.conditions = newGroup.conditions;
				group2.groups = newGroup.groups;
			} else {
				group.groups.push(newGroup);
			}
			find = true;
		}
	});
	if (!find) {
		groups.forEach((group) => {
			addGroupToGroup(group.groups, dpRuleGroupGuid, newGroup);
		});
	}
}

export function deleteGroupFromGroup(
	groups: IDisplayRuleGroup[],
	displayRuleGroupGuid: string
): void {
	let find = false;
	groups.forEach((group) => {
		const index = group.groups.findIndex(
			(f) => f.displayRuleGroupGuid === displayRuleGroupGuid
		);
		if (index > -1) {
			group.groups.splice(index, 1);
			find = true;
		}
	});
	if (!find) {
		groups.forEach((group) => {
			deleteGroupFromGroup(group.groups, displayRuleGroupGuid);
		});
	}
}

export function addConditionToGroup(
	groups: IDisplayRuleGroup[],
	dpRuleGroupGuid: string,
	newCondition: ICondition
): void {
	let find = false;
	groups.forEach((group) => {
		if (group.displayRuleGroupGuid === dpRuleGroupGuid) {
			const condition = group.conditions.find(
				(f) => f.conditionGuid === newCondition.conditionGuid
			);
			if (condition) {
				condition.conditionChoice = newCondition.conditionChoice;
				condition.conditionQuestion = newCondition.conditionQuestion;
				condition.conditionQuestionType =
					newCondition.conditionQuestionType;
				condition.conditionResponse = newCondition.conditionResponse;
				condition.conditionResponse2 = newCondition.conditionResponse2;
			} else {
				group.conditions.push(newCondition);
			}
			find = true;
		}
	});
	if (!find) {
		groups.forEach((group) => {
			addConditionToGroup(group.groups, dpRuleGroupGuid, newCondition);
		});
	}
}

export function deleteConditionFromGroup(
	groups: IDisplayRuleGroup[],
	conditionGuid: string,
	removeIfEmpty: boolean = false
): void {
	let find = false;
	groups.forEach((group, groupIndex, groupArray) => {
		const index = group.conditions.findIndex(
			(f) => f.conditionGuid === conditionGuid
		);
		if (index > -1) {
			group.conditions.splice(index, 1);

			if (
				removeIfEmpty &&
				group.conditions.length === 0 &&
				group.groups.length === 0
			) {
				groupArray.splice(groupIndex, 1);
			}

			find = true;
		}
	});
	if (!find) {
		groups.forEach((group) => {
			deleteConditionFromGroup(
				group.groups,
				conditionGuid,
				removeIfEmpty
			);
		});
	}
}

/**
 * If the field is used in any display rules
 */
export function isFieldUsedInDisplayRules(fieldGuid: string): boolean {
	if (!store.state.form) {
		return false;
	}

	const checkGroup = (group: IDisplayRuleGroup): boolean => {
		if (group.conditions?.length) {
			for (const condition of group.conditions) {
				if (condition.conditionQuestion === fieldGuid) {
					return true;
				}
			}
		}
		if (group.groups?.length) {
			for (const innerGroup of group.groups) {
				// Check display rule groups recursively
				if (checkGroup(innerGroup)) {
					return true;
				}
			}
		}
		return false;
	};

	for (const step of store.state.form.attributes.steps) {
		for (const field of step.fields) {
			if (field.displayRuleGroup && checkGroup(field.displayRuleGroup)) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Remove any display rule conditions that the field is used in
 */
export function deleteFieldDisplayRules(fieldGuid: string): void {
	if (!store.state.form) {
		return;
	}

	const deleteFromGroup = (
		group: IDisplayRuleGroup,
		innerFieldId: string
	): void => {
		group.groups?.forEach((innerGroup) =>
			deleteFromGroup(innerGroup, innerFieldId)
		);
		group.conditions?.forEach((condition) => {
			if (condition.conditionQuestion === fieldGuid) {
				store.commit(MutationType.RemoveConditionFromDisplayRuleGroup, {
					fieldId: innerFieldId,
					displayRuleGroupGuid: group.displayRuleGroupGuid,
					conditionGuid: condition.conditionGuid,
					fieldProperty: 'displayRuleGroup',
					removeIfEmpty: true,
				});
			}
		});
	};

	for (const step of store.state.form.attributes.steps) {
		for (const field of step.fields) {
			if (field.displayRuleGroup) {
				deleteFromGroup(
					Helper.deepCopy(field.displayRuleGroup),
					field.id
				);
			}
		}
	}
}

/**
 * Iterate over all display rules in form and add all mothers to a map
 * */
export function updateAdminMotherFields(): void {
	const motherFields: { [key: string]: boolean } = {};

	// Check display groups recursively
	const checkGroup = (group: IDisplayRuleGroup): void => {
		group.conditions?.forEach((condition) => {
			motherFields[condition.conditionQuestion] = true;
		});
		group.groups?.forEach((innerGroup) => checkGroup(innerGroup));
	};

	store.state.form?.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			if (field.displayRuleGroup?.displayRuleGroupGuid) {
				checkGroup(field.displayRuleGroup);
			}
		});
	});

	store.commit(MutationType.UpdateAdminState, {
		prop: 'motherFields',
		value: motherFields,
	});
}

export const DateScheduleUtils = {
	isScheduled(form: IForm): boolean {
		if (
			form.attributes.status === FormStatus.Published &&
			form.attributes.dateSchedule &&
			form.attributes.dateSchedule.active
		) {
			return true;
		}
		return false;
	},
	isScheduledToBeVisibleNow(form: IForm) {
		if (
			form.attributes.dateSchedule &&
			form.attributes.dateSchedule.active
		) {
			const nowTimeStamp = new Date().getTime();
			const fromTimeStamp = new Date(
				form.attributes.dateSchedule.from
			).getTime();
			const toTimeStamp = new Date(
				form.attributes.dateSchedule.to
			).getTime();
			return nowTimeStamp >= fromTimeStamp && nowTimeStamp <= toTimeStamp;
		}
		return false;
	},
	hasPassedScheduledDate(form: IForm) {
		if (
			form.attributes.dateSchedule &&
			form.attributes.dateSchedule.active
		) {
			const endDate = new Date(form.attributes.dateSchedule.to);
			return endDate.getTime() < new Date().getTime();
		}
		return false;
	},
	getClockTime(date: Date): string {
		return (
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			addZeroIfNeeded(date.getHours()) +
			':' +
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			addZeroIfNeeded(date.getMinutes())
		);
	},
};

const addZeroIfNeeded = (n: number): number | string => (n > 9 ? n : '0' + n);

/**
 * If the field is used in any integrations
 */
export function isFieldUsedInIntegration(fieldGuid: string): boolean {
	if (
		!store.state.form ||
		!store.state.form.attributes.integrations?.length
	) {
		return false;
	}

	for (const integration of store.state.form.attributes.integrations) {
		switch (integration.type) {
			// If used in any sharepoint integration
			case IntegrationType.AdvancedSharepoint: {
				const fieldMappings = integration.options.find(
					(opt) =>
						opt.key === SharepointIntegrationOptionKey.FieldMapping
				);
				if (
					(fieldMappings?.data as ISharepointFieldMapping[])?.find(
						(mappingData) => mappingData.fieldGuid === fieldGuid
					)
				) {
					return true;
				}
				break;
			}
			// If used in any email integration
			case IntegrationType.Email: {
				const formFieldReceivers = integration.options.find(
					(opt) =>
						opt.key === EmailIntegrationOptionKey.FormFieldReceivers
				);
				if (
					(formFieldReceivers?.data as string[])?.find(
						(fieldReceiverGuid) => fieldReceiverGuid === fieldGuid
					)
				) {
					return true;
				}
				break;
			}
		}
	}
	return false;
}
