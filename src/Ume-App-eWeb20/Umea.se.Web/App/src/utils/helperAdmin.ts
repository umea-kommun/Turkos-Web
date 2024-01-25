import {
	MessageEvent,
	Medium,
	MessageTextAttribute,
	MutationType,
} from './../models/Enums';
import {
	MessageTextsVariablesForBackend,
	MessageTextsVariablesToShowFrontend,
} from '@/models/Enums';
import { IForm } from '@/models/IForm';
import { computed } from 'vue';
import store from '@/store/store';

const form = computed(() => store.state.form as IForm);

export class HelperAdmin {
	public static updateMessageTexts(
		attribute: MessageTextAttribute,
		mediumProperty: Medium,
		messageEventProperty: MessageEvent,
		value: string
	): void {
		store.commit(MutationType.UpdateMessageTexts, {
			newValue: value,
			attribute: attribute,
			mediumProperty: mediumProperty,
			messageEventProperty: messageEventProperty,
		});
	}

	public static getMessageTexts(
		attribute: MessageTextAttribute,
		medium: Medium,
		messageEvent: MessageEvent
	): string {
		let text = '';
		const messageTexts = form.value.attributes.messageTexts;
		const messageText = messageTexts?.find(
			(item) =>
				item.medium === medium && item.messageEvent === messageEvent
		);
		if (messageText) {
			text = messageText[attribute as keyof typeof messageText] as string;
		}
		return text;
	}

	public static getReplaceVariablesInMessageText = (text: string): string => {
		const replacedText = text
			.replace(
				MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus,
				MessageTextsVariablesToShowFrontend.EserviceTitleShowsOnConfirmAndNotificationAndStatus
			)
			.replace(
				MessageTextsVariablesForBackend.EserviceTitleShowsOnReminders,
				MessageTextsVariablesToShowFrontend.EserviceTitleShowsOnReminders
			)
			.replace(
				MessageTextsVariablesForBackend.EserviceTitleShowsOnExpired,
				MessageTextsVariablesToShowFrontend.EserviceTitleShowsOnExpired
			)
			.replace(
				MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
				MessageTextsVariablesToShowFrontend.FornameAndLastnameGuardian
			)
			.replace(
				MessageTextsVariablesForBackend.FornameAndLastnameGuardian,
				MessageTextsVariablesToShowFrontend.FornameAndLastnameGuardian
			)
			.replace(
				MessageTextsVariablesForBackend.FornameAndLastnameGuardian1ShowsWhenExpired,
				MessageTextsVariablesToShowFrontend.FornameAndLastnameGuardian1ShowsWhenExpired
			)
			.replace(
				MessageTextsVariablesForBackend.UrlEserviceEmail,
				MessageTextsVariablesToShowFrontend.UrlEserviceEmail
			)
			.replace(
				MessageTextsVariablesForBackend.UrlEserviceSms,
				MessageTextsVariablesToShowFrontend.UrlEserviceSms
			)
			.replace(
				MessageTextsVariablesForBackend.NumberOfDays,
				MessageTextsVariablesToShowFrontend.NumberOfDays
			);
		return replacedText;
	};

	public static setReplaceVariablesInMessageText = (text: string): string => {
		const replacedText = text
			.replace(
				MessageTextsVariablesToShowFrontend.EserviceTitleShowsOnConfirmAndNotificationAndStatus,
				MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus
			)
			.replace(
				MessageTextsVariablesToShowFrontend.EserviceTitleShowsOnReminders,
				MessageTextsVariablesForBackend.EserviceTitleShowsOnReminders
			)
			.replace(
				MessageTextsVariablesToShowFrontend.EserviceTitleShowsOnExpired,
				MessageTextsVariablesForBackend.EserviceTitleShowsOnExpired
			)
			.replace(
				MessageTextsVariablesToShowFrontend.FornameAndLastnameGuardian,
				MessageTextsVariablesForBackend.FornameAndLastnameGuardian
			)
			.replace(
				MessageTextsVariablesToShowFrontend.FornameAndLastnameGuardian,
				MessageTextsVariablesForBackend.FornameAndLastnameGuardian
			)
			.replace(
				MessageTextsVariablesToShowFrontend.FornameAndLastnameGuardian1ShowsWhenExpired,
				MessageTextsVariablesForBackend.FornameAndLastnameGuardian1ShowsWhenExpired
			)
			.replace(
				MessageTextsVariablesToShowFrontend.UrlEserviceEmail,
				MessageTextsVariablesForBackend.UrlEserviceEmail
			)
			.replace(
				MessageTextsVariablesToShowFrontend.UrlEserviceSms,
				MessageTextsVariablesForBackend.UrlEserviceSms
			)
			.replace(
				MessageTextsVariablesToShowFrontend.NumberOfDays,
				MessageTextsVariablesForBackend.NumberOfDays
			);
		return replacedText;
	};

	public static getReplaceLineBreakInSMSMessageText = (
		text: string
	): string => {
		const replacedText = text.replace(/&#xA;/g, '\n');
		return replacedText;
	};

	public static setReplaceLineBreakInSMSMessageText = (
		text: string
	): string => {
		const replacedText = text.replace(/\n/g, '&#xA;');
		return replacedText;
	};
}
