<template>
	<div class="base-form-progress">
		<div
			class="progress-bar"
			role="progressbar"
			:aria-valuenow="progress"
			aria-label="Hur långt du har kommit i e-tjänsten"
		>
			<div
				class="progress-bar-progress"
				:class="{ 'disable-animation': disableAnimation }"
				:style="{
					width: progress + '%',
				}"
			></div>
		</div>

		<div class="progress" aria-hidden="true">
			<div
				v-for="(step, index) in visibleSteps"
				:key="step.id"
				class="progress-circle"
				:class="currentStepIndex + 1 >= index + 1 ? 'active' : ''"
			></div>
			<div
				v-if="hasReviewStep"
				class="progress-circle"
				:class="currentStepIndex >= visibleSteps.length ? 'active' : ''"
			></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import FormMetaDataModel, { IFormStep } from '@/models/IForm';
import { computed, ref, PropType, watch } from 'vue';
const props = defineProps({
	currentStep: {
		required: true,
		type: Object as PropType<FormMetaDataModel>,
	},
	visibleSteps: {
		required: true,
		type: Array as PropType<Array<IFormStep>>,
	},
	totalSteps: {
		required: true,
		type: Number,
	},
	hasReviewStep: {
		type: Boolean,
		default: true,
	},
});

const disableAnimation = ref(false);
const disableAnimationTemporary = (): void => {
	disableAnimation.value = true;
	setTimeout(() => (disableAnimation.value = false), 100);
};
disableAnimationTemporary();

watch(
	() => props.visibleSteps.length,
	() => {
		// This is only to make it look better when steps are visible/hidden
		disableAnimationTemporary();
	}
);

const currentStepIndex = computed(() => {
	for (const index in props.visibleSteps) {
		if (
			props.currentStep.id.toString() ===
			props.visibleSteps[index].id.toString()
		) {
			return parseInt(index);
		}
	}
	return props.visibleSteps.length;
});

const progress = computed(() => {
	let reviewStepAdd = 1;
	if (!props.hasReviewStep) {
		reviewStepAdd = 0;
	}

	return (
		(100 / (props.visibleSteps.length + reviewStepAdd)) *
			(currentStepIndex.value + 1) -
		100 / ((props.visibleSteps.length + reviewStepAdd) * 2)
	);
});
</script>

<style lang="scss">
.base-form-progress {
	position: absolute;
	bottom: -8px;
	left: 0;
	right: 0;
	padding: 0 0px;

	.progress-bar {
		position: absolute;
		top: 6px;
		width: 100%;
		height: 3px;
		background-color: #dcdcdc;

		.progress-bar-progress {
			height: 100%;
			width: 0;
			background-color: $primary;
			transition: all ease 0.4s;

			&.disable-animation {
				transition: none;
			}
		}
	}

	.progress {
		width: 100%;
		display: flex;
		justify-content: space-around;
	}

	.progress-circle {
		z-index: 10;
		width: 15px;
		height: 15px;
		background-color: #dcdcdc;
		border-radius: 20px;
		transition: all ease 0.2s;
		box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.15);

		&.active {
			background-color: $primary;
		}
	}
}
</style>
