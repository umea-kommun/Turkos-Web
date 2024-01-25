/* eslint-disable @typescript-eslint/no-explicit-any */
import { IItem } from '@/models/IForm';

/**
 * Interface för en integration onprem
 */
export interface IIntegrationOnPrem {
	id?: number;
	title?: string;
	type: string;
	dataSourceName: string;
	templateOptions: IItem[];
	integrationTemplateAvailable: boolean;
}

export interface IDataSourceSpecificationRootState {
	dataSourceSpecsIntegration?: IDataSourceSpecification[];
}

export interface IDataSourceSpecification {
	apiUrl: string;
	dataSourceName: string;
	schema: any;
	exampleData: any;
	commonDataModel: string;
	singleEntity: boolean;
	description: string;
	integrationAvailable: boolean;
	integrationTemplateAvailable: boolean;
}

export const dataSourceSpecIntegrationMock: IDataSourceSpecification[] = [
	{
		apiUrl: '/somethingelse/UserWifiConnections',
		commonDataModel: '',
		dataSourceName: 'UserWifiConnections',
		schema: {},
		exampleData: {},
		description: 'Personens wifi-kopplingar',
		singleEntity: false,
		integrationAvailable: true,
		integrationTemplateAvailable: false,
	},
	{
		apiUrl: '/somethingelse/ecosintegration',
		commonDataModel: '',
		dataSourceName: 'EcosIntegration',
		schema: {},
		exampleData: {},
		description: 'Ecos, integration',
		singleEntity: false,
		integrationAvailable: true,
		integrationTemplateAvailable: true,
	},
];

export interface IEcosDataItem {
	guid: string;
	title: string;
	parameterName: string;
}
