<template>
	<div class="admin-text-box">
		<Field
			:name="props.name ?? 'name' + id"
			:label="label"
			v-model="value"
			v-slot="{ field, errors }"
			:rules="rules"
			:keepValue="true"
		>
			<base-form-field
				:id="'label' + id"
				:labelFor="id"
				:label="label"
				:is-required="rules.indexOf('required') > -1"
			>
				<v-text-field
					v-if="!textArea"
					v-bind="field"
					:id="id"
					density="compact"
					color="primary"
					aria-autocomplete="both"
					aria-haspopup="false"
					:disabled="disabled"
					single-line
					:prefix="prefix"
					:placeholder="placeholder"
					:error="!!errors.length"
					@input="emit('input')"
					@focus="setActiveInput"
				/>
				<v-textarea
					v-else
					v-bind="field"
					:id="id"
					density="compact"
					color="primary"
					aria-autocomplete="both"
					aria-haspopup="false"
					:disabled="disabled"
					:prefix="prefix"
					:placeholder="placeholder"
					:error="!!errors.length"
					@input="emit('input')"
					@focus="setActiveInput"
				/>
				<HelpText
					:helpText="helpText"
					:getValidationId="id"
					:errors="errorMessage ? [...errors, errorMessage] : errors"
				/>
			</base-form-field>
		</Field>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Field } from 'vee-validate';
import HelpText from '@/components/field/helpAndError/HelpAndErrorText.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import { useStore } from 'vuex';
import { MutationType } from '@/models/Enums';

const store = useStore();

const props = defineProps({
	id: { type: String, required: true },
	name: String,
	modelValue: {
		type: String,
		required: true,
	},
	label: String,
	helpText: String,
	rules: {
		type: String,
		default: '',
	},
	textArea: {
		type: Boolean,
		default: false,
	},
	prefix: {
		type: String,
		default: '',
	},
	placeholder: {
		type: String,
		default: '',
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	errorMessage: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['update:modelValue', 'input']);

const setActiveInput = (event: FocusEvent): void => {
	store.commit(
		MutationType.SetActiveInput,
		event.target as HTMLTextAreaElement
	);
};

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
.admin-text-box {
	:deep(.v-input .v-field__field) {
		--v-input-padding-top: 5px;
	}
	:deep(.v-input__details) {
		display: none;
	}

	.v-text-field--prefixed {
		:deep(.v-field__field input) {
			padding-left: 0 !important;
		}

		:deep(.v-text-field__prefix) {
			opacity: 1;
			min-height: auto;
			padding-left: 8px;
		}
		:deep(.v-text-field__prefix__text) {
			margin: 0;
		}
	}
}
</style>
