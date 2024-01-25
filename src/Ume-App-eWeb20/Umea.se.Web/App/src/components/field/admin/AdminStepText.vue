<template>
	<div class="admin-step-text" :class="{ 'has-content': !!value.length }">
		<label :for="id">{{ label }}</label>
		<input
			v-if="!textArea"
			:id="id"
			type="text"
			v-model="value"
			@focus="emit('focus')"
		/>
		<textarea
			v-else
			:id="id"
			v-model="value"
			:rows="5"
			@focus="emit('focus')"
		></textarea>
		<HelpText :helpText="helpText" :getValidationId="id" />
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import HelpText from '@/components/field/helpAndError/HelpAndErrorText.vue';

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
});

const emit = defineEmits(['update:modelValue', 'focus']);

const value = computed({
	get: () => {
		return props.modelValue;
	},
	set: (newValue: string) => {
		emit('update:modelValue', newValue);
	},
});
</script>

<style scoped lang="scss">
.admin-step-text {
	position: relative;
	margin-bottom: 30px;

	label {
		position: absolute;
		transform: translate(16px, 16px);
		transition: all 0.2s ease;
		color: $grey-darken-1;
		pointer-events: none;
	}

	&:focus-within,
	&.has-content {
		label {
			transform: translate(12px, -60%);
			font-size: size(14);
			background-color: #f2f2f2;
			padding: 0 6px;
		}
	}
	&:focus-within label {
		color: $grey-darken-3;
	}

	input,
	textarea {
		color: rgba(0, 0, 0, 0.87);
		width: 100%;
		padding: 16px;
		border-radius: $border-radius;
		outline: dashed 2px $grey-lighten-5;
		transition: outline 0.15s ease;

		&:focus {
			outline-color: $grey-darken-2;
			outline-width: 2px;
		}
	}
	textarea {
		min-height: 150px;
	}

	:deep(.help-and-error-wrap) {
		--v-medium-emphasis-opacity: 0.8;
	}
}
</style>
