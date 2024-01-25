import Axios from 'axios';
import {
	dataSourceDataMock,
	dataSourceSpecSearchMock,
	IDataSourceSpecification,
	IUserConnector,
	IDataSourceConnector,
	ErrorCode,
} from './models';
import { IForm, ISingleValueField } from '@/models/IForm';

export default class DataSourceApplier {
	private dataSourceConnectionCallbacks: IDataSourceConnector;
	private userConnectionCallbacks: IUserConnector | null = null;
	private useMockData: boolean;
	private dataServiceSpecSearchUrl: URL | null;
	private dataSourceSpecifications: IDataSourceSpecification[] | null = null;
	private inDataSourceSpecifications: IDataSourceSpecification[] | null =
		null;

	constructor({
		dataServiceSpecSearchUrl,
		useMockData,
		userConnectionCallbacks,
		dataSourceConnectionCallbacks,
	}: any) {
		this.useMockData = useMockData;
		this.dataServiceSpecSearchUrl = useMockData
			? null
			: new URL(dataServiceSpecSearchUrl);
		this.userConnectionCallbacks = userConnectionCallbacks;
		this.dataSourceConnectionCallbacks = dataSourceConnectionCallbacks;
	}

	public async fetchDataSourceSpecificationsSearch(): Promise<
		IDataSourceSpecification[]
	> {
		if (!this.dataSourceSpecifications) {
			if (this.useMockData) {
				this.dataSourceSpecifications = dataSourceSpecSearchMock;
			} else {
				const response = await Axios.get(
					this.dataServiceSpecSearchUrl!.toString()
				);
				this.dataSourceSpecifications = response.data;
			}
		}
		return this.dataSourceSpecifications as IDataSourceSpecification[];
	}

	public async fetchDataSourcesUsedInForm(
		dataSourceName: string,
		searchValue: string
	): Promise<Map<string, object>> {
		const fetchedDataSources: Map<string, object> = new Map();
		const apiUrls = await this.getUrlOfDatasourcesUsedInFormSearch(
			dataSourceName
		);
		const apiUrl = apiUrls.get(dataSourceName);
		const accessToken = this.userConnectionCallbacks!.getUser().token;
		try {
			if (this.useMockData) {
				const dataSourceSpecification =
					this.dataSourceSpecifications!.find(
						(f) => f.dataSourceName === dataSourceName
					) as IDataSourceSpecification;
				const data = await this.fillFieldWithMockedSearchData(
					dataSourceName,
					dataSourceSpecification.searchParameter,
					searchValue
				);
				fetchedDataSources.set(dataSourceName, data);
			} else {
				const dataSourceSpecification =
					this.dataSourceSpecifications!.find(
						(f) => f.dataSourceName === dataSourceName
					) as IDataSourceSpecification;
				const data = await this.fetchDataWithSearch(
					apiUrl!.toString(),
					accessToken,
					dataSourceSpecification.searchParameter,
					searchValue
				);
				fetchedDataSources.set(dataSourceName, data);
			}
		} catch (err: any) {
			console.warn(
				'Unable to fetch datasource, message: ' +
					err +
					' stack: ' +
					err.stack
			);
		}
		return fetchedDataSources;
	}

	public applyDataSources(
		dataSourcesData: Map<string, object>,
		form: IForm,
		fieldGuid: string
	): void {
		form.attributes.steps.forEach((step) => {
			step.fields.forEach(async (field) => {
				if (field.guid === fieldGuid) {
					const dataSourceConnection =
						this.dataSourceConnectionCallbacks!.getSearchConnection(
							field
						);
					if (dataSourceConnection) {
						const data = dataSourcesData.get(
							dataSourceConnection.dataSourceName
						);
						this.applyDataSourceToSearchField(
							data,
							field as ISingleValueField
						);
					}
				}
			});
		});
	}

	private applyDataSourceToSearchField(
		dataSourceData: any,
		field: ISingleValueField
	): void {
		field.fieldOptions.searchResponse = null;
		if (
			typeof dataSourceData === 'string' &&
			dataSourceData === ErrorCode.NoData
		) {
			(field.fieldOptions as any).items = [];
			field.fieldOptions.searchResponse = {
				response:
					'Hittar inget resultat, kontrollera att du har skrivit rätt',
				searchFoundResult: false,
			};
		} else if (Array.isArray(dataSourceData)) {
			(field.fieldOptions as any).items = dataSourceData;
		} else {
			field.fieldOptions.searchResponse = {
				response: dataSourceData,
				searchFoundResult: true,
			};
		}
	}

	private async getUrlOfDatasourcesUsedInFormSearch(
		dataSourceName: string
	): Promise<Map<string, URL>> {
		const urls: Map<string, URL> = new Map();
		const apiUrl = await this.resolveApiUrlSearch(dataSourceName);
		if (!apiUrl) {
			console.warn(
				'Could not find any datasource with name ' + dataSourceName
			);
		} else {
			urls.set(dataSourceName, new URL(apiUrl));
		}
		return urls;
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

	private async resolveApiUrl(
		dataSourceName: string
	): Promise<string | null> {
		return new Promise<string | null>((resolve) => {
			if (!this.inDataSourceSpecifications) {
				// Haven't finished loading the specs... wait 1 second and try again
				setTimeout(async () => {
					const apiUrl = await this.resolveApiUrl(dataSourceName);
					resolve(apiUrl);
				}, 1000);
			} else {
				const dataSourceSpec = this.inDataSourceSpecifications.find(
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
							apiUrl =
								this.dataServiceSpecSearchUrl!.origin + apiUrl;
						}
					}
					resolve(apiUrl);
				}
			}
		});
	}

	private async resolveApiUrlSearch(
		dataSourceName: string
	): Promise<string | null> {
		return new Promise<string | null>((resolve) => {
			if (!this.dataSourceSpecifications) {
				// Haven't finished loading the specs... wait 1 second and try again
				setTimeout(async () => {
					const apiUrl = await this.resolveApiUrlSearch(
						dataSourceName
					);
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
							apiUrl =
								this.dataServiceSpecSearchUrl!.origin + apiUrl;
						}
					}
					resolve(apiUrl);
				}
			}
		});
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
			if (dataSourceSpecification.singleEntity) {
				let result: any;
				if (searchParameter === 'value') {
					result = list.data.filter((element: any) =>
						element
							.toLowerCase()
							.includes(searchValue.toLowerCase())
					);
				} else {
					result = list.data.filter((element: any) =>
						element[searchParameter]
							.toLowerCase()
							.includes(searchValue.toLowerCase())
					);
				}
				return result && result.length === 1
					? result[0].value
						? result[0].value
						: result[0]
					: ErrorCode.NoData;
			} else {
				const result = list.data.filter((element: any) =>
					element[searchParameter]
						.toLowerCase()
						.includes(searchValue.toLowerCase())
				);
				return result && result.length > 0 ? result : ErrorCode.NoData;
			}
		}
		return ErrorCode.NoData;
	}
}
