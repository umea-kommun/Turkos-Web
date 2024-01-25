/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRootState, IUser } from '@/models/IForm';
import axios from 'axios';
import { Store } from 'vuex';
import { IIntegrationObject } from '../index';
import Public360Integration from './Public360Integration.vue';
import { IPublic360List, IPublic360IntegrationRootState } from './models';
import { AvailableIntegration, IntegrationType } from '@/models/Enums';
import logotypeUrl from '@/assets/Public 360 logotyp.svg';

export default {
	install: (
		app: any,
		{
			store,
			Config,
			user,
		}: { store: Store<IRootState>; user: IUser; Config: any }
	) => {
		// register the available integration
		app.config.globalProperties.$registeredIntegrationComponents.push({
			type: IntegrationType.Public360,
			integrationType: AvailableIntegration.Public360,
			icon: logotypeUrl,
			componentName: 'Public360Integration',
			name: 'Public 360',
		} as IIntegrationObject);

		// Register admin component
		app.component('Public360Integration', Public360Integration);

		// Vuex store module
		store.registerModule('public360Integration', {
			state: {} as IPublic360IntegrationRootState,
			mutations: {
				'public360Integration/public360Enterprises': (
					state: IPublic360IntegrationRootState,
					{ enterprises }: { enterprises: IPublic360List[] }
				) => {
					state.enterprises = enterprises;
				},
				'public360Integration/public360AccessGroups': (
					state: IPublic360IntegrationRootState,
					{ accessGroups }: { accessGroups: IPublic360List[] }
				) => {
					state.accessGroups = accessGroups;
				},
				'public360Integration/public360Journals': (
					state: IPublic360IntegrationRootState,
					{ journals }: { journals: IPublic360List[] }
				) => {
					state.journals = journals;
				},
				'public360Integration/public360DocumentCategories': (
					state: IPublic360IntegrationRootState,
					{
						documentCategories,
					}: { documentCategories: IPublic360List[] }
				) => {
					state.documentCategories = documentCategories;
				},
				'public360Integration/public360DocumentArchives': (
					state: IPublic360IntegrationRootState,
					{ documentArchives }: { documentArchives: IPublic360List[] }
				) => {
					state.documentArchives = documentArchives;
				},
				'public360Integration/public360DocumentStatuses': (
					state: IPublic360IntegrationRootState,
					{ documentStatuses }: { documentStatuses: IPublic360List[] }
				) => {
					state.documentStatuses = documentStatuses;
				},
				'public360Integration/public360CaseRoles': (
					state: IPublic360IntegrationRootState,
					{ caseRoles }: { caseRoles: IPublic360List[] }
				) => {
					state.caseRoles = caseRoles;
				},
			},
			actions: {
				/**
				 * Load enterprises
				 */
				'public360Integration/loadPublic360Enterprises': async (
					context
				) => {
					let enterprises: IPublic360List[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						enterprises = [
							{ title: 'Kommunledningsstaben', id: '100001' },
							{ title: 'Lantmäteri', id: '100002' },
						];
					} else {
						const response = await axios.get(
							Config.VUE_APP_DATA_SERVICE_PUBLIC360 +
								'/enterpriseswithcategoryrecnoone',
							{
								headers: {
									Authorization: 'Bearer ' + user.token,
								},
							}
						);
						enterprises = response.data;
					}
					context.commit(
						'public360Integration/public360Enterprises',
						{
							enterprises,
						}
					);
				},
				/**
				 * Load accessgroups
				 */
				'public360Integration/loadPublic360AccessGroups': async (
					context
				) => {
					let accessGroups: IPublic360List[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						accessGroups = [
							{ title: 'Lantmäteri', id: '100071' },
							{ title: 'Kommunledningsstaben', id: '100072' },
						];
					} else {
						const response = await axios.get(
							Config.VUE_APP_DATA_SERVICE_PUBLIC360 +
								'/accessgroups',
							{
								headers: {
									Authorization: 'Bearer ' + user.token,
								},
							}
						);
						accessGroups = response.data;
					}
					context.commit(
						'public360Integration/public360AccessGroups',
						{
							accessGroups,
						}
					);
				},
				/**
				 * Load journals
				 */
				'public360Integration/loadPublic360Journals': async (
					context
				) => {
					let journals: IPublic360List[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						journals = [
							{ title: 'Centralarkiv', id: '200001' },
							{ title: 'KS', id: '200002' },
						];
					} else {
						const response = await axios.get(
							Config.VUE_APP_DATA_SERVICE_PUBLIC360 + '/journals',
							{
								headers: {
									Authorization: 'Bearer ' + user.token,
								},
							}
						);
						journals = response.data;
					}
					context.commit('public360Integration/public360Journals', {
						journals,
					});
				},
				/**
				 * Load document categories
				 */
				'public360Integration/loadPublic360DocumentCategories': async (
					context
				) => {
					let documentCategories: IPublic360List[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						documentCategories = [
							{ title: 'I-Skrivelse', id: '110' },
							{ title: 'U-Skrivelse', id: '111' },
						];
					} else {
						const response = await axios.get(
							Config.VUE_APP_DATA_SERVICE_PUBLIC360 +
								'/documentcategories',
							{
								headers: {
									Authorization: 'Bearer ' + user.token,
								},
							}
						);
						documentCategories = response.data;
					}
					context.commit(
						'public360Integration/public360DocumentCategories',
						{
							documentCategories,
						}
					);
				},
				/**
				 * Load documentarchives
				 */
				'public360Integration/loadPublic360DocumentArchives': async (
					context
				) => {
					let documentArchives: IPublic360List[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						documentArchives = [
							{ title: 'Archive document', id: '1000' },
							{ title: 'Diariedocument', id: '2000' },
						];
					} else {
						const response = await axios.get(
							Config.VUE_APP_DATA_SERVICE_PUBLIC360 +
								'/documentarchives',
							{
								headers: {
									Authorization: 'Bearer ' + user.token,
								},
							}
						);
						documentArchives = response.data;
					}
					context.commit(
						'public360Integration/public360DocumentArchives',
						{
							documentArchives,
						}
					);
				},
				/**
				 * Load documentstatuses
				 */
				'public360Integration/loadPublic360DocumentStatuses': async (
					context
				) => {
					let documentStatuses: IPublic360List[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						documentStatuses = [
							{ title: 'Registrerad', id: '1' },
							{
								title: 'Registrerad av ansvarig person',
								id: '2',
							},
						];
					} else {
						const response = await axios.get(
							Config.VUE_APP_DATA_SERVICE_PUBLIC360 +
								'/documentstatuses',
							{
								headers: {
									Authorization: 'Bearer ' + user.token,
								},
							}
						);
						documentStatuses = response.data;
					}
					context.commit(
						'public360Integration/public360DocumentStatuses',
						{
							documentStatuses,
						}
					);
				},
				/**
				 * Load caseroles
				 */
				'public360Integration/loadPublic360CaseRoles': async (
					context
				) => {
					let caseRoles: IPublic360List[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						caseRoles = [
							{ title: 'Sökande', id: '1' },
							{
								title: 'Medsökande',
								id: '2',
							},
						];
					} else {
						const response = await axios.get(
							Config.VUE_APP_DATA_SERVICE_PUBLIC360 +
								'/caseroles',
							{
								headers: {
									Authorization: 'Bearer ' + user.token,
								},
							}
						);
						caseRoles = response.data;
					}
					context.commit('public360Integration/public360CaseRoles', {
						caseRoles,
					});
				},
			},
		});
	},
};
