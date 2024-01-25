<template>
	<div class="table-component">
		<template v-for="tableRow in tableRows" :key="tableRow.guid">
			<v-layout :ref="addRef" row class="table-row">
				<v-col
					v-for="field in tableFields"
					fill-height
					:key="field.guid"
					class="pa-0"
					:style="
						'width: ' + field.fieldOptions.columnWidth * 10 + '%'
					"
				>
					<v-card flat>
						<dynamic-field-component
							:field="copyField(field, tableRow)"
							:validationScope="stepId?.toString()"
							:validationId="
								stepId?.toString() +
								'-' +
								tableRow.guid +
								'-' +
								field.guid.toString()
							"
							mode="EDIT"
							@updatedValue="
								updateRowValue(
									tableRow.guid,
									field.guid,
									$event
								)
							"
							@updatedOptions="
								updateRowValue(
									tableRow.guid,
									field.guid,
									$event
								)
							"
						/>
					</v-card>
				</v-col>
				<v-col cols="1" class="pa-0">
					<v-btn
						icon
						flat
						variant="text"
						class="desktop-delete"
						:disabled="tableRows.length < minRows + 1"
						@click="deleteRow(tableRow.guid)"
					>
						<v-icon
							:color="tableRows.length < minRows + 1 ? '' : 'red'"
							icon="close"
						/>
					</v-btn>
					<v-btn
						class="mobile-delete"
						flat
						variant="text"
						:disabled="tableRows.length < minRows + 1"
						@click="deleteRow(tableRow.guid)"
						append-icon="close"
					>
						<span>Ta bort</span>
					</v-btn>
				</v-col>
			</v-layout>
		</template>
		<div v-if="!maxRows || tableRows.length < maxRows">
			<v-btn
				flat
				variant="outlined"
				@click="addRowAndOpen()"
				:disabled="isLoading"
				append-icon="add"
			>
				Lägg till
			</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IFormField, ITableField, ITableRow } from '@/models/IForm';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';
import { nextTick, onMounted, PropType, ref, toRef } from 'vue';
import { useAbstractTable } from '../composable/AbstractTable';
import { VLayout } from 'vuetify/lib/components/index.mjs';

const props = defineProps({
	isLoading: {
		type: Boolean,
	},
	field: {
		type: Object as PropType<ITableField>,
		required: true,
	},
	tableFields: {
		type: Array as PropType<IFormField[]>,
		required: true,
	},
	tableRows: {
		type: Array as PropType<ITableRow[]>,
		required: true,
	},
	maxRows: {
		type: Number,
		required: true,
	},
	minRows: {
		type: Number,
		required: true,
	},
	stepId: String,
});

const emit = defineEmits(['updatedRows']);

const layoutContainer = ref<InstanceType<typeof VLayout>[]>([]);
const addRef = (el: any): void => {
	if (el) {
		layoutContainer.value.push(el);
	}
};

const { mounted, addRow, updateRowValue, deleteRow, copyField } =
	useAbstractTable({
		field: toRef(props, 'field'),
		tableFields: toRef(props, 'tableFields'),
		tableRows: toRef(props, 'tableRows'),
		emit,
	});

onMounted(mounted);

function addRowAndOpen(): void {
	addRow();

	// Open the container that was added
	nextTick(() => {
		// We cant open the container until the component gets re-rendered
		// and the updated()-method above gets called
		const lastAddedContainer = layoutContainer.value.slice(-1)[0];
		// Set focus on input
		setTimeout(() => {
			const inputs = lastAddedContainer?.$el.querySelectorAll('input');
			if (inputs.length) {
				inputs[0].focus();
			}
		}, 300); // this has to be done after a while
	});
}
</script>
<style>
.table-component .v-text-field .v-input__append-inner,
.table-component .v-input__icon i.success--text {
	display: none !important;
}
.table-component .component-base-form-field label.field-title-label {
	display: none !important;
}
/* Only display the title in the first row */
.table-component
	.v-layout:first-child
	.component-base-form-field
	label.field-title-label {
	display: flex !important;
}
@media (max-width: 600px) {
	.table-component .component-base-form-field label.field-title-label {
		display: block !important;
	}
}
</style>
<style scoped lang="scss">
.table-component {
	margin-bottom: 15px;
	.v-btn {
		margin-left: 0;
		background-color: none;
		span {
			display: none;
		}
	}
	.v-card {
		padding-right: 10px;
	}
	.mobile-delete {
		display: none;
	}
	.v-layout.table-row:first-child {
		.desktop-delete {
			margin-top: 30px; // skumt...
		}
	}

	.pa-0 {
		flex-basis: auto;
	}
}

@media (max-width: 600px) {
	.v-layout.table-row {
		flex: none;
		flex-direction: column;
		padding: 10px 10px 0;
		border: #e2e2e2 solid 4px;
		border-radius: 5px;
		margin-bottom: 15px;

		.v-col {
			width: 100% !important;
			max-width: none;
		}
		.desktop-delete {
			display: none;
		}
		.mobile-delete {
			display: flex;
		}
		.v-btn {
			float: right;
			span {
				display: inline;
			}
		}
	}
	.flex {
		flex: none;
		width: 100% !important;
		max-width: none !important;
	}
}
</style>
