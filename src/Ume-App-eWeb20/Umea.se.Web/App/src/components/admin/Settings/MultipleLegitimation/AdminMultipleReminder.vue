<template>
	<div class="admin-multiple-reminder ml-4 mt-10">
		<!-- Reminder -->
		<v-row>
			<v-col cols="12">
				<h2>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.reminderTitle'
						)
					}}
				</h2>
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.reminderDescription'
						)
					}}
				</p>
			</v-col>
		</v-row>
		<v-row class="mt-0">
			<v-col cols="5">
				<p class="mb-1">
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.epost'
						)
					}}
				</p>
				<p class="mb-2 mt-0">
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.subject'
						)
					}}
				</p>
				<admin-text-box
					id="email-reminder"
					v-model="emailSubjectReminder"
				/>
				<base-html-editor v-model="emailReminder" />
			</v-col>
			<v-col cols="5">
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.sms'
						)
					}}
				</p>
				<admin-text-box
					id="sms-reminder"
					v-model="smsReminder"
					:textArea="true"
				/>
			</v-col>
		</v-row>
		<hr class="mt-15 mb-10" />

		<!-- Reminder_last -->
		<v-row>
			<v-col cols="12">
				<h2>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.reminderLastTitle'
						)
					}}
				</h2>
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.reminderLastDescription'
						)
					}}
				</p>
			</v-col>
		</v-row>
		<v-row class="mt-0">
			<v-col cols="5">
				<p class="mb-1">
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.epost'
						)
					}}
				</p>
				<p class="mb-2 mt-0">
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.subject'
						)
					}}
				</p>
				<admin-text-box
					id="email-subject-reminder-last"
					v-model="emailSubjectReminderLast"
				/>
				<base-html-editor v-model="emailReminderLast" />
			</v-col>
			<v-col cols="5">
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.sms'
						)
					}}
				</p>
				<admin-text-box
					id="sms-reminder-last"
					v-model="smsReminderLast"
					:textArea="true"
				/>
			</v-col>
		</v-row>
		<hr class="mt-15 mb-10" />

		<!-- Reminder_closed -->
		<v-row>
			<v-col cols="12">
				<h2>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.reminderClosedTitle'
						)
					}}
				</h2>
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.reminderClosedDescription'
						)
					}}
				</p>
			</v-col>
		</v-row>
		<v-row class="mt-0">
			<v-col cols="5">
				<p class="mb-1">
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.epost'
						)
					}}
				</p>
				<p class="mb-2 mt-0">
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.subject'
						)
					}}
				</p>
				<admin-text-box
					id="email-subject-reminder-closed"
					v-model="emailSubjectReminderClosed"
				/>
				<base-html-editor v-model="emailReminderClosed" />
			</v-col>
			<v-col cols="5">
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.sms'
						)
					}}
				</p>
				<admin-text-box
					id="sms-reminder-closed"
					v-model="smsReminderClosed"
					:textArea="true"
				/>
			</v-col>
		</v-row>
	</div>
</template>

<script setup lang="ts">
import BaseHtmlEditor from '@/components/base/BaseHtmlEditor.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import { computed } from 'vue';
import { MessageEvent, Medium, MessageTextAttribute } from '@/models/Enums';
import { HelperAdmin } from '@/utils/helperAdmin';

const emailSubjectReminder = computed({
	get: () => {
		const subjectText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Reminder
		);
		return HelperAdmin.getReplaceVariablesInMessageText(subjectText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Reminder,
			updatedValue
		);
	},
});

const emailReminder = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Reminder
		);
		return HelperAdmin.getReplaceVariablesInMessageText(messageText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Reminder,
			updatedValue
		);
	},
});

const emailSubjectReminderLast = computed({
	get: () => {
		const subjectText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Last_reminder
		);
		return HelperAdmin.getReplaceVariablesInMessageText(subjectText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Last_reminder,
			updatedValue
		);
	},
});

const emailReminderLast = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Last_reminder
		);
		return HelperAdmin.getReplaceVariablesInMessageText(messageText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Last_reminder,
			updatedValue
		);
	},
});

const emailSubjectReminderClosed = computed({
	get: () => {
		const subjectText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Closed_due_to_no_response
		);
		return HelperAdmin.getReplaceVariablesInMessageText(subjectText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Closed_due_to_no_response,
			updatedValue
		);
	},
});

const emailReminderClosed = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Closed_due_to_no_response
		);
		return HelperAdmin.getReplaceVariablesInMessageText(messageText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Closed_due_to_no_response,
			updatedValue
		);
	},
});

const smsReminder = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Reminder
		);
		const editedText =
			HelperAdmin.getReplaceVariablesInMessageText(messageText);
		return HelperAdmin.getReplaceLineBreakInSMSMessageText(editedText);
	},
	set: (value: string) => {
		let updatedValue = HelperAdmin.setReplaceVariablesInMessageText(value);
		updatedValue =
			HelperAdmin.setReplaceLineBreakInSMSMessageText(updatedValue);

		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Reminder,
			updatedValue
		);
	},
});

const smsReminderLast = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Last_reminder
		);
		const editedText =
			HelperAdmin.getReplaceVariablesInMessageText(messageText);
		return HelperAdmin.getReplaceLineBreakInSMSMessageText(editedText);
	},
	set: (value: string) => {
		let updatedValue = HelperAdmin.setReplaceVariablesInMessageText(value);
		updatedValue =
			HelperAdmin.setReplaceLineBreakInSMSMessageText(updatedValue);

		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Last_reminder,
			updatedValue
		);
	},
});

const smsReminderClosed = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Closed_due_to_no_response
		);
		const editedText =
			HelperAdmin.getReplaceVariablesInMessageText(messageText);
		return HelperAdmin.getReplaceLineBreakInSMSMessageText(editedText);
	},
	set: (value: string) => {
		let updatedValue = HelperAdmin.setReplaceVariablesInMessageText(value);
		updatedValue =
			HelperAdmin.setReplaceLineBreakInSMSMessageText(updatedValue);

		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Closed_due_to_no_response,
			updatedValue
		);
	},
});
</script>

<style scoped lang="scss">
.admin-multiple-reminder {
	:deep(.v-field__input) {
		height: 475px;
	}
	.v-window-item {
		transition: none;
	}
	.v-col {
		font-size: size(16);
		.v-btn {
			text-transform: none;
			letter-spacing: normal;
			--v-btn-height: 50px;
			padding-left: 48px;
			padding-right: 48px;

			&--disabled {
				background-color: $grey-lighten-3;
				opacity: 1;
				padding-left: 28px;

				:deep(.v-btn__content, .v-btn__prepend) {
					color: $black;
				}
				:deep(.v-btn__prepend) {
					color: $grey-darken-2;
				}
			}
		}
	}
	h2 {
		font-size: size(22);
		line-height: size(22);
	}
	hr {
		border: solid 1px $grey-lighten-3;
	}
}
</style>
