<template>
	<div>
		<table
			v-if="field.fieldOptions.rowDisplay !== 'objectContainer'"
			class="mt-5 mb-5"
			cellspacing="0"
		>
			<tr>
				<th :colspan="getColumnCount()">
					{{ field.title }}
				</th>
			</tr>
			<tr>
				<td
					v-for="item in tableColumns"
					:key="item.id"
					:width="getColumnWidth(item)"
				>
					<span>{{ item.title }}</span>
				</td>
			</tr>
			<tr v-for="n in numberOfRows" :key="n">
				<td
					v-for="item in tableColumns"
					:key="item.id"
					style="height: 50px"
				>
					<p
						v-for="option in item.fieldOptions.items"
						:key="option.id"
					>
						<v-icon
							size="large"
							class="icon_crop_square"
							icon="crop_square"
						/>
						<span>{{ option.title }}</span>
					</p>
				</td>
			</tr>
		</table>
		<div v-if="field.fieldOptions.rowDisplay === 'objectContainer'">
			<div v-for="n in numberOfRows" :key="n" class="print-table-object">
				<v-card flat v-for="item in tableColumns" :key="n + item.guid">
					<dynamic-field-component :field="item" mode="PRINT">
					</dynamic-field-component>
				</v-card>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IItemListField } from '@/models/IForm';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';

/**
 * Component that renders a question with follow-up questions
 */
const props = defineProps({
	field: {
		type: Object as PropType<IItemListField | any>,
		required: true,
	},
	tableColumns: Object as PropType<IItemListField[]>,
});
const numberOfRows: number = 5;

function getColumnCount(): number {
	return props.tableColumns?.length || 0;
}

function getColumnWidth(item: IItemListField | any): string {
	return item.fieldOptions.columnWidth + '0%';
}
</script>

<style scoped lang="scss">
$borderSettings: #666 solid 3px;
small {
	font-weight: normal;
}
table {
	width: 100%;
}
td,
th {
	border: $borderSettings;
	border-left: 0;
	border-top: 0;
	vertical-align: top;
	text-align: left;
	padding: 10px 15px;
}
td:first-child,
th:first-child {
	border-left: $borderSettings;
}
tr:first-child td {
	border-top: 0;
}
tr:first-child th {
	border-top: $borderSettings;
}

.print-table-object {
	border: #333 solid 1px;
	padding: 3px 3px 32px;
	border-radius: 4px;
	margin-bottom: 4px;
}
</style>
