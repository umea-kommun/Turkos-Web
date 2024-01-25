<template>
	<div class="table-object-component">
		<div v-for="tableRow in tableRows" :key="tableRow.guid">
			<base-toggle-container
				:ref="addRef"
				:containerId="'table-row-' + tableRow.guid"
				:title="getContainerTitle(tableRow)"
			>
				<v-card flat v-for="field in tableFields" :key="field.guid">
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
							updateRowValue(tableRow.guid, field.guid, $event)
						"
						@updatedOptions="
							updateRowValue(tableRow.guid, field.guid, $event)
						"
					/>
				</v-card>
				<div style="text-align: right">
					<v-btn
						variant="text"
						:color="tableRows.length < minRows + 1 ? '' : 'red'"
						:disabled="tableRows.length < minRows + 1"
						@click="deleteRow(tableRow.guid)"
						append-icon="close"
					>
						<span>Ta bort</span>
					</v-btn>
				</div>
			</base-toggle-container>
		</div>
		<div v-if="!maxRows || tableRows.length < maxRows">
			<v-btn
				flat
				variant="outlined"
				@click="addRowAndOpen()"
				style="margin: 0 0 15px"
				append-icon="add"
			>
				Lägg till {{ field.fieldOptions.objectName }}
			</v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseToggleContainer from '@/components/base/BaseToggleContainer.vue';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';
import { IFormField, IItem, ITableField, ITableRow } from '@/models/IForm';
import { nextTick, onMounted, PropType, ref, toRef } from 'vue';
import { useAbstractTable } from '../composable/AbstractTable';

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
const toggleContainers = ref<InstanceType<typeof BaseToggleContainer>[]>([]);
const addRef = (el: any): void => {
	if (el) {
		toggleContainers.value.push(el);
	}
};

const { mounted, addRow, updateRowValue, deleteRow, copyField } =
	useAbstractTable({
		field: toRef(props, 'field'),
		tableFields: toRef(props, 'tableFields'),
		tableRows: toRef(props, 'tableRows'),
		emit,
	});

onMounted(() => {
	mounted();

	// We cant open the container until the component gets re-rendered
	// and the updated()-method above gets called
	setTimeout(() => {
		if (toggleContainers.value) {
			toggleContainers.value.forEach((container) => {
				container.open();
			});
		}
	}, 1);
});

function openContainersHavingInvalidFields(): void {
	(toggleContainers.value || []).forEach((container) => {
		const inputs = [].slice.call(
			container.$el.querySelectorAll('.v-input')
		);
		let hasInvalidField = false;
		inputs.every((inputElem: HTMLElement) => {
			if (inputElem.getAttribute('class')!.indexOf('error') > -1) {
				// dont know how to detect this the right way...
				hasInvalidField = true;
				return false; // break iteration
			}
			return true;
		});
		if (hasInvalidField && !container.isOpen()) {
			container.toggle();
		}
	});
}

function escapeHTML(str: string): string {
	if (str.indexOf('<') === -1) {
		return str;
	}
	const node = document.createElement('DIV');
	node.innerHTML = str;
	return node.innerText;
}

function getContainerTitle(tableRow: ITableRow): string {
	let title = props.tableFields[0].title + ':';
	if (tableRow.columns.length === 0 || tableRow.columns[0].value === '') {
		title += '...';
	} else if (tableRow.columns[0].isItem) {
		const field = props.tableFields.find(
			(f) => f.guid === tableRow.columns[0].fieldGuid
		);
		const items = field!.fieldOptions.items || [];
		const itemsFind = items.find(
			(i: IItem) => i.id === tableRow.columns[0].value
		);
		if (itemsFind) {
			title += itemsFind.title;
		} else {
			const selectedValue = tableRow.columns[0].value;
			if (selectedValue) {
				title += tableRow.columns[0].items[selectedValue].value;
			} else {
				title += '...';
			}
		}
	} else {
		title += escapeHTML(tableRow.columns[0].value);
	}
	return title;
}

function addRowAndOpen(): void {
	addRow();

	// Open the container that was added
	nextTick(() => {
		// We cant open the container until the component gets re-rendered
		// and the updated()-method above gets called
		const lastAddedContainer = toggleContainers.value.slice(-1)[0];
		lastAddedContainer.open();
		// Set focus on input
		setTimeout(() => {
			const inputs = lastAddedContainer.$el.querySelectorAll('input');
			if (inputs.length) {
				inputs[0].focus();
			}
		}, 300); // this has to be done after a while
	});
}

defineExpose({ openContainersHavingInvalidFields });
</script>

<style></style>
<style scoped lang="scss">
.component-base-toggle-container {
	margin-bottom: 15px;
	background: #f2f2f2;
	padding: 0;
	border-radius: 3px;
	.theme--light.v-sheet {
		background: none;
	}
	:deep(.toggle-container-title) {
		border-bottom: #ccc solid 1px;
		padding: 10px;
		text-transform: none !important;
		color: #888;
	}
	:deep(.v-container .v-card) {
		background: none;
	}
	:deep(.v-container.toggle-container-body) {
		border-top: #fff solid 1px;
		padding: 15px !important;
	}
}

@media (max-width: 600px) {
}
</style>
