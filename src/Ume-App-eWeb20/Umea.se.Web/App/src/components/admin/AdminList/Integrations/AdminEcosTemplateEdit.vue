<template>
	<v-dialog
		v-model="showModal"
		scrollable
		width="800"
		@click:outside="closeDialog"
		:persistent="true"
		:retain-focus="retainDialogFocus"
	>
		<div class="admin-list-edit admin-ecos-template-edit" v-if="ecosEdit">
			<Form as="" ref="ecosForm" v-slot="{ errors }">
				<v-card :loading="loading">
					<v-card-title>{{
						$t('component.adminEcosManager.title')
					}}</v-card-title>
					<admin-list-edit-errors :errors="errors" />
					<v-divider />
					<v-card-text>
						<v-row>
							<v-col
								><div
									v-if="
										ecosEdit.eServiceConnection.length > 0
									"
									class="eServiceConnection"
								>
									<p>
										{{
											$t(
												'component.adminEcosManager.eServiceConnection'
											)
										}}
									</p>
									<div class="eServiceConnectionList">
										<ul class="ml-5">
											<template
												v-for="eServiceConTitle in ecosEdit.eServiceConnection"
												:key="eServiceConTitle"
											>
												<li>
													{{ eServiceConTitle }}
												</li>
											</template>
										</ul>
									</div>
									<p class="mb-0 mt-4">
										{{
											$t(
												'component.adminEcosManager.eServiceConnectionDescription'
											)
										}}
									</p>
								</div>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-text-box
									id="title"
									name="title"
									v-model="title"
									:label="
										$t(
											'component.adminEcosManager.ecos.title'
										)
									"
									rules="required"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-select-list
									id="processType"
									name="processType"
									:label="
										$t(
											'component.adminEcosManager.ecos.processType'
										)
									"
									v-model="ecosEdit.processTypeGuid"
									:items="processTypes"
									item-value="id"
									rules="required"
									:standalone="false"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-text-box
									id="caseSubTitleItemTitle"
									name="caseSubTitleItemTitle"
									v-model="caseSubTitleItemTitle"
									:label="
										$t(
											'component.adminEcosManager.ecos.caseSubTitle'
										)
									"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-select-list
									id="roles"
									name="roles"
									:label="
										$t(
											'component.adminEcosManager.ecos.role'
										)
									"
									v-model="selectedRoles"
									:items="caseRoles"
									item-value="id"
									:multiple="true"
									rules="required"
									:standalone="false"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-select-list
									id="addressType"
									name="addressType"
									:label="
										$t(
											'component.adminEcosManager.ecos.addressType'
										)
									"
									v-model="selectedAddressTypes"
									:items="addressTypes"
									item-value="id"
									:multiple="true"
									rules="required"
									:standalone="false"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-select-list
									id="diaryPlans"
									name="diaryPlans"
									:label="
										$t(
											'component.adminEcosManager.ecos.diaryplan'
										)
									"
									v-model="ecosEdit.diaryPlanGuid"
									:items="diaryPlans"
									item-value="id"
									rules="required"
									:standalone="false"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-select-list
									id="administratorGroup"
									name="administratorGroup"
									:label="
										$t(
											'component.adminEcosManager.ecos.administratorGroup'
										)
									"
									v-model="
										ecosEdit.handlingOfficerGroupTypeGuid
									"
									:items="handlingOfficerGroups"
									item-value="id"
									rules="required"
									:standalone="false"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-text-box
									id="municipalityCode"
									name="municipalityCode"
									:label="
										$t(
											'component.adminEcosManager.ecos.municipalityCode'
										)
									"
									v-model="municipalityCodeTitle"
									:disabled="true"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-select-list
									id="occurrenceType"
									name="occurrenceType"
									:label="
										$t(
											'component.adminEcosManager.ecos.occurrenceType'
										)
									"
									v-model="ecosEdit.occurrenceTypeGuid"
									:items="occurrenceTypes"
									item-value="id"
									rules="required"
									:standalone="false"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-select-list
									id="notificationType"
									name="notificationType"
									:label="
										$t(
											'component.adminEcosManager.ecos.notificationType'
										)
									"
									v-model="ecosEdit.notificationTypeGuid"
									:items="notificationTypes"
									item-value="id"
									rules="required"
									:standalone="false"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-select-list
									id="documentType"
									name="documentType"
									:label="
										$t(
											'component.adminEcosManager.ecos.documentType'
										)
									"
									v-model="selectedDocumentTypes"
									:items="documentTypes"
									item-value="id"
									:multiple="true"
									:disabled="isTemplateUsed"
								/>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider />
					<v-card-actions>
						<v-btn variant="text" @click="showModal = false">
							{{ $t('component.adminEcosManager.cancel') }}
						</v-btn>
						<v-btn
							color="primary"
							variant="text"
							@click="onSave"
							:disabled="
								!!Object.keys(errors).length || isTemplateUsed
							"
						>
							{{
								isNew
									? $t('component.adminEcosManager.create')
									: $t('component.adminEcosManager.save')
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</Form>
		</div>
	</v-dialog>
</template>

<script setup lang="ts">
import { IEcosTemplate, IItem } from '@/models/IForm';
import { computed, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTConfirmDialog } from '@turkos/components';
import { Form } from 'vee-validate';
import { Helper } from '@/utils/helper';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminListEditErrors from '@/components/admin/AdminList/Settings/AdminListEditErrors.vue';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';

const props = defineProps({
	ecos: Object as PropType<IEcosTemplate | null>,
	loading: { type: Boolean, required: true },
	caseRoles: { type: Array as PropType<IItem[]>, required: true },
	addressTypes: { type: Array as PropType<IItem[]>, required: true },
	occurrenceTypes: { type: Array as PropType<IItem[]>, required: true },
	notificationTypes: { type: Array as PropType<IItem[]>, required: true },
	processTypes: { type: Array as PropType<IItem[]>, required: true },
	documentTypes: { type: Array as PropType<IItem[]>, required: true },
	diaryPlans: { type: Array as PropType<IItem[]>, required: true },
	handlingOfficerGroups: { type: Array as PropType<IItem[]>, required: true },
});

const emit = defineEmits(['save', 'close']);

const { t } = useI18n();
const { tConfirmDialogAsync } = useTConfirmDialog();

const retainDialogFocus = ref(true);
const ecosEdit = ref<IEcosTemplate | null>(null);
watch(
	() => props.ecos,
	() => {
		if (props.ecos) {
			retainDialogFocus.value = true;
			ecosEdit.value = Helper.deepCopy(props.ecos);
		} else {
			ecosEdit.value = null;
		}
	}
);

const showModal = computed({
	get: () => !!props.ecos,
	set: (show: boolean) => {
		if (!show) {
			emit('close');
		}
	},
});

const isNew = computed(() => (ecosEdit.value?.id ?? 0) < 0);

const ecosForm = ref();
const onSave = async (): Promise<void> => {
	const formValid = (await ecosForm.value?.validate())?.valid ?? false;

	if (formValid) {
		emit('save', ecosEdit.value);
		emit('close');
	}
};

const closeDialog = async (): Promise<void> => {
	const edited =
		JSON.stringify(props.ecos) !== JSON.stringify(ecosEdit.value);

	if (edited) {
		retainDialogFocus.value = false;
		const keepChanges = await tConfirmDialogAsync(
			t('component.adminForm.integrationEdit.keepChangesModal.title'),
			t('component.adminForm.integrationEdit.keepChangesModal.text'),
			{
				text: t(
					'component.adminForm.integrationEdit.keepChangesModal.yes'
				),
				color: 'primary',
			},
			{
				text: t(
					'component.adminForm.integrationEdit.keepChangesModal.no'
				),
			}
		);
		if (keepChanges) {
			onSave();
			return;
		}
	}
	showModal.value = false;
};

const isTemplateUsed = computed(
	() => (ecosEdit.value?.eServiceConnection?.length ?? 0) > 0
);

const title = computed({
	get: () => ecosEdit.value?.title ?? '',
	set: (val: string) => {
		if (ecosEdit.value) {
			ecosEdit.value.title = val;
		}
	},
});

const caseSubTitleItemTitle = computed({
	get: () => ecosEdit.value?.caseSubTitleItem?.title ?? '',
	set: (val: string) => {
		if (ecosEdit.value) {
			ecosEdit.value.caseSubTitleItem.title = val;
		}
	},
});

const selectedRoles = computed({
	get: () => {
		return (
			ecosEdit.value?.roles
				?.filter((role) => role.isChecked)
				.map((role) => role.id) ?? []
		);
	},
	set: (val: string[]) => {
		if (ecosEdit.value) {
			ecosEdit.value.roles = props.caseRoles
				.filter((role) => val.includes(role.id))
				.map((role) => ({ ...role, isChecked: true }));
		}
	},
});

const selectedAddressTypes = computed({
	get: () => {
		return (
			ecosEdit.value?.addressTypes
				?.filter((addressType) => addressType.isChecked)
				.map((addressType) => addressType.id) ?? []
		);
	},
	set: (val: string[]) => {
		if (ecosEdit.value) {
			ecosEdit.value.addressTypes = props.addressTypes
				.filter((addressType) => val.includes(addressType.id))
				.map((addressType) => ({ ...addressType, isChecked: true }));
		}
	},
});

const municipalityCodeTitle = computed({
	get: () => ecosEdit.value?.municipalityCode.title ?? '',
	set: (val: string) => {
		if (ecosEdit.value) {
			ecosEdit.value.municipalityCode.title = val;
		}
	},
});

const selectedDocumentTypes = computed({
	get: () => {
		return (
			ecosEdit.value?.documentTypes
				?.filter((documentType) => documentType.isChecked)
				.map((documentType) => documentType.id) ?? []
		);
	},
	set: (val: string[]) => {
		if (ecosEdit.value) {
			ecosEdit.value.documentTypes = props.documentTypes
				.filter((documentType) => val.includes(documentType.id))
				.map((documentType) => ({ ...documentType, isChecked: true }));
		}
	},
});
</script>

<style lang="scss">
.admin-ecos-template-edit {
	.eServiceConnection {
		background-color: #f2f2f2;
		border-radius: $border-radius;
		padding: 16px;
	}
}
</style>
