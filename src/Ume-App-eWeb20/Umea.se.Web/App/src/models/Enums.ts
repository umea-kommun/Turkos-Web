/**
 * Tillgängliga typer av interface för formulärfält
 */
export enum FormFieldInterface {
	SingleValueField = 'SingleValueField',
	FileListField = 'FileListField',
	ItemListField = 'ItemListField',
	SearchField = 'SearchField',
}

/**
 * Tillgängliga typer av formulärfält, ex. TextBox, CheckBox etc.
 */
export enum FormFieldType {
	TextBox = 'FieldTextBox',
	TextArea = 'FieldTextArea',
	Section = 'FieldSection',
	SelectList = 'FieldSelectList',
	CheckBox = 'FieldCheckBox',
	RadioButton = 'FieldRadioButton',
	Integration = 'FieldIntegration',
	DatePicker = 'FieldDatePicker',
	FileUpload = 'FieldFileUpload',
	PersonalNumber = 'FieldPersonalNumber',
	Table = 'FieldTable',
	TextSearchBox = 'FieldTextSearchBox',
	HiddenTextBox = 'FieldHiddenTextBox',
	SelectSearchList = 'FieldSelectSearchList',
	Numeric = 'FieldNumeric',
}

export enum FormFieldIcon {
	FieldTextBox = 'short_text',
	FieldTextArea = 'view_headline',
	FieldSection = 'title',
	FieldSelectList = 'arrow_drop_down_circle',
	FieldCheckBox = 'check_box',
	FieldRadioButton = 'radio_button_checked',
	FieldIntegration = 'ballot',
	FieldDatePicker = 'date_range',
	FieldFileUpload = 'attachment',
	FieldPersonalNumber = 'person',
	FieldTable = 'table_chart',
	FieldHiddenTextBox = 'visibility_off',
	FieldTextSearchBox = 'plagiarism',
	FieldSelectSearchList = 'plagiarism',
	FieldNumeric = '123',
}

/** Läge för formulär - visning, redigering, admin eller toolbox */
export enum FormMode {
	View = 'VIEW',
	Edit = 'EDIT',
	Admin = 'ADMIN',
	Toolbox = 'TOOLBOX',
	Print = 'PRINT',
}

/**
 * Typer av valideringar, mappar mot Vee-Validate
 */
export enum ValidationRuleType {
	Required = 'required',
	Length = 'length',
	OneOrMoreIsChecked = 'oneOrMoreIsChecked',
	CharLimit = 'charLimit',
	MinDate = 'minDate',
	MaxDate = 'maxDate',
	ZipCode = 'zipCode',
	MacAddress = 'macAddress',
	CharMaxSize50 = 'charMaxSize50',
	CharMaxSize255 = 'charMaxSize255',
	CharMaxSize5000 = 'charMaxSize5000',
	ValidPersNumber = 'validPersNumber',
	ValidOrgNumber = 'validOrgNumber',
	Numeric = 'numeric',
	Email = 'email',
	Phonenumber = 'phonenumber',
}

/**
 * Contains which fields can use a validation rule
 */
export const ValidationRuleAllowedFields: {
	[key in ValidationRuleType]?: FormFieldType[];
} = {
	[ValidationRuleType.Length]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.CharLimit]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.ZipCode]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.MacAddress]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.CharMaxSize50]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.CharMaxSize255]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.CharMaxSize5000]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.Numeric]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.Email]: [FormFieldType.TextBox, FormFieldType.TextArea],
	[ValidationRuleType.ValidPersNumber]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.ValidOrgNumber]: [
		FormFieldType.TextBox,
		FormFieldType.TextArea,
	],
	[ValidationRuleType.MinDate]: [FormFieldType.DatePicker],
	[ValidationRuleType.MaxDate]: [FormFieldType.DatePicker],

	[ValidationRuleType.Phonenumber]: [FormFieldType.TextBox],
	[ValidationRuleType.Required]: [
		FormFieldType.CheckBox,
		FormFieldType.DatePicker,
		FormFieldType.FileUpload,
		FormFieldType.Numeric,
		FormFieldType.PersonalNumber,
		FormFieldType.RadioButton,
		FormFieldType.SelectList,
		FormFieldType.SelectSearchList,
		FormFieldType.TextArea,
		FormFieldType.TextBox,
		FormFieldType.TextSearchBox,
	],
};

export enum ValidOrgNumberFormats {
	Short = 'short',
	ShortDash = 'shortDash',
	Long = 'long',
	LongDash = 'longDash',
}

/**
 * DataControllers för GDPR, ex. nämnder inom kommunen
 */
export enum GdprDataController {
	Fritid = 'Fritidsnämnden',
	Bygg = 'Byggnadsnämnden',
	Teknik = 'Tekniska nämnden',
}

/** Status för integration, dvs hur processes går */
export enum IntegrationStatus {
	NotStarted = 'NotStarted',
	Started = 'Started',
	Success = 'Success',
	Error = 'Error',
}

/** Mutationtypes for store */
export enum MutationType {
	// Form
	GetForm = 'getForm',
	GetForms = 'getForms',
	GetInitialFormGroups = 'getInitialFormGroups',
	GetPublicForm = 'getPublicForm',
	GetPublicFormInfo = 'getPublicFormInfo',
	GetEServiceErrorMessage = 'getEServiceErrorMessage',
	SendForm = 'sendForm',
	TruncateForm = 'truncateForm',
	UpdateFormProperty = 'updateFormProperty',
	UpdateFormIntegration = 'updateFormIntegration',
	DeleteFormIntegration = 'deleteFormIntegration',
	RemoveForm = 'removeForm',
	UpdateForm = 'updateForm',
	UpdateFormContactInfo = 'updateFormContactInfo',
	UpdateFormContactInfos = 'updateFormContactInfos',
	UpdateFormUserContactInfo = 'updateFormUserContactInfo',
	UpdateFormUsersLegitimations = 'updateFormUsersLegitimations',
	UpdateLastFormTitle = 'updateLastFormTitle',
	FormSent = 'formSent',

	// Form step
	AddFormStep = 'addFormStep',
	UpdateFormStep = 'updateFormStep',
	DeleteFormStep = 'deleteFormStep',
	PushStepForward = 'pushStepForward',
	PushStepBackward = 'PushStepBackward',

	// Form Field
	AddFormField = 'addFormField',
	AddFormFields = 'addFormFields',
	UpdateFormField = 'updateFormField',
	UpdateFormFieldTableData = 'updateFormFieldTableData',
	UpdateFormFieldTableRows = 'updateFormFieldTableRows',
	ReplaceFormField = 'replaceFormField',
	DeleteFormField = 'deleteFormField',
	DeleteFormFieldTableFields = 'deleteFormFieldTableFields',
	RemoveValuesFromHiddenFields = 'removeValuesFromHiddenFields',
	FormatFormFieldOutput = 'FormatFieldOutput',

	// Integration
	ApplyIntegrationData = 'applyIntegrationData',

	// Multiple signing
	GetMultipleSigning = 'getMultipleSigning',
	GetMultipleSigningParameters = 'getMultipleSigningParameters',

	// User
	UserLogIn = 'userLogIn',
	UserLogOut = 'userLogOut',
	UserEnterPage = 'userEnterPage',

	// Gdpr
	GetGdpr = 'getGdpr',
	UpdateGdpr = 'updateGdpr',
	DeleteGdpr = 'deleteGdpr',

	// Pm3
	GetPm3 = 'getPm3',
	UpdatePm3 = 'updatePm3',
	DeletePm3 = 'deletePm3',

	// LifeSituation
	GetLifeSituation = 'getLifeSituation',
	UpdateLifeSituation = 'updateLifeSituation',
	DeleteLifeSituation = 'deleteLifeSituation',

	// Category
	GetCategories = 'getCategories',
	UpdateCategory = 'updateCategory',
	DeleteCategory = 'deleteCategory',

	// Receivers
	GetReceivers = 'getReceivers',
	UpdatedReceiver = 'updatedReceiver',
	DeleteReceiver = 'deleteReceiver',

	// Ecos
	GetEcos = 'getEcos',
	UpdateEcos = 'updateEcos',
	DeleteEcos = 'deleteEcos',

	// Ecos Templates
	GetTemplates = 'getTemplates',
	UpdateTemplate = 'updateTemplate',
	DeleteTemplate = 'deleteTemplate',

	// Field copying in admin
	CopyFields = 'copyFields',
	AddFieldsIdsToPasteHistory = 'addToPasteHistory',

	// FollowUp
	UpdateFormFollowUpProperty = 'updateFormFollowUpProperty',

	// Field DisplayRule
	UpdateFormFieldDisplayRuleGroup = 'updateFormFieldDisplayRuleGroup',
	UpdateFormFieldDisplayRuleGroupCondition = 'updateFormFieldDisplayRuleGroupCondition',
	UpdateFormFieldDisplayRuleGroupQueryOption = 'updateFormFieldDisplayRuleGroupQueryOption',
	RemoveGroupFromDisplayRuleGroup = 'removeGroupFromDisplayRuleGroup',
	RemoveConditionFromDisplayRuleGroup = 'removeConditionFromDisplayRuleGroup',

	// Error handler
	SetError = 'setError',

	// Admin state
	NewAdminState = 'newAdminState',
	UpdateAdminState = 'updateAdminState',

	// Data source loading
	FieldLoadingDataSourceReset = 'fieldLoadingDataSourceReset',
	FieldLoadingDataSourceStart = 'fieldLoadingDataSourceStart',
	FieldLoadingDataSourceDone = 'fieldLoadingDataSourceDone',

	// Mt Captcha
	SetMTCaptchaIsTriggered = 'setMTCaptchaIsTriggered',
	SetMTCaptchaIsVerified = 'setMTCaptchaIsVerified',

	// Banner
	GetBanner = 'getBanner',
	UpdateBanner = 'updateBanner',

	// Admin file upload
	FormReplaceBlobUriWithSource = 'formReplaceBlobUriWithSource',

	// Multiple Legitimation MessageTexts
	CreateMessageTextsFromDefault = 'createMessageTextsFromDefault',
	UpdateMessageTexts = 'updateMessageTexts',

	// Input för dynamiska variablar
	SetActiveInput = 'setActiveInput',
	InsertAtCursor = 'insertAtCursor',
	CleartInsertAtCursor = 'cleartInsertAtCursor',
}

/** Status för ett formulär */
export enum MethodChoice {
	Cut = 'Cut',
	Copy = 'Copy',
}

/** Status för ett formulär */
export enum FormStatus {
	Draft = 'Draft',
	Published = 'Published',
	Unpublished = 'Unpublished',
}

/** Status för ett formulär */
export enum FormFollowUpActivation {
	None = 'None',
	Integration = 'Integration',
	Manual = 'Manual',
}

/** Typ för ett formulär */
export enum FormType {
	EService = 'EService',
	LinkExternal = 'LinkExternal',
	InfoPage = 'InfoPage',
}

/** Val från multiple Signing */
export enum MultipleSigningChoice {
	Deny = 'Deny',
	Approve = 'Approve',
}

/** ErrorCode som kommer från FormService */
export enum ErrorCode {
	FormPathNotUnique = 'FormPathNotUnique',
	FormNotFound = 'FormNotFound',
	FormNotPublished = 'FormNotPublished',
	FormNoPath = 'FormNoPath',
	MissingTitle = 'MissingTitle',
	MissingAdminTitle = 'MissingAdminTitle',
	CannotDeleteObject = 'CannotDeleteObject',
	MissingUrl = 'MissingUrl',
	CannotDeleteObjectWithRelation = 'CannotDeleteObjectWithRelation',
	NoData = 'NoData',
	NoLegalOwnersFound = 'NoLegalOwnersFound',
	NoPropertyAreasFound = 'NoPropertyAreasFound',
}

/**
 * Size for app content. Default is used to show a public form.
 * Wide is used to provide more space for content, for example in admin.
 */
export enum AppContentSize {
	Default = 'Default',
	Wide = 'Wide',
}

/**
 * Enum for aria roles, see http://karlgroves-sandbox.com/CheatSheets/ARIA-Cheatsheet.html about aria roles-
 */
export enum AriaRole {
	Alert = 'alert', // Show important and time sensitive information. Use for notifications, validation errors etc.
	Status = 'status', // Show status information whose content is of less importance as alert.
	// Use for navigation information and feedback to user etc.
	Dialog = 'dialog', // Show a dialog that requires the user to enter information or require a response.
}

/** Typ för ett formulär */
export enum TemplateOptionType {
	Role = 'Role',
	Address = 'Address',
	Diary = 'Diary',
	HandlingOfficerGroup = 'HandlingOfficerGroup',
	Process = 'Process',
	Occurrence = 'Occurrence',
	Notification = 'Notification',
	Document = 'Document',
	MunicipalityCode = 'MunicipalityCode',
	CaseSubTitle = 'CaseSubTitle',
}

export enum TemplateType {
	Ecos = 'Ecos',
	Temp = 'Temp',
}

export enum FileTypeValidations {
	Images = 'Images',
	PdfAndWord = 'PdfAndWord',
	Pdf = 'Pdf',
	PdfAndImages = 'PdfAndImages',
	PdfAndOffice = 'PdfAndOffice',
}

export enum IntegrationType {
	Email = 'Email',
	EmailNotification = 'EmailNotification',
	AdvancedSharepoint = 'AdvancedSharepoint',
	NavetFardtjanst = 'NavetFardtjanst',
	Public360 = 'Public360',
	OnPrem = 'OnPrem',
}

export enum AvailableIntegration {
	Email = 'Email',
	EmailNotification = 'EmailNotification',
	AdvancedSharepoint = 'AdvancedSharepoint',
	NavetFardtjanst = 'NavetFardtjanst',
	Public360 = 'Public360',

	// OnPrem integrations
	EcosIntegration = 'EcosIntegration',
	UserWifiConnections = 'UserWifiConnections',
}

export enum ConditionChoice {
	Like = 'like',
	Not = 'not',
	StartsWith = 'startsWith',
	EndsWith = 'endsWith',
	Contains = 'contains',
	Empty = 'empty',
	NotEmpty = 'notEmpty',
	Between = 'between',
	GreaterThan = 'greaterThan',
	GreaterThanOrEqual = 'greaterThanOrEqual',
	LessThan = 'lessThan',
	LessThanOrEqual = 'lessThanOrEqual',
}

export enum QueryOption {
	And = 'and',
	Or = 'or',
}

export enum ContactFields {
	Phonenumber = 'phoneNumber',
	Email = 'email',
}

/** Multiple signing messageTexts events */
export enum MessageEvent {
	None,
	Send,
	Send_second,
	Accept,
	Reject,
	Reminder,
	Last_reminder,
	Closed_due_to_no_response,
}

/** Vilket sätt kontaktas vårdnadshavare 2 i multiple signing */
export enum Medium {
	None,
	Email,
	Sms,
}

/** Multiple signing messageTexts */
export enum MessageTextAttribute {
	Subject = 'subject',
	Message = 'message',
}

export enum MessageTextsVariablesForBackend {
	EserviceTitleShowsOnConfirmAndNotificationAndStatus = '$message.FormMessage.form.attributes.title',
	EserviceTitleShowsOnReminders = '$MultiSigningTitle',
	EserviceTitleShowsOnExpired = '$EServiceStarter.MultiSigningTitle',
	FornameAndLastnameGuardian1ShowsWhenExpired = '$EServiceStarter.Name',
	FornameAndLastnameGuardian = '$message.OtherUserContactInfo.Name',
	UrlEserviceEmail = '$message.OtherUserContactInfo.Url',
	UrlEserviceSms = '$shortUrl',
	NumberOfDays = '$numberOfDays',
}

export enum MessageTextsVariablesToShowFrontend {
	EserviceTitleShowsOnConfirmAndNotificationAndStatus = '[TitelPaEtjanstenBekraftelseOchNotifikationOchStatus]',
	EserviceTitleShowsOnReminders = '[TitelPaEtjanstenPaminnelser]',
	EserviceTitleShowsOnExpired = '[TitelPaEtjanstenObesvarat]',
	FornameAndLastnameGuardian1ShowsWhenExpired = '[ForOchEfternamnVardnadshavare1Obesvarat]',
	FornameAndLastnameGuardian = '[ForOchEfternamnVardnadshavare]',
	UrlEserviceEmail = '[UrlEtjanstEmail]',
	UrlEserviceSms = '[UrlEtjanstSMS]',
	NumberOfDays = '[AntalDagar]',
}
