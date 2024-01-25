<template>
	<div class="admin-ces-settings">
		<h1>
			{{ $t('component.adminForm.adminSettingsSidebar.CES') }}
		</h1>

		<div class="card-wrap">
			<v-card>
				<v-row class="mb-3">
					<v-col class="pb-0">
						<h2>
							{{ $t('component.adminFollowUp.properties.title') }}
						</h2>
						<p class="mb-0">
							{{
								$t(
									'component.adminFollowUp.properties.description'
								)
							}}
						</p>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<admin-select-list
							id="activation"
							v-model="followUpActivation"
							:items="followUpActivations"
							:label="
								$t(
									'component.adminFollowUp.properties.activation'
								)
							"
						/>
					</v-col>
				</v-row>
				<v-row v-if="isManualFollowUpActivation">
					<v-col>
						<admin-text-box
							id="averageTreatmentTime"
							v-model="averageTreatmentTime"
							type="number"
							rules="required|numeric"
							:label="
								$t(
									'component.adminFollowUp.properties.averageTreatmentTime'
								)
							"
						/>
						<p>
							{{ $t('component.adminFollowUp.information') }}
						</p>
					</v-col>
				</v-row>
			</v-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IRootState } from '@/models/IForm';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { FormFollowUpActivation, MutationType } from '@/models/Enums';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';

const store = useStore<IRootState>();

const { t } = useI18n();

const form = computed(() => store.state.form);

const followUpActivations = [
	{
		value: FormFollowUpActivation.None,
		title: t('component.adminFollowUp.activation.none'),
	},
	{
		value: FormFollowUpActivation.Integration,
		title: t('component.adminFollowUp.activation.integration'),
	},
	{
		value: FormFollowUpActivation.Manual,
		title: t('component.adminFollowUp.activation.manual'),
	},
];

const followUpActivation = computed({
	get: () => {
		return form.value?.attributes.followUp.activation;
	},
	set: (newActivation: FormFollowUpActivation | undefined) => {
		store.commit(MutationType.UpdateFormFollowUpProperty, {
			newValue: newActivation,
			fieldProperty: 'activation',
		});
	},
});

const isManualFollowUpActivation = computed(() => {
	return followUpActivation.value === FormFollowUpActivation.Manual;
});

const averageTreatmentTime = computed({
	get: () => {
		return form.value?.attributes.followUp.averageTreatmentTime ?? '';
	},
	set: (newTime: string) => {
		store.commit(MutationType.UpdateFormFollowUpProperty, {
			newValue: newTime,
			fieldProperty: 'averageTreatmentTime',
		});
	},
});
</script>

<style scoped lang="scss">
.admin-ces-settings {
	h1 {
		color: $black;
	}
	:deep(.card-wrap) {
		margin-top: 20px;

		h2 {
			color: $black;
			margin-bottom: 10px;
			font-size: size(18);
		}
		.v-card {
			padding: 16px;
			max-width: 600px;
			border-radius: $border-radius;
		}
	}
}
</style>
