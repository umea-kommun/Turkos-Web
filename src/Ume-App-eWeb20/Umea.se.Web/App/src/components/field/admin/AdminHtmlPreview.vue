<template>
	<div class="admin-html-preview">
		<base-form-field :id="'label' + id" :labelFor="id" :label="label">
			<div class="field">
				<div class="click-helpText">
					<v-btn v-if="clickable" @click="emit('click')">
						<v-icon size="20" icon="edit" />
						{{
							$t('component.AdminHtmlPreview.edit', [
								props.labelInButton ? label?.toLowerCase() : '',
							])
						}}
					</v-btn>
				</div>
				<div class="field__content" v-html="modelValue"></div>
			</div>
			<HelpText :helpText="helpText" :getValidationId="id" />
		</base-form-field>
	</div>
</template>

<script setup lang="ts">
import HelpText from '@/components/field/helpAndError/HelpAndErrorText.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';

const props = defineProps({
	id: { type: String, required: true },
	modelValue: {
		type: String,
		required: true,
	},
	label: String,
	helpText: String,
	textArea: {
		type: Boolean,
		default: false,
	},
	clickable: {
		type: Boolean,
		default: true,
	},
	labelInButton: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['click']);
</script>

<style scoped lang="scss">
.admin-html-preview {
	.click-helpText {
		position: sticky;
		height: 0;
		top: 0;
		text-align: right;

		.v-btn {
			color: $grey-darken-2;
			text-transform: none;
			.v-icon {
				margin-right: 6px;
			}
		}
	}
	.field {
		position: relative;
		background-color: #f6f6f6;
		resize: vertical;
		overflow: auto;
		height: 150px;
		padding: 10px 8px 8px;
		border-radius: 4px 4px 0 0;
		border-bottom: solid 1px #a5a5a5;

		:deep(ul) {
			padding-left: 24px;
		}
		:deep(ol) {
			padding-left: 24px;
		}
	}
}
</style>
