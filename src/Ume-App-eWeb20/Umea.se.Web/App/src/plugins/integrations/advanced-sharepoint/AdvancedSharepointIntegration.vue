<template>
	<div class="advanced-sharepoint-integration">
		<v-window :model-value="activeTab" :disabled="true">
			<!-- Settings tab -->
			<v-window-item :value="0">
				<v-row>
					<v-col>
						<admin-text-box
							id="title"
							name="title-tab-0"
							v-model="title"
							:label="
								$t(
									'component.adminIntegrationAdvancedSharepoint.field.title'
								)
							"
							:help-text="
								$t(
									'component.adminIntegrationAdvancedSharepoint.field.titleHelpText'
								)
							"
							rules="required"
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<admin-select-list
							id="sharepointWebsite"
							name="sharepointWebsite-tab-0"
							v-model="sharepointWebsite"
							:items="sharepointWebsites ?? []"
							:label="
								$t(
									'component.adminIntegrationAdvancedSharepoint.field.siteTitle'
								)
							"
							item-value="partialURL"
							item-title="name"
							:loading="busyRequestingServer"
							rules="required"
							:standalone="false"
						>
							<template v-slot:addLink>
								<v-btn
									variant="text"
									color="primary"
									class="add-link-btn"
									@click.prevent="openDialog('dialogSite')"
								>
									<v-icon icon="add" />
									{{
										$t(
											'component.adminIntegrationAdvancedSharepoint.field.addSiteTitle'
										)
									}}
								</v-btn>
							</template>
						</admin-select-list>
						<div class="mb-3" v-if="siteTitleLink !== ''">
							Sharepoint url :
							<a :href="siteTitleLink" target="_blank">{{
								siteTitleLink
							}}</a>
						</div>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<admin-select-list
							id="sharepointList"
							name="sharepointList-tab-0"
							v-model="listGuid"
							:items="sharepointLists ?? []"
							:label="
								$t(
									'component.adminIntegrationAdvancedSharepoint.field.siteList'
								)
							"
							item-value="guid"
							:loading="busyRequestingServer"
							:disabled="
								busyRequestingServer || !sharepointWebsite
							"
							rules="required"
							:standalone="false"
						>
							<template v-if="sharepointWebsite" v-slot:addLink>
								<v-btn
									variant="text"
									color="primary"
									class="add-link-btn"
									@click.prevent="openDialog('dialogList')"
								>
									<v-icon icon="add" />
									{{
										$t(
											'component.adminIntegrationAdvancedSharepoint.field.addSiteList'
										)
									}}
								</v-btn>
							</template>
						</admin-select-list>
						<div class="mb-3" v-if="siteListTitleLink !== ''">
							Sharepoint lista url :
							<a :href="siteListTitleLink" target="_blank">{{
								siteListTitleLink
							}}</a>
						</div>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<admin-switch
							id="uploadFile"
							v-model="uploadFile"
							:label="
								$t(
									'component.adminIntegrationAdvancedSharepoint.field.uploadFile'
								)
							"
							:checkbox="true"
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<admin-switch
							class="anonymize-checkbox"
							id="anonymizeTitle"
							v-model="anonymizeTitle"
							:label="
								$t(
									'component.adminIntegrationAdvancedSharepoint.field.anonymizeTitle'
								)
							"
							:checkbox="true"
						/>
					</v-col>
				</v-row>
			</v-window-item>

			<!-- Tab for connecting fields -->
			<v-window-item :value="1">
				<div
					v-for="duplicate in duplicateSharepointColumns"
					:key="duplicate.guid"
					class="connection-warning"
				>
					<v-icon icon="info" />
					{{
						$t(
							'component.adminIntegrationAdvancedSharepoint.columnXHasNDuplicates',
							[duplicate.title, duplicate.usage]
						)
					}}
				</div>
				<!-- Form fields -->
				<div class="list-of-fields">
					<h2 class="mb-2">
						{{
							$t(
								'component.adminIntegrationAdvancedSharepoint.fieldMapping'
							)
						}}
					</h2>

					<v-row class="labels" v-if="fieldMapping?.length">
						<v-col>
							<label>
								{{
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.fieldTitle'
									)
								}}
							</label>
						</v-col>
						<v-col>
							<label>
								{{
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.sharepointColumnTitle'
									)
								}}
							</label>
						</v-col>
					</v-row>

					<v-row
						v-for="(mapping, index) in fieldMapping"
						:key="index + 'sharepointField'"
					>
						<v-col>
							<admin-select-list
								:id="index + 'formField'"
								:name="index + 'formField-tab-1'"
								:label="
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.fieldTitle'
									)
								"
								v-model="mapping.fieldGuid"
								:items="formFields"
								item-value="guid"
								rules="required"
								:standalone="false"
							>
								<template v-slot:item="{ item, select }">
									<v-list-item
										class="sharepoint-field-select-item"
										@click="select(item)"
										:disabled="
											(item.raw as SPFormField).disabled
										"
										:class="{
											['bold']: (item.raw as SPFormField)
												.bold,
											['header']: (
												item.raw as SPFormField
											).header,
										}"
										:active="
											(item.raw as SPFormField).guid ===
											mapping.fieldGuid
										"
									>
										{{ item.title }}
									</v-list-item>
								</template>
							</admin-select-list>
						</v-col>
						<v-col class="btn-wrap">
							<v-icon icon="arrow_forward" />
						</v-col>
						<v-col>
							<admin-select-list
								:id="index + 'sharepointColumn1'"
								:name="index + 'sharepointColumn1-tab-1'"
								:label="
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.sharepointColumnTitle'
									)
								"
								v-model="mapping.sharepointFieldGuid"
								:items="getSharepointListFields(fieldMapping)"
								item-value="guid"
								rules="required"
								:standalone="false"
							>
								<template
									v-if="
										isColumnAlreadyUsed(
											mapping.sharepointFieldGuid
										)
									"
									v-slot:append-inner
								>
									<v-icon
										class="duplicate-icon"
										icon="info"
										:title="
											$t(
												'component.adminIntegrationAdvancedSharepoint.columnDuplicateTooltip'
											)
										"
									/>
								</template>
							</admin-select-list>
						</v-col>
						<v-col class="btn-wrap">
							<v-btn
								icon
								@click="deleteFieldMapping(index)"
								variant="text"
							>
								<v-icon color="red" icon="delete_outline" />
							</v-btn>
						</v-col>
					</v-row>
					<v-btn
						:disabled="!listGuid"
						@click="addFieldMapping"
						variant="text"
						color="primary"
						class="add-btn"
					>
						<v-icon icon="add" />
						{{
							$t(
								'component.adminIntegrationAdvancedSharepoint.field.list.addNewConnection'
							)
						}}
					</v-btn>
				</div>

				<!-- Contact info -->
				<div class="list-of-fields">
					<h2 class="mb-2">
						{{
							$t(
								'component.adminIntegrationAdvancedSharepoint.contactInfoMapping'
							)
						}}
					</h2>

					<v-row class="labels" v-if="contactInfoMapping?.length">
						<v-col>
							<label>
								{{
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.addressInfoTitle'
									)
								}}
							</label>
						</v-col>
						<v-col>
							<label>
								{{
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.sharepointColumnTitle'
									)
								}}
							</label>
						</v-col>
					</v-row>

					<v-row
						v-for="(mapping, index) in contactInfoMapping"
						:key="index + 'sharepointContactField'"
					>
						<v-col>
							<admin-select-list
								:id="index + 'contactField'"
								:name="index + 'contactField-tab-1'"
								:label="
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.addressInfoTitle'
									)
								"
								v-model="mapping.contactInfoProperty"
								:items="contactInfoPropertyNames"
								item-value="propName"
								item-title="label"
								rules="required"
								:standalone="false"
							/>
						</v-col>
						<v-col class="btn-wrap">
							<v-icon icon="arrow_forward" />
						</v-col>
						<v-col>
							<admin-select-list
								:id="index + 'sharepointColumn2'"
								:name="index + 'sharepointColumn2-tab-1'"
								:label="
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.sharepointColumnTitle'
									)
								"
								v-model="mapping.sharepointFieldGuid"
								:items="
									getSharepointListFields(contactInfoMapping)
								"
								item-value="guid"
								rules="required"
								:standalone="false"
							>
								<template
									v-if="
										isColumnAlreadyUsed(
											mapping.sharepointFieldGuid
										)
									"
									v-slot:append-inner
								>
									<v-icon
										class="duplicate-icon"
										icon="info"
										:title="
											$t(
												'component.adminIntegrationAdvancedSharepoint.columnDuplicateTooltip'
											)
										"
									/>
								</template>
							</admin-select-list>
						</v-col>
						<v-col class="btn-wrap">
							<v-btn
								icon
								@click="deleteContactInfoMapping(index)"
								variant="text"
							>
								<v-icon color="red" icon="delete_outline" />
							</v-btn>
						</v-col>
					</v-row>
					<v-btn
						:disabled="!listGuid"
						@click="addContactInfoMapping"
						variant="text"
						color="primary"
						class="add-btn"
					>
						<v-icon icon="add" />
						{{
							$t(
								'component.adminIntegrationAdvancedSharepoint.field.list.addNewConnection'
							)
						}}
					</v-btn>
				</div>

				<!-- Second contact info (?) -->
				<div class="list-of-fields">
					<h2>
						{{
							$t(
								'component.adminIntegrationAdvancedSharepoint.contactSecondInfoMapping'
							)
						}}
					</h2>
					<!-- (behövs denna? visas bara om multipel legitimation kanske?) -->

					<v-row
						class="labels"
						v-if="contactSecondInfoMapping?.length"
					>
						<v-col>
							<label>
								{{
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.addressInfoTitle'
									)
								}}
							</label>
						</v-col>
						<v-col>
							<label>
								{{
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.sharepointColumnTitle'
									)
								}}
							</label>
						</v-col>
					</v-row>

					<v-row
						v-for="(mapping, index) in contactSecondInfoMapping"
						:key="index + 'sharepointSecondContactField'"
					>
						<v-col>
							<admin-select-list
								:id="index + 'secondContactField'"
								:name="index + 'secondContactField-tab-1'"
								:label="
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.addressInfoTitle'
									)
								"
								v-model="mapping.contactInfoProperty"
								:items="contactSecondInfoPropertyNames"
								item-value="propName"
								item-title="label"
								rules="required"
								:standalone="false"
							/>
						</v-col>
						<v-col class="btn-wrap">
							<v-icon icon="arrow_forward" />
						</v-col>
						<v-col>
							<admin-select-list
								:id="index + 'sharepointColumn3'"
								:name="index + 'sharepointColumn3-tab-1'"
								:label="
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.sharepointColumnTitle'
									)
								"
								v-model="mapping.sharepointFieldGuid"
								:items="
									getSharepointListFields(
										contactSecondInfoMapping
									)
								"
								item-value="guid"
								rules="required"
								:standalone="false"
							>
								<template
									v-if="
										isColumnAlreadyUsed(
											mapping.sharepointFieldGuid
										)
									"
									v-slot:append-inner
								>
									<v-icon
										class="duplicate-icon"
										icon="info"
										:title="
											$t(
												'component.adminIntegrationAdvancedSharepoint.columnDuplicateTooltip'
											)
										"
									/>
								</template>
							</admin-select-list>
						</v-col>
						<v-col class="btn-wrap">
							<v-btn
								icon
								@click="deleteContactSecondInfoMapping(index)"
								variant="text"
							>
								<v-icon color="red" icon="delete_outline" />
							</v-btn>
						</v-col>
					</v-row>
					<v-btn
						:disabled="!listGuid"
						@click="addContactSecondInfoMapping"
						variant="text"
						color="primary"
						class="add-btn"
					>
						<v-icon icon="add" />
						{{
							$t(
								'component.adminIntegrationAdvancedSharepoint.field.list.addNewConnection'
							)
						}}
					</v-btn>
				</div>

				<div class="list-of-fields">
					<h2>
						{{
							$t(
								'component.adminIntegrationAdvancedSharepoint.userLegitimationMapping'
							)
						}}
					</h2>

					<v-row
						class="labels"
						v-if="userLegitimationMapping?.length"
					>
						<v-col>
							<label>
								{{
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.legitimationTitle'
									)
								}}
							</label>
						</v-col>
						<v-col>
							<label>
								{{
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.sharepointColumnTitle'
									)
								}}
							</label>
						</v-col>
					</v-row>
					<v-row
						v-for="(mapping, index) in userLegitimationMapping"
						:key="index + 'sharepointUserLegitimation'"
					>
						<v-col>
							<admin-select-list
								:id="index + 'legitimationField'"
								:name="index + 'legitimationField-tab-1'"
								:label="
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.legitimationTitle'
									)
								"
								v-model="mapping.userLegitimationProperty"
								:items="userLegitimationPropertyNames"
								item-value="propName"
								item-title="label"
								rules="required"
								:standalone="false"
							/>
						</v-col>
						<v-col class="btn-wrap">
							<v-icon icon="arrow_forward" />
						</v-col>
						<v-col>
							<admin-select-list
								:id="index + 'sharepointColumn4'"
								:name="index + 'sharepointColumn4-tab-1'"
								:label="
									$t(
										'component.adminIntegrationAdvancedSharepoint.field.list.sharepointColumnTitle'
									)
								"
								v-model="mapping.sharepointFieldGuid"
								:items="
									getSharepointListFields(
										userLegitimationMapping
									)
								"
								item-value="guid"
								rules="required"
								:standalone="false"
							>
								<template
									v-if="
										isColumnAlreadyUsed(
											mapping.sharepointFieldGuid
										)
									"
									v-slot:append-inner
								>
									<v-icon
										class="duplicate-icon"
										icon="info"
										:title="
											$t(
												'component.adminIntegrationAdvancedSharepoint.columnDuplicateTooltip'
											)
										"
									/>
								</template>
							</admin-select-list>
						</v-col>
						<v-col class="btn-wrap">
							<v-btn
								icon
								@click="deleteUserLegitimationMapping(index)"
								variant="text"
							>
								<v-icon color="red" icon="delete_outline" />
							</v-btn>
						</v-col>
					</v-row>
					<v-btn
						:disabled="!listGuid"
						@click="addUserLegitimationMapping"
						variant="text"
						color="primary"
						class="add-btn"
					>
						<v-icon icon="add" />
						{{
							$t(
								'component.adminIntegrationAdvancedSharepoint.field.list.addNewConnection'
							)
						}}
					</v-btn>
				</div>
			</v-window-item>
		</v-window>
		<share-point-site-modal ref="dialogSite" />
		<share-point-list-modal ref="dialogList" />
	</div>
</template>

<script setup lang="ts">
import SharePointSiteModal from '@/plugins/integrations/advanced-sharepoint/SharePointSiteModal.vue';
import SharePointListModal from '@/plugins/integrations/advanced-sharepoint/SharePointListModal.vue';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import { FormFieldType } from '@/models/Enums';
import {
	IContactInfo,
	IFormIntegration,
	IFormIntegrationOption,
	IRootState,
	IUserContactInfo,
	IUserLegitimation,
} from '@/models/IForm';
import { computed, PropType, ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import {
	IContactInfoSharpointFieldMapping,
	ISharepointField,
	ISharepointFieldMapping,
	ISharepointIntegrationRootState,
	ISharpointMapping,
	IUserLegitimationFieldMapping,
} from './models';
import Config from '@/utils/Config';

interface SharepointRootState extends IRootState {
	sharepointIntegration: ISharepointIntegrationRootState;
}

const DO_UPLOAD_FILE_VALUE = 'doUploadFile';
const DO_ANONYMIZE_TITLE = 'true';

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

const store = useStore<SharepointRootState>();
const { t } = useI18n();

const busyRequestingServer = ref(false);
const hasLoadedAllSetupData = ref(false);
const dialogSite = ref<InstanceType<typeof SharePointSiteModal> | null>(null);
const dialogList = ref<InstanceType<typeof SharePointListModal> | null>(null);

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
const setOptionData = (key: string, data: unknown): void => {
	const option = getOption(key);
	let newOptions = [];
	if (option) {
		newOptions = integration.value.options.map((option) => {
			if (option.key === key) {
				return { ...option, data };
			}
			return option;
		});
	} else {
		newOptions = [...integration.value.options, { key, data, value: '' }];
	}
	integration.value = { ...integration.value, options: newOptions };
};

/** Settings */
const title = computed({
	get: () => getOption('title')?.value ?? '',
	set: (newValue: string) => setOption('title', newValue),
});

const sharepointWebsites = computed(
	() => store.state.sharepointIntegration.websites
);

const sharepointWebsite = computed({
	get: () => getOption('sharepointWebsite')?.value ?? '',
	set: (newValue: string) => setOption('sharepointWebsite', newValue),
});

const sharepointLists = computed(() => store.state.sharepointIntegration.lists);

const listGuid = computed({
	get: () => getOption('listGuid')?.value ?? '',
	set: (newValue: string) => setOption('listGuid', newValue),
});

const uploadFile = computed({
	get: () => getOption('uploadFile')?.value === DO_UPLOAD_FILE_VALUE,
	set: (newValue: boolean) =>
		setOption(
			'uploadFile',
			newValue ? DO_UPLOAD_FILE_VALUE : 'doNotUploadFile'
		),
});

const anonymizeTitle = computed({
	get: () => getOption('anonymizeTitle')?.value === DO_ANONYMIZE_TITLE,
	set: (newValue: boolean) =>
		setOption('anonymizeTitle', newValue ? DO_ANONYMIZE_TITLE : 'false'),
});

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

interface SPFormField {
	title: string;
	guid: number | string;
	disabled?: boolean;
	header?: boolean;
	bold?: boolean;
}

// Form fields
const formFields = computed(() => {
	const list: SPFormField[] = [];
	store.state.form?.attributes.steps.forEach((step, index) => {
		const fields = step.fields.filter((f) => {
			return !f.fieldOptions.tableGuid && f.type !== FormFieldType.Table;
		});
		list.push({
			title:
				t('component.adminSteps.add.defaultName') + ' - ' + step.title,
			guid: index,
			disabled: true,
			header: true,
		});
		fields.forEach((field) => {
			if (field.type === FormFieldType.Section) {
				// show section
				let title = field.title.trim() || '...';
				if (title.length > 20) {
					title = title.substring(0, 20) + '...';
				}
				list.push({
					title,
					guid: field.guid,
					disabled: true,
					bold: true,
				});
			} else {
				list.push({
					title: field.title,
					guid: field.guid,
				});
			}
		});
	});
	return list;
});

const addSiteInfo = computed(() => {
	const spWebSite = sharepointWebsites.value?.find(
		(f) => f.partialURL === sharepointWebsite.value
	);
	return {
		siteTitle: spWebSite?.name,
		siteUrl: sharepointWebsite.value,
	};
});

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
			fieldGuid: '',
			sharepointFieldGuid: '',
		},
	];
};
const deleteFieldMapping = (index: number): void => {
	fieldMapping.value = fieldMapping.value.filter((_, i) => i !== index);
};

// Contact info
const contactInfoPropertyNames = computed(() => {
	const list: Array<{ propName: string; label: string }> = [
		{
			propName: 'fullName',
			label: t(
				'component.adminIntegrationAdvancedSharepoint.field.contactInfo.fullName'
			),
		},
		{
			propName: 'fullAddress',
			label: t(
				'component.adminIntegrationAdvancedSharepoint.field.contactInfo.fullAddress'
			),
		},
	];
	const userContactInfoDummyData = {
		socialSecurityNumber: '',
		firstName: '',
		lastName: '',
		address: '',
		postalNumber: '',
		city: '',
		phoneNumber: '',
		email: '',
		authClientName: '',
	} as IUserContactInfo;
	Object.keys(userContactInfoDummyData).forEach((propName) => {
		list.push({
			propName,
			label: t(
				'component.adminIntegrationAdvancedSharepoint.field.contactInfo.' +
					propName
			),
		});
	});
	return list;
});
const contactInfoMapping = computed({
	get: () =>
		(getOption('contactInfoMapping')?.data ??
			[]) as IContactInfoSharpointFieldMapping[],
	set: (newValue: IContactInfoSharpointFieldMapping[]) =>
		setOptionData('contactInfoMapping', newValue),
});

const addContactInfoMapping = (): void => {
	contactInfoMapping.value = [
		...contactInfoMapping.value,
		{
			contactInfoProperty: '',
			sharepointFieldGuid: '',
		},
	];
};
const deleteContactInfoMapping = (index: number): void => {
	contactInfoMapping.value = contactInfoMapping.value.filter(
		(_, i) => i !== index
	);
};

// Second contact info
const contactSecondInfoPropertyNames = computed(() => {
	const list: Array<{ propName: string; label: string }> = [
		{
			propName: 'fullName',
			label: t(
				'component.adminIntegrationAdvancedSharepoint.field.contactInfo.fullName'
			),
		},
		{
			propName: 'fullAddress',
			label: t(
				'component.adminIntegrationAdvancedSharepoint.field.contactInfo.fullAddress'
			),
		},
	];
	const userContactSecondInfoDummyData = {
		socialSecurityNumber: '',
		address: '',
		postalNumber: '',
		city: '',
		phoneNumber: '',
		email: '',
	} as IContactInfo;
	Object.keys(userContactSecondInfoDummyData).forEach((propName) => {
		list.push({
			propName,
			label: t(
				'component.adminIntegrationAdvancedSharepoint.field.contactInfo.' +
					propName
			),
		});
	});
	return list;
});

const contactSecondInfoMapping = computed({
	get: () =>
		getOption('contactSecondInfoMapping')?.data ??
		([] as IContactInfoSharpointFieldMapping[]),
	set: (newValue: IContactInfoSharpointFieldMapping[]) =>
		setOptionData('contactSecondInfoMapping', newValue),
});

const addContactSecondInfoMapping = (): void => {
	contactSecondInfoMapping.value = [
		...contactSecondInfoMapping.value,
		{
			contactInfoProperty: '',
			sharepointFieldGuid: '',
		},
	];
};
const deleteContactSecondInfoMapping = (index: number): void => {
	contactSecondInfoMapping.value = contactSecondInfoMapping.value.filter(
		(_, i) => i !== index
	);
};

// User legitimation
const userLegitimationPropertyNames = computed(() => {
	const list: Array<{ propName: string; label: string }> = [
		{
			propName: 'userLegitimationInfo',
			label: t(
				'component.adminIntegrationAdvancedSharepoint.field.userLegitimation.userLegitimationInfo'
			),
		},
	];
	const userLegitimationDummyData = {
		refId: '',
		name: '',
		legitimizedMethod: '',
		legitimizedDateTime: '',
	} as IUserLegitimation;
	Object.keys(userLegitimationDummyData).forEach((propName) => {
		list.push({
			propName,
			label: t(
				'component.adminIntegrationAdvancedSharepoint.field.userLegitimation.' +
					propName
			),
		});
	});
	return list;
});
const userLegitimationMapping = computed({
	get: () =>
		getOption('userLegitimationMapping')?.data ??
		([] as IUserLegitimationFieldMapping[]),
	set: (newValue: IUserLegitimationFieldMapping[]) =>
		setOptionData('userLegitimationMapping', newValue),
});

const addUserLegitimationMapping = (): void => {
	userLegitimationMapping.value = [
		...userLegitimationMapping.value,
		{
			userLegitimationProperty: '',
			sharepointFieldGuid: '',
		},
	];
};
const deleteUserLegitimationMapping = (index: number): void => {
	userLegitimationMapping.value = userLegitimationMapping.value.filter(
		(_, i) => i !== index
	);
};

function removeSharepointFieldConnections(): void {
	contactInfoMapping.value.forEach(
		(mapping) => (mapping.sharepointFieldGuid = '')
	);
	contactSecondInfoMapping.value.forEach(
		(mapping) => (mapping.sharepointFieldGuid = '')
	);
	userLegitimationMapping.value.forEach(
		(mapping) => (mapping.sharepointFieldGuid = '')
	);
	fieldMapping.value.forEach((mapping) => (mapping.sharepointFieldGuid = ''));
}
watch(sharepointWebsite, async (newValue: string) => {
	if (hasLoadedAllSetupData.value) {
		busyRequestingServer.value = true;
		// load the lists when we picked the website
		listGuid.value = ''; // user have to re-pick which list to be used
		removeSharepointFieldConnections();
		await store.dispatch('sharepointIntegration/loadLists', {
			partialUrl: newValue,
		});
		busyRequestingServer.value = false;
	}
});
watch(listGuid, async (newValue: string) => {
	if (hasLoadedAllSetupData.value) {
		// Fetch list fields when selected list changes
		removeSharepointFieldConnections();
		if (newValue) {
			await store.dispatch('sharepointIntegration/loadFields', {
				partialUrl: sharepointWebsite.value,
				listGuid: newValue,
			});
		}
	}
});

// Check if colum is used multiple times
const duplicateSharepointColumns = computed(() => {
	const columns: string[] = [];
	// Get all connected Sharepoint columns
	[
		fieldMapping.value,
		contactInfoMapping.value,
		contactSecondInfoMapping.value,
		userLegitimationMapping.value,
	].forEach((mapping) =>
		mapping.forEach((m) => {
			if (m.sharepointFieldGuid) {
				columns.push(m.sharepointFieldGuid);
			}
		})
	);

	// Find all duplicate columns
	const duplicates = columns.filter(
		(value, index, array) => array.indexOf(value) !== index
	);
	const uniqueDuplicates = duplicates.filter(
		(value, index, array) => array.indexOf(value) === index
	);
	const sharepointColumns = getSharepointListFields();

	return uniqueDuplicates.map((guid) => {
		return {
			guid,
			title: sharepointColumns.find((c) => c.guid === guid)?.title,
			usage: duplicates.filter((f) => f === guid).length + 1,
		};
	});
});

const isColumnAlreadyUsed = (columnGuid: string | undefined): boolean => {
	for (const duplicate of duplicateSharepointColumns.value) {
		if (duplicate.guid === columnGuid) {
			return true;
		}
	}
	return false;
};

function openDialog(linkDialog: string): void {
	if (linkDialog === 'dialogSite') {
		dialogSite.value?.open(
			sharepointWebsites.value?.map((a) => a.name) as string[]
		);
	} else if (linkDialog === 'dialogList') {
		const siteInfo = addSiteInfo.value;
		dialogList.value?.open(
			sharepointLists.value?.map((a) => a.title) as string[],
			siteInfo
				? siteInfo.siteUrl
					? siteInfo.siteUrl?.toString()
					: ''
				: '',
			siteInfo
				? siteInfo.siteTitle
					? siteInfo.siteTitle?.toString()
					: ''
				: ''
		);
	}
}

async function refresh(): Promise<void> {
	busyRequestingServer.value = true;
	hasLoadedAllSetupData.value = false;
	const dispatchedActions: Array<Promise<void>> = [];
	dispatchedActions.push(
		store.dispatch('sharepointIntegration/loadWebsites')
	);

	if (sharepointWebsite.value) {
		const args = { partialUrl: sharepointWebsite.value };
		dispatchedActions.push(
			store.dispatch('sharepointIntegration/loadLists', args)
		);
		if (listGuid.value) {
			dispatchedActions.push(
				store.dispatch('sharepointIntegration/loadFields', {
					partialUrl: sharepointWebsite.value,
					listGuid: listGuid.value,
				})
			);
		}
	}

	await Promise.all(dispatchedActions);
	busyRequestingServer.value = false;
	hasLoadedAllSetupData.value = true;
}

const siteListTitleLink = computed(() => {
	const site = sharepointWebsite.value;
	if (site !== '' && listGuid.value !== '') {
		const spWebSiteList = sharepointLists.value?.find(
			(f) => f.guid === listGuid.value
		);
		const strString = spWebSiteList?.title as string;
		if (strString) {
			const encodedString = encodeURI(
				strString.replace(/[^A-Za-z0-9 ]+/gi, '')
			);
			return (
				Config.VUE_APP_SHAREPOINT_SITE_URL +
				site +
				'/Lists/' +
				encodedString +
				'/AllItems.aspx'
			);
		}
	}
	return '';
});

const siteTitleLink = computed(() => {
	const site = sharepointWebsite.value;
	if (site) {
		return Config.VUE_APP_SHAREPOINT_SITE_URL + site;
	}
	return '';
});

onMounted(async () => {
	busyRequestingServer.value = true;
	hasLoadedAllSetupData.value = false;
	const dispatchedActions: Array<Promise<void>> = [];
	dispatchedActions.push(
		store.dispatch('sharepointIntegration/loadWebsites')
	);

	if (props.isNew) {
		// Set default options for new integration
		const defaultOptions: IFormIntegrationOption[] = [
			{ key: 'title', value: '' },
			{ key: 'sharepointWebsite', value: '' },
			{ key: 'listGuid', value: '' },
			{ key: 'fieldMapping', data: [], value: '' },
			{ key: 'contactInfoMapping', data: [], value: '' },
			{
				key: 'contactSecondInfoMapping',
				data: [],
				value: '',
			},
			{
				key: 'userLegitimationMapping',
				data: [],
				value: '',
			},
			{ key: 'uploadFile', value: 'doNotUploadFile' },
			{ key: 'anonymizeTitle', value: 'doNotAnonymizeTitle' },
		];

		integration.value = { ...integration.value, options: defaultOptions };
	}

	if (sharepointWebsite.value) {
		const args = { partialUrl: sharepointWebsite.value };
		dispatchedActions.push(
			store.dispatch('sharepointIntegration/loadLists', args)
		);
		if (listGuid.value) {
			dispatchedActions.push(
				store.dispatch('sharepointIntegration/loadFields', {
					partialUrl: sharepointWebsite.value,
					listGuid: listGuid.value,
				})
			);
		}
	}

	await Promise.all(dispatchedActions);
	busyRequestingServer.value = false;
	hasLoadedAllSetupData.value = true;
});

// Expose if valid and tabs to parent
defineExpose({
	tabs: [
		t('component.adminIntegrationAdvancedSharepoint.tabSettings'),
		t('component.adminIntegrationAdvancedSharepoint.tabConnector'),
	],
	refresh,
});
</script>

<style scoped lang="scss">
.advanced-sharepoint-integration {
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
	.connection-warning {
		.v-icon {
			color: $warning;
		}
		font-size: size(14);
		margin-bottom: 10px;
	}
	.duplicate-icon {
		transform: none;
		color: $warning;
		opacity: 1;
	}
}

.sharepoint-field-select-item {
	:deep(.v-list-item__content) {
		padding-left: 10px;
	}
	&.bold {
		font-weight: bold;
		opacity: 1;
		:deep(.v-list-item__content) {
			padding-left: 5px;
		}
	}
	&.header {
		font-weight: bold;
		font-size: size(18);
		opacity: 0.7;
		:deep(.v-list-item__content) {
			padding-left: 0px;
		}
	}
}
.add-link-btn {
	text-transform: none;
	letter-spacing: normal;
	color: $primary;
	margin-right: 0px;
	padding: 10px;

	.v-icon {
		margin-right: 4px;
	}
}
.anonymize-checkbox {
	margin-top: -50px;
}
</style>
