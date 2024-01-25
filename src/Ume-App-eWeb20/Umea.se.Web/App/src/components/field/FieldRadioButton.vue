<template>
	<div class="field-radio-button" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'" class="admin">
			<field-options-content>
				<template v-slot:basic>
					<admin-item-list-field-options
						@updated-options="(a: Event) => emit('updatedOptions', a)"
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
		<Field
			v-if="mode === 'EDIT'"
			:name="getValidationId"
			:label="title"
			type="radio"
			:keepValue="true"
			v-slot="{ errors, meta }"
			:rules="adminPreview ? '' : getValidationRules()"
			:standalone="adminPreview"
		>
			<fieldset :id="getValidationId" class="edit">
				<base-form-field
					:id="'label-' + id"
					:label="title"
					:label-for="getValidationId"
					:isRequired="isRequired"
					:errorDisplay="!!errors.length"
					:isRadioGroup="true"
				>
					<legend
						class="text-subtitle-1 field-title-label"
						:class="!!errors.length ? 'validation-failed' : ''"
					>
						{{ title }}
						<span
							v-if="isRequired && title"
							:aria-label="
								$t(
									'component.adminValidationManager.validation.types.required'
								)
							"
							>*</span
						>
						<span
							v-else-if="adminPreview && !title"
							class="label-admin-placeholder"
							>{{
								$t('component.fieldRadioButton.newField')
							}}</span
						>
						<v-progress-circular
							v-if="loadingDataSource"
							class="ml-2"
							:width="3"
							color="primary"
							indeterminate
							:size="28"
						/>
					</legend>
					<v-progress-circular
						v-if="isBusyLoadingFromServer"
						indeterminate
						color="primary"
					>
					</v-progress-circular>
					<v-radio-group
						v-model="selectedItem"
						:id="getValidationId"
						:aria-labelledby="'label-' + id"
						:aria-required="isRequired"
						:required="isRequired"
						persistent-hint
					>
						<v-radio
							v-for="item in items"
							:value="item"
							:label="item.title"
							:key="item.id"
							:name="item.id"
							color="primary"
							:error="!!errors.length"
							:aria-checked="item === selectedItem"
							:aria-describedby="
								!!errors.length
									? 'error-' + getValidationId
									: null
							"
						>
							<template v-slot:label
								>{{ item.title }}
								<v-icon
									size="small"
									icon="info"
									v-if="item.helptext"
									class="ml-1"
									small
									@click.prevent="
										HelpTextDialogClick(
											item.title,
											item.helptext,
											item.id
										)
									"
								></v-icon>
								<base-dialog
									:showDialog="helpTextDialog === item.id"
									@dialogClose="helpTextDialog = ''"
									:title="checkedItemTitle"
									:text="checkedItemHelptext"
								></base-dialog>
							</template>
						</v-radio>
					</v-radio-group>

					<HelpText
						:helpText="helpText"
						:errors="errors"
						:getValidationId="getValidationId"
						:fieldValid="meta.valid"
					>
					</HelpText>
				</base-form-field>
			</fieldset>
		</Field>

		<!-- VIEW -->
		<div v-if="mode === 'VIEW'">
			<form-field-preview
				:title="title"
				:value="checkedItemsPreviewValue"
				:id="id"
			>
			</form-field-preview>
		</div>
		<!-- PRINT -->
		<div v-if="mode === 'PRINT'">
			<PrintCheckBoxList
				:title="title"
				:helpText="helpText"
				:items="items"
				:multiple="false"
			>
			</PrintCheckBoxList>
		</div>
	</div>
</template>
<script setup lang="ts">
import { IItemListField, IRootState } from '@/models/IForm';
import { FormMode } from '@/models/Enums';
import PrintCheckBoxList from './print/PrintCheckBoxList.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import AdminItemListFieldOptions from '../admin/AdminFieldOptions/AdminItemListFieldOptions.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminDataOptions from '../admin/AdminFieldOptions/AdminDataOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import { inject, PropType, ref, toRef, watch } from 'vue';
import { Field } from 'vee-validate';
import { useItemListField } from './composable/ItemListField';
import { useFieldValidation } from './composable/FieldValidation';
import HelpText from './helpAndError/HelpAndErrorText.vue';
import BaseDialog from '@/components/base/BaseDialog.vue';
import { selectedItemChanged } from '@/store/utils';
import DataSourceApplier from '@/plugins/dataService/DataSourceApplier';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';
import { useStore } from 'vuex';
/**
 * Component for a list Radio buttons
 */
// Define props
const props = defineProps({
	mode: {
		type: String as PropType<FormMode>,
		default: 'EDIT',
	},
	field: {
		type: Object as PropType<IItemListField>,
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
	adminPreview: {
		type: Boolean,
		default: false,
	},
});
const helpTextDialog = ref<string>('');
const checkedItemTitle = ref<string>('');
const checkedItemHelptext = ref<string>('');

const store = useStore<IRootState>();
const emit = defineEmits(['updatedOptions']);
const {
	fieldOptions,
	checkedItemsPreviewValue,
	id,
	title,
	items,
	selectedItem,
	helpText,
	loadingDataSource,
} = useItemListField({
	mode: props.mode,
	field: toRef(props, 'field'),
	emit,
});
const { getValidationId, isSuccess, isRequired } = useFieldValidation({
	validationId: props.validationId,
	validationScope: props.validationScope,
	fieldOptions,
	id,
});

function HelpTextDialogClick(
	title: string | undefined,
	helptext: string | undefined,
	id: string
): string {
	helpTextDialog.value = id;
	checkedItemTitle.value = title || '';
	checkedItemHelptext.value = helptext || '';
	return helpTextDialog.value;
}

const isBusyLoadingFromServer = ref<boolean>(true);
if (items.value.length > 0 || props.adminPreview) {
	isBusyLoadingFromServer.value = false;
}

function getValidationRules(): Record<string, unknown> {
	// This can not be a computed prop (wich in turn get cached and makes everything go bork)
	return isRequired.value
		? { oneOrMoreIsChecked: [fieldOptions.value.items] }
		: {};
}

function updatedOptions($event: any): void {
	emit('updatedOptions', $event);
}

watch(items, (newItems) => {
	if (newItems.length > 0) {
		isBusyLoadingFromServer.value = false;
	}
});

const dataSourceApplier = inject('$dataSourceApplier') as DataSourceApplier;

watch(
	() => selectedItem.value,
	async () => {
		const dataSourceAppliera = dataSourceApplier;
		const dataSourceSpecifications =
			await dataSourceAppliera.fetchDataSourceSpecifications();
		await selectedItemChanged(
			store,
			selectedItem.value,
			props.field,
			dataSourceAppliera,
			dataSourceSpecifications,
			store.state.form
		);
	}
);
</script>
<style scoped lang="scss">
.field-radio-button {
	&.edit-mode,
	&.print-mode,
	&.view-mode {
		.v-input--selection-controls {
			padding: 0;
			margin-top: 0px;
			margin-bottom: 8px;
		}
		:deep(.v-input__details .v-messages__message) {
			font-size: size(14);
		}
		.edit {
			:deep(.v-input__details) {
				display: none;
			}
		}

		:deep(.v-radio-group .v-label) {
			white-space: pre-wrap;
		}
	}
}
.v-messages {
	font-size: size(14);

	.v-messages__wrapper {
		margin-bottom: size(16);
		padding-top: size(6);
	}
}

fieldset {
	border: none;
}
legend {
	display: flex !important;
	&.validation-failed {
		color: $error;
	}
}
</style>
