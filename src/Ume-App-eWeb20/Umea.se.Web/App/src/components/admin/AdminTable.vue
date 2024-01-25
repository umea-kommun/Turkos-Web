<template>
	<div class="admin-table">
		<v-card-title>
			{{ field.title }}
			<span
				v-if="isRequired && field.title"
				:aria-label="
					$t(
						'component.adminValidationManager.validation.types.required'
					)
				"
				>*
			</span>
		</v-card-title>
		<v-card-subtitle>{{ field.helpText }}</v-card-subtitle>
		<v-card-text>
			<nested-draggable
				:fields="tableFields"
				:tableGuid="field.guid"
				@onAddField="onAddField"
				@onChangeField="onChangeField"
				@showContextMenu="(params) => showContextMenu(params)"
			/>
		</v-card-text>
	</div>
</template>

<script setup lang="ts">
import { IFormField, IRootState } from '@/models/IForm';
import { computed, PropType } from 'vue';
import { useStore } from 'vuex';
import { FormFieldType } from '@/models/Enums';
import nestedDraggable from '@/components/admin/NestedDraggable.vue';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
});

const emit = defineEmits(['onAddField', 'onChangeField', 'showContextMenu']);

const store = useStore<IRootState>();

const isRequired = computed(() => {
	let isRequired = false;
	if (props.field.fieldOptions.validation) {
		props.field.fieldOptions.validation.forEach((f: any) => {
			if (f.type === 'required') {
				isRequired = true;
			}
		});
	}
	return isRequired;
});

const tableFields = computed(() => {
	// All fields inside table
	const activeStep = store.state.admin?.activeStep;
	if (activeStep) {
		const fields =
			store.state.form?.attributes.steps[activeStep - 1].fields;
		if (fields?.length) {
			return fields.filter(
				(field) => field.fieldOptions.tableGuid === props.field.guid
			);
		}
	}
	return [];
});

const calculateFieldIndex = (tableIndex: number): number => {
	const activeStep = store.state.admin?.activeStep;
	if (!activeStep) {
		return -1;
	}
	const fields = store.state.form?.attributes.steps[activeStep - 1].fields;
	if (!fields) {
		return -1;
	}

	// Find where new field should be inserted in steps.fields
	let afterFieldGuid = '';
	if (tableIndex === 0) {
		// Add field after table if first field in table
		afterFieldGuid = props.field.guid;
	} else {
		afterFieldGuid = tableFields.value[tableIndex - 1].guid;
	}
	const previousFieldIndex = fields.findIndex(
		(f) => f.guid === afterFieldGuid
	);
	return previousFieldIndex + 1;
};

function onAddField(fieldType: FormFieldType, tableIndex: number): void {
	const index = calculateFieldIndex(tableIndex);
	if (index === -1) {
		return;
	}

	emit('onAddField', fieldType, index, props.field.guid);
}

function onChangeField(added: any, moved: any): void {
	emit('onChangeField', added, moved, props.field.guid);
}

function showContextMenu(params: { index: number }): void {
	const index = calculateFieldIndex(params.index);
	if (index === -1) {
		return;
	}

	emit('showContextMenu', {
		...params,
		tableGuid: props.field.guid,
		index,
	});
}
</script>

<style scoped lang="scss">
.admin-table {
	.v-card-title {
		padding: 8px 0;
	}
	.v-card-subtitle {
		padding: 0;
		padding-bottom: 8px;
	}
	.v-card-text {
		background-color: #f2f2f2;
		border-radius: $border-radius;
	}
}
</style>
