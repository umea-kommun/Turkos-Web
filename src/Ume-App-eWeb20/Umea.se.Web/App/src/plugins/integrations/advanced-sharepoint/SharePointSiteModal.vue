<template>
	<div>
		<v-dialog
			transition="slide-y-transition"
			v-model="doOpen"
			max-width="540px"
			:persistent="true"
			:no-click-animation="true"
			@click:outside="closeDialog"
			class="sharepoint-website"
		>
			<Form as="" ref="integrationForm" v-slot="{ errors }">
				<v-card role="alert">
					<v-card-title class="grey lighten-2" primary-title>
						<strong>
							{{
								$t(
									'component.adminIntegrationCreateSharepointSite.title'
								)
							}}
						</strong>
					</v-card-title>
					<integration-edit-errors :errors="errors" />
					<v-card-text>
						<admin-text-box
							id="siteTitle"
							name="siteTitle"
							v-model="siteTitle"
							:errorMessage="errorMessage"
							:label="
								$t(
									'component.adminIntegrationCreateSharepointSite.siteTitle'
								)
							"
							:help-text="
								$t(
									'component.adminIntegrationCreateSharepointSite.siteTitleHelpText'
								)
							"
							rules="required"
						/>
						<admin-text-box
							id="userEmail"
							name="userEmail"
							v-model="userEmail"
							:label="
								$t(
									'component.adminIntegrationCreateSharepointSite.userEmail'
								)
							"
							:help-text="
								$t(
									'component.adminIntegrationCreateSharepointSite.userEmailHelpText'
								)
							"
							rules="required|email"
						/>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							flat
							@click="(doOpen = false), (create = false)"
							:title="
								$t(
									'component.adminIntegrationCreateSharepointSite.cancel'
								)
							"
							:showDialog="showDialog"
							>{{
								$t(
									'component.adminIntegrationCreateSharepointSite.cancel'
								)
							}}
						</v-btn>
						<v-btn
							flat
							color="primary"
							:disabled="
								!!Object.keys(errors).length ||
								(errorMessage != null && errorMessage != '')
							"
							@click="create = true"
							:title="
								$t(
									'component.adminIntegrationCreateSharepointSite.create'
								)
							"
							:showDialog="showDialog"
							>{{
								$t(
									'component.adminIntegrationCreateSharepointSite.create'
								)
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</Form>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
import { IRootState } from '@/models/IForm';
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { Form } from 'vee-validate';
import IntegrationEditErrors from '@/components/admin/Settings/Integration/IntegrationEditErrors.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';

const props = defineProps({
	/** Showing html dialog. */
	showDialog: {
		type: Boolean,
		default: false,
	},
});

const { t } = useI18n();
const integrationForm = ref();
const store = useStore<IRootState>();
const emit = defineEmits(['dialogClose']);
const userEmail = ref<string>('');
const siteTitle = ref<string>('');
const errorMessage = ref<string>();
const sharepointWebsiteNames = ref<string[]>([]);

/** Controls the dialog, can be set programatically by calling component.open() or via showDialog prop */
const isDialogOpen = ref<boolean>(false);

const sharePointSiteExists = computed(() => {
	const exists = sharepointWebsiteNames.value.filter(
		(f) => f.toLowerCase() === siteTitle.value.toLowerCase()
	);
	if (exists.length === 0) {
		return false;
	}
	return true;
});

const createSharePointSite = async (): Promise<void> => {
	await store.dispatch('createSharePointSite', {
		siteTitle: siteTitle.value,
		userEmail: userEmail.value,
	});
};

const doOpen = computed({
	get: () => {
		return isDialogOpen.value || props.showDialog;
	},
	set: (isOpen: boolean) => {
		isDialogOpen.value = isOpen;
		if (!isOpen) {
			emit('dialogClose');
		}
	},
});

const onCreate = async (): Promise<void> => {
	const formValid = (await integrationForm.value?.validate())?.valid ?? false;
	if (formValid && !sharePointSiteExists.value) {
		createSharePointSite();
		doOpen.value = false;
	}
};

const create = computed({
	get: () => {
		return false;
	},
	set: (isCreate: boolean) => {
		if (isCreate) {
			onCreate();
		}
	},
});

/**
 * Opens up the confirm dialog, will resolve to true when closed
 */
function open(sharepointWebsites: string[]): Promise<boolean> {
	sharepointWebsiteNames.value = sharepointWebsites;
	doOpen.value = true;
	return new Promise((resolve) => {
		const unwatch = watch(doOpen, () => {
			if (!doOpen.value) {
				unwatch();
				resolve(true);
			}
		});
	});
}

function closeDialog(event: any): void {
	if (event.target.closest('.v-overlay__scrim') != null) {
		doOpen.value = false;
	}
}

watch(
	() => siteTitle.value,
	() => {
		if (siteTitle.value.length > 0) {
			if (sharePointSiteExists.value) {
				errorMessage.value = t(
					'component.adminIntegrationCreateSharepointSite.alreadyExists'
				);
			} else {
				errorMessage.value = '';
			}
		}
	}
);

// Expose the open function so it can be used outside of the component
defineExpose({
	open,
});
</script>

<style scoped lang="scss">
.sharepoint-website {
	.v-label {
		font-size: 13px;
		padding: 10px;
		display: inline-block;
	}
	.right-aligned {
		float: right;
	}
	.error-text {
		color: red;
	}
}
</style>
