<template>
	<div v-if="form">
		<admin-header
			:canSaveForm="canSaveForm"
			@saveForm="saveForm"
			:sendingFormToServer="sendingFormToServer"
		/>

		<!-- Render either the Edit tab (AdminFormEdit) or the Settings tab (AdminFormSettings) -->
		<router-view></router-view>
	</div>
	<app-loading-spinner :isVisible="!form && isBusyLoadingFromServer" />
</template>

<script setup lang="ts">
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';
import { FormStatus, FormType, MutationType } from '@/models/Enums';
import { IForm, IRootState } from '@/models/IForm';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useTitle } from '@vueuse/core';
import { useValidateForm } from '@/components/admin/Validation/ValidateForm';
import { updateAdminMotherFields } from '@/store/utils';
import { useAdminFileManager } from '@/components/admin/Composable/adminFileManager';
import ErrorService from '@/utils/ErrorService';

const props = defineProps({
	formId: {
		type: String,
		required: true,
	},
});

const store = useStore<IRootState>();
const adminFileManager = useAdminFileManager();

const form = computed(() => store.state.form as IForm);
useValidateForm({ form });

const isBusyLoadingFromServer = ref(true);
const sendingFormToServer = ref(false);

const formHasUnsavedChanges = computed(() => {
	return store.state.formHasUnsavedChanges;
});

window.onbeforeunload = () => (formHasUnsavedChanges.value ? true : null);

/**
 * Get data from api and save to store.
 */
async function getData(): Promise<void> {
	await store.dispatch('getValidationRuleTypes');
	await store.dispatch('getForm', { id: props.formId });

	// Update list of mother fields with loaded form
	updateAdminMotherFields();

	// Update list of used files
	await adminFileManager.updateUsedUploadedFiles(store);

	isBusyLoadingFromServer.value = false;
}

onMounted(async () => {
	store.commit(MutationType.NewAdminState);
	await getData();
});

// Page title
const fullPageTitle = computed(() => {
	if (!form.value || !form.value.attributes.title) {
		return '';
	}
	return form.value.attributes.title;
});

// Automatically updates page title when fullPageTitle changes
useTitle(fullPageTitle);

const canSaveForm = computed(() => {
	if (
		form.value.attributes.status === FormStatus.Published &&
		form.value.attributes.type !== FormType.InfoPage
	) {
		if (store.state.admin?.formErrors?.length) {
			return false;
		}
	}
	return !sendingFormToServer.value && formHasUnsavedChanges.value;
});

async function saveForm(): Promise<void> {
	if (canSaveForm.value) {
		sendingFormToServer.value = true;
		try {
			// Upload new files
			await adminFileManager.uploadFiles(store);
			// Remove any files that are no longer used
			await adminFileManager.removeUnusedUploadedFiles(store);

			await store.dispatch('updateForm');
			store.commit(MutationType.UpdateAdminState, {
				prop: 'haveSavedAnyChanges',
				value: true,
			});
			await adminFileManager.updateUsedUploadedFiles(store);
		} catch (err) {
			// If file upload error show message, otherwise let error bubble up
			if (
				(err as any)?.response?.data?.errors?.length &&
				(err as any)?.response?.data?.errors[0]?.type ===
					'Total filesize is too big'
			) {
				ErrorService.onError({
					err,
					log: false,
					message:
						'Tillagda bilder överskrider den högst tillåtna storleken.',
				});
			} else {
				throw err;
			}
		}
		sendingFormToServer.value = false;
	}
}
</script>

<style scoped lang="scss">
:deep(.v-btn) {
	border-radius: $border-radius;

	text-transform: none;
	letter-spacing: normal;
	font-size: size(16);

	&.v-btn__content {
		align-items: center;
	}
}
</style>
