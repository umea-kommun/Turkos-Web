<template>
	<div class="field-select-list" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-item-list-field-options
						@updated-options="
							(a: Event) => emit('updatedOptions', a)
						"
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
			v-model="userChoice"
			:name="getValidationId"
			:label="title"
			:keepValue="true"
			type="select"
			v-slot="{ field, errors, meta }"
			:rules="adminPreview ? '' : validationRules"
			:standalone="adminPreview"
		>
			<base-form-field
				:label="title"
				:label-for="getValidationId"
				:isRequired="isRequired"
				:errorDisplay="!!errors.length"
				:admin-preview-label="
					adminPreview && $t('component.fieldSelectList.newField')
				"
			>
				<template v-if="items.length > 0">
					<v-autocomplete
						v-if="items.length > 10"
						v-model:search="searchValue"
						v-model="userChoice"
						:loading="loadingData"
						:items="items"
						item-value="id"
						item-text="title"
						@click:append-inner="MenuArrow"
						ref="publicapi"
						:hide-no-data="true"
						:return-object="true"
						:id="getValidationId"
						:multiple="allowMultipleChoices"
						:chips="allowMultipleChoices"
						:menu-props="{
							maxHeight: '200',
							class: 'v-select-menu v-menu-' + id,
							contentClass: 'v-select-menu-content',
						}"
						:success="isSuccess"
						persistent-hint
						:disabled="loadingData"
						density="compact"
						:color="errors.length ? 'error' : 'primary'"
						:error="!!errors.length"
						:aria-describedby="
							!!errors.length ? 'error-' + getValidationId : null
						"
						:dropdown-should-open="() => true"
						autocomplete="off"
					>
						<template v-slot:append-inner>
							<v-progress-circular
								v-if="loadingDataSource"
								:width="3"
								color="primary"
								indeterminate
								:size="28"
							/>
						</template>
					</v-autocomplete>
					<v-select
						v-else
						v-model="userChoice"
						v-bind="field"
						no-data-text="Laddar..."
						:loading="loadingData"
						:items="items"
						item-value="id"
						item-text="title"
						:return-object="true"
						:id="getValidationId"
						:multiple="allowMultipleChoices"
						:chips="allowMultipleChoices"
						:menu-props="{
							maxHeight: '200',
							class: 'v-select-menu v-menu-' + id,
							contentClass: 'v-select-menu-content',
						}"
						:success="isSuccess"
						persistent-hint
						:disabled="loadingData"
						density="compact"
						:color="errors.length ? 'error' : 'primary'"
						:error="!!errors.length"
						:aria-describedby="
							!!errors.length ? 'error-' + getValidationId : null
						"
						:dropdown-should-open="() => true"
					>
						<template v-slot:append-inner>
							<v-progress-circular
								v-if="loadingDataSource"
								:width="3"
								color="primary"
								indeterminate
								:size="28"
							/>
						</template>
					</v-select>
				</template>
				<DataServiceFieldFiller
					v-if="isItemFiller()"
					:field="props.field"
					:value="selectedItemValue"
				/>
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
			<form-field-preview
				v-if="!allowMultipleChoices"
				:title="title"
				:value="selectedItemTitle"
				:id="id"
			></form-field-preview>
			<form-field-preview v-else :title="title" :id="id">
				<ul>
					<li
						v-for="item in checkedItems"
						:key="item.id"
						class="mb-4"
					>
						<v-icon color="black" icon="check_box" />
						{{ item.title }}
					</li>
				</ul>
			</form-field-preview>
		</div>

		<!-- PRINT -->
		<div v-if="mode === 'PRINT'">
			<PrintCheckBoxList
				:title="title"
				:helpText="helpText"
				:items="items"
				:multiple="allowMultipleChoices ?? false"
			></PrintCheckBoxList>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FormMode } from '@/models/Enums';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import AdminItemListFieldOptions from '../admin/AdminFieldOptions/AdminItemListFieldOptions.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminDataOptions from '../admin/AdminFieldOptions/AdminDataOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import PrintCheckBoxList from './print/PrintCheckBoxList.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import { computed, inject, PropType, ref, toRef, watch } from 'vue';
import { Field } from 'vee-validate';
import { useItemListField } from './composable/ItemListField';
import { useFieldValidation } from './composable/FieldValidation';
import { IItem, IItemListField, IRootState } from '@/models/IForm';
import { useStore } from 'vuex';
import HelpText from './helpAndError/HelpAndErrorText.vue';
import { selectedItemChanged } from '@/store/utils';
import DataSourceApplier from '@/plugins/dataService/DataSourceApplier';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';
/**
 * Drop down list
 */
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

const store = useStore<IRootState>();

const selectedItemValue = ref<string>('');
const loadingData = ref<boolean>(false);
const searchValue = ref<string>('');

const emit = defineEmits(['updatedOptions']);

const {
	fieldOptions,
	id,
	title,
	items,
	selectedItem,
	checkedItems,
	allowMultipleChoices,
	helpText,
	loadingDataSource,
} = useItemListField({
	mode: props.mode,
	field: toRef(props, 'field'),
	emit,
});

const { getValidationId, validationRules, isSuccess, isRequired } =
	useFieldValidation({
		validationId: props.validationId,
		validationScope: props.validationScope,
		fieldOptions,
		id,
	});

const userChoice = computed({
	get: () => {
		return allowMultipleChoices.value
			? checkedItems.value ?? undefined
			: selectedItem.value ?? undefined;
	},
	set: (newChoice: IItem[] | IItem) => {
		if (allowMultipleChoices.value && Array.isArray(newChoice)) {
			checkedItems.value = newChoice as IItem[];
		} else {
			selectedItem.value = newChoice as IItem;
		}
	},
});

const publicapi = ref();
function MenuArrow(): void {
	const productSortSelect = publicapi.value;
	if (productSortSelect.isMenuActive) {
		publicapi.value.isMenuActive = false;
		document.getElementById(getValidationId.value)?.blur();
	} else {
		publicapi.value.isMenuActive = true;
		document.getElementById(getValidationId.value)?.focus();
	}
}

function isItemFiller(): boolean {
	if (fieldOptions.value.dataSource) {
		if (fieldOptions.value.dataSource.options.itemFiller) {
			return true;
		}
	}
	return false;
}

const selectedItemTitle = computed(() => {
	if (selectedItem.value) {
		return selectedItem.value.title || '';
	}
	return '';
});

const dataSourceApplier = inject('$dataSourceApplier') as DataSourceApplier;

watch(selectedItem, async () => {
	loadingData.value = false;
	if (isItemFiller()) {
		selectedItemValue.value = selectedItem.value.id.toString();
	}
	if (!store.state.form) {
		return;
	}
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
});
</script>

<style scoped lang="scss">
.field-select-list {
	&.edit-mode,
	&.print-mode,
	&.view-mode {
		.field {
			padding-bottom: 24px;
		}
		.field-title {
			display: block;
			padding-bottom: 8px;
		}

		:deep(.v-field__input) {
			padding: 0;

			.v-select__selection,
			.v-autocomplete__selection {
				margin: 0;
				padding: 8px 8px 14px;
				padding-left: 0;

				.v-chip .v-chip__content {
					display: block;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: size(16);
				}
			}
		}
		:deep(.v-autocomplete input) {
			margin: 0;
			margin-top: 3px !important;
			padding: 8px 8px 14px;
		}

		:deep(
				.v-field .v-field__append-inner .v-icon.mdi-check-circle-outline
			) {
			transform: none !important;
		}
		:deep(.v-field .v-field__append-inner .v-icon.mdi-alert) {
			transform: none !important;
		}
		:deep(.v-input .v-field__field) {
			--v-input-padding-top: 5px;
		}
		:deep(.v-input__details) {
			display: none !important;
		}
	}
}
</style>

<style lang="scss">
.v-select-menu .v-select__content {
	max-width: 1000px !important;

	.v-list-item-title {
		white-space: pre-wrap;
	}
}
</style>
