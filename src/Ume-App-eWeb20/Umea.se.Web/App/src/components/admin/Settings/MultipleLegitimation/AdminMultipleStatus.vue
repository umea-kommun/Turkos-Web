<template>
	<div class="admin-multiple-status ml-4 mt-10">
		<!-- Status_accept -->
		<v-row>
			<v-col cols="12">
				<h2>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.statusAcceptTitle'
						)
					}}
				</h2>
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.statusAcceptDescription'
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
					id="email-subject-accept"
					v-model="emailSubjectAccept"
				/>
				<base-html-editor v-model="emailAccept" />
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
					id="sms-accept"
					v-model="smsAccept"
					:textArea="true"
				/>
			</v-col>
		</v-row>
		<hr class="mt-15 mb-10" />

		<!-- Status_reject -->
		<v-row>
			<v-col cols="12">
				<h2>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.statusRejectTitle'
						)
					}}
				</h2>
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.statusRejectDescription'
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
					id="email-subject-reject"
					v-model="emailSubjectReject"
				/>
				<base-html-editor v-model="emailReject" />
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
					id="sms-reject"
					v-model="smsReject"
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

const emailSubjectAccept = computed({
	get: () => {
		const subjectText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Accept
		);
		return HelperAdmin.getReplaceVariablesInMessageText(subjectText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Accept,
			updatedValue
		);
	},
});

const emailAccept = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Accept
		);
		return HelperAdmin.getReplaceVariablesInMessageText(messageText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Accept,
			updatedValue
		);
	},
});

const emailSubjectReject = computed({
	get: () => {
		const subjectText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Reject
		);
		return HelperAdmin.getReplaceVariablesInMessageText(subjectText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Reject,
			updatedValue
		);
	},
});

const emailReject = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Reject
		);
		return HelperAdmin.getReplaceVariablesInMessageText(messageText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Reject,
			updatedValue
		);
	},
});

const smsAccept = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Accept
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
			MessageEvent.Accept,
			updatedValue
		);
	},
});

const smsReject = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Reject
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
			MessageEvent.Reject,
			updatedValue
		);
	},
});
</script>

<style scoped lang="scss">
.admin-multiple-status {
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
