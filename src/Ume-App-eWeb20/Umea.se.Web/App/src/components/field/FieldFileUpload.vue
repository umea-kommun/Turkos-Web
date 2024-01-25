<template>
	<div class="field-file-upload" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-file-upload-field-options
						:field="props.field"
						:max-files-default="maxFilesDefault"
					/>
				</template>

				<template v-slot:display>
					<display-options :field="props.field" />
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
			type="file"
			:label="title"
			v-model="files"
			v-slot="{ errors }"
			:keepValue="true"
			:rules="adminPreview ? '' : validationRules"
			:standalone="adminPreview"
		>
			<!-- Titel -->
			<base-form-field
				:label="title"
				:isRequired="isRequired"
				:errorDisplay="!!errors.length || currentlyError"
				:admin-preview-label="
					adminPreview && $t('component.fieldFileUpload.newField')
				"
			/>
			<!-- Upload file -->
			<vue-file-pond
				:id="getValidationId"
				:name="getValidationId"
				class-name="vue-file-pond"
				ref="pond"
				:files="files"
				:class="{
					'text-error': !!errors.length,
					'upload-error': currentlyError,
				}"
				v-on:addfile="handleFileAdded"
				v-on:removefile="handleFileRemoved"
				:label-idle="uploadLabel"
				:maxFileSize="maxFileSize"
				:minFileSize="minFileSize"
				:allow-multiple="allowMultiple"
				:maxFiles="maxFiles"
				:allow-file-type-validation="!!acceptedFileTypes"
				:accepted-file-types="acceptedFileTypes"
				:aria-describedby="
					!!errors.length ? 'error-' + getValidationId : null
				"
			>
			</vue-file-pond>
			<HelpText
				v-if="currentlyError || helpText || !!errors.length"
				:helpText="helpText"
				:errors="
					currentlyError
						? [maxFileSizeReached]
						: errors.length
						? errors
						: []
				"
				:getValidationId="getValidationId"
				:cssClass="''"
			>
			</HelpText>
		</Field>

		<!-- VIEW -->
		<div v-if="mode === 'VIEW'">
			<form-field-preview
				:title="title"
				:value="value"
				:id="id"
			></form-field-preview>
		</div>

		<!-- PRINT -->
		<div v-if="mode === 'PRINT'" style="padding-top: 20px">
			<PrintTextBox
				:height="120"
				:title="title"
				:helpText="t('component.fieldFileUpload.printAttachments')"
			></PrintTextBox>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	IFileListField,
	IPondFile,
	IFileFieldOptions,
	IRootState,
} from '@/models/IForm';
import FilePond, { setOptions } from 'vue-filepond';
import PrintTextBox from './print/PrintTextBox.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import Config from '@/utils/Config';

// Import plugins for FilePond
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type';

// Import styles for FilePond
import 'filepond/dist/filepond.min.css';
import { Field } from 'vee-validate';
import { computed, onUnmounted, PropType, ref, toRef, watch } from 'vue';
import { useSingleValueField } from './composable/SingleValueField';
import { useFieldValidation } from './composable/FieldValidation';
import FieldOptionsContent from '../admin/AdminFieldOptions/FieldOptionsContent.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminFileUploadFieldOptions from '@/components/admin/AdminFieldOptions/AdminFileUploadFieldOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import HelpText from './helpAndError/HelpAndErrorText.vue';
import useEventsBus from './composable/EventBus';
import { FileTypeValidations, FormMode, MutationType } from '@/models/Enums';
import BaseFormField from '../base/BaseFormField.vue';

const { bus } = useEventsBus();
const { emitError } = useEventsBus();
let currentlyError = ref(false);

const VueFilePond = FilePond(
	FilePondPluginFileValidateSize,
	FilePondPluginFileValidateType
);

const props = defineProps({
	mode: {
		type: String as PropType<FormMode>,
		default: 'EDIT',
	},
	field: {
		type: Object as PropType<IFileListField>,
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

const { t } = useI18n();
const emit = defineEmits(['updatedValue']);
const store = useStore<IRootState>();

const files = ref<IPondFile[]>([]);
const maxFileSize: string | undefined = Config.VUE_APP_MAX_FILE_UPLOAD_SIZE;
const minFileSize: string | undefined = Config.VUE_APP_MIN_FILE_UPLOAD_SIZE;
const maxFilesDefault: number = 10;
const maxFormFileSize: string | undefined =
	Config.VUE_APP_MAX_FILE_UPLOAD_SIZE_FORM;

const { id, value, title, fieldOptions, storeUpdateFormField } =
	useSingleValueField({
		mode: props.mode,
		field: toRef(props, 'field'),
		emit,
	});

const { getValidationId, validationRules, isRequired } = useFieldValidation({
	validationId: props.validationId,
	validationScope: props.validationScope,
	fieldOptions,
	id,
});

const submitErrors = computed(() => {
	const errors: string[] = [];
	files.value.forEach((fileWrapper) => {
		if (fileWrapper.file?.size === 0) {
			errors.push(
				fileWrapper.file.name +
					' ' +
					t('component.fieldFileUpload.minSize')
			);
		} else if (fileWrapper.error) {
			errors.push(fileWrapper.error);
		}
	});

	return errors;
});

const allowMultiple = computed(
	() => !!(fieldOptions.value as IFileFieldOptions).allowMultiple
);

const maxFiles = computed({
	get: () => {
		return (
			(fieldOptions.value as IFileFieldOptions).maxFiles ||
			maxFilesDefault
		);
	},
	set: (newMaxFiles: number) => {
		store.commit(MutationType.UpdateFormField, {
			fieldId: id.value,
			newValue: { ...fieldOptions.value, maxFiles: newMaxFiles },
			fieldProperty: 'fieldOptions',
		});
	},
});

const helpText = computed(() => {
	if (!allowMultiple.value) {
		return '';
	}
	return t('component.filepond.helpText', [
		files.value.length,
		maxFiles.value,
	]);
});

const fileTypeValidation = computed({
	get: () => {
		return (
			(fieldOptions.value as IFileFieldOptions).fileTypeValidation || ''
		);
	},
	set: (fileTypeValidation: string) => {
		store.commit(MutationType.UpdateFormField, {
			fieldId: id.value,
			newValue: { ...fieldOptions.value, fileTypeValidation },
			fieldProperty: 'fieldOptions',
		});
	},
});

const uploadLabel = computed(() => {
	let allowedTypesTxt = '';
	switch (fileTypeValidation.value) {
		case FileTypeValidations.Images:
			allowedTypesTxt = t(
				'component.filepond.label.imagesOnly'
			).toString();
			break;
		case FileTypeValidations.PdfAndWord:
			allowedTypesTxt = t('component.filepond.label.docsOnly').toString();
			break;
		case FileTypeValidations.Pdf:
			allowedTypesTxt = t('component.filepond.label.pdfOnly').toString();
			break;
		case FileTypeValidations.PdfAndImages:
			allowedTypesTxt = t(
				'component.filepond.label.pdfAndImagesOnly'
			).toString();
			break;
		case FileTypeValidations.PdfAndOffice:
			allowedTypesTxt = t(
				'component.filepond.label.PdfAndOfficeOnly'
			).toString();
			break;
		default:
			allowedTypesTxt = t(
				'component.filepond.label.allAllowed'
			).toString();
	}

	return (
		t('component.filepond.label.intro') + `<br><em>${allowedTypesTxt}</em>`
	);
});

const maxFileSizeReached = computed(() => {
	return t('component.filepond.labelTotalFileSizeExceeded');
});

const validationMessage = computed(() => {
	return t('app.validation.messages.maxFileSizeReached');
});

// We can not do a deep copy since we will lose the File object,
// But we still want do copy as deep as possible
function copyFiles(files: IPondFile[]): IPondFile[] {
	return files.map((file) => ({ ...file }));
}

function updateFilesInStore(): void {
	const newFiles = copyFiles(files.value);
	storeUpdateFormField(newFiles, 'files');
	storeUpdateFormField(
		(newFiles || []).map((v) => v.file.name).join(', '),
		'value'
	);
}

onUnmounted(() => {
	// If field is unmounted (hidden by display rule etc.) we remove any selected files from state.
	if (files.value?.length) {
		files.value = [];
		if (store.state.form) {
			updateFilesInStore();
		}
	}
});

const validator = ref<any>(null);

function getCookie(cname: string): string {
	let name = cname + '=';
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}

//	Listen to other instances of this component. When another instance removes
//	a file in handleFileRemoved() this watcher is executed.
//	It is used to know if a file in another file upload field has been removed
//	and to know if the max upload limit still is true or not.
watch(
	() => bus.value.get('fileUploadError'),
	(val) => {
		const [fileUploadErrorBus] = val ?? [];
		currentlyError.value = fileUploadErrorBus;
		if (!currentlyError.value) {
			const errorFields = files.value.filter((x) => x.error);
			if (errorFields.length > 0) {
				errorFields.forEach((element) => {
					delete element.error;
				});

				updateFilesInStore();
				validator.value?.validate();
			}
		}
	}
);

function handleFileAdded(errorOrFile: any, fileOrErrorObj: any): void {
	let pondFile: IPondFile;
	let currentFileSize = getCookie('currentFileUploadSize');
	let formFileSize =
		Number(fileOrErrorObj.fileSize) + Number(currentFileSize);
	document.cookie = 'currentFileUploadSize=' + formFileSize.toString();

	//	If testing the else if statement, change the value of Config.VUE_APP_MAX_FILE_UPLOAD_SIZE_FORM
	//  in .env to try with a smaller file size limit, maybe 6000000 to try with 6MB.
	if (errorOrFile) {
		pondFile = {
			type: 'limbo',
			file: fileOrErrorObj.file,
			error: errorOrFile.main,
		};
	} else if (formFileSize >= Number(maxFormFileSize)) {
		pondFile = {
			type: 'limbo',
			file: fileOrErrorObj.file,
			error: validationMessage.value,
		};
		currentlyError.value = true;
	} else {
		pondFile = {
			type: 'limbo',
			file: fileOrErrorObj.file,
		};
	}
	files.value.push(pondFile);
	updateFilesInStore();

	validator.value?.validate();
}

function handleFileRemoved(_: never, file: any): void {
	const index =
		files.value?.findIndex(
			(element) => element.file.name === file.file.name
		) ?? -1;

	if (index !== -1) {
		files.value.splice(index, 1);

		if (file) {
			let currentFileSize = getCookie('currentFileUploadSize');
			let formFileSize = Number(currentFileSize) - Number(file.fileSize);
			document.cookie =
				'currentFileUploadSize=' + formFileSize.toString();

			//	If testing the else if statement, change the value of Config.VUE_APP_MAX_FILE_UPLOAD_SIZE_FORM
			//  in .env to try with a smaller file size limit, maybe 6000000 to try with 6MB.
			if (formFileSize <= Number(maxFormFileSize)) {
				currentlyError.value = false;

				//	If a file has been removed from a field that doesn't have the error
				//	we emit an event to all other instances of this component to let
				//	them know that maxFileSize for the form is no longer exceeded.
				emitError('fileUploadError', false);
			}
		}

		updateFilesInStore();
	}

	validator.value?.validate();
}

const fileTypes = {
	[FileTypeValidations.PdfAndWord]: [
		// support.office.com/en-us/article/file-formats-that-work-with-irm-d5d82a8e-e257-4518-a282-6ed0ae13eb63
		// https://stackoverflow.com/questions/4212861/what-is-a-correct-mime-type-for-docx-pptx-etc
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-word.document.macroEnabled.12',
	],
	[FileTypeValidations.Images]: ['image/jpeg', 'image/jpg', 'image/png'],
	[FileTypeValidations.Pdf]: ['application/pdf'],
	[FileTypeValidations.PdfAndImages]: [
		'application/pdf',
		'image/jpeg',
		'image/jpg',
		'image/png',
	],
	[FileTypeValidations.PdfAndOffice]: [
		'application/pdf',
		'application/msword',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-word.document.macroEnabled.12',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		'application/vnd.ms-powerpoint',
		'application/rtf',
	],
};

const acceptedFileTypes = computed(() => {
	if (fileTypeValidation.value !== '') {
		return fileTypes[fileTypeValidation.value].join(', ');
	} else {
		// All is allowed, ändra till Pdf and office?
		return fileTypes.Images.concat(fileTypes.PdfAndOffice).join(', ');
	}
});

// Set translations for file pond
setOptions({
	fileValidateTypeLabelExpectedTypesMap: {
		'image/jpeg': null,
		'image/jpg': '.jpg',
		'image/png': '.png',
		'application/pdf': '.pdf',
		'application/msword': '.docx',
		'application/vnd.ms-excel': '.xlsx',
		'application/vnd.ms-powerpoint': '.pptx',
		'application/rtf': '.rtf',
		'application/vnd.ms-word.document.macroEnabled.12': null,
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			null,
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			null,
		'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			null,
	},
	fileValidateTypeLabelExpectedTypes:
		fileTypeValidation.value !== '' &&
		fileTypes[fileTypeValidation.value].length === 1
			? t('component.filepond.fileValidateTypeLabelExpectedSingleType', {
					allButLastType: '{}',
					lastType: '{lastType}',
			  })
			: t('component.filepond.fileValidateTypeLabelExpectedTypes', {
					allButLastType: '{allButLastType}',
					lastType: '{lastType}',
			  }),
	labelFileWaitingForSize: t('component.filepond.labelFileWaitingForSize'),
	labelFileSizeNotAvailable: t(
		'component.filepond.labelFileSizeNotAvailable'
	),
	labelFileLoading: t('component.filepond.labelFileLoading'),
	labelFileLoadError: t('component.filepond.labelFileLoadError'),
	labelFileProcessing: t('component.filepond.labelFileProcessing'),
	labelFileProcessingComplete: t(
		'component.filepond.labelFileProcessingComplete'
	),
	labelFileProcessingAborted: t(
		'component.filepond.labelFileProcessingAborted'
	),
	labelFileProcessingError: t('component.filepond.labelFileProcessingError'),
	labelTapToCancel: t('component.filepond.labelTapToCancel'),
	labelTapToRetry: t('component.filepond.labelTapToRetry'),
	labelTapToUndo: t('component.filepond.labelTapToUndo'),
	labelButtonRemoveItem: t('component.filepond.labelButtonRemoveItem'),
	labelButtonAbortItemLoad: t('component.filepond.labelButtonAbortItemLoad'),
	labelButtonRetryItemLoad: t('component.filepond.labelButtonRetryItemLoad'),
	labelButtonAbortItemProcessing: t(
		'component.filepond.labelButtonAbortItemProcessing'
	),
	labelButtonUndoItemProcessing: t(
		'component.filepond.labelButtonUndoItemProcessing'
	),
	labelButtonRetryItemProcessing: t(
		'component.filepond.labelButtonRetryItemProcessing'
	),
	labelButtonProcessItem: t('component.filepond.labelButtonProcessItem'),
	labelFileTypeNotAllowed: t('component.filepond.labelFileTypeNotAllowed'),
	labelMaxFileSizeExceeded: t('component.filepond.labelMaxFileSizeExceeded'),
	labelMinFileSizeExceeded: t('component.filepond.labelMinFileSizeExceeded'),
	labelMaxFileSize: t('component.filepond.labelMaxFileSize'),
	labelMinFileSize: t('component.filepond.labelMinFileSize'),
	labelTotalFileSizeExceeded: t(
		'component.filepond.labelTotalFileSizeExceeded'
	),
	labelMaxTotalFileSize: t('component.filepond.labelMaxTotalFileSize'),
});

defineExpose({ getValidationId, submitErrors });
</script>

<style scoped lang="scss">
.field-file-upload {
	&.edit-mode,
	&.print-mode,
	&.view-mode {
		padding-bottom: 16px;

		/* error state color */
		// :deep([data-filepond-item-state*='error']
		// 		.filepond--item-panel, [data-filepond-item-state*='invalid']
		// 		.filepond--item-panel) {
		// 	background-color: $error;
		// }
		// :deep([data-filepond-item-state*='load-invalid'] .filepond--item-panel) {
		// 	background-color: $error;
		// }
		:deep([data-filepond-item-state*='load-invalid']
				.filepond--file-status-sub) {
			opacity: 1;
			font-size: size(12);
		}

		// :deep([data-filepond-item-state*='load-invalid']
		// 		.filepond--file-status-main) {
		// 	font-size: size(16);
		// }

		// :deep([data-filepond-item-state*='load-invalid']
		// 		.filepond--panel-bottom.filepond--item-panel) {
		// 	height: 20px;
		// }

		/* success state color */
		[data-filepond-item-state*='complete'] .filepond--item-panel,
		[data-filepond-item-state='idle'] .filepond--item-panel {
			background-color: $success;
		}
		/* the border radius of the drop area */
		.filepond--panel-root {
			border-radius: 4px 4px 0px 0px;
			border-style: dashed;
			border-color: gray;
			border-top-width: 2px;
			border-right-width: 2px;
			border-bottom-width: 2px;
			border-left-width: 2px;
		}
		.text-error {
			.filepond--drop-label {
				color: $error;
			}
			.filepond--panel-root {
				border-color: $error;
			}
		}
		:deep(.filepond--root) {
			margin-bottom: 0px;
			min-height: 85px;
		}

		/* the border radius of the file item */
		.filepond--item-panel {
			border-radius: 4px;
		}
		:deep(.filepond--drop-label) {
			cursor: pointer;
			font-size: size(14);
			min-height: 5.85em;
		}

		:deep(.filepond--panel-bottom) {
			height: 1.5em;
		}

		:deep(.filepond--wrapper label span) {
			color: #ff0000;
		}

		:deep(.filepond--credits) {
			display: none;
		}

		.field-file-upload-view {
			/* the border radius of the drop area */
			.filepond--panel-root {
				border-radius: 4px 4px 0px 0px;
				border: none;
			}
		}

		:deep(.v-messages) {
			opacity: 1;
		}
	}
}

:deep(.upload-error) {
	.filepond--list {
		li:first-child {
			.filepond--panel .filepond--item-panel {
				background-color: $error-file;
			}
		}
	}
}
</style>
