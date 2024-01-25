// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck FIX THIS - remove this comment
import { IBanner, ICategory, IComment } from '@/models/IForm';
import {
	MutationType,
	FormStatus,
	ErrorCode,
	FormType,
	TemplateType,
} from '@/models/Enums';
import { Helper } from '@/utils/helper';
import {
	IFormStep,
	IFormIntegration,
	IPondFile,
	IForm,
	IPm3,
	IReceiver,
	IGdpr,
	ILifeSituation,
	ITemplate,
	IFormMessage,
} from '@/models/IForm';
import Axios from 'axios';
import { findStepIndex, sleep } from '@/store/utils';
import setupMock from '@/store/mock';
import Config from '@/utils/Config';
import i18next from '@/plugins/i18next';
import { getAnonymousContactInfo } from '@/store/helper';

// Mock backend used to fetch form data
const mockedAxios = Axios.create();
setupMock(mockedAxios);
const isMocked = (Config.VUE_APP_MOCK_DATA || '').trim() === 'yes';

export default {
	async getGdprList(context) {
		if (context.state.gdpr === null) {
			let response;
			if (isMocked) {
				response = await mockedAxios.get('/gdpr');
			} else {
				response = await Axios.get(Config.VUE_APP_GDPR_API_ROUTE);
			}
			context.commit(MutationType.GetGdpr, response.data.gdpr);
		}
	},

	async createGdpr(context, payload: { gdpr: IGdpr }) {
		if (isMocked) {
			context.commit(MutationType.UpdateGdpr, payload.gdpr);
			return;
		}
		try {
			const response = await Axios.post(
				Config.VUE_APP_GDPR_API_ROUTE,
				JSON.stringify(payload.gdpr),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.UpdateGdpr, response.data.gdpr);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async updateGdpr(context, payload: { gdpr: IGdpr }) {
		if (isMocked) {
			context.commit(MutationType.UpdateGdpr, payload.gdpr);
			return;
		}
		try {
			const response = await Axios.patch(
				Config.VUE_APP_GDPR_API_ROUTE + '/' + payload.gdpr.id,
				JSON.stringify(payload.gdpr),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.UpdateGdpr, response.data.gdpr);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async deleteGdpr(context, payload: { gdpr: IGdpr }) {
		if (isMocked) {
			context.commit(MutationType.DeleteGdpr, payload.gdpr);
			return;
		}
		try {
			const response = await Axios.delete(
				Config.VUE_APP_GDPR_API_ROUTE + '/' + payload.gdpr.id,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.DeleteGdpr, payload.gdpr);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async getValidationRuleTypes(context) {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/validationruletypes');
		} else {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			response = await retryRequests(() =>
				Axios.get(Config.VUE_APP_VALIDATIONRULETYPES_API_ROUTE)
			);
		}
		context.commit(
			'getValidationRuleTypes',
			response.data.validationRuleTypes
		);
	},
	async getForms(context) {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/forms');
		} else {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			response = await retryRequests(() =>
				Axios.get(Config.VUE_APP_FORM_API_ROUTE)
			);
		}
		context.commit(
			MutationType.GetForms,
			response.data.forms.map((f) => f.data)
		);
	},
	async getInitialFormGroups(context, { group, limit }) {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/forms'); // TODO: implement this
		} else {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			response = await retryRequests(() =>
				Axios.get(
					Config.VUE_APP_FORM_API_ROUTE +
						'/group/?group=' +
						group +
						'&limit=' +
						limit
				)
			);
		}
		context.commit(MutationType.GetInitialFormGroups, {
			forms: response.data.forms.map((f) => f.data),
			groups: response.data.groups,
		});
	},
	async getPublishedForms(context) {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/forms');
		} else {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			response = await retryRequests(() =>
				Axios.get(
					Config.VUE_APP_FORM_API_ROUTE +
						'/?statusFilter=published&includeHidden=false'
				)
			);
		}
		context.commit(
			MutationType.GetForms,
			response.data.forms.map((f) => f.data)
		);
	},
	async getPm3List(context) {
		if (context.state.pm3 === null) {
			if (isMocked) {
				const response = await mockedAxios.get('/pm3');
				context.commit(MutationType.GetPm3, response.data.pm3);
			} else {
				const response = await Axios.get(Config.VUE_APP_PM3_API_ROUTE);
				context.commit(MutationType.GetPm3, response.data.pm3);
			}
		}
	},
	async createPm3(context, payload: { pm3: IPm3 }) {
		if (isMocked) {
			context.commit(MutationType.UpdatePm3, payload.pm3);
			return;
		}
		try {
			const response = await Axios.post(
				Config.VUE_APP_PM3_API_ROUTE,
				JSON.stringify(payload.pm3),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.UpdatePm3, response.data.pm3);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async updatePm3(context, payload: { pm3: IPm3 }) {
		if (isMocked) {
			context.commit(MutationType.UpdatePm3, payload.pm3);
			return;
		}
		try {
			const response = await Axios.patch(
				Config.VUE_APP_PM3_API_ROUTE + '/' + payload.pm3.id,
				JSON.stringify(payload.pm3),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.UpdatePm3, response.data.pm3);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async deletePm3(context, payload: { pm3: IPm3 }) {
		if (isMocked) {
			context.commit(MutationType.DeletePm3, payload.pm3);
			return;
		}
		try {
			const response = await Axios.delete(
				Config.VUE_APP_PM3_API_ROUTE + '/' + payload.pm3.id,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.DeletePm3, payload.pm3);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async getLifeSituationList(context) {
		if (context.state.lifeSituations === null) {
			let response;
			if (isMocked) {
				response = await mockedAxios.get('/lifeSituations');
				context.commit(
					MutationType.GetLifeSituation,
					response.data.lifeSituations
				);
			} else {
				const response = await Axios.get(
					Config.VUE_APP_LIFESITUATION_API_ROUTE
				);
				context.commit(
					MutationType.GetLifeSituation,
					response.data.lifeSituations
				);
			}
		}
	},
	async createLifeSituation(
		context,
		payload: { lifeSituations: ILifeSituation }
	) {
		if (isMocked) {
			context.commit(
				MutationType.UpdateLifeSituation,
				payload.lifeSituations
			);
			return;
		}
		try {
			const response = await Axios.post(
				Config.VUE_APP_LIFESITUATION_API_ROUTE,
				JSON.stringify(payload.lifeSituations),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(
				MutationType.UpdateLifeSituation,
				response.data.lifeSituations
			);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async updateLifeSituation(
		context,
		payload: { lifeSituations: ILifeSituation }
	) {
		if (isMocked) {
			context.commit(
				MutationType.UpdateLifeSituation,
				payload.lifeSituations
			);
			return;
		}
		try {
			const response = await Axios.patch(
				Config.VUE_APP_LIFESITUATION_API_ROUTE +
					'/' +
					payload.lifeSituations.id,
				JSON.stringify(payload.lifeSituations),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(
				MutationType.UpdateLifeSituation,
				response.data.lifeSituations
			);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async deleteLifeSituation(
		context,
		payload: { lifeSituations: ILifeSituation }
	) {
		if (isMocked) {
			context.commit(
				MutationType.DeleteLifeSituation,
				payload.lifeSituations
			);
			return;
		}
		try {
			const response = await Axios.delete(
				Config.VUE_APP_LIFESITUATION_API_ROUTE +
					'/' +
					payload.lifeSituations.id,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(
				MutationType.DeleteLifeSituation,
				payload.lifeSituations
			);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},

	async getCategoryList(context) {
		if (context.state.categories === null) {
			if (isMocked) {
				const response = await mockedAxios.get('/categories');
				context.commit(
					MutationType.GetCategories,
					response.data.categories
				);
			} else {
				const response = await Axios.get(
					Config.VUE_APP_CATEGORY_API_ROUTE
				);
				context.commit(
					MutationType.GetCategories,
					response.data.categories
				);
			}
		}
	},
	async createCategory(context, payload: { category: ICategory }) {
		if (isMocked) {
			context.commit(MutationType.UpdateCategory, payload.category);
			return;
		}
		try {
			const response = await Axios.post(
				Config.VUE_APP_CATEGORY_API_ROUTE,
				JSON.stringify(payload.category),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.UpdateCategory, response.data.category);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async updateCategory(context, payload: { category: ICategory }) {
		if (isMocked) {
			context.commit(MutationType.UpdateCategory, payload.category);
			return;
		}
		try {
			const response = await Axios.patch(
				Config.VUE_APP_CATEGORY_API_ROUTE + '/' + payload.category.id,
				JSON.stringify(payload.category),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.UpdateCategory, response.data.category);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async deleteCategory(context, payload: { category: ICategory }) {
		if (isMocked) {
			context.commit(MutationType.DeleteCategory, payload.category);
			return;
		}
		try {
			const response = await Axios.delete(
				Config.VUE_APP_CATEGORY_API_ROUTE + '/' + payload.category.id,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.DeleteCategory, payload.category);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},

	async getReceiverList(context) {
		if (context.state.receivers === null) {
			let response;
			if (isMocked) {
				response = await mockedAxios.get('/receivers');
			} else {
				response = await Axios.get(Config.VUE_APP_RECEIVER_API_ROUTE);
			}
			context.commit(MutationType.GetReceivers, response.data.receivers);
		}
	},

	async createReceiver(context, payload: { receiver: IReceiver }) {
		if (isMocked) {
			payload.receiver.id = Helper.generateTempIdInteger();
			context.commit(MutationType.UpdatedReceiver, payload.receiver);
		} else {
			try {
				const response = await Axios.post(
					Config.VUE_APP_RECEIVER_API_ROUTE,
					JSON.stringify(payload.receiver),
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + context.state.user.token,
						},
					}
				);
				context.commit(
					MutationType.UpdatedReceiver,
					response.data.receiver
				);
			} catch (err) {
				if (
					err.response &&
					err.response.data &&
					err.response.data.errorCode
				) {
					throw err.response.data.errorCode;
				}
				throw err;
			}
		}
	},
	async updateReceiver(context, payload: { receiver: IReceiver }) {
		if (isMocked) {
			context.commit(MutationType.UpdatedReceiver, payload.receiver);
		} else {
			try {
				const response = await Axios.patch(
					Config.VUE_APP_RECEIVER_API_ROUTE +
						'/' +
						payload.receiver.id,
					JSON.stringify(payload.receiver),
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + context.state.user.token,
						},
					}
				);
				context.commit(
					MutationType.UpdatedReceiver,
					response.data.receiver
				);
			} catch (err) {
				if (
					err.response &&
					err.response.data &&
					err.response.data.errorCode
				) {
					throw err.response.data.errorCode;
				}
				throw err;
			}
		}
	},
	async deleteReceiver(context, payload: { receiver: IReceiver }) {
		if (isMocked) {
			context.commit(MutationType.DeleteReceiver, payload.receiver);
		} else {
			try {
				const response = await Axios.delete(
					Config.VUE_APP_RECEIVER_API_ROUTE +
						'/' +
						payload.receiver.id,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + context.state.user.token,
						},
					}
				);
				context.commit(MutationType.DeleteReceiver, payload.receiver);
			} catch (err) {
				if (
					err.response &&
					err.response.data &&
					err.response.data.errorCode
				) {
					throw err.response.data.errorCode;
				}
				throw err;
			}
		}
	},
	async getTemplateList(context) {
		if (context.state.templates === null) {
			let response;
			if (isMocked) {
				response = await mockedAxios.get('/templates');
			} else {
				response = await Axios.get(Config.VUE_APP_TEMPLATE_API_ROUTE);
			}
			context.commit(MutationType.GetTemplates, response.data.templates);
		}
	},
	async getEcosCaseRoles() {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/caseroles');
		} else {
			response = await Axios.get(
				Config.VUE_APP_DATA_SERVICE_ECOS + '/caseroles'
			);
		}
		return response.data.caseRoles;
	},
	async getEcosAddressTypes() {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/addresstypes');
		} else {
			response = await Axios.get(
				Config.VUE_APP_DATA_SERVICE_ECOS + '/addresstypes'
			);
		}
		return response.data.addressTypes;
	},
	async getEcosOccurrenceTypes() {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/occurrencetypes');
		} else {
			response = await Axios.get(
				Config.VUE_APP_DATA_SERVICE_ECOS + '/occurrencetypes'
			);
		}
		return response.data.occurrenceTypes;
	},
	async getEcosNotificationTypes() {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/notificationtypes');
		} else {
			response = await Axios.get(
				Config.VUE_APP_DATA_SERVICE_ECOS + '/notificationtypes'
			);
		}
		return response.data.notificationTypes;
	},
	async getEcosProcessTypes() {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/processtypes');
		} else {
			response = await Axios.get(
				Config.VUE_APP_DATA_SERVICE_ECOS + '/processtypes'
			);
		}
		return response.data.processTypes;
	},
	async getEcosDocumentTypes() {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/documenttypes');
		} else {
			response = await Axios.get(
				Config.VUE_APP_DATA_SERVICE_ECOS + '/documenttypes'
			);
		}
		return response.data.documentTypes;
	},
	async getEcosDiaryPlans() {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/diaryplans');
		} else {
			response = await Axios.get(
				Config.VUE_APP_DATA_SERVICE_ECOS + '/diaryplans'
			);
		}
		return response.data.diaryPlans;
	},
	async getEcosHandlingOfficerGroups() {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/handlingofficergroups');
		} else {
			response = await Axios.get(
				Config.VUE_APP_DATA_SERVICE_ECOS + '/handlingofficergroups'
			);
		}
		return response.data.handlingOfficerGroups;
	},
	async getEcosList(context) {
		if (context.state.ecos === null) {
			let response;
			if (isMocked) {
				response = await mockedAxios.get(
					'/template-by-type/' + TemplateType.Ecos.toString()
				);
				context.commit(MutationType.GetEcos, response.data.templates);
			} else {
				response = await Axios.get(
					Config.VUE_APP_TEMPLATE_API_ROUTE +
						'/type/' +
						TemplateType.Ecos.toString()
				);
			}
			context.commit(MutationType.GetEcos, response.data.templates);
		}
	},
	async getTemplatesConnectedToEServices() {
		let response;
		if (isMocked) {
			response = await mockedAxios.get('/templatesConnectedToEServices');
		} else {
			response = await Axios.get(
				Config.VUE_APP_FORM_API_ROUTE + '/templatesConnectedToEServices'
			);
		}
		return response.data.templatesConnectedToEServices;
	},
	async createEcos(context, payload: { ecos: ITemplate }) {
		if (isMocked) {
			const json = JSON.stringify(payload.ecos);
			const response = await mockedAxios.post('/new-template', json);
			context.commit(MutationType.UpdateEcos, response.data.template);
			context.commit(MutationType.UpdateTemplate, response.data.template);
			return;
		}
		try {
			const response = await Axios.post(
				Config.VUE_APP_TEMPLATE_API_ROUTE,
				JSON.stringify(payload.ecos),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.UpdateEcos, response.data.template);
			context.commit(MutationType.UpdateTemplate, response.data.template);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async updateEcos(context, payload: { ecos: ITemplate }) {
		if (isMocked) {
			const json = JSON.stringify(payload.ecos);
			const response = await mockedAxios.post('/update-template', json);
			context.commit(MutationType.UpdateEcos, response.data.template);
			context.commit(MutationType.UpdateTemplate, response.data.template);
			return;
		}
		try {
			const response = await Axios.patch(
				Config.VUE_APP_TEMPLATE_API_ROUTE + '/' + payload.ecos.id,
				JSON.stringify(payload.ecos),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.UpdateEcos, response.data.template);
			context.commit(MutationType.UpdateTemplate, response.data.template);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async deleteEcos(context, payload: { ecos: ITemplate }) {
		if (isMocked) {
			const response = await mockedAxios.get(
				'/delete-template-by-id/' + payload.ecos.id
			);
			context.commit(MutationType.DeleteEcos, payload.ecos);
			context.commit(MutationType.DeleteTemplate, payload.ecos);
			return;
		}
		try {
			const response = await Axios.delete(
				Config.VUE_APP_TEMPLATE_API_ROUTE + '/' + payload.ecos.id,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.DeleteEcos, payload.ecos);
			context.commit(MutationType.DeleteTemplate, payload.ecos);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},

	async createForm(context, payload: { formType: FormType }) {
		if (!context.getters.isLoggedInAdmin) {
			throw new Error(
				'Trying to create form but is not logged in as admin'
			);
		}
		const form = { attributes: { type: payload.formType } } as IForm;

		// Add unique path
		form.attributes.path =
			'form-' +
			new Date().toISOString().replace(/ /g, '').replace(/\./g, '');

		// Add default integration
		form.attributes.integrations = [
			{
				id: 0,
				type: 'EmailNotification',
				options: [
					{
						key: 'title',
						value: i18next.global.tc(
							'component.adminIntegrationEmailNotification.name'
						),
					},
				],
			} as IFormIntegration,
		];

		// Create empty first step
		const step = {} as IFormStep;
		step.fields = [];
		step.title = 'Steg...';
		step.sortIndex = 0;
		form.attributes.steps = [step];

		if (payload.formType === FormType.InfoPage) {
			form.attributes.hidden = true;
		}

		// Send form to server
		const json = JSON.stringify(form);
		let response;
		if (isMocked) {
			response = await mockedAxios.post('/new-form', json);
		} else {
			response = await Axios.post(Config.VUE_APP_FORM_API_ROUTE, json, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + context.state.user.token,
				},
			});
		}
		return response.data.form.id;
	},
	async updateForm(context) {
		if (!context.getters.isLoggedInAdmin) {
			throw new Error(
				'Trying to update form but is not logged in as admin'
			);
		}
		if (!context.state.form) {
			throw new Error(
				'Trying to update form, but no form is present in state'
			);
		}
		// Update sort index
		const formData = Helper.deepCopy(context.state.form) as IForm;
		formData.attributes.steps.forEach((step) => {
			let i = 1;
			(step.fields || []).forEach((field) => {
				field.sortIndex = i++;
			});
		});
		if (Object.keys(formData.attributes.pM3).length === 0) {
			formData.attributes.pM3 = null;
		}
		if (
			!formData.attributes.receiver ||
			!Object.keys(formData.attributes.receiver).length
		) {
			formData.attributes.receiver = null;
		}
		let response;
		if (isMocked) {
			response = await mockedAxios.post(
				'/update-form/' + context.state.form.id,
				JSON.stringify(formData)
			);
			context.commit(MutationType.GetForm, response.data.form.data);
		} else {
			try {
				// Try to update comments without overwriting possible changes made by another admin/browser
				if (
					context.state.lastCommentAddedDate ||
					formData.attributes.comments.length > 0
				) {
					// We have added or removed comments, lets fetch the comments currently saved to database
					// and merge the two lists of comments
					response = await Axios.get(
						Config.VUE_APP_FORM_API_ROUTE + '/' + formData.id
					);
					// eslint-disable-next-line @typescript-eslint/no-use-before-define
					const mergedComments = mergeComments(
						response.data.form.data.attributes.comments || [],
						formData.attributes.comments || [],
						context.state.lastCommentAddedDate
					);
					formData.attributes.comments = mergedComments;
				}
				const json = JSON.stringify(formData);
				response = await Axios.patch(
					Config.VUE_APP_FORM_API_ROUTE + '/' + context.state.form.id,
					json,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + context.state.user.token,
						},
					}
				);
				context.commit(MutationType.GetForm, response.data.form.data);
			} catch (err) {
				if (
					err.response &&
					err.response.data &&
					err.response.data.errorCode
				) {
					throw err.response.data.errorCode;
				}
				throw err;
			}
		}
	},
	/**
	 * Alias of getForm, that should be used when form data will be displayed
	 * to a "public" user
	 */
	async getPublicForm(context, { id }) {
		await context.dispatch('getForm', {
			id,
			commitMessage: 'getPublicForm',
		});
	},
	async getForm(context, { id, commitMessage }) {
		// Do not reload form state if user has this particular form in the store already
		if (
			!context.state.form ||
			(context.state.form.id !== null && context.state.form.id !== id)
		) {
			let response;
			if (isMocked) {
				response = await mockedAxios.get('/forms/' + id);
			} else {
				response = await Axios.get(
					Config.VUE_APP_FORM_API_ROUTE + '/' + id
				);
			}
			context.commit(commitMessage || 'getForm', response.data.form.data);
		}
	},
	/**
	 * Alias of getFormByPath, that should be used when form data will be displayed
	 * to a "public" user
	 */
	async getPublicFormByPath(context, { path }) {
		await context.dispatch('getFormByPath', {
			path,
			commitMessage: 'getPublicForm',
		});
	},
	async getFormByPath(context, { path, commitMessage }) {
		if (isMocked) {
			if (
				!context.state.form ||
				(context.state.form.id !== null &&
					context.state.form.id !== path)
			) {
				const response = await mockedAxios.get('/form-by-path/' + path);
				context.commit(
					commitMessage || 'getForm',
					response.data.form.data
				);
			}
		} else {
			const url =
				Config.VUE_APP_FORM_API_ROUTE +
				'/?pathFilter=' +
				encodeURIComponent(path);

			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			const response = await retryRequests(() => Axios.get(url));
			if (
				response.status !== 200 ||
				!response.data.forms ||
				!(response.data.forms instanceof Array)
			) {
				throw new Error(
					'Unexpected response from server when trying to fetch list of forms filtered on path'
				);
			} else if ((response.data as any).forms.length === 0) {
				throw new Error(ErrorCode.FormNotFound);
			} else {
				// Do not reload form state if user has this particular form in the store already
				if (
					!context.state.form ||
					context.state.form.attributes.path !== path ||
					!context.state.form.completeForm
				) {
					const form = (response.data as any).forms[0].data as IForm;
					if (form.attributes.status !== FormStatus.Published) {
						throw new Error(ErrorCode.FormNotPublished);
					}
					context.commit(commitMessage || 'getForm', form);
				}
			}
		}
	},
	async getPublicFormInfoByPath(context, { path }) {
		await context.dispatch('getFormInfoByPath', {
			path,
			commitMessage: 'getPublicFormInfo',
		});
	},
	async getFormInfoByPath(context, { path, commitMessage }) {
		if (isMocked) {
			if (
				!context.state.form ||
				(context.state.form.id !== null &&
					context.state.form.id !== path)
			) {
				const response = await mockedAxios.get(
					'/form-info-by-path/' + path
				);
				if (!(response?.data as any)?.form) {
					throw new Error(ErrorCode.FormNotFound);
				}
				response.data.form.data.completeForm = false;
				context.commit(
					commitMessage || 'getForm',
					response.data.form.data
				);
			}
		} else {
			const url =
				Config.VUE_APP_FORM_API_ROUTE +
				'/path/' +
				encodeURIComponent(path) +
				'?onlyInfo=true';

			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			const response = await retryRequests(() => Axios.get(url));
			if (response.status !== 200 || !response.data.form) {
				throw new Error(
					'Unexpected response from server when trying to fetch form by path'
				);
			} else if (!(response.data as any).form) {
				throw new Error(ErrorCode.FormNotFound);
			} else {
				// Do not reload form state if user has this particular form in the store already
				if (
					!context.state.form ||
					context.state.form.attributes.path !== path
				) {
					const form = (response.data as any).form.data as IForm;
					if (form.attributes.status !== FormStatus.Published) {
						throw new Error(ErrorCode.FormNotPublished);
					}
					form.completeForm = false;
					context.commit(commitMessage || 'getForm', form);
				}
			}
		}
	},
	async formPathExists(context, { path, exceptId }) {
		if (isMocked) {
			return false;
		} else {
			const url =
				Config.VUE_APP_FORM_API_ROUTE +
				'/path/' +
				encodeURIComponent(path) +
				'?onlyInfo=true';

			try {
				const response = await Axios.get(url);
				if (response.status === 200) {
					if (exceptId && exceptId == response.data?.form?.id) {
						return false;
					}
					return true;
				}
				return false;
			} catch (e) {
				return false;
			}
		}
	},
	async getIntegrationData(context, { id, serviceUrl }) {
		if (!context.state.form) {
			throw new Error(
				'Trying to update value when no form is present in the state store'
			);
		}
		const stepIndex = findStepIndex(context.state.form, id);
		const response = await mockedAxios.get(serviceUrl);
		if (response.data.data) {
			context.commit(MutationType.ApplyIntegrationData, {
				data: response.data.data,
				stepIndex,
				id,
			});
		} else {
			throw new Error(response.data.console.error.title);
		}
	},
	async getPdf(
		context,
		{ form, userContactInfo, availableMetaDataLista, downloadPdf }
	): Promise<Blob> {
		if (isMocked) {
			return new Blob();
		} else {
			const json = JSON.stringify({
				form,
				userContactInfo,
				availableMetaDataLista,
				downloadPdf,
			});

			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			const response = await retryRequests(() => {
				return Axios.post(
					Config.VUE_APP_FORM_API_ROUTE + '/pdf',
					json,
					{
						headers: {
							'Content-Type': 'application/json',
							Accept: 'application/pdf',
						},
						responseType: 'blob',
					}
				);
			});
			return response.data;
		}
	},
	async rateEService(context, { form, MtCaptchaToken, score, userComment }) {
		if (isMocked) {
			return;
		}
		let anonymous = '';
		let userContactInfo = context.state.user.userContactInfo;
		if (MtCaptchaToken) {
			userContactInfo = getAnonymousContactInfo().userContactInfo;
			anonymous = '/anonymous';
		}

		const formRate = {
			rateScore: score,
			form,
			userContactInfo,
			userComment,
		};

		const headers = {
			'Content-Type': 'application/json',
		} as any;
		if (!MtCaptchaToken) {
			headers.Authorization = 'Bearer ' + context.state.user.token;
		} else {
			headers['X-Mtcaptcha-Token'] = MtCaptchaToken;
		}

		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		await retryRequests(() => {
			return Axios.post(
				Config.VUE_APP_SEND_RATE_API_URL + anonymous,
				formRate,
				{ headers }
			);
		});
	},
	async archiveEService(context, { formId }) {
		// delete form
		if (!isMocked) {
			await Axios.delete(Config.VUE_APP_FORM_API_ROUTE + '/' + formId, {
				headers: {
					Authorization: 'Bearer ' + context.state.user.token,
				},
			});
		}
		context.commit(MutationType.RemoveForm, { formId });
	},
	async cloneEService(context, { formId }) {
		// clone form
		if (!context.getters.isLoggedInAdmin) {
			throw new Error(
				'Trying to create form but is not logged in as admin'
			);
		}

		let response;
		if (isMocked) {
			response = await mockedAxios.post('/clone-form/', formId);
		} else {
			response = await Axios.post(
				Config.VUE_APP_FORM_API_ROUTE + '/clone/' + formId,
				null,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
		}
		context.commit(MutationType.UpdateForm, {
			form: response.data.form.data,
		});
		return response.data.form.id;
	},
	async sendFormToTestIntegrations(context, { blob }) {
		const apiUrl = Config.VUE_APP_TEST_SEND_FORM_API_URL;
		if (!apiUrl && !isMocked) {
			throw new Error(
				'Config parameter VUE_APP_TEST_SEND_FORM_API_URL not declared'
			);
		}
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		return await sendFormToServer(context, apiUrl, blob);
	},
	async sendForm(context, { blob, reviewMethod }) {
		const apiUrl = Config.VUE_APP_SEND_FORM_API_URL;
		if (!apiUrl && !isMocked) {
			throw new Error(
				'Config parameter VUE_SEND_FORM_API_URL not declared'
			);
		}
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		return await sendFormToServer(
			context,
			apiUrl,
			blob,
			undefined,
			reviewMethod
		);
	},
	async sendFormAnonymous(context, { blob, MtCaptchaToken }) {
		const apiUrl = Config.VUE_APP_SEND_ANONYMOUS_FORM_API_URL;
		if (!apiUrl && !isMocked) {
			throw new Error(
				'Config parameter VUE_APP_SEND_ANONYMOUS_FORM_API_URL not declared'
			);
		}
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		return await sendFormToServer(context, apiUrl, blob, MtCaptchaToken);
	},

	async sendError(context, { error }) {
		if (isMocked) {
			return;
		}
		if (!context.state.user?.token) {
			// Remove this when we can send unauthenticated errors
			return;
		}

		try {
			await Axios.post(
				Config.VUE_APP_SEND_ERROR_API_URL,
				JSON.stringify(error),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
		} catch (err: AxiosError) {
			return;
		}
	},

	async sendErrorOld(context, { error, MtCaptchaToken }) {
		if (isMocked) {
			return;
		}
		let userContactInfo = context.state.user.userContactInfo;
		if (!userContactInfo) {
			userContactInfo = getAnonymousContactInfo().userContactInfo;
		}
		const form = new FormData();
		const formMessage = {
			form: Helper.deepCopy(context.state.form),
			userContactInfo,
			id: '',
		} as IFormMessage;
		// Add formMessage as json file
		const uploadIndex = 1;
		const jsonFile = new Blob([JSON.stringify(formMessage)], {
			type: 'application/vnd.umeakommun.basicUseformmessage+json',
		});
		form.append('upload' + uploadIndex, jsonFile, 'form.json');
		const response = await Axios.post(
			Config.VUE_APP_SEND_ERROR_API_URL + '/' + error,
			form,
			{
				headers: {
					'Content-Type': 'application/json',
					'X-Mtcaptcha-Token': MtCaptchaToken,
				},
			}
		);
		if (!response.data || response.data.id !== 'form-result') {
			throw new Error('Got unexpected json from server');
		}
	},

	async getMultipleSigning(context, { guid, id }) {
		if (isMocked) {
			const response = await mockedAxios.get('/multiSigning');
			context.commit(MutationType.GetMultipleSigning, {
				formData: response.data.multiSigning.data,
				formGuid: guid,
				contactId: id,
			});
		} else {
			const response = await Axios.get(
				Config.VUE_APP_DATA_SERVICE_MULTISIGNING +
					'?guid=' +
					guid +
					'&contactId=' +
					id,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			if (
				response.data.multiSigning.status > 1 ||
				!response.data.multiSigning.data ||
				response.data.multiSigning.data === ''
			) {
				context.commit(MutationType.GetMultipleSigningParameters, {
					isCancelled: response.data.multiSigning.status === 2,
					isSigned: response.data.multiSigning.status === 3,
					hasExpired: response.data.multiSigning.status === 4,
					wrongUser:
						!response.data.multiSigning.data ||
						response.data.multiSigning.data === '',
				});
			} else {
				context.commit(MutationType.GetMultipleSigning, {
					formData: response.data.multiSigning.data,
					formGuid: guid,
					contactId: id,
				});
			}
		}
	},
	async getBannerList(context) {
		if (!context.state.banner) {
			let response;
			if (isMocked) {
				response = await mockedAxios.get('/banner');
			} else {
				response = await Axios.get(Config.VUE_APP_BANNER_API_ROUTE);
			}
			context.commit(MutationType.GetBanner, response.data.banners);
		}
	},

	async createBanner(context, payload: { banner: IBanner }) {
		if (isMocked) {
			context.commit(MutationType.UpdateBanner, payload.banner);
			return;
		}
		try {
			const response = await Axios.post(
				Config.VUE_APP_BANNER_API_ROUTE,
				JSON.stringify(payload.banner),
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
			context.commit(MutationType.UpdateBanner, response.data.banner);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async updateBanner(context, payload: { banner: IBanner }) {
		try {
			let response;
			if (isMocked) {
				response = await mockedAxios.patch(
					'/banner/' + payload.banner.id,
					JSON.stringify(payload.banner)
				);
			} else {
				response = await Axios.patch(
					Config.VUE_APP_BANNER_API_ROUTE + '/' + payload.banner.id,
					JSON.stringify(payload.banner),
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + context.state.user.token,
						},
					}
				);
			}

			context.commit(MutationType.UpdateBanner, response.data.banner);
		} catch (err) {
			if (
				err.response &&
				err.response.data &&
				err.response.data.errorCode
			) {
				throw err.response.data.errorCode;
			}
			throw err;
		}
	},
	async createSharePointSite(context, { siteTitle, userEmail }) {
		const type = 'site';
		const apiUrl = Config.VUE_APP_CREATE_SHAREPOINT_SITE_URL;
		if (!apiUrl && !isMocked) {
			throw new Error(
				'Config parameter VUE_APP_CREATE_SHAREPOINT_SITE_URL not declared'
			);
		}

		const siteInfo = {
			siteTitle,
			userEmail,
			type,
		};

		//eslint-disable-next-line @typescript-eslint/no-use-before-define
		await retryRequests(() => {
			return Axios.post(apiUrl, siteInfo, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + context.state.user.token,
				},
			});
		});
	},
	async createSharePointListForSite(context, { siteUrl, listTitle }) {
		const type = 'list';
		const apiUrl = Config.VUE_APP_CREATE_SHAREPOINT_LIST_FOR_SITE_URL;
		if (!apiUrl && !isMocked) {
			throw new Error(
				'Config parameter VUE_APP_CREATE_SHAREPOINT_LIST_FOR_SITE_URL not declared'
			);
		}

		const listInfo = {
			listTitle,
			siteUrl,
			type,
		};

		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		await retryRequests(() => {
			return Axios.post(apiUrl, listInfo, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + context.state.user.token,
				},
			});
		});
	},
	async adminUploadFile(context, { blobUri, file, formId, stepId, fieldId }) {
		const formData = new FormData();
		formData.append('upload', file);
		formData.append(
			'imageMetaData',
			JSON.stringify({
				formId,
				stepId,
				fieldId,
			})
		);

		let response;
		if (isMocked) {
			response = await mockedAxios.post('/admin-upload-file', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		} else {
			response = await Axios.post(
				Config.VUE_APP_FILE_UPLOAD_API_URL,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: 'Bearer ' + context.state.user.token,
					},
				}
			);
		}
		const reference = response?.data?.reference;
		if (reference) {
			const imageUrl = Config.VUE_APP_FILE_GET_PATH_URL + reference;
			context.commit(MutationType.FormReplaceBlobUriWithSource, {
				blobUri,
				imageUrl,
			});
		}
	},
	async adminRemoveFile(context, { reference }) {
		if (isMocked) {
			await mockedAxios.post('/admin-remove-file', reference);
		} else {
			await Axios.delete(Config.VUE_APP_FILE_REMOVE_API_URL + reference, {
				headers: {
					Authorization: 'Bearer ' + context.state.user.token,
				},
			});
		}
	},
};
const sendFormToServer = async (
	context,
	apiUrl,
	formPdfBlob,
	MtCaptchaToken?,
	reviewMethod?
): Promise<any> => {
	if (isMocked) {
		context.commit(MutationType.FormSent, {});
		return;
	}

	const form = new FormData();
	let uploadIndex = 1;
	let userContactInfo = context.state.user.userContactInfo;
	if (!userContactInfo) {
		userContactInfo = getAnonymousContactInfo().userContactInfo;
	}
	const formMessage = {
		form: Helper.deepCopy(context.state.form),
		userContactInfo,
		id: Helper.generateUuid(),
		messageDispatcherMethod: reviewMethod,
		multipleSigningByLink: context.state.multipleSigningByLink
			? Helper.deepCopy(context.state.multipleSigningByLink)
			: null,
	} as IFormMessage;
	// Add formMessage as json file
	const jsonFile = new Blob([JSON.stringify(formMessage)], {
		type: 'application/vnd.umeakommun.basicUseformmessage+json',
	});
	form.append('upload' + uploadIndex, jsonFile, 'form.json');

	// Append pdf-blob
	uploadIndex++;
	form.append(
		'upload' + uploadIndex,
		formPdfBlob,
		formMessage.form.attributes.title + '.pdf'
	);

	// Append files to be uploaded
	context.state.form.attributes.steps.forEach((step) => {
		(step as IFormStep).fields.forEach((field: any) => {
			(field.files || []).forEach((element: IPondFile) => {
				if (element && element.file) {
					uploadIndex++;
					form.append('upload' + uploadIndex, element.file);
				}
			});
		});
	});

	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	const response = await retryRequests(() => {
		const headers = {
			'Content-Type': 'multipart/form-data',
		} as any;
		if (!MtCaptchaToken) {
			headers.Authorization = 'Bearer ' + context.state.user.token;
		} else {
			headers['X-Mtcaptcha-Token'] = MtCaptchaToken;
		}
		return Axios.post(apiUrl, form, { headers });
	});

	if (!response.data || response.data.id !== 'form-result') {
		throw new Error('Got unexpected json from server');
	} else {
		context.commit(MutationType.FormSent, response.data);
	}

	return true;
};

// Request backend with retries in case of network error (app being disabled
// or loss of internet connection)
const retryRequests = async (callback): Promise<any> => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		let tries = 4;
		let response;
		while (tries > 0) {
			try {
				response = await callback();
				if (!response) {
					return reject(
						new Error('Callback did not return a Promise<response>')
					);
				}
				if (response.status > 299) {
					const error = new Error(
						'Got unexpected status code from server = ' +
							response.status
					);
					(error as any).response = response;
					throw error;
				}
				tries = 0; // stop the retry loop
			} catch (err) {
				if (
					err.request?.response?.includes('Total filesize is too big')
				) {
					return reject('Total filesize is too big');
				}
				if (
					!err.response &&
					'onLine' in window.navigator &&
					!window.navigator.onLine
				) {
					// wait for internet to come back
					await sleep(5000);
					if (window.console && window.console.warn) {
						window.console.warn(
							'Network missing, attempting retry'
						);
					}
				} else {
					tries--;
					if (tries < 1) {
						// We give up
						return reject(err);
					} else if (err.response && err.response.status === 401) {
						alert('Du har blivit utloggad under pågående arbete');
						// will probably never happen!
						// todo: show popup that lets you either throw away the form data or login and comeback to form
						return reject(err);
					}
					await sleep(2000 * tries);
				}
			}
		}
		return resolve(response);
	});
};

const mergeComments = (
	oldComments: IComment[],
	newComments: IComment[],
	lastUpdateDate: Date | null
): IComment[] => {
	const merged: IComment[] = [];
	oldComments.forEach((oldData) => {
		if (!newComments.some((newData) => newData.guid === oldData.guid)) {
			// exists in old, but not in new === must be local remove or added in old
			if (
				!lastUpdateDate ||
				new Date(oldData.timestamp) > lastUpdateDate
			) {
				// added in oldData, and therefor missing locally
				merged.push(oldData);
			}
		} else {
			// exists in both
			merged.push(oldData);
		}
	});
	newComments.forEach((possibleNewData) => {
		if (
			merged.some(
				(mergedComment) => mergedComment.guid === possibleNewData.guid
			)
		) {
			// existed in both, then already merged on previous step
		} else {
			// exists in new but not old, and is newer then the latest on server == added locally
			if (
				!lastUpdateDate ||
				new Date(possibleNewData.timestamp) >= lastUpdateDate
			) {
				merged.push(possibleNewData);
			}
		}
	});
	return merged.sort((n, y) =>
		new Date(n.timestamp) < new Date(y.timestamp) ? 1 : -1
	);
};
