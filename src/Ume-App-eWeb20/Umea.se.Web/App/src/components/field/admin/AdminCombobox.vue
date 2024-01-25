<template>
	<div class="admin-combobox">
		<Field
			:name="props.name ?? 'name' + id"
			:label="label"
			v-model="value"
			v-slot="{ errors }"
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
				<v-combobox
					:id="id"
					density="compact"
					:color="errors?.length ? 'error' : 'primary'"
					v-model="value"
					multiple
					chips
					aria-autocomplete="both"
					aria-haspopup="false"
				>
					<template v-slot:chip="{ item }">
						<v-chip closable @click:close="removeItem(item)">
							{{ item.title }}
						</v-chip>
					</template>
				</v-combobox>
				<HelpText
					:helpText="helpText"
					:getValidationId="id"
					:errors="errors"
				/>
			</base-form-field>
		</Field>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import HelpText from '@/components/field/helpAndError/HelpAndErrorText.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import { Field } from 'vee-validate';

const props = defineProps({
	id: { type: String, required: true },
	modelValue: {
		type: Array as PropType<string[]>,
		required: true,
	},
	label: String,
	helpText: String,
	name: String,
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

const value = computed({
	get: () => {
		return props.modelValue;
	},
	set: (newValue: string[]) => {
		emit('update:modelValue', newValue);
	},
});

const removeItem = (item: any): void => {
	value.value = value.value.filter((text) => text !== item.value);
};
</script>

<style scoped lang="scss">
.admin-combobox {
	:deep(.v-input .v-field__field) {
		--v-input-padding-top: 5px;
	}
	:deep(.v-input__details) {
		display: none;
	}

	:deep(.v-field__input) {
		align-items: center;
		padding-bottom: 0;
		padding-left: 0;

		.v-combobox__selection .v-chip {
			margin-left: 8px;
		}

		input {
			padding-left: 8px;
		}
	}
}
</style>
