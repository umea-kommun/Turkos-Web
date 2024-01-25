import { ValidOrgNumberFormats } from '@/models/Enums';
import { IUser } from '@/models/IForm';
import ErrorService from '@/utils/ErrorService';
import moment from 'moment';
import Organisationsnummer from 'organisationsnummer';

export function getAnonymousContactInfo(): IUser {
	return {
		socialSecurityNumber: '',
		firstName: 'Anonym',
		lastName: 'Anonym',
		email: '',
		userContactInfo: {
			socialSecurityNumber: '',
			firstName: 'Anonym',
			lastName: 'Anonym',
			address: '',
			postalNumber: '',
			city: '',
			phoneNumber: '',
			email: '',
		},
	} as IUser;
}

export function getAgeToday(socialSecurityNumber: any): number {
	const year = Number(socialSecurityNumber.substring(0, 4));
	const month = Number(socialSecurityNumber.substring(4, 6));
	const day = Number(socialSecurityNumber.substring(6, 8));
	const today = new Date();
	let age = today.getFullYear() - year;
	if (
		today.getMonth() + 1 < month ||
		(today.getMonth() + 1 == month && today.getDate() < day)
	) {
		age--;
	}
	return age;
}

export function getAgeThisYear(socialSecurityNumber: any): number {
	const age =
		new Date().getFullYear() - Number(socialSecurityNumber.substring(0, 4));
	return age;
}

export function getNewAgeInXDay(socialSecurityNumber: any): number {
	const ssoMonth = socialSecurityNumber.substring(4, 6);
	const ssoDay = socialSecurityNumber.substring(6, 8);

	const today = new Date();
	let todayYear = Number(today.getFullYear());

	if (
		today.getMonth() + 1 > ssoMonth ||
		(today.getMonth() + 1 == ssoMonth && today.getDate() > ssoDay)
	) {
		todayYear++;
	}
	const nextBirthDaty = new Date(todayYear + '-' + ssoMonth + '-' + ssoDay);

	const diff = nextBirthDaty.getTime() - today.getTime();
	const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
	return isNaN(diffDays) ? 0 : diffDays;
}

function addPrefixToOrgNumber(orgNumber: string, withDash: boolean): string {
	const orgObject = Organisationsnummer.parse(orgNumber);
	if (orgNumber.length >= 12) {
		// Already has a prefix, format for the dash
		const prefix = orgNumber.substring(0, 2);
		return prefix + orgObject.format(withDash);
	} else if (!orgObject.isPersonnummer()) {
		// Is not person, add 16
		return '16' + orgObject.format(withDash);
	} else {
		// If current year (2 digits) - 16 is greater than the year, we should prefix with 20
		// Example: 23-16 = 07, if someone is born 00-07 we prefix 20, otherwise its 19
		// This is only applicable to organization number, since the legal age to start a business is 16 years.
		const currentYear = parseInt(moment().format('YY'));
		const year = parseInt(orgObject.format(false).substring(0, 2));
		if (currentYear - 16 >= year) {
			return '20' + orgObject.format(withDash);
		} else {
			return '19' + orgObject.format(withDash);
		}
	}
}
export function formatOrgNumber(
	orgNumber: string,
	format: ValidOrgNumberFormats
): string {
	if (!Organisationsnummer.valid(orgNumber)) {
		ErrorService.onError({
			err: 'Formatting output organization number failed, input is not valid.',
			log: true,
		});
		return orgNumber;
	}

	const orgObject = Organisationsnummer.parse(orgNumber);
	let newOrgNumber = orgNumber;
	switch (format) {
		case ValidOrgNumberFormats.Short:
			newOrgNumber = orgObject.format(false);
			break;
		case ValidOrgNumberFormats.ShortDash:
			newOrgNumber = orgObject.format(true);
			break;
		case ValidOrgNumberFormats.Long:
			newOrgNumber = addPrefixToOrgNumber(orgNumber, false);
			break;
		case ValidOrgNumberFormats.LongDash:
			newOrgNumber = addPrefixToOrgNumber(orgNumber, true);
			break;
	}

	if (Organisationsnummer.valid(newOrgNumber)) {
		return newOrgNumber;
	} else {
		// The formatted org number is not valid, something went wrong
		ErrorService.onError({
			err: 'Formatting output organization number failed.',
			log: true,
		});
		return orgNumber;
	}
}
