<template>
	<v-card class="admin-steps">
		<admin-form-error />
		<div class="admin-steps__content">
			<h3 class="admin-subtitle">
				{{ $t('component.adminSteps.add.defaultName') }}
			</h3>
			<v-list color="primary">
				<v-list-item
					v-for="(step, index) in steps"
					:key="step.id"
					@click="activeStep = index + 1"
					:active="index + 1 === activeStep"
					rounded
				>
					<v-list-item-title>
						<span class="step-number">{{ index + 1 }}.</span>
						{{ step.title }}
					</v-list-item-title>

					<button class="menu-btn" :id="'step-menu-btn-' + step.id">
						<v-icon :size="24" icon="more_horiz" />
					</button>
					<v-menu
						:key="step.id"
						:activator="'#step-menu-btn-' + step.id"
						class="step-menu"
						location="end center"
						transition="slide-x-transition"
					>
						<div class="menu-popup-small-triangle"></div>
						<v-list :rounded="8">
							<v-list-item @click="addStep">
								<v-list-item-title>
									<v-icon :size="22" icon="add" />
									{{ $t('component.adminSteps.add.tooltip') }}
								</v-list-item-title>
							</v-list-item>
							<v-list-item
								v-if="index > 0"
								@click="moveBackward(index)"
							>
								<v-list-item-title>
									<v-icon :size="22" icon="expand_less" />
									{{ $t('component.adminSteps.push.back') }}
								</v-list-item-title>
							</v-list-item>
							<v-list-item
								v-if="index + 1 !== steps.length"
								@click="moveForward(index)"
							>
								<v-list-item-title>
									<v-icon :size="22" icon="expand_more" />
									{{
										$t('component.adminSteps.push.forward')
									}}
								</v-list-item-title>
							</v-list-item>
							<v-list-item
								@click="removeStep(step.id)"
								class="color-red"
							>
								<v-list-item-title>
									<v-icon :size="22" icon="delete_forever" />
									{{
										$t(
											'component.adminSteps.delete.btnText'
										)
									}}
								</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-list-item>

				<v-list-item
					@click="addStep"
					class="add-step-btn"
					color="primary"
				>
					<v-list-item-title>
						<v-icon :size="22" icon="add" />
						{{ $t('component.adminSteps.add.tooltip') }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</div>
	</v-card>
</template>

<script setup lang="ts">
import { MutationType } from '@/models/Enums';
import { IForm, IRootState } from '@/models/IForm';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useTConfirmDialog } from '@turkos/components';
import ErrorService from '@/utils/ErrorService';
import AdminFormError from './Validation/AdminFormError.vue';

const store = useStore<IRootState>();
const { t } = useI18n();

const form = computed(() => store.state.form as IForm);
const activeStep = computed({
	get: () => store.state.admin?.activeStep ?? 0,
	set: (newStep: number) => {
		store.commit(MutationType.UpdateAdminState, {
			prop: 'activeStep',
			value: newStep,
		});
	},
});

const steps = computed(() => {
	return form.value.attributes.steps.map((step) => ({
		title: step.title,
		id: step.id,
	}));
});
const moveBackward = (stepIndex: number): void => {
	if (stepIndex !== 0) {
		store.commit(MutationType.PushStepBackward, {
			stepIndex,
		});
		if (stepIndex === activeStep.value - 1) {
			activeStep.value--;
		}
	}
};
const moveForward = (stepIndex: number): void => {
	if (stepIndex + 1 !== steps.value.length) {
		store.commit(MutationType.PushStepForward, {
			stepIndex,
		});
		if (stepIndex === activeStep.value - 1) {
			activeStep.value++;
		}
	}
};
const { tConfirmDialogAsync } = useTConfirmDialog();
const removeStep = async (stepId: string): Promise<void> => {
	const doRemove = await tConfirmDialogAsync(
		t('component.adminSteps.confirmDelete.title'),
		t('component.adminSteps.confirmDelete.text'),
		{
			text: t('component.adminSteps.delete.btnText'),
			color: 'error',
		}
	);
	if (doRemove) {
		try {
			store.commit(MutationType.DeleteFormStep, { stepId });
			if (activeStep.value > 1) {
				activeStep.value--;
			}
		} catch (err) {
			const message = t('component.adminSteps.error.onDeleteStep');
			ErrorService.onError({ err, message });
		}
	}
};
const addStep = (): void => {
	try {
		const newStepIndex = steps.value.length;

		const defaultName =
			t('component.adminSteps.add.defaultName').toString() +
			' ' +
			(newStepIndex + 1).toString();
		const step = { title: defaultName, description: '' };

		store.commit(MutationType.AddFormStep, { data: step });
		activeStep.value = newStepIndex + 1;
	} catch (err) {
		const message = t('component.adminSteps.error.onAddStep');
		ErrorService.onError({ err, message });
	}
};
</script>

<style scoped lang="scss">
.admin-steps {
	position: fixed;
	top: 62px;
	left: 0;
	bottom: 0;
	max-width: 324px;
	width: 20%;
	border-radius: 0;
	overflow-y: auto;

	&__content {
		padding: 20px;
	}

	.admin-subtitle {
		font-size: size(16);
		color: $grey-darken-1;
	}

	.v-list-item {
		border-radius: 8px;
		padding: 0 !important;
		min-height: 40px;
		margin-bottom: 8px;

		:deep(.v-list-item__content) {
			display: flex;
			flex-direction: row;

			.v-list-item-title {
				flex: 1;
				padding: 2px 16px;
				padding-right: 0;

				.step-number {
					margin-right: 4px;
				}
			}
		}

		.menu-btn {
			opacity: 0;
			transition: opacity 0.2s ease;
			width: 44px;
			color: $grey-darken-2;
			outline: none;
		}
		&--active,
		&:hover {
			.menu-btn {
				opacity: 1;
			}
		}
	}

	.add-step-btn {
		text-transform: none;
		letter-spacing: normal;
		font-size: size(16);
		color: $primary;

		.v-icon {
			margin-right: 4px;
		}
	}
}

.menu-popup-small-triangle {
	position: absolute;
	top: 50%;
	margin-top: -6px;
	left: -12px;
	height: 0;
	width: 0;
	border: solid 6px transparent;
	border-right-color: #fff;
	z-index: 100;
}

.step-menu {
	.v-list-item {
		min-height: 44px;

		.v-icon {
			margin-right: 4px;
			color: $grey-darken-2;
		}

		&.color-red {
			color: red;
			.v-icon {
				color: red;
			}
		}
	}
}
</style>
