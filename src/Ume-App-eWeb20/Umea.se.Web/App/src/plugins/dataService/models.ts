import { IFormField, IUser } from '@/models/IForm';

/** ErrorCode som kommer från FormService eller DataService */
export enum ErrorCode {
	NoResponse = 'NoResponse',
	AlreadyRegistered = 'AlreadyRegistered',
	NoData = 'NoData',
	NoLegalOwnersFound = 'NoLegalOwnersFound',
	NoPropertyAreasFound = 'NoPropertyAreasFound',
}

export interface IDataSourceSpecification {
	apiUrl: string;
	dataSourceName: string;
	schema: any;
	exampleData: any;
	commonDataModel: string;
	singleEntity: boolean;
	searchEntity: boolean;
	errorMessage: boolean;
	searchParameter: string;
	description: string;
	integrationAvailable: boolean;
	integrationTemplateAvailable: boolean;
	resultToInPutDataSourceNames?: string[];
	applyDataToValueOnItemsInMultipleEntity?: boolean;
}

export interface IDataServicePluginRootStore {
	dataSourceSpecs?: IDataSourceSpecification[];
	dataSourceSpecsOutPut?: IDataSourceSpecification[];
	dataSourceSpecsSearch?: IDataSourceSpecification[];
}
export interface IDataSourceConnection {
	dataSourceName: string;
	options: {
		itemProperty?: string;
		itemReciver?: boolean;
		itemFiller?: boolean;
		dependsOnDataSourceSearchParameter?: boolean;
		dependsOnDataSourceSearchParameters?: string[];
		resultToInPutDataSourceNames?: string[];
		applyDataToValueOnItemsInMultipleEntity?: boolean;
	};
}

export const StoreAction = {
	loadDataSourceSpecs: 'dataServicePlugin/loadDataSourceSpecs',
	createDatasourceConnection: 'dataServicePlugin/createDatasourceConnection',
	removeDataSourceConnection: '',
};

export interface IUserConnector {
	getUser(): IUser;
}

export interface IDataSourceConnector {
	getConnection(field: IFormField): IDataSourceConnection;
	setData(field: IFormField, tableRows: any): void;
	setTableData(field: IFormField, dataSourceData: any): void;
	setConnection(field: IFormField, dataSource: IDataSourceConnection): void;
	removeConnection(field: IFormField): void;
	getOutPutConnection(field: IFormField): IDataSourceConnection;
	setOutPutData(field: IFormField, tableRows: any): void;
	setOutPutTableData(field: IFormField, dataSourceData: any): void;
	setOutPutConnection(
		field: IFormField,
		dataSource: IDataSourceConnection
	): void;
	removeOutPutConnection(field: IFormField): void;
	getSearchConnection(field: IFormField): IDataSourceConnection;
	setSearchData(field: IFormField, tableRows: any): void;
	setSearchTableData(field: IFormField, dataSourceData: any): void;
	setSearchConnection(
		field: IFormField,
		dataSource: IDataSourceConnection
	): void;
	removeSearchConnection(field: IFormField): void;
}

export const dataSourceSpecMock: IDataSourceSpecification[] = [
	{
		apiUrl: '/whatever/resource',
		commonDataModel: 'Crm.Common.Model',
		dataSourceName: 'DataList',
		schema: {
			name: 'string',
			id: 'string',
			date: 'string',
		},
		exampleData: {
			name: 'Apa',
			id: '839238vcml3fmnf',
			date: '',
		},
		description: 'List med data',
		singleEntity: false,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/somethingelse/resource',
		commonDataModel: 'Crm.Common.OtherModel',
		dataSourceName: 'Data',
		schema: {
			title: 'string',
			id: 'string',
			date: 'string',
		},
		exampleData: {
			title: 'Groda',
			id: '839238vcml3fmnf',
			date: '',
			asdf: '',
			d34eate: '',
			dsddssdate: '',
			dasdfgvte: '',
			dsdsdate: '',
			daczxcte: '',
			dsddsf3sdate: '',
			dasd4fgvte: '',
			dsds3date: '',
			dac2zxcte: '',
			dddsdate: '',
		},
		description: 'Dummy data',
		singleEntity: false,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/somethingelse/workdepartment',
		commonDataModel: 'Crm.Common.Department',
		dataSourceName: 'WorkDepartment',
		schema: {
			title: 'string',
			id: 'string',
			bossName: 'string',
		},
		exampleData: {
			title: 'IT-avdelningen',
			id: '2394mtfr',
			bossName: 'Lennart Holmlund',
		},
		description: 'Personens arbetsplats på stället',
		singleEntity: true,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/somethingelse/UserWifiConnections',
		commonDataModel: 'Devices',
		dataSourceName: 'UserWifiConnections',
		schema: {
			description: 'string',
			address: 'string',
			password: 'string',
		},
		exampleData: {
			description: 'platta receptionen',
			address: '00:08:22:64:04:cb',
			password: 'Hkdfjasd9adfsbwerkj',
		},
		description: 'Personens wifi-kopplingar',
		singleEntity: false,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: true,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/somethingelse/children',
		commonDataModel: 'Child',
		dataSourceName: 'Children',
		schema: {
			socialSecurityNumber: 'string',
			name: 'string',
			firstName: 'string',
			lastName: 'string',
			street: 'string',
			postalCode: 'string',
			city: 'string',
			parentSocialSecurityNumber: 'string',
			parentName: 'string',
			parentStreet: 'string',
			parentPostalCode: 'string',
			parentCity: 'string',
		},
		exampleData: {
			socialSecurityNumber: '200012319999',
			name: 'Kalle Anka',
			firstName: 'Kalle',
			lastName: 'Anka',
			street: 'Gatan 1',
			postalCode: '909 99',
			city: 'Staden',
			parentSocialSecurityNumber: '197012319999',
			parentName: 'Anna Anka',
			parentStreet: 'Gatan 1',
			parentPostalCode: '909 99',
			parentCity: 'Staden',
		},
		description: 'Användarens barn och ytterligare vårdnadshavare',
		singleEntity: false,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/somethingelse/ChildrenSchool',
		commonDataModel: 'Child',
		dataSourceName: 'ChildrenSchool',
		schema: {
			id: 'string',
			socialSecurityNumber: 'string',
			name: 'string',
			firstName: 'string',
			lastName: 'string',
			parentSocialSecurityNumber: 'string',
			parentName: 'string',
			parentStreet: 'string',
			parentPostalCode: 'string',
			parentCity: 'string',
			school: 'string',
			class: 'string',
			children: [],
		},
		exampleData: {
			id: 1,
			socialSecurityNumber: '200012319999',
			name: 'Fnatte Anka',
			firstName: 'Fnatte',
			lastName: 'Anka',
			parentSocialSecurityNumber: '197012319999',
			parentName: 'Anna Anka',
			parentStreet: 'Gatan 1',
			parentPostalCode: '909 99',
			parentCity: 'Staden',
			school: 'Lilla skolan',
			class: '2 A',
			children: [
				{
					childInListID: 0,
					childInListName: 'Välj i listan',
				},
				{
					childInListID: 1,
					childInListName: 'Fnatte Anka',
				},
			],
		},
		description:
			'Användarens barn, ytterligare vårdnadshavare, barnens skola och klass',
		singleEntity: false,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/somethingelse/legalowners',
		commonDataModel: 'LegalOwner',
		dataSourceName: 'LegalOwners',
		schema: {
			namn: 'string',
			organisationsNamn: 'string',
			coAddress: 'string',
			address: 'string',
			ort: 'string',
			postnummer: 'string',
			personOrgNummer: 'string',
			fastighetsBeteckning: 'string',
			fnr: 'string',
		},
		exampleData: {
			namn: 'Kalle Anka',
			organisationsNamn: 'Org namn',
			coAddress: 'coAddress',
			address: 'Adress',
			ort: 'Ort',
			postnummer: '99999',
			personOrgNummer: '199999999999',
			fastighetsBeteckning: 'Fastighetsbeteckning',
			fnr: '4545454545',
		},
		description: 'Lagfaren ägare till en fastighet',
		singleEntity: false,
		searchEntity: true,
		errorMessage: false,
		searchParameter: 'fnr',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
		resultToInPutDataSourceNames: ['Fastighetsbeteckning'],
	},
	{
		apiUrl: '/somethingelse/propertyareas',
		commonDataModel: 'Item',
		dataSourceName: 'PropertyAreas',
		schema: {
			id: 'number',
			title: 'string',
			value: 'string',
			isChecked: 'boolean',
		},
		exampleData: {
			id: 1,
			title: 'Title',
			value: 'guid',
			isChecked: 'false',
		},
		description: 'Fastighets områdes id',
		singleEntity: false,
		searchEntity: true,
		errorMessage: false,
		searchParameter: 'value',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
		resultToInPutDataSourceNames: ['Fastighetsbeteckning'],
	},
	{
		apiUrl: '/somethingelse/fastighetadress',
		commonDataModel: 'Address',
		dataSourceName: 'FastighetAdress',
		schema: {
			fnr: 'string',
			address: 'string',
			city: 'string',
			postCode: 'string',
		},
		exampleData: {
			fnr: 'guid-kod',
			address: 'Adress',
			city: 'Ort',
			postCode: '99999',
		},
		description: 'Fastighets adress',
		singleEntity: true,
		searchEntity: true,
		errorMessage: false,
		searchParameter: 'fnr',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
		resultToInPutDataSourceNames: ['Fastighet'],
	},
	{
		apiUrl: '/whatever/datavalue',
		commonDataModel: 'DataModel',
		dataSourceName: 'DataValue',
		schema: {
			name: 'string',
			id: 'string',
		},
		exampleData: {
			name: 'Test',
			id: '839238vcml3fmnf',
		},
		description: 'Data med värde',
		singleEntity: true,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/whatever/dataValueWithSearch',
		commonDataModel: 'DataModel',
		dataSourceName: 'DataValueWithSearch',
		schema: {
			search: 'string',
			name: 'string',
			id: 'string',
		},
		exampleData: {
			search: 'Test värde',
			name: 'Test',
			id: '839238vcml3fmnf',
		},
		description: 'Data med värde för sök',
		singleEntity: true,
		searchEntity: true,
		errorMessage: false,
		searchParameter: 'search',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/whatever/dataValueWithSearchFromDropDown',
		commonDataModel: 'DataModel',
		dataSourceName: 'DataValueWithSearchFromDropDown',
		schema: {
			search: 'string',
			title: 'string',
			name: 'string',
			id: 'string',
		},
		exampleData: {
			search: 'Test värde',
			title: 'Test title',
			name: 'Test name',
			id: '839238vcml3fmnf',
		},
		description: 'Data med värde från selectlista',
		singleEntity: true,
		searchEntity: true,
		errorMessage: false,
		searchParameter: 'search',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/whatever/skolenheter',
		commonDataModel: 'skolenheter',
		dataSourceName: 'skolenheter',
		schema: {
			skolenhetskod: 'string',
			skolenhetsnamn: 'string',
			kommunkod: 'string',
			peOrgNr: 'string',
			status: 'string',
		},
		exampleData: {
			skolenhetskod: 'Skolkod',
			skolenhetsnamn: 'Skolnamn',
			kommunkod: 'Kod',
			peOrgNr: 'Org. nummer',
			status: 'Status',
		},
		description: 'Skolenheter',
		singleEntity: false,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/whatever/skolenhet',
		commonDataModel: 'skolenhet',
		dataSourceName: 'skolenhet',
		schema: {
			skolenhetskod: 'string',
			besoksadress: {
				adress: 'string',
				postnr: 'string',
				ort: 'string',
				geoData: {
					koordinat_SweRef_N: 'string',
					koordinat_SweRef_E: 'string',
					koordinat_WGS84_Lng: 'string',
					koordinat_WGS84_Lat: 'string',
					punkttyp: 'string',
				},
			},
		},
		exampleData: {
			skolenhetskod: '27859889',
			besoksadress: {
				adress: 'Grubbevägen 19',
				postnr: '90354',
				ort: 'Umeå',
				geoData: {
					koordinat_SweRef_N: '7089182,02',
					koordinat_SweRef_E: '756195,491',
					koordinat_WGS84_Lng: '20.211723099999972',
					koordinat_WGS84_Lat: '63.8357714',
					punkttyp: '',
				},
			},
		},
		description: 'Skolenhet',
		singleEntity: true,
		searchEntity: true,
		errorMessage: false,
		searchParameter: 'skolenhetskod',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
];

export const dataSourceSpecOutPutMock: IDataSourceSpecification[] = [
	{
		apiUrl: '/somethingelse/UserWifiConnections',
		commonDataModel: 'Devices',
		dataSourceName: 'UserWifiConnections',
		schema: {
			description: 'string',
			address: 'string',
			password: 'string',
		},
		exampleData: {
			description: 'platta receptionen',
			address: '00:08:22:64:04:cb',
			password: 'Hkdfjasd9adfsbwerkj',
		},
		description: 'Personens wifi-kopplingar',
		singleEntity: false,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: true,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/somethingelse/emptypart',
		commonDataModel: 'PartyInformation',
		dataSourceName: 'EcosEmptyPart',
		schema: {},
		exampleData: {},
		description: 'Ecos, mappa till part',
		singleEntity: true,
		searchEntity: false,
		errorMessage: false,
		searchParameter: '',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
	},
];

export const dataSourceSpecSearchMock: IDataSourceSpecification[] = [
	{
		apiUrl: '/somethingelse/fastighetsbeteckningar',
		commonDataModel: 'Item',
		dataSourceName: 'Fastighetsbeteckning',
		schema: {
			id: 'number',
			title: 'string',
			value: 'string',
			isChecked: 'boolean',
		},
		exampleData: {
			id: 1,
			title: 'Fastighetsbeteckning',
			value: 'guid-kod',
			isChecked: false,
		},
		description: 'Lista fastighetsbeteckningar',
		singleEntity: false,
		searchEntity: true,
		errorMessage: false,
		searchParameter: 'title',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
		resultToInPutDataSourceNames: ['LegalOwners', 'PropertyAreas'],
	},
	{
		apiUrl: '/somethingelse/fastighet',
		commonDataModel: 'SingleValue',
		dataSourceName: 'Fastighet',
		schema: {
			value: 'string',
		},
		exampleData: {
			value: 'Fastighet',
		},
		description: 'Hämta fastighet',
		singleEntity: true,
		searchEntity: true,
		errorMessage: false,
		searchParameter: 'value',
		integrationAvailable: false,
		integrationTemplateAvailable: false,
		resultToInPutDataSourceNames: ['FastighetAdress'],
	},
];

const childrensMock: any = [
	{
		childInListID: 0,
		childInListName: 'Välj i listan',
	},
	{
		childInListID: 1,
		childInListName: 'Knatte Anka',
	},
	{
		childInListID: 2,
		childInListName: 'Fnatte Anka',
	},
	{
		childInListID: 3,
		childInListName: 'Tjatte Anka',
	},
];

export const dataSourceDataMock: any = [
	{
		dataSourceName: 'Fastighetsbeteckning',
		searchParameter: 'title',
		errorCode: ErrorCode.NoData,
		data: [
			{
				id: '1',
				title: 'Fastighet 1',
				value: 'guid-1',
				isChecked: false,
			},
			{
				id: '2',
				title: 'Område 2',
				value: 'guid-4',
				isChecked: false,
			},
			{
				id: '3',
				title: 'Fastighet 2',
				value: 'guid-2',
				isChecked: false,
			},
			{
				id: '4',
				title: 'Område 1',
				value: 'guid-3',
				isChecked: false,
			},
		],
	},
	{
		dataSourceName: 'LegalOwners',
		searchParameter: 'fnr',
		errorCode: ErrorCode.NoLegalOwnersFound,
		data: [
			{
				namn: 'Bamse',
				organisationsNamn: 'Org namn',
				coAddress: 'coAddress',
				address: 'Adress',
				ort: 'Ort',
				postnummer: '99999',
				personOrgNummer: '199999999999',
				fastighetsBeteckning: 'Fastighetsbeteckning',
				fnr: 'guid-3',
			},
			{
				namn: 'Kalle Anka',
				organisationsNamn: 'Org namn',
				coAddress: 'coAddress',
				address: 'Adress',
				ort: 'Ort',
				postnummer: '99999',
				personOrgNummer: '199999999999',
				fastighetsBeteckning: 'Fastighetsbeteckning',
				fnr: 'guid-1',
			},
			{
				namn: 'Kajsa Anka',
				organisationsNamn: 'Org namn',
				coAddress: 'coAddress',
				address: 'Adress',
				ort: 'Ort',
				postnummer: '99999',
				personOrgNummer: '199999999999',
				fastighetsBeteckning: 'Fastighetsbeteckning',
				fnr: 'guid-1',
			},
			{
				namn: 'Musse Pigg',
				organisationsNamn: 'Org namn',
				coAddress: 'coAddress',
				address: 'Adress',
				ort: 'Ort',
				postnummer: '99999',
				personOrgNummer: '199999999999',
				fastighetsBeteckning: 'Fastighetsbeteckning',
				fnr: 'guid-2',
			},
			{
				namn: 'Mimmi Pigg',
				organisationsNamn: 'Org namn',
				coAddress: 'coAddress',
				address: 'Adress',
				ort: 'Ort',
				postnummer: '99999',
				personOrgNummer: '199999999999',
				fastighetsBeteckning: 'Fastighetsbeteckning',
				fnr: 'guid-2',
			},
		],
	},
	{
		dataSourceName: 'PropertyAreas',
		searchParameter: 'value',
		errorCode: ErrorCode.NoPropertyAreasFound,
		data: [
			{
				id: 1,
				title: '1',
				value: 'guid-1',
				isChecked: false,
			},
			{
				id: 2,
				title: '2',
				value: 'guid-1',
				isChecked: false,
			},
			{
				id: 3,
				title: '1',
				value: 'guid-2',
				isChecked: false,
			},
			{
				id: 4,
				title: '1',
				value: 'guid-3',
				isChecked: false,
			},
		],
	},
	{
		dataSourceName: 'UserWifiConnections',
		searchParameter: '',
		data: [
			{
				description: 'platta2 receptionen',
				address: '00:08:22:07:44:f3',
				password: 'Hkdfjasd9adfsbwerkj',
			},
			{
				description: 'platta receptionen',
				address: '00:08:22:64:04:cb',
				password: 'Hkdfjasd9adfsbwerkj',
			},
			{
				description: 'Enkätsurfplatta receptionen',
				address: '00:08:22:85:e8:c4',
				password: 'Hkdfjasd9adfsbwerkj',
			},
		],
	},
	{
		dataSourceName: 'ChildrenSchool',
		searchParameter: '',
		data: [
			{
				id: '1',
				socialSecurityNumber: 'fejk 1, 200012319997',
				name: 'Knatte Anka',
				firstName: 'Knatte',
				lastName: 'Anka',
				parentSocialSecurityNumber: '197012319999',
				parentName: 'Kalle Anka',
				parentStreet: 'Gatan 1',
				parentPostalCode: '909 99',
				parentCity: 'Staden',
				class: 'Klass 1',
				school: 'Lilla skolan',
				children: childrensMock,
			},
			{
				id: '2',
				socialSecurityNumber: 'fejk 2, 200012319998',
				name: 'Fnatte Anka',
				firstName: 'Fnatte',
				lastName: 'Anka',
				parentSocialSecurityNumber: '197012319999',
				parentName: 'Kalle Anka',
				parentStreet: 'Gatan 1',
				parentPostalCode: '909 99',
				parentCity: 'Staden',
				class: 'Klass 2',
				school: 'Lilla skolan',
				children: childrensMock,
			},
			{
				id: '3',
				socialSecurityNumber: 'fejk 3, 200012319999',
				name: 'Tjatte Anka',
				firstName: 'Tjatte',
				lastName: 'Anka',
				parentSocialSecurityNumber: '197012319999',
				parentName: 'Kalle Anka',
				parentStreet: 'Gatan 1',
				parentPostalCode: '909 99',
				parentCity: 'Staden',
				class: 'Klass 3',
				school: 'Lilla skolan',
				children: childrensMock,
			},
		],
	},
	{
		dataSourceName: 'Children',
		searchParameter: '',
		data: [
			{
				SocialSecurityNumber: 'fejk 1, 200012319997',
				Name: 'Knatte Anka',
				firstName: 'Knatte',
				lastName: 'Anka',
				ParentSocialSecurityNumber: '197012319999',
				ParentName: 'Kalle Anka',
				ParentStreet: 'Gatan 1',
				ParentPostalCode: '909 99',
				ParentCity: 'Staden',
			},
			{
				SocialSecurityNumber: 'fejk 2, 200012319998',
				Name: 'Fnatte Anka',
				firstName: 'Fnatte',
				lastName: 'Anka',
				ParentSocialSecurityNumber: '197012319999',
				ParentName: 'Kalle Anka',
				ParentStreet: 'Gatan 1',
				ParentPostalCode: '909 99',
				ParentCity: 'Staden',
			},
			{
				SocialSecurityNumber: 'fejk 3, 200012319999',
				Name: 'Tjatte Anka',
				firstName: 'Tjatte',
				lastName: 'Anka',
				ParentSocialSecurityNumber: '197012319999',
				ParentName: 'Kalle Anka',
				ParentStreet: 'Gatan 1',
				ParentPostalCode: '909 99',
				ParentCity: 'Staden',
			},
		],
	},
	{
		dataSourceName: 'DataValue',
		searchParameter: '',
		data: {
			name: 'Test fejk 1',
			id: '839238vcml3fmnf',
		},
	},
	{
		dataSourceName: 'Fastighet',
		searchParameter: 'value',
		errorCode: ErrorCode.NoData,
		data: ['Fastighet 1', 'Fastighet 2', 'Fastighet 3', 'Fastighet 4'],
	},
	{
		dataSourceName: 'FastighetAdress',
		searchParameter: 'fnr',
		errorCode: ErrorCode.NoData,
		data: [
			{
				fnr: 'Fastighet 1',
				address: 'Adress 1',
				city: 'Ort 1',
				postCode: '99999',
			},
			{
				fnr: 'Fastighet 2',
				address: 'Adress 2',
				city: 'Ort 2',
				postCode: '99999',
			},
			{
				fnr: 'Fastighet 3',
				address: 'Adress 3',
				city: 'Ort 3',
				postCode: '99999',
			},
			{
				fnr: 'Fastighet 4',
				address: 'Adress 4',
				city: 'Ort 4',
				postCode: '99999',
			},
		],
	},
	{
		dataSourceName: 'DataList',
		searchParameter: '',
		data: [
			{
				name: 'Apa',
				id: '839238vcml3fmnf',
				date: '',
			},
			{
				name: 'Groda',
				id: '339238vcml3fmnf',
				date: '',
			},
			{
				name: 'Hund',
				id: '229238vcml3fmnf',
				date: '',
			},
		],
	},
	{
		dataSourceName: 'Data',
		searchParameter: '',
		data: [
			{
				title: 'Test 1',
				id: '839238Test1',
				date: '',
			},
			{
				title: 'Test 2',
				id: '839238Test2',
				date: '',
			},
			{
				title: 'Test 3',
				id: '839238Test3',
				date: '',
			},
		],
	},
	{
		dataSourceName: 'DataValueWithSearch',
		searchParameter: 'search',
		data: [
			{
				search: 'värde 1',
				name: 'Data med värde 1',
				id: '839238vcml3fmnf',
			},
			{
				search: 'värde 2',
				name: 'Data med värde 2',
				id: '839238vcml3fmnf',
			},
			{
				search: 'värde 3',
				name: 'Data med värde 3',
				id: '839238vcml3fmnf',
			},
		],
	},
	{
		dataSourceName: 'DataValueWithSearchFromDropDown',
		searchParameter: 'search',
		data: [
			{
				search: 'Apa',
				title: 'Data title med apa',
				name: 'Data name med apa',
				id: '839238vcml3fmnf1',
			},
			{
				search: 'Groda',
				title: 'Data title med groda',
				name: 'Data name med groda',
				id: '839238vcml3fmnf2',
			},
			{
				search: 'Hund',
				title: 'Data title med hund',
				name: 'Data name med hund',
				id: '839238vcml3fmnf3',
			},
		],
	},
	{
		dataSourceName: 'skolenheter',
		searchParameter: '',
		data: [
			{
				skolenhetskod: '27859889',
				skolenhetsnamn: 'Dragonskolan IN',
				kommunkod: '2480',
				peOrgNr: '2120002627',
				status: 'Aktiv',
			},
			{
				skolenhetskod: '27867404',
				skolenhetsnamn: 'Grisbacka skola 4-6',
				kommunkod: '2480',
				peOrgNr: '2120002627',
				status: 'Aktiv',
			},
			{
				skolenhetskod: '27888597',
				skolenhetsnamn: 'Central Insamlingsenhet',
				kommunkod: '1276',
				peOrgNr: '2120000928',
				status: 'Vilande',
			},
		],
	},
	{
		dataSourceName: 'skolenhet',
		searchParameter: 'skolenhetskod',
		data: [
			{
				skolenhetskod: '27859889',
				besoksadress: {
					adress: 'Dragongatan 1',
					postnr: '90322',
					ort: 'Umeå',
					geoData: {
						koordinat_SweRef_N: '7088879,423',
						koordinat_SweRef_E: '757910,292',
						koordinat_WGS84_Lng: '20.245926899999972',
						koordinat_WGS84_Lat: '63.8318084',
						punkttyp: '',
					},
				},
			},
			{
				skolenhetskod: '27867404',
				besoksadress: {
					adress: 'Grubbevägen 19',
					postnr: '90354',
					ort: 'Umeå',
					geoData: {
						koordinat_SweRef_N: '7089182,02',
						koordinat_SweRef_E: '756195,491',
						koordinat_WGS84_Lng: '20.211723099999972',
						koordinat_WGS84_Lat: '63.8357714',
						punkttyp: '',
					},
				},
			},
			{
				skolenhetskod: '27888597',
				besoksadress: {
					adress: 'Trädgårdsgatan 12',
					postnr: '26451',
					ort: 'Klippan',
					geoData: {
						koordinat_SweRef_N: '6222744,746',
						koordinat_SweRef_E: '383661,704',
						koordinat_WGS84_Lng: '13.127958799999987',
						koordinat_WGS84_Lat: '56.1355523',
						punkttyp: '',
					},
				},
			},
		],
	},
	{
		dataSourceName: 'Alla',
		searchParameter: '',
		data: ['fejk 1, ', 'fejk 2, ', 'fejk 3, '],
	},
];
