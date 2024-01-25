<template>
	<div class="admin-ecos-list">
		<div class="search-wrap admin-list-search-wrap mt-5">
			<ume-text-field
				:placeholder="$t('component.adminEcosManager.search')"
				prepend-inner-icon="search"
				v-model="search"
			/>

			<v-btn
				id="create-service-menu-button"
				flat
				color="primary"
				aria-haspopup="true"
				aria-controls="create-service-menu"
				@click="onCreate"
			>
				<v-icon class="mr-2" icon="add" />
				{{ $t('component.adminEcosManager.create') }}
			</v-btn>
		</div>

		<!-- Form context menu -->
		<BaseContextMenu ref="contextMenu">
			<v-list v-if="clickedId" class="admin-list-context-menu">
				<v-list-item
					prepend-icon="edit"
					@click.prevent="() => clickedId && onEdit(clickedId)"
				>
					<v-list-item-title>
						{{ $t('component.adminListForms.edit') }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					prepend-icon="delete_outline"
					class="color-red"
					@click.prevent="() => clickedId && deleteItem(clickedId)"
					:disabled="!canDelete(clickedId)"
				>
					<v-list-item-title>
						{{ $t('component.adminEcosManager.delete') }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</BaseContextMenu>

		<!-- Loading forms -->
		<app-loading-spinner
			v-if="isBusyLoadingFromServer"
			:isVisible="isBusyLoadingFromServer"
		></app-loading-spinner>

		<!-- No results -->
		<v-alert
			v-else-if="!ecosItems.length"
			class="admin-list-no-results"
			icon="warning"
		>
			{{ $t('component.adminListForms.table.noresult.labelpart1') }}
			"{{ search }}"
			{{ $t('component.adminListForms.table.noresult.labelpart2') }}
		</v-alert>

		<!-- Display list of forms-->
		<v-data-table
			v-else
			v-model:items-per-page="itemsPerPage"
			v-model:sort-by="sortBy"
			v-model:page="page"
			:headers="headers"
			:items="ecosItems"
			item-value="id"
			class="mt-3"
		>
			<!-- Table headers -->
			<template v-slot:headers>
				<admin-list-headers
					v-model:sortBy="sortBy"
					:headers="headers"
				/>
			</template>

			<!-- Form item -->
			<template v-slot:item="{ item }">
				<tr
					class="admin-list-item"
					@click="onEdit(item.id)"
					@contextmenu.prevent="(e) => showContextMenu(e, item.id)"
				>
					<td style="width: 5%">{{ item.id }}</td>
					<td class="title">
						{{ item.title }}
					</td>
					<td style="width: 5%">
						<v-btn
							icon
							variant="flat"
							@click.stop="
								(e: MouseEvent) => showContextMenu(e, item.id)
							"
						>
							<v-icon icon="more_vert" size="small" />
						</v-btn>
					</td>
				</tr>
			</template>

			<!-- Pagination -->
			<template v-slot:bottom>
				<admin-list-pagination
					v-model:items-per-page="itemsPerPage"
					v-model:page="page"
					:number-of-items="ecosItems.length"
				/>
			</template>
		</v-data-table>

		<admin-ecos-template-edit
			:ecos="editingItem"
			@close="editingItem = null"
			@save="onSave"
			:loading="isBusyLoadingFromServer"
			:case-roles="caseRoles"
			:address-types="addressTypes"
			:occurrence-types="occurrenceTypes"
			:notification-types="notificationTypes"
			:process-types="processTypes"
			:document-types="documentTypes"
			:diary-plans="diaryPlans"
			:handling-officer-groups="handlingOfficerGroups"
		/>
	</div>
</template>

<script setup lang="ts">
import {
	IEcosTemplate,
	IItem,
	IRootState,
	ISortBy,
	ITableHeader,
	ITemplate,
	ITemplateOption,
} from '@/models/IForm';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';
import BaseContextMenu from '@/components/base/BaseContextMenu.vue';
import AdminListPagination from '@/components/admin/AdminList/AdminListPagination.vue';
import AdminListHeaders from '@/components/admin/AdminList/AdminListHeaders.vue';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useTConfirmDialog } from '@turkos/components';
import { Helper } from '@/utils/helper';
import AdminEcosTemplateEdit from './AdminEcosTemplateEdit.vue';
import { ErrorCode, TemplateOptionType, TemplateType } from '@/models/Enums';
import ErrorService from '@/utils/ErrorService';
import { IEcosDataItem } from '@/plugins/integrations/ecos/IIntegrationOnPrem';

const { t } = useI18n();
const store = useStore<IRootState>();
const { tConfirmDialogAsync } = useTConfirmDialog();

const isBusyLoadingFromServer = ref(true);

const search = ref('');

const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref<ISortBy[]>([{ key: 'title', order: 'asc' }]);

const headers: ITableHeader[] = [
	{
		title: t('component.adminListForms.table.headers.text1'),
		align: 'start',
		key: 'id',
	},
	{
		title: t('component.adminListForms.table.headers.text2'),
		align: 'start',
		key: 'title',
	},
	{ title: '', key: 'actions', align: 'end', sortable: false },
];

const tempCaseRoles = ref<IEcosDataItem[]>([]);
const tempAddressTypes = ref<IEcosDataItem[]>([]);
const tempOccurrenceTypes = ref<IEcosDataItem[]>([]);
const tempNotificationTypes = ref<IEcosDataItem[]>([]);
const tempProcessTypes = ref<IEcosDataItem[]>([]);
const tempDocumentTypes = ref<IEcosDataItem[]>([]);
const tempDiaryPlans = ref<IEcosDataItem[]>([]);
const tempHandlingOfficerGroups = ref<IEcosDataItem[]>([]);

function toItemList(dataItems: IEcosDataItem[]): IItem[] {
	return dataItems.map((element) => ({
		id: element.guid,
		title: element.title,
		value: element.parameterName,
		isChecked: false,
	}));
}

const caseRoles = computed(() => toItemList(tempCaseRoles.value));
const addressTypes = computed(() => toItemList(tempAddressTypes.value));
const occurrenceTypes = computed(() => toItemList(tempOccurrenceTypes.value));
const notificationTypes = computed(() =>
	toItemList(tempNotificationTypes.value)
);
const processTypes = computed(() => toItemList(tempProcessTypes.value));
const documentTypes = computed(() => toItemList(tempDocumentTypes.value));
const diaryPlans = computed(() => toItemList(tempDiaryPlans.value));
const handlingOfficerGroups = computed(() =>
	toItemList(tempHandlingOfficerGroups.value)
);

const eServiceConnections = ref<{ templateGuid: string; formTitle: string }[]>(
	[]
);

function eServicesConnectedToEcos(guid: string): string[] {
	const eServicesConnectedToEcoList: string[] = [];
	eServiceConnections.value.forEach((element) => {
		if (guid === element.templateGuid) {
			eServicesConnectedToEcoList.push(element.formTitle);
		}
	});
	return eServicesConnectedToEcoList;
}

function findItemGuid(options: ITemplateOption[]): string {
	let temp = '';
	options.forEach((element) => {
		temp = element.guid;
	});
	return temp;
}

function findIItemList(options: ITemplateOption[]): IItem[] {
	const temp: IItem[] = [];
	options.forEach((element) => {
		temp.push({
			id: element.guid,
			title: element.title,
			value: element.parameterName,
			isChecked: true,
		});
	});
	return temp as IItem[];
}

const ecosItems = computed(() => {
	if (store.state.ecos !== null) {
		const newEcosList: IEcosTemplate[] = [];
		const ecosList = Helper.deepCopy(store.state.ecos).sort(
			Helper.sortByTitle
		);
		ecosList.forEach((element) => {
			const tempMunicipalityCode = element.options.filter(
				(w) => w.type === TemplateOptionType.MunicipalityCode.toString()
			)[0];
			const tempCaseSubTitleItem = element.options.filter(
				(w) => w.type === TemplateOptionType.CaseSubTitle.toString()
			)[0];
			let caseSubTitleItem;
			if (tempCaseSubTitleItem) {
				caseSubTitleItem = {
					id: tempCaseSubTitleItem.guid,
					title: tempCaseSubTitleItem.title,
					value: tempCaseSubTitleItem.parameterName,
				} as IItem;
			} else {
				caseSubTitleItem = { id: '', title: '', value: '' } as IItem;
			}
			newEcosList.push({
				id: element.id,
				guid: element.guid,
				title: element.title,
				type: element.type,
				caseSubTitleItem,
				municipalityCode: {
					id: tempMunicipalityCode.guid,
					title: tempMunicipalityCode.title,
					value: tempMunicipalityCode.parameterName,
				} as IItem,
				roles: findIItemList(
					element.options.filter(
						(w) => w.type === TemplateOptionType.Role.toString()
					)
				),
				addressTypes: findIItemList(
					element.options.filter(
						(w) => w.type === TemplateOptionType.Address.toString()
					)
				),
				documentTypes: findIItemList(
					element.options.filter(
						(w) => w.type === TemplateOptionType.Document.toString()
					)
				),
				processTypeGuid: findItemGuid(
					element.options.filter(
						(w) => w.type === TemplateOptionType.Process.toString()
					)
				),
				occurrenceTypeGuid: findItemGuid(
					element.options.filter(
						(w) =>
							w.type === TemplateOptionType.Occurrence.toString()
					)
				),
				notificationTypeGuid: findItemGuid(
					element.options.filter(
						(w) =>
							w.type ===
							TemplateOptionType.Notification.toString()
					)
				),
				diaryPlanGuid: findItemGuid(
					element.options.filter(
						(w) => w.type === TemplateOptionType.Diary.toString()
					)
				),
				handlingOfficerGroupTypeGuid: findItemGuid(
					element.options.filter(
						(w) =>
							w.type ===
							TemplateOptionType.HandlingOfficerGroup.toString()
					)
				),
				eServiceConnection: eServicesConnectedToEcos(element.guid),
			} as IEcosTemplate);
		});
		return newEcosList;
	} else {
		return [];
	}
});

const editingItem = ref<IEcosTemplate | null>(null);

const onCreate = (): void => {
	const newItem: IEcosTemplate = {
		id: Helper.generateTempIdInteger(),
		guid: Helper.generateUuid(),
		title: '',
		type: TemplateType.Ecos,
		caseSubTitleItem: { id: '', title: '', value: '' },
		municipalityCode: {
			id: Helper.generateUuid(),
			title: t('component.adminEcosManager.municipalityCode'),
			value: TemplateOptionType.MunicipalityCode.toString(),
		},
		roles: [],
		addressTypes: [],
		documentTypes: [],
		processTypeGuid: '',
		occurrenceTypeGuid: '',
		notificationTypeGuid: '',
		diaryPlanGuid: '',
		handlingOfficerGroupTypeGuid: '',
		eServiceConnection: [],
	};
	editingItem.value = newItem;
};
const onEdit = (id: number): void => {
	const item = ecosItems.value.find((item) => item.id === id);
	editingItem.value = item ?? null;
};

function addToITemplateOptionList(
	options: ITemplateOption[],
	items: IItem[],
	type: TemplateOptionType
): void {
	items.forEach((element) => {
		options.push({
			parameterName: element.value,
			guid: element.id,
			title: element.title,
			type,
		} as ITemplateOption);
	});
}

function addToITemplateOptionListFromGuid(
	options: ITemplateOption[],
	itemList: IEcosDataItem[],
	guid: string,
	type: TemplateOptionType
): void {
	itemList.forEach((element) => {
		if (guid === element.guid) {
			options.push({
				parameterName: element.parameterName,
				guid: element.guid,
				title: element.title,
				type,
			} as ITemplateOption);
		}
	});
}

const onSave = async (template: IEcosTemplate): Promise<void> => {
	try {
		const options: ITemplateOption[] = [];
		addToITemplateOptionList(
			options,
			template.roles,
			TemplateOptionType.Role
		);
		addToITemplateOptionList(
			options,
			template.addressTypes,
			TemplateOptionType.Address
		);
		addToITemplateOptionList(
			options,
			template.documentTypes,
			TemplateOptionType.Document
		);
		addToITemplateOptionListFromGuid(
			options,
			tempProcessTypes.value,
			template.processTypeGuid,
			TemplateOptionType.Process
		);
		addToITemplateOptionListFromGuid(
			options,
			tempOccurrenceTypes.value,
			template.occurrenceTypeGuid,
			TemplateOptionType.Occurrence
		);
		addToITemplateOptionListFromGuid(
			options,
			tempNotificationTypes.value,
			template.notificationTypeGuid,
			TemplateOptionType.Notification
		);
		addToITemplateOptionListFromGuid(
			options,
			tempDiaryPlans.value,
			template.diaryPlanGuid,
			TemplateOptionType.Diary
		);
		addToITemplateOptionListFromGuid(
			options,
			tempHandlingOfficerGroups.value,
			template.handlingOfficerGroupTypeGuid,
			TemplateOptionType.HandlingOfficerGroup
		);
		options.push({
			guid: template.municipalityCode.id,
			parameterName: template.municipalityCode.value,
			title: template.municipalityCode.title,
			type: TemplateOptionType.MunicipalityCode,
		} as ITemplateOption);
		if (template.caseSubTitleItem.title !== '') {
			options.push({
				guid:
					template.caseSubTitleItem.id !== ''
						? template.caseSubTitleItem.id
						: Helper.generateUuid(),
				parameterName:
					template.caseSubTitleItem.value !== ''
						? template.caseSubTitleItem.value
						: TemplateOptionType.CaseSubTitle.toString()
								.charAt(0)
								.toUpperCase() +
						  TemplateOptionType.CaseSubTitle.toString().slice(1),
				title: template.caseSubTitleItem.title,
				type: TemplateOptionType.CaseSubTitle,
			} as ITemplateOption);
		}
		if (Math.sign(template.id ?? 0) === -1) {
			await store.dispatch('createEcos', {
				ecos: {
					guid: template.guid,
					title: template.title,
					type: template.type,
					options,
				} as ITemplate,
			});
		} else {
			await store.dispatch('updateEcos', {
				ecos: {
					id: template.id,
					guid: template.guid,
					title: template.title,
					type: template.type,
					options,
				} as ITemplate,
			});
		}
	} catch (err) {
		if (err === ErrorCode.MissingTitle) {
			ErrorService.onError({
				err: new Error('createEcos is missingtitle!'),
				message: t('component.adminEcosManager.error.onCreateEcos'),
				log: false,
			});
		} else {
			throw err;
		}
	}
};

/**
 * Context menu
 */
const clickedId = ref<number>();
const contextMenu = ref();
const showContextMenu = (event: MouseEvent, id: number): void => {
	clickedId.value = id;
	contextMenu.value?.open(event);
};

const canDelete = (id: number): boolean => {
	if (id) {
		const item = ecosItems.value.find((item) => item.id === id);
		if (item?.eServiceConnection?.length) {
			return false;
		}
		return true;
	}
	return false;
};

async function deleteItem(id: number): Promise<void> {
	const item = ecosItems.value.find((item) => item.id === id);
	const doDeleteItem = await tConfirmDialogAsync(
		t('component.adminEcosManager.confirmDelete.title'),
		t('component.adminEcosManager.confirmDelete.text', [item?.title]),
		{
			text: t('component.adminEcosManager.delete'),
			color: 'error',
		}
	);
	if (doDeleteItem && item) {
		try {
			await store.dispatch('deleteEcos', {
				ecos: item,
			});
		} catch (err) {
			if (err === ErrorCode.CannotDeleteObjectWithRelation) {
				ErrorService.onError({
					err: new Error('deleteEcos have a relation to !'),
					message: t(
						'component.adminEcosManager.error.onDeleteEcos.restricted'
					),
					log: false,
				});
			} else {
				throw err;
			}
		}
	}
}

onMounted(async () => {
	await store.dispatch('getEcosList');
	eServiceConnections.value = await store.dispatch(
		'getTemplatesConnectedToEServices'
	);

	const data = await Promise.all([
		store.dispatch('getEcosCaseRoles'),
		store.dispatch('getEcosAddressTypes'),
		store.dispatch('getEcosOccurrenceTypes'),
		store.dispatch('getEcosNotificationTypes'),
		store.dispatch('getEcosProcessTypes'),
		store.dispatch('getEcosDocumentTypes'),
		store.dispatch('getEcosDiaryPlans'),
		store.dispatch('getEcosHandlingOfficerGroups'),
	]);

	tempCaseRoles.value = data[0];
	tempAddressTypes.value = data[1];
	tempOccurrenceTypes.value = data[2];
	tempNotificationTypes.value = data[3];
	tempProcessTypes.value = data[4];
	tempDocumentTypes.value = data[5];
	tempDiaryPlans.value = data[6];
	tempHandlingOfficerGroups.value = data[7];

	isBusyLoadingFromServer.value = false;
});
</script>
