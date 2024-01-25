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
			<Form as="" ref="receiverForm" v-slot="{ errors }">
				<v-card v-if="receiverEdit">
					<v-card-title>{{
						$t('component.adminReceiverManager.title')
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
											'component.adminReceiverManager.receiver.adminTitle'
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
									v-model="receiverEdit.title"
									:label="
										$t(
											'component.adminReceiverManager.receiver.title'
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
									v-model="receiverEdit.url"
									:label="
										$t(
											'component.adminReceiverManager.receiver.path'
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
							{{ $t('component.adminReceiverManager.cancel') }}
						</v-btn>
						<v-btn
							color="primary"
							variant="text"
							@click="onSave"
							:disabled="!!Object.keys(errors).length"
						>
							{{
								isNew
									? $t(
											'component.adminReceiverManager.create'
									  )
									: $t('component.adminReceiverManager.save')
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</Form>
		</div>
	</v-dialog>
</template>

<script setup lang="ts">
import { IReceiver } from '@/models/IForm';
import { computed, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTConfirmDialog } from '@turkos/components';
import { Form } from 'vee-validate';
import { Helper } from '@/utils/helper';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminListEditErrors from '@/components/admin/AdminList/Settings/AdminListEditErrors.vue';

const props = defineProps({
	receiver: Object as PropType<IReceiver | null>,
});
const emit = defineEmits(['save', 'close']);

const { t } = useI18n();
const { tConfirmDialogAsync } = useTConfirmDialog();

const retainDialogFocus = ref(true);
const receiverEdit = ref<IReceiver | null>(null);
watch(
	() => props.receiver,
	() => {
		if (props.receiver) {
			retainDialogFocus.value = true;
			receiverEdit.value = Helper.deepCopy(props.receiver);
		} else {
			receiverEdit.value = null;
		}
	}
);

const showModal = computed({
	get: () => !!props.receiver,
	set: (show: boolean) => {
		if (!show) {
			emit('close');
		}
	},
});

const isNew = computed(() => (receiverEdit.value?.id ?? 0) < 0);

const adminTitle = computed({
	get: () => receiverEdit.value?.adminTitle ?? '',
	set: (val: string) => {
		if (receiverEdit.value) {
			receiverEdit.value.adminTitle = val;
		}
	},
});

const receiverForm = ref();
const onSave = async (): Promise<void> => {
	const formValid = (await receiverForm.value?.validate())?.valid ?? false;

	if (formValid) {
		emit('save', receiverEdit.value);
		emit('close');
	}
};

const closeDialog = async (): Promise<void> => {
	const edited =
		JSON.stringify(props.receiver) !== JSON.stringify(receiverEdit.value);

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
