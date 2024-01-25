<template>
	<v-card
		class="admin-field-options"
		:style="{
			width: width + 'px',
		}"
		:class="{ 'custom-size': !!width }"
	>
		<div class="resize-handle" @mousedown="onResizeStart"></div>
		<div class="top">
			<v-btn class="close-button" flat icon="close" @click="close" />
			<v-tabs v-model="activeTab" slider-color="primary">
				<v-tab tabindex="0" :value="1">{{
					$t('app.admin.fieldOptions.tabs.basic')
				}}</v-tab>
				<v-tab tabindex="0" :value="2">{{
					$t('app.admin.fieldOptions.tabs.display')
				}}</v-tab>
				<v-tab v-if="showDataTab" tabindex="0" :value="3">{{
					$t('app.admin.fieldOptions.tabs.data')
				}}</v-tab>
				<v-tab v-if="showIntegrationTab" tabindex="0" :value="4">{{
					$t('app.admin.fieldOptions.tabs.integration')
				}}</v-tab>
			</v-tabs>
		</div>
		<v-divider />
		<div class="content">
			<!-- Render the field in Admin mode -->
			<dynamic-field-component
				v-if="field.type !== FormFieldType.Table"
				:key="field.id"
				:field="field"
				@updatedValue="
					saveUpdatedFormField(field.id, $event.newValue, 'value')
				"
				@updatedOptions="
					saveUpdatedFormField(
						field.id,
						$event.newOptions,
						'fieldOptions'
					)
				"
				mode="ADMIN"
			/>
			<field-table
				v-else
				:field="(field as ITableField)"
				@updatedValue="
					saveUpdatedFormField(field.id, $event.newValue, 'value')
				"
				@updatedOptions="
					saveUpdatedFormField(
						field.id,
						$event.newOptions,
						'fieldOptions'
					)
				"
				mode="ADMIN"
			/>
		</div>
		<v-divider />

		<div class="bottom">
			<v-btn
				flat
				color="error"
				class="delete-button"
				@click="emit('removeField', [props.field.guid])"
			>
				<v-icon icon="delete_outline" />
				{{
					props.field.type === FormFieldType.Table
						? $t('component.adminFields.field.deleteTable.btnText')
						: $t('component.adminFields.field.delete.btnText')
				}}</v-btn
			>
		</div>
	</v-card>
</template>

<script setup lang="ts">
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';
import { IFormField, IRootState, ITableField } from '@/models/IForm';
import { MutationType, FormFieldType } from '@/models/Enums';
import { computed, onUnmounted, PropType, ref, inject } from 'vue';
import FieldTable from '@/components/field/FieldTable.vue';
import { useStore } from 'vuex';
import { IIntegrationObject } from '@/plugins/integrations';
import { setIntegrationType } from '@/plugins/integrations/IntegrationUtils';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
});
const emit = defineEmits(['removeField']);

const store = useStore<IRootState>();

function close(): void {
	store.commit(MutationType.UpdateAdminState, {
		prop: 'activeFieldId',
		value: null,
	});
}

const activeTab = computed({
	get: () => {
		return store.state.admin?.activeFieldOptionsTab ?? 1;
	},
	set: (newActiveTab: number) => {
		store.commit(MutationType.UpdateAdminState, {
			prop: 'activeFieldOptionsTab',
			value: newActiveTab,
		});
	},
});

const showDataTab = computed(() => {
	switch (props.field.type) {
		case FormFieldType.DatePicker:
		case FormFieldType.FileUpload:
		case FormFieldType.Section:
			return false;
	}
	return true;
});

const registeredIntegrationComponents = inject(
	'registeredIntegrationComponents'
) as IIntegrationObject[];

const showIntegrationTab = computed(() => {
	const integrations = setIntegrationType(
		store.state.form?.attributes.integrations ?? []
	);

	for (const integration of integrations) {
		const obj = registeredIntegrationComponents.find(
			(a) => a.integrationType === integration.integrationType
		);
		if (obj?.fieldComponentName) {
			if (obj?.fieldComponentTypes) {
				if (
					obj.fieldComponentTypes.includes(
						props.field.type as FormFieldType
					)
				) {
					return true;
				}
			} else if (
				props.field.type !== FormFieldType.Table &&
				props.field.type !== FormFieldType.Section
			) {
				return true;
			}
		}
	}
	return false;
});

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

/**
 * Resize field options
 * */
const storedWidth = computed({
	get: () => {
		// The width is stored for the session
		// we could easily store it for longer by switching sessionStorage to localStorage
		const storedWidth = window.sessionStorage.getItem(
			'adminFieldOptionsWidth'
		);
		if (storedWidth) {
			return parseInt(storedWidth);
		}
		return null;
	},
	set: (newWidth: number | null) => {
		if (newWidth) {
			window.sessionStorage.setItem(
				'adminFieldOptionsWidth',
				newWidth.toString()
			);
		}
	},
});

const width = ref(storedWidth.value);
const startWidth = ref(0);
const startX = ref(0);

const newSize = (e: MouseEvent): number => {
	const width = startWidth.value + startX.value - e.clientX;
	return Math.min(1000, Math.max(500, width));
};

const onResize = (e: MouseEvent): void => {
	if (startWidth.value) {
		width.value = newSize(e);
	}
};
const onResizeEnd = (e: MouseEvent): void => {
	if (startWidth.value) {
		width.value = newSize(e);
		// Save new width to storage
		storedWidth.value = width.value;

		// Clean up
		startWidth.value = 0;
		startX.value = 0;
	}
	removeEventListener('mousemove', onResize);
	removeEventListener('mouseup', onResizeEnd);
};

const onResizeStart = (e: MouseEvent): void => {
	addEventListener('mousemove', onResize);
	addEventListener('mouseup', onResizeEnd);

	const currentWidth =
		document.querySelector('.admin-field-options')?.clientWidth ?? 620;

	startX.value = e.clientX;
	startWidth.value = width.value ?? currentWidth;
	e.preventDefault();
};

onUnmounted(() => {
	removeEventListener('mousemove', onResize);
	removeEventListener('mouseup', onResizeEnd);
});
</script>

<style scoped lang="scss">
.admin-field-options {
	position: fixed;
	top: 62px;
	right: 0;
	bottom: 0;
	max-width: 620px;
	width: 40%;
	border-radius: 0;
	display: flex;
	flex-direction: column;

	&.custom-size {
		width: auto;
		max-width: 1000px;
		min-width: 400px;
	}

	.resize-handle {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 14px;
		cursor: e-resize;
		z-index: 3000;
	}

	.top {
		display: flex;
		flex-direction: row;
		padding-right: 48px;
		align-items: center;
		.close-button {
			border-radius: 100px;
		}
	}
	.content {
		overscroll-behavior: none;
		padding-bottom: 10px;
		flex: 1;
		overflow-y: auto;
	}
	.bottom {
		padding: 4px;
		text-align: right;
		.delete-button {
			.v-icon {
				margin-right: 6px;
			}
		}
	}
	.v-tabs {
		flex: 1;
		--v-tabs-height: 62px;

		:deep(.v-slide-group__content) {
			justify-content: center;
		}
		.v-tab {
			margin: 0;
			height: 100%;
			color: $grey-darken-1;
			text-transform: none;
			font-weight: bold;
			letter-spacing: normal;

			&--selected {
				color: $primary;
			}
		}
	}
}
</style>
