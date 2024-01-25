import { AppContentSize, FormFieldType } from './../models/Enums';
import {
	IChoice,
	IForm,
	IFormField,
	IFormStatus,
	IQueryOption,
} from '@/models/IForm';
import { FormStatus, ConditionChoice, QueryOption } from '@/models/Enums';

export class Helper {
	/**
	 * Convert component name to kebab-case, for ex. FieldTextBox is converted to field-text-box.
	 * @param name {string} String to convert from
	 */
	public static getComponentName(name: string): string {
		return name
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/\s+/g, '-')
			.toLowerCase();
	}

	/**
	 * Makes a deep-copy of object to remove reference to state,
	 * objects inside objekt will be a copy of the original-objekt.
	 * @param data object to make copy of.
	 */
	public static deepCopy<T>(data: T): T {
		return JSON.parse(JSON.stringify(data));
	}

	/**
	 * Makes a shallow-copy of object to remove reference to state,
	 * objects inside object will be a reference to the original-objekt.
	 * @param data object to make copy of.
	 */
	public static shallowCopy<T>(data: T): T {
		return Object.assign({}, data);
	}

	/**
	 * Generate new id as string and a value less than 0;
	 */
	public static generateTempId(): string {
		return Math.floor(Math.random() * 100000 * -1).toString();
	}

	/**
	 * Generate new id as integer and a value less than 0;
	 */
	public static generateTempIdInteger(): number {
		return Math.floor(Math.random() * 100000 * -1);
	}

	/**
	 * Generate new guid as string;
	 */
	public static generateUuid(): string {
		const hex = [] as string[];
		for (let i = 0; i < 256; i++) {
			hex[i] = (i < 16 ? '0' : '') + i.toString(16);
		}
		let r = new Uint8Array(16);
		if (window.crypto !== undefined) {
			r = crypto.getRandomValues(new Uint8Array(16));
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

	/**
	 * Get status for form with info about text and colors
	 */
	public static getStatus(status: FormStatus): IFormStatus {
		return status === FormStatus.Published
			? { statusColorBg: 'success', statusColorText: 'black' }
			: status === FormStatus.Draft
			? { statusColorBg: 'warning', statusColorText: 'black' }
			: status === FormStatus.Unpublished
			? { statusColorBg: 'error', statusColorText: 'black' }
			: {};
	}

	public static getChoices(): IChoice[] {
		const temp: IChoice[] = [];
		temp.push({
			choiceId: ConditionChoice.Like,
			choiceTitle: 'Lika',
			choiceType: [
				FormFieldType.CheckBox.toLowerCase(),
				FormFieldType.RadioButton.toLowerCase(),
				FormFieldType.SelectList.toLowerCase(),
			],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.Not,
			choiceTitle: 'Inte lika',
			choiceType: [
				FormFieldType.CheckBox.toLowerCase(),
				FormFieldType.RadioButton.toLowerCase(),
				FormFieldType.SelectList.toLowerCase(),
			],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.StartsWith,
			choiceTitle: 'Startar med',
			choiceType: [
				FormFieldType.TextBox.toLowerCase(),
				FormFieldType.TextArea.toLowerCase(),
				FormFieldType.DatePicker.toLowerCase(),
				FormFieldType.PersonalNumber.toLowerCase(),
			],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.EndsWith,
			choiceTitle: 'Slutar med',
			choiceType: [
				FormFieldType.TextBox.toLowerCase(),
				FormFieldType.TextArea.toLowerCase(),
				FormFieldType.DatePicker.toLowerCase(),
				FormFieldType.PersonalNumber.toLowerCase(),
			],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.Contains,
			choiceTitle: 'Innehåller',
			choiceType: [
				FormFieldType.TextBox.toLowerCase(),
				FormFieldType.TextArea.toLowerCase(),
				FormFieldType.DatePicker.toLowerCase(),
				FormFieldType.PersonalNumber.toLowerCase(),
			],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.Empty,
			choiceTitle: 'Tom',
			choiceType: [
				FormFieldType.TextBox.toLowerCase(),
				FormFieldType.TextArea.toLowerCase(),
				FormFieldType.DatePicker.toLowerCase(),
				FormFieldType.PersonalNumber.toLowerCase(),
			],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.NotEmpty,
			choiceTitle: 'Inte tom',
			choiceType: [
				FormFieldType.TextBox.toLowerCase(),
				FormFieldType.TextArea.toLowerCase(),
				FormFieldType.DatePicker.toLowerCase(),
				FormFieldType.PersonalNumber.toLowerCase(),
			],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.Between,
			choiceTitle: 'Mellan',
			choiceType: [
				FormFieldType.TextBox.toLowerCase(),
				FormFieldType.TextArea.toLowerCase(),
				FormFieldType.DatePicker.toLowerCase(),
				FormFieldType.PersonalNumber.toLowerCase(),
			],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.GreaterThan,
			choiceTitle: 'Större än',
			choiceType: [FormFieldType.Numeric.toLowerCase()],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.GreaterThanOrEqual,
			choiceTitle: 'Större än eller lika med',
			choiceType: [FormFieldType.Numeric.toLowerCase()],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.LessThan,
			choiceTitle: 'Mindre än',
			choiceType: [FormFieldType.Numeric.toLowerCase()],
			isChecked: false,
		} as IChoice);
		temp.push({
			choiceId: ConditionChoice.LessThanOrEqual,
			choiceTitle: 'Mindre än eller lika med',
			choiceType: [FormFieldType.Numeric.toLowerCase()],
			isChecked: false,
		} as IChoice);
		return temp;
	}

	public static getQueryOption(): IQueryOption[] {
		const temp: IQueryOption[] = [];
		temp.push({
			queryOptionId: QueryOption.And,
			queryOptionTitle: 'Alla',
			isChecked: false,
		} as IQueryOption);
		temp.push({
			queryOptionId: QueryOption.Or,
			queryOptionTitle: 'Någon av',
			isChecked: false,
		} as IQueryOption);
		return temp;
	}

	/** Get appropriate classes determining grid size, depending on given AppContentSize */
	public static getSizeClasses(size: AppContentSize): string {
		if (size === AppContentSize.Default) {
			return 'v-col-12 v-col-sm-10 v-col-md-9 v-col-lg-7';
		} else {
			// wide
			return 'v-col-12 v-col-md-11 v-col-lg-10 v-col-xl-9';
		}
	}

	/** Sort by title in ascending order */
	public static sortByTitle(
		a: { title: string },
		b: { title: string }
	): number {
		if (a.title.toLowerCase() < b.title.toLowerCase()) {
			return -1;
		}
		if (a.title.toLowerCase() > b.title.toLowerCase()) {
			return 1;
		}
		return 0;
	}

	/** Sort by adminTitle in ascending order */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static sortByAdminTitle(a: any, b: any): number {
		if (a.adminTitle.toLowerCase() < b.adminTitle.toLowerCase()) {
			return -1;
		}
		if (a.adminTitle.toLowerCase() > b.adminTitle.toLowerCase()) {
			return 1;
		}
		return 0;
	}

	/** Escape a string so it can be used in regex */
	public static escapeRegExp(string: string): string {
		return string.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'); // $& means the whole matched string
	}

	/** Find a field in a form using guid */
	public static findFieldByGuid(
		fieldGuid: string,
		form: IForm
	): IFormField | null {
		for (const step of form.attributes.steps) {
			for (const field of step.fields) {
				if (field.guid === fieldGuid) {
					return field;
				}
			}
		}
		return null;
	}
}
