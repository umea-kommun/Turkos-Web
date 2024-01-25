<template>
	<div class="form-validation-summary" v-if="errorCount > 0">
		<v-alert
			type="error"
			variant="outlined"
			:value="true"
			transition="slide-y-transition"
		>
			<!-- Empty link used to place focus -->
			<base-screen-reader
				:aria-role="AriaRole.Alert"
				:visible-on-screen="true"
			>
				<a href="#" aria-hidden="true" tabindex="-1"></a>
				<label class="field-title body-2">
					<span
						>{{
							$tc(
								'component.formValidationSummary.error',
								errorCount,
								{ count: errorCount }
							)
						}}.
					</span>
					<span aria-hidden="true"
						>{{
							$t('component.formValidationSummary.resolution')
						}}.</span
					>
				</label>
				<ul>
					<template v-for="(error, id) in validationErrors">
						<li
							v-if="typeof error === 'string'"
							:key="'validationerror' + id"
						>
							<a :href="'#' + formatId(id)">{{ error }}</a>
						</li>
						<template
							v-else
							v-for="msg in error"
							:key="'validationerror' + msg"
						>
							<li>
								<a :href="'#' + formatId(id)">{{ msg }}</a>
							</li>
						</template>
					</template>
				</ul>
			</base-screen-reader>
		</v-alert>
	</div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { AriaRole } from '@/models/Enums';
import BaseScreenReader from '@/components/base/BaseScreenReader.vue';

/**
 * Component to render a summary of validation errors. List errors and provide shortcut to input field.
 * @description WCAG: show where validation error occurs and give clear instructions (3.3.1)
 * @doc See https://cantina.co/form-errors-screen-readers-can-access how to use validation summary with screen readers
 */

const props = defineProps({
	validationErrors: {
		type: Object as PropType<Map<string, string[] | string>>,
	},
	stepId: String,
});

/**
 * Vee-validate changes id 123.4567 to 123[4567], this changes it back
 */
function formatId(id: string | number): string {
	return id.toString().replace('[', '.').replace(']', '');
}

const errorCount = computed(() => {
	let count = 0;
	const values = Object.values(
		props.validationErrors as Map<string, string[] | string>
	);
	values.forEach((element) => {
		if (typeof element === 'string') {
			count++;
		} else {
			count = count + element.length;
		}
	});
	return count;
});
</script>

<style scoped lang="scss">
.form-validation-summary {
	.field-title {
		padding-bottom: 8px;
		display: block;
	}
	ul {
		list-style: inside;
	}
}
</style>
