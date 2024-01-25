<template>
	<div class="component-base-form-field">
		<div v-if="!isRadioGroup">
			<!-- 
				This div, wrapping the label element, is important for
				the table field (used to calculate height of label)
			-->
			<label
				v-if="titleSize === 'small' && (label || adminPreviewLabel)"
				class="text-subtitle-1 field-title-label"
				:for="labelFor"
				:id="id"
				:class="errorDisplay ? 'validation-failed' : ''"
			>
				{{ label }}
				<span
					v-if="labelSuffix"
					class="label-suffix"
					aria-hidden="true"
				>
					{{ labelSuffix }}
				</span>
				<span
					v-if="!label && adminPreviewLabel"
					class="label-admin-placeholder"
					>{{ adminPreviewLabel }}</span
				>
				<span
					v-if="isRequired && label"
					:aria-label="
						$t(
							'component.adminValidationManager.validation.types.required'
						)
					"
					>*</span
				>
				<v-spacer></v-spacer>
				<slot name="addLink" />
			</label>
		</div>
		<BaseTitle v-if="titleSize !== 'small'" :title="label"></BaseTitle>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import BaseTitle from '@/components/base/BaseTitle.vue';

/**
 * Component used to display arbitrary form elements provided by veutify.
 * It is specialized to display any type of veutify form input in the
 * manner we want
 */

defineProps({
	/**
	 * Label text
	 */
	label: String,
	/**
	 * Id of the input provided in the slot. Will be used
	 * to connect the label-element to the input
	 */
	labelFor: String,
	/**
	 * Should the label display that this input has a validation error
	 */
	errorDisplay: Boolean,
	isRequired: Boolean,
	isRadioGroup: {
		type: Boolean,
		default: false,
	},
	id: String,
	titleSize: {
		type: String,
		default: 'small',
	},
	adminPreviewLabel: {
		type: [String, Boolean],
		default: '',
	},
	labelSuffix: String,
});
</script>

<style lang="scss">
// This css won't have effect if the styling is scoped!!!
.component-base-form-field {
	label {
		display: flex !important;
		align-items: center !important;
	}
	.label-suffix {
		margin-left: 4px;
		color: $grey-darken-1;
	}

	.label-admin-placeholder {
		color: $grey-darken-1;
	}

	// All inputs
	.v-input {
		margin-top: 0 !important;
		padding-top: 0 !important;
		input {
			padding: 8px 8px 14px !important;
			max-height: 40px;
		}
		i {
			margin-top: 2px;
		}
	}

	.v-input__slot {
		background-color: rgba(0, 0, 0, 0.06);
		border-top: 0;
		padding-top: 5px;
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
	}

	// help text
	.v-messages__message,
	.v-messages {
		display: contents;
	}

	// Textarea
	.v-textarea textarea {
		padding-left: 8px;
		padding-right: 8px;
	}

	// Radio buttons / checkboxes
	.v-checkbox,
	.v-radio-group {
		background: none;
		.v-label {
			padding: 0;
			color: $black;
			--v-medium-emphasis-opacity: 1;
		}
	}

	.v-input--checkbox:last-child .v-input__slot {
		padding-bottom: 15px;
	}

	.v-input--radio-group .v-input__control {
		padding: 0;
	}

	.v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
		margin-bottom: 0;
		padding-bottom: 0;
	}

	// Label
	label {
		border-top: 0;
		padding: 8px 0px 3px;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		width: 100%;
		display: block;
		&.validation-failed {
			color: $error;
		}
	}

	.title {
		margin-top: 15px;
	}
}

form div:first-child .component-base-form-field label {
	padding-top: 0;
}
</style>
