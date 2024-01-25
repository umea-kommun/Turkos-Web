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
			<Form as="" ref="pm3Form" v-slot="{ errors }">
				<v-card v-if="pm3Edit">
					<v-card-title>{{
						$t('component.adminPm3Manager.title')
					}}</v-card-title>
					<admin-list-edit-errors :errors="errors" />
					<v-divider />
					<v-card-text>
						<v-row>
							<v-col>
								<admin-text-box
									id="title"
									name="title"
									v-model="pm3Edit.title"
									:label="
										$t(
											'component.adminPm3Manager.pm3.title'
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
							{{ $t('component.adminPm3Manager.cancel') }}
						</v-btn>
						<v-btn
							color="primary"
							variant="text"
							@click="onSave"
							:disabled="!!Object.keys(errors).length"
						>
							{{
								isNew
									? $t('component.adminPm3Manager.create')
									: $t('component.adminPm3Manager.save')
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</Form>
		</div>
	</v-dialog>
</template>

<script setup lang="ts">
import { IPm3 } from '@/models/IForm';
import { computed, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTConfirmDialog } from '@turkos/components';
import { Form } from 'vee-validate';
import { Helper } from '@/utils/helper';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminListEditErrors from '@/components/admin/AdminList/Settings/AdminListEditErrors.vue';

const props = defineProps({
	pm3: Object as PropType<IPm3 | null>,
});
const emit = defineEmits(['save', 'close']);

const { t } = useI18n();
const { tConfirmDialogAsync } = useTConfirmDialog();

const retainDialogFocus = ref(true);
const pm3Edit = ref<IPm3 | null>(null);
watch(
	() => props.pm3,
	() => {
		if (props.pm3) {
			retainDialogFocus.value = true;
			pm3Edit.value = Helper.deepCopy(props.pm3);
		} else {
			pm3Edit.value = null;
		}
	}
);

const showModal = computed({
	get: () => !!props.pm3,
	set: (show: boolean) => {
		if (!show) {
			emit('close');
		}
	},
});

const isNew = computed(() => (pm3Edit.value?.id ?? 0) < 0);

const pm3Form = ref();
const onSave = async (): Promise<void> => {
	const formValid = (await pm3Form.value?.validate())?.valid ?? false;

	if (formValid) {
		emit('save', pm3Edit.value);
		emit('close');
	}
};

const closeDialog = async (): Promise<void> => {
	const edited = JSON.stringify(props.pm3) !== JSON.stringify(pm3Edit.value);

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
