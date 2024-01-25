<template>
	<div class="public-360-integration">
		<v-row>
			<v-col>
				<admin-text-box
					id="title"
					name="title"
					v-model="title"
					:label="
						$t('component.adminIntegrationPublic360.field.title')
					"
					:help-text="
						$t(
							'component.adminIntegrationPublic360.field.titleHelpText'
						)
					"
					rules="required"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-text-box
					id="caseTitle"
					name="caseTitle"
					v-model="caseTitle"
					:label="
						$t(
							'component.adminIntegrationPublic360.field.caseTitle'
						)
					"
					:help-text="
						$t(
							'component.adminIntegrationPublic360.field.caseTitleHelpText'
						)
					"
					rules="required"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-text-box
					id="keyWord"
					name="keyWord"
					v-model="keyWord"
					:label="
						$t('component.adminIntegrationPublic360.field.keyWord')
					"
					:help-text="
						$t(
							'component.adminIntegrationPublic360.field.keyWordHelpText'
						)
					"
					rules="required"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-switch
					id="multipleEnterprises"
					v-model="multipleEnterprises"
					:label="
						$t(
							'component.adminIntegrationPublic360.field.multipleEnterprises'
						)
					"
					:checkbox="true"
					hide-details
				/>
			</v-col>
		</v-row>
		<span v-if="!multipleEnterprises">
			<v-row>
				<v-col>
					<admin-select-list
						id="public360Enterprise"
						name="public360Enterprise"
						v-model="public360Enterprise"
						:items="public360Enterprises ?? []"
						:label="
							$t(
								'component.adminIntegrationPublic360.field.enterprise'
							)
						"
						item-value="id"
						item-title="title"
						:loading="busyRequestingServerEnterprise"
						rules="required"
						:standalone="false"
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<admin-select-list
						id="public360AccessGroup"
						name="public360AccessGroup"
						v-model="public360AccessGroup"
						:items="public360AccessGroups ?? []"
						:label="
							$t(
								'component.adminIntegrationPublic360.field.accessGroup'
							)
						"
						item-value="id"
						item-title="title"
						:loading="busyRequestingServerAccessGroup"
						rules="required"
						:standalone="false"
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<admin-select-list
						id="public360Journal"
						name="public360Journal"
						v-model="public360Journal"
						:items="public360Journals ?? []"
						:label="
							$t(
								'component.adminIntegrationPublic360.field.journal'
							)
						"
						item-value="id"
						item-title="title"
						:loading="busyRequestingServerJournalUnit"
						rules="required"
						:standalone="false"
					/>
				</v-col>
			</v-row>
		</span>
		<v-row>
			<v-col>
				<admin-select-list
					id="public360DocumentCategory"
					name="public360DocumentCategory"
					v-model="public360DocumentCategory"
					:items="public360DocumentCategories ?? []"
					:label="
						$t(
							'component.adminIntegrationPublic360.field.documentCategory'
						)
					"
					item-value="id"
					item-title="title"
					:loading="busyRequestingServerDocumentCategory"
					rules="required"
					:standalone="false"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-select-list
					id="public360DocumentArchive"
					name="public360DocumentArchive"
					v-model="public360DocumentArchive"
					:items="public360DocumentArchives ?? []"
					:label="
						$t(
							'component.adminIntegrationPublic360.field.documentArchive'
						)
					"
					item-value="id"
					item-title="title"
					:loading="busyRequestingServerDocumentArchive"
					rules="required"
					:standalone="false"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-select-list
					id="public360DocumentStatus"
					name="public360DocumentStatus"
					v-model="public360DocumentStatus"
					:items="public360DocumentStatuses ?? []"
					:label="
						$t(
							'component.adminIntegrationPublic360.field.documentStatus'
						)
					"
					item-value="id"
					item-title="title"
					:loading="busyRequestingServerDocumentStatus"
					rules="required"
					:standalone="false"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-switch
					id="confidential"
					v-model="confidential"
					:label="
						$t(
							'component.adminIntegrationPublic360.field.confidential'
						)
					"
					:checkbox="true"
					hide-details
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-switch
					id="addContact"
					v-model="addContact"
					:label="
						$t(
							'component.adminIntegrationPublic360.field.addContact'
						)
					"
					:checkbox="true"
					hide-details
				/>
			</v-col>
		</v-row>
		<v-row v-if="addContact">
			<v-col>
				<admin-select-list
					id="public360CaseRole"
					name="public360CaseRole"
					v-model="public360CaseRole"
					:items="public360CaseRoles ?? []"
					:label="
						$t('component.adminIntegrationPublic360.field.caseRole')
					"
					item-value="id"
					item-title="title"
					:loading="busyRequestingServerCaseRole"
					rules="required"
					:standalone="false"
				/>
			</v-col>
		</v-row>
	</div>
</template>

<script setup lang="ts">
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import { AvailableIntegration } from '@/models/Enums';
import {
	IFormIntegration,
	IFormIntegrationOption,
	IRootState,
} from '@/models/IForm';
import { computed, PropType, ref, onMounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import {
	IPublic360IntegrationRootState,
	Public360MappingParameter,
} from './models';

interface Public360RootState extends IRootState {
	public360Integration: IPublic360IntegrationRootState;
}

const props = defineProps({
	modelValue: {
		type: Object as PropType<IFormIntegration>,
		required: true,
	},
	isNew: {
		type: Boolean,
		default: false,
	},
	activeTab: Number,
});

const emit = defineEmits(['update:modelValue']);

const store = useStore<Public360RootState>();
const { t } = useI18n();

const busyRequestingServerEnterprise = ref(false);
const busyRequestingServerAccessGroup = ref(false);
const busyRequestingServerJournalUnit = ref(false);
const busyRequestingServerDocumentArchive = ref(false);
const busyRequestingServerDocumentCategory = ref(false);
const busyRequestingServerDocumentStatus = ref(false);
const busyRequestingServerCaseRole = ref(false);

const integration = computed({
	get: () => props.modelValue,
	set: (newValue: IFormIntegration) => emit('update:modelValue', newValue),
});

const getOption = (key: string): IFormIntegrationOption | undefined =>
	integration.value.options.find((option) => option.key === key);

const setOption = (key: string, value: string): void => {
	const option = getOption(key);
	let newOptions = [];
	if (option) {
		newOptions = integration.value.options.map((option) => {
			if (option.key === key) {
				return { ...option, value };
			}
			return option;
		});
	} else {
		newOptions = [...integration.value.options, { key, value }];
	}
	integration.value = { ...integration.value, options: newOptions };
};

/** Settings */
const title = computed({
	get: () => getOption(Public360MappingParameter.Title)?.value ?? '',
	set: (newValue: string) =>
		setOption(Public360MappingParameter.Title, newValue),
});

const caseTitle = computed({
	get: () => getOption(Public360MappingParameter.CaseTitle)?.value ?? '',
	set: (newValue: string) =>
		setOption(Public360MappingParameter.CaseTitle, newValue),
});

const keyWord = computed({
	get: () => getOption(Public360MappingParameter.KeyWord)?.value ?? '',
	set: (newValue: string) =>
		setOption(Public360MappingParameter.KeyWord, newValue),
});

const multipleEnterprises = computed({
	get: () =>
		getOption(Public360MappingParameter.MultipleEnterprises)?.value ===
		'true',
	set: (newValue: boolean) =>
		setOption(
			Public360MappingParameter.MultipleEnterprises,
			newValue.toString()
		),
});

const public360Enterprises = computed(() => {
	return store.state.public360Integration.enterprises;
});

const public360Enterprise = computed({
	get: () =>
		getOption(Public360MappingParameter.ResponsibleEnterpriseRecno)
			?.value ?? '',
	set: (newValue: string) =>
		setOption(
			Public360MappingParameter.ResponsibleEnterpriseRecno,
			newValue
		),
});

const public360AccessGroups = computed(
	() => store.state.public360Integration.accessGroups
);

const public360AccessGroup = computed({
	get: () =>
		getOption(Public360MappingParameter.AccessGroupRecno)?.value ?? '',
	set: (newValue: string) =>
		setOption(Public360MappingParameter.AccessGroupRecno, newValue),
});

const public360Journals = computed(
	() => store.state.public360Integration.journals
);

const public360Journal = computed({
	get: () =>
		getOption(Public360MappingParameter.JournalUnitRecno)?.value ?? '',
	set: (newValue: string) =>
		setOption(Public360MappingParameter.JournalUnitRecno, newValue),
});

const public360DocumentCategories = computed(
	() => store.state.public360Integration.documentCategories
);

const public360DocumentCategory = computed({
	get: () =>
		getOption(Public360MappingParameter.DocumentCategoryRecno)?.value ?? '',
	set: (newValue: string) =>
		setOption(Public360MappingParameter.DocumentCategoryRecno, newValue),
});

const public360DocumentArchives = computed(
	() => store.state.public360Integration.documentArchives
);

const public360DocumentArchive = computed({
	get: () =>
		getOption(Public360MappingParameter.DocumentArchiveRecno)?.value ?? '',
	set: (newValue: string) =>
		setOption(Public360MappingParameter.DocumentArchiveRecno, newValue),
});

const public360DocumentStatuses = computed(
	() => store.state.public360Integration.documentStatuses
);

const public360DocumentStatus = computed({
	get: () =>
		getOption(Public360MappingParameter.DocumentStatusRecno)?.value ?? '',
	set: (newValue: string) =>
		setOption(Public360MappingParameter.DocumentStatusRecno, newValue),
});

const confidential = computed({
	get: () =>
		getOption(Public360MappingParameter.Confidential)?.value === 'true',
	set: (newValue: boolean) =>
		setOption(Public360MappingParameter.Confidential, newValue.toString()),
});

const addContact = computed({
	get: () =>
		getOption(Public360MappingParameter.AddContact)?.value === 'true',
	set: (newValue: boolean) => {
		setOption(Public360MappingParameter.AddContact, newValue.toString());

		// Focus case role field
		if (newValue) {
			nextTick().then(
				() => document.getElementById('public360CaseRole')?.focus()
			);
		}
	},
});

const public360CaseRoles = computed(
	() => store.state.public360Integration.caseRoles
);

const public360CaseRole = computed({
	get: () => getOption(Public360MappingParameter.CaseRole)?.value ?? '',
	set: (newValue: string) =>
		setOption(Public360MappingParameter.CaseRole, newValue),
});

async function fetchEnterprises(): Promise<void> {
	busyRequestingServerEnterprise.value = true;
	await store.dispatch('public360Integration/loadPublic360Enterprises');
	busyRequestingServerEnterprise.value = false;
}

async function fetchAccessGroups(): Promise<void> {
	busyRequestingServerAccessGroup.value = true;
	await store.dispatch('public360Integration/loadPublic360AccessGroups');
	busyRequestingServerAccessGroup.value = false;
}

async function fetchJournals(): Promise<void> {
	busyRequestingServerJournalUnit.value = true;
	await store.dispatch('public360Integration/loadPublic360Journals');
	busyRequestingServerJournalUnit.value = false;
}

async function fetchDocumentCategories(): Promise<void> {
	busyRequestingServerDocumentCategory.value = true;
	await store.dispatch(
		'public360Integration/loadPublic360DocumentCategories'
	);
	busyRequestingServerDocumentCategory.value = false;
}

async function fetchDocumentArchives(): Promise<void> {
	busyRequestingServerDocumentArchive.value = true;
	await store.dispatch('public360Integration/loadPublic360DocumentArchives');
	busyRequestingServerDocumentArchive.value = false;
}

async function fetchDocumentStatuses(): Promise<void> {
	busyRequestingServerDocumentStatus.value = true;
	await store.dispatch('public360Integration/loadPublic360DocumentStatuses');
	busyRequestingServerDocumentStatus.value = false;
}

async function fetchCaseRoles(): Promise<void> {
	busyRequestingServerCaseRole.value = true;
	await store.dispatch('public360Integration/loadPublic360CaseRoles');
	busyRequestingServerCaseRole.value = false;
}

onMounted(async () => {
	fetchEnterprises();
	fetchAccessGroups();
	fetchJournals();
	fetchDocumentArchives();
	fetchDocumentCategories();
	fetchDocumentStatuses();
	fetchCaseRoles();

	if (props.isNew) {
		// Set default options for new integration
		const defaultOptions: IFormIntegrationOption[] = [
			{
				key: Public360MappingParameter.DatasourceName,
				value: AvailableIntegration.Public360,
			},
			{ key: Public360MappingParameter.Title, value: '' },
			{ key: Public360MappingParameter.CaseTitle, value: '' },
			{
				key: Public360MappingParameter.ResponsibleEnterpriseRecno,
				value: '',
			},
			{ key: Public360MappingParameter.AccessGroupRecno, value: '' },
			{ key: Public360MappingParameter.JournalUnitRecno, value: '' },
			{ key: Public360MappingParameter.DocumentArchiveRecno, value: '' },
			{ key: Public360MappingParameter.DocumentCategoryRecno, value: '' },
			{ key: Public360MappingParameter.DocumentStatusRecno, value: '' },
			{ key: Public360MappingParameter.Confidential, value: 'false' },
			{ key: Public360MappingParameter.AddContact, value: 'false' },
			{ key: Public360MappingParameter.CaseRole, value: '' },
			{ key: Public360MappingParameter.KeyWord, value: '' },
		];

		integration.value = { ...integration.value, options: defaultOptions };
	}
});
</script>

<style scoped lang="scss">
.public-360-integration {
	h2 {
		font-size: size(18);
	}
	.list-of-fields {
		border-bottom: solid 1px $grey-lighten-4;
		padding-bottom: 12px;
		margin-bottom: 12px;
		&:last-child {
			border-bottom: none;
		}
		.v-row {
			flex-wrap: nowrap;
			align-items: center;
			margin: 0;

			.v-col {
				flex: 1;
				align-items: center;
				padding: 0;
				&.btn-wrap {
					flex: 0;
					margin-bottom: 1rem;
					min-width: 56px;
					text-align: center;
					.v-btn {
						color: $error;
					}
				}
			}
			:deep(.component-base-form-field label) {
				display: none !important;
			}
		}
		.v-btn {
			margin: 0;

			&.add-btn .v-icon {
				margin-right: 4px;
			}
		}
	}
}
</style>
