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
			<Form as="" ref="categoryForm" v-slot="{ errors }">
				<v-card v-if="categoryEdit">
					<v-card-title>{{
						$t('component.adminCategoryManager.title')
					}}</v-card-title>
					<admin-list-edit-errors :errors="errors" />
					<v-divider />
					<v-card-text>
						<v-row>
							<v-col>
								<admin-text-box
									id="title"
									name="title"
									v-model="categoryEdit.title"
									:label="
										$t(
											'component.adminCategoryManager.category.title'
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
							{{ $t('component.adminCategoryManager.cancel') }}
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
											'component.adminCategoryManager.create'
									  )
									: $t('component.adminCategoryManager.save')
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</Form>
		</div>
	</v-dialog>
</template>

<script setup lang="ts">
import { ICategory } from '@/models/IForm';
import { computed, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTConfirmDialog } from '@turkos/components';
import { Form } from 'vee-validate';
import { Helper } from '@/utils/helper';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminListEditErrors from '@/components/admin/AdminList/Settings/AdminListEditErrors.vue';

const props = defineProps({
	category: Object as PropType<ICategory | null>,
});
const emit = defineEmits(['save', 'close']);

const { t } = useI18n();
const { tConfirmDialogAsync } = useTConfirmDialog();

const retainDialogFocus = ref(true);
const categoryEdit = ref<ICategory | null>(null);
watch(
	() => props.category,
	() => {
		if (props.category) {
			retainDialogFocus.value = true;
			categoryEdit.value = Helper.deepCopy(props.category);
		} else {
			categoryEdit.value = null;
		}
	}
);

const showModal = computed({
	get: () => !!props.category,
	set: (show: boolean) => {
		if (!show) {
			emit('close');
		}
	},
});

const isNew = computed(() => (categoryEdit.value?.id ?? 0) < 0);

const categoryForm = ref();
const onSave = async (): Promise<void> => {
	const formValid = (await categoryForm.value?.validate())?.valid ?? false;

	if (formValid) {
		emit('save', categoryEdit.value);
		emit('close');
	}
};

const closeDialog = async (): Promise<void> => {
	const edited =
		JSON.stringify(props.category) !== JSON.stringify(categoryEdit.value);

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
