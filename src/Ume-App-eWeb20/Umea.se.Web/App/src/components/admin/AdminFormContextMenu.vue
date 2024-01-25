<template>
	<base-context-menu ref="contextMenu">
		<v-list class="admin-form-context-menu">
			<v-list-item
				link
				:disabled="!field || !!selectedFields.length"
				prepend-icon="edit"
				@click="emit('editField', field?.id)"
			>
				<v-list-item-title>{{
					$t('component.adminFields.rightClickMenu.edit')
				}}</v-list-item-title>
			</v-list-item>
			<v-divider />
			<span
				:title="
					tableInSelected
						? $t(
								'component.adminFields.rightClickMenu.cantCopyCutTables'
						  )
						: ''
				"
			>
				<v-list-item
					link
					:disabled="!canCopyAndCut"
					prepend-icon="content_cut"
					@click="copyFields(MethodChoice.Cut)"
				>
					<v-list-item-title>{{
						$t('component.adminFields.rightClickMenu.cut')
					}}</v-list-item-title>
				</v-list-item>
				<v-list-item
					link
					:disabled="!canCopyAndCut"
					prepend-icon="content_copy"
					@click="copyFields()"
				>
					<v-list-item-title>{{
						$t('component.adminFields.rightClickMenu.copy')
					}}</v-list-item-title>
				</v-list-item>
			</span>

			<v-list-item
				link
				:disabled="!copiedFields.length"
				prepend-icon="content_paste"
				@click="pasteFields"
			>
				<v-list-item-title>{{
					copiedFields.length
						? $t(
								'component.adminFields.rightClickMenu.pasteNFields',
								[copiedFields.length]
						  )
						: $t('component.adminFields.rightClickMenu.paste')
				}}</v-list-item-title>
			</v-list-item>
			<v-divider />
			<v-list-item
				link
				:disabled="!canChangeFieldType"
				prepend-icon="settings_suggest"
				@click="changeFieldType"
			>
				<v-list-item-title>{{
					$t('component.adminFields.rightClickMenu.changeFieldType')
				}}</v-list-item-title>
			</v-list-item>
			<v-divider />
			<v-list-item
				link
				:disabled="!field"
				prepend-icon="delete_outline"
				class="color-red"
				@click="deleteFields"
			>
				<v-list-item-title>{{
					$t('component.adminFields.rightClickMenu.delete')
				}}</v-list-item-title>
			</v-list-item>
		</v-list>
	</base-context-menu>
</template>

<script setup lang="ts">
import { FormFieldType, MethodChoice, MutationType } from '@/models/Enums';
import {
	IForm,
	ICondition,
	IDisplayRuleGroup,
	IFormField,
	IRootState,
} from '@/models/IForm';
import { Helper } from '@/utils/helper';
import { computed, PropType, ref } from 'vue';
import { useStore } from 'vuex';
import BaseContextMenu from '../base/BaseContextMenu.vue';
import { useAdminFieldType } from '@/components/admin/ChangeFieldType/adminFieldType';

const store = useStore<IRootState>();
const adminFieldType = useAdminFieldType({});

defineProps({
	copiedFields: {
		type: Array as PropType<IFormField[]>,
		default: () => [],
	},
});

const emit = defineEmits([
	'editField',
	'deleteField',
	'pasteFields',
	'changeFieldType',
]);

const field = ref<IFormField | undefined>();
const index = ref<number>(0);
const tableGuid = ref<string | undefined>();

const selectedFields = computed({
	get: () => {
		return store.state.admin?.selectedFields ?? [];
	},
	set: (newValue: string[]) => {
		store.commit(MutationType.UpdateAdminState, {
			prop: 'selectedFields',
			value: newValue,
		});
	},
});

const contextMenu = ref();
const open = (params: {
	$event: MouseEvent;
	field: IFormField | undefined;
	tableGuid: string | undefined;
	index: number | undefined;
}): void => {
	field.value = params.field;
	index.value = params.index ?? 0;
	tableGuid.value = params.tableGuid;

	if (!selectedFields.value.includes(field.value?.guid ?? '')) {
		selectedFields.value = [];
	}

	contextMenu.value?.open(params.$event);
};

const activeStepIndex = computed<number>(
	() => (store.state.admin?.activeStep ?? 1) - 1
);

const tableInSelected = computed(() => {
	if (field.value?.type === FormFieldType.Table) {
		return true;
	}
	if (selectedFields.value.length) {
		// Can not copy/cut tables
		for (const fieldGuid of selectedFields.value) {
			const field = store.state.form?.attributes.steps[
				activeStepIndex.value
			].fields.find((f) => f.guid === fieldGuid);
			if (field?.type === FormFieldType.Table) {
				return true;
			}
		}
	}
	return false;
});

const canCopyAndCut = computed(() => {
	return (
		(!!field.value || !!selectedFields.value.length) &&
		!tableInSelected.value
	);
});

function copyOfConditions(conditions: ICondition[]): ICondition[] {
	const newConditions: ICondition[] = [];
	conditions.forEach((condition) => {
		newConditions.push({
			conditionGuid: Helper.generateUuid(),
			conditionQuestion: condition.conditionQuestion,
			conditionQuestionType: condition.conditionQuestionType,
			conditionChoice: condition.conditionChoice,
			conditionResponse: condition.conditionResponse,
			conditionResponse2: condition.conditionResponse2,
		} as ICondition);
	});
	return newConditions;
}
function copyOfDisplayRuleGroups(
	displayRuleGroups: IDisplayRuleGroup[]
): IDisplayRuleGroup[] {
	const newDisplayRuleGroups: IDisplayRuleGroup[] = [];
	displayRuleGroups.forEach((displayRuleGroup) => {
		newDisplayRuleGroups.push({
			displayRuleGroupGuid: Helper.generateUuid(),
			queryOption: displayRuleGroup.queryOption,
			conditions: copyOfConditions(displayRuleGroup.conditions),
			groups: copyOfDisplayRuleGroups(displayRuleGroup.groups),
		} as IDisplayRuleGroup);
	});
	return newDisplayRuleGroups;
}

const copyFields = (methodChoice: MethodChoice = MethodChoice.Copy): void => {
	const guids = selectedFields.value.length
		? selectedFields.value
		: [field.value?.guid];
	const fieldsData: IFormField[] = [];

	guids.forEach((guid) => {
		const field = store.state.form?.attributes.steps[
			activeStepIndex.value
		].fields.find((f) => f.guid === guid);
		if (field) {
			const fieldData = Helper.deepCopy(field);
			if (fieldData.fieldOptions.tableGuid) {
				delete fieldData.fieldOptions.tableGuid;
			}
			if (fieldData.displayRuleGroup) {
				if (fieldData.displayRuleGroup.displayRuleGroupGuid !== '') {
					const displayRuleGroupGuid = Helper.generateUuid();
					const newDisplayRuleGroup = {
						displayRuleGroupGuid,
						queryOption: fieldData.displayRuleGroup.queryOption,
						conditions: copyOfConditions(
							fieldData.displayRuleGroup.conditions
						),
						groups: copyOfDisplayRuleGroups(
							fieldData.displayRuleGroup.groups
						),
					} as IDisplayRuleGroup;
					fieldData.displayRuleGroup = newDisplayRuleGroup;
				} else {
					fieldData.displayRuleGroup = null;
				}
			}
			if (fieldData.displayRuleGroup?.id) {
				delete fieldData.displayRuleGroup.id;
			}
			fieldsData.push(fieldData);
		}
	});

	// Keep fields in order of form (otherwise they would be in the order that they were selected)
	fieldsData.sort((a, b) => {
		const aIndex =
			store.state.form?.attributes.steps[
				activeStepIndex.value
			].fields.findIndex((f) => f.guid === a.guid) ?? 0;

		const bIndex =
			store.state.form?.attributes.steps[
				activeStepIndex.value
			].fields.findIndex((f) => f.guid === b.guid) ?? 0;

		return aIndex - bIndex;
	});

	store.commit(MutationType.CopyFields, {
		fieldsJson: fieldsData,
		methodChoice,
		formId: store.state.form?.id,
	});
};

const pasteFields = (): void => {
	emit('pasteFields', index.value, tableGuid.value);
};

const deleteFields = (): void => {
	if (selectedFields.value?.length) {
		emit('deleteField', selectedFields.value);
	} else {
		emit('deleteField', [field.value?.guid]);
	}
};

const canChangeFieldType = computed(() => {
	const fieldTypes: FormFieldType[] = [];
	if (selectedFields.value.length) {
		selectedFields.value.forEach((fieldGuid) => {
			const selectedField = Helper.findFieldByGuid(
				fieldGuid,
				store.state.form as IForm
			);
			if (selectedField) {
				fieldTypes.push(selectedField.type as FormFieldType);
			}
		});
	} else if (field.value) {
		fieldTypes.push(field.value.type as FormFieldType);
	} else {
		return false;
	}

	return !!adminFieldType.allowedNewTypes(fieldTypes).length;
});

const changeFieldType = (): void => {
	if (canChangeFieldType.value) {
		if (selectedFields.value.length) {
			emit('changeFieldType', selectedFields.value);
		} else {
			emit('changeFieldType', [field.value?.guid]);
		}
	}
};

defineExpose({
	open,
});
</script>

<style scoped lang="scss">
.admin-form-context-menu {
	border-radius: $border-radius !important;

	.color-red {
		color: $error;
	}
	:deep(.v-list-item__spacer) {
		display: none;
	}
	:deep(.v-list-item__prepend > .v-icon) {
		margin-right: 14px;
	}
}
</style>
