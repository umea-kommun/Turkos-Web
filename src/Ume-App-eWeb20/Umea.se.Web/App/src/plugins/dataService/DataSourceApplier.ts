import Axios from 'axios';
import { FormFieldInterface } from '@/models/Enums';
import { FormFieldLookup } from '@/store/utils';
import {
	IDataSourceConnection,
	dataSourceDataMock,
	dataSourceSpecMock,
	IDataSourceSpecification,
	IUserConnector,
	IDataSourceConnector,
	ErrorCode,
} from './models';
import {
	IForm,
	IItemListField,
	IItem,
	ISingleValueField,
	IFormField,
	ITableField,
	IContactInfo,
} from '@/models/IForm';

export default class DataSourceApplier {
	private dataSourceConnectionCallbacks: IDataSourceConnector;
	private userConnectionCallbacks: IUserConnector | null = null;
	private useMockData: boolean;
	private dataServiceSpecUrl: URL | null;
	private dataSourceSpecifications: IDataSourceSpecification[] | null = null;
	private dataFetchedDataSources: Map<string, object> | null = null;

	constructor({
		dataServiceSpecUrl,
		useMockData,
		userConnectionCallbacks,
		dataSourceConnectionCallbacks,
		dataFetchedDataSources,
	}: any) {
		this.useMockData = useMockData;
		this.dataServiceSpecUrl = useMockData
			? null
			: new URL(dataServiceSpecUrl);
		this.userConnectionCallbacks = userConnectionCallbacks;
		this.dataSourceConnectionCallbacks = dataSourceConnectionCallbacks;
		this.dataFetchedDataSources = dataFetchedDataSources;
	}

	public async fetchDataSourceSpecifications(): Promise<
		IDataSourceSpecification[]
	> {
		if (!this.dataSourceSpecifications) {
			if (this.useMockData) {
				this.dataSourceSpecifications = dataSourceSpecMock;
			} else {
				const response = await Axios.get(
					this.dataServiceSpecUrl!.toString()
				);
				this.dataSourceSpecifications = response.data;
			}
		}
		return this.dataSourceSpecifications as IDataSourceSpecification[];
	}

	public async fetchDataSourcesUsedInForm(
		form: IForm,
		searchValue: string,
		searchParameter: string
	): Promise<any> {
		const apiUrls = await this.getUrlsOfDatasourcesUsedInForm(form);
		const fetchedDataSources: Map<string, object> = new Map();
		const promises: Array<Promise<any>> = [];
		const accessToken = this.userConnectionCallbacks!.getUser().token;
		[...apiUrls.keys()].forEach((dataSourceName) => {
			promises.push(
				// eslint-disable-next-line no-async-promise-executor
				new Promise(async (resolve) => {
					try {
						if (this.useMockData) {
							const dataSourceSpecification =
								this.dataSourceSpecifications!.find(
									(f) => f.dataSourceName === dataSourceName
								) as IDataSourceSpecification;
							if (dataSourceSpecification.searchEntity) {
								if (searchValue) {
									if (
										dataSourceSpecification.searchParameter &&
										searchParameter &&
										dataSourceSpecification.searchParameter.toLowerCase() ===
											searchParameter.toLowerCase()
									) {
										const data =
											await this.fillFieldWithMockedSearchData(
												dataSourceName,
												dataSourceSpecification.searchParameter,
												searchValue
											);
										fetchedDataSources.set(
											dataSourceName,
											data
										);
									}
								}
							} else {
								const data =
									await this.fillFieldWithMockedData(
										dataSourceName
									);
								fetchedDataSources.set(dataSourceName, data);
							}
						} else {
							const apiUrl = apiUrls.get(dataSourceName);
							const dataSourceSpecification =
								this.dataSourceSpecifications!.find(
									(f) => f.dataSourceName === dataSourceName
								) as IDataSourceSpecification;
							if (dataSourceSpecification.searchEntity) {
								if (searchValue) {
									if (
										dataSourceSpecification.searchParameter &&
										searchParameter &&
										dataSourceSpecification.searchParameter.toLowerCase() ===
											searchParameter.toLowerCase()
									) {
										const data =
											await this.fetchDataWithSearch(
												apiUrl!.toString(),
												accessToken,
												dataSourceSpecification.searchParameter,
												searchValue
											);
										fetchedDataSources.set(
											dataSourceName,
											data
										);
									}
								}
							} else {
								const data = await this.fetchData(
									apiUrl!.toString(),
									accessToken
								);
								fetchedDataSources.set(dataSourceName, data);
							}
						}
					} catch (err: any) {
						console.warn(
							'Unable to fetch datasource, message: ' +
								err +
								' stack: ' +
								err.stack
						);
					}
					resolve(true);
				})
			);
		});
		await Promise.all(promises);
		this.dataFetchedDataSources = fetchedDataSources;
		return fetchedDataSources;
	}

	public async fetchDataSourcesUsedInFormSearch(
		dataSourceName: string,
		searchValue: string
	): Promise<object> {
		let data: any;
		const apiUrls =
			await this.getUrlOfDatasourcesUsedInFormSearch(dataSourceName);
		const apiUrl = apiUrls.get(dataSourceName);
		const accessToken = this.userConnectionCallbacks!.getUser().token;
		try {
			if (this.useMockData) {
				const dataSourceSpecification =
					this.dataSourceSpecifications!.find(
						(f) => f.dataSourceName === dataSourceName
					) as IDataSourceSpecification;
				data = await this.fillFieldWithMockedSearchData(
					dataSourceName,
					dataSourceSpecification.searchParameter,
					searchValue
				);
			} else {
				const dataSourceSpecification =
					this.dataSourceSpecifications!.find(
						(f) => f.dataSourceName === dataSourceName
					) as IDataSourceSpecification;
				data = await this.fetchDataWithSearch(
					apiUrl!.toString(),
					accessToken,
					dataSourceSpecification.searchParameter,
					searchValue
				);
			}
		} catch (err: any) {
			console.warn(
				'Unable to fetch datasource, message: ' +
					err +
					' stack: ' +
					err?.stack
			);
		}
		return data;
	}
	public async fetchDataSourcesUsedInFormUtanSearch(
		dataSourceName: string
	): Promise<Map<string, object>> {
		const fetchedDataSources: Map<string, object> = new Map();
		const apiUrls =
			await this.getUrlOfDatasourcesUsedInFormSearch(dataSourceName);
		const apiUrl = apiUrls.get(dataSourceName);
		const accessToken = this.userConnectionCallbacks!.getUser().token;
		try {
			if (this.useMockData) {
				const data = await this.fillFieldWithMockedData(dataSourceName);
				fetchedDataSources.set(dataSourceName, data);
			} else {
				const data = await this.fetchData(
					apiUrl!.toString(),
					accessToken
				);
				fetchedDataSources.set(dataSourceName, data);
			}
		} catch (err: any) {
			console.warn(
				'Unable to fetch datasource, message: ' +
					err +
					' stack: ' +
					err?.stack
			);
		}
		return fetchedDataSources;
	}

	public async getUrlOfDatasourcesUsedInFormSearch(
		dataSourceName: string
	): Promise<Map<string, URL>> {
		const urls: Map<string, URL> = new Map();
		const apiUrl = await this.resolveApiUrl(dataSourceName);
		if (!apiUrl) {
			console.warn(
				'Could not find any datasource with name ' + dataSourceName
			);
		} else {
			urls.set(dataSourceName, new URL(apiUrl));
		}
		return urls;
	}

	public applyDataSources(
		dataSourcesData: Map<string, object>,
		form: IForm
	): void {
		form.attributes.steps.forEach((step) => {
			step.fields.forEach(async (field) => {
				const dataSourceConnection =
					this.dataSourceConnectionCallbacks?.getConnection(field);
				if (dataSourceConnection) {
					if (
						field.type === 'FieldTable' ||
						field.fieldOptions!.tableGuid
					) {
						if (field.type === 'FieldTable') {
							const data = dataSourcesData.get(
								dataSourceConnection.dataSourceName
							);
							const tableFields = step.fields.filter(
								(f) => f.fieldOptions!.tableGuid === field.guid
							);
							if (data) {
								// No data found, show emty row
								if (Object.keys(data).length > 0) {
									this.applyDataSourceToTableFieldsOrItemFiller(
										data,
										field as ITableField,
										tableFields
									);
								} else {
									this.createRowNoData(
										field as ITableField,
										tableFields
									);
								}
							}
						} else if (
							field.type !== 'FieldTable' &&
							field.fieldOptions!.tableGuid
						) {
							let tableField: any;
							form.attributes.steps.forEach((s) => {
								if (
									s.fields.find(
										(f) =>
											f.guid ===
											field.fieldOptions!.tableGuid
									)
								) {
									tableField = s.fields.find(
										(f) =>
											f.guid ===
											field.fieldOptions!.tableGuid
									);
								}
							});
							const tableFieldDataSourceName = tableField
								.fieldOptions.dataSource
								? tableField.fieldOptions.dataSource
										.dataSourceName
								: '';
							if (tableFieldDataSourceName === '') {
								const fieldInterface =
									FormFieldLookup.getInstanceOf(field);
								const data = dataSourcesData.get(
									dataSourceConnection.dataSourceName
								);
								switch (fieldInterface) {
									case FormFieldInterface.ItemListField:
										this.applyDataSourceToItemListField(
											dataSourceConnection,
											data,
											field as IItemListField
										);
										break;
									case FormFieldInterface.SingleValueField:
										this.applyDataSourceToSingleValueField(
											dataSourceConnection,
											data,
											field as ISingleValueField
										);
										break;
									default:
										throw new Error(
											'Trying to apply data source to field of a type that is not supported ' +
												fieldInterface
										);
								}
							}
						}
					} else {
						const fieldInterface =
							FormFieldLookup.getInstanceOf(field);
						const data = dataSourcesData.get(
							dataSourceConnection.dataSourceName
						);
						switch (fieldInterface) {
							case FormFieldInterface.ItemListField:
								this.applyDataSourceToItemListField(
									dataSourceConnection,
									data,
									field as IItemListField
								);
								break;
							case FormFieldInterface.SingleValueField:
								this.applyDataSourceToSingleValueField(
									dataSourceConnection,
									data,
									field as ISingleValueField
								);
								break;
							default:
								throw new Error(
									'Trying to apply data source to field of a type that is not supported ' +
										fieldInterface
								);
						}
					}
				}
			});
		});
	}

	public async applyDataToTableRow(
		fieldTable: ITableField,
		form: IForm
	): Promise<void> {
		const dataSourceData = fieldTable.fieldOptions.dataSourceData;
		let tableFields: any;
		form.attributes.steps.forEach((step) => {
			if (!tableFields || (tableFields && tableFields.length === 0)) {
				tableFields = step.fields.filter(
					(f) => f.fieldOptions!.tableGuid === fieldTable.guid
				);
			}
		});
		if (dataSourceData) {
			if (fieldTable.fieldOptions.tableRows) {
				fieldTable.fieldOptions.tableRows.forEach((row) => {
					row.columns.forEach((column) => {
						if (column.isItem) {
							const data = dataSourceData;
							if (Array.isArray(data)) {
								data.forEach((element) => {
									if (
										element.id.toString() ===
										column.value.toString()
									) {
										row.columns.forEach((column2) => {
											if (!column2.isItem) {
												if (
													Array.isArray(tableFields)
												) {
													const tableField =
														tableFields.find(
															(f) =>
																f.guid ===
																column2.fieldGuid
														);
													const dataSourceConnection =
														this.dataSourceConnectionCallbacks!.getConnection(
															tableField
														);
													if (
														dataSourceConnection &&
														dataSourceConnection
															.options
															.itemProperty
													) {
														column2.value =
															this.getDataSourceValue(
																dataSourceConnection,
																element
															);
													}
												}
											} else if (
												column2.isItem &&
												column2 !== column
											) {
												const tableField =
													tableFields.find(
														(f: any) =>
															f.guid ===
															column2.fieldGuid
													);
												const dataSourceConnection =
													this.dataSourceConnectionCallbacks!.getConnection(
														tableField
													);
												if (
													dataSourceConnection &&
													dataSourceConnection.options
														.itemProperty
												) {
													column2.items =
														this.getDataSourceValue(
															dataSourceConnection,
															element
														);
												}
											}
										});
									} else if (
										column.value.toString() === '0'
									) {
										row.columns.forEach((column2) => {
											if (!column2.isItem) {
												if (
													Array.isArray(tableFields)
												) {
													column2.value = '';
												}
											}
										});
									}
								});
							}
						}
					});
				});
			}
		}
	}

	private async fetchData(apiUrl: string, accessToken: any): Promise<object> {
		const headers: any = {};
		if (this.userConnectionCallbacks!.getUser().token) {
			headers.Authorization = 'Bearer ' + accessToken;
		}
		try {
			const response = await Axios.get(apiUrl, { headers });
			return response.data;
		} catch (error) {
			throw new Error('fetchData : ' + error);
		}
	}

	private async fetchDataWithSearch(
		apiUrl: string,
		accessToken: any,
		searchParameter: string,
		searchValue: string
	): Promise<object> {
		const headers: any = {};
		if (this.userConnectionCallbacks!.getUser().token) {
			headers.Authorization = 'Bearer ' + accessToken;
		}
		apiUrl = apiUrl + '/?' + searchParameter + '=' + searchValue;
		let response: any = '';
		try {
			response = await Axios.get(apiUrl, { headers });
			return response.data;
		} catch (err: any) {
			if (err.response.status === 400 || err.response.status === 404) {
				return err.response.data.errorCode;
			} else {
				throw new Error(
					'Could not find any data with, fetchDataWithSearch'
				);
			}
		}
	}

	private async applyDataSourceToItemListField(
		dataSourceConnection: IDataSourceConnection,
		dataSourceData: any,
		field: IItemListField
	): Promise<void> {
		field.fieldOptions.items = field.fieldOptions.items || [];
		if (field.displayRuleMultipleLegitimation) {
			field.fieldOptions.contactInfo =
				field.fieldOptions.contactInfo || [];
		}
		if (
			typeof dataSourceData === 'string' &&
			(dataSourceData === ErrorCode.NoLegalOwnersFound ||
				dataSourceData === ErrorCode.NoPropertyAreasFound ||
				dataSourceData === ErrorCode.NoData)
		) {
			field.fieldOptions.items = [];
			field.fieldOptions.searchResponse = {
				response: dataSourceData,
				searchFoundResult: false,
			};
		} else if (dataSourceData) {
			field.fieldOptions.searchResponse = null;
			const values: string[] = dataSourceData.map((entity: any) =>
				this.getDataSourceValue(dataSourceConnection, entity)
			);
			values.sort((a, b) => (a > b ? 1 : -1));
			values.forEach((value) => {
				if (
					field.fieldOptions.items!.length >= 0 &&
					field.fieldOptions.items!.findIndex(
						(item) => item.id === value
					) === -1
				) {
					const itemValue = {
						title: value,
						id: value,
						isChecked: false,
					} as IItem;
					if (
						field.fieldOptions.dataSource?.options
							.applyDataToValueOnItemsInMultipleEntity &&
						field.fieldOptions.dataSource?.options
							.applyDataToValueOnItemsInMultipleEntity
					) {
						const testvalue = dataSourceData.find(
							(temp: any) => temp.name == value
						);
						itemValue.value = JSON.stringify(testvalue);
					}
					field.fieldOptions.items!.push(itemValue);
					if (field.displayRuleMultipleLegitimation) {
						const data = dataSourceData.filter(
							(f: any) => f.name === value
						)[0];
						if (
							data &&
							data.parentName &&
							data.parentSocialSecurityNumber
						) {
							field.fieldOptions.contactInfo!.push({
								id: data.name,
								childSocialSecurityNumber:
									data.socialSecurityNumber,
								childName: data.name,
								childFirstName: data.firstName,
								childLastName: data.lastName,
								childAddress: data.street,
								childPostalNumber: data.postalCode,
								childCity: data.city,
								socialSecurityNumber:
									data.parentSocialSecurityNumber,
								name: data.parentName,
								address: data.parentStreet,
								postalNumber: data.parentPostalCode,
								city: data.parentCity,
								phoneNumber: '',
								email: '',
								isSelected: false,
								contactPath: 0,
							} as IContactInfo);
						}
					}
				}
			});
		}
	}

	private async applyDataSourceToSingleValueField(
		dataSourceConnection: IDataSourceConnection,
		dataSourceData: any,
		field: ISingleValueField
	): Promise<void> {
		if (dataSourceData) {
			const newValue = this.getDataSourceValue(
				dataSourceConnection,
				dataSourceData
			);
			if (field.value === newValue) {
				field.value = newValue;
			} else {
				field.value = (field.value ?? '') + newValue;
			}
		}
	}

	private async applyDataSourceToTableFieldsOrItemFiller(
		dataSourceData: any,
		field: ITableField,
		tableFields: any
	): Promise<void> {
		let fillerGuid: any = '';
		tableFields.forEach((field: any) => {
			const dataSourceConnection =
				this.dataSourceConnectionCallbacks!.getConnection(field);
			if (
				dataSourceConnection &&
				dataSourceConnection.options.itemFiller
			) {
				fillerGuid = field.guid;
			}
		});
		if (fillerGuid) {
			this.applyDataSourceToItemFiller(
				dataSourceData,
				field,
				tableFields,
				fillerGuid
			);
		} else {
			this.applyDataSourceToTableFields(
				dataSourceData,
				field,
				tableFields
			);
		}
	}

	private async applyDataSourceToItemFiller(
		dataSourceData: any,
		field: ITableField,
		tableFields: any,
		fieldGuid: any
	): Promise<void> {
		const newFieldRows: any[] = [];
		const columns: any[] = [];
		const value: string = '';
		let numberOfItems: number = 0;
		const anyMultipleLegitimation = tableFields.filter(
			(f: any) => f.displayRuleMultipleLegitimation
		)
			? true
			: false;
		tableFields.forEach((tableField: any) => {
			if (tableField.guid === fieldGuid) {
				const dataSourceConnection =
					this.dataSourceConnectionCallbacks!.getConnection(
						tableField
					);
				const value = this.getDataSourceValue(
					dataSourceConnection,
					dataSourceData[0]
				);
				if (Array.isArray(value)) {
					const items: IItem[] = [];
					let contactInfos: any;
					value.forEach((item) => {
						const newItem = {} as IItem;
						Object.getOwnPropertyNames(item).forEach((element) => {
							const itemValue = item[element];
							if (typeof itemValue === 'string') {
								newItem.title = itemValue;
								newItem.value = itemValue;
							} else {
								newItem.id = itemValue;
							}
						});
						items.push(newItem);
					});
					let first;
					if (items.length > 0) {
						const item = items[0];
						first = item.id;
					}
					numberOfItems = items.length;
					if (anyMultipleLegitimation) {
						contactInfos = [];
						dataSourceData.forEach((data: any) => {
							contactInfos.push({
								id: data.id,
								childSocialSecurityNumber:
									data.socialSecurityNumber,
								childName: data.name,
								childFirstName: data.firstName,
								childLastName: data.lastName,
								childAddress: data.street,
								childPostalNumber: data.postalCode,
								childCity: data.city,
								socialSecurityNumber:
									data.parentSocialSecurityNumber,
								name: data.parentName,
								address: data.parentStreet,
								postalNumber: data.parentPostalCode,
								city: data.parentCity,
								phoneNumber: '',
								email: '',
								isSelected: false,
								contactPath: 0,
							} as IContactInfo);
						});
					}
					columns.push({
						fieldGuid: tableField.guid,
						items,
						value: first,
						contactInfos,
						isItem: true,
					});
				}
			} else {
				const fieldInterface =
					FormFieldLookup.getInstanceOf(tableField);
				if (fieldInterface === FormFieldInterface.ItemListField) {
					columns.push({
						fieldGuid: tableField.guid,
						items: [],
						value: '',
						isItem: true,
					});
				} else {
					columns.push({
						fieldGuid: tableField.guid,
						value: '',
						isItem: false,
					});
				}
			}
		});
		newFieldRows.push({
			guid: this.generateUuid(),
			columns,
		});
		if (newFieldRows.length > 0) {
			field.fieldOptions.tableRows = newFieldRows;
			if (field.fieldOptions.autofillNumberOfRows) {
				field.fieldOptions.maxRows = numberOfItems - 1;
			}
			field.fieldOptions.dataSourceData = dataSourceData;
		}
		this.dataSourceConnectionCallbacks.setData(
			field,
			field.fieldOptions.tableRows
		);
		this.dataSourceConnectionCallbacks.setTableData(
			field,
			field.fieldOptions.dataSourceData
		);
	}

	private async applyDataSourceToTableFields(
		dataSourceData: any,
		field: ITableField,
		tableFields: any
	): Promise<void> {
		const newFieldRows: any[] = [];
		if (
			typeof dataSourceData === 'string' &&
			(dataSourceData === ErrorCode.NoLegalOwnersFound ||
				dataSourceData === ErrorCode.NoPropertyAreasFound ||
				dataSourceData === ErrorCode.NoData)
		) {
			field.fieldOptions.searchResponse = {
				response: dataSourceData,
				searchFoundResult: false,
			};
		} else {
			dataSourceData.forEach((element: any) => {
				const columns: any[] = [];
				tableFields.forEach((tableField: any) => {
					const dataSourceConnection =
						this.dataSourceConnectionCallbacks!.getConnection(
							tableField
						);
					if (
						dataSourceConnection &&
						dataSourceConnection.options.itemProperty
					) {
						const value = this.getDataSourceValue(
							dataSourceConnection,
							element
						);
						if (Array.isArray(value)) {
							const items: IItem[] = [];
							value.forEach((item) => {
								const newItem = {} as IItem;
								Object.getOwnPropertyNames(item).forEach(
									(element) => {
										const itemValue = item[element];
										if (typeof itemValue === 'string') {
											newItem.title = itemValue;
											newItem.value = itemValue;
										} else {
											newItem.id = itemValue;
										}
									}
								);
								items.push(newItem);
							});
							let first;
							if (items.length > 0) {
								const item = items[0];
								first = item.id;
							}
							columns.push({
								fieldGuid: tableField.guid,
								items,
								value: first,
								isItem: true,
							});
						} else if (
							tableField.type === 'FieldSelectList' &&
							tableField.fieldOptions.items
						) {
							columns.push({
								fieldGuid: tableField.guid,
								value,
								isItem: true,
							});
						} else {
							columns.push({
								fieldGuid: tableField.guid,
								value,
								isItem: false,
							});
						}
					} else {
						columns.push({
							fieldGuid: tableField.guid,
							value: '',
							isItem: false,
						});
					}
				});
				newFieldRows.push({
					guid: this.generateUuid(),
					columns,
				});
			});
			if (newFieldRows.length > 0) {
				field.fieldOptions.tableRows = newFieldRows;
				if (field.fieldOptions.autofillNumberOfRows) {
					field.fieldOptions.minRows = newFieldRows.length;
					field.fieldOptions.maxRows = newFieldRows.length;
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
				field.fieldOptions.tableRows = [
					{
						guid: this.generateUuid(),
						columns,
					},
				];
			}
			field.fieldOptions.searchResponse = null;
			this.dataSourceConnectionCallbacks.setData(
				field,
				field.fieldOptions.tableRows
			);
		}
	}

	private async createRowNoData(
		field: ITableField,
		tableFields: any
	): Promise<void> {
		const columns: any[] = [];
		tableFields.forEach((tableField: any) => {
			columns.push({
				fieldGuid: tableField.guid,
				value: '',
				isItem: false,
			});
		});
		field.fieldOptions.tableRows = [
			{
				guid: this.generateUuid(),
				columns,
			},
		];
		this.dataSourceConnectionCallbacks.setData(
			field,
			field.fieldOptions.tableRows
		);
	}

	private getDataSourceValue(
		dataSourceConnection: IDataSourceConnection,
		dataSourceEntity: any
	): any {
		if (
			dataSourceConnection.options.itemProperty &&
			!dataSourceConnection.options.itemProperty.includes('.')
		) {
			let value = '';
			const propName =
				dataSourceConnection.options.itemProperty.toLowerCase();
			Object.keys(dataSourceEntity).every((key) => {
				if (key.toLowerCase() === propName) {
					value = dataSourceEntity[key];
					return false;
				}
				return true;
			});
			return value;
		} else if (
			dataSourceConnection.options.itemProperty &&
			dataSourceConnection.options.itemProperty.includes('.')
		) {
			let tempValueOfArray: any;
			const propNameArray = dataSourceConnection.options.itemProperty
				.toLowerCase()
				.split('.');
			const propNameOfArray = propNameArray[0];
			Object.keys(dataSourceEntity).every((key) => {
				if (key.toLowerCase() === propNameOfArray) {
					tempValueOfArray = dataSourceEntity[key];
					return false;
				}
				return true;
			});
			const valueOfArray: any = [];
			const lastPropNameOfArray = propNameArray[propNameArray.length - 1];
			tempValueOfArray.forEach((element: any) => {
				const nya: any = new Object();
				Object.keys(element).forEach((key) => {
					if (
						(key.toLowerCase() === 'id' ||
							key.toLowerCase().includes('id')) &&
						typeof element[key] === 'number'
					) {
						nya.id = element[key];
					}
					if (key.toLowerCase() === lastPropNameOfArray) {
						nya.title = element[key];
						nya.value = element[key];
					}
				});
				valueOfArray.push(nya);
			});
			return valueOfArray;
		} else {
			throw new Error(
				'Data source connection is missing itemProperty, it will not be possible to apply data source'
			);
		}
	}

	private async resolveApiUrl(
		dataSourceName: string
	): Promise<string | null> {
		return new Promise<string | null>((resolve) => {
			if (!this.dataSourceSpecifications) {
				// Haven't finished loading the specs... wait 1 second and try again
				setTimeout(async () => {
					const apiUrl = await this.resolveApiUrl(dataSourceName);
					resolve(apiUrl);
				}, 1000);
			} else {
				const dataSourceSpec = this.dataSourceSpecifications.find(
					(spec) => spec.dataSourceName === dataSourceName
				);
				if (!dataSourceSpec) {
					resolve(null);
				} else {
					let apiUrl = dataSourceSpec.apiUrl;
					if (apiUrl.indexOf('/') === 0) {
						if (this.useMockData) {
							apiUrl = 'http://localhost:8080' + apiUrl;
						} else {
							apiUrl = this.dataServiceSpecUrl!.origin + apiUrl;
						}
					}
					resolve(apiUrl);
				}
			}
		});
	}

	private async getUrlsOfDatasourcesUsedInForm(
		form: IForm
	): Promise<Map<string, URL>> {
		const urls: Map<string, URL> = new Map();
		let allFields: IFormField[] = [];
		form.attributes.steps.forEach((step) => {
			allFields = allFields.concat(step.fields);
		});
		if (!this.dataSourceSpecifications) {
			// Haven't finished loading the specs... wait 1 second and try again
			setTimeout(async () => {
				await this.getUrlsOfDatasourcesUsedInForm(form);
			}, 1000);
		} else {
			const temp = allFields
				.map(
					(f) =>
						(
							this.dataSourceConnectionCallbacks!.getConnection(
								f
							) || {}
						).dataSourceName
				)
				.filter((v) => (v ? true : false));

			const allDataSourceNames = temp.filter((dataSourceName) => {
				const dataSourceSpec = this.dataSourceSpecifications!.find(
					(spec) => spec.dataSourceName === dataSourceName
				);
				if (dataSourceSpec!.apiUrl !== '') {
					return dataSourceName;
				}
			});
			// remove duplicate references to the same datasource
			const distinctDataSourceNames = [...new Set(allDataSourceNames)];
			for (const dataSourceName of distinctDataSourceNames) {
				const apiUrl = await this.resolveApiUrl(dataSourceName);
				if (!apiUrl) {
					console.warn(
						'Could not find any datasource with name ' +
							dataSourceName
					);
				} else {
					urls.set(dataSourceName, new URL(apiUrl));
				}
			}
		}
		return urls;
	}

	/**
	 * Generate new guid as string;
	 */
	public generateUuid(): string {
		const hex = [] as any;
		for (let i = 0; i < 256; i++) {
			hex[i] = (i < 16 ? '0' : '') + i.toString(16);
		}
		let r = new Uint8Array(16);
		if (window.crypto !== undefined) {
			r = crypto.getRandomValues(new Uint8Array(16));
		} else {
			r = (window as any).msCrypto.getRandomValues(new Uint8Array(16));
		}

		/* tslint:disable-next-line */
		r[6] = (r[6] & 0x0f) | 0x40;
		/* tslint:disable-next-line */
		r[8] = (r[8] & 0x3f) | 0x80;

		return (
			hex[r[0]] +
			hex[r[1]] +
			hex[r[2]] +
			hex[r[3]] +
			'-' +
			hex[r[4]] +
			hex[r[5]] +
			'-' +
			hex[r[6]] +
			hex[r[7]] +
			'-' +
			hex[r[8]] +
			hex[r[9]] +
			'-' +
			hex[r[10]] +
			hex[r[11]] +
			hex[r[12]] +
			hex[r[13]] +
			hex[r[14]] +
			hex[r[15]]
		);
	}

	private fillFieldWithMockedData(dataSourceName: string): any {
		const list = dataSourceDataMock.find(
			(f: any) =>
				f.dataSourceName === dataSourceName && f.searchParameter === ''
		);
		if (list) {
			return list.data ? list.data : list.errorCode;
		}
		return ErrorCode.NoData;
	}

	private fillFieldWithMockedSearchData(
		dataSourceName: string,
		searchParameter: string,
		searchValue: string
	): any {
		const list = dataSourceDataMock.find(
			(f: any) =>
				f.dataSourceName === dataSourceName &&
				f.searchParameter === searchParameter
		);
		if (list) {
			const dataSourceSpecification = this.dataSourceSpecifications!.find(
				(f) => f.dataSourceName === dataSourceName
			) as IDataSourceSpecification;
			const result = list.data.filter((element: any) =>
				element[searchParameter]
					.toLowerCase()
					.includes(searchValue.toLowerCase())
			);
			if (dataSourceSpecification.singleEntity) {
				return result && result.length === 1
					? result[0]
					: ErrorCode.NoData;
			} else {
				return result && result.length > 0 ? result : ErrorCode.NoData;
			}
		}
		return ErrorCode.NoData;
	}
}
