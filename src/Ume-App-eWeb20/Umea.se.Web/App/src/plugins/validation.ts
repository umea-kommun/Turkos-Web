import { configure, defineRule } from 'vee-validate';
import AllRules from '@vee-validate/rules';
import { I18n, LocaleMessages, VueMessageType } from 'vue-i18n';
import Organisationsnummer from 'organisationsnummer';
import { IItem } from '@/models/IForm';
import moment from 'moment';
import { ValidOrgNumberFormats } from '@/models/Enums';
function initialize(
	i18n: I18n<LocaleMessages<VueMessageType>, unknown, unknown, true>
): void {
	Object.keys(AllRules).forEach((rule) => {
		defineRule(rule, AllRules[rule]);
	});

	configure({
		generateMessage: (context): string => {
			let params: unknown[] = [];
			if (
				context.rule?.params?.length &&
				Array.isArray(context.rule.params)
			) {
				params = context.rule.params;
			}
			return i18n.global.t(
				'app.validation.messages.' + context?.rule?.name,
				[context.field, ...params]
			);
		},
	});

	/**
	 * Validate phonenumber
	 */
	defineRule('phonenumber', (value: string) => {
		if (!value) {
			return true;
		}

		let valid = true;
		/* tslint:disable */
		const regexp = new RegExp(
			/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/
		);
		/* tslint:enable */
		valid = !!regexp.exec(value);
		return valid;
	});

	/**
	 * Vali-date min date
	 */
	defineRule('minDate', (value: string, [minDate]: string) => {
		if (!value || moment(value).isSameOrAfter(moment(minDate))) {
			return true;
		}
		return false;
	});

	/**
	 * Vali-date max date
	 */
	defineRule('maxDate', (value: string, [maxDate]: string) => {
		if (!value || moment(value).isSameOrBefore(moment(maxDate))) {
			return true;
		}
		return false;
	});

	/**
	 * Vali-date
	 */
	defineRule('validDate', (value: string) => {
		if (!value?.length) {
			return true;
		}
		const date = moment(value, 'YYYY-MM-DD', true);
		return date.isValid();
	});

	/**
	 * Valid date with time
	 */
	defineRule('validDateTime', (value: string) => {
		if (!value?.length) {
			return true;
		}
		const date = moment(value.replace('T', ' '), 'YYYY-MM-DD HH:mm', true);
		return date.isValid();
	});

	/**
	 * Invalid date
	 * This rule is only used when the date is invalid, so it always returns false
	 */
	defineRule('invalidDate', () => {
		return false;
	});

	/**
	 * Invalid date time
	 * This rule is only used when the date time is invalid, so it always returns false
	 */
	defineRule('invalidDateTime', () => {
		return false;
	});

	/**
	 * Number min value
	 * Value has to be equal or greater than min
	 */
	defineRule('minNumber', (value: string, opt: any) => {
		const number = parseInt(value);
		const minNumber = parseInt(opt[0]);
		if (!isNaN(number) && !isNaN(minNumber)) {
			return number >= minNumber;
		}
		return false;
	});

	/**
	 * Number max value
	 * Value has to be equal or less than max
	 */
	defineRule('maxNumber', (value: string, opt: any) => {
		const number = parseInt(value);
		const maxNumber = parseInt(opt[0]);
		if (!isNaN(number) && !isNaN(maxNumber)) {
			return number <= maxNumber;
		}
		return false;
	});

	/**
	 * Validera om en eller flera kryssrutor är förbockade
	 */
	defineRule('oneOrMoreIsChecked', (value: unknown, opt: any) => {
		let items;
		let checkedItems: number = 0;
		if (opt && opt.length > 0) {
			items = opt[0];
		}
		if (items) {
			items.forEach((item: IItem) => {
				if (item.isChecked) {
					checkedItems++;
				}
			});
		} else {
			return false;
		}
		return checkedItems > 0 ? true : false;
	});

	/**
	 * Validate zip code
	 */
	defineRule('zipCode', (value: string) => {
		let valid = true;
		if (value) {
			valid = /^\d{5}$/.test(value);
			if (!valid) {
				valid = /^\d{3} \d{2}$/.test(value);
			}
		}
		return valid;
	});
	/**
	 * Validate mac address
	 */
	defineRule('macAddress', (value: string) => {
		if (!value) {
			return true;
		}

		let valid = true;
		const regex = /^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
		if (value.length !== 17) {
			valid = false;
		}
		valid = regex.test(value);
		return valid;
	});
	/**
	 * Validate character limit
	 */
	defineRule('charLimit', (value: string, params: any) => {
		const charLimit = params[0];

		let valid = true;
		if (value.length > charLimit) {
			valid = false;
		}

		return valid;
	});
	/**
	 * Validate max 50 characters
	 */
	defineRule('charMaxSize50', (value: string) => {
		let valid = true;
		if (value.length > 50) {
			valid = false;
		}
		return valid;
	});
	/**
	 * Validate max 255 characters
	 */
	defineRule('charMaxSize255', (value: string) => {
		let valid = true;
		if (value.length > 255) {
			valid = false;
		}
		return valid;
	});
	/**
	 * Validate max 5000 characters
	 */
	defineRule('charMaxSize5000', (value: string) => {
		let valid = true;
		if (value.length > 5000) {
			valid = false;
		}
		return valid;
	});
	/**
	 * Validate max 5000 characters
	 */
	defineRule('validPersNumber', (value: string) => {
		if (!value) {
			return true;
		}

		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		return validateSsn(value);
	});
	/**
	 * Validate org number
	 */
	defineRule(
		'validOrgNumber',
		(value: string, validFormats: ValidOrgNumberFormats[]) => {
			if (!value) {
				return true;
			}
			const orgValid = Organisationsnummer.valid(value);

			if (
				!validFormats?.length ||
				(validFormats.length === 1 && !validFormats[0])
			) {
				// No format specified, all formats are valid
				return orgValid;
			} else if (orgValid) {
				// If the org number is valid, we want to make sure it has the required format
				let formatValid = false;
				const regexMap = {
					[ValidOrgNumberFormats.Short]: /^\d{10}$/, // 5555555555 etc.
					[ValidOrgNumberFormats.ShortDash]: /^\d{6}-\d{4}$/, // 555555-5555 etc.
					[ValidOrgNumberFormats.Long]: /^\d{12}$/, // 165555555555 etc.
					[ValidOrgNumberFormats.LongDash]: /^\d{8}-\d{4}$/, // 16555555-5555 etc.
				};
				validFormats.forEach((format) => {
					if (format in regexMap && regexMap[format].test(value)) {
						formatValid = true;
					}
				});
				return formatValid;
			}
			return orgValid;
		}
	);

	/**
	 * Using this rule if form path is not unique to display an error
	 */
	defineRule('formPathNotUnique', () => {
		return false;
	});

	/**
	 * Using this rule to validate form path
	 */
	defineRule('validFormPath', (value: string) => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		return validFormPath(value);
	});

	/**
	 * Validate if one of two required fields is entered
	 */
	defineRule('requiredOneOf', (value: string) => {
		return !!value?.length;
	});

	/**
	 * Valid number (positive or negative, no decimals)
	 */
	defineRule('validNumber', (value: string) => {
		if (!value) {
			return true;
		}
		const regex = /^-?(0|[1-9]\d*)$/;
		return regex.test(value);
	});

	/**
	 * Valid decimal number (positive or negative, max two decimal places, decimals are optional)
	 */
	defineRule('validNumberWithDecimals', (value: string) => {
		if (!value) {
			return true;
		}
		const regex = /^-?(0|[1-9]\d*)((\.|,)\d{0,2})?$/;
		return regex.test(value);
	});
}

export const validFormPath = (path: string): boolean => {
	if (path.match(/^form-\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{5}Z$/)) {
		// This is the default form path format, which is allowed(?)
		// Example: form-2022-06-21T12:18:22100Z
		return true;
	}
	// a-z, dashes and digits
	return !!path.match(/^[a-z-\d]+$/);
};

const validateSsn = (securityNumber: any): boolean => {
	if (typeof securityNumber !== 'string') {
		return false;
	}

	// Strip personnummer från -
	const ssnParts = securityNumber.split('-');
	if (ssnParts.length > 2) {
		return false;
	}

	securityNumber = ssnParts.join('');

	// Kontrollera att personnummer är längre än 10 eller inte numerisk
	if (
		securityNumber.length < 10 ||
		isNaN(Number(securityNumber.toString()))
	) {
		return false;
	}

	if (securityNumber.length > 10) {
		const ssny = securityNumber.slice(0, 4);
		const currentYear = new Date().getFullYear().toString();
		if (Number(ssny) > Number(currentYear.slice(0, 4))) {
			return false;
		}
		if (Number(ssny) < Number(currentYear.slice(0, 4)) - 110) {
			return false;
		}
	}

	if (securityNumber.length === 10) {
		const ssny = securityNumber.slice(0, 2);
		const currentYear = new Date().getFullYear().toString();
		if (Number(ssny) > Number(currentYear.slice(2, 4))) {
			securityNumber =
				Number(currentYear.slice(0, 2)) - 1 + securityNumber;
		} else {
			securityNumber = currentYear.slice(0, 2) + securityNumber;
		}
	}

	if (!securityNumber.match(/^(\d{4})(\d{2})(\d{2})(\d{4})$/)) {
		return false;
	}

	const year = parseInt(RegExp.$1);
	const month = parseInt(RegExp.$2);
	const day = parseInt(RegExp.$3);

	const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
		months[1] = 29; // leap year.
	}
	if (month < 1 || month > 12) {
		return false;
	}
	if (
		day < 1 ||
		(day > months[month - 1] && day < 61) ||
		day > months[month - 1] + 60
	) {
		return false;
	}

	securityNumber = securityNumber.substring(2, securityNumber.length);
	let check = '';
	for (let i = 0; i < securityNumber.length; i++) {
		check += (((i + 1) % 2) + 1) * securityNumber.substring(i, i + 1);
	}
	let checksum = 0;
	for (let i = 0; i < check.length; i++) {
		checksum += parseInt(check.substring(i, i + 1), 10);
	}

	return checksum % 10 === 0;
};

export default initialize;
