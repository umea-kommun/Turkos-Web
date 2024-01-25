<template>
	<div class="display-options">
		<div class="display-rules-wrap">
			<display-rule-manager :field="props.field" />
		</div>
		<div class="display-options">
			<!-- Display if applying for other -->
			<admin-switch
				:id="props.field.id + '-displayApplyOther'"
				v-model="displayRuleAnother"
				:label="$t('app.admin.field.checkboxForAnotherText')"
				:help-text="$t('app.admin.field.checkboxForAnotherHelpText')"
			/>

			<!-- Column width inside table -->
			<admin-select-list
				v-if="insideTableRow"
				id="columnWidth"
				v-model="columnWidth"
				:items="columnWidths"
				:label="$t('component.adminFields.columnWidth')"
				:errorMessages="
					isExceedingMaxTableWidth
						? [$t('component.adminFields.columnWidthWarning')]
						: []
				"
			/>

			<!-- Hidden field - show in review step -->
			<admin-switch
				v-if="field.type === FormFieldType.HiddenTextBox"
				id="showToUser"
				v-model="showToUser"
				:label="$t('component.adminFields.showToUser')"
				:help-text="$t('component.adminFields.showToUserHelpText')"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FormFieldType, MutationType } from '@/models/Enums';
import { IFormField, IRootState } from '@/models/IForm';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import DisplayRuleManager from '@/components/admin/DisplayRuleManager/DisplayRuleManager.vue';
import { computed, PropType } from 'vue';
import { useStore } from 'vuex';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
});

const store = useStore<IRootState>();

function saveUpdatedFormField(
	fieldId: string,
	newValue: any,
	fieldProperty: string
): void {
	store.commit(MutationType.UpdateFormField, {
		fieldId,
		newValue,
		fieldProperty,
	});
}

const displayRuleAnother = computed({
	get: () => {
		return !!props.field.displayRuleAnother;
	},
	set: (checked: boolean) => {
		saveUpdatedFormField(props.field.id, checked, 'displayRuleAnother');
	},
});

// If the field is inside a table that is being displayed as table rows
const insideTableRow = computed(() => {
	if (props.field.fieldOptions.tableGuid) {
		const activeStep = store.state.admin?.activeStep ?? 0;
		const table = store.state.form?.attributes.steps[
			activeStep - 1
		].fields.find((f) => f.guid === props.field.fieldOptions.tableGuid);

		if (table?.fieldOptions.rowDisplay !== 'objectContainer') {
			return true;
		}
		return false;
	}
	return false;
});

const isExceedingMaxTableWidth = computed(() => {
	if (insideTableRow.value) {
		// Find all fields inside table and calculate their total width
		let width = 0;

		const activeStep = store.state.admin?.activeStep ?? 0;
		const fields =
			store.state.form?.attributes.steps[activeStep - 1].fields;
		if (fields?.length) {
			fields.forEach((fieldInTable) => {
				if (
					fieldInTable.fieldOptions.tableGuid ===
					props.field.fieldOptions.tableGuid
				) {
					width += fieldInTable.fieldOptions.columnWidth;
				}
			});
		}
		if (width > 10) {
			return true;
		}
	}
	return false;
});

const columnWidths = [
	{ title: '10%', value: 1 },
	{ title: '20%', value: 2 },
	{ title: '25%', value: 2.5 },
	{ title: '30%', value: 3 },
	{ title: '33%', value: 3.3 },
	{ title: '40%', value: 4 },
	{ title: '50%', value: 5 },
	{ title: '60%', value: 6 },
	{ title: '70%', value: 7 },
	{ title: '80%', value: 8 },
	{ title: '90%', value: 9 },
	{ title: '100%', value: 10 },
];
const columnWidth = computed({
	get: () => {
		return props.field.fieldOptions.columnWidth;
	},
	set: (newValue: number) => {
		const newFieldOptions = { ...props.field.fieldOptions };
		newFieldOptions.columnWidth = newValue;
		saveUpdatedFormField(props.field.id, newFieldOptions, 'fieldOptions');
	},
});

const showToUser = computed({
	get: () => {
		return props.field.fieldOptions.showToUser
			? props.field.fieldOptions.showToUser
			: false;
	},
	set: (checked: boolean) => {
		const newFieldOptions = { ...props.field.fieldOptions };
		newFieldOptions.showToUser = checked;
		saveUpdatedFormField(props.field.id, newFieldOptions, 'fieldOptions');
	},
});
</script>

<style scoped lang="scss">
.display-options {
	.display-rules-wrap {
		border-left: solid $primary 2px;
		padding: 0 24px;
		margin: 10px 0;
		margin-top: 18px;
	}
	.display-options {
		padding: 10px 24px;
	}
}
</style>
