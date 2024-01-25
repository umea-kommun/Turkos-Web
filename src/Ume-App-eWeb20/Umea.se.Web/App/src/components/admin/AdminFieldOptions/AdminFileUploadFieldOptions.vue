<template>
	<div class="admin-single-field-options">
		<!-- Title -->
		<admin-text-box
			:id="'title-' + id"
			v-model="title"
			:label="t('app.admin.field.title')"
			:help-text="t('app.admin.field.titleHelpText')"
			rules="required"
		/>

		<admin-select-list
			:id="id + '-allowedTypes'"
			v-model="fileType"
			:items="items"
			item-title="label"
			item-value="value"
			:label="t('component.fieldFileUpload.acceptedFileTypes')"
		/>

		<!-- Allow Multiple Files -->
		<admin-switch
			:id="id + '-allowMultiple'"
			v-model="allowMultiple"
			:label="t('component.fieldFileUpload.acceptMultipleFiles')"
		/>

		<!-- Max files -->
		<admin-text-box
			v-if="allowMultiple"
			:id="id + '-maxFiles'"
			v-model="maxFiles"
			:label="$t('component.fieldFileUpload.maxFiles')"
			rules="numeric"
		/>

		<!-- Required -->
		<admin-switch
			:id="id + '-required'"
			v-model="required"
			:label="
				t('component.adminValidationManager.validation.types.required')
			"
			:help-text="
				t(
					'component.adminValidationManager.validation.types.requiredFileHelpText'
				)
			"
		/>
	</div>
</template>

<script setup lang="ts">
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import { useSingleValueField } from '@/components/field/composable/SingleValueField';
import { FormMode, FileTypeValidations } from '@/models/Enums';
import { IFileFieldOptions, ISingleValueField } from '@/models/IForm';
import { computed, PropType, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	field: {
		type: Object as PropType<ISingleValueField>,
		required: true,
	},
	maxFilesDefault: {
		type: Number,
		required: true,
	},
});

const { t } = useI18n();
const emit = defineEmits(['updatedValue']);

const { id, title, required, fieldOptions, storeUpdateFormField } =
	useSingleValueField({
		mode: FormMode.Admin,
		field: toRef(props, 'field'),
		emit,
	});

const fileType = computed({
	get: () => {
		return (
			(fieldOptions.value as IFileFieldOptions).fileTypeValidation ?? ''
		);
	},
	set: (newValue: string | undefined) => {
		storeUpdateFormField(
			{ ...fieldOptions.value, fileTypeValidation: newValue },
			'fieldOptions'
		);
	},
});

const allowMultiple = computed({
	get: () => {
		return !!(fieldOptions.value as IFileFieldOptions).allowMultiple;
	},
	set: (newValue: boolean) => {
		storeUpdateFormField(
			{ ...fieldOptions.value, allowMultiple: newValue },
			'fieldOptions'
		);
	},
});

const maxFiles = computed({
	get: () => {
		return (
			'' +
			((fieldOptions.value as IFileFieldOptions).maxFiles ??
				props.maxFilesDefault)
		);
	},
	set: (newValue: string) => {
		storeUpdateFormField(
			{ ...fieldOptions.value, maxFiles: newValue },
			'fieldOptions'
		);
	},
});

const items = [
	{
		label: t('component.fieldFileUpload.allowAnyFileType'),
		value: '',
	},
	{
		label: t('component.fieldFileUpload.allowOnlyImages'),
		value: FileTypeValidations.Images,
	},
	{
		label: t('component.fieldFileUpload.allowOnlyPdfAndWord'),
		value: FileTypeValidations.PdfAndWord,
	},
	{
		label: t('component.fieldFileUpload.allowOnlyPdf'),
		value: FileTypeValidations.Pdf,
	},
	{
		label: t('component.fieldFileUpload.allowOnlyPdfAndImages'),
		value: FileTypeValidations.PdfAndImages,
	},
	{
		label: t('component.fieldFileUpload.allowOnlyPdfAndOffice'),
		value: FileTypeValidations.PdfAndOffice,
	},
];
</script>

<style scoped lang="scss">
.admin-single-field-options {
	padding: 10px 24px;
}
</style>
