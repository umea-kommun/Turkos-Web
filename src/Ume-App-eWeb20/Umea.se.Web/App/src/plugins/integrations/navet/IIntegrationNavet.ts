export interface IIntegrationNavet {
	id: number;
	type: string;
	title?: string;
	navetMatterType: MatterType | string;
	navetFields: string[];
}

export enum MatterType {
	FTJ = 'ftj',
	RFTJ = 'rftj',
}
