<template>
	<div class="help-and-error-wrap" aria-live="polite">
		<!-- Help text -->
		<div class="v-messages theme--light" v-if="helpText && !errors.length">
			<div class="v-messages__wrapper">
				<!-- No icon if valid for now -->
				<!-- <v-icon
					v-if="!!errors.length == false && fieldValid"
					class="icon_check
					icon="check_circle"
					aria-hidden="true"
				/> -->
				<div class="v-messages__message v-messages__message-help">
					{{ helpText }}
				</div>
			</div>
		</div>

		<!-- Error message -->
		<div class="v-messages input-group__details" v-if="!!errors.length">
			<div class="v-messages__wrapper v-messages__wrapper-error">
				<v-icon
					class="icon_warning"
					icon="warning"
					aria-hidden="true"
				/>
				<span
					:id="'error-' + getValidationId"
					class="input-group__messages input-group__error text-error"
				>
					{{ errors[0] }}
				</span>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
defineProps({
	helpText: {
		type: String,
		default: '',
	},
	errors: {
		type: Array,
		default() {
			return [];
		},
	},
	getValidationId: String,
	fieldValid: {
		type: Boolean,
		default: false,
	},
});
</script>
<style scoped lang="scss">
.help-and-error-wrap {
	margin-bottom: size(16);
}
.v-messages {
	font-size: size(14);

	&__wrapper {
		opacity: 0.8;
		padding-top: size(6);
		display: flex;
		align-items: center;

		&-error {
			opacity: 1;
		}
	}

	&__message {
		display: contents;
	}
	&.input-group__details {
		opacity: 1;
	}

	.v-icon {
		--v-medium-emphasis-opacity: 1;
		font-size: size(20);
		margin-right: 8px;

		&.icon_check {
			color: $success;
		}
		&.icon_warning {
			color: $error;
		}
	}
}
</style>
