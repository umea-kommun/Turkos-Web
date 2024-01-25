<template>
	<div class="admin-search-field-options">
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
			:id="id + '-helpText'"
			v-model="helpText"
			:label="$t('app.admin.field.helpText')"
			:help-text="$t('app.admin.field.helpTextHelpText')"
		/>

		<!-- Value - Textbox -->
		<admin-text-box
			v-if="field.type === FormFieldType.TextSearchBox"
			:id="id + '-value'"
			v-model="value"
			:label="$t('app.admin.field.defaultValue')"
			:help-text="$t('app.admin.field.defaultValueHelpText')"
		/>

		<!-- Search button text -->
		<admin-text-box
			:id="id + '-buttonText'"
			v-model="buttonText"
			:label="$t('app.admin.field.button.title')"
			:help-text="$t('app.admin.field.button.titleHelpText')"
		/>

		<!-- Required -->
		<admin-switch
			v-if="field.type === FormFieldType.TextSearchBox"
			:id="id + '-required'"
			v-model="required"
			:label="
				$t('component.adminValidationManager.validation.types.required')
			"
			:help-text="
				$t(
					'component.adminValidationManager.validation.types.requiredHelpText'
				)
			"
		/>
	</div>
</template>

<script setup lang="ts">
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import { useSingleValueField } from '@/components/field/composable/SingleValueField';
import { FormMode, FormFieldType } from '@/models/Enums';
import { ISingleValueField } from '@/models/IForm';
import { PropType, toRef, computed } from 'vue';

const props = defineProps({
	field: {
		type: Object as PropType<ISingleValueField>,
		required: true,
	},
});

const emit = defineEmits(['updatedValue']);

const { id, value, helpText, title, required, storeUpdateFormField } =
	useSingleValueField({
		mode: FormMode.Admin,
		field: toRef(props, 'field'),
		emit,
	});

const buttonText = computed({
	get: () => props.field.fieldOptions.buttonText ?? '',
	set: (newValue: string) => {
		storeUpdateFormField(
			{ ...props.field.fieldOptions, buttonText: newValue },
			'fieldOptions'
		);
	},
});
</script>

<style scoped lang="scss">
.admin-search-field-options {
	padding: 10px 24px;
}
</style>
