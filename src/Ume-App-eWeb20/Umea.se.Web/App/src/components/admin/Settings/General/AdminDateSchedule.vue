<template>
	<div class="admin-date-schedule" :class="{ active: scheduleActive }">
		<div class="label-wrap">
			<label for="schedule-eService-toggle">{{
				t('component.adminFormProperties.dateSchedule')
			}}</label>

			<span class="help-text">{{
				t('component.adminFormProperties.dateScheduleHelpText')
			}}</span>

			<div class="date-wrap" v-if="scheduleActive">
				{{ t('component.adminFormProperties.dateScheduleFrom') }}
				<admin-date-picker
					id="eService-schedule-from"
					type="datetime-local"
					v-model="fromDateTime"
					:required="true"
					:min-date="DEFAULT_MIN_DATE_TIME"
					:max-date="DEFAULT_MAX_DATE_TIME"
				/>

				{{ t('component.adminFormProperties.dateScheduleTo') }}
				<admin-date-picker
					id="eService-schedule-to"
					type="datetime-local"
					v-model="toDateTime"
					:required="true"
					:min-date="DEFAULT_MIN_DATE_TIME"
					:max-date="DEFAULT_MAX_DATE_TIME"
				/>
			</div>
		</div>
		<v-switch
			:aria-checked="scheduleActive"
			id="schedule-eService-toggle"
			v-model="scheduleActive"
			:title="scheduleActive ? 'Aktiverad' : 'Ej aktiverad'"
			role="switch"
		/>
	</div>
</template>

<script setup lang="ts">
import { MutationType } from '@/models/Enums';
import { IDateSchedule, IForm, IRootState } from '@/models/IForm';
import moment from 'moment';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import AdminDatePicker from '@/components/field/admin/AdminDatePicker.vue';
import Config from '@/utils/Config';

const store = useStore<IRootState>();
const { t } = useI18n();

const form = computed(() => store.state.form as IForm);

const formHasDateSchedule = computed(() => {
	return form.value.attributes.dateSchedule &&
		form.value.attributes.dateSchedule.from
		? true
		: false;
});

const DEFAULT_MIN_DATE_TIME = Config.VUE_APP_FIELD_DEFAULT_MIN_DATE + ' 00:00';
const DEFAULT_MAX_DATE_TIME = Config.VUE_APP_FIELD_DEFAULT_MAX_DATE + ' 00:00';

const scheduleActive = computed({
	get: () => {
		return form.value.attributes.dateSchedule &&
			form.value.attributes.dateSchedule.active
			? true
			: false;
	},
	set: (bool: boolean) => {
		let dateSchedule = {} as IDateSchedule;
		if (formHasDateSchedule.value) {
			dateSchedule = {
				...form.value.attributes.dateSchedule,
			} as IDateSchedule;
			dateSchedule.active = bool;
		} else {
			dateSchedule = {
				from: moment().toISOString(),
				to: moment().toISOString(),
				active: bool,
			};
		}
		store.commit(MutationType.UpdateFormProperty, {
			newValue: dateSchedule,
			fieldProperty: 'dateSchedule',
		});
	},
});

const fromDateTime = computed({
	get: () => {
		return form.value.attributes.dateSchedule.from
			? moment(form.value.attributes.dateSchedule.from).format(
					'YYYY-MM-DD HH:mm'
			  )
			: '';
	},
	set: (newDate: string) => {
		const date = moment(newDate);
		const dateSchedule = {
			...form.value.attributes.dateSchedule,
			from: date.isValid() ? date.toISOString() : undefined,
		};
		store.commit(MutationType.UpdateFormProperty, {
			newValue: dateSchedule,
			fieldProperty: 'dateSchedule',
		});
	},
});

const toDateTime = computed({
	get: () => {
		return form.value.attributes.dateSchedule.to
			? moment(form.value.attributes.dateSchedule.to).format(
					'YYYY-MM-DD HH:mm'
			  )
			: '';
	},
	set: (newDate: string) => {
		const date = moment(newDate);
		const dateSchedule = {
			...form.value.attributes.dateSchedule,
			to: date.isValid() ? date.toISOString() : undefined,
		};
		store.commit(MutationType.UpdateFormProperty, {
			newValue: dateSchedule,
			fieldProperty: 'dateSchedule',
		});
	},
});
</script>

<style scoped lang="scss">
.admin-date-schedule {
	margin-bottom: 10px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;

	.label-wrap {
		display: flex;
		flex-direction: column;
		flex: 1;
		label {
			padding-right: 20px;
		}

		.help-text {
			opacity: 0.8;
			font-size: size(14);
			padding-right: 20px;
		}
	}

	.date-wrap {
		border-left: solid 2px $grey-lighten-5;
		padding-left: 16px;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 10px;

		:deep(.t-date-picker.ume-input) {
			background-color: transparent;
			margin: 0 6px;
			margin-top: 14px;

			:hover,
			:focus,
			:focus-within {
				background-color: transparent;
			}
			input {
				padding: 6px 0;
				height: auto;
			}
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
