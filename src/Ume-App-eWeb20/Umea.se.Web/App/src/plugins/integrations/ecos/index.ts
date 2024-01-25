/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IRootState } from '@/models/IForm';
import axios from 'axios';
import { Store } from 'vuex';
import { IIntegrationObject } from '../index';
import EcosIntegration from './EcosIntegration.vue';
import EcosFieldIntegration from './EcosFieldIntegration.vue';
import {
	dataSourceSpecIntegrationMock,
	IDataSourceSpecification,
	IDataSourceSpecificationRootState,
} from './IIntegrationOnPrem';
import {
	AvailableIntegration,
	IntegrationType,
	MutationType,
} from '@/models/Enums';

export default {
	install: (
		app: any,
		{ store, Config }: { store: Store<IRootState>; Config: any }
	) => {
		// register the available integration
		app.config.globalProperties.$registeredIntegrationComponents.push({
			type: IntegrationType.OnPrem,
			integrationType: AvailableIntegration.EcosIntegration,
			icon: 'heat_pump',
			componentName: 'EcosIntegration',
			fieldComponentName: 'EcosFieldIntegration',
			name: 'Ecos',
		} as IIntegrationObject);

		// Register admin component
		app.component('EcosIntegration', EcosIntegration);
		// Register field component
		app.component('EcosFieldIntegration', EcosFieldIntegration);

		// Vuex store module
		store.registerModule('onpremIntegration', {
			state: {} as IDataSourceSpecificationRootState,
			mutations: {
				'onPremIntegration/dataSourcesLoaded': (
					state: IDataSourceSpecificationRootState,
					{ dataSourceSpecsIntegration }
				) => {
					state.dataSourceSpecsIntegration =
						dataSourceSpecsIntegration;
				},
			},
			actions: {
				/**
				 * Load dataSources for integrations
				 */
				'onPremIntegration/loadDataSources': async (context: any) => {
					let dataSourceSpecsIntegration: IDataSourceSpecification[] =
						[];
					if (Config.VUE_APP_MOCK_DATA === 'yes') {
						dataSourceSpecsIntegration =
							dataSourceSpecIntegrationMock;
					} else {
						const response = await axios.get(
							Config.VUE_APP_DATA_SERVICE_SPECS_INTEGRATION
						);
						dataSourceSpecsIntegration = response.data.filter(
							(el: any) => el.integrationAvailable
						);
					}
					context.commit('onPremIntegration/dataSourcesLoaded', {
						dataSourceSpecsIntegration,
					});
				},
				'onPremIntegration/clearEcosData': (context: any) => {
					context.commit(MutationType.UpdateFormProperty, {
						newValue: '',
						fieldProperty: 'templateGuid',
					});

					store.state.form?.attributes.steps.forEach((step) => {
						step.fields.forEach((field) => {
							if (
								field.fieldOptions.templateSource ||
								field.fieldOptions.outPutDataSource
							) {
								const newOpts = { ...field.fieldOptions };
								delete newOpts.templateSource;
								delete newOpts.outPutDataSource;

								context.commit(MutationType.UpdateFormField, {
									fieldId: field.id,
									newValue: newOpts,
									fieldProperty: 'fieldOptions',
								});
							}
						});
					});
				},
			},
		});
	},
};
