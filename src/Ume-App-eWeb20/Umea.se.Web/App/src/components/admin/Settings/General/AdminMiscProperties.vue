<template>
	<div class="card-wrap">
		<h2>{{ $t('component.adminFormProperties.properties.titleMisc') }}</h2>
		<v-card>
			<v-row v-if="!isLinkExternal">
				<v-col>
					<admin-switch
						:id="'eService-simpleEService'"
						v-model="simpleEService"
						:label="
							t(
								'component.adminFormProperties.properties.simpleEservice'
							)
						"
						:helpText="
							t(
								'component.adminFormProperties.properties.simpleEserviceHelpText'
							)
						"
					/>
				</v-col>
			</v-row>
			<v-row v-if="!simpleEService && !isLinkExternal">
				<v-col>
					<admin-switch
						:id="'eService-allowPrintPdf'"
						v-model="allowPrintPdf"
						:label="
							t(
								'component.adminFormProperties.properties.allowPrintPdf'
							)
						"
						:helpText="
							t(
								'component.adminFormProperties.properties.allowPrintPdfHelpText'
							)
						"
					/>
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<admin-date-schedule />
				</v-col>
			</v-row>
			<v-row>
				<v-col>
					<admin-switch
						:id="'eService-hidden'"
						v-model="hiddenEService"
						:label="
							t('component.adminFormProperties.properties.hidden')
						"
						:helpText="
							t(
								'component.adminFormProperties.properties.hiddenHelpText'
							)
						"
					/>
				</v-col>
			</v-row>
			<v-row v-if="!isLinkExternal">
				<v-col>
					<admin-switch
						:id="'eService-hidePersonalNumber'"
						v-model="hidePersonalNumber"
						:label="
							t(
								'component.adminFormProperties.properties.personnumber'
							)
						"
						:helpText="
							t(
								'component.adminFormProperties.properties.personnumberHelpText'
							)
						"
					/>
				</v-col>
			</v-row>
		</v-card>
	</div>
</template>

<script setup lang="ts">
import { IForm, IRootState } from '@/models/IForm';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { FormType, MutationType } from '@/models/Enums';
import AdminDateSchedule from './AdminDateSchedule.vue';

const store = useStore<IRootState>();
const { t } = useI18n();

const form = computed(() => store.state.form as IForm);

const isLinkExternal = computed(
	() => form.value.attributes.type === FormType.LinkExternal
);

const simpleEService = computed({
	get: () => {
		return form.value.attributes.simpleEservice;
	},
	set: (value: boolean) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue: value,
			fieldProperty: 'simpleEservice',
		});
	},
});

const allowPrintPdf = computed({
	get: () => {
		return !form.value.attributes.disablePrintPdf;
	},
	set: (allowPrint: boolean) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue: !allowPrint,
			fieldProperty: 'disablePrintPdf',
		});
	},
});

const hiddenEService = computed({
	get: () => {
		return form.value.attributes.hidden;
	},
	set: (value: boolean) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue: value,
			fieldProperty: 'hidden',
		});
	},
});

const hidePersonalNumber = computed({
	get: () => {
		return form.value.attributes.hidePersonNumber;
	},
	set: (value: boolean) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue: value,
			fieldProperty: 'hidePersonNumber',
		});
	},
});
</script>
