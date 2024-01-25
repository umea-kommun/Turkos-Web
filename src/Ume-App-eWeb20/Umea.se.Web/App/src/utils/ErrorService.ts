/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentPublicInstance } from 'vue';
import store from '../store/store';
import { appInsights } from '@/plugins/appInsights';
import Config from './Config';
import i18n from '@/plugins/i18next';
import { MutationType } from '@/models/Enums';
const { t } = i18n.global;

interface ErrorFormInfo {
	formId: string;
	formTitle: string;
	formPath: string;
	formModified: string;
}

interface ComposedError {
	message: string;
	stack?: string;
	location: string;
	vueComponentName?: string;
	vueInfo?: string;
	isAuthenticated: boolean;
	idp?: string;
}

interface OnError {
	err: any;
	log?: boolean;
	instance?: ComponentPublicInstance | null;
	info?: string | null;
	message?: string | null;
}

const isMocked = (Config.VUE_APP_MOCK_DATA || '').trim() === 'yes';
export default class ErrorService {
	/**
	 * Called when an unhandled error occurs or called manually using ErrorService.onError
	 */
	static onError({
		err,
		log = true,
		instance,
		info,
		message,
	}: OnError): void | boolean {
		console.error('Error:', err);

		let userMessage = message;
		if (!userMessage) {
			userMessage = this.getUserMessage(err);
		}

		// Update the state to display our error
		store.commit(MutationType.SetError, { error: err, userMessage });

		if (!isMocked && log) {
			// Compose and send error to Insights
			const error = this.composeError({ err, instance, info });
			if (this.trackAsException(err)) {
				this.sendError(error);
				appInsights.trackException({ error: err }, error);
			} else {
				appInsights.trackTrace(
					{ message: error.message, severityLevel: 1 },
					error
				);
			}
		}
	}

	/**
	 * Try to get the name of the component that threw the error
	 */
	private static getComponentName(instance: any): string | null {
		if (!instance) {
			return null;
		}
		if (instance.$parent === null) {
			return 'App';
		}
		if (instance?.$options.name) {
			return instance.$options.name;
		}
		return 'Anonymous';
	}

	/**
	 * Returns the active form or null in no form is active
	 */
	private static getForm(): ErrorFormInfo | null {
		if (store.state?.form) {
			const form = store.state.form;
			return {
				formId: form.id,
				formTitle: form.attributes.title,
				formPath: form.attributes.path,
				formModified: form.attributes.modified,
			};
		}
		return null;
	}

	/**
	 * Returns an object that contains information we want to send to the logger
	 */
	private static composeError({ err, instance, info }: any): ComposedError {
		let error: ComposedError = {
			message: err?.message ?? err,
			location: window.location.href,
			isAuthenticated: false,
		};
		if (err.stack) {
			error.stack = err.stack;
		}
		if (store?.state?.user?.isAuthenticated) {
			error.isAuthenticated = true;
			error.idp = store.state.user.idp;
		}

		const form = this.getForm();
		if (form) {
			error = { ...error, ...form };
		}

		const componentName = this.getComponentName(instance);
		if (componentName) {
			error.vueComponentName = componentName;
		}
		if (info) {
			error.vueInfo = info;
		}

		return error;
	}

	private static sendError(error: any): void {
		store.dispatch('sendError', { error });
	}

	private static trackAsException(err: any): boolean {
		if (err?.name == 'AxiosError') {
			return false;
		}
		return true;
	}

	/**
	 * Returns what message to display to the user depending on error type
	 */
	private static getUserMessage(err: any): string | null {
		const response = err.response;
		if (response?.status) {
			switch (response.status) {
				case 401:
					return t('app.error.401');
				case 413:
					return t('app.error.tooLargeTotalFileSize');
			}
		}
		if (err === 'Total filesize is too big') {
			return t('app.error.tooLargeTotalFileSize');
		}
		if (err.code === 'ERR_NETWORK') {
			return t('app.error.network');
		}

		// Return null to use default error message
		return null;
	}
}
