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
			v-bind="$attrs"
			type="text"
			:readonly="props.readonly"
			:required="props.required"
			v-model="computedValue"
			:aria-invalid="props.error"
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
import { computed } from 'vue';

/**
 * This is a replacement for v-text-field (from vuetify) to solve accessability issues
 */
const props = defineProps({
	value: String,
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
	get: () => props.modelValue ?? props.value ?? '',
	set: (newValue: string) => emit('update:modelValue', newValue),
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
