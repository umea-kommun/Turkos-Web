<template>
	<v-dialog
		v-model="showModal"
		scrollable
		aria-labelledby="admin-multiple-message-title"
		aria-describedby="admin-multiple-message-text"
		aria-live="polite"
		:aria-busy="isBusyLoadingFromServer"
	>
		<v-card class="admin-multiple-message">
			<v-row>
				<v-col cols="10">
					<div class="loading-wrap" v-if="isBusyLoadingFromServer">
						<v-progress-circular color="primary" indeterminate />
						<div
							ref="loaderElement"
							tabindex="-1"
							class="mt-4"
							aria-busy="true"
							aria-live="polite"
						>
							{{ $t('component.external.consent.loading') }}
						</div>
					</div>
					<div>
						<v-card-title>
							<div
								id="admin-multiple-message-title"
								tabindex="-1"
							>
								{{
									$t(
										'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.title'
									)
								}}
							</div>
						</v-card-title>
						<v-tabs
							v-model="activeTab"
							id="admin-multiple-message-text"
							slider-color="primary"
						>
							<v-tab tabindex="0" value="confirmAndNotification">
								{{
									$t(
										'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.confirmAndNotification'
									)
								}}
							</v-tab>
							<v-tab tabindex="0" value="status">
								{{
									$t(
										'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.statusUpdate'
									)
								}}
							</v-tab>
							<v-tab tabindex="0" value="reminder">
								{{
									$t(
										'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.reminder'
									)
								}}
							</v-tab>
						</v-tabs>
					</div>
				</v-col>
			</v-row>
			<hr />

			<v-row>
				<v-col>
					<v-window :model-value="activeTab" :disabled="true"
						><v-window-item value="confirmAndNotification"
							><admin-multiple-confirm-and-notification></admin-multiple-confirm-and-notification
						></v-window-item>
						<v-window-item value="status"
							><admin-multiple-status></admin-multiple-status></v-window-item
						><v-window-item value="reminder"
							><admin-multiple-reminder></admin-multiple-reminder
						></v-window-item>
					</v-window>
				</v-col>

				<!-- Vertical line -->
				<v-col cols="auto" class="divider-column mt-3"> </v-col>

				<v-col cols="2">
					<admin-dynamical-variables
						class="fixed-position"
					></admin-dynamical-variables>
				</v-col>
			</v-row>
			<hr class="mt-3" />
			<v-card-actions>
				<v-btn @click="showModal = false">{{
					$t('app.nav.close')
				}}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AdminMultipleConfirmAndNotification from '@/components/admin/Settings/MultipleLegitimation/AdminMultipleConfirmAndNotification.vue';
import AdminMultipleStatus from '@/components/admin/Settings/MultipleLegitimation/AdminMultipleStatus.vue';
import AdminMultipleReminder from '@/components/admin/Settings/MultipleLegitimation/AdminMultipleReminder.vue';
import AdminDynamicalVariables from './AdminDynamicalVariables.vue';

const props = defineProps({
	modelValue: { type: Boolean, required: true },
});

const isBusyLoadingFromServer = ref<boolean>(true);

const emit = defineEmits(['update:modelValue']);
const showModal = computed({
	get: () => props.modelValue,
	set: (show) => emit('update:modelValue', show),
});

const activeTab = ref('');

onMounted(async () => {
	isBusyLoadingFromServer.value = true;
	isBusyLoadingFromServer.value = false;
});
</script>

<style scoped lang="scss">
.v-dialog {
	width: 95vw;
	height: 95vh;
}
.admin-multiple-message {
	.divider-column {
		position: relative;
		min-width: 1px;
	}
	.divider-column::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 150%;
		border-left: 1px solid $grey-lighten-3;
		transform: translateX(-50%);
	}
	.fixed-position {
		position: fixed;
	}

	.flex-item {
		padding: 10px;
	}

	.v-window-item {
		transition: none;
	}
	.v-tabs {
		--v-tabs-height: 62px;
		.v-tab {
			margin: 0;
			height: 100%;
			color: $grey-darken-1;
			text-transform: none;
			font-weight: bold;
			letter-spacing: normal;
			font-size: size(16);

			&--selected {
				color: $primary;
			}
		}
	}
	.v-col {
		font-size: size(16);
	}
	hr {
		border: solid 1px $grey-lighten-3;
	}
	.loading-wrap {
		padding: 100px 0;
		text-align: center;
	}
	.v-card-actions {
		display: flex;
		justify-content: flex-end;
	}
}
</style>
