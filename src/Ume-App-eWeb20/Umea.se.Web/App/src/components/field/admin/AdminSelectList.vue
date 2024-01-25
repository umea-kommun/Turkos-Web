<template>
	<div class="admin-select-list">
		<Field
			:name="props.name ?? 'name' + id"
			:label="label"
			v-model="value"
			v-slot="{ field, errors }"
			type="select"
			:rules="rules"
			:keepValue="true"
			:standalone="props.standalone"
		>
			<base-form-field
				:id="'label' + id"
				:labelFor="id"
				:label="label"
				:is-required="rules.indexOf('required') > -1"
			>
				<template v-slot:addLink>
					<slot name="addLink" />
				</template>
				<v-select
					:id="id"
					ref="selectRef"
					v-model="value"
					v-bind="field"
					density="compact"
					:color="
						props.errorMessages?.length || errors?.length
							? 'error'
							: 'primary'
					"
					:items="items"
					:item-title="itemTitle"
					:item-value="itemValue"
					:multiple="multiple"
					:chips="multiple"
					:disabled="disabled"
					:loading="!!loading"
					:menu-props="{
						maxHeight: '300',
						contentClass: 'v-select-menu-content',
					}"
				>
					<template v-slot:append-inner>
						<slot name="append-inner"></slot>
					</template>
					<template v-if="slots.item" v-slot:item="{ item }">
						<slot
							name="item"
							:item="item"
							:select="selectItem"
						></slot>
					</template>
				</v-select>
				<HelpText
					:helpText="helpText"
					:getValidationId="id"
					:errors="[...props.errorMessages, ...errors]"
				/>
			</base-form-field>
		</Field>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType, ref, useSlots } from 'vue';
import { Field } from 'vee-validate';
import HelpText from '@/components/field/helpAndError/HelpAndErrorText.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';

const props = defineProps({
	id: { type: String, required: true },
	name: String,
	modelValue: [Number, String, Array],
	items: {
		type: Array,
		required: true,
	},
	label: String,
	helpText: String,
	itemTitle: {
		type: String,
		default: 'title',
	},
	itemValue: {
		type: String,
		default: 'value',
	},
	multiple: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	errorMessages: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
	rules: {
		type: String,
		default: '',
	},
	standalone: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['update:modelValue']);

const slots = useSlots();

const value = computed({
	get: () => {
		return props.modelValue;
	},
	set: (newValue: string | number | unknown[] | undefined) => {
		emit('update:modelValue', newValue);
	},
});

const selectRef = ref();
const selectItem = (item: unknown): void => {
	selectRef.value?.select(item);
};
</script>

<style scoped lang="scss">
.admin-select-list {
	:deep(.v-input .v-field__field) {
		--v-input-padding-top: 5px;
	}
	:deep(.v-field__input) {
		padding: 3px 2px 2px;
		min-height: 45px;
	}
	:deep(.v-input__details) {
		display: none;
	}

	:deep(.v-select--chips) {
		.v-field__input {
			padding-top: 5px;
			padding-bottom: 4px;
			min-height: 45px;
			align-items: center;
		}
		.v-select__selection {
			margin: 0;
			margin-left: 8px;
			padding: 2px !important;
		}
	}
}
</style>
