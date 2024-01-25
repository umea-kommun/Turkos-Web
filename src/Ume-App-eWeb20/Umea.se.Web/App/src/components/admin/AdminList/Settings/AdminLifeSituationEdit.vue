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
			<Form as="" ref="lifeSituationForm" v-slot="{ errors }">
				<v-card v-if="lifeSituationEdit">
					<v-card-title>{{
						$t('component.adminLifeSituationManager.title')
					}}</v-card-title>
					<admin-list-edit-errors :errors="errors" />
					<v-divider />
					<v-card-text>
						<v-row>
							<v-col>
								<admin-text-box
									id="title"
									name="title"
									v-model="lifeSituationEdit.title"
									:label="
										$t(
											'component.adminLifeSituationManager.lifeSituation.title'
										)
									"
									rules="required"
								/>
							</v-col>
						</v-row>
					</v-card-text>
					<v-divider />
					<v-card-actions>
						<v-btn variant="text" @click="showModal = false">
							{{
								$t('component.adminLifeSituationManager.cancel')
							}}
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
											'component.adminLifeSituationManager.create'
									  )
									: $t(
											'component.adminLifeSituationManager.save'
									  )
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</Form>
		</div>
	</v-dialog>
</template>

<script setup lang="ts">
import { ILifeSituation } from '@/models/IForm';
import { computed, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTConfirmDialog } from '@turkos/components';
import { Form } from 'vee-validate';
import { Helper } from '@/utils/helper';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminListEditErrors from '@/components/admin/AdminList/Settings/AdminListEditErrors.vue';

const props = defineProps({
	lifeSituation: Object as PropType<ILifeSituation | null>,
});
const emit = defineEmits(['save', 'close']);

const { t } = useI18n();
const { tConfirmDialogAsync } = useTConfirmDialog();

const retainDialogFocus = ref(true);
const lifeSituationEdit = ref<ILifeSituation | null>(null);
watch(
	() => props.lifeSituation,
	() => {
		if (props.lifeSituation) {
			retainDialogFocus.value = true;
			lifeSituationEdit.value = Helper.deepCopy(props.lifeSituation);
		} else {
			lifeSituationEdit.value = null;
		}
	}
);

const showModal = computed({
	get: () => !!props.lifeSituation,
	set: (show: boolean) => {
		if (!show) {
			emit('close');
		}
	},
});

const isNew = computed(() => (lifeSituationEdit.value?.id ?? 0) < 0);

const lifeSituationForm = ref();
const onSave = async (): Promise<void> => {
	const formValid =
		(await lifeSituationForm.value?.validate())?.valid ?? false;

	if (formValid) {
		emit('save', lifeSituationEdit.value);
		emit('close');
	}
};

const closeDialog = async (): Promise<void> => {
	const edited =
		JSON.stringify(props.lifeSituation) !==
		JSON.stringify(lifeSituationEdit.value);

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
