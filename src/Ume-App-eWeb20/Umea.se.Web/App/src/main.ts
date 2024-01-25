import '@/polyfills';
import { createApp } from 'vue';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import App from './App.vue';
import router from './router';
import store from './store/store';
import vuetify from './plugins/vuetify';
import Auth from './plugins/auth';
import i18n from './plugins/i18next';
import Config from '@/utils/Config';
import BaseLoginMethods from '@turkos/base-login-methods';
import '@turkos/base-login-methods/style.css';
import '@turkos/components/styles';
import DataServicePlugin from '@/plugins/dataService';
import Validation from './plugins/validation';
import IAuthManager from './plugins/auth/IAuthManager';
import ErrorService from './utils/ErrorService';
import * as Enums from '@/models/Enums';
import { MutationType } from './models/Enums';
import { IFormField } from './models/IForm';
import { findStepIndex } from '@/store/utils';
import { IDataSourceConnector } from './plugins/dataService/models';
import GenerateUserId from '@/plugins/generateUserId';
import Integrations from './plugins/integrations';
import EmailNotificationIntegration from './plugins/integrations/email-notification';
import EmailIntegration from './plugins/integrations/email';
import AdvancedSharepoint from './plugins/integrations/advanced-sharepoint';
import EcosIntegration from './plugins/integrations/ecos';
import UserWifiIntegration from './plugins/integrations/user-wifi';
import NavetIntegrationPlugin from '@/plugins/integrations/navet';
import Public360IntegrationPlugin from '@/plugins/integrations/public360';
import mitt from 'mitt';
import moment from 'moment';
import 'moment/dist/locale/sv';
import umeComponents from './plugins/umeComponents';
import appInsights from './plugins/appInsights';

moment.locale(i18n.global.locale);

/**
 * Setup env variables from both transpiled env-file and variables coming
 * from server side
 */
Config.loadVarsFromServer((window as any).vueAppServerConfig || {});
const app = createApp(App);
const emitter = mitt();

/** DataService Plugin */
app.use(DataServicePlugin, {
	store,
	Config,
	userConnectionCallbacks: {
		getUser: () => {
			return store.state.user;
		},
	},
	dataSourceConnectionCallbacks: {
		getConnection: (field: IFormField) => {
			return field.fieldOptions.dataSource;
		},
		setData: (field: IFormField, tableRows: any) => {
			const newOpts = { ...field.fieldOptions, tableRows };
			if (field.type === Enums.FormFieldType.Table) {
				store.commit(MutationType.UpdateFormFieldTableRows, {
					fieldId: field.id,
					newValue: newOpts,
				});
			}
		},
		setTableData: (field: IFormField, dataSourceData: any) => {
			if (field.type === Enums.FormFieldType.Table) {
				store.commit(MutationType.UpdateFormFieldTableData, {
					fieldId: field.id,
					newValue: dataSourceData,
				});
			}
		},
		setConnection: (field: IFormField, dataSource: any) => {
			const newTableOpts = { ...field.fieldOptions, dataSource };
			const newOptsTemp = { ...field.fieldOptions, dataSource };
			const newOpts = JSON.parse(JSON.stringify(newOptsTemp));
			if (field.type === Enums.FormFieldType.Table) {
				const stepIndex = findStepIndex(store.state.form!, field.id);
				const tableField = store.state.form!.attributes.steps[
					stepIndex
				].fields.filter(
					(element) => element.fieldOptions!.tableGuid === field.guid
				);
				Object.keys(field.fieldOptions).forEach((i) => {
					if (!newTableOpts[i]) {
						newTableOpts[i] = field.fieldOptions[i];
					}
				});
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newTableOpts,
					fieldProperty: 'fieldOptions',
				});
				if (tableField.length > 0) {
					tableField.forEach((element) => {
						Object.keys(element.fieldOptions).forEach((i) => {
							if (!newOpts[i]) {
								newOpts[i] = element.fieldOptions[i];
							} else if (typeof newOpts[i] === 'object') {
								Object.keys(element.fieldOptions[i]).forEach(
									(j) => {
										if (!newOpts[i][j]) {
											newOpts[i][j] =
												element.fieldOptions[i][j];
										} else if (
											typeof newOpts[i][j] === 'object'
										) {
											Object.keys(
												element.fieldOptions[i][j]
											).forEach((k) => {
												if (!newOpts[i][j][k]) {
													newOpts[i][j][k] =
														element.fieldOptions[i][
															j
														][k];
												}
											});
										}
									}
								);
							}
						});
						try {
							store.commit(MutationType.UpdateFormField, {
								fieldId: element.id,
								newValue: newOpts,
								fieldProperty: 'fieldOptions',
							});
						} catch (error) {
							throw new Error(
								'Unable to update form field ' + element.title
							);
						}
					});
				}
			} else {
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newOpts,
					fieldProperty: 'fieldOptions',
				});
			}
		},
		removeConnection: (field: IFormField) => {
			const newOpts = { ...field.fieldOptions };
			if (newOpts) {
				delete newOpts.dataSource;
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newOpts,
					fieldProperty: 'fieldOptions',
				});
				if (field.type === Enums.FormFieldType.Table) {
					store.commit(MutationType.DeleteFormFieldTableFields, {
						fieldId: field.id,
						newValue: newOpts,
					});
				}
			}
		},
		getOutPutConnection: (field: IFormField) => {
			return field.fieldOptions.outPutDataSource;
		},
		setOutPutData: (field: IFormField, tableRows: any) => {
			const newOpts = { ...field.fieldOptions, tableRows };
			if (field.type === Enums.FormFieldType.Table) {
				store.commit(MutationType.UpdateFormFieldTableRows, {
					fieldId: field.id,
					newValue: newOpts,
				});
			}
		},
		setOutPutTableData: (field: IFormField, dataSourceData: any) => {
			if (field.type === Enums.FormFieldType.Table) {
				store.commit(MutationType.UpdateFormFieldTableData, {
					fieldId: field.id,
					newValue: dataSourceData,
				});
			}
		},
		setOutPutConnection: (field: IFormField, outPutDataSource: any) => {
			const newTableOpts = { ...field.fieldOptions, outPutDataSource };
			const newOpts = { ...field.fieldOptions, outPutDataSource };
			if (field.type === Enums.FormFieldType.Table) {
				const stepIndex = findStepIndex(store.state.form!, field.id);
				const tableField = store.state.form!.attributes.steps[
					stepIndex
				].fields.filter(
					(element) => element.fieldOptions!.tableGuid === field.guid
				);
				Object.keys(field.fieldOptions).forEach((i) => {
					if (!newTableOpts[i]) {
						newTableOpts[i] = field.fieldOptions[i];
					}
				});
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newTableOpts,
					fieldProperty: 'fieldOptions',
				});
				if (tableField.length > 0) {
					tableField.forEach((element) => {
						Object.keys(element.fieldOptions).forEach((i) => {
							if (!newOpts[i]) {
								newOpts[i] = element.fieldOptions[i];
							}
						});
						try {
							store.commit(MutationType.UpdateFormField, {
								fieldId: element.id,
								newValue: newOpts,
								fieldProperty: 'fieldOptions',
							});
						} catch (error) {
							throw new Error(
								'Unable to update form field ' + element.title
							);
						}
					});
				}
			} else {
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newOpts,
					fieldProperty: 'fieldOptions',
				});
			}
		},
		removeOutPutConnection: (field: IFormField) => {
			const newOpts = { ...field.fieldOptions };
			if (newOpts) {
				delete newOpts.outPutDataSource;
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newOpts,
					fieldProperty: 'fieldOptions',
				});
				if (field.type === Enums.FormFieldType.Table) {
					store.commit(MutationType.DeleteFormFieldTableFields, {
						fieldId: field.id,
						newValue: newOpts,
					});
				}
			}
		},
		getSearchConnection: (field: IFormField) => {
			return field.fieldOptions.searchDataSource;
		},
		setSearchData: (field: IFormField, tableRows: any) => {
			const newOpts = { ...field.fieldOptions, tableRows };
			if (field.type === Enums.FormFieldType.Table) {
				store.commit(MutationType.UpdateFormFieldTableRows, {
					fieldId: field.id,
					newValue: newOpts,
				});
			}
		},
		setSearchTableData: (field: IFormField, dataSourceData: any) => {
			if (field.type === Enums.FormFieldType.Table) {
				store.commit(MutationType.UpdateFormFieldTableData, {
					fieldId: field.id,
					newValue: dataSourceData,
				});
			}
		},
		setSearchConnection: (field: IFormField, searchDataSource: any) => {
			const newTableOpts = { ...field.fieldOptions, searchDataSource };
			const newOpts = { ...field.fieldOptions, searchDataSource };
			if (field.type === Enums.FormFieldType.Table) {
				const stepIndex = findStepIndex(store.state.form!, field.id);
				const tableField = store.state.form!.attributes.steps[
					stepIndex
				].fields.filter(
					(element) => element.fieldOptions!.tableGuid === field.guid
				);
				Object.keys(field.fieldOptions).forEach((i) => {
					if (!newTableOpts[i]) {
						newTableOpts[i] = field.fieldOptions[i];
					}
				});
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newTableOpts,
					fieldProperty: 'fieldOptions',
				});
				if (tableField.length > 0) {
					tableField.forEach((element) => {
						Object.keys(element.fieldOptions).forEach((i) => {
							if (!newOpts[i]) {
								newOpts[i] = element.fieldOptions[i];
							}
						});
						try {
							store.commit(MutationType.UpdateFormField, {
								fieldId: element.id,
								newValue: newOpts,
								fieldProperty: 'fieldOptions',
							});
						} catch (error) {
							throw new Error(
								'Unable to update form field ' + element.title
							);
						}
					});
				}
			} else {
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newOpts,
					fieldProperty: 'fieldOptions',
				});
			}
		},
		removeSearchConnection: (field: IFormField) => {
			const newOpts = { ...field.fieldOptions };
			if (newOpts) {
				delete newOpts.searchDataSource;
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: newOpts,
					fieldProperty: 'fieldOptions',
				});
				if (field.type === Enums.FormFieldType.Table) {
					store.commit(MutationType.DeleteFormFieldTableFields, {
						fieldId: field.id,
						newValue: newOpts,
					});
				}
			}
		},
	} as IDataSourceConnector,
});

/** Install Integrations */
app.use(Integrations); // Has to be first
app.use(EmailNotificationIntegration);
app.use(EmailIntegration);
app.use(NavetIntegrationPlugin);
app.use(AdvancedSharepoint, {
	store,
	Config,
	user: store.state.user,
});
app.use(EcosIntegration, {
	store,
	Config,
});
app.use(UserWifiIntegration);
app.use(Public360IntegrationPlugin, {
	store,
	Config,
	user: store.state.user,
});

/** Generate user id */
app.use(GenerateUserId);

/** Install Other plugins */
app.use(BaseLoginMethods);
Validation(i18n);
app.use(umeComponents);

/** Error handler */
// Catches vue errors
app.config.errorHandler = (err, instance, info) => {
	ErrorService.onError({ err, log: true, instance, info });
};
app.config.globalProperties.emitter = emitter;
// Catches general errors
window.addEventListener('error', (e: ErrorEvent) => {
	if (e.error) {
		ErrorService.onError({
			err: e.error,
			log: true,
			info: e.type,
		});
	} else if (import.meta.env.DEV) {
		// Does not contain an error, log it to console if running locally
		console.warn(e);
	}
});

app.use(appInsights, {
	baseName: '(BasicUse Vue)',
	router,
	appInsightsConfig: {
		connectionString: Config.VUE_APP_APPINSIGHT_CONNECTION_STRING,
		loggingLevelTelemetry: 2,
		enableCorsCorrelation: true,
	},
	onAfterScriptLoaded: (appInsights: ApplicationInsights) => {
		appInsights.setAuthenticatedUserContext(store.state.user.userId);
	},
});

const auth = Auth({ config: Config });
app.provide<IAuthManager>('$auth', auth);

app.use(router).use(store).use(i18n).use(vuetify);

app.mount('#app');
