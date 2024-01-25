<template>
	<div class="admin-list-eServices">
		<h1 class="mt-2 mb-4">{{ $t('app.service') }}</h1>
		<div class="search-wrap admin-list-search-wrap">
			<ume-text-field
				:placeholder="$t('component.adminListForms.search.placeholder')"
				prepend-inner-icon="search"
				v-model="search"
			/>
			<v-btn
				variant="outlined"
				@click="toggleFilterSettingsView"
				:active="showFilterSettings"
			>
				<v-icon
					class="mr-2"
					:icon="showFilterSettings ? 'close' : 'filter_list'"
				/>
				{{ $t('component.adminListForms.filter') }}
			</v-btn>

			<v-menu
				id="create-service-menu"
				aria-labelledby="create-service-menu-button"
				scroll-strategy="none"
				attach
			>
				<template v-slot:activator="{ props }">
					<v-btn
						id="create-service-menu-button"
						flat
						color="primary"
						aria-haspopup="true"
						aria-controls="create-service-menu"
						v-bind="props"
					>
						<v-icon class="mr-2" icon="add" />
						{{ $t('component.adminListForms.create.add') }}
					</v-btn></template
				>
				<v-list class="create-service-menu-list">
					<v-list-item
						@click="addEServiceClick(FormType.EService)"
						color="primary"
					>
						<v-list-item-title>
							{{ $t('component.adminListForms.create.eservice') }}
						</v-list-item-title>
					</v-list-item>
					<v-list-item
						@click="addEServiceClick(FormType.LinkExternal)"
					>
						<v-list-item-title>
							{{ $t('component.adminListForms.create.link') }}
						</v-list-item-title>
					</v-list-item>
					<v-list-item @click="addEServiceClick(FormType.InfoPage)">
						<v-list-item-title>
							{{ $t('component.adminListForms.create.infoPage') }}
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>

		<!-- Filter settings -->
		<v-container
			v-if="showFilterSettings"
			grid-list-md
			class="filter-settings"
		>
			<v-layout row wrap>
				<v-col xs3>
					<v-select
						:label="$t('component.adminListForms.pm3')"
						v-model="filterPm3s"
						:items="allPm3s"
						item-text="title"
						item-value="id"
						clearable
						chips
						multiple
						hide-details
						variant="underlined"
						color="primary"
					/>
				</v-col>
				<v-col xs3>
					<v-select
						:label="$t('component.adminListForms.receiver')"
						v-model="filterReceivers"
						:items="allReceivers"
						item-text="title"
						item-value="id"
						clearable
						chips
						multiple
						hide-details
						variant="underlined"
						color="primary"
					></v-select>
				</v-col>
				<v-col xs3>
					<v-select
						:label="$t('component.adminListForms.gdpr')"
						v-model="filterGdprs"
						:items="allGdprs"
						item-text="title"
						item-value="id"
						clearable
						chips
						multiple
						hide-details
						variant="underlined"
						color="primary"
					></v-select>
				</v-col>
				<v-col xs3>
					<v-select
						:label="$t('component.adminListForms.integrations')"
						v-model="filterIntegrations"
						:items="allIntegrations"
						clearable
						chips
						multiple
						hide-details
						variant="underlined"
						color="primary"
					></v-select>
				</v-col>
			</v-layout>
		</v-container>

		<!-- Form context menu -->
		<BaseContextMenu ref="contextMenu">
			<v-list v-if="clickedFormId" class="admin-list-context-menu">
				<v-list-item
					@click.prevent="goToFormEditor(clickedFormId)"
					prepend-icon="edit"
				>
					<v-list-item-title>
						{{ $t('component.adminListForms.edit') }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					@click.prevent="goToFormEditor(clickedFormId, true)"
					prepend-icon="open_in_new"
				>
					<v-list-item-title>
						{{ $t('component.adminListForms.editInNewTab') }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					@click.prevent="goToPublicForm(clickedFormId)"
					prepend-icon="play_circle_outline"
				>
					<v-list-item-title>
						{{ $t('component.adminListForms.open') }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					@click.prevent="copyPublicUrl(clickedFormId)"
					prepend-icon="link"
				>
					<v-list-item-title>
						{{ $t('component.adminListForms.copyUrl') }}
					</v-list-item-title>
				</v-list-item>
				<v-divider></v-divider>
				<v-list-item
					@click.prevent="archiveEService(clickedFormId)"
					prepend-icon="archive"
				>
					<v-list-item-title>
						{{ $t('component.adminListForms.archive') }}
					</v-list-item-title>
				</v-list-item>
				<v-divider></v-divider>
				<v-list-item
					@click.prevent="cloneEService(clickedFormId)"
					prepend-icon="file_copy"
				>
					<v-list-item-title>
						{{ $t('component.adminListForms.clone') }}
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
			v-else-if="!formItems.length"
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
			:items="formItems"
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
					@click="goToFormEditor(item.id)"
					@contextmenu.prevent="(e) => showContextMenu(e, item.id)"
				>
					<td style="width: 5%">{{ item.id }}</td>
					<td
						class="title"
						style="width: 45%"
						:class="item.title.length > 0 ? '' : 'empty-title'"
					>
						{{
							item.title.length > 0
								? item.title
								: t(
										'component.adminListForms.table.eService.emptyTitle'
								  )
						}}
						<FormDateScheduleIcon
							:title="getDateInterval(item.form)"
							:form="item.form"
							class="clock-icon"
							size="medium"
						/>
						<v-icon
							v-if="
								item.form.attributes.type ===
								FormType.LinkExternal
							"
							color="green"
							size="medium"
							class="ml-2"
							style="vertical-align: -4px"
							:title="$t('app.linkExternal')"
							>open_in_new</v-icon
						>

						<v-icon
							v-if="
								item.form.attributes.type === FormType.InfoPage
							"
							color="grey"
							size="medium"
							class="ml-2"
							style="vertical-align: -4px"
							:title="$t('app.infoPage')"
							>info</v-icon
						>
					</td>
					<td style="width: 10%">{{ item.receiver }}</td>
					<td
						style="width: 10%"
						:class="
							'text-' +
							(item.status === FormStatus.Published
								? 'green'
								: 'orange')
						"
					>
						{{ getStatusText(item.status) }}
					</td>
					<td style="width: 15%">
						{{ item.saveDateInfo }}
					</td>
					<td style="width: 10%">{{ item.recentSubmits }}</td>
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
					:number-of-items="formItems.length"
				/>
			</template>
		</v-data-table>
	</div>
</template>

<script setup lang="ts">
import {
	IForm,
	IGdpr,
	IPm3,
	IReceiver,
	IRootState,
	ISortBy,
	ITableHeader,
} from '@/models/IForm';
import FormFilterIterator from '@/utils/FormFilterIterator';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';
import BaseContextMenu from '@/components/base/BaseContextMenu.vue';
import FormDateScheduleIcon from '@/components/form/FormDateScheduleIcon.vue';
import moment from 'moment';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useTConfirmDialog } from '@turkos/components';
import { FormStatus, FormType } from '@/models/Enums';
import AdminListPagination from './AdminListPagination.vue';
import AdminListHeaders from './AdminListHeaders.vue';

const { t } = useI18n();
const store = useStore<IRootState>();
const { tConfirmDialogAsync } = useTConfirmDialog();

const isBusyLoadingFromServer = ref(true);
const allReceivers = ref<IReceiver[]>([]);
const allGdprs = ref<IGdpr[]>([]);
const allPm3s = ref<IPm3[]>([]);
const allIntegrations = ref<string[]>([]);

const showFilterSettings = ref<boolean>(false);
const search = ref('');
const filterReceivers = ref([]);
const filterGdprs = ref([]);
const filterPm3s = ref([]);
const filterIntegrations = ref([]);

const filterConfig = computed(() => ({
	receivers: filterReceivers.value,
	gDprs: filterGdprs.value,
	pm3s: filterPm3s.value,
	integrations: filterIntegrations.value,
	search: search.value,
}));

const page = ref(1);
const itemsPerPage = ref(10);

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
	{
		title: t('component.adminListForms.table.headers.text3'),
		align: 'end',
		key: 'receiver',
	},
	{
		title: t('component.adminListForms.table.headers.text4'),
		align: 'end',
		key: 'status',
	},
	{
		title: t('component.adminListForms.table.headers.text5'),
		align: 'end',
		key: 'saveDateInfo',
	},
	{
		title: t('component.adminListForms.table.headers.text6'),
		align: 'end',
		key: 'recentSubmits',
	},
	{ title: '', key: 'actions', align: 'end', sortable: false },
];

const sortBy = ref<ISortBy[]>([{ key: 'id', order: 'desc' }]);

function sortArrayList(list: IReceiver[] | IPm3[] | IGdpr[] | string[]): void {
	list.sort((a, b) => {
		const x =
			typeof a === 'string' ? a.toLowerCase() : a.title.toLowerCase();
		const y =
			typeof b === 'string' ? b.toLowerCase() : b.title.toLowerCase();
		if (x < y) {
			return -1;
		}
		if (x > y) {
			return 1;
		}
		return 0;
	});
}

const formItems = computed(() => {
	const formItems: IFormItem[] = [];

	if (store.state.forms?.length) {
		const formFilter = new FormFilterIterator(
			store.state.forms,
			filterConfig.value
		);

		let form: IForm | null = formFilter.next();
		do {
			if (form) {
				const saveDate = moment
					.utc(form.attributes.modified || form.attributes.created)
					.local()
					.format('YYYY-MM-DD HH:mm');

				formItems.push({
					id: form.id,
					title: form.attributes.title,
					value: false,
					saveDateInfo: saveDate,
					receiver: form.attributes.receiver
						? form.attributes.receiver.title
						: null,
					status: form.attributes.status,
					recentSubmits: form.attributes.recentSubmits,
					form,
				} as IFormItem);
			}
			form = formFilter.next();
		} while (form);
	}
	return formItems;
});

function getDateInterval(form: IForm): string {
	if (form.attributes.dateSchedule && form.attributes.dateSchedule.active) {
		return (
			form.attributes.dateSchedule.from.replace('T', ' ') +
			' -> ' +
			form.attributes.dateSchedule.to.replace('T', ' ')
		);
	}
	return '';
}

function toggleFilterSettingsView(): void {
	showFilterSettings.value = !showFilterSettings.value;
	if (!showFilterSettings.value) {
		filterReceivers.value = [];
		filterGdprs.value = [];
		filterPm3s.value = [];
		filterIntegrations.value = [];
	}
}

/**
 * Formstatus description.
 */
function getStatusText(status: FormStatus | string): string {
	return status === FormStatus.Published
		? t('app.status.published')
		: status === FormStatus.Draft
		? t('app.status.draft')
		: status === FormStatus.Unpublished
		? t('app.status.unpublished')
		: '';
}

onMounted(async () => {
	if (store.state.forms?.length) {
		isBusyLoadingFromServer.value = false;
	}

	try {
		// Load form from server
		await store.dispatch('getForms');

		// Create distinct list of entities related to each form
		// Used to filter the list
		store.state.forms?.forEach((form) => {
			if (
				form.attributes.receiver &&
				Object.keys(form.attributes.receiver).length &&
				!allReceivers.value.find(
					(a) => a.id === form.attributes.receiver?.id
				)
			) {
				allReceivers.value.push(form.attributes.receiver);
			}
			if (
				form.attributes.pM3 &&
				Object.keys(form.attributes.pM3).length > 0 &&
				!allPm3s.value.find((a) => a.id === form.attributes.pM3?.id)
			) {
				allPm3s.value.push(form.attributes.pM3);
			}
			(form.attributes.gDPR.dataControllers || []).forEach((gDPR) => {
				if (!allGdprs.value.find((a) => a.id === gDPR.id)) {
					allGdprs.value.push(gDPR);
				}
			});
			(form.attributes.integrations || []).forEach((integration) => {
				if (allIntegrations.value.indexOf(integration.type) === -1) {
					allIntegrations.value.push(integration.type);
				}
			});
		});
		sortArrayList(allReceivers.value);
		sortArrayList(allPm3s.value);
		sortArrayList(allGdprs.value);
		sortArrayList(allIntegrations.value);
	} catch (error) {
		// this.setErrorMessage(error);
		console.error('Fetch admin e-services failed');
		throw error;
	} finally {
		isBusyLoadingFromServer.value = false;
	}
});

/**
 * Create e-service
 */
async function createNewForm(formType: FormType): Promise<void> {
	const formId = await store.dispatch('createForm', { formType });
	window.location.href = '/admin/' + formId + '/settings#eService-title';
}

async function addEServiceClick(formType: FormType): Promise<void> {
	const isConfirmed = await tConfirmDialogAsync(
		t(`component.adminListForms.add${formType}Dialog.title`),
		t(`component.adminListForms.add${formType}Dialog.description`),
		{
			text: t(`component.adminListForms.add${formType}Dialog.confirm`),
			color: 'primary',
		},
		{ color: 'error' }
	);

	if (!isConfirmed) {
		return;
	}

	createNewForm(formType);
}

/**
 * Context menu
 */
const clickedFormId = ref<string>('');
const contextMenu = ref();
const showContextMenu = (event: MouseEvent, formId: string): void => {
	clickedFormId.value = formId;
	contextMenu.value?.open(event);
};

async function goToFormEditor(id: string, newTab = false): Promise<void> {
	if (newTab) {
		window.open('/admin/' + id);
	} else {
		window.location.href = '/admin/' + id;
	}
}

function getPublicPath(id: string): string {
	const form = store.state?.forms?.filter((f) => f.id === id)[0] as IForm;
	let relativePath;
	if (form.attributes.status === FormStatus.Published) {
		relativePath = '/' + form.attributes.path;
	} else {
		relativePath = '/testa/' + id;
	}
	return relativePath;
}

async function goToPublicForm(id: string): Promise<void> {
	const formUrl = getPublicPath(id);
	window.open(formUrl);
}

function fallbackCopyTextToClipboard(text: string): void {
	const textArea = document.createElement('textarea');
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	document.execCommand('copy');
	document.body.removeChild(textArea);
}

async function copyPublicUrl(id: string): Promise<void> {
	const publicUrl =
		window.location.protocol +
		'//' +
		window.location.host +
		getPublicPath(id);

	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(publicUrl);
	} else {
		await navigator.clipboard.writeText(publicUrl);
	}
}

const confirmArchivingEServiceText = computed(() => {
	if (clickedFormId.value) {
		const form = store.state.forms?.filter(
			(f) => f.id === clickedFormId.value
		)[0] as IForm;
		if (form) {
			return t('component.adminListForms.confirmArchivingEService', [
				form.attributes.title,
			]);
		}
	}
	return '';
});

const sendingRequestToServer = ref<boolean>(false);
async function archiveEService(id: string): Promise<void> {
	const doArchiveEService = await tConfirmDialogAsync(
		t('component.adminListForms.confirmArchivingEServiceTitle'),
		confirmArchivingEServiceText.value,
		{
			text: t('component.adminListForms.confirmArchivingEServiceTitle'),
			color: 'error',
		}
	);
	if (doArchiveEService) {
		sendingRequestToServer.value = true;
		await store.dispatch('archiveEService', { formId: id });
		sendingRequestToServer.value = false;
	}
}

async function cloneEService(id: string): Promise<void> {
	sendingRequestToServer.value = true;
	const newFormId = await store.dispatch('cloneEService', { formId: id });
	goToFormEditor(newFormId);
}

interface IFormItem {
	id: string;
	title: string;
	value: boolean | string;
	saveDateInfo: string;
	receiver: string;
	status: string;
	recentSubmits: number;
	form: IForm;
}
</script>

<style scoped lang="scss">
.admin-list-eServices {
	padding: 20px 30px;

	.create-service-menu-list {
		min-width: max-content;
		border-radius: $border-radius !important;
	}

	.filter-settings {
		margin-top: 16px;
		padding: 4px;
		padding-top: 0;
		border-radius: $border-radius;
		background-color: #f6f6f6;
	}
}
</style>
