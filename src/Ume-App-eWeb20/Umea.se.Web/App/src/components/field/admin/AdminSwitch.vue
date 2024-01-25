<template>
	<div class="admin-switch" :class="{ active: modelValue, checkbox }">
		<span v-if="checkbox">
			<v-checkbox
				v-model="value"
				:label="label"
				color="primary"
				:hide-details="hideDetails"
			/>
		</span>
		<span v-else>
			<div class="label-wrap">
				<label :for="id">{{ label }}</label>
				<span class="help-text">{{ helpText }}</span>
			</div>

			<div v-if="showButton">
				<v-btn v-if="value" @click="value = false" flat color="error">{{
					$t('component.AdminSwitch.deactivate')
				}}</v-btn>
				<v-btn v-else flat @click="value = true" color="primary">
					{{ $t('component.AdminSwitch.activate') }}
				</v-btn>
			</div>
			<v-switch
				v-else
				:aria-checked="value"
				:id="id"
				v-model="value"
				:title="modelValue ? 'Aktiverad' : 'Ej aktiverad'"
				role="switch"
				:hide-details="hideDetails"
			/>
		</span>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	id: { type: String, required: true },
	modelValue: {
		type: Boolean,
		required: true,
	},
	label: String,
	helpText: String,
	showButton: {
		type: Boolean,
		default: false,
	},
	checkbox: {
		type: Boolean,
		default: false,
	},
	hideDetails: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
	get: () => {
		return props.modelValue;
	},
	set: (newValue: boolean) => {
		emit('update:modelValue', newValue);
	},
});
</script>

<style scoped lang="scss">
.admin-switch {
	margin-bottom: 10px;
	> span {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&.checkbox {
		justify-content: flex-start;
		> span {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-start;
		}
		:deep(.v-selection-control) {
			width: 100%;
			label {
				white-space: pre-wrap;
			}
		}
	}
	.label-wrap {
		display: flex;
		flex-direction: column;
		flex: 1;
		label {
			padding-right: 20px;
			font-size: size(16);
		}

		.help-text {
			opacity: 0.8;
			font-size: size(14);
			padding-right: 20px;
		}
	}

	:deep(.v-switch .v-input__details) {
		display: none;
	}

	.v-input {
		flex: inherit;

		:deep(.v-switch__track) {
			opacity: 1;
			background-color: $grey-lighten-5;
		}
	}

	&.active {
		:deep(.v-input .v-switch__track) {
			background-color: $primary;
		}
	}
}
</style>
