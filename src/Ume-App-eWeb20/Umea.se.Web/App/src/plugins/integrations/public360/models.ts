export enum Public360MappingParameter {
	Title = 'title',
	DatasourceName = 'datasourcename',
	CaseTitle = 'caseTitle',
	ResponsibleEnterpriseRecno = 'responsibleEnterpriseRecno',
	AccessGroupRecno = 'accessGroupRecno',
	JournalUnitRecno = 'journalUnitRecno',
	DocumentArchiveRecno = 'documentArchiveRecno',
	DocumentCategoryRecno = 'documentCategoryRecno',
	DocumentStatusRecno = 'documentStatusRecno',
	Confidential = 'confidential',
	AddContact = 'addContact',
	CaseRole = 'caseRole',
	KeyWord = 'keyWord',
	MultipleEnterprises = 'multipleEnterprises',
}

export interface IPublic360List {
	title: string;
	id: string;
}

export interface IPublic360IntegrationRootState {
	enterprises: IPublic360List[];
	accessGroups: IPublic360List[];
	journals: IPublic360List[];
	documentCategories: IPublic360List[];
	documentArchives: IPublic360List[];
	documentStatuses: IPublic360List[];
	caseRoles: IPublic360List[];
}
