<template>
	<div class="advanced-sharepoint-field-integration">
		<h4>
			{{
				$t(
					'component.adminIntegrationAdvancedSharepoint.fieldIntegration.title'
				)
			}}
		</h4>
		<div
			v-for="(mapping, index) in fieldMapping"
			:key="index + 'sharepointField'"
		>
			<div
				v-if="mapping.fieldGuid === props.field.guid"
				class="column-wrap"
			>
				<div class="mb-4">
					{{
						$t(
							'component.adminIntegrationAdvancedSharepoint.fieldIntegration.label'
						)
					}}
				</div>
				<v-icon class="ml-2 mr-2 mb-4" icon="arrow_forward" />
				<div class="fill">
					<admin-select-list
						:id="index + 'sharepointColumn'"
						:model-value="mapping.sharepointFieldGuid"
						@update:model-value="
							(val) => changeSharepointField(val, index)
						"
						:items="getSharepointListFields(fieldMapping)"
						item-value="guid"
						:loading="loading"
					/>
				</div>
				<v-btn
					class="ml-2 mb-4"
					icon
					@click="deleteFieldMapping(index)"
					variant="text"
				>
					<v-icon color="red" icon="delete_outline" />
				</v-btn>
			</div>
		</div>

		<v-btn
			:disabled="!listGuid"
			@click="addFieldMapping"
			variant="text"
			color="primary"
			class="add-btn ma-0"
		>
			<v-icon icon="add" class="mr-1" />
			{{
				$t(
					'component.adminIntegrationAdvancedSharepoint.field.list.addNewConnection'
				)
			}}
		</v-btn>
	</div>
</template>

<script setup lang="ts">
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import {
	IFormField,
	IFormIntegration,
	IFormIntegrationOption,
	IRootState,
} from '@/models/IForm';
import { computed, PropType, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import {
	ISharepointField,
	ISharepointFieldMapping,
	ISharepointIntegrationRootState,
	ISharpointMapping,
} from './models';

interface SharepointRootState extends IRootState {
	sharepointIntegration: ISharepointIntegrationRootState;
}
const props = defineProps({
	integration: {
		type: Object as PropType<IFormIntegration>,
		required: true,
	},
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
	isNew: {
		type: Boolean,
		default: false,
	},
	activeTab: Number,
});

const emit = defineEmits(['save']);
const store = useStore<SharepointRootState>();

const loading = ref(false);

const integrationEdit = computed({
	get: () => props.integration,
	set: (newValue: IFormIntegration) => emit('save', newValue),
});

const getOption = (key: string): IFormIntegrationOption | undefined =>
	integrationEdit.value?.options.find((option) => option.key === key);

const setOptionData = (key: string, data: unknown): void => {
	if (!integrationEdit.value) {
		return;
	}
	const option = getOption(key);
	let newOptions: any = [];
	if (option) {
		newOptions = integrationEdit.value?.options.map((option) => {
			if (option.key === key) {
				return { ...option, data };
			}
			return option;
		});
		if (newOptions) {
			integrationEdit.value = {
				...integrationEdit.value,
				options: newOptions,
			};
		}
	}
};

const sharepointWebsite = computed(
	() => getOption('sharepointWebsite')?.value ?? ''
);

const listGuid = computed(() => getOption('listGuid')?.value ?? '');

const fieldMapping = computed({
	get: () => {
		return (getOption('fieldMapping')?.data ??
			[]) as ISharepointFieldMapping[];
	},
	set: (newValue: ISharepointFieldMapping[]) => {
		setOptionData('fieldMapping', newValue);
	},
});

const addFieldMapping = (): void => {
	fieldMapping.value = [
		...fieldMapping.value,
		{
			fieldGuid: props.field.guid,
			sharepointFieldGuid: '',
		},
	];
};
const deleteFieldMapping = (index: number): void => {
	fieldMapping.value = fieldMapping.value.filter((_, i) => i !== index);
};

const changeSharepointField = (
	sharepointFieldGuid: string,
	index: number
): void => {
	fieldMapping.value = fieldMapping.value.map((map, i) => {
		if (i === index) {
			return { ...map, sharepointFieldGuid };
		}
		return map;
	});
};

/** Connection to columns */
const getSharepointListFields = (
	mapping?: ISharpointMapping[]
): { guid: string; title: string }[] => {
	if (store.state.sharepointIntegration.fields) {
		const copy = store.state.sharepointIntegration.fields.map(
			(field: ISharepointField) => {
				return {
					title: field.title,
					guid: field.guid,
					disabled:
						mapping &&
						mapping.some(
							(m) => m.sharepointFieldGuid === field.guid
						),
				};
			}
		);
		// Can't disable items in vuetify anymore, so now sharepoint columns can be selected multiple times
		// see: https://github.com/vuetifyjs/vuetify/issues/16501

		return [{ guid: '', title: '' }].concat(copy);
	}
	return [];
};

onMounted(async () => {
	if (sharepointWebsite.value && listGuid.value) {
		loading.value = true;
		await store.dispatch('sharepointIntegration/loadFields', {
			partialUrl: sharepointWebsite.value,
			listGuid: listGuid.value,
		});
		loading.value = false;
	}
});
</script>

<style scoped lang="scss">
.advanced-sharepoint-field-integration {
	h4 {
		margin-bottom: 10px;
	}
	.column-wrap {
		display: flex;
		align-items: center;

		.fill {
			flex: 1;
			align-items: center;
		}

		.v-btn {
			margin: 0;
		}
	}
}
</style>
