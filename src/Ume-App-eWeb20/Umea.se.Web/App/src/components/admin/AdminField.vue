<template>
	<div
		class="admin-field v-card"
		:class="{ active, selected, cut }"
		:id="'field-preview-' + field.id"
		@click.ctrl.stop="selectField(field.guid, 'ctrl')"
		@click.shift.stop.prevent="selectField(field.guid, 'shift')"
		@click.exact.stop="active = !active"
		@keypress.enter.space.prevent.stop="active = !active"
		tabindex="0"
	>
		<div
			class="drag-indicator handleOrginal"
			:title="$t('component.adminFields.dragToMove')"
		>
			<v-icon icon="drag_indicator" class="rotate-90-deg"></v-icon>
		</div>
		<div class="field-labels">
			<div class="left">
				<!-- Field type -->
				<div
					class="field-label field-icon"
					v-if="field.type !== FormFieldType.HiddenTextBox"
					:title="fieldHelpText"
				>
					<v-icon :icon="fieldIcon" />
				</div>

				<!-- Display rules - Mother -->
				<div
					class="field-label field-display-rule mother"
					v-if="isDisplayRuleMother"
					@click.stop="toggleActiveAndShowTab(2)"
					:title="$t('component.adminFields.motherField')"
				>
					<v-icon icon="alt_route" />
				</div>

				<!-- Display rules - Child -->
				<div
					class="field-label field-display-rule child"
					v-if="isDisplayRuleChild"
					@click.stop="toggleActiveAndShowTab(2)"
					:title="$t('component.adminFields.childField')"
				>
					<v-icon icon="turn_right" />
				</div>
				<div
					class="field-label"
					v-if="field.type === FormFieldType.HiddenTextBox"
					:title="fieldHelpText"
				>
					<v-icon icon="visibility_off" />
					{{ $t('component.fieldHiddenTextBox.title') }}
				</div>
			</div>
			<div class="right">
				<div
					class="field-label field-data-blue"
					v-if="field.fieldOptions.dataSource"
					@click.stop="toggleActiveAndShowTab(3)"
					:title="$t('component.adminFields.dataSourceTitle')"
				>
					<v-icon icon="login" />
				</div>
				<div
					class="field-label field-data-blue"
					v-if="field.fieldOptions.searchDataSource"
					@click.stop="toggleActiveAndShowTab(3)"
					:title="$t('component.adminFields.dataSourceTitle')"
				>
					<v-icon icon="search" />
				</div>
				<div
					class="field-label field-data-green"
					v-if="hasOutputData"
					@click.stop="toggleActiveAndShowTab(4)"
					:title="$t('component.adminFields.integrationTitle')"
				>
					<v-icon icon="logout" />
				</div>
			</div>
		</div>
		<div v-if="cut" class="cut-overlay">
			<v-icon size="20" class="mr-1" icon="content_cut" />
			{{ $t('component.adminFields.rightClickMenu.isCut') }}
		</div>
		<div
			v-if="!isTableType(field.type)"
			class="field-wrap"
			tabindex="-1"
			inert
		>
			<dynamic-field-component
				:key="field.id"
				:field="field"
				mode="EDIT"
				:admin-preview="true"
			>
			</dynamic-field-component>
		</div>
		<admin-table
			v-else
			@onAddField="onAddField"
			@onChangeField="onChangeTableField"
			:field="field"
			:isRequired="true"
			@showContextMenu="(params) => emit('showContextMenu', params)"
		/>
	</div>
</template>

<script setup lang="ts">
import {
	FormFieldIcon,
	FormFieldType,
	IntegrationType,
	MethodChoice,
	MutationType,
} from '@/models/Enums';
import { IFormField, IRootState } from '@/models/IForm';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';
import AdminTable from '@/components/admin/AdminTable.vue';
import { computed, PropType } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
	fieldIndex: {
		type: Number,
		required: true,
	},
});

const emit = defineEmits([
	'onAddField',
	'onChangeField',
	'onChangeTableField',
	'showContextMenu',
]);

const store = useStore<IRootState>();
const { t } = useI18n();

const active = computed({
	get: () => store.state.admin?.activeFieldId === props.field.id,
	set: (isActive: boolean) => {
		store.commit(MutationType.UpdateAdminState, {
			prop: 'activeFieldId',
			value: isActive ? props.field.id : null,
		});

		// Deselect fields
		store.commit(MutationType.UpdateAdminState, {
			prop: 'selectedFields',
			value: [],
		});
	},
});

const activeStep = computed<number>(() => store.state.admin?.activeStep ?? 1);

const selected = computed(() => {
	return store.state.admin?.selectedFields.includes(props.field.guid);
});

const cut = computed(() => {
	const memory = (store.state as IRootState).fieldsCopyMemory;
	if (
		memory.methodChoice === MethodChoice.Cut &&
		memory.copiedFields?.length
	) {
		return memory.copiedFields.some((f) => f.guid === props.field.guid);
	}
	return false;
});

function selectField(fieldGuid: string, key: string = 'none'): void {
	let selectedFields = [...(store.state.admin?.selectedFields ?? [])];

	// Active field should now be selected
	if (store.state.admin?.activeFieldId) {
		const activeFieldGuid = store.state.form?.attributes.steps[
			activeStep.value - 1
		].fields.find((f) => f.id === store.state.admin?.activeFieldId)?.guid;

		if (activeFieldGuid && !selectedFields.includes(activeFieldGuid)) {
			selectedFields.push(activeFieldGuid);
		}
	}

	if (key === 'ctrl') {
		// Ctrl click, add field to selection or remove it if already selected
		const selectedIndex = selectedFields.indexOf(fieldGuid);
		if (selectedIndex > -1) {
			selectedFields.splice(selectedIndex, 1);
		} else {
			selectedFields.push(fieldGuid);
		}
	} else if (key === 'shift') {
		// Shift click, selected everything between fields
		if (selectedFields?.length) {
			const fields =
				store.state.form?.attributes.steps[activeStep.value - 1].fields;
			if (fields?.length) {
				const startGuid = selectedFields[0];
				const startIndex = fields.findIndex(
					(field) => field.guid === startGuid
				);
				const endIndex = fields.findIndex(
					(field) => field.guid === fieldGuid
				);
				if (startIndex > -1 && endIndex > -1) {
					const selection =
						startIndex < endIndex
							? fields.slice(startIndex, endIndex + 1)
							: fields.slice(endIndex, startIndex + 1);

					selectedFields = selection
						.map((field) => field.guid)
						.filter((guid) => guid !== startGuid);
					selectedFields = [startGuid, ...selectedFields];
				}
			}
		} else {
			selectedFields = [fieldGuid];
		}
	}
	if (selectedFields.length > 1) {
		store.commit(MutationType.UpdateAdminState, {
			prop: 'activeFieldId',
			value: null,
		});
	}

	store.commit(MutationType.UpdateAdminState, {
		prop: 'selectedFields',
		value: [...new Set(selectedFields)], // remove duplicates and update state
	});
}

function toggleActiveAndShowTab(tabIndex: number): void {
	if (!active.value) {
		active.value = true;
		store.commit(MutationType.UpdateAdminState, {
			prop: 'activeFieldOptionsTab',
			value: tabIndex,
		});
	} else {
		active.value = false;
	}
}

function onAddField(
	fieldType: FormFieldType,
	rootFieldIndex: number,
	tableGuid: string | undefined
): void {
	emit('onAddField', fieldType, rootFieldIndex, tableGuid);
}
function onChangeTableField(added: any, moved: any, tableGuid: string): void {
	emit('onChangeTableField', added, moved, tableGuid);
}

function isTableType(type: FormFieldType | string): boolean {
	return type === FormFieldType.Table;
}

const hasOutputData = computed(() => {
	if (
		props.field.fieldOptions.outPutDataSource ||
		props.field.fieldOptions.templateSource?.templateSourceGuid
	) {
		return true;
	}
	if (store.state.form?.attributes.integrations?.length) {
		for (const integration of store.state.form?.attributes.integrations ??
			[]) {
			if (integration.type === IntegrationType.AdvancedSharepoint) {
				const fieldMappings = integration.options.find(
					(o) => o.key === 'fieldMapping'
				);
				if (fieldMappings) {
					for (const fieldMapping of fieldMappings.data) {
						if (fieldMapping.fieldGuid === props.field.guid) {
							return true;
						}
					}
				}
			}
		}
	}
	return false;
});

// If the field is used in display rules
const isDisplayRuleMother = computed(() => {
	const exists = store.state.admin?.motherFields
		? store.state.admin?.motherFields[props.field.guid] === true
		: false;
	return exists;
});

// If the field has display rules
const isDisplayRuleChild = computed(
	() => !!props.field?.displayRuleGroup?.displayRuleGroupGuid
);

const fieldIcon = computed(() => {
	if (props.field.type in FormFieldIcon) {
		return FormFieldIcon[props.field.type as FormFieldType];
	}
	return '';
});
const fieldHelpText = computed(() => {
	const fieldType =
		props.field.type.charAt(0).toLowerCase() + props.field.type.slice(1);
	return t('component.' + fieldType + '.title');
});
</script>

<style scoped lang="scss">
.admin-field {
	margin-bottom: 10px;
	outline: none;
	padding: 10px;
	padding-top: 14px;
	border-radius: $border-radius;
	min-height: 80px;
	cursor: pointer;
	background-color: #fff;
	box-shadow:
		0 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
		0 1px 1px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
		0 1px 3px 0 var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));

	overflow: visible;

	.field-labels {
		position: absolute;
		top: -14px;
		right: 0;
		left: 0;
		padding: 0 12px;
		display: flex;
		pointer-events: none;
		z-index: 3;

		.left {
			display: flex;
			flex: auto;
			justify-content: flex-start;
		}
		.right {
			display: flex;
			flex: auto;
			justify-content: flex-end;
		}

		.field-label {
			background-color: $grey-darken-1;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;

			border-radius: 20px;
			padding: 5px 10px;
			margin-left: 4px;
			min-height: 24px;
			min-width: 24px;

			text-transform: uppercase;
			font-weight: bold;
			line-height: size(12);
			font-size: size(12);
			pointer-events: initial;

			box-shadow:
				0 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
				0 1px 1px 0
					var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
				0 1px 3px 0
					var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));

			.v-icon {
				font-size: size(16);
				margin-right: 6px;
			}

			&:first-child {
				margin-left: 0;
			}

			&.field-icon {
				padding: 3px;
				color: $grey-darken-1;
				background-color: #fff;
				.v-icon {
					margin: 0;
					font-size: size(22);
				}
			}
		}
		.field-data-blue,
		.field-data-green {
			padding: 6px;
			.v-icon {
				margin: 0;
			}
		}
		.field-data-blue {
			background-color: #2196f3;
		}
		.field-data-green {
			background-color: #4caf50;
		}

		.field-display-rule {
			padding: 6px;
			.v-icon {
				margin: 0;
			}

			&.mother {
				background-color: #ff9e22;
			}
			&.child {
				background-color: #e54304;
			}
		}
	}

	.field-wrap {
		pointer-events: none;
		user-select: none;
	}

	&.active {
		outline: solid 2px #1b54f1;

		&::before {
			display: block;
			content: ' ';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: #1b54f10e;
			pointer-events: none;
		}
	}
	&.selected {
		outline: solid 2px #1b54f1;
	}
	&.cut {
		font-style: italic;
		outline: dashed 2px #acacac;

		.cut-overlay {
			pointer-events: none;
			border-radius: $border-radius;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 2;
			color: $grey-darken-3;
			background-color: rgba(0, 0, 0, 0.1);
		}
	}

	.drag-indicator {
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: move;
		opacity: 0;

		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		padding: 6px;
		transition: opacity 0.2s ease;
	}
	&:hover,
	&.active {
		> .drag-indicator {
			opacity: 0.7;
		}
	}
	.rotate-90-deg {
		transform: rotate(90deg);
	}
}
</style>
