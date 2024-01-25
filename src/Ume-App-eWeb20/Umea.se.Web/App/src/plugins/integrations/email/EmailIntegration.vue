<template>
	<div>
		<v-row>
			<v-col>
				<admin-text-box
					id="email-title"
					name="email-title"
					v-model="title"
					:label="$t('component.adminIntegrationEmail.field.title')"
					:help-text="
						$t(
							'component.adminIntegrationEmail.field.titleHelpText'
						)
					"
					rules="required"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-text-box
					id="email-subject"
					name="email-subject"
					v-model="subject"
					:label="$t('component.adminIntegrationEmail.field.subject')"
					:help-text="
						$t(
							'component.adminIntegrationEmail.field.subjectHelpText'
						)
					"
					rules="required"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-combobox
					id="email-senders"
					name="email-senders"
					v-model="senders"
					:label="$t('component.adminIntegrationEmail.field.sender')"
					:help-text="
						$t(
							'component.adminIntegrationEmail.field.senderHelpText'
						)
					"
					rules="required"
					:standalone="false"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-combobox
					id="email-receiver"
					name="email-receiver"
					v-model="receivers"
					:label="
						$t('component.adminIntegrationEmail.field.receiver')
					"
					:help-text="
						$t(
							'component.adminIntegrationEmail.field.receiverHelpText'
						)
					"
					:standalone="false"
				/>
			</v-col>
			<v-col>
				<admin-select-list
					id="email-formFieldReceivers"
					name="email-formFieldReceivers"
					v-model="formFieldReceivers"
					:items="formTextFields"
					item-value="guid"
					:label="
						$t(
							'component.adminIntegrationEmail.field.formFieldReceivers'
						)
					"
					:help-text="
						$t(
							'component.adminIntegrationEmail.field.formFieldReceiversHelpText'
						)
					"
					:multiple="true"
					:standalone="false"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<!-- Hidden input field to validate receiver and formFieldReceiver -->
				<Field
					name="email-receiver-tab-0"
					:label="
						$t('component.adminIntegrationEmail.field.receiver')
					"
					:rules="
						'requiredOneOf:' +
						$t(
							'component.adminIntegrationEmail.field.formFieldReceivers'
						)
					"
					:model-value="
						[...receivers, ...formFieldReceivers].join('')
					"
					as=""
					v-slot="{ errors }"
					:keep-value="true"
				>
					<HelpAndErrorText id="any-receiver" :errors="errors" />
				</Field>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-html-preview
					:id="'eService-description'"
					v-model="body"
					:label="
						$t('component.adminIntegrationEmailNotification.body')
					"
					:text-area="true"
					:readonly="true"
					@click="showHtmlEditor('description-editor', body)"
				/>
				<base-html-editor-modal
					ref="dialog"
					:title="
						$t('component.adminIntegrationEmailNotification.body')
					"
					@updated-value="({ htmlText }) => (body = htmlText)"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-switch
					id="attachFiles"
					v-model="attachFiles"
					:label="
						$t('component.adminIntegrationEmail.field.attachFiles')
					"
					:checkbox="true"
				/>
			</v-col>
		</v-row>
	</div>
</template>

<script setup lang="ts">
import AdminCombobox from '@/components/field/admin/AdminCombobox.vue';
import AdminHtmlPreview from '@/components/field/admin/AdminHtmlPreview.vue';
import BaseHtmlEditorModal from '@/components/base/BaseHtmlEditorModal.vue';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import { FormFieldType } from '@/models/Enums';
import {
	IFormField,
	IFormIntegration,
	IFormIntegrationOption,
	IRootState,
} from '@/models/IForm';
import { computed, PropType, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Config from '@/utils/Config';
import { Field } from 'vee-validate';
import HelpAndErrorText from '@/components/field/helpAndError/HelpAndErrorText.vue';

const props = defineProps({
	modelValue: {
		type: Object as PropType<IFormIntegration>,
		required: true,
	},
	isNew: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue']);

const store = useStore<IRootState>();

const integration = computed({
	get: () => props.modelValue,
	set: (newValue: IFormIntegration) => {
		emit('update:modelValue', newValue);
	},
});

const getOption = (key: string): IFormIntegrationOption | undefined =>
	integration.value.options.find((option) => option.key === key);

const setOption = (key: string, value: string): void => {
	const option = getOption(key);
	if (option) {
		option.value = value;
	} else {
		integration.value.options.push({ key, value });
	}
};

const title = computed({
	get: () => getOption('title')?.value ?? '',
	set: (newValue: string) => setOption('title', newValue),
});

const subject = computed({
	get: () => getOption('subject')?.value ?? '',
	set: (newValue: string) => setOption('subject', newValue),
});

const attachFiles = computed({
	get: () => getOption('attachFiles')?.value === 'true',
	set: (newValue: boolean) => setOption('attachFiles', newValue.toString()),
});

const body = computed({
	get: () => getOption('body')?.value ?? '',
	set: (newValue: string) => setOption('body', newValue),
});
const dialog = ref<InstanceType<typeof BaseHtmlEditorModal> | null>(null);
function showHtmlEditor(id: string, value: string): void {
	dialog.value?.open(id, value);
}

const senders = computed({
	get: () => {
		const senders = integration.value?.options.filter(
			(opt) => opt.key === 'sender'
		);
		if (senders) {
			return senders.map((opt) => opt.value);
		}
		return [];
	},
	set: (newValue: string[]) => {
		const otherOptions = integration.value?.options.filter(
			(opt) => opt.key !== 'sender'
		);
		const senderOptions = newValue.map((value) => ({
			key: 'sender',
			value,
		}));

		integration.value.options = [...otherOptions, ...senderOptions];
	},
});

const receivers = computed({
	get: () => {
		const receivers = integration.value?.options.filter(
			(opt) => opt.key === 'receiver'
		);
		if (receivers) {
			return receivers.map((opt) => opt.value);
		}
		return [];
	},
	set: (newValue: string[]) => {
		const otherOptions = integration.value?.options.filter(
			(opt) => opt.key !== 'receiver'
		);
		const receiverOptions = newValue.map((value) => ({
			key: 'receiver',
			value,
		}));

		integration.value.options = [...otherOptions, ...receiverOptions];
	},
});

const formFieldReceivers = computed({
	get: () => getOption('formFieldReceivers')?.data ?? [],
	set: (newValue: string[]) => {
		const option = getOption('formFieldReceivers');
		if (option) {
			option.data = newValue;
		} else {
			integration.value.options.push({
				key: 'formFieldReceivers',
				value: '',
				data: newValue,
			});
		}
	},
});

const formTextFields = computed(() => {
	const temp: IFormField[] = [];
	store.state.form?.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			if (
				field.type.toLowerCase() === FormFieldType.TextBox.toLowerCase()
			) {
				temp.push(field);
			}
		});
	});
	return temp;
});

const isValid = computed(() => {
	// Validate integration here

	return true;
});

const defaultSender = Config.VUE_APP_EMAIL_ADDRESS_SENDER;

onMounted(() => {
	if (props.isNew) {
		// Set default options for new integration
		const defaultOptions: IFormIntegrationOption[] = [
			{ key: 'title', value: '' },
			{ key: 'subject', value: '' },
			{ key: 'sender', value: defaultSender },
			{ key: 'formFieldReceivers', value: '', data: [] },
			{ key: 'attachFiles', value: 'false' },
			{ key: 'body', value: '' },
		];

		integration.value = { ...integration.value, options: defaultOptions };
	}
});

defineExpose({ isValid });
</script>

<style scoped lang="scss"></style>
