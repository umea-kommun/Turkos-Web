<template>
	<div class="admin-data-options">
		<div v-if="isDataSourceSpecsLoaded" class="options">
			<admin-select-list
				:id="'dataSourceSpecs-' + props.field.id"
				v-model="dataSourceConnectedToField"
				:items="dataSourceSpecs"
				item-value="dataSourceName"
				:label="$t('app.admin.adminDataOptions.dataSource.dataSource')"
				:help-text="
					fieldHasItems
						? $t(
								'app.admin.adminDataOptions.dataSource.descriptionItems'
						  )
						: $t(
								'app.admin.adminDataOptions.dataSource.description'
						  )
				"
			/>

			<!-- Data source parameters-->
			<admin-select-list
				v-if="dataSourceHasSearchParameter"
				:id="'searchParameter-' + props.field.id"
				v-model="dependsOnDataSourceSearchParameters"
				:items="dataSourceSearchParameters"
				:label="
					$t('app.admin.adminDataOptions.dataSource.searchParameter')
				"
				:help-text="
					$t(
						'app.admin.adminDataOptions.dataSource.searchParameterHelpText'
					)
				"
			/>

			<div
				v-if="
					dataSourceConnectedToField &&
					selectedDataSourceSpec &&
					field.type !== 'FieldTable'
				"
			>
				<admin-select-list
					:id="'dataSourceField-' + props.field.id"
					v-model="listFieldItemProp"
					:items="dataSourceSchemaProperties"
					:label="$t('app.admin.adminDataOptions.dataSource.field')"
					:help-text="
						$t(
							'app.admin.adminDataOptions.dataSource.fieldDescription'
						)
					"
				/>
			</div>
			<div v-if="showItemFillerOption">
				<admin-switch
					:id="'data-itemFiller-' + props.field.id"
					v-model="listFieldItemFiller"
					:label="
						$t('app.admin.adminDataOptions.dataSource.itemFiller')
					"
					:help-text="
						$t(
							'app.admin.adminDataOptions.dataSource.itemFillerHelpText'
						)
					"
				/>
			</div>

			<div v-if="resultToInPutDataSourceNames.length" class="grey-box">
				<h5>
					{{
						$t(
							'app.admin.adminDataOptions.dataSource.resultToInput'
						)
					}}
				</h5>
				<ul>
					<li
						v-for="input in resultToInPutDataSourceNames"
						:key="input"
					>
						{{ input }}
					</li>
				</ul>
			</div>
			<div
				v-if="
					store.state.form?.attributes.userRequirement
						.multipleLegitimation &&
					dataSourceConnectedToField &&
					selectedDataSourceSpec &&
					(field.type === FormFieldType.SelectList ||
						field.type === FormFieldType.RadioButton)
				"
			>
				<admin-switch
					:id="'multiple-legitimation-' + props.field.id"
					v-model="displayRuleMultipleLegitimation"
					:label="
						$t(
							'app.admin.field.checkboxForMultipleLegitimationText'
						)
					"
					:help-text="
						$t(
							'app.admin.field.checkboxForMultipleLegitimationHelpText'
						)
					"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import {
	FormFieldInterface,
	FormFieldType,
	MutationType,
} from '@/models/Enums';
import {
	IFormField,
	IRootStateDataService,
	ITitleValuePair,
} from '@/models/IForm';
import {
	IDataSourceSpecification,
	IDataSourceConnector,
	IDataSourceConnection,
} from '@/plugins/dataService/models';
import { FormFieldLookup } from '@/store/utils';
import { computed, PropType, inject } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
});

const store = useStore<IRootStateDataService>();

const dataSourceConnector = inject(
	'$dataSourceConnector'
) as IDataSourceConnector;

const isDataSourceSpecsLoaded = computed(() =>
	store.state.dataServicePlugin.dataSourceSpecs ? true : false
);

const fieldHasItems = computed(() => {
	switch (props.field.type) {
		case FormFieldType.CheckBox:
		case FormFieldType.RadioButton:
		case FormFieldType.SelectList:
			return true;
	}
	return false;
});

const dataSourceSpecs = computed(() => {
	let sources = (store.state.dataServicePlugin.dataSourceSpecs || [])
		.map((spec: IDataSourceSpecification) => {
			const fieldInterface = FormFieldLookup.getInstanceOf(props.field);
			const requiresItemEntityDataSource =
				fieldInterface === FormFieldInterface.ItemListField;
			const requiresSingleEntityDataSource =
				fieldInterface === FormFieldInterface.SingleValueField;
			const requiresSearchEntityDataSource =
				fieldInterface === FormFieldInterface.SearchField;
			let label = '';
			let disabled = false;
			if (!requiresSearchEntityDataSource) {
				if (requiresItemEntityDataSource === spec.singleEntity) {
					label = '(ej applicerbar)';
					disabled = true;
				} else if (
					requiresSingleEntityDataSource !== spec.singleEntity
				) {
					label = '(ej applicerbar)';
					disabled = true;
				}
			} else if (requiresSearchEntityDataSource !== spec.searchEntity) {
				label = '(ej applicerbar)';
				disabled = true;
			}
			return {
				title: spec.description + ' ' + label,
				dataSourceName: spec.dataSourceName,
				disabled,
			};
		})
		.filter((a) => !a.disabled);

	// sort by name
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sources = sources.sort((a: any, b: any) => (a.title > b.title ? 1 : -1));

	return [{ title: '-- Ingen koppling --', dataSourceName: '' }].concat(
		sources
	);
});

const dataSourceConnectedToField = computed({
	get: () => {
		const dataSource = dataSourceConnector.getConnection(props.field);
		return dataSource ? dataSource.dataSourceName : '';
	},
	set: (dataSourceName: string) => {
		if (!dataSourceName) {
			dataSourceConnector.removeConnection(props.field);
		} else {
			const connection: IDataSourceConnection = {
				dataSourceName,
				options: {},
			};

			const specs = store.state.dataServicePlugin.dataSourceSpecs?.find(
				(d) => d.dataSourceName === dataSourceName
			);

			if (specs?.searchEntity) {
				connection.options.dependsOnDataSourceSearchParameter = true;
			}
			if (specs?.applyDataToValueOnItemsInMultipleEntity) {
				connection.options.applyDataToValueOnItemsInMultipleEntity =
					specs?.applyDataToValueOnItemsInMultipleEntity;
			}

			dataSourceConnector.setConnection(props.field, connection);
		}
	},
});

const selectedDataSourceSpec = computed(() => {
	if (
		dataSourceConnectedToField.value &&
		store.state.dataServicePlugin.dataSourceSpecs
	) {
		return store.state.dataServicePlugin.dataSourceSpecs.find(
			(d) => d.dataSourceName === dataSourceConnectedToField.value
		);
	}
	return null;
});

function createDataSourceSchemaPropertiesList(
	list: ITitleValuePair[],
	schema: any,
	exampleData: any,
	objKey: string,
	endText: string
): void {
	Object.keys(schema).map((key) => {
		const exampleValue = exampleData[key] !== null ? exampleData[key] : '';
		const newKey = objKey !== '' ? objKey + '.' + key : key;
		let example = '';
		if (Array.isArray(exampleValue)) {
			createDataSourceSchemaPropertiesList(
				list,
				exampleValue[0],
				exampleData[key][0],
				newKey,
				' Tillhör flervals komponenter'
			);
		} else if (typeof exampleValue === 'object') {
			createDataSourceSchemaPropertiesList(
				list,
				exampleValue,
				exampleData[key],
				newKey,
				''
			);
		} else if (typeof exampleValue === 'string') {
			example = exampleValue ? ' (t.ex. ' + exampleValue + ')' : '';
			example += endText;
			list.push({
				title: newKey + example,
				value: newKey,
			});
		} else if (typeof exampleValue === 'number') {
			example = exampleValue ? ' (t.ex. ' + exampleValue + ')' : '';
			example += endText;
			list.push({
				title: newKey + example,
				value: newKey,
			});
		} else {
			list.push({
				title: newKey,
				value: newKey,
			});
		}
	});
}

const dataSourceSchemaProperties = computed(() => {
	if (selectedDataSourceSpec.value) {
		const list: ITitleValuePair[] = [];
		createDataSourceSchemaPropertiesList(
			list,
			selectedDataSourceSpec.value.schema,
			selectedDataSourceSpec.value.exampleData,
			'',
			''
		);
		return list.sort();
	}
	return [];
});

const listFieldItemProp = computed({
	get: () => {
		const dataSourceConnection = dataSourceConnector.getConnection(
			props.field
		);
		return dataSourceConnection
			? dataSourceConnection.options.itemProperty &&
			  dataSourceConnection.options.itemProperty.length > 0
				? dataSourceConnection.options.itemProperty
						.charAt(0)
						.toLowerCase() +
				  dataSourceConnection.options.itemProperty.slice(1)
				: ''
			: '';
	},
	set: (itemProperty: string | undefined) => {
		const dataSourceCon = dataSourceConnector.getConnection(props.field);
		const itemReciver = dataSourceCon
			? dataSourceCon.options.itemReciver
			: false;
		const itemFiller = dataSourceCon
			? dataSourceCon.options.itemFiller
			: false;
		const dependsOnDataSourceSearchParameter = dataSourceCon
			? dataSourceCon.options.dependsOnDataSourceSearchParameter
			: false;
		const dependsOnDataSourceSearchParameters = dataSourceCon
			? dataSourceCon.options.dependsOnDataSourceSearchParameters
			: [];
		const applyDataToValueOnItemsInMultipleEntity = dataSourceCon
			? dataSourceCon.options.applyDataToValueOnItemsInMultipleEntity
			: false;
		const dataSourceSpecs =
			store.state.dataServicePlugin.dataSourceSpecs?.find(
				(d) => d.dataSourceName === dataSourceConnectedToField.value
			);
		if (dataSourceSpecs) {
			const resultToInPutDataSourceNames =
				dataSourceSpecs.resultToInPutDataSourceNames
					? dataSourceSpecs.resultToInPutDataSourceNames
					: [];
			// update the datasource connection
			dataSourceConnector.setConnection(props.field, {
				...dataSourceCon,
				options: {
					itemProperty,
					itemReciver,
					itemFiller,
					dependsOnDataSourceSearchParameter,
					dependsOnDataSourceSearchParameters,
					resultToInPutDataSourceNames,
					applyDataToValueOnItemsInMultipleEntity,
				},
			});
		}
	},
});

const showItemFillerOption = computed(
	() =>
		FormFieldLookup.getInstanceOf(props.field) ===
			FormFieldInterface.ItemListField &&
		props.field.type !== FormFieldType.Table &&
		props.field.fieldOptions.tableGuid &&
		dataSourceConnectedToField.value &&
		selectedDataSourceSpec.value
);

/* 	
itemFiller indicates that the choices made in this field will affect
what data is being shown in the other table fields
*/
const listFieldItemFiller = computed({
	get: () => {
		const dataSourceConnection = dataSourceConnector.getConnection(
			props.field
		);
		return dataSourceConnection?.options?.itemFiller ?? false;
	},
	set: (itemFiller: boolean) => {
		const dataSourceCon = dataSourceConnector.getConnection(props.field);
		const itemProperty = dataSourceCon
			? dataSourceCon.options.itemProperty
			: '';
		const dependsOnDataSourceSearchParameter = dataSourceCon
			? dataSourceCon.options.dependsOnDataSourceSearchParameter
			: false;
		const dependsOnDataSourceSearchParameters = dataSourceCon
			? dataSourceCon.options.dependsOnDataSourceSearchParameters
			: [];
		const resultToInPutDataSourceNames = dataSourceCon
			? dataSourceCon.options.resultToInPutDataSourceNames
			: [];
		const applyDataToValueOnItemsInMultipleEntity = dataSourceCon
			? dataSourceCon.options.applyDataToValueOnItemsInMultipleEntity
			: false;
		// update the datasource connection
		dataSourceConnector.setConnection(props.field, {
			...dataSourceCon,
			options: {
				itemProperty,
				itemFiller: itemFiller || undefined,
				dependsOnDataSourceSearchParameter,
				dependsOnDataSourceSearchParameters,
				resultToInPutDataSourceNames,
				applyDataToValueOnItemsInMultipleEntity,
			},
		});
	},
});

const dataSourceSearchParameters = computed(() => {
	const lista: any = [];
	store.state.form?.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			if (
				field.type.toLowerCase() ===
					FormFieldType.TextBox.toLowerCase() ||
				(field.type.toLowerCase() ===
					FormFieldType.SelectList.toLowerCase() &&
					field.fieldOptions?.allowMultipleChoices !== true) ||
				field.type.toLowerCase() ===
					FormFieldType.SelectSearchList.toLowerCase() ||
				field.type.toLowerCase() ===
					FormFieldType.RadioButton.toLowerCase()
			) {
				if (field.guid !== props.field.guid) {
					lista.push({
						id: field.guid,
						title: field.title,
						value: field.guid,
					});
				}
			}
		});
	});
	return lista;
});

const isInTableAndTableHaveDependencies = computed(() => {
	// check if table have checked
	let haveTableGuidAndTableHaveDependencies = props.field.fieldOptions
		.tableGuid
		? true
		: false;
	if (haveTableGuidAndTableHaveDependencies) {
		store.state.form?.attributes.steps.forEach((step) => {
			step.fields.forEach((field) => {
				if (
					field.guid === props.field.fieldOptions.tableGuid &&
					Object.keys(field.fieldOptions).length > 0 &&
					field.fieldOptions.dataSource &&
					Object.keys(field.fieldOptions.dataSource.options).length >
						0
				) {
					haveTableGuidAndTableHaveDependencies = field.fieldOptions
						.dataSource.options.dependsOnDataSourceSearchParameter
						? false
						: true;
				}
			});
		});
	}
	return haveTableGuidAndTableHaveDependencies;
});

const dataSourceHasSearchParameter = computed(() => {
	return selectedDataSourceSpec.value &&
		dataSourceSearchParameters.value.length > 0 &&
		!isInTableAndTableHaveDependencies.value
		? selectedDataSourceSpec.value.searchEntity
		: false;
});

const dependsOnDataSourceSearchParameters = computed({
	get: () => {
		const dataSourceConnection = dataSourceConnector.getConnection(
			props.field
		);
		return dataSourceConnection
			? dataSourceConnection.options.dependsOnDataSourceSearchParameters
				? dataSourceConnection.options
						.dependsOnDataSourceSearchParameters[0]
				: ''
			: '';
	},
	set: (itemSearchParameter: string | undefined) => {
		const dataSourceCon = dataSourceConnector.getConnection(props.field);
		const itemReciver = dataSourceCon
			? dataSourceCon.options.itemReciver
			: false;
		const itemFiller = dataSourceCon
			? dataSourceCon.options.itemFiller
			: false;
		const itemProperty = dataSourceCon
			? dataSourceCon.options.itemProperty
			: '';
		const dependsOnDataSourceSearchParameter = dataSourceCon
			? dataSourceCon.options.dependsOnDataSourceSearchParameter
			: false;
		const dependsOnDataSourceSearchParameters: string[] = [];
		const resultToInPutDataSourceNames = dataSourceCon
			? dataSourceCon.options.resultToInPutDataSourceNames
			: [];
		const applyDataToValueOnItemsInMultipleEntity = dataSourceCon
			? dataSourceCon.options.applyDataToValueOnItemsInMultipleEntity
			: false;
		if (dependsOnDataSourceSearchParameters) {
			dependsOnDataSourceSearchParameters.push(
				itemSearchParameter as string
			);
		}
		// update the datasource connection
		dataSourceConnector.setConnection(props.field, {
			...dataSourceCon,
			options: {
				itemProperty,
				itemReciver,
				itemFiller,
				dependsOnDataSourceSearchParameter,
				dependsOnDataSourceSearchParameters,
				resultToInPutDataSourceNames,
				applyDataToValueOnItemsInMultipleEntity,
			},
		});
	},
});

const resultToInPutDataSourceNames = computed(() => {
	const descriptions: string[] = [];
	if (
		dataSourceConnectedToField.value &&
		store.state.dataServicePlugin.dataSourceSpecs
	) {
		const dataSourceSpecs =
			store.state.dataServicePlugin.dataSourceSpecs.find(
				(d) => d.dataSourceName === dataSourceConnectedToField.value
			);
		dataSourceSpecs?.resultToInPutDataSourceNames?.forEach(
			(resultToInPutDataSourceName) => {
				const dataSourceSpecs =
					store.state.dataServicePlugin.dataSourceSpecs?.find(
						(d) => d.dataSourceName === resultToInPutDataSourceName
					);
				if (dataSourceSpecs) {
					descriptions.push(dataSourceSpecs.description);
				}
			}
		);
		return descriptions;
	}
	return descriptions;
});

const displayRuleMultipleLegitimation = computed({
	get: () => {
		return props.field.displayRuleMultipleLegitimation ?? false;
	},
	set: (newValue: boolean) => {
		store.commit(MutationType.UpdateFormField, {
			fieldId: props.field.id,
			newValue,
			fieldProperty: 'displayRuleMultipleLegitimation',
		});
	},
});
</script>

<style scoped lang="scss">
.admin-data-options {
	.options {
		border-left: solid $primary 2px;
		padding: 0 24px;
		margin: 10px 0;
		margin-top: 18px;
		margin-bottom: 30px;

		h3 {
			font-size: size(18);
			color: $black;
		}
		p {
			margin-bottom: 2px;
		}

		.grey-box {
			margin-top: 20px;
			padding: 10px;
			background-color: $grey-lighten-2;
			border-radius: $border-radius;
			color: $black;

			li {
				margin-left: 20px;
			}
		}
	}
}
</style>
