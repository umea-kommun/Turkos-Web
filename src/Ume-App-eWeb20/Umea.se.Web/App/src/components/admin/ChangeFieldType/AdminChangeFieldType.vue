<template>
	<v-dialog
		v-model="showDialog"
		scrollable
		width="700"
		class="admin-change-field-type"
		:retain-focus="retainDialogFocus"
	>
		<v-card>
			<v-card-title>{{
				$t('component.adminChangeFieldType.title')
			}}</v-card-title>
			<v-card-text>
				{{ $t('component.adminChangeFieldType.description') }}
				<v-list>
					<v-list-item
						v-for="field in fields"
						:key="field.guid"
						class="mb-2"
					>
						<div class="title">
							{{ field.title }}
						</div>
						<v-avatar>
							<v-icon :icon="getFieldIcon(field)" />
						</v-avatar>
						{{
							$t(
								'component.' +
									fieldTypeCamel(field.type) +
									'.title'
							)
						}}
					</v-list-item>
				</v-list>
				<admin-select-list
					id="change-field-type-to"
					:label="$t('component.adminChangeFieldType.newTypeTitle')"
					v-model="newFieldType"
					:items="allowedNewTypes"
					rules="required"
				/> </v-card-text
			><v-divider></v-divider>
			<v-card-actions>
				<v-spacer />
				<v-btn variant="text" @click="showDialog = false">
					{{ $t('component.adminForm.integrationEdit.cancel') }}
				</v-btn>
				<v-btn
					color="primary"
					variant="text"
					@click="changeFieldType"
					:disabled="!newFieldType"
				>
					{{ $t('component.adminChangeFieldType.save') }}
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import { FormFieldIcon, FormFieldType } from '@/models/Enums';
import { IForm, IFormField, IRootState } from '@/models/IForm';
import { Helper } from '@/utils/helper';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useAdminFieldType } from './adminFieldType';
import { useI18n } from 'vue-i18n';

const store = useStore<IRootState>();
const { t } = useI18n();
const adminFieldType = useAdminFieldType({ store });

const showDialog = ref(false);
const retainDialogFocus = ref(true);
const fields = ref<IFormField[]>([]);
const newFieldType = ref<FormFieldType>();

const fieldTypeCamel = (fieldType: FormFieldType | string): string => {
	return fieldType.charAt(0).toLowerCase() + fieldType.slice(1);
};
const allowedNewTypes = computed(() => {
	return adminFieldType
		.allowedNewTypes(
			fields.value.map((field) => field.type as FormFieldType)
		)
		.map((fieldType) => {
			return {
				value: fieldType,
				title: t('component.' + fieldTypeCamel(fieldType) + '.title'),
			};
		});
});

const changeFieldType = async (): Promise<void> => {
	if (fields.value.length && newFieldType.value) {
		retainDialogFocus.value = false;
		const success = await adminFieldType.changeFieldTypes(
			fields.value,
			newFieldType.value
		);
		retainDialogFocus.value = true;
		if (success) {
			showDialog.value = false;
		}
	}
};

const showChangeFieldTypeDialog = (fieldGuids: string[]): void => {
	showDialog.value = true;
	retainDialogFocus.value = true;

	newFieldType.value = undefined;
	fields.value = [];
	fieldGuids.forEach((fieldGuid) => {
		const field = Helper.findFieldByGuid(
			fieldGuid,
			store.state.form as IForm
		);
		if (field) {
			fields.value.push(Helper.deepCopy(field));
		}
	});
};

const getFieldIcon = (field: IFormField): string => {
	if (field.type in FormFieldIcon) {
		return FormFieldIcon[field.type as FormFieldType];
	}
	return '';
};

defineExpose({ onChangeFieldType: showChangeFieldTypeDialog });
</script>

<style scoped lang="scss">
.admin-change-field-type {
	.v-list-item {
		border: dashed 1px #ccc;
		border-radius: $border-radius;
		:deep(.v-list-item__content) {
			display: flex;
			align-items: center;
			.title {
				flex: 1;
			}
		}
	}
}
</style>
