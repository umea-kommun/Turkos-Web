<template>
	<div class="admin-item-list-field-options">
		<div class="admin-item-list-field-options-wrapper">
			<!-- Title -->
			<admin-text-box
				:id="'title-' + id"
				v-model="title"
				:label="$t('app.admin.field.title')"
				:help-text="$t('app.admin.field.titleHelpText')"
				rules="required"
			/>

			<!-- Help text -->
			<admin-text-box
				:id="'helpText-' + id"
				v-model="helpText"
				:label="$t('app.admin.field.helpText')"
				:help-text="$t('app.admin.field.helpTextHelpText')"
			/>

			<!-- Required -->
			<admin-switch
				:id="id + '-required'"
				v-model="required"
				:label="
					$t(
						'component.adminValidationManager.validation.types.required'
					)
				"
				:help-text="
					$t(
						'component.adminValidationManager.validation.types.requiredHelpText'
					)
				"
			/>

			<!-- Allow multiple choices in select list -->
			<admin-switch
				v-if="field.type === FormFieldType.SelectList"
				:id="id + '-multipleChoices'"
				v-model="allowMultipleChoices"
				:label="$t('app.admin.field.allowMultipleChoices')"
				:help-text="$t('app.admin.field.allowMultipleChoicesHelpText')"
			/>
		</div>

		<!-- Item alternatives -->
		<item-field-options
			:field="field"
			:type="fieldType"
			:allowMultipleChecked="
				field.type === FormFieldType.CheckBox || allowMultipleChoices
			"
			:items="items"
			@updatedOptions="updatedOptions"
		></item-field-options>
	</div>
</template>

<script setup lang="ts">
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import ItemFieldOptions from './ItemFieldOptions.vue';
import { FormMode, FormFieldType } from '@/models/Enums';
import { IItemListField } from '@/models/IForm';
import { PropType, computed, toRef } from 'vue';
import { useItemListField } from '@/components/field/composable/ItemListField';

const props = defineProps({
	field: {
		type: Object as PropType<IItemListField>,
		required: true,
	},
});

const emit = defineEmits(['updatedOptions']);

function updatedOptions($event: Event): void {
	emit('updatedOptions', $event);
}

const fieldType = computed(() => props.field.type as FormFieldType);

const { id, items, helpText, title, required, allowMultipleChoices } =
	useItemListField({
		mode: FormMode.Admin,
		field: toRef(props, 'field'),
		emit,
	});
</script>

<style scoped lang="scss">
.admin-item-list-field-options-wrapper {
	padding: 10px 24px 0;
}
</style>
