<template>
	<!--Tillgänglighetsjustering: removes :role="ariaRole", aria-atomic="true" and
	aria-relevant="additions" from div below. This since FormValidationSummary.vue
	which calls the component also uses <v-alert> which already uses role="alert."-->
	<div
		class="base-screen-reader"
		v-bind:class="{ 'screen-reader-only': !visibleOnScreen }"
	>
		<span>{{ message }}</span>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { AriaRole } from '@/models/Enums';
import { PropType } from 'vue';

/**
 * Component to handle reading of text using a screen reader
 */

defineProps({
	/** Message to read by screen reader */
	message: {
		type: String,
		default: '',
	},
	/** Set if message should be visible on screen. Default is false. [optional] */
	visibleOnScreen: {
		type: Boolean,
		default: false,
	},
	/** Set type of message as aria role. Default is status. [optional] */
	ariaRole: {
		type: String as PropType<AriaRole>,
		default: AriaRole.Status,
	},
});
</script>

<style scoped lang="scss">
.base-screen-reader {
	// Use this class to only show for screen readers - lifted from Bootstrap
	&.screen-reader-only {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
}
</style>
