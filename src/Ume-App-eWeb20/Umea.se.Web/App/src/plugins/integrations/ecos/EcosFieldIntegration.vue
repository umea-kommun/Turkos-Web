<template>
	<div>
		<!-- Ecos Part field (utdata) -->
		<admin-select-list
			v-if="showEcosPart"
			:id="props.field.guid + 'ecos-item-prop'"
			:label="
				$t('component.adminIntegrationEcosIntegration.ecosPartField')
			"
			:help-text="
				$t(
					'component.adminIntegrationEcosIntegration.ecosPartFieldHelpText'
				)
			"
			v-model="listFieldItemProp"
			:items="dataSourceSchemaProperties"
		/>
		<!-- Template role/type (mallkälla)-->
		<admin-select-list
			v-if="showTemplateRole"
			:id="props.field.guid"
			:label="
				$t('component.adminIntegrationEcosIntegration.templateRole')
			"
			:help-text="
				$t(
					'component.adminIntegrationEcosIntegration.templateRoleHelpText'
				)
			"
			v-model="templateListFieldItemProp"
			:items="getTemplateItems"
			item-value="guid"
		/>
	</div>
</template>

<script setup lang="ts">
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import {
	FormFieldType,
	MutationType,
	TemplateOptionType,
} from '@/models/Enums';
import {
	IFormField,
	IFormIntegration,
	IRootState,
	ITemplateOption,
} from '@/models/IForm';
import {
	IDataServicePluginRootStore,
	IDataSourceConnector,
} from '@/plugins/dataService/models';
import { Helper } from '@/utils/helper';
import { computed, PropType, onMounted, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const props = defineProps({
	integration: {
		type: Object as PropType<IFormIntegration>,
		required: true,
	},
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
});

const ECOS_DATA_SOURCE_NAME = 'EcosEmptyPart';

const { t } = useI18n();
interface EcosRootState extends IRootState {
	dataServiceOutPutPlugin: IDataServicePluginRootStore;
}

const store = useStore<EcosRootState>();

const showEcosPart = computed(() => {
	switch (props.field.type) {
		case FormFieldType.PersonalNumber:
		case FormFieldType.TextBox:
		case FormFieldType.TextArea:
			return true;
	}
	return false;
});

const showTemplateRole = computed(() => {
	switch (props.field.type) {
		case FormFieldType.FileUpload:
		case FormFieldType.PersonalNumber:
		case FormFieldType.TextBox:
		case FormFieldType.TextArea:
			return true;
	}
	return false;
});
const dataSourceConnector = inject(
	'$dataSourceConnector'
) as IDataSourceConnector;

const selectedDataSourceSpecOutPut = computed(() => {
	if (store.state.dataServiceOutPutPlugin.dataSourceSpecsOutPut) {
		return store.state.dataServiceOutPutPlugin.dataSourceSpecsOutPut.find(
			(d) => d.dataSourceName === ECOS_DATA_SOURCE_NAME
		);
	}
	return null;
});

const dataSourceSchemaProperties = computed(() => {
	if (selectedDataSourceSpecOutPut.value) {
		return [
			{
				title: t(
					'component.adminIntegrationEcosIntegration.listDefaultTitle'
				),
				value: '',
			},
		].concat(
			Object.keys(selectedDataSourceSpecOutPut.value.schema)
				.sort()
				.map((key) => {
					const exampleValue =
						selectedDataSourceSpecOutPut.value?.exampleData[key];
					const example =
						typeof exampleValue === 'string' && exampleValue
							? ' (t.ex. ' + exampleValue + ')'
							: '';
					return {
						title: key + example,
						value: key,
					};
				})
		);
	}
	return [];
});

const listFieldItemProp = computed({
	get: () => {
		const dataSourceConnection = dataSourceConnector.getOutPutConnection(
			props.field
		);
		return dataSourceConnection
			? dataSourceConnection?.options.itemProperty
			: '';
	},
	set: (itemProperty: string | undefined) => {
		if (!itemProperty) {
			dataSourceConnector.removeOutPutConnection(props.field);
		} else {
			const dataSourceConnection =
				dataSourceConnector.getOutPutConnection(props.field);
			// update the datasource connection
			dataSourceConnector.setOutPutConnection(props.field, {
				...dataSourceConnection,
				dataSourceName: ECOS_DATA_SOURCE_NAME,
				options: { itemProperty },
			});
		}
	},
});

// Template role/type
const selectedTemplateItem = computed(() => {
	if (store.state.ecos) {
		const ecosList = Helper.deepCopy(store.state.ecos).sort(
			Helper.sortByTitle
		);
		return ecosList.find(
			(d) => d.guid === store.state.form?.attributes.templateGuid
		)?.options;
	}
	return null;
});

const getTemplateItems = computed(() => {
	if (selectedTemplateItem.value) {
		const listan = selectedTemplateItem.value.filter(
			(f) => f.type !== TemplateOptionType.MunicipalityCode.toString()
		);
		return [
			{
				title: t(
					'component.adminIntegrationEcosIntegration.listDefaultTitle'
				),
				guid: '',
			},
		].concat(listan) as ITemplateOption[];
	}
	return [];
});

const templateListFieldItemProp = computed({
	get: () => {
		return (
			props.field.fieldOptions.templateSource?.options?.itemProperty
				?.guid ?? ''
		);
	},
	set: (guid: string | undefined) => {
		if (!guid) {
			const newOpts = { ...props.field.fieldOptions };
			if (newOpts) {
				delete newOpts.templateSource;
				store.commit(MutationType.UpdateFormField, {
					fieldId: props.field.id,
					newValue: newOpts,
					fieldProperty: 'fieldOptions',
				});
			}
		} else {
			const itemProperty = getTemplateItems.value.find(
				(item) => item.guid === guid
			);
			if (!itemProperty || !store.state.form) {
				return;
			}

			const newOpts = { ...props.field.fieldOptions };
			newOpts.templateSource = {
				templateSourceGuid: store.state.form.attributes.templateGuid,
				options: {
					itemProperty: {
						guid: itemProperty.guid,
						parameterName: itemProperty.parameterName,
					},
				},
			};
			store.commit(MutationType.UpdateFormField, {
				fieldId: props.field.id,
				newValue: newOpts,
				fieldProperty: 'fieldOptions',
			});
		}
	},
});

onMounted(async () => {
	await store.dispatch('getEcosList');
});
</script>
