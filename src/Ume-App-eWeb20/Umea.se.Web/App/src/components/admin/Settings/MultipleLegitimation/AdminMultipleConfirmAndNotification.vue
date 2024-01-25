<template>
	<div class="admin-confirm-and-notification ml-4 mt-10">
		<!-- Send -->
		<v-row>
			<v-col cols="12">
				<h2>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.sendTitle'
						)
					}}
				</h2>
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.sendDescription'
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
					id="email-subject-send"
					v-model="emailSubjectSend"
				/>
				<base-html-editor v-model="emailSend" />
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
					id="sms-send"
					v-model="smsSend"
					:textArea="true"
				/>
			</v-col>
		</v-row>
		<hr class="mt-15 mb-10" />

		<!-- Send_second -->
		<v-row>
			<v-col cols="12">
				<h2>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.sendSecondTitle'
						)
					}}
				</h2>
				<p>
					{{
						$t(
							'component.adminForm.userRequirements.multipleLegitimation.messageTextsModal.sendSecondDescription'
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
					id="email-subject-send-second"
					v-model="emailSubjectSendSecond"
				/>
				<base-html-editor v-model="emailSendSecond" />
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
					id="sms-send-second"
					v-model="smsSendSecond"
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

const emailSubjectSend = computed({
	get: () => {
		const subjectText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Send
		);
		return HelperAdmin.getReplaceVariablesInMessageText(subjectText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Send,
			updatedValue
		);
	},
});

const emailSend = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Send
		);
		return HelperAdmin.getReplaceVariablesInMessageText(messageText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Send,
			updatedValue
		);
	},
});

const emailSubjectSendSecond = computed({
	get: () => {
		const subjectText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Send_second
		);
		return HelperAdmin.getReplaceVariablesInMessageText(subjectText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Subject,
			Medium.Email,
			MessageEvent.Send_second,
			updatedValue
		);
	},
});

const emailSendSecond = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Send_second
		);
		return HelperAdmin.getReplaceVariablesInMessageText(messageText);
	},
	set: (value: string) => {
		const updatedValue =
			HelperAdmin.setReplaceVariablesInMessageText(value);
		HelperAdmin.updateMessageTexts(
			MessageTextAttribute.Message,
			Medium.Email,
			MessageEvent.Send_second,
			updatedValue
		);
	},
});

const smsSend = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Send
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
			MessageEvent.Send,
			updatedValue
		);
	},
});

const smsSendSecond = computed({
	get: () => {
		const messageText = HelperAdmin.getMessageTexts(
			MessageTextAttribute.Message,
			Medium.Sms,
			MessageEvent.Send_second
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
			MessageEvent.Send_second,
			updatedValue
		);
	},
});
</script>

<style scoped lang="scss">
.admin-confirm-and-notification {
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
