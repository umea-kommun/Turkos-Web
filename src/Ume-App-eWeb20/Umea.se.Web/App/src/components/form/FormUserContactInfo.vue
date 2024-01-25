<template>
	<div class="form-user-contact-info">
		<!-- Info om GDPR -->
		<v-container fluid class="pa-0">
			<v-card class="user-contact-info-card" flat>
				<h2 class="pt-2 pb-3">{{ setTitle }}</h2>
				<template v-if="notAnonymous">
					<v-checkbox
						class="skip-address-info"
						v-if="userHasProtectedIdentity"
						v-model="skipContactInfo"
						label="Jag vill inte lämna mina adressuppgifter."
						color="primary"
						type="checkbox"
						hide-details
					/>
					<div class="field">
						<form-field-preview
							:title="
								t(
									'component.formUserContactInfo.socialsecuritynumber'
								)
							"
							:value="getTrimmedSocialSecurityNumber"
						></form-field-preview>
					</div>
					<div class="field">
						<form-field-preview
							:title="
								t('component.formUserContactInfo.firstname')
							"
							:value="userContactInfo?.firstName"
						></form-field-preview>
					</div>
					<div class="field">
						<form-field-preview
							:title="t('component.formUserContactInfo.lastname')"
							:value="userContactInfo?.lastName"
						></form-field-preview>
					</div>
					<template v-if="!skipContactInfo">
						<Field
							:name="getValidationId + '.usersAddress'"
							:label="t('component.formUserContactInfo.address')"
							v-model="usersAddress"
							v-slot="{ field, errors, meta }"
							:rules="addressMandatory ? 'required|' : ''"
						>
							<base-form-field
								:id="
									'label' + getValidationId + '.usersAddress'
								"
								:label="
									t('component.formUserContactInfo.address')
								"
								:label-for="getValidationId + '.usersAddress'"
								:isRequired="addressMandatory"
								:errorDisplay="!!errors.length"
							>
								<ume-text-field
									autocomplete="off"
									:id="getValidationId + '.usersAddress'"
									v-bind="field"
									:success="getIsSuccess(meta)"
									box
									density="compact"
									single-line
									hide-details
									:color="errors.length ? 'error' : 'primary'"
									:error="!!errors.length"
									:dirty="!!usersAddress.length"
									:aria-labelledby="
										'label' +
										getValidationId +
										'.usersAddress'
									"
									:aria-describedby="
										!!errors.length
											? 'error-' +
											  getValidationId +
											  '.usersAddress'
											: null
									"
									:model-value="usersAddress"
								/>
								<HelpText
									:errors="errors"
									:getValidationId="
										getValidationId + '.usersAddress'
									"
									:fieldValid="meta.valid"
								>
								</HelpText>
							</base-form-field>
						</Field>

						<Field
							:name="getValidationId + '.userPostalNumber'"
							:label="
								t('component.formUserContactInfo.postalNumber')
							"
							v-model.trim="userPostalNumber"
							v-slot="{ field, errors, meta }"
							:rules="
								addressMandatory
									? 'required|zipCode'
									: 'zipCode'
							"
						>
							<base-form-field
								:id="
									'label' +
									getValidationId +
									'.userPostalNumber'
								"
								:label="
									t(
										'component.formUserContactInfo.postalNumber'
									)
								"
								:label-for="
									getValidationId + '.userPostalNumber'
								"
								:isRequired="addressMandatory"
								:errorDisplay="!!errors.length"
							>
								<ume-text-field
									autocomplete="off"
									v-bind="field"
									:id="getValidationId + '.userPostalNumber'"
									:success="getIsSuccess(meta)"
									box
									density="compact"
									single-line
									hide-details
									:color="errors.length ? 'error' : 'primary'"
									:error="!!errors.length"
									:dirty="!!userPostalNumber.length"
									:aria-labelledby="
										'label' +
										getValidationId +
										'.userPostalNumber'
									"
									:aria-describedby="
										!!errors.length
											? 'error-' +
											  getValidationId +
											  '.userPostalNumber'
											: null
									"
									inputmode="numeric"
									:model-value="userPostalNumber"
								/>
								<HelpText
									:errors="errors"
									:getValidationId="
										getValidationId + '.userPostalNumber'
									"
									:fieldValid="meta.valid"
								>
								</HelpText>
							</base-form-field>
						</Field>
						<Field
							:name="getValidationId + '.userCity'"
							:label="t('component.formUserContactInfo.city')"
							v-model.trim="userCity"
							v-slot="{ field, errors, meta }"
							:rules="addressMandatory ? 'required|' : ''"
						>
							<base-form-field
								:id="'label' + getValidationId + '.userCity'"
								:label="t('component.formUserContactInfo.city')"
								:label-for="getValidationId + '.userCity'"
								:isRequired="addressMandatory"
								:errorDisplay="!!errors.length"
							>
								<ume-text-field
									autocomplete="off"
									v-bind="field"
									:id="getValidationId + '.userCity'"
									:success="getIsSuccess(meta)"
									box
									density="compact"
									single-line
									hide-details
									:color="errors.length ? 'error' : 'primary'"
									:error="!!errors.length"
									:dirty="!!userCity.length"
									:aria-labelledby="
										'label' + getValidationId + '.userCity'
									"
									:aria-describedby="
										!!errors.length
											? 'error-' +
											  getValidationId +
											  '.userCity'
											: null
									"
									:model-value="userCity"
								/>
								<HelpText
									:errors="errors"
									:getValidationId="
										getValidationId + '.userCity'
									"
									:fieldValid="meta.valid"
								>
								</HelpText>
							</base-form-field>
						</Field>
					</template>
				</template>
				<Field
					:name="getValidationId + '.userPhonenumber'"
					:label="t('component.formUserContactInfo.phonenumber')"
					v-model.trim="userPhonenumber"
					v-slot="{ field, errors, meta }"
					:rules="
						(phoneNumberMandatory ? 'required|' : '') +
						'phonenumber'
					"
				>
					<base-form-field
						:id="'label' + getValidationId + '.userPhonenumber'"
						:label="t('component.formUserContactInfo.phonenumber')"
						:label-for="getValidationId + '.userPhonenumber'"
						:isRequired="phoneNumberMandatory"
						:errorDisplay="!!errors.length"
					>
						<ume-text-field
							:id="getValidationId + '.userPhonenumber'"
							autocomplete="off"
							v-bind="field"
							:success="getIsSuccess(meta)"
							box
							density="compact"
							single-line
							hide-details
							:color="errors.length ? 'error' : 'primary'"
							:error="!!errors.length"
							:dirty="!!userPhonenumber.length"
							:aria-labelledby="
								'label' + getValidationId + '.userPhonenumber'
							"
							:aria-describedby="
								!!errors.length
									? 'error-' +
									  getValidationId +
									  '.userPhonenumber'
									: null
							"
							inputmode="tel"
							:model-value="userPhonenumber"
						/>
						<HelpText
							:errors="errors"
							:getValidationId="
								getValidationId + '.userPhonenumber'
							"
							:fieldValid="meta.valid"
						>
						</HelpText>
					</base-form-field>
				</Field>
				<Field
					:name="getValidationId + '.userEmail'"
					:label="t('component.formUserContactInfo.email')"
					v-model.trim="userEmail"
					v-slot="{ field, errors, meta }"
					:rules="(emailMandatory ? 'required|' : '') + 'email'"
				>
					<base-form-field
						:id="'label' + getValidationId + '.userEmail'"
						:label="t('component.formUserContactInfo.email')"
						:label-for="getValidationId + '.userEmail'"
						:isRequired="emailMandatory"
						:errorDisplay="!!errors.length"
					>
						<ume-text-field
							:id="getValidationId + '.userEmail'"
							autocomplete="off"
							v-bind="field"
							:append-inner-icon="
								!isUserAllowedToChangeEmail ? 'lock' : undefined
							"
							:success="getIsSuccess(meta)"
							:readonly="!isUserAllowedToChangeEmail"
							box
							density="compact"
							single-line
							hide-details
							:color="errors.length ? 'error' : 'primary'"
							:error="!!errors.length"
							:dirty="!!userEmail.length"
							:aria-labelledby="
								'label' + getValidationId + '.userEmail'
							"
							:aria-readonly="!isUserAllowedToChangeEmail"
							:aria-describedby="
								!!errors.length
									? 'error-' + getValidationId + '.userEmail'
									: null
							"
							inputmode="email"
							:model-value="userEmail"
						/>
						<HelpText
							:errors="errors"
							:getValidationId="getValidationId + '.userEmail'"
							:fieldValid="meta.valid"
						>
						</HelpText>
					</base-form-field>
				</Field>
			</v-card>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import { PropType, ref, computed } from 'vue';
import { IUserContactInfo, IRootState } from '@/models/IForm';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import HelpText from '@/components/field/helpAndError/HelpAndErrorText.vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { Field, FieldMeta } from 'vee-validate';
import { MutationType } from '@/models/Enums';

/**
 * Component showing the user's information
 * @prop {IUserContactInfo} userContactInfo - Users contact information.
 * @prop {string} validationScope - Set scope for validation, ie when it is to be evaluated.
 */

const props = defineProps({
	userContactInfo: Object as PropType<IUserContactInfo>,
	notAnonymous: {
		type: Boolean,
		default: true,
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
	addressMandatory: {
		type: Boolean,
		default: true,
	},
	title: {
		type: String,
		default: '',
	},
});

const { t } = useI18n();
const store = useStore<IRootState>();

const skipContactInfo = ref<boolean>(false);

const setTitle = computed(() => {
	if (props.title === '') {
		return t('component.formUserContactInfo.title').toString();
	} else {
		return (
			t('component.formUserContactInfo.title').toString() +
			' - ' +
			props.title
		);
	}
});

const getTrimmedSocialSecurityNumber = computed(() => {
	if (props.userContactInfo?.socialSecurityNumber) {
		return (
			props.userContactInfo.socialSecurityNumber.substring(
				0,
				props.userContactInfo.socialSecurityNumber.length - 4
			) + '....'
		);
	} else {
		return '';
	}
});

const isUserAllowedToChangeEmail = computed(() => {
	const user = store.state.user;
	if (user.isAuthenticated && user.idp) {
		// The user is likely not allowed to change its email if
		// logged in via ActiveDirectory (this rule might change one day....)
		return user.idp.toLowerCase().indexOf('activedirectory') === -1;
	}
	return true;
});

const userHasProtectedIdentity = computed(() => {
	return store.getters.userHasProtectedIdentity;
});

/**
 * Updates store NO debounce
 * @param value The value we want to update in the store
 * @param item Name of the item we want to update. ex: 'address'
 */
function storeUpdateFormUserContactInfo(value: string, item: string): void {
	store.commit(MutationType.UpdateFormUserContactInfo, {
		newValue: value,
		item,
	});
}

const usersAddress = computed({
	get: () => {
		return props.userContactInfo?.address ?? '';
	},
	set: (value: string) => {
		storeUpdateFormUserContactInfo(value, 'address');
	},
});

const userPostalNumber = computed({
	get: () => {
		return props.userContactInfo?.postalNumber ?? '';
	},
	set: (value: string) => {
		storeUpdateFormUserContactInfo(value, 'postalNumber');
	},
});

const userCity = computed({
	get: () => {
		return props.userContactInfo?.city ?? '';
	},
	set: (value: string) => {
		storeUpdateFormUserContactInfo(value, 'city');
	},
});

const userPhonenumber = computed({
	get: () => {
		return props.userContactInfo?.phoneNumber ?? '';
	},
	set: (value: string) => {
		storeUpdateFormUserContactInfo(value, 'phoneNumber');
	},
});

const userEmail = computed({
	get: () => {
		return props.userContactInfo?.email ?? '';
	},
	set: (value: string) => {
		storeUpdateFormUserContactInfo(value, 'email');
	},
});

/**
 * Check if the value has changed and validation is correct
 */
function getIsSuccess(meta: FieldMeta<unknown>): boolean {
	return meta.valid && meta.touched;
}

/**
 * Get validation id for field. Used by Vee-validation.
 * @return {string} Id for field used in validation
 */
const getValidationId = computed(() => {
	return (
		props.validationScope +
		(props.validationId ? '.' + props.validationId : '')
	);
});
</script>

<style scoped lang="scss">
.skip-address-info {
	margin-top: 0;
	margin-bottom: 16px;
	padding-top: 0;
}
.field {
	padding-bottom: 20px;
	margin-bottom: 0px;
	border-bottom: 1px solid $grey-lighten-3;
}
.title {
	padding-top: 40px;
	padding-bottom: 30px;
}
.field-title {
	display: block;
	padding-bottom: 0px;
}
:deep(input[readonly]) {
	color: #888 !important;
	cursor: default;
}
</style>
