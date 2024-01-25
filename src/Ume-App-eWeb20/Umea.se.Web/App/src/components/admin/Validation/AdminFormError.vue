<template>
	<div
		v-if="formErrors.length"
		class="admin-form-error"
		:class="{ hasError: formErrors.length }"
	>
		<div class="expander-top">
			<v-icon icon="warning" class="mr-2" aria-hidden="true" />
			<h3>
				{{
					$t(
						'component.adminValidationManager.formValidation.formHasXErrors',
						[formErrors.length]
					)
				}}
			</h3>
			<v-icon
				:icon="showErrors ? 'expand_less' : 'expand_more'"
				class="ml-2"
				@click="showErrors = !showErrors"
			/>
		</div>
		<span v-if="showErrors">
			<ul class="mt-3 mb-3">
				<li
					v-for="(error, index) in formErrors"
					:key="error.msg + index"
				>
					<a @click="goToError(error)">{{ error.msg }}</a>
				</li>
			</ul>
			<p class="mb-0">
				{{
					$t(
						'component.adminValidationManager.formValidation.formErrorsDescription'
					)
				}}
			</p>
		</span>
	</div>
</template>

<script setup lang="ts">
import { MutationType } from '@/models/Enums';
import { IAdminFormError, IRootState } from '@/models/IForm';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore<IRootState>();

const route = useRoute();
const router = useRouter();

const showErrors = ref(true);

const formErrors = computed(() => store.state.admin?.formErrors ?? []);

function focusElement(id: string): void {
	document.getElementById(id)?.focus();
	// We call blur on the field to fire vee-validate, so that the error message is displayed on the field
	document.getElementById(id)?.blur();
	document.getElementById(id)?.focus();
}

async function goToField(error: IAdminFormError): Promise<void> {
	const routeName = route.name?.toString();
	if (routeName && routeName.indexOf('AdminForm.Edit') === -1) {
		await router.push({
			name: 'AdminForm.Edit',
			params: { formId: route.params.formId },
		});
	}
	store.commit(MutationType.UpdateAdminState, {
		prop: 'activeFieldId',
		value: error.fieldId,
	});
	store.commit(MutationType.UpdateAdminState, {
		prop: 'activeStep',
		value: (error.stepIndex ?? 0) + 1,
	});
	if (error.fieldTab) {
		store.commit(MutationType.UpdateAdminState, {
			prop: 'activeFieldOptionsTab',
			value: error.fieldTab,
		});
	}
	setTimeout(() => {
		document
			.getElementById('field-preview-' + error.fieldId)
			?.scrollIntoView({ block: 'center' });
		if (error.attribute) {
			focusElement(error.attribute + '-' + error.fieldId);
		}
	});
}

async function goToSetting(error: IAdminFormError): Promise<void> {
	const routeName = route.name?.toString();
	if (routeName !== 'AdminForm.Settings') {
		await router.push({
			name: 'AdminForm.Settings',
			params: { formId: route.params.formId },
		});
	}
	setTimeout(() => {
		if (error.attribute) {
			document
				.getElementById('eService-' + error.attribute)
				?.scrollIntoView({ block: 'center' });
			focusElement('eService-' + error.attribute);
		}
	});
}

async function goToEmail(): Promise<void> {
	const routeName = route.name?.toString();
	if (
		routeName !== 'AdminForm.Settings.Email' &&
		routeName !== 'AdminForm.Settings.Integration'
	) {
		await router.push({
			name: 'AdminForm.Settings.Email',
			params: { formId: route.params.formId },
		});
	}
}

async function goToIntegration(error: IAdminFormError): Promise<void> {
	const routeName = route.name?.toString();
	if (routeName !== 'AdminForm.Settings.Integration') {
		await router.push({
			name: 'AdminForm.Settings.Integration',
			params: { formId: route.params.formId },
		});
	}
	setTimeout(() => {
		if (error.attribute) {
			document.getElementById(error.attribute)?.click();
		}
	});
}

async function goToCES(error: IAdminFormError): Promise<void> {
	const routeName = route.name?.toString();
	if (routeName !== 'AdminForm.Settings.CES') {
		await router.push({
			name: 'AdminForm.Settings.CES',
			params: { formId: route.params.formId },
		});
	}
	setTimeout(() => {
		if (error.attribute) {
			document
				.getElementById(error.attribute)
				?.scrollIntoView({ block: 'center' });
			focusElement(error.attribute);
		}
	});
}

function goToError(error: IAdminFormError): void {
	switch (error.type) {
		case 'Field':
			goToField(error);
			break;
		case 'Setting':
			goToSetting(error);
			break;
		case 'Email':
			goToEmail();
			break;
		case 'Integration':
			goToIntegration(error);
			break;
		case 'CES':
			goToCES(error);
	}
}
</script>

<style scoped lang="scss">
.admin-form-error {
	padding: 20px;

	h3 {
		font-size: size(16);
		color: $grey-darken-1;
		flex: 1;
	}

	.expander-top {
		display: flex;
		align-items: center;
		color: $error;
	}

	ul {
		margin-left: 26px;
	}
	p {
		font-size: size(14);
	}

	&.hasError {
		background-color: #fff;
		border-bottom: solid 1px #ccc;

		color: #2d2d2d;

		h3 {
			color: $error;
		}
		a {
			color: #2d2d2d !important;
			text-decoration: underline;
			cursor: pointer;
		}
	}
}
</style>
