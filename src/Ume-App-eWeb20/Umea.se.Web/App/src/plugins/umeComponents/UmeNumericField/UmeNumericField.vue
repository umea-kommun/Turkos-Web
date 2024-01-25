<template>
	<div
		class="ume-text-field ume-input"
		:class="{
			error,
			'append-inner-icon': !!appendInnerIcon,
			'prepend-inner-icon': !!prependInnerIcon,
			'variant-underlined': variant === 'underlined',
		}"
	>
		<div
			v-if="prependInnerIcon"
			class="prepend-inner-icon"
			aria-hidden="true"
		>
			<v-icon :icon="prependInnerIcon" :size="24" />
		</div>
		<input
			ref="numericField"
			type="number"
			v-bind="$attrs"
			:readonly="props.readonly"
			:required="props.required"
			v-model="computedValue"
			:aria-invalid="props.error"
			@input="checkValid"
			@keyup="checkValid"
			@blur="checkValid"
		/>
		<div
			v-if="appendInnerIcon"
			class="append-inner-icon"
			aria-hidden="true"
		>
			<v-icon :icon="appendInnerIcon" :size="24" />
		</div>
		<div class="border-bottom"></div>
	</div>
</template>

<script lang="ts">
export default {
	inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
	value: [String, Number],
	modelValue: String,
	error: {
		type: Boolean,
		default: false,
	},
	readonly: {
		type: Boolean,
		default: false,
	},
	required: {
		type: Boolean,
		default: false,
	},
	appendInnerIcon: String,
	prependInnerIcon: String,
	variant: String,
});

const emit = defineEmits(['update:modelValue']);

const computedValue = computed({
	get: () => props.modelValue ?? props.value?.toString() ?? '',
	set: (newValue: string) => emit('update:modelValue', newValue),
});

const numericField = ref<HTMLInputElement>();
const valid = ref<boolean>(true);
const checkValid = (): void => {
	const validity = numericField.value?.validity;
	if (validity) {
		if (!validity.badInput && validity.valueMissing) {
			valid.value = true; // Field is empty, so its valid
		} else {
			valid.value = validity.valid;
		}
	} else {
		valid.value = true;
	}
};

defineExpose({
	valid,
});
</script>

<style scoped lang="scss">
.ume-text-field {
	input {
		&:placeholder-shown {
			text-overflow: ellipsis;
		}
	}
}
</style>
