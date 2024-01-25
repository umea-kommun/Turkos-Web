<template>
	<div>
		<v-row>
			<v-col>
				<admin-text-box
					id="email-subject"
					v-model="subject"
					:label="
						$t(
							'component.adminIntegrationEmailNotification.subject'
						)
					"
					:placeholder="
						$t(
							'component.adminIntegrationEmailNotification.subjectPlaceholder'
						)
					"
				/>
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
	</div>
</template>

<script setup lang="ts">
import AdminHtmlPreview from '@/components/field/admin/AdminHtmlPreview.vue';
import BaseHtmlEditorModal from '@/components/base/BaseHtmlEditorModal.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import { IFormIntegration, IFormIntegrationOption } from '@/models/IForm';
import { computed, PropType, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	modelValue: {
		type: Object as PropType<IFormIntegration>,
		required: true,
	},
});

const emit = defineEmits(['update:modelValue']);
const { t } = useI18n();

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

onMounted(() => {
	if (!getOption('title')?.value) {
		setOption(
			'title',
			t('component.adminIntegrationEmailNotification.name')
		);
	}
});

const subject = computed({
	get: () => getOption('subject')?.value ?? '',
	set: (newValue: string) => setOption('subject', newValue),
});

const body = computed({
	get: () => getOption('body')?.value ?? '',
	set: (newValue: string) => setOption('body', newValue),
});

const dialog = ref<InstanceType<typeof BaseHtmlEditorModal> | null>(null);
function showHtmlEditor(id: string, value: string): void {
	dialog.value?.open(id, value);
}

const isValid = computed(() => {
	// Validate integration here

	return true;
});

defineExpose({ isValid });
</script>

<style scoped lang="scss"></style>
