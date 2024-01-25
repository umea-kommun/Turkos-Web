// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck FIX THIS - remove this comment
import { IForm, IUserRequirement } from '@/models/IForm';
import { Helper } from '@/utils/helper';
import MockedDefaultData from '@/mock/data';
import MockAdapter from 'axios-mock-adapter';
import { FormStatus } from '@/models/Enums';
import moment from 'moment';

const saveDataToLocalStorage = (data: any): void => {
	(window as any).localStorage.setItem(
		'basicUseMockData',
		JSON.stringify(data)
	);
};

/**
 * Mockadapter för Axios. Tar hand om anrop till Axios och levererar mockdata istället för riktig data.
 */
export default function (axios): any {
	const delay = 200;
	const mock = new MockAdapter(axios, { delayResponse: delay }) as any;
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	const data = loadDataFromLocalStorage() || MockedDefaultData;

	mock.onGet(/\/forms\/\d+/).reply((config) => {
		const url = config.url || '';
		const id = parseInt(url.substr(url.lastIndexOf('/') + 1), 10);
		const form = data.forms.find((f) => f.id === id);
		if (form) {
			return [200, { form }];
		} else {
			return [404];
		}
	});

	mock.onGet(/\/form-by-path\/.+/).reply((config) => {
		const url = config.url || '';
		const path = url.substr(url.lastIndexOf('/') + 1);
		const form = data.forms.find((f) => f.data.attributes.path === path);
		if (form) {
			return [200, { form }];
		} else {
			return [404];
		}
	});

	mock.onGet(/\/form-info-by-path\/.+/).reply((config) => {
		const url = config.url || '';
		const path = url.substr(url.lastIndexOf('/') + 1);
		let form = data.forms.find((f) => f.data.attributes.path === path);
		if (form) {
			form = {
				data: {
					attributes: {
						title: form.data.attributes.title,
						type: form.data.attributes.type,
						path: form.data.attributes.path,
						description: form.data.attributes.description,
						status: form.data.attributes.status,
						dateSchedule: form.data.attributes.dateSchedule,
						receiver: form.data.attributes.receiver,
						disablePrintPdf: form.data.attributes.disablePrintPdf,
						userRequirement: form.data.attributes.userRequirement,
						gDPR: form.data.attributes.gDPR,
					},
					id: form.id,
				},
			};
			return [200, { form }];
		} else {
			// Since the API is returning 200 even if no results, we do it here as well
			return [200];
		}
	});

	mock.onGet('/forms').reply((config) => {
		return [200, { forms: data.forms }];
	});

	mock.onGet('/validationruletypes').reply(delay, {
		validationRuleTypes: data.validationRuleTypes,
	});

	mock.onGet('/pm3').reply(delay, {
		pm3: data.pM3s,
	});

	mock.onGet('/receivers').reply(delay, {
		receivers: data.receivers,
	});

	mock.onGet('/templates').reply(delay, {
		templates: data.templates,
	});

	mock.onGet('/gdpr').reply(delay, {
		gdpr: data.gDPRs,
	});

	mock.onGet('/lifeSituations').reply(delay, {
		lifeSituations: data.lifeSituations,
	});

	mock.onGet('/categories').reply(delay, {
		categories: data.categories,
	});

	mock.onGet('/multiSigning').reply(delay, {
		multiSigning: data.multiSigning,
	});

	mock.onGet('/template').reply(delay, {
		template: data.templates,
	});
	mock.onGet(/\/template-by-type\/.+/).reply((config) => {
		const url = config.url || '';
		const templateType = url.substr(url.lastIndexOf('/') + 1);
		const templates = data.templates.filter((f) => f.type === templateType);
		if (templates) {
			return [200, { templates }];
		} else {
			return [404];
		}
	});
	mock.onGet(/\/template-by-id\/\d+/).reply((config) => {
		const url = config.url || '';
		const id = parseInt(url.substr(url.lastIndexOf('/') + 1), 10);
		const template = data.templates.find((f) => f.id === id);
		if (template) {
			return [200, { template }];
		} else {
			return [404];
		}
	});
	mock.onGet('/caseroles').reply(delay, {
		caseRoles: data.caseRoles,
	});
	mock.onGet('/addresstypes').reply(delay, {
		addressTypes: data.addressTypes,
	});
	mock.onGet('/occurrencetypes').reply(delay, {
		occurrenceTypes: data.occurrenceTypes,
	});
	mock.onGet('/notificationtypes').reply(delay, {
		notificationTypes: data.notificationTypes,
	});
	mock.onGet('/processtypes').reply(delay, {
		processTypes: data.processTypes,
	});
	mock.onGet('/documenttypes').reply(delay, {
		documentTypes: data.documentTypes,
	});
	mock.onGet('/diaryplans').reply(delay, {
		diaryPlans: data.diaryPlans,
	});
	mock.onGet('/handlingofficergroups').reply(delay, {
		handlingOfficerGroups: data.handlingOfficerGroups,
	});
	mock.onPost('/new-template').reply((config) => {
		let id = 0;
		data.templates.forEach((element) => {
			if (element.id > id) {
				id = element.id;
			}
		});
		let tempid = 0;
		data.templates.forEach((element) => {
			element.options.forEach((item) => {
				if (item.id > tempid) {
					tempid = item.id;
				}
			});
		});
		const templateId = id + 1;
		const rawTemplateData = JSON.parse(config.data);
		const newTemplate = rawTemplateData;
		newTemplate.id = templateId;
		newTemplate.options.forEach((element) => {
			element.id = tempid;
		});
		data.templates.push(newTemplate);
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		saveDataToLocalStorage(data);
		return [201, { template: newTemplate }];
	});
	mock.onPost('/update-template').reply((config) => {
		const rawTemplateData = JSON.parse(config.data);
		const templateIndex = data.templates.findIndex(
			(f) => f.id === rawTemplateData.id
		);
		if (templateIndex !== -1) {
			data.templates.splice(templateIndex, 1, rawTemplateData);
		}
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		saveDataToLocalStorage(data);
		return [201, { template: rawTemplateData }];
	});
	mock.onGet(/\/delete-template-by-id\/\d+/).reply((config) => {
		const url = config.url || '';
		const id = parseInt(url.substr(url.lastIndexOf('/') + 1), 10);
		const templateIndex = data.templates.findIndex((f) => f.id === id);
		if (templateIndex !== -1) {
			data.templates.splice(templateIndex, 1);
		}
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		saveDataToLocalStorage(data);
		return [201, { id }];
	});

	mock.onPost('/new-form').reply((config) => {
		const formId = Helper.generateTempIdInteger() * -1;
		const rawFormData = JSON.parse(config.data);
		const newForm = {
			id: formId,
			errors: [],
			links: {},
			data: rawFormData as IForm,
		};
		(newForm.data.type = 'form'), (newForm.data.id = formId.toString());
		newForm.data.attributes.steps[0].id = (
			Helper.generateTempIdInteger() * -1
		).toString();
		const authClient: string[] = [];
		newForm.data.attributes.userRequirement = {
			authClient,
		} as IUserRequirement;
		newForm.data.attributes.userRequirement.authClient.push('Publik');
		newForm.data.attributes.userRequirement.addressMandatory = true;
		Object.keys(data.forms[0].data.attributes).forEach((key) => {
			if (key !== 'steps' && key !== 'path') {
				const emptyValue =
					data.forms[0].data.attributes[key] instanceof Array
						? []
						: '';
				newForm.data.attributes[key] =
					rawFormData.attributes[key] || emptyValue;
			}
		});
		newForm.data.attributes.status = FormStatus.Draft;
		newForm.data.attributes.gDPR = {
			dataControllers: [],
		};
		newForm.data.attributes.comments = [];
		newForm.data.attributes.createdBy = 'some-admin@website.com';
		newForm.data.attributes.created = new Date().toISOString();
		newForm.data.attributes.modified = new Date().toString();
		newForm.data.attributes.modifiedBy = 'some-admin@website.com';
		data.forms.push(newForm);
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		saveDataToLocalStorage(data);
		return [201, { form: newForm }];
	});

	mock.onPost('/clone-form/').reply((config) => {
		const id = Number(config.data);
		const form = data.forms.find((f) => f.id === id);
		const cloneForm = Helper.deepCopy(form);
		cloneForm.id = id + 1000;
		cloneForm.data.id = cloneForm.id.toString();
		cloneForm.data.attributes.title =
			cloneForm.data.attributes.title + ' - kopia';
		cloneForm.data.attributes.path =
			cloneForm.data.attributes.path +
			new Date().toISOString().replace(/ /g, '').replace(/\./g, '');
		cloneForm.data.attributes.status = FormStatus.Draft;
		cloneForm.data.attributes.created = new Date().toISOString();
		cloneForm.data.attributes.createdBy = 'kajsa.andersson@test.se';
		cloneForm.data.attributes.modified = new Date().toISOString();
		cloneForm.data.attributes.modifiedBy = 'kajsa.andersson@test.se';

		data.forms.push(cloneForm);
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		saveDataToLocalStorage(data);
		if (cloneForm) {
			return [200, { form: cloneForm }];
		} else {
			return [400];
		}
	});

	mock.onPost(/\/update-form\/\d+/).reply((config) => {
		const url = config.url || '';
		const id = parseInt(url.substr(url.lastIndexOf('/') + 1), 10);
		const form = data.forms.find((f) => f.id === id);
		const newData = JSON.parse(config.data);
		form.data = newData;
		form.data.id = id;
		form.data.attributes.modified = new Date().toISOString();
		form.data.attributes.modifiedBy = 'some-admin@website.com';
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		saveDataToLocalStorage(data);
		if (form) {
			return [200, { form }];
		} else {
			return [404];
		}
	});

	mock.onGet('/banner').reply(delay, {
		banners: data.banners,
	});

	mock.onPatch(/\/banner\/\d+/).reply((config) => {
		const banner = JSON.parse(config.data);
		const bannerId = parseInt(
			config.url.substring(config.url.lastIndexOf('/') + 1)
		);
		const bannerIndex = data.banners.findIndex((b) => b.id === bannerId);

		if (bannerIndex > -1) {
			banner.modified = moment().format();
			data.banners[bannerIndex] = banner;

			saveDataToLocalStorage(data);

			return [200, { banner }];
		}
		return [400];
	});

	mock.onPost('/admin-upload-file').reply((config) => {
		return [200, { reference: 'Test-Logo.svg/1200px-Test-Logo.svg.png' }];
	});

	mock.onPost('/admin-remove-files').reply((config) => {
		const fileRefs = JSON.parse(config.data);
		if (fileRefs?.length) {
			return [200];
		}
		return [400];
	});
}

const loadDataFromLocalStorage = (): object => {
	const dataString = (window as any).localStorage.getItem('basicUseMockData');
	return dataString ? JSON.parse(dataString) : null;
};

export const resetSavedMockData = (): void => {
	(window as any).localStorage.setItem('basicUseMockData', null);
};
