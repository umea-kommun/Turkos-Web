<template>
	<div class="form-contact-info">
		<!-- Info om GDPR -->
		<v-container fluid class="pa-0">
			<v-card class="contact-info-card" flat>
				<div v-if="!isMultipleSigningByLink()">
					<h2>
						{{ $t('component.formContactInfo.warning.title') }}
					</h2>
					<v-col class="pa-0">
						<v-layout>
							<p class="pt-3">
								{{
									$t('component.formContactInfo.warning.text')
								}}
							</p>
						</v-layout>
					</v-col>
				</div>
				<h2 class="pt-2 pb-3">{{ setTitle }}</h2>
				<div class="field">
					<form-field-preview
						:title="$t('component.formContactInfo.name')"
						:value="userContactInfo.name"
					></form-field-preview>
				</div>

				<!-- Ways to contact another person -->
				<Field
					v-if="!isMultipleSigningByLink()"
					:name="getValidationId + '.contactPath'"
					:label="t('component.formContactInfo.contactPath')"
					type="select"
					v-model="selectedContactPath"
					v-slot="{ field, errors, meta }"
					:rules="'required'"
				>
					<base-form-field
						:label="$t('component.formContactInfo.contactPath')"
						:label-for="getValidationId + '.contactPath'"
						:isRequired="true"
						:errorDisplay="!!errors.length"
					>
						<v-select
							:id="getValidationId + '.contactPath'"
							v-model="selectedContactPath"
							v-bind="field"
							:items="contactPaths"
							item-value="id"
							item-title="title"
							density="compact"
							:color="errors.length ? 'error' : 'primary'"
							:error="!!errors.length"
						/>

						<HelpAndErrorText
							:errors="errors"
							:getValidationId="getValidationId + '.contactPath'"
							:fieldValid="meta.valid"
						/>
					</base-form-field>
				</Field>

				<Field
					v-if="selectedContactPath === 2"
					:name="getValidationId + '.contactPhoneNummer'"
					:label="t('component.formContactInfo.phonenumber')"
					v-model="contactPhoneNummer"
					v-slot="{ field, errors, meta }"
					:rules="
						(phoneNumberMandatory ? 'required|' : '') +
						'phonenumber'
					"
				>
					<base-form-field
						:id="'label' + getValidationId"
						:label="$t('component.formContactInfo.phonenumber')"
						:label-for="getValidationId + '.contactPhoneNummer'"
						:isRequired="phoneNumberMandatory"
						:errorDisplay="!!errors.length"
					>
						<ume-text-field
							:id="getValidationId + '.contactPhoneNummer'"
							autocomplete="off"
							v-bind="field"
							box
							density="compact"
							single-line
							:required="phoneNumberMandatory"
							:color="errors.length ? 'error' : 'primary'"
							:error="!!errors.length"
							inputmode="tel"
						/>
						<HelpAndErrorText
							:errors="errors"
							:getValidationId="
								getValidationId + '.contactPhoneNummer'
							"
							:fieldValid="meta.valid"
						/>
					</base-form-field>
				</Field>

				<Field
					v-if="
						!isMultipleSigningByLink() && selectedContactPath === 1
					"
					:name="getValidationId + '.contactMail'"
					:label="t('component.formContactInfo.email')"
					v-model="contactMail"
					v-slot="{ field, errors, meta }"
					:rules="(emailMandatory ? 'required|' : '') + 'email'"
				>
					<base-form-field
						:id="'label' + getValidationId"
						:label="$t('component.formContactInfo.email')"
						:label-for="getValidationId + '.contactMail'"
						:isRequired="emailMandatory"
						:errorDisplay="!!errors.length"
					>
						<ume-text-field
							:id="getValidationId + '.contactMail'"
							autocomplete="off"
							v-if="
								!isMultipleSigningByLink() &&
								selectedContactPath === 1
							"
							v-bind="field"
							box
							density="compact"
							single-line
							:required="emailMandatory"
							:color="errors.length ? 'error' : 'primary'"
							:error="!!errors.length"
							inputmode="email"
						/>
						<HelpAndErrorText
							:errors="errors"
							:getValidationId="getValidationId + '.contactMail'"
							:fieldValid="meta.valid"
						/>
					</base-form-field>
				</Field>
			</v-card>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import { IContactInfo, IRootState } from '@/models/IForm';
import { PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Field } from 'vee-validate';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import { useStore } from 'vuex';
import HelpAndErrorText from '@/components/field/helpAndError/HelpAndErrorText.vue';
import { MutationType } from '@/models/Enums';

const props = defineProps({
	userContactInfo: {
		type: Object as PropType<IContactInfo>,
		required: true,
	},
	validationScope: String,
	validationId: {
		type: String,
		default: '',
	},
	emailMandatory: {
		type: Boolean,
		default: false,
	},
	phoneNumberMandatory: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: '',
	},
	selectedContactPaths: Array as PropType<number[]>, // Available contact paths for the user, selected in Admin
});

const store = useStore<IRootState>();
const { t } = useI18n();

const setTitle = computed(() => {
	if (props.title === '') {
		return t('component.formContactInfo.title');
	}
	return t('component.formContactInfo.title') + ' - ' + props.title;
});

const contactPaths = computed(() => {
	const orgContactPaths = [
		{
			title: t('component.adminForm.userRequirements.contactPaths.mail'),
			isChecked: false,
			value: 1,
			id: 1,
		},
		{
			title: t('component.adminForm.userRequirements.contactPaths.sms'),
			isChecked: false,
			value: 2,
			id: 2,
		},
		// ,
		// {
		//   title: this.$t('component.adminForm.userRequirements.contactPaths.myMessages'),
		//   isChecked: false,
		//   value: 3,
		//   id: 3
		// },
		// {
		//   title: this.$t('component.adminForm.userRequirements.contactPaths.QR'),
		//   isChecked: false,
		//   value: 4,
		//   id: 4
		// },
	];
	const temp: any = [];
	props.selectedContactPaths?.forEach((item) => {
		const contactPath = orgContactPaths.find((cPath) => cPath.id === item);
		temp.push(contactPath);
	});
	return temp;
});

/**
 * Updates store NO debounce
 * @param value The value we want to update in the store
 * @param item Name of the item we want to update. ex: 'address'
 */
function storeUpdateFormContactInfo(value: any, item: string): void {
	store.commit(MutationType.UpdateFormContactInfo, {
		socialSecurityNumber: props.userContactInfo?.socialSecurityNumber,
		newValue: value,
		item,
	});
}

const selectedContactPath = computed({
	get: () => {
		if (props.userContactInfo.contactPath === 0) {
			return null;
		}
		return props.userContactInfo.contactPath;
	},
	set: (value: number | null) => {
		if (value === null) {
			storeUpdateFormContactInfo(0, 'contactPath');
		} else {
			storeUpdateFormContactInfo(value, 'contactPath');
		}
	},
});

const contactPhoneNummer = computed({
	get: () => {
		return props.userContactInfo.phoneNumber;
	},
	set: (value: string) => {
		storeUpdateFormContactInfo(value, 'phoneNumber');
	},
});

const contactMail = computed({
	get: () => {
		return props.userContactInfo.email;
	},
	set: (value: string) => {
		storeUpdateFormContactInfo(value, 'email');
	},
});

const getValidationId = computed(() => {
	return (
		props.validationScope +
		(props.validationId ? '.' + props.validationId : '')
	);
});

function isMultipleSigningByLink(): boolean {
	return store.state.multipleSigningByLink
		? store.state.multipleSigningByLink.isMultipleSigningByLink
		: false;
}
</script>

<style scoped lang="scss">
.form-contact-info {
	:deep(.v-select .v-field__input) {
		padding: 0;

		.v-select__selection {
			margin: 0;
			padding: 8px 8px 14px;
		}
	}
	:deep(.v-input__details) {
		display: none;
	}
}
</style>
