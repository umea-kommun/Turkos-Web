<template>
	<div class="admin-section-field-options">
		<!-- Title -->
		<admin-text-box
			:id="'title-' + id"
			v-model="title"
			:label="$t('app.admin.field.title')"
			:help-text="$t('app.admin.field.titleHelpText')"
		/>

		<!-- Text -->
		<admin-html-preview
			:id="id + '-value'"
			v-model="value"
			:label="$t('component.fieldSection.text')"
			:help-text="$t('component.fieldSection.textHelpText')"
			:text-area="true"
			:readonly="true"
			:label-in-button="false"
			@click="showValueEditor('value-editor', value)"
		/>
		<base-html-editor-modal
			ref="valueDialog"
			:title="$t('component.fieldSection.text')"
			@updated-value="({ htmlText }) => (value = htmlText)"
			:allow-images="true"
			:step-id="currentStepId"
			:field-id="props.field.id.toString()"
		/>

		<!-- Extra text -->
		<admin-html-preview
			:id="id + '-helpText'"
			v-model="helpText"
			:label="$t('component.fieldSection.extraText')"
			:help-text="$t('component.fieldSection.extraTextHelpText')"
			:text-area="true"
			:readonly="true"
			:label-in-button="false"
			@click="showHelpTextEditor('help-text-editor', helpText)"
		/>
		<base-html-editor-modal
			ref="helpTextDialog"
			:title="$t('component.fieldSection.extraText')"
			@updated-value="({ htmlText }) => (helpText = htmlText)"
			:allow-images="true"
			:step-id="currentStepId"
			:field-id="props.field.id.toString()"
		/>
	</div>
</template>

<script setup lang="ts">
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import BaseHtmlEditorModal from '@/components/base/BaseHtmlEditorModal.vue';
import AdminHtmlPreview from '@/components/field/admin/AdminHtmlPreview.vue';
import { useSingleValueField } from '@/components/field/composable/SingleValueField';
import { FormMode } from '@/models/Enums';
import { IRootState, ISingleValueField } from '@/models/IForm';
import { PropType, toRef, computed, ref } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
	field: {
		type: Object as PropType<ISingleValueField>,
		required: true,
	},
});

const emit = defineEmits(['updatedValue']);
const store = useStore<IRootState>();

const { id, helpText, title, storeUpdateFormField } = useSingleValueField({
	mode: FormMode.Admin,
	field: toRef(props, 'field'),
	emit,
});

const currentStepId = computed(() => {
	if (store.state.form && store.state.admin?.activeStep) {
		return store.state.form?.attributes.steps[
			store.state.admin.activeStep - 1
		]?.id?.toString();
	}
	return undefined;
});

const value = computed({
	get: () => {
		return props.field ? (props.field.value ? props.field.value : '') : '';
	},
	set: (newValue: string) => {
		storeUpdateFormField(newValue, 'value');
	},
});

const valueDialog = ref<InstanceType<typeof BaseHtmlEditorModal> | null>(null);
function showValueEditor(id: string, value: string): void {
	valueDialog.value?.open(id, value);
}

const helpTextDialog = ref<InstanceType<typeof BaseHtmlEditorModal> | null>(
	null
);
function showHelpTextEditor(id: string, value: string): void {
	helpTextDialog.value?.open(id, value);
}
</script>

<style scoped lang="scss">
.admin-section-field-options {
	padding: 10px 24px;
}
</style>
