/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRootState, IUser } from '@/models/IForm';
import axios from 'axios';
import { Store } from 'vuex';
import { IIntegrationObject } from '../index';
import AdvancedSharepointIntegration from './AdvancedSharepointIntegration.vue';
import AdvancedSharepointFieldIntegration from './AdvancedSharepointFieldIntegration.vue';
import {
	ISharepointField,
	ISharepointIntegrationRootState,
	ISharepointList,
	ISharepointWebsite,
} from './models';
import { AvailableIntegration, IntegrationType } from '@/models/Enums';

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
			type: IntegrationType.AdvancedSharepoint,
			integrationType: AvailableIntegration.AdvancedSharepoint,
			icon: 'https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product-fluent/svg/sharepoint_48x1.svg',
			componentName: 'AdvancedSharepointIntegration',
			fieldComponentName: 'AdvancedSharepointFieldIntegration',
			name: 'Avancerad Sharepoint',
		} as IIntegrationObject);

		// Register admin component
		app.component(
			'AdvancedSharepointIntegration',
			AdvancedSharepointIntegration
		);

		// Register admin field component
		app.component(
			'AdvancedSharepointFieldIntegration',
			AdvancedSharepointFieldIntegration
		);

		// Vuex store module
		store.registerModule('sharepointIntegration', {
			state: {} as ISharepointIntegrationRootState,
			mutations: {
				'sharepointIntegration/websitesLoaded': (
					state: ISharepointIntegrationRootState,
					{ websites }: { websites: ISharepointWebsite[] }
				) => {
					state.websites = websites;
				},
				'sharepointIntegration/listsLoaded': (
					state: ISharepointIntegrationRootState,
					{ lists }: { lists: ISharepointList[] }
				) => {
					state.lists = lists;
				},
				'sharepointIntegration/fieldsLoaded': (
					state: ISharepointIntegrationRootState,
					{ fields }: { fields: ISharepointField[] }
				) => {
					state.fields = fields;
				},
			},
			actions: {
				/**
				 * Load websites
				 */
				'sharepointIntegration/loadWebsites': async (context) => {
					let websites: ISharepointWebsite[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						websites = [
							{
								name: 'Förmyndarlistan',
								partialURL: 'whatever',
							},
							{
								name: 'Barnmyndigheten',
								partialURL: 'whatever2',
							},
						];
					} else {
						const response = await axios.get(
							Config.VUE_APP_DATA_SERVICE_SHAREPOINT_WEBSITES,
							{
								headers: {
									Authorization: 'Bearer ' + user.token,
								},
							}
						);
						websites = response.data;
					}
					context.commit('sharepointIntegration/websitesLoaded', {
						websites,
					});
				},

				/**
				 * Load lists
				 */
				'sharepointIntegration/loadLists': async (
					context,
					{ partialUrl }: { partialUrl: string }
				) => {
					let lists: ISharepointList[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						lists = [
							{ title: 'Alistan', guid: '1' },
							{ title: 'BListan', guid: '2' },
							{ title: 'CListan', guid: '3' },
						];
					} else {
						const apiUrl =
							Config.VUE_APP_DATA_SERVICE_SHAREPOINT_LISTS +
							'?partialUrl=' +
							partialUrl;
						const response = await axios.get(apiUrl, {
							headers: {
								Authorization: 'Bearer ' + user.token,
							},
						});
						lists = response.data;
					}
					context.commit('sharepointIntegration/listsLoaded', {
						lists,
					});
				},

				/**
				 * Load sharepoint list fields
				 */
				'sharepointIntegration/loadFields': async (
					context,
					{
						partialUrl,
						listGuid,
					}: { partialUrl: string; listGuid: string }
				) => {
					let fields: ISharepointField[] = [];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						fields = [
							{ title: 'Kolumn A', guid: 'k1' },
							{ title: 'KolumnB', guid: 'k2' },
							{ title: 'KolumnC', guid: 'k3' },
						];
					} else {
						const apiUrl =
							Config.VUE_APP_DATA_SERVICE_SHAREPOINT_FIELDS +
							'?partialUrl=' +
							partialUrl +
							'&listGuid=' +
							listGuid;
						const response = await axios.get(apiUrl, {
							headers: {
								Authorization: 'Bearer ' + user.token,
							},
						});
						fields = response.data;
					}
					context.commit('sharepointIntegration/fieldsLoaded', {
						fields,
					});
				},
			},
		});
	},
};
