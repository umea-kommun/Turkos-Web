import { Helper } from '@/utils/helper';
import { Store } from 'vuex';
import { MutationType } from '@/models/Enums';
import {
	IDataSourceSpecification,
	IDataServicePluginRootStore,
} from './models';
import store from '@/store/store';
import DataServiceAdminConnector from './DataServiceAdminConnector.vue';
import DataServiceAdminConnectorOutput from './DataServiceAdminConnectorOutput.vue';
import DataServiceAdminConnectorSearch from './DataServiceAdminConnectorSearch.vue';
import DataServiceFieldButton from './DataServiceFieldButton.vue';
import DataServiceFieldFiller from './DataServiceFieldFiller.vue';
import DataSourceApplier from './DataSourceApplier';
import DataSourceOutPutApplier from './DataSourceOutPutApplier';
import DataSourceSearchApplier from './DataSourceSearchApplier';

let dataSourceApplier: DataSourceApplier;
let dataSourceOutPutApplier: DataSourceOutPutApplier;
let dataSourceSearchApplier: DataSourceSearchApplier;

export default {
	install(
		app: any,
		{
			Config,
			userConnectionCallbacks,
			dataSourceConnectionCallbacks,
			dataFetchedDataSources,
		}: any
	): void {
		// Field component
		app.component('DataServiceFieldButton', DataServiceFieldButton);
		app.component('DataServiceFieldFiller', DataServiceFieldFiller);

		// Vuex store module input
		store.registerModule('dataServicePlugin', {
			state: {} as IDataServicePluginRootStore,
			mutations: {
				'dataServicePlugin/dataSourceSpecsLoaded': (
					state: any,
					{ dataSourceSpecs }
				) => {
					state.dataSourceSpecs = dataSourceSpecs;
				},
			},
			actions: {},
		});

		// Expose callbacks to our admin component, via the Vue instance
		app.provide('$dataSourceConnector', dataSourceConnectionCallbacks);

		// Initiate data source applier
		dataSourceApplier = new DataSourceApplier({
			dataServiceSpecUrl: Config.VUE_APP_DATA_SERVICE_SPECS_INPUT,
			useMockData: Config.VUE_APP_MOCK_DATA === 'yes',
			userConnectionCallbacks,
			dataSourceConnectionCallbacks,
			dataFetchedDataSources,
		});

		// pre-load data source specifications async and add it to store
		// so that our admin component can pick it up later
		dataSourceApplier
			.fetchDataSourceSpecifications()
			.then((dataSourceSpecs) => {
				store.commit('dataServicePlugin/dataSourceSpecsLoaded', {
					dataSourceSpecs,
				});
			});

		// Expose callbacks to our admin component, via the Vue instance
		app.provide('$dataSourceApplier', dataSourceApplier);

		// Vuex store module output
		store.registerModule('dataServiceOutPutPlugin', {
			state: {} as IDataServicePluginRootStore,
			mutations: {
				'dataServiceOutPutPlugin/dataSourceSpecsOutPutLoaded': (
					state: any,
					{ dataSourceSpecsOutPut }
				) => {
					state.dataSourceSpecsOutPut = dataSourceSpecsOutPut;
				},
			},
			actions: {},
		});

		// Initiate data source applier
		dataSourceOutPutApplier = new DataSourceOutPutApplier({
			dataServiceSpecOutPutUrl: Config.VUE_APP_DATA_SERVICE_SPECS_OUTPUT,
			useMockData: Config.VUE_APP_MOCK_DATA === 'yes',
		});

		// pre-load data source specifications async and add it to store
		// so that our admin component can pick it up later
		dataSourceOutPutApplier
			.fetchDataSourceSpecificationsOutPut()
			.then((dataSourceSpecsOutPut) => {
				store.commit(
					'dataServiceOutPutPlugin/dataSourceSpecsOutPutLoaded',
					{ dataSourceSpecsOutPut }
				);
			});

		// Expose callbacks to our admin component, via the Vue instance
		app.provide('$dataSourceOutPutApplier', dataSourceOutPutApplier);

		// Vuex store module search
		store.registerModule('dataServiceSearchPlugin', {
			state: {} as IDataServicePluginRootStore,
			mutations: {
				'dataServiceSearchPlugin/dataSourceSpecsSearchLoaded': (
					state: any,
					{ dataSourceSpecsSearch }
				) => {
					state.dataSourceSpecsSearch = dataSourceSpecsSearch;
				},
			},
			actions: {},
		});

		// Initiate data source applier
		dataSourceSearchApplier = new DataSourceSearchApplier({
			dataServiceSpecSearchUrl: Config.VUE_APP_DATA_SERVICE_SPECS_SEARCH,
			useMockData: Config.VUE_APP_MOCK_DATA === 'yes',
			userConnectionCallbacks,
			dataSourceConnectionCallbacks,
		});

		// pre-load data source specifications async and add it to store
		// so that our admin component can pick it up later
		dataSourceSearchApplier
			.fetchDataSourceSpecificationsSearch()
			.then((dataSourceSpecsSearch) => {
				store.commit(
					'dataServiceSearchPlugin/dataSourceSpecsSearchLoaded',
					{ dataSourceSpecsSearch }
				);
			});

		// Expose callbacks to our admin component, via the Vue instance
		app.provide('$dataSourceSearchApplier', dataSourceSearchApplier);
	},
};

/**
 * Vuex plugin that will decorate form data with data from external data sources
 * @param store
 */
export const dataSourceVuexPlugin = (store: Store<any>): any => {
	store.subscribe(async (mutation: any, state) => {
		if (mutation.type === MutationType.GetPublicForm) {
			const dataSourceData =
				await dataSourceApplier.fetchDataSourcesUsedInForm(
					state.form,
					'',
					''
				);
			if (dataSourceData.size > 0) {
				if (
					state.multipleSigningByLink
						? !state.multipleSigningByLink.isMultipleSigningByLink
						: true
				) {
					const list: any[] = [];
					dataSourceData.forEach((data: any) => {
						list.push(data);
					});
					if (!list[0].searchEntity) {
						const dataSourceSpecifications =
							await dataSourceApplier.fetchDataSourceSpecifications();
						let hasErrorMessage = false;
						let message = '';
						dataSourceData.forEach((data: any, key: any) => {
							const dataObject = data as any;
							const dataSourceSpecification =
								dataSourceSpecifications!.find(
									(f: any) => f.dataSourceName === key
								) as IDataSourceSpecification;
							if (dataSourceSpecification.errorMessage) {
								if (
									dataObject.meddelande &&
									dataObject.meddelande.trim().length !== 0
								) {
									hasErrorMessage = true;
									message = dataObject.meddelande;
								}
							}
						});
						if (!hasErrorMessage) {
							const formCopy = Helper.deepCopy(state.form);
							dataSourceApplier.applyDataSources(
								dataSourceData,
								formCopy
							);
							store.commit(MutationType.GetForm, formCopy);
						}
						store.commit(MutationType.GetEServiceErrorMessage, {
							message,
						});
					}
				}
			}
		}
	});
};
