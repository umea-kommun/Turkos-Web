<template>
	<div class="field-table" :class="fieldModeClass(mode)">
		<!--ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-table-field-options
						@updated-value="(a) => emit('updatedValue', a)"
						:field="props.field"
					/>
				</template>

				<template v-slot:display>
					<display-options :field="props.field" />
				</template>

				<template v-slot:data>
					<admin-data-options :field="props.field" />
				</template>

				<template v-slot:integration>
					<admin-integration-options :field="props.field" />
				</template>
			</field-options-content>
		</div>

		<!-- EDIT -->
		<div :id="getValidationId" v-if="mode === 'EDIT'">
			<base-form-field
				:label="title"
				:label-for="getValidationId"
				:isRequired="isRequired"
				titleSize="large"
			>
				<p v-if="helpText">{{ helpText }}</p>
				<v-progress-circular
					v-if="isBusyLoadingFromServer"
					indeterminate
					color="primary"
				></v-progress-circular>
				<table-object
					ref="tableObject"
					v-if="field.fieldOptions.rowDisplay == 'objectContainer'"
					:tableFields="tableFields"
					:field="field"
					:stepId="stepId"
					:stepIndex="stepIndex"
					:tableRows="tableRows"
					:maxRows="maxRows"
					:minRows="minRows"
					@updatedRows="updateTableValue"
				/>
				<table-component
					v-if="field.fieldOptions.rowDisplay != 'objectContainer'"
					:tableFields="tableFields"
					:field="field"
					:stepId="stepId"
					:stepIndex="stepIndex"
					:tableRows="tableRows"
					:maxRows="maxRows"
					:minRows="minRows"
					@updatedRows="updateTableValue"
					:isLoading="isBusyLoadingFromServer"
				/>
			</base-form-field>
		</div>
		<!-- VIEW -->
		<div v-if="mode === 'VIEW'" class="field">
			<label
				class="field-title subheading font-weight-bold"
				:for="'field-' + id"
				>{{ title }}</label
			>
			<div v-if="tableRows.length == 0">
				<em>Inget svar angivet.</em>
			</div>
			<table
				v-if="
					field.fieldOptions.rowDisplay !== 'objectContainer' &&
					tableRows.length
				"
				class="preview-table"
				cellspacing="0"
				:id="'field-' + id"
			>
				<thead>
					<tr>
						<td
							v-for="field in tableFields"
							:key="field.guid + 'table'"
						>
							{{ field.title }}
						</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in tableRows" :key="row.guid">
						<td
							v-for="column in row.columns"
							:key="column.fieldGuid + row.guid"
							:style="
								'width:' +
								getFieldForColumn(column)?.fieldOptions
									.columnWidth +
								'%'
							"
						>
							{{ getColumnValue(column) }}
						</td>
					</tr>
				</tbody>
			</table>
			<div
				v-if="
					field.fieldOptions.rowDisplay === 'objectContainer' &&
					tableRows.length
				"
			>
				<div
					v-for="row in tableRows"
					:key="row.guid"
					class="table-object-component-view"
				>
					<v-card
						flat
						v-for="column in getVisibleCololumns(row.columns)"
						:key="column.fieldGuid + row.guid"
					>
						<form-field-preview
							class="pl-2"
							:title="getColumnTitle(column.fieldGuid)"
							:value="getColumnValue(column)"
						></form-field-preview>
					</v-card>
				</div>
			</div>
		</div>

		<!-- PRINT
        <div v-if="mode === 'PRINT'">
          <PrintTable :title="title" :helpText="helpText"></PrintTable>
        </div> -->
	</div>
</template>

<script setup lang="ts">
import TableComponent from '@/components/field/table/TableComponent.vue';
import TableObject from '@/components/field/table/TableObject.vue';
import AdminTableFieldOptions from '@/components/admin/AdminFieldOptions/AdminTableFieldOptions.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import {
	ITableField,
	ITableColumn,
	IItemListField,
	IFormField,
	ITableFieldOptions,
} from '@/models/IForm';
import { Helper } from '@/utils/helper';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminDataOptions from '../admin/AdminFieldOptions/AdminDataOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';
import { computed, PropType, ref, toRef, watchEffect } from 'vue';
import { useTableField } from './composable/TableField';
import { useFieldValidation } from './composable/FieldValidation';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	mode: {
		type: String,
		default: 'EDIT',
	},
	field: {
		type: Object as PropType<ITableField>,
		required: true,
	},
	validationScope: {
		type: String,
		default: '',
	},
	validationId: {
		type: String,
		default: '',
	},
	tableFields: {
		type: Array as PropType<IFormField[]>,
		default: () => [],
	},
	stepId: String,
	stepIndex: Number,
});

const { t } = useI18n();
const emit = defineEmits(['updatedValue', 'updatedOptions']);

const { id, helpText, title, fieldOptions } = useTableField({
	mode: props.mode,
	field: toRef(props, 'field'),
	emit,
});

const { getValidationId, isRequired } = useFieldValidation({
	validationId: props.validationId,
	validationScope: props.validationScope,
	fieldOptions,
	id,
});

const isBusyLoadingFromServer = ref<boolean>(true);

const objectName = computed({
	get: () => {
		return (fieldOptions.value as ITableFieldOptions).objectName;
	},
	set: (objectName: string) => {
		emit('updatedOptions', {
			newOptions: { ...props.field.fieldOptions, objectName },
		});
	},
});

const minRows = computed({
	get: () => {
		return parseInt(
			(fieldOptions.value as ITableFieldOptions).minRows?.toString()
		);
	},
	set: (minRows: number) => {
		emit('updatedOptions', {
			newOptions: { ...props.field.fieldOptions, minRows },
		});
	},
});

const maxRows = computed({
	get: () => {
		return parseInt(
			(fieldOptions.value as ITableFieldOptions).maxRows?.toString()
		);
	},
	set: (maxRows: number) => {
		emit('updatedOptions', {
			newOptions: { ...props.field.fieldOptions, maxRows },
		});
	},
});

const autofillNumberOfRows = computed({
	get: () => {
		return (fieldOptions.value as ITableFieldOptions).autofillNumberOfRows;
	},
	set: (autofillNumberOfRows: boolean) => {
		emit('updatedOptions', {
			newOptions: { ...props.field.fieldOptions, autofillNumberOfRows },
		});
	},
});

const rowDisplay = computed(() => {
	return props.field.fieldOptions.rowDisplay || 'tableRows';
});

const tableObject = ref<InstanceType<typeof TableObject> | null>(null);
function openContainersHavingInvalidFields(): void {
	tableObject.value?.openContainersHavingInvalidFields();
}

function updateRowDisplay(rowDisplay: string): void {
	emit('updatedOptions', {
		newOptions: { ...props.field.fieldOptions, rowDisplay },
	});
}

function updateTableValue({ tableRows }: any): void {
	emit('updatedOptions', {
		newOptions: { ...props.field.fieldOptions, tableRows },
	});
}

function getFieldForColumn(column: ITableColumn): IFormField | undefined {
	return props.tableFields?.find((f) => f.guid === column.fieldGuid);
}

function getColumnValue(column: ITableColumn): string {
	if (column.isItem && (column.value || column.items)) {
		const field = props.tableFields?.find(
			(f) => f.guid === column.fieldGuid
		) as IItemListField;
		if (!field) {
			throw new Error('Unable to find field that column is refering to');
		}
		if (!column.items && !Array.isArray(column.items)) {
			const values: string[] = [];
			if (
				typeof column.value === 'string' ||
				column.value instanceof String
			) {
				column.value.split(',').forEach((id) => {
					const item = field.fieldOptions.items?.find(
						(item) => item.id === id
					);
					if (item && item.title) {
						values.push(item.title);
					}
				});
			}
			return values.length < 2 ? values[0] || '' : values.join(', ');
		} else {
			if (column.items.length > 0) {
				const values: string[] = [];
				column.items.forEach((element: any) => {
					if (element.id.toString() === column.value) {
						values.push(element.title);
					}
				});
				return values.length < 2 ? values[0] || '' : values.join(', ');
			}
		}
	} else {
		return column.value;
	}
	return '';
}

function getVisibleCololumns(columns: ITableColumn[]): ITableColumn[] {
	const newColumns: ITableColumn[] = [];
	columns.forEach((column) => {
		const visibleColumn = props.tableFields.find(
			(field) => field.guid === column.fieldGuid
		);
		if (visibleColumn) {
			newColumns.push(column);
		}
	});
	return newColumns;
}

function getColumnTitle(fieldGuid: string): string {
	const formField = props.tableFields?.find(
		(f) => f.guid === fieldGuid
	) as IFormField;
	return formField ? formField.title : '';
}

function exceeds100PercentColumnWidth(): boolean {
	let width = 0;
	props.tableFields?.forEach((tableChildField) => {
		width += tableChildField.fieldOptions.columnWidth || 0;
	});
	return width > 10;
}

const submitErrors = computed(() => {
	if (
		!(fieldOptions.value as ITableFieldOptions).minRows ||
		(fieldOptions.value as ITableFieldOptions).minRows.toString() === '0'
	) {
		return [];
	} else if (
		((fieldOptions.value as ITableFieldOptions).tableRows || []).length <
		(fieldOptions.value as ITableFieldOptions).minRows
	) {
		return [
			t('app.validation.messages.invalidTable', [
				objectName.value || title.value,
				(fieldOptions.value as ITableFieldOptions).minRows,
			]).toString(),
		];
	}
	return [];
});

const tableContext = computed(() => {
	return props.field.guid;
});

const tableRows = computed(() => {
	if (!props.field.fieldOptions.dataSource) {
		// isBusyLoadingFromServer.value = false;
	}
	if (props.field.fieldOptions.tableRows) {
		// Only show columns that have a corresponding field in tableFields (needed for FieldHidden)
		const filteredRows = Helper.deepCopy(
			props.field.fieldOptions.tableRows
		).map((row) => {
			const columns = row.columns;
			// .filter((colum) =>
			// 	props.tableFields.find(
			// 		(field) => field.guid === colum.fieldGuid
			// 	)
			// );
			return { ...row, columns };
		});
		// isBusyLoadingFromServer.value = false; // fix this, should not update inside computed get
		return filteredRows;
	}
	return [];
});

watchEffect(() => {
	// fix this, make sure this works, was previously inside tableRows computed
	if (!props.field.fieldOptions.dataSource) {
		isBusyLoadingFromServer.value = false;
	}
	if (props.field.fieldOptions.tableRows) {
		isBusyLoadingFromServer.value = false;
	}
});

defineExpose({
	openContainersHavingInvalidFields,
	rowDisplay,
	submitErrors,
});
</script>
<style>
.table-field .admin-fields .v-list {
	padding-top: 0;
}
</style>
<style scoped lang="scss">
.validator-input-hidden :deep(.v-input__slot) {
	display: none;
}

.row-width-warning {
	background: darkred;
	color: #fff;
	padding: 8px 12px;
	margin-bottom: 15px;
}
.admin-sub-title {
	// H4X0R
	background: rgba(255, 255, 255, 0.75);
	font-weight: normal;
	font-size: 13px;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	padding: 12px 10px 8px;
	color: #777;
}

:deep(.display-rule) {
	margin-top: 0 !important;
}

.preview-table {
	width: 100%;
	margin-top: 15px;
	td {
		padding: 10px;
		border-bottom: #e2e2e2 solid 1px;
	}
	tbody tr:last-child td {
		border-bottom: 0;
	}
	thead td {
		background: #f2f2f2;
		font-weight: bold;
	}
}
.table-object-component-view {
	background: #f2f2f283;
	margin-bottom: 15px;
	margin-top: 15px;
	padding-bottom: 15px;
	padding-top: 0;
	padding-left: 0;
	padding-right: 0;

	.v-card {
		background: none;
	}
}
</style>
