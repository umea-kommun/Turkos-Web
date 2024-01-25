<template>
	<div class="admin-table-field-options">
		<div class="admin-table-field-options-wrapper">
			<!-- Title -->
			<admin-text-box
				:id="'title-' + id"
				v-model="title"
				:label="$t('app.admin.field.title')"
				:help-text="$t('app.admin.field.titleHelpText')"
				rules="required"
			/>

			<!-- Help text -->
			<admin-text-box
				:id="'helpText-' + id"
				v-model="helpText"
				:label="$t('app.admin.field.description')"
				:help-text="$t('app.admin.field.descriptionHelpText')"
			/>

			<!-- Display rows -->
			<admin-select-list
				:id="'eService-rowDisplay'"
				v-model="rowDisplay"
				:items="rowDisplayItems"
				:label="$t('component.fieldTable.rowDisplay')"
				:help-text="$t('component.fieldTable.rowDisplayHint')"
			/>

			<!-- Object name -->
			<admin-text-box
				v-if="rowDisplay !== 'tableRows'"
				:id="id + '-objectName'"
				v-model="objectName"
				:label="$t('component.fieldTable.objectName')"
				:help-text="$t('component.fieldTable.objectNameHint')"
			/>

			<div v-if="!autofillNumberOfRows">
				<!-- Minimum rows -->
				<admin-text-box
					:id="'minRows-' + id"
					v-model="minRows"
					type="number"
					min="0"
					:label="$t('component.fieldTable.minRows')"
					:help-text="$t('component.fieldTable.minRowsHint')"
					rules="required|minNumber:1"
				/>

				<!-- Maximum rows -->
				<admin-text-box
					:id="id + '-maxRows'"
					v-model="maxRows"
					type="number"
					min="0"
					max="10000"
					:label="$t('component.fieldTable.maxRows')"
					:help-text="$t('component.fieldTable.maxRowsHint')"
				/>
			</div>

			<!-- autofill number of rows -->
			<admin-switch
				:id="id + '-autofillNumberOfRows'"
				v-model="autofillNumberOfRows"
				:label="$t('app.admin.field.checkboxAutofillNumberOfRowsText')"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import { FormMode } from '@/models/Enums';
import { ITableField } from '@/models/IForm';
import { PropType, toRef, computed } from 'vue';
import { useTableField } from '@/components/field/composable/TableField';

const { t } = useI18n();

const props = defineProps({
	field: {
		type: Object as PropType<ITableField>,
		required: true,
	},
});

const emit = defineEmits(['updatedValue']);

const rowDisplayItems = computed(() => {
	return [
		{ value: 'objectContainer', title: t('component.fieldTable.asObject') },
		{ value: 'tableRows', title: t('component.fieldTable.asTable') },
	];
});

const {
	id,
	helpText,
	title,
	minRows,
	maxRows,
	autofillNumberOfRows,
	rowDisplay,
	objectName,
} = useTableField({
	mode: FormMode.Admin,
	field: toRef(props, 'field'),
	emit,
});
</script>

<style scoped lang="scss">
.admin-table-field-options-wrapper {
	padding: 10px 24px 0;
}
</style>
