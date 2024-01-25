export interface ISharpointMapping {
	sharepointFieldGuid?: string;
}

export interface ISharepointFieldMapping extends ISharpointMapping {
	fieldGuid?: string;
}

export interface IContactInfoSharpointFieldMapping extends ISharpointMapping {
	contactInfoProperty?: string;
}

export interface IUserLegitimationFieldMapping extends ISharpointMapping {
	userLegitimationProperty?: string;
}

export interface ISharepointWebsite {
	name: string;
	partialURL: string;
}

export interface ISharepointList {
	title: string;
	guid: string;
}

export interface ISharepointField {
	title: string;
	guid: string;
}

export interface ISharepointIntegrationRootState {
	websites?: ISharepointWebsite[];
	lists?: ISharepointList[];
	fields?: ISharepointField[];
}
