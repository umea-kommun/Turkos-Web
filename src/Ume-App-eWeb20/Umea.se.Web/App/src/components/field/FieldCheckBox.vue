<template>
	<div class="field-check-box" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<!-- Example: How to implement admin options-->
			<field-options-content>
				<template v-slot:basic>
					<admin-item-list-field-options
						@updatedOptions="updatedOptions"
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
			ref="validator"
			:name="getValidationId"
			:label="title"
			:keepValue="true"
			type="checkbox"
			v-slot="{ errors, meta }"
			:rules="adminPreview ? '' : getValidationRules()"
			:standalone="adminPreview"
		>
			<base-form-field
				:id="'label-' + id"
				:label="title"
				:label-for="getValidationId"
				:isRequired="isRequired"
				:errorDisplay="!!errors.length"
				class="edit"
				:admin-preview-label="
					adminPreview && $t('component.fieldCheckBox.newField')
				"
			>
				<v-progress-circular
					v-if="isBusyLoadingFromServer"
					indeterminate
					color="primary"
				></v-progress-circular>
				<ul
					class="list-checkbox"
					:aria-labelledby="'label-' + id"
					:aria-describedby="'helpText-' + id + ' ' + 'error-' + id"
					:id="getValidationId"
				>
					<li v-for="item in items" :key="item.id">
						<v-checkbox
							v-model="checkedItems"
							@change="changedCheckbox"
							:value="item"
							:label="item.title"
							:hint="helpText"
							color="primary"
							type="checkbox"
							:required="isRequired"
							hide-details
							persistent-hint
							:error="!!errors.length"
							:aria-invalid="!!errors.length"
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
						</v-checkbox>
					</li>
				</ul>

				<!-- Help text -->
				<HelpText
					:helpText="helpText"
					:errors="errors"
					:getValidationId="getValidationId"
					:fieldValid="meta.valid"
				>
				</HelpText>
			</base-form-field>
		</Field>

		<!-- VIEW -->
		<div v-if="mode === 'VIEW'">
			<form-field-preview :title="title" :id="id">
				<p
					style="max-width: 90%"
					v-for="item in checkedItems"
					:key="item.title"
					:id="'field-' + id"
				>
					<v-icon color="black" icon="check_box" />
					{{ item.title }}
				</p>
			</form-field-preview>
		</div>

		<!-- PRINT -->
		<div v-if="mode === 'PRINT'">
			<PrintCheckBoxList
				:title="title"
				:helpText="helpText"
				:items="items"
				:multiple="true"
			></PrintCheckBoxList>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IItemListField } from '@/models/IForm';
import { FormMode } from '@/models/Enums';
import PrintCheckBoxList from './print/PrintCheckBoxList.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminDataOptions from '../admin/AdminFieldOptions/AdminDataOptions.vue';
import AdminItemListFieldOptions from '../admin/AdminFieldOptions/AdminItemListFieldOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import { PropType, ref, toRef, watch } from 'vue';
import { Field, FieldContext } from 'vee-validate';
import { useItemListField } from './composable/ItemListField';
import { useFieldValidation } from './composable/FieldValidation';
import HelpText from './helpAndError/HelpAndErrorText.vue';
import BaseDialog from '@/components/base/BaseDialog.vue';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';

/**
 * Komponent för en eller flera kryssrutor i ett formulär.
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

const emit = defineEmits(['updatedOptions']);

const { fieldOptions, id, title, items, checkedItems, helpText } =
	useItemListField({
		mode: props.mode,
		field: toRef(props, 'field'),
		emit,
	});

// Use our composable fieldValidation
const { getValidationId, isRequired } = useFieldValidation({
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

function updatedOptions($event: Event): void {
	emit('updatedOptions', $event);
}

function getValidationRules(): Record<string, unknown> {
	return isRequired.value
		? { oneOrMoreIsChecked: [fieldOptions.value.items] }
		: {};
}

const validator = ref<FieldContext | null>(null);
const changedCheckbox = (): void => {
	validator.value?.validate();
};

watch(
	() => items.value.length,
	() => {
		if (items.value.length > 0) {
			isBusyLoadingFromServer.value = false;
		}
	}
);
</script>

<style scoped lang="scss">
.field-check-box {
	&.edit-mode,
	&.print-mode,
	&.view-mode {
		.v-input--selection-controls {
			padding: 0;
			margin-top: 0;
			margin-bottom: 8px;
		}
		:deep(.v-checkbox .v-selection-control) {
			--v-input-control-height: 40px;
			height: auto;
			min-height: --v-input-control-height;
			width: 100%;
		}
		:deep(.v-checkbox .v-label) {
			white-space: pre-wrap;
		}

		.v-messages__message,
		.text-error {
			font-size: size(14);
		}
	}
}
.list-checkbox {
	list-style: none;
}
</style>
