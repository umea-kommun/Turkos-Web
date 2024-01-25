<template>
	<div class="card-wrap">
		<h2>{{ $t('component.adminFormProperties.properties.title') }}</h2>
		<v-card :loading="isBusyLoadingFromServer">
			<v-row>
				<v-col cols="8">
					<admin-text-box
						:id="'eService-title'"
						v-model="formTitle"
						:label="
							$t(
								'component.adminFormProperties.properties.titleOnForm'
							)
						"
						rules="required"
					/>
				</v-col>
				<v-col>
					<admin-select-list
						:id="'eService-status'"
						v-model="formStatus"
						:items="availableFormStatus"
						:label="
							$t(
								'component.adminFormProperties.properties.status'
							)
						"
					/>
				</v-col>
			</v-row>
			<admin-html-preview
				:id="'eService-description'"
				v-model="formDescription"
				:label="
					$t('component.adminFormProperties.properties.description')
				"
				:help-text="
					$t(
						'component.adminFormProperties.properties.descriptionHelpText'
					)
				"
				:text-area="true"
				:readonly="true"
				@click="
					showDescriptionEditor('description-editor', formDescription)
				"
			/>
			<base-html-editor-modal
				ref="dialog"
				:title="
					$t('component.adminFormProperties.properties.description')
				"
				:allow-images="true"
				@updated-value="({ htmlText }) => (formDescription = htmlText)"
				field-id="eService-description"
			/>
			<v-row>
				<v-col>
					<admin-text-box
						:id="'eService-path'"
						v-model="formPath"
						:label="
							$t('component.adminFormProperties.properties.path')
						"
						:prefix="formPathPrefix"
						@input="checkFormPathDebounce"
						:rules="
							formPathIsUnique
								? 'required|validFormPath'
								: 'required|validFormPath|formPathNotUnique'
						"
					/>
				</v-col>
			</v-row>

			<span
				v-if="
					form.attributes.type !== FormType.InfoPage &&
					form.attributes.type !== FormType.LinkExternal
				"
			>
				<v-row>
					<v-col>
						<admin-select-list
							:id="'eService-receiver'"
							v-model="selectedReceiverId"
							:items="receiverItems"
							:label="
								$t(
									'component.adminFormProperties.properties.receiver'
								)
							"
							item-value="id"
							:disabled="isBusyLoadingFromServer"
							rules="required"
						/>
					</v-col>
					<v-col>
						<admin-select-list
							:id="'eService-pm3'"
							v-model="selectedPm3Id"
							:items="pm3Items"
							:label="
								$t(
									'component.adminFormProperties.properties.pm3'
								)
							"
							item-value="id"
							:disabled="isBusyLoadingFromServer"
							rules="required"
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<admin-select-list
							:id="'eService-lifeSituation'"
							v-model="selectedLifeSituationIds"
							:items="lifeSituationItems"
							:label="
								$t(
									'component.adminFormProperties.properties.lifeSituation'
								)
							"
							item-value="id"
							:multiple="true"
							:disabled="isBusyLoadingFromServer"
							rules="required"
						/>
					</v-col>
					<v-col>
						<admin-select-list
							:id="'eService-category'"
							v-model="selectedCategoryIds"
							:items="categoryItems"
							:label="
								$t(
									'component.adminFormProperties.properties.category'
								)
							"
							item-value="id"
							:multiple="true"
							:disabled="isBusyLoadingFromServer"
							rules="required"
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6">
						<admin-select-list
							:id="'eService-gdpr'"
							v-model="selectedGdprIds"
							:items="gdprItems"
							:label="
								$t(
									'component.adminFormProperties.properties.gdpr'
								)
							"
							item-value="id"
							:multiple="true"
							:disabled="isBusyLoadingFromServer"
							rules="required"
						/>
					</v-col> </v-row
			></span>
			<span v-else-if="form.attributes.type === FormType.LinkExternal">
				<v-row>
					<v-col>
						<admin-text-box
							:id="'eService-link-external'"
							v-model="linkExternal"
							:label="
								$t(
									'component.adminFormProperties.properties.linkExternal'
								)
							"
							rules="required"
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<admin-select-list
							:id="'eService-pm3'"
							v-model="selectedPm3Id"
							:items="pm3Items"
							:label="
								$t(
									'component.adminFormProperties.properties.pm3'
								)
							"
							item-value="id"
							:disabled="isBusyLoadingFromServer"
							rules="required"
						/>
					</v-col>
					<v-col>
						<admin-select-list
							:id="'eService-lifeSituation'"
							v-model="selectedLifeSituationIds"
							:items="lifeSituationItems"
							:label="
								$t(
									'component.adminFormProperties.properties.lifeSituation'
								)
							"
							item-value="id"
							:multiple="true"
							:disabled="isBusyLoadingFromServer"
							rules="required"
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6">
						<admin-select-list
							:id="'eService-category'"
							v-model="selectedCategoryIds"
							:items="categoryItems"
							:label="
								$t(
									'component.adminFormProperties.properties.category'
								)
							"
							item-value="id"
							:multiple="true"
							:disabled="isBusyLoadingFromServer"
							rules="required"
						/>
					</v-col>
				</v-row>
			</span>
		</v-card>
	</div>
</template>

<script setup lang="ts">
import { IForm, IItem, IRootState } from '@/models/IForm';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminHtmlPreview from '@/components/field/admin/AdminHtmlPreview.vue';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { FormStatus, MutationType, FormType } from '@/models/Enums';
import BaseHtmlEditorModal from '@/components/base/BaseHtmlEditorModal.vue';
import { useDebounceFn } from '@vueuse/core';
import { validFormPath } from '@/plugins/validation';

const store = useStore<IRootState>();
const { t } = useI18n();

const isBusyLoadingFromServer = ref(false);

onMounted(async () => {
	// Fetch needed data
	isBusyLoadingFromServer.value = true;
	await Promise.all([
		store.dispatch('getPm3List'),
		store.dispatch('getGdprList'),
		store.dispatch('getReceiverList'),
		store.dispatch('getLifeSituationList'),
		store.dispatch('getCategoryList'),
	]);
	isBusyLoadingFromServer.value = false;
});

const form = computed(() => store.state.form as IForm);

const formTitle = computed({
	get: () => {
		return form.value.attributes.title;
	},
	set: (newTitle: string) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue: newTitle,
			fieldProperty: 'title',
		});
	},
});

const availableFormStatus = computed(() => {
	return [
		{
			value: FormStatus.Draft,
			title: t('component.adminFormProperties.draft'),
		},
		{
			value: FormStatus.Published,
			title: t('component.adminFormProperties.published'),
		},
		{
			value: FormStatus.Unpublished,
			title: t('component.adminFormProperties.unPublished'),
		},
	];
});
const formStatus = computed({
	get: () => {
		return form.value.attributes.status;
	},
	set: (newValue: FormStatus) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue,
			fieldProperty: 'status',
		});
	},
});

const formDescription = computed({
	get: () => {
		return form.value.attributes.description;
	},
	set: (newValue: string) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue,
			fieldProperty: 'description',
		});
	},
});

const formPathIsUnique = computed({
	get: () => store.state.admin?.pathUnique ?? true,
	set: (value: boolean) => {
		store.commit(MutationType.UpdateAdminState, {
			prop: 'pathUnique',
			value,
		});
	},
});
const checkFormPath = async (): Promise<void> => {
	// If the path is valid check if it is being used by another form
	if (
		form.value.attributes.path?.length &&
		validFormPath(form.value.attributes.path)
	) {
		const exists = await store.dispatch('formPathExists', {
			path: form.value.attributes.path,
			exceptId: form.value.id,
		});
		formPathIsUnique.value = !exists;
	}
};
const checkFormPathDebounce = useDebounceFn(checkFormPath, 750);

const formPath = computed({
	get: () => {
		return form.value.attributes.path;
	},
	set: (newValue: string) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue,
			fieldProperty: 'path',
		});
	},
});
const formPathPrefix = `${window.location.protocol}//${window.location.host}/`;

const linkExternal = computed({
	get: () => {
		return form.value.attributes.linkUrl ?? '';
	},
	set: (newValue: string) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue,
			fieldProperty: 'linkUrl',
		});
	},
});

const dialog = ref<InstanceType<typeof BaseHtmlEditorModal> | null>(null);
function showDescriptionEditor(id: string, value: string): void {
	dialog.value?.open(id, value);
}

function sortArrayList(list: IItem[]): IItem[] {
	return list.sort(function (a, b) {
		const x = a.title?.toLowerCase() ?? '';
		const y = b.title?.toLowerCase() ?? '';
		if (x < y) {
			return -1;
		}
		if (x > y) {
			return 1;
		}
		return 0;
	});
}

// Receiver
const receiverItems = computed(() => {
	if (store.state.receivers !== null) {
		const temp: IItem[] = store.state.receivers.map((element) => ({
			id: element.id,
			title: element.adminTitle,
			value: element.url,
			isChecked: false,
		}));
		return sortArrayList(temp);
	} else {
		return [] as IItem[];
	}
});
const selectedReceiverId = computed({
	get: () => {
		const selected = receiverItems.value.find(
			(item) => item.id === form.value.attributes.receiver?.id
		);
		return selected?.id ?? '';
	},
	set: (selectedItemId: number) => {
		const item = store.state.receivers?.find(
			(item) => item.id === selectedItemId
		);
		if (item) {
			// Send item to store
			store.commit(MutationType.UpdateFormProperty, {
				newValue: {
					id: item.id,
					adminTitle: item.adminTitle,
					title: item.title,
					url: item.url,
				},
				fieldProperty: 'receiver',
			});
		}
	},
});

// Pm3 items
const pm3Items = computed(() => {
	if (store.state.pm3 !== null) {
		const temp: IItem[] = store.state.pm3.map((element) => ({
			id: element.id,
			title: element.title,
			value: '',
			isChecked: false,
		}));
		return sortArrayList(temp);
	} else {
		return [] as IItem[];
	}
});
const selectedPm3Id = computed({
	get: () => {
		const selected = pm3Items.value.find(
			(item) => item.id === form.value.attributes.pM3?.id
		);
		return selected?.id ?? '';
	},
	set: (selectedItemId: string) => {
		const item = pm3Items.value.find((item) => item.id === selectedItemId);
		if (item) {
			// Send item to store
			store.commit(MutationType.UpdateFormProperty, {
				newValue: { id: item.id, title: item.title },
				fieldProperty: 'pM3',
			});
		}
	},
});

// Life situations
const lifeSituationItems = computed(() => {
	if (store.state.lifeSituations !== null) {
		const temp: IItem[] = store.state.lifeSituations.map((element) => ({
			id: element.id,
			title: element.title,
			value: '',
			isChecked: false,
		}));

		return sortArrayList(temp);
	} else {
		return [] as IItem[];
	}
});
const selectedLifeSituationIds = computed({
	get: () => {
		const ids: number[] = [];
		if (form.value.attributes.lifeSituations?.length > 0) {
			form.value.attributes.lifeSituations.forEach((item) => {
				if (lifeSituationItems.value.find((c) => c.id === item.id)) {
					ids.push(item.id);
				}
			});
		}
		return ids;
	},
	set: (selectedIds: number[]) => {
		const availableLifeSituations = store.state.lifeSituations;
		if (availableLifeSituations?.length) {
			const temp = availableLifeSituations.filter((lifeSituations) => {
				return selectedIds.indexOf(lifeSituations.id) > -1;
			});
			// Send items to store
			store.commit(MutationType.UpdateFormProperty, {
				newValue: temp,
				fieldProperty: 'lifeSituations',
			});
		}
	},
});

// Categories
const categoryItems = computed(() => {
	if (store.state.categories !== null) {
		const temp: IItem[] = store.state.categories.map((element) => ({
			id: element.id,
			title: element.title,
			value: '',
			isChecked: false,
		}));
		return sortArrayList(temp);
	} else {
		return [] as IItem[];
	}
});
const selectedCategoryIds = computed({
	get: () => {
		// Check if form have categories
		const ids: number[] = [];
		if (form.value.attributes.categories?.length > 0) {
			form.value.attributes.categories.forEach((item) => {
				if (categoryItems.value.find((c) => c.id === item.id)) {
					ids.push(item.id);
				}
			});
		}
		return ids;
	},
	set: (selectedIds: number[]) => {
		// Send items to store
		const availableCategories = store.state.categories;
		if (availableCategories?.length) {
			const temp = availableCategories.filter((categories) => {
				return selectedIds.indexOf(categories.id) > -1;
			});
			store.commit(MutationType.UpdateFormProperty, {
				newValue: temp,
				fieldProperty: 'categories',
			});
		}
	},
});

// GDPR
const gdprItems = computed(() => {
	if (store.state.gdpr !== null) {
		const temp: IItem[] = store.state.gdpr.map((element) => ({
			id: element.id,
			title: element.adminTitle,
			value: element.url,
			isChecked: false,
		}));

		return sortArrayList(temp);
	} else {
		return [];
	}
});
const selectedGdprIds = computed({
	get: () => {
		// Check if form have a gdpr
		const ids: number[] = [];
		if (form.value.attributes.gDPR.dataControllers.length > 0) {
			form.value.attributes.gDPR.dataControllers.forEach((item) => {
				if (gdprItems.value.find((c) => c.id === item.id)) {
					ids.push(item.id);
				}
			});
		}
		return ids;
	},
	set: (selectedIds: number[]) => {
		// Send items to store
		const availableGdprs = store.state.gdpr;

		if (availableGdprs?.length) {
			const temp = availableGdprs.filter((gdpr) => {
				return selectedIds.indexOf(gdpr.id) > -1;
			});
			store.commit(MutationType.UpdateFormProperty, {
				newValue: { dataControllers: temp },
				fieldProperty: 'gDPR',
			});
		}
	},
});
</script>
