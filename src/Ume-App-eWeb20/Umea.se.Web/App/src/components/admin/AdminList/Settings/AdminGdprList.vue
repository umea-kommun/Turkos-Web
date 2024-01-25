<template>
	<div class="admin-gdpr-list">
		<div class="search-wrap admin-list-search-wrap mt-5">
			<ume-text-field
				:placeholder="$t('component.adminGdprManager.search')"
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
				{{ $t('component.adminGdprManager.create') }}
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
				>
					<v-list-item-title>
						{{ $t('component.adminGdprManager.delete') }}
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
			v-else-if="!gdprItems.length"
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
			:items="gdprItems"
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
						{{ item.adminTitle }}
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
					:number-of-items="gdprItems.length"
				/>
			</template>
		</v-data-table>

		<admin-gdpr-edit
			:gdpr="editingItem"
			@close="editingItem = null"
			@save="onSave"
		/>
	</div>
</template>

<script setup lang="ts">
import { IGdpr, IRootState, ISortBy, ITableHeader } from '@/models/IForm';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';
import BaseContextMenu from '@/components/base/BaseContextMenu.vue';
import AdminListPagination from '@/components/admin/AdminList/AdminListPagination.vue';
import AdminListHeaders from '@/components/admin/AdminList/AdminListHeaders.vue';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useTConfirmDialog } from '@turkos/components';
import { Helper } from '@/utils/helper';
import AdminGdprEdit from './AdminGdprEdit.vue';
import { ErrorCode } from '@/models/Enums';
import ErrorService from '@/utils/ErrorService';

const { t } = useI18n();
const store = useStore<IRootState>();
const { tConfirmDialogAsync } = useTConfirmDialog();

const isBusyLoadingFromServer = ref(true);

const search = ref('');

const page = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref<ISortBy[]>([{ key: 'adminTitle', order: 'asc' }]);

const headers: ITableHeader[] = [
	{
		title: t('component.adminListForms.table.headers.text1'),
		align: 'start',
		key: 'id',
	},
	{
		title: t('component.adminListForms.table.headers.text2'),
		align: 'start',
		key: 'adminTitle',
	},
	{ title: '', key: 'actions', align: 'center', sortable: false },
];

const gdprItems = computed(() => {
	if (store.state.gdpr !== null) {
		let items = store.state.gdpr;
		if (search.value) {
			items = items.filter((item) => {
				if (
					(item.adminTitle ?? '')
						.toLowerCase()
						.indexOf(search.value.toLowerCase()) > -1
				) {
					return true;
				} else if (
					item.title
						.toLowerCase()
						.indexOf(search.value.toLowerCase()) > -1
				) {
					return true;
				}
				return false;
			});
		}

		return items;
	} else {
		return [];
	}
});

const editingItem = ref<IGdpr | null>(null);

const onCreate = (): void => {
	const newItem = {
		id: Helper.generateTempIdInteger(),
		type: '',
		adminTitle: '',
		title: '',
		url: '',
	} as IGdpr;
	editingItem.value = newItem;
};
const onEdit = (id: number): void => {
	const item = gdprItems.value.find((item) => item.id === id);
	editingItem.value = item ?? null;
};

const onSave = async (gdpr: IGdpr): Promise<void> => {
	try {
		if (Math.sign(gdpr.id) === -1) {
			// Create new gdpr
			await store.dispatch('createGdpr', {
				gdpr: {
					...gdpr,
					id: null,
				},
			});
		} else {
			// Update existing gdpr
			await store.dispatch('updateGdpr', { gdpr });
		}
	} catch (err) {
		if (err === ErrorCode.MissingTitle) {
			ErrorService.onError({
				err: new Error('createGdpr is missingtitle!'),
				message: t(
					'component.adminGdprManager.error.onCreateGdpr.missingTitle'
				),
				log: false,
			});
		} else if (err === ErrorCode.MissingUrl) {
			ErrorService.onError({
				err: new Error('saveGdpr is missingUrl!'),
				message: t(
					'component.adminGdprManager.error.onCreateGdpr.missingUrl'
				),
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

async function deleteItem(id: number): Promise<void> {
	const item = gdprItems.value.find((item) => item.id === id);
	const doDeleteItem = await tConfirmDialogAsync(
		t('component.adminGdprManager.confirmDelete.title'),
		t('component.adminGdprManager.confirmDelete.text', [item?.adminTitle]),
		{
			text: t('component.adminGdprManager.delete'),
			color: 'error',
		}
	);
	if (doDeleteItem && item) {
		try {
			await store.dispatch('deleteGdpr', {
				gdpr: item,
			});
		} catch (err) {
			if (err === ErrorCode.CannotDeleteObjectWithRelation) {
				ErrorService.onError({
					err: new Error('deleteGdpr have a relation to !'),
					message: t(
						'component.adminGdprManager.error.onDeleteGdpr.restricted'
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
	await store.dispatch('getGdprList');
	isBusyLoadingFromServer.value = false;
});
</script>
