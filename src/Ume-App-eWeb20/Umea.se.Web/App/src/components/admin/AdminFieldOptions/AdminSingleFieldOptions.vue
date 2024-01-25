<template>
	<div class="admin-single-field-options">
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
			v-if="showHelpText"
			:id="'helpText-' + id"
			v-model="helpText"
			:label="$t('app.admin.field.helpText')"
			:help-text="$t('app.admin.field.helpTextHelpText')"
		/>

		<!-- Value - Date -->
		<admin-date-picker
			v-if="field.type === FormFieldType.DatePicker"
			:id="'value-' + id"
			v-model="value"
			:label="$t('app.admin.field.defaultValue')"
			:help-text="$t('app.admin.field.defaultValueHelpText')"
		/>
		<!-- Value - Textarea -->
		<admin-text-box
			v-else-if="field.type === FormFieldType.TextArea"
			:id="'value-' + id"
			v-model="value"
			:label="$t('app.admin.field.defaultValue')"
			:help-text="$t('app.admin.field.defaultValueHelpText')"
			:text-area="true"
		/>
		<!-- Value - Textbox -->
		<admin-text-box
			v-else
			:id="'value-' + id"
			v-model="value"
			:label="$t('app.admin.field.defaultValue')"
			:help-text="$t('app.admin.field.defaultValueHelpText')"
		/>

		<!-- Required -->
		<admin-switch
			v-if="showRequired"
			:id="'required-' + id"
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

		<!-- Validation rules -->
		<admin-validation-manager :id="'validation-' + id" :field="field" />

		<!-- Read only -->
		<admin-switch
			v-if="showReadOnly"
			:id="'readOnly-' + id"
			v-model="readOnly"
			:label="$t('app.admin.field.readOnly')"
			:help-text="$t('app.admin.field.readOnlyHelpText')"
		/>

		<!-- Use as contact field -->
		<admin-switch
			v-if="showUseAsContactField"
			:id="'useAsContactFieldToggle-' + id"
			v-model="useAsContactFieldToggle"
			:label="$t('app.admin.field.useAsContactField')"
			:help-text="$t('app.admin.field.useAsContactFieldHelpText')"
		/>

		<admin-select-list
			v-if="useAsContactFieldToggle"
			:id="'useAsContactFieldDropDown-' + id"
			v-model="useAsContactField"
			:items="contactFields"
			:label="$t('app.admin.field.selectContactField')"
			:helpText="$t('app.admin.field.selectContactFieldHelpText')"
		/>

		<!-- Allow decimals in numeric field -->
		<admin-switch
			v-if="field.type === FormFieldType.Numeric"
			:id="'allowDecimals-' + id"
			v-model="allowDecimals"
			:label="$t('app.admin.field.allowDecimals')"
			:help-text="$t('app.admin.field.allowDecimalsHelpText')"
		/>
	</div>
</template>

<script setup lang="ts">
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminDatePicker from '@/components/field/admin/AdminDatePicker.vue';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import AdminValidationManager from '@/components/admin/AdminFieldOptions/AdminValidationManager.vue';
import { useSingleValueField } from '@/components/field/composable/SingleValueField';
import { FormMode, FormFieldType, ContactFields } from '@/models/Enums';
import { ISingleValueField } from '@/models/IForm';
import { PropType, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();

const props = defineProps({
	field: {
		type: Object as PropType<ISingleValueField>,
		required: true,
	},
	showHelpText: {
		type: Boolean,
		default: true,
	},
	showRequired: {
		type: Boolean,
		default: true,
	},
	showReadOnly: {
		type: Boolean,
		default: false,
	},
	showUseAsContactField: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['updatedValue']);

const contactFields = [
	{
		title: t('component.adminForm.userRequirements.phoneNumber'),
		value: ContactFields.Phonenumber,
	},
	{
		title: t('component.adminForm.userRequirements.email'),
		value: ContactFields.Email,
	},
];

const {
	id,
	value,
	helpText,
	title,
	required,
	readOnly,
	allowDecimals,
	useAsContactField,
} = useSingleValueField({
	mode: FormMode.Admin,
	field: toRef(props, 'field'),
	emit,
});

const isUseAsContactFieldToggled = ref<boolean>(false);
const useAsContactFieldToggle = computed({
	get: () => {
		return (
			useAsContactField.value !== undefined ||
			isUseAsContactFieldToggled.value
		);
	},
	set: (newValue: boolean) => {
		isUseAsContactFieldToggled.value = newValue;
		if (!newValue) {
			useAsContactField.value = undefined;
		} else {
			setTimeout(() => {
				document
					.getElementById('useAsContactFieldDropDown-' + id.value)
					?.focus();
			});
		}
	},
});
</script>

<style scoped lang="scss">
.admin-single-field-options {
	padding: 10px 24px;
}
</style>
