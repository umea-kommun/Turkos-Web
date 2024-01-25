<template>
	<div class="admin-dynamical-variables mr-4">
		<v-row>
			<v-col class="mt-3 ml-3">
				<strong>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.title'
						)
					}}</strong
				>
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.description'
						)
					}}
				</p>
			</v-col>
		</v-row>
		<v-row no-gutters class="grey-background">
			<v-col cols="12" class="ml-3 mt-1">
				<button
					class="text-start"
					@click="
						insertText(MessageTextsVariablesForBackend.NumberOfDays)
					"
				>
					<div>
						{{
							$t(
								'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.numberOfDays'
							)
						}}
					</div>
					<div class="text-caption mb-1">
						{{ MessageTextsVariablesToShowFrontend.NumberOfDays }}
					</div>
				</button>
			</v-col>
		</v-row>
		<v-row no-gutters>
			<v-col cols="12" class="ml-3 mt-1">
				<button
					class="text-start"
					@click="
						insertText(
							MessageTextsVariablesForBackend.EserviceTitleShowsOnConfirmAndNotificationAndStatus
						)
					"
				>
					<div>
						{{
							$t(
								'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.titleEserviceConfirmAndNotificationAndStatus'
							)
						}}
					</div>
					<div class="text-caption mb-1">
						{{
							MessageTextsVariablesToShowFrontend.EserviceTitleShowsOnConfirmAndNotificationAndStatus
						}}
					</div>
				</button>
			</v-col>
		</v-row>
		<v-row no-gutters class="grey-background">
			<v-col cols="12" class="ml-3 mt-1">
				<button
					class="text-start"
					@click="
						insertText(
							MessageTextsVariablesForBackend.EserviceTitleShowsOnReminders
						)
					"
				>
					<div>
						{{
							$t(
								'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.titleEserviceReminders'
							)
						}}
					</div>
					<div class="text-caption mb-1">
						{{
							MessageTextsVariablesToShowFrontend.EserviceTitleShowsOnReminders
						}}
					</div>
				</button>
			</v-col>
		</v-row>
		<v-row no-gutters>
			<v-col cols="12" class="ml-3 mt-1">
				<button
					class="text-start"
					@click="
						insertText(
							MessageTextsVariablesForBackend.EserviceTitleShowsOnExpired
						)
					"
				>
					<div>
						{{
							$t(
								'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.titleEserviceExpired'
							)
						}}
					</div>
					<div class="text-caption mb-1">
						{{
							MessageTextsVariablesToShowFrontend.EserviceTitleShowsOnExpired
						}}
					</div>
				</button>
			</v-col>
		</v-row>
		<v-row no-gutters class="grey-background">
			<v-col cols="12" class="ml-3 mt-1">
				<button
					class="text-start"
					@click="
						insertText(
							MessageTextsVariablesForBackend.UrlEserviceEmail
						)
					"
				>
					<div>
						{{
							$t(
								'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.urlEserviceEmail'
							)
						}}
					</div>
					<div class="text-caption mb-1">
						{{
							MessageTextsVariablesToShowFrontend.UrlEserviceEmail
						}}
					</div>
				</button>
			</v-col>
		</v-row>
		<v-row no-gutters>
			<v-col cols="12" class="ml-3 mt-1">
				<button
					class="text-start"
					@click="
						insertText(
							MessageTextsVariablesForBackend.UrlEserviceSms
						)
					"
				>
					<div>
						{{
							$t(
								'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.urlEserviceSms'
							)
						}}
					</div>
					<div class="text-caption mb-1">
						{{ MessageTextsVariablesToShowFrontend.UrlEserviceSms }}
					</div>
				</button>
			</v-col>
		</v-row>
		<v-row no-gutters  class="grey-background">
			<v-col cols="12" class="ml-3 mt-1">
				<button
					class="text-start"
					@click="
						insertText(
							MessageTextsVariablesForBackend.FornameAndLastnameGuardian
						)
					"
				>
					<div>
						{{
							$t(
								'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.nameGuardian'
							)
						}}
					</div>
					<div class="text-caption mb-1 mr-4">
						{{
							MessageTextsVariablesToShowFrontend.FornameAndLastnameGuardian
						}}
					</div>
				</button>
			</v-col>
		</v-row>
		<v-row no-gutters>
			<v-col cols="12" class="ml-3 mt-1">
				<button
					class="text-start"
					@click="
						insertText(
							MessageTextsVariablesForBackend.FornameAndLastnameGuardian1ShowsWhenExpired
						)
					"
				>
					<div>
						{{
							$t(
								'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.dynamicalVariables.nameGuardian1ShowsWhenExpired'
							)
						}}
					</div>
					<div class="text-caption mb-1 mr-4">
						{{
							MessageTextsVariablesToShowFrontend.FornameAndLastnameGuardian1ShowsWhenExpired
						}}
					</div>
				</button>
			</v-col>
		</v-row>
	</div>
</template>

<script setup lang="ts">
import {
	MutationType,
	MessageTextsVariablesForBackend,
	MessageTextsVariablesToShowFrontend,
} from '@/models/Enums';
import { useStore } from 'vuex';

const store = useStore();

const insertText = (text: string): void => {
	store.commit(MutationType.InsertAtCursor, text);
};
</script>
<style scoped lang="scss">
.admin-dynamical-variables {
	.grey-background {
		background-color: $grey-lighten-3;
	}
}
</style>
