<template>
	<v-dialog
		v-model="showModal"
		scrollable
		width="800"
		@click:outside="closeDialog"
		:persistent="true"
		:retain-focus="retainDialogFocus"
	>
		<div class="admin-list-edit">
			<Form as="" ref="gdprForm" v-slot="{ errors }">
				<v-card v-if="gdprEdit">
					<v-card-title>{{
						$t('component.adminGdprManager.title')
					}}</v-card-title>
					<admin-list-edit-errors :errors="errors" />
					<v-divider />
					<v-card-text>
						<v-row>
							<v-col>
								<admin-text-box
									id="adminTitle"
									name="adminTitle"
									v-model="adminTitle"
									:label="
										$t(
											'component.adminGdprManager.gdpr.adminTitle'
										)
									"
									rules="required"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-text-box
									id="title"
									name="title"
									v-model="gdprEdit.title"
									:label="
										$t(
											'component.adminGdprManager.gdpr.title'
										)
									"
									rules="required"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<admin-text-box
									id="url"
									name="url"
									v-model="gdprEdit.url"
									:label="
										$t(
											'component.adminGdprManager.gdpr.url'
										)
									"
									rules="required|url"
								/>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider />
					<v-card-actions>
						<v-btn variant="text" @click="showModal = false">
							{{ $t('component.adminGdprManager.cancel') }}
						</v-btn>
						<v-btn
							color="primary"
							variant="text"
							@click="onSave"
							:disabled="!!Object.keys(errors).length"
						>
							{{
								isNew
									? $t('component.adminGdprManager.create')
									: $t('component.adminGdprManager.save')
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</Form>
		</div>
	</v-dialog>
</template>

<script setup lang="ts">
import { IGdpr } from '@/models/IForm';
import { computed, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTConfirmDialog } from '@turkos/components';
import { Form } from 'vee-validate';
import { Helper } from '@/utils/helper';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminListEditErrors from '@/components/admin/AdminList/Settings/AdminListEditErrors.vue';

const props = defineProps({
	gdpr: Object as PropType<IGdpr | null>,
});
const emit = defineEmits(['save', 'close']);

const { t } = useI18n();
const { tConfirmDialogAsync } = useTConfirmDialog();

const retainDialogFocus = ref(true);
const gdprEdit = ref<IGdpr | null>(null);
watch(
	() => props.gdpr,
	() => {
		if (props.gdpr) {
			retainDialogFocus.value = true;
			gdprEdit.value = Helper.deepCopy(props.gdpr);
		} else {
			gdprEdit.value = null;
		}
	}
);

const showModal = computed({
	get: () => !!props.gdpr,
	set: (show: boolean) => {
		if (!show) {
			emit('close');
		}
	},
});

const isNew = computed(() => (gdprEdit.value?.id ?? 0) < 0);

const adminTitle = computed({
	get: () => gdprEdit.value?.adminTitle ?? '',
	set: (val: string) => {
		if (gdprEdit.value) {
			gdprEdit.value.adminTitle = val;
		}
	},
});

const gdprForm = ref();
const onSave = async (): Promise<void> => {
	const formValid = (await gdprForm.value?.validate())?.valid ?? false;

	if (formValid) {
		emit('save', gdprEdit.value);
		emit('close');
	}
};

const closeDialog = async (): Promise<void> => {
	const edited =
		JSON.stringify(props.gdpr) !== JSON.stringify(gdprEdit.value);

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
</script>
