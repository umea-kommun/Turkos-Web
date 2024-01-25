<template>
	<div class="ecos-integration">
		<v-row>
			<v-col>
				<admin-text-box
					id="ecos-title"
					name="ecos-title"
					v-model="title"
					:label="
						$t(
							'component.adminIntegrationEcosIntegration.field.title'
						)
					"
					:help-text="
						$t(
							'component.adminIntegrationEcosIntegration.field.titleHelpText'
						)
					"
					rules="required"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-select-list
					id="ecos-template"
					name="ecos-template"
					:label="
						$t(
							'component.adminIntegrationEcosIntegration.field.template'
						)
					"
					:help-text="
						$t(
							'component.adminIntegrationEcosIntegration.field.templateHelpText'
						)
					"
					v-model="templateGuid"
					:items="templates"
					:loading="loadingTemplates"
					:standalone="false"
					:disabled="integration.id !== 0"
					rules="required"
				/>
			</v-col>
		</v-row>
	</div>
</template>

<script setup lang="ts">
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import { MutationType } from '@/models/Enums';
import {
	IFormIntegration,
	IFormIntegrationOption,
	IRootState,
	ITitleValuePair,
} from '@/models/IForm';
import { Helper } from '@/utils/helper';
import { computed, PropType, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
	modelValue: {
		type: Object as PropType<IFormIntegration>,
		required: true,
	},
});

const emit = defineEmits(['update:modelValue']);
const store = useStore<IRootState>();

const form = computed(() => store.state.form);

const integration = computed({
	get: () => props.modelValue,
	set: (newValue: IFormIntegration) => {
		emit('update:modelValue', newValue);
	},
});

const getOption = (key: string): IFormIntegrationOption | undefined =>
	integration.value.options.find((option) => option.key === key);

const setOption = (key: string, value: string): void => {
	const option = getOption(key);
	if (option) {
		option.value = value;
	} else {
		integration.value.options.push({ key, value });
	}
};

const title = computed({
	get: () => getOption('title')?.value ?? '',
	set: (newValue: string) => setOption('title', newValue),
});

function sortArrayList(list: ITitleValuePair[]): ITitleValuePair[] {
	// tslint:disable-next-line:only-arrow-functions
	return list.sort(function (a, b) {
		const x = a.title?.toLowerCase();
		const y = b.title?.toLowerCase();
		if (x < y) {
			return -1;
		}
		if (x > y) {
			return 1;
		}
		return 0;
	});
}

const templates = computed(() => {
	const defaultList: ITitleValuePair[] = [];
	if (store.state.templates !== null) {
		const temp: ITitleValuePair[] = [];
		store.state.templates.forEach((element) => {
			temp.push({
				value: element.guid,
				title: element.title,
			});
		});
		const selectedItem = sortArrayList(temp);
		return defaultList.concat(selectedItem);
	} else {
		return defaultList;
	}
});

const updateTemplateOptions = (): void => {
	// Clear all temp old template options (if any)
	integration.value.options = integration.value.options.filter(
		(option) => option.key === 'datasourcename' || option.key === 'title'
	);

	if (store.state.templates !== null) {
		const templateGuid = store.state.form?.attributes.templateGuid;
		const templateList = Helper.deepCopy(store.state.templates).find(
			(f) => f.guid === templateGuid
		);
		// Set new options from selected template
		templateList?.options.forEach((element) => {
			if (
				element.type === 'CaseSubTitle' ||
				element.type === 'MunicipalityCode'
			) {
				element.guid = element.title;
				element.parameterName = element.type;
			}
			setOption(element.parameterName, element.guid);
		});
	}
};

const templateGuid = computed({
	get: () => form.value?.attributes.templateGuid ?? '',
	set: (newTemplate: string) => {
		// update form set templateGuid
		store.commit(MutationType.UpdateFormProperty, {
			newValue: newTemplate,
			fieldProperty: 'templateGuid',
		});

		updateTemplateOptions();
	},
});

const loadingTemplates = ref(false);
onMounted(async () => {
	loadingTemplates.value = true;
	await store.dispatch('getTemplateList');
	await store.dispatch('onPremIntegration/loadDataSources');
	loadingTemplates.value = false;

	if (getOption('datasourcename')?.value !== 'EcosIntegration') {
		setOption('datasourcename', 'EcosIntegration');
	}
	if (form.value?.attributes.templateGuid && integration.value.id === 0) {
		updateTemplateOptions();
	}
});
</script>

<style scoped lang="scss">
.ecos-integration {
	:deep(.v-field--disabled) {
		opacity: 0.8;
	}
}
</style>
