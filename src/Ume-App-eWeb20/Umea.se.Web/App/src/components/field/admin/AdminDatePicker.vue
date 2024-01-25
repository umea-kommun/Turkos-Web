<template>
	<div class="admin-date-picker">
		<Field
			:name="id"
			:label="label"
			v-model="value"
			:keepValue="true"
			v-slot="{ field, errors }"
			:rules="validationRules"
		>
			<base-form-field
				:id="'label' + id"
				:labelFor="id"
				:label="label"
				:is-required="required"
			>
				<t-date-picker
					ref="datepicker"
					:id="id"
					v-bind="field"
					:aria-labelledby="'label' + id"
					:aria-describedby="!!errors.length ? 'error-' + id : null"
					:min="minDate ? minDate : DEFAULT_MIN_DATE"
					:max="maxDate ? maxDate : DEFAULT_MAX_DATE"
					:is-required="required"
					:type="type"
				/>

				<HelpText
					:helpText="helpText"
					:getValidationId="id"
					:errors="errors"
				>
				</HelpText>
			</base-form-field>
		</Field>
	</div>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue';
import HelpText from '@/components/field/helpAndError/HelpAndErrorText.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import { TDatePicker } from '@turkos/components';
import { Field } from 'vee-validate';
import { ValidationRuleType } from '@/models/Enums';
import Config from '@/utils/Config';

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
	minDate: String,
	maxDate: String,
	required: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String as PropType<'date' | 'datetime-local'>,
	},
});

const emit = defineEmits(['update:modelValue']);

const DEFAULT_MIN_DATE = Config.VUE_APP_FIELD_DEFAULT_MIN_DATE;
const DEFAULT_MAX_DATE = Config.VUE_APP_FIELD_DEFAULT_MAX_DATE;

const value = computed({
	get: () => {
		return props.modelValue;
	},
	set: (newValue: string) => {
		emit('update:modelValue', newValue);
	},
});

const datepicker = ref<{ valid: boolean } | null>(null);

const validationRules = computed(() => {
	const rules = [
		props.type === 'datetime-local' ? 'validDateTime' : 'validDate',
		`${ValidationRuleType.MinDate}:${props.minDate ?? DEFAULT_MIN_DATE}`,
		`${ValidationRuleType.MaxDate}:${props.maxDate ?? DEFAULT_MAX_DATE}`,
	];
	if (datepicker?.value?.valid === false) {
		rules.push(
			props.type === 'datetime-local' ? 'invalidDateTime' : 'invalidDate'
		);
		return rules.join('|');
	} else {
		if (props.required) {
			rules.push(ValidationRuleType.Required);
		}
		return rules.join('|');
	}
});
</script>

<style scoped lang="scss"></style>
