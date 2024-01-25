<template>
	<div class="admin-form-edit" @click="clearSelectedFields">
		<!--Render steps sidebar -->
		<admin-steps />

		<!-- Right click menu -->
		<admin-form-context-menu
			ref="contextMenu"
			:copied-fields="copiedFields"
			@edit-field="(id) => setActiveField(id)"
			@delete-field="(guids) => onRemoveField(guids)"
			@paste-fields="onPasteFields"
			@change-field-type="onChangeFieldType"
		/>

		<!-- Change field type -->
		<admin-change-field-type ref="changeFieldTypeDialog" />

		<div class="space-left"></div>
		<div
			v-if="form.attributes.steps.length && activeStep"
			class="admin-form-edit__content"
			:key="activeStep"
		>
			<admin-step-text
				id="step-title"
				v-model="currentStepTitle"
				:label="$t('component.adminSteps.title.label')"
				:help-text="$t('component.adminSteps.title.hint')"
				@focus="hideFieldOptions"
			/>
			<admin-step-text
				id="step-description"
				v-model="currentStepDescription"
				:label="$t('component.adminSteps.description.label')"
				:help-text="$t('component.adminSteps.description.hint')"
				:text-area="true"
				@focus="hideFieldOptions"
			/>

			<nested-draggable
				:fields="rootFormFields"
				@onAddField="onAddField"
				@onChangeField="onChangeField"
				@showContextMenu="showContextMenu"
			/>
		</div>
		<div class="space-right"></div>

		<!-- Render field options sidebar -->
		<Transition name="slide-fade">
			<admin-field-options
				v-if="activeField"
				:field="activeField"
				@removeField="onRemoveField"
			/>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import AdminSteps from '@/components/admin/AdminSteps.vue';
import AdminFieldOptions from '@/components/admin/AdminFieldOptions/AdminFieldOptions.vue';
import AdminStepText from '@/components/field/admin/AdminStepText.vue';
import { IForm, IFormField, IFormStep, IRootState } from '@/models/IForm';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { FormFieldType, MethodChoice, MutationType } from '@/models/Enums';
import FormFieldHelper from '@/models/FormFieldHelper';
import ErrorService from '@/utils/ErrorService';
import { useTConfirmDialog } from '@turkos/components';
import { Helper } from '@/utils/helper';
import nestedDraggable from '@/components/admin/NestedDraggable.vue';
import {
	deleteFieldDisplayRules,
	isFieldUsedInDisplayRules,
	updateAdminMotherFields,
} from '@/store/utils';
import AdminFormContextMenu from './AdminFormContextMenu.vue';
import AdminChangeFieldType from '@/components/admin/ChangeFieldType/AdminChangeFieldType.vue';

const store = useStore<IRootState>();
const { t } = useI18n();

const form = computed(() => store.state.form as IForm);

const activeStep = computed<number>(() => store.state.admin?.activeStep ?? 1);
const activeField = computed(() => {
	if (activeStep.value && store.state.admin?.activeFieldId) {
		return form.value.attributes.steps[activeStep.value - 1].fields.find(
			(field) => field.id === store.state.admin?.activeFieldId
		);
	}
	return undefined;
});

const currentStep = computed<IFormStep>(
	() => form.value.attributes.steps[activeStep.value - 1]
);

const activeStepId = computed<number>(() => {
	return Number(form.value.attributes.steps[activeStep.value - 1].id);
});

const fields = computed<IFormField[]>(() => {
	return form.value.attributes.steps[activeStep.value - 1].fields;
});

const rootFormFields = computed<IFormField[]>(() => {
	// Don't show fields belonging to a table
	return fields.value.filter((field) => !field.fieldOptions.tableGuid);
});

function setActiveField(value: string | null): void {
	store.commit(MutationType.UpdateAdminState, {
		prop: 'activeFieldId',
		value,
	});
}
function hideFieldOptions(): void {
	setActiveField(null);
}

function moveField(
	fields: IFormField[],
	oldIndex: number,
	newIndex: number
): void {
	const element = fields.splice(oldIndex, 1)[0];
	fields.splice(newIndex, 0, element);
}

function rootIndexToFieldIndex(rootIndex: number): number {
	if (rootIndex >= rootFormFields.value.length) {
		return fields.value.length - 1;
	}
	const afterFieldGuid = rootFormFields.value[rootIndex].guid;
	return fields.value.findIndex((f) => f.guid === afterFieldGuid);
}

function onChangeField(added: any, moved: any, tableGuid: string): void {
	if (added !== undefined && added.element.type !== FormFieldType.Table) {
		// Field moved to/from a table
		const newFormFields = Helper.deepCopy(fields.value);

		let oldIndex = newFormFields.findIndex(
			(field) => field.guid === added.element.guid
		);
		let newIndex = 0;
		if (tableGuid) {
			// Moved to a table
			newIndex = fields.value.findIndex(
				(field) => field.guid === tableGuid
			);
			// New index is after table plus index inside table
			if (oldIndex > newIndex) {
				newIndex += added.newIndex + 1;
			} else {
				newIndex += added.newIndex;
			}
		} else {
			// Moved from a table
			newIndex = rootIndexToFieldIndex(added.newIndex);
			if (
				newIndex >= oldIndex &&
				added.newIndex !== rootFormFields.value.length
			) {
				newIndex--;
			}
		}

		moveField(newFormFields, oldIndex, newIndex);

		newFormFields.forEach((field) => {
			if (field.guid === added.element.guid) {
				if (tableGuid) {
					field.fieldOptions.tableGuid = tableGuid;
					field.fieldOptions.columnWidth = 3;
					// Copy data source to table child
					const tableField = fields.value.find(
						(f) => f.guid === tableGuid
					);
					if (tableField?.fieldOptions?.dataSource?.dataSourceName) {
						field.fieldOptions.dataSource =
							tableField.fieldOptions.dataSource;
					}
				} else {
					delete field.fieldOptions.tableGuid;
					delete field.fieldOptions.columnWidth;
					delete field.fieldOptions.dataSource;
				}
			}
		});

		store.commit(MutationType.UpdateFormStep, {
			id: activeStepId.value,
			propertyName: 'fields',
			newValue: newFormFields,
		});
	} else if (moved !== undefined) {
		let newFormFields = Helper.deepCopy(fields.value);
		let oldIndex = 0;
		let newIndex = 0;
		if (tableGuid) {
			oldIndex = fields.value.findIndex(
				(field) => field.guid === moved.element.guid
			);
			newIndex = oldIndex + (moved.newIndex - moved.oldIndex);
		} else {
			oldIndex = rootIndexToFieldIndex(moved.oldIndex);
			newIndex = rootIndexToFieldIndex(moved.newIndex);
		}

		moveField(newFormFields, oldIndex, newIndex);
		if (moved.element.type === FormFieldType.Table) {
			// Table was moved, also move table fields
			const tableFields = newFormFields.filter(
				(field) => field.fieldOptions.tableGuid === moved.element.guid
			);
			const otherFields = newFormFields.filter(
				(field) => field.fieldOptions.tableGuid !== moved.element.guid
			);
			const fieldIndex = otherFields.findIndex(
				(field) => field.guid === moved.element.guid
			);
			newFormFields = [
				...otherFields.slice(0, fieldIndex + 1),
				...tableFields,
				...otherFields.slice(fieldIndex + 1),
			];
		}
		store.commit(MutationType.UpdateFormStep, {
			id: activeStepId.value,
			propertyName: 'fields',
			newValue: newFormFields,
		});
	}
}

/**
 * Get and set current step title from state
 */
const currentStepTitle = computed({
	get: () => currentStep.value.title ?? '',
	set: (value: string) => {
		store.commit(MutationType.UpdateFormStep, {
			id: currentStep.value.id,
			propertyName: 'title',
			newValue: value,
		});
	},
});

/**
 * Get and set current step description from state
 */
const currentStepDescription = computed({
	get: () => currentStep.value.description ?? '',
	set: (value: string) => {
		store.commit(MutationType.UpdateFormStep, {
			id: currentStep.value.id,
			propertyName: 'description',
			newValue: value,
		});
	},
});

const calculateFieldIndex = (index: number): number => {
	// translate root field index to steps.fields index
	const afterField = rootFormFields.value[index - 1];
	let previousFieldIndex = fields.value.findIndex(
		(f) => f.guid === afterField.guid
	);

	if (afterField.type === FormFieldType.Table) {
		// If placed after table, place after the table fields in the list
		fields.value.forEach((field) => {
			if (field.fieldOptions.tableGuid === afterField.guid) {
				previousFieldIndex++;
			}
		});
	}
	return previousFieldIndex + 1;
};

function onAddField(
	fieldType: FormFieldType,
	rootFieldIndex: number,
	tableGuid: string | undefined
): void {
	try {
		const newFormFields = Helper.deepCopy(fields.value);
		const newField = FormFieldHelper.createEmptyField(fieldType);
		let index = rootFieldIndex;

		if (tableGuid) {
			newField.fieldOptions.tableGuid = tableGuid;
			newField.fieldOptions.columnWidth = 3;

			// Copy data source to table child
			const tableField = fields.value.find((f) => f.guid === tableGuid);
			if (tableField?.fieldOptions?.dataSource?.dataSourceName) {
				newField.fieldOptions.dataSource =
					tableField.fieldOptions.dataSource;
			}
		} else if (index > 0) {
			index = calculateFieldIndex(index);
		}
		newFormFields.splice(index, 0, newField);
		store.commit(MutationType.UpdateFormStep, {
			id: activeStepId.value,
			propertyName: 'fields',
			newValue: newFormFields,
		});

		// Set new field as active (open field options)
		setActiveField(newField.id);

		// Focus new field title
		store.commit(MutationType.UpdateAdminState, {
			prop: 'activeFieldOptionsTab',
			value: 1,
		});
		setTimeout(() => {
			document.getElementById('title-' + newField.id)?.focus();
		});
	} catch (err) {
		const message = t('component.adminFields.field.error.onAddField');
		ErrorService.onError({ err, message });
	}
}

function onDelete(fieldGuid: string): void {
	const newRootFormFields = Helper.deepCopy(fields.value);

	const index = newRootFormFields.findIndex((f) => f.guid === fieldGuid);

	if (index > -1) {
		newRootFormFields.splice(index, 1);

		store.commit(MutationType.UpdateFormStep, {
			id: currentStep.value.id,
			propertyName: 'fields',
			newValue: newRootFormFields,
		});
		updateAdminMotherFields();
	}
}

const { tConfirmDialogAsync } = useTConfirmDialog();
/**
 * Remove fields (if user confirms)
 * Note: removal of multiple fields at once is not tested yet
 */
const onRemoveField = async (fieldGuids: string[]): Promise<void> => {
	const hasMotherField = fieldGuids.some((guid) => {
		return isFieldUsedInDisplayRules(guid);
	});

	let doRemove = false;
	if (hasMotherField) {
		// if mother field is being removed, ask different question
		doRemove = await tConfirmDialogAsync(
			t('component.adminFields.field.confirmDeleteMotherQuestion.title'),
			t('component.adminFields.field.confirmDeleteMotherQuestion.text'),
			{
				text: t('component.adminFields.field.delete.btnText'),
				color: 'error',
			}
		);
	} else {
		const isTable =
			fieldGuids.length === 1 &&
			fields.value.find((f) => f.guid === fieldGuids[0])?.type ===
				FormFieldType.Table;

		if (isTable) {
			doRemove = await tConfirmDialogAsync(
				t('component.adminFields.field.confirmDeleteTable.title'),
				t('component.adminFields.field.confirmDeleteTable.text'),
				{
					text: t('component.adminFields.field.deleteTable.btnText'),
					color: 'error',
				}
			);
		} else {
			doRemove = await tConfirmDialogAsync(
				t('component.adminFields.field.confirmDelete.title'),
				t('component.adminFields.field.confirmDelete.text'),
				{
					text: t('component.adminFields.field.delete.btnText'),
					color: 'error',
				}
			);
		}
	}

	if (doRemove) {
		fieldGuids.forEach((guid) => {
			const field = fields.value.find((f) => f.guid === guid);
			if (field) {
				// this field might have been a table child field, and thus already removed
				if (field.type === FormFieldType.Table) {
					// Remove any child fields
					fields.value.forEach((tableField) => {
						if (tableField.fieldOptions.tableGuid === field.guid) {
							deleteFieldDisplayRules(tableField.guid);
							onDelete(tableField.guid);
						}
					});
				}
				if (hasMotherField) {
					deleteFieldDisplayRules(field.guid);
				}
				onDelete(field.guid);
			}
		});
	}
};

const selectedFields = computed(() => {
	return store.state.admin?.selectedFields ?? [];
});
const clearSelectedFields = (): void => {
	// Deselect fields
	if (selectedFields.value.length) {
		store.commit(MutationType.UpdateAdminState, {
			prop: 'selectedFields',
			value: [],
		});
	}
};

const copiedFields = computed(() => {
	return store.state.fieldsCopyMemory.copiedFields || [];
});

/** Delete field and return its old position */
function deleteFormField(fieldGuid: string): {
	stepIndex: number;
	fieldIndex: number;
} {
	form.value.attributes.steps[activeStep.value - 1].fields;
	let stepIndex = -1;
	let fieldIndex = -1;
	form.value.attributes.steps.forEach((step, sIndex) => {
		step.fields.forEach((field, fIndex) => {
			if (field.guid === fieldGuid) {
				// We found the field, store position and delete field
				stepIndex = sIndex;
				fieldIndex = fIndex;
				const newRootFormFields = Helper.deepCopy(step.fields);
				newRootFormFields.splice(fIndex, 1);

				store.commit(MutationType.UpdateFormStep, {
					id: step.id,
					propertyName: 'fields',
					newValue: newRootFormFields,
				});
			}
		});
	});
	return { stepIndex, fieldIndex };
}

const onPasteFields = (index: number, tableGuid: string | undefined): void => {
	if (copiedFields.value.length) {
		if (
			store.state.fieldsCopyMemory.methodChoice === MethodChoice.Cut &&
			store.state.fieldsCopyMemory.formId !== store.state.form?.id
		) {
			// check if cut from another form, don't allow cut from one form and paste in another form
			// You have to copy between forms and not cut.
			ErrorService.onError({
				message:
					'Du kan inte klippa ut fält från en e-tjänst och klistra in i en annan. Testa istället att kopiera fälten.',
				err: 'Cut and paste fields into different form',
				log: false,
			});
			return;
		}
		let newFields: IFormField[] = [];
		let newIndex = index;
		if (!tableGuid && index > 0) {
			newIndex = calculateFieldIndex(index);
		}
		if (store.state.fieldsCopyMemory.methodChoice === MethodChoice.Copy) {
			newFields = FormFieldHelper.createFromCopyOfFields(
				copiedFields.value,
				form.value
			);
		} else {
			newFields = copiedFields.value;

			// If we cut the field from the same step as we paste it, we need to adjust index accordingly
			newFields.forEach((field) => {
				const { stepIndex, fieldIndex } = deleteFormField(field.guid);
				if (
					stepIndex === activeStep.value - 1 &&
					fieldIndex < newIndex
				) {
					newIndex--;
				}
			});
			// Since this is a cut-out (not a copy) we remove the copied data
			store.commit(MutationType.CopyFields, {
				fieldsJson: null,
				methodChoice: MethodChoice.Cut,
			});
		}

		let newFormFields = Helper.deepCopy(fields.value);
		if (tableGuid) {
			newFields.forEach((field) => {
				field.fieldOptions.tableGuid = tableGuid;
				field.fieldOptions.columnWidth = 3;
			});
		}

		newFormFields = [
			...newFormFields.slice(0, newIndex),
			...newFields,
			...newFormFields.slice(newIndex),
		];
		store.commit(MutationType.UpdateFormStep, {
			id: activeStepId.value,
			propertyName: 'fields',
			newValue: newFormFields,
		});
		setTimeout(() => {
			// This mutation is really slow, so I put it in a timeout to not block ui rendering
			store.commit(MutationType.AddFieldsIdsToPasteHistory, {
				idsOfPastedFields: newFields.map((field) => field.id),
			});

			updateAdminMotherFields();
		});
	}
};

const changeFieldTypeDialog = ref<InstanceType<
	typeof AdminChangeFieldType
> | null>(null);
const onChangeFieldType = (fieldGuids: string[]): void => {
	changeFieldTypeDialog.value?.onChangeFieldType(fieldGuids);
};

/** Context menu */
const contextMenu = ref();
const showContextMenu = (params: unknown): void => {
	contextMenu.value?.open(params);
};
</script>

<style scoped lang="scss">
.admin-form-edit {
	display: flex;
	justify-content: center;

	.space-left {
		max-width: 350px;
		min-width: 20%;
		flex: 1;
	}
	.space-right {
		max-width: 520px;
		flex: 1;
	}

	&__content {
		width: 90%;
		max-width: 640px;
		padding: 60px 10px;
	}
}

.slide-fade-enter-active {
	transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateX(20px);
	opacity: 0;
}
</style>
