import * as Enums from '@/models/Enums';
import { ContactFields, FileTypeValidations } from '@/models/Enums';
import {
	IDataServicePluginRootStore,
	IDataSourceConnection,
} from '@/plugins/dataService/models';
import { IValidationRule } from './IValidation';

/**
 * Beskriver metadata för formulär
 */
export default class FormMetaDataModel {
	public id: string;
	public title: string;
	public description: string;

	constructor(id: string, title: string, description: string) {
		this.id = id;
		this.title = title;
		this.description = description;
	}
}

/**
 * Datastructure of a form/e-service
 */
export interface IForm {
	type: string;
	id: string;
	attributes: IFormAttribute;
}

/**
 * Interface for the message that can be sent to backend
 */
export interface IFormMessage {
	form: IForm;
	userContactInfo: IUserContactInfo;
	id: string;
}

/**
 * Interface for IUserContactInfo
 */
export interface IUserContactInfo {
	socialSecurityNumber: string;
	firstName: string;
	lastName: string;
	address: string;
	postalNumber: string;
	city: string;
	phoneNumber: string;
	email: string;
	authClientName: string;
	ageToday?: number;
	ageThisYear?: number;
	newAgeInXDays?: number;
}

/**
 * User En inloggad användare
 */
export interface IUser {
	socialSecurityNumber: string;
	fullName?: string;
	firstName: string;
	lastName: string;
	token?: string;
	email: string | null;
	scope?: string[];
	userContactInfo?: IUserContactInfo | null;
	isAuthenticated: boolean;
	protectedIdentity?: string;
	userId: string;

	/**
	 * Unix timestamp telling when user session expires
	 */
	exp?: number;

	/**
	 * The auth client used to login this user
	 */
	authClientName: string;

	/**
	 * Which idp do we have behind the user token
	 */
	idp?: string;
}

/**
 * Interface for IContactInfo
 */
export interface IContactInfo {
	id: string;
	childSocialSecurityNumber: string;
	childName: string;
	childFirstName: string;
	childLastName: string;
	socialSecurityNumber: string;
	name: string;
	address: string;
	postalNumber: string;
	city: string;
	phoneNumber: string;
	email: string;
	isSelected: boolean;
	contactPath: number;
}

/**
 * Interface for IUserLegitimation
 */
export interface IUserLegitimation {
	refId: string;
	name: string;
	legitimizedMethod: string;
	legitimizedDateTime: string; // date string
}

/**
 * Attribut-data för ett formulär
 */
export interface IFormAttribute {
	title: string;
	description: string;
	path: string;
	gDPR: IGdprDataController;
	status: Enums.FormStatus;
	type: Enums.FormType;
	linkUrl: string;
	pM3: any;
	receiver: null | IReceiver;
	integrations: IFormIntegration[];
	displayRules: IDisplayRule[];
	steps: IFormStep[];
	modified: string; // date string
	modifiedBy: string;
	created: string; // date string
	createdBy: string;
	templateGuid?: string;
	lifeSituations: ILifeSituation[];
	categories: ICategory[];
	dateSchedule: IDateSchedule;
	userRequirement: IUserRequirement;
	applyingForAnother: boolean;
	comments: IComment[];
	hidden: boolean;
	hidePersonNumber: boolean;
	simpleEservice: boolean;
	disablePrintPdf: boolean;
	userContactInfos: IContactInfo[] | null;
	usersLegitimations: IUserLegitimation[] | null;
	printFieldPersonnumber: boolean;
	followUp: IFollowUp;
	recentSubmits: number;
	messageTexts: IMessageTexts[] | null;
}

export interface IUserRequirement {
	phoneNumberMandatory: boolean;
	emailMandatory: boolean;
	addressMandatory: boolean;
	canApplyForAnother: boolean;
	showUserContactInformation: boolean;
	multipleLegitimation: boolean;
	authClient: string[];
	contactPaths: number[];
	numberOfDaysToAnswer: string;
}

export interface IMessageTexts {
	id: string;
	messageEvent: Enums.MessageEvent;
	medium: Enums.Medium;
	message: string;
	subject: string;
}

export interface IDateSchedule {
	from: string; // Date string
	to: string;
	active: boolean;
}

/**
 * Datastrukturen för varje steg i fomuläret
 */
export interface IFormStep {
	type: string;
	id: string;
	title: string;
	description: string;
	sortIndex: number;
	fields: Array<
		| ISingleValueField
		| IItemListField
		| IFileListField
		| IIntegration
		| IFormField
	>;
}

/**
 * Datastrukturen för GDPR i formuläret
 */
export interface IGdprDataController {
	dataControllers: IGdpr[];
}

/**
 * Datastrukturen för GDPR data-controllers i formuläret
 */
export interface IGdpr {
	type: string;
	id: number;
	title: string;
	adminTitle?: string;
	url: string;
}

export interface ILifeSituation {
	id: number;
	title: string;
}
export interface ICategory {
	id: number;
	title: string;
}
/**
 * IFormGroup is either a LifeSituation or a Category where count is the number of forms it has
 */
export interface IFormGroup {
	id: number;
	title: string;
	count: number;
}
/**
 * Bas-interface för fält i ett formulär
 */
export interface IFormField {
	type: Enums.FormFieldType | string;
	id: string;
	guid: string;
	title: string;
	helpText: string;
	sortIndex: number;
	mode: Enums.FormMode | string;
	fieldOptions: any;
	displayRuleGuids: any[];
	displayRuleAnother: boolean;
	displayRuleMultipleLegitimation: boolean;
	displayRuleSearchResponse: boolean;
	displayRuleGroup: IDisplayRuleGroup | null;
	reminderNumberOfDays: number[];

	/**
	 * Array that gives you errors that should be displayed when a step/form is submitted
	 */
	submitErrors: string[];
}

/**
 * Interface för den enklaste formen av fält, som bara har ett värde
 */
export interface ISingleValueField extends IFormField {
	value: string;
	fieldOptions: IFieldOptions;
}

export interface ITableField extends IFormField {
	value: string;
	fieldOptions: ITableFieldOptions;
}

/**
 * Interface för fält som håller en lista med alternativ
 */
export interface IItemListField extends IFormField {
	fieldOptions: IItemFieldOptions;
}

export interface IItem {
	title?: string;
	isChecked?: boolean;
	disabled?: boolean;
	value?: string;
	id?: any;
	helptext?: string;
}

/**
 * Interface för fält med en lista av filer.
 */
export interface IFileListField extends ISingleValueField {
	files?: IPondFile[];
	fieldOptions: IFileFieldOptions;
}

export interface IFieldOptions {
	validation?: IValidationRule[];
	searchResponse?: any;
	readOnly?: boolean;
	useAsContactField?: ContactFields;
	buttonText?: string;
	showToUser?: boolean;
	generatedPassword?: IGeneratedPassword;
	allowDecimals?: boolean;
	dataSource?: IDataSourceConnection;
}

export interface ITableFieldOptions extends IFieldOptions {
	rowDisplay: string;
	objectName: string;
	columnWidth?: number;
	minRows: number;
	maxRows: number;
	autofillNumberOfRows: boolean;
	tableGuid?: string;
	tableRows?: ITableRow[];
	dataSourceData: any;
}

export interface IItemFieldOptions extends IFieldOptions {
	items?: IItem[];
	allowMultipleChoices?: boolean;
	contactInfo?: IContactInfo[];
}

export interface IFileFieldOptions extends IFieldOptions {
	maxFiles?: number;
	allowMultiple?: boolean;
	fileTypeValidation?: FileTypeValidations;
}

export interface IGeneratedPassword {
	autoGeneratedPassword: boolean;
	passwordLength: number;
	selectedPasswordSpecialCharacters: {
		value: string;
	};
}

export interface IPondFile {
	type: string;
	file: File;
	error?: string;
}

export interface IPm3 {
	id: number;
	title: string;
}
export interface IReceiver {
	id: number;
	title: string;
	adminTitle?: string;
	url: string;
}

export interface ITemplate {
	id?: number;
	guid: string;
	title: string;
	type: Enums.TemplateType;
	options: ITemplateOption[];
}

export interface ITemplateOption {
	guid: string;
	title: string;
	parameterName: string;
	type: Enums.TemplateOptionType;
}

export interface IEcosTemplate {
	id: number;
	title: string;
	caseSubTitleItem: IItem;
	guid: string;
	type: Enums.TemplateType;
	municipalityCode: IItem;
	roles: IItem[];
	addressTypes: IItem[];
	documentTypes: IItem[];
	processTypeGuid: string;
	occurrenceTypeGuid: string;
	notificationTypeGuid: string;
	diaryPlanGuid: string;
	handlingOfficerGroupTypeGuid: string;
	eServiceConnection: string[];
}

/**
 * Interface för komponenter som kan mappa extern (integrerad) data
 * mot fält i formuläret
 */
export interface IIntegration extends ISingleValueField {
	serviceUrl: string;
	dataMapping: any;
}

/** Interface för resultatat av ett anrop till integration */
export interface IIntegrationResult {
	errors?: IError[];
	data?: IIntegrationResultData;
}

/** Interface för data i integrationsresultatet */
export interface IIntegrationResultData {
	type: string;
	id: string;
	attributes?: any;
}

/**
 * Interface för en integration
 */
export interface IFormIntegration {
	id: number;
	type: Enums.IntegrationType;
	options: IFormIntegrationOption[];
}

/**
 * IFormIntegration with the the integrationType attribute
 * We need the integrationType attribute in the frontend
 * to differentiate onPrem integrations
 */
export interface IFormIntegrationTyped extends IFormIntegration {
	integrationType: Enums.AvailableIntegration;
}

/**
 * Interface för en intergrations inställningar
 */
export interface IFormIntegrationOption {
	id?: number;
	key: string;
	value: string;
	data?: any;
}

/**
 * Interface för visningsregel, kopplingsbara frågor
 */
export interface IDisplayRuleQuestion {
	fieldGuid: string;
	fieldTitle: string;
	fieldType: string;
	responseItems: IItem[];
	isChecked?: boolean;
}
/**
 * Interface för visningsregel, svarsalternativ
 */
export interface IDisplayRuleResponse {
	fieldOptionId: number;
	fieldOptionTitle: string;
	isChecked?: boolean;
}
/**
 * Interface för visningsregel, vem som är moder
 */
export interface IDisplayRuleMother {
	fieldOptionTitle: string;
	fieldTitle: string;
	choice: string;
	fieldId: string;
	conditionText?: string;
}

/**
 * Interface för data i visningsregeldata
 */
export interface IDisplayRule {
	id?: number;
	guid: string;
	metadata: string;
	title: string;
	fieldGuid: string;
	fieldOptionId: any;
	formId: number;
	colorCode: string;
}

/** Generellt interface för ett felmeddelande */
export interface IComboboxItem {
	title: string;
	color: string;
}

/** Generellt interface för ett felmeddelande */
export interface IError {
	status: number;
	code: number;
	title: string;
}

export interface FieldsCopyMemory {
	copiedFields: any[];
	history: Array<{ id: string[]; time: number }>;
	formId?: string;
	methodChoice: Enums.MethodChoice;
}

export interface IMultipleSigningByLink {
	formGuid?: string;
	contactId?: string;
	isMultipleSigningByLink: boolean;
	linkHasExpired: boolean;
	isWrongUserForLink: boolean;
	linkHasBeenCancelled: boolean;
	linkIsAlreadySigned: boolean;
}

export interface IEServiceErrorMessage {
	errorMessage: string;
}

export interface IAdminFormError {
	type: string;
	attribute: string;
	msg: string;
	fieldTab?: number;
	fieldId?: string;
	stepIndex?: number;
}

export interface IAdminState {
	activeStep: number;
	activeFieldId: string;
	activeFieldOptionsTab: number;
	selectedFields: string[];
	haveSavedAnyChanges: boolean;
	formErrors: IAdminFormError[];
	motherFields: { [key: string]: boolean };
	pathUnique: boolean;
	usedFiles: string[];
}

/**
 * State för vuex-store
 */
export interface IRootState {
	form: null | IForm;
	user: IUser;
	forms: null | IForm[];
	initialForms: null | IForm[];
	initialGroups?: null | IFormGroup[];
	// date string telling the date of the latest comment on a form (set when a comment gets added to the form)
	lastCommentAddedDate?: Date;
	formHasUnsavedChanges: boolean;
	validationRuleTypes: null | IValidationRule[];
	pm3: null | IPm3[];
	receivers: null | IReceiver[];
	result: any;
	gdpr: null | IGdpr[];
	fieldsCopyMemory: FieldsCopyMemory;
	lifeSituations: null | ILifeSituation[];
	multipleSigningByLink: null | IMultipleSigningByLink;
	eServiceErrorMessage: null | IEServiceErrorMessage;
	categories: null | ICategory[];
	ecos: null | ITemplate[];
	templates: null | ITemplate[];
	error?: any;
	errorUserMessage?: null | string;
	lastFormTitle: null | string;
	fieldsLoadingDataSource: string[];
	mtCaptcha: ImtCaptcha;
	admin?: IAdminState;
	banner?: IBanner;
}

export interface IRootStateDataService extends IRootState {
	dataServicePlugin: IDataServicePluginRootStore;
}

export interface IRootStateDataSearchService extends IRootStateDataService {
	dataServiceSearchPlugin: IDataServicePluginRootStore;
}

export const FieldTypeInterfaceMapp: {
	[FormFieldInterface: string]: Enums.FormFieldType[];
} = {
	[Enums.FormFieldInterface.SingleValueField]: [
		Enums.FormFieldType.TextBox,
		Enums.FormFieldType.DatePicker,
		Enums.FormFieldType.TextArea,
		Enums.FormFieldType.Integration,
		Enums.FormFieldType.Section,
		Enums.FormFieldType.PersonalNumber,
		Enums.FormFieldType.HiddenTextBox,
		Enums.FormFieldType.Numeric,
	],
	[Enums.FormFieldInterface.FileListField]: [Enums.FormFieldType.FileUpload],
	[Enums.FormFieldInterface.ItemListField]: [
		Enums.FormFieldType.CheckBox,
		Enums.FormFieldType.RadioButton,
		Enums.FormFieldType.SelectList,
		Enums.FormFieldType.Table,
	],
	[Enums.FormFieldInterface.SearchField]: [
		Enums.FormFieldType.TextSearchBox,
		Enums.FormFieldType.SelectSearchList,
	],
};

/**
 * Interface för tabellrubriker
 */
export interface IHeader {
	text: string;
	align?: string;
	sortable?: boolean;
	value: string;
}

/**
 * Interface för tabellraderna
 */
export interface IListItem {
	id: string;
	path: string;
	value: boolean;
	title: string;
	receiver: string;
	status: string;
	statustext: string;
	savedDate: string;
}

/**
 * Interface for breadcrumbs
 */
export interface IBreadCrumb {
	name: string;
	text: string;
	disabled: boolean;
	to: string;
}

/**
 * Interface for AdminFormProperies
 */
export interface IFormProperties {
	title: string;
	path: string;
	status: string;
}

/**
 * Interface for IFormStatus
 */
export interface IFormStatus {
	statusText?: string;
	statusColorBg?: string;
	statusColorText?: string;
}

/**
 * Interface for IFieldTable
 */
export interface IFieldTable {
	fieldTableGuid: string;
	rows: ITableRow[];
}

/**
 * Interface for ITableRow
 */
export interface ITableRow {
	guid: string;
	columns: ITableColumn[];
}

/**
 * Interface for ITableColumn
 */
export interface ITableColumn {
	fieldGuid: string;
	isItem: boolean;
	value: any;
	items: any;
	disabled: boolean;
}

export interface IComment {
	guid: string;
	text: string;
	timestamp: string;
	userEmail: string;
}

export interface IItemDisplayRule {
	title?: string;
	isChecked?: boolean;
	value?: string;
	id?: any;
	isAnd?: boolean;
	isNot?: boolean;
	isOr?: boolean;
}

export interface IFollowUp {
	activation: Enums.FormFollowUpActivation;
	averageTreatmentTime: string;
}

export interface IQueryOption {
	queryOptionId: Enums.QueryOption;
	queryOptionTitle: string;
	isChecked?: boolean;
}

export interface IChoice {
	choiceId: Enums.ConditionChoice;
	choiceTitle: string;
	choiceType: string[];
	isChecked?: boolean;
}

export interface IDisplayRuleGroup {
	displayRuleGroupGuid: string;
	queryOption: Enums.QueryOption;
	conditions: ICondition[];
	groups: IDisplayRuleGroup[];
	id?: number;
}

export interface ICondition {
	conditionGuid: string;
	conditionQuestion: string;
	conditionQuestionType: string;
	conditionChoice: Enums.ConditionChoice | any;
	conditionResponse: string;
	conditionResponse2: string;
}

export interface ImtCaptcha {
	isTriggered: boolean;
	isVerified: boolean;
}

export interface ITitleValuePair {
	title: string;
	value: string;
}

export interface IBanner {
	id: number;
	text: string;
	active: boolean;
	modified: string;
}

export interface ISortBy {
	key: string;
	order: boolean | 'asc' | 'desc';
}

export interface ITableHeader {
	title: string;
	key: string;
	align: 'start' | 'end' | 'center';
	sortable?: boolean;
}

export interface ITextAreaState {
	activeInput: HTMLTextAreaElement | null;
}
