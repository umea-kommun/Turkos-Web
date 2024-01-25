<template>
	<div
		class="integration-edit-errors"
		v-if="Object.keys(props.errors).length"
	>
		<div class="title">
			<v-icon icon="warning" class="mr-2" aria-hidden="true" />
			<h3>
				{{
					$t('component.adminForm.integrationEdit.hasXErrors', [
						Object.keys(props.errors).length,
					])
				}}
			</h3>
		</div>
		<ul>
			<li v-for="(error, name) in props.errors" :key="name">
				<a
					@click="focusField(name)"
					@keyup.space.enter.prevent="focusField(name)"
					tabindex="0"
				>
					{{ error }}
				</a>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
	errors: {
		type: Object as PropType<Partial<Record<string, string | undefined>>>,
		required: true,
	},
});
const emit = defineEmits(['changeTab']);

const focusField = (fieldName: string): void => {
	let fieldId = fieldName;
	if (fieldName.indexOf('-tab-') > -1) {
		const tabSplit = fieldName.split('-tab-');
		const tabIndex = parseInt(tabSplit[1]);
		emit('changeTab', tabIndex);
		fieldId = tabSplit[0];
	}
	setTimeout(() => {
		document.getElementById(fieldId)?.focus();
	});
};
</script>

<style scoped lang="scss">
.integration-edit-errors {
	margin: 8px 0 8px 16px;
	color: $error;

	.title {
		display: flex;
		align-items: center;
		h3 {
			font-size: size(16);
			flex: 1;
		}
		margin-bottom: 6px;
	}

	ul {
		li {
			list-style-type: disc;
			margin-left: 26px;
			cursor: pointer;
			text-decoration: underline;
		}
	}
}
</style>
