<template>
	<div class="card-wrap">
		<h2>{{ $t('component.adminForm.userRequirements.title') }}</h2>
		<v-card>
			<!-- Authentication Methods -->
			<v-row>
				<v-col cols="6">
					<admin-select-list
						:id="'eService-authClients'"
						v-model="selectedAuthClients"
						:items="authClients"
						item-value="id"
						:label="
							$t(
								'component.adminForm.userRequirements.allowedLoginMethods'
							)
						"
						:help-text="
							$t(
								'component.adminForm.userRequirements.allowedLoginMethodsHelpText'
							)
						"
						multiple
						rules="required"
					/>
				</v-col>
			</v-row>
			<!-- Multiple Legitimation -->
			<v-row>
				<v-col>
					<admin-switch
						:id="'eService-multipleLegitimation'"
						v-model="multipleLegitimation"
						:label="
							t(
								'component.adminForm.userRequirements.multipleLegitimation.title'
							)
						"
						:helpText="
							t(
								'component.adminForm.userRequirements.multipleLegitimation.checkbox'
							)
						"
					/>
				</v-col>
			</v-row>
			<!-- Contact Paths if Multiple Legitimation -->
			<div v-if="multipleLegitimation" class="indented-row">
				<v-row>
					<v-col cols="6">
						<admin-select-list
							:id="'eService-contactPaths'"
							v-model="selectedContactPaths"
							:items="contactPaths"
							item-value="id"
							:label="
								t(
									'component.adminForm.userRequirements.contactPath'
								)
							"
							multiple
							rules="required"
						/>
						<admin-text-box
							:id="'eService-multipleLegitimationNumberOfDaysToAnswer'"
							rules="required|numeric|minNumber:5|maxNumber:30"
							v-model="numberOfDaysToAnswer"
							:label="
								t(
									'component.adminForm.userRequirements.multipleLegitimation.numberOfDaysToAnswerTitle'
								)
							"
							:helpText="
								t(
									'component.adminForm.userRequirements.multipleLegitimation.numberOfDaysToAnswerHelptext'
								)
							"
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6">
						<div>
							<strong>
								{{
									$t(
										'component.adminForm.userRequirements.multipleLegitimation.titleMessageTexts'
									)
								}}
							</strong>
							<p>
								{{
									$t(
										'component.adminForm.userRequirements.multipleLegitimation.description'
									)
								}}
							</p>
						</div>
					</v-col>
					<v-col class="text-end">
						<v-btn
							@click="
								showMessageEditorModal = { showModal: true }
							"
						>
							<v-icon icon="edit" color="#616161" class="mr-2" />
							{{
								$t(
									'component.adminForm.userRequirements.multipleLegitimation.edit'
								)
							}}
						</v-btn>
					</v-col>
				</v-row>
			</div>
			<!-- User Contact Information -->
			<v-row>
				<v-col>
					<admin-switch
						:id="'eService-userContactInformation'"
						v-model="showUserContactInformation"
						:label="
							t(
								'component.adminForm.userRequirements.userContactInformation.title'
							)
						"
						:helpText="
							t(
								'component.adminForm.userRequirements.userContactInformation.checkbox'
							)
						"
					/>
				</v-col>
			</v-row>
			<!-- Required Contact Methods -->
			<v-row v-if="showUserContactInformation">
				<v-col>
					<admin-checkbox
						:id="'eService-requiredContactMethods'"
						v-model="selectedRequiredContactMethods"
						:items="requiredContactMethods"
						:label="t('component.adminForm.userRequirements.info')"
					/>
				</v-col>
			</v-row>
			<!-- Allow application secondarily -->
			<v-row>
				<v-col>
					<admin-switch
						:id="'eService-allowApplicationSecondarily'"
						v-model="allowApplicationSecondarily"
						:label="
							t('component.adminForm.userRequirements.option')
						"
						:helpText="
							t(
								'component.adminForm.userRequirements.optionapplying'
							)
						"
					/>
				</v-col>
			</v-row>
		</v-card>
	</div>
	<admin-multiple-message-modal
		v-if="toggleMessageEditorModal"
		v-model="toggleMessageEditorModal"
	/>
</template>

<script setup lang="ts">
import { IForm, IItem, IRootState } from '@/models/IForm';
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import AdminCheckbox from '@/components/field/admin/AdminCheckbox.vue';
import AdminMultipleMessageModal from '@/components/admin/Settings/MultipleLegitimation/AdminMultipleMessageModal.vue';
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { MutationType } from '@/models/Enums';
import IAuthManager from '@/plugins/auth/IAuthManager';
import Config from '@/utils/Config';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
const auth = inject('$auth') as IAuthManager;
const store = useStore<IRootState>();
const { t } = useI18n();

const form = computed(() => store.state.form as IForm);

const showMessageEditorModal = ref<{
	showModal: boolean;
} | null>(null);

const toggleMessageEditorModal = computed({
	get: () => !!showMessageEditorModal.value,
	set: (show) => {
		if (!show) {
			showMessageEditorModal.value = null;
		}
	},
});

// General Update User Requirements

function updateUserRequirement(
	key: string,
	value: string[] | number[] | boolean | string
): void {
	const userRequirements = {
		...form.value.attributes.userRequirement,
	} as { [key: string]: string[] | number[] | boolean | string };
	userRequirements[key] = value;

	store.commit(MutationType.UpdateFormProperty, {
		newValue: userRequirements,
		fieldProperty: 'userRequirement',
	});
}

// Authentication Methods

const authClients = auth
	.getAuthClientsUsedForCitizenLogin()
	.map((item) => {
		let title = item.name.replaceAll(' ', '');
		title = title[0].toLocaleLowerCase() + title.substring(1);
		title = t(`component.adminForm.userRequirements.authClients.${title}`);

		return {
			id: item.name,
			title: title,
		} as IItem;
	})
	.sort((a, b) => a.title?.localeCompare(b.title || '') || 0);

const selectedAuthClients = computed({
	get: () => {
		return form.value.attributes.userRequirement.authClient.filter(
			(item) => item.length > 0
		);
	},
	set: (value: string[]) => {
		updateUserRequirement('authClient', value);
	},
});

// Multiple Legitimation

const multipleLegitimation = computed({
	get: () => {
		return form.value.attributes.userRequirement.multipleLegitimation;
	},
	set: (value: boolean) => {
		if (value == true) {
			store.commit(MutationType.CreateMessageTextsFromDefault);
		}
		updateUserRequirement('multipleLegitimation', value);
		updateUserRequirement(
			'numberOfDaysToAnswer',
			Config.VUE_APP_MULTIPLELEGITIMATION_NUMBEROFDAYS
		);
	},
});

//Number of days
const numberOfDaysToAnswer = computed({
	get: () => {
		return form.value.attributes.userRequirement.numberOfDaysToAnswer;
	},
	set: (value: string) => {
		updateUserRequirement('numberOfDaysToAnswer', value);
	},
});

// Contact Paths

const contactPaths = [
	{
		title: t('component.adminForm.userRequirements.contactPaths.mail'),
		value: '1',
		id: 1,
	},
	{
		title: t('component.adminForm.userRequirements.contactPaths.sms'),
		value: '2',
		id: 2,
	},
	// {
	//   title: t('component.adminForm.userRequirements.contactPaths.myMessages'),
	//   value: 3,
	//   id: 3
	// },
	// {
	//   title: t('component.adminForm.userRequirements.contactPaths.QR'),
	//   value: 4,
	//   id: 4
	// },
] as IItem[];

const selectedContactPaths = computed({
	get: () => {
		return form.value.attributes.userRequirement.contactPaths;
	},
	set: (value: number[]) => {
		updateUserRequirement('contactPaths', value);
	},
});

// User Contact Information

const showUserContactInformation = computed({
	get: () => {
		return form.value.attributes.userRequirement.showUserContactInformation;
	},
	set: (value: boolean) => {
		updateUserRequirement('showUserContactInformation', value);
	},
});

// Required Contact Methods

const couldBeAnonymous = computed(() =>
	form.value.attributes.userRequirement.authClient.includes(
		Config.VUE_APP_AUTH_ANONYMOUS_CLIENT_DISPLAY_NAME
	)
);

const requiredContactMethods = computed(() => {
	return [
		{
			title: t('component.adminForm.userRequirements.email'),
			isChecked: form.value.attributes.userRequirement.emailMandatory,
			disabled: !showUserContactInformation.value,
			id: 'emailMandatory',
		},
		{
			title: t('component.adminForm.userRequirements.phoneNumber'),
			isChecked:
				form.value.attributes.userRequirement.phoneNumberMandatory,
			disabled: !showUserContactInformation.value,
			id: 'phoneNumberMandatory',
		},
		{
			title: t('component.adminForm.userRequirements.address'),
			isChecked: form.value.attributes.userRequirement.addressMandatory,
			disabled:
				couldBeAnonymous.value || !showUserContactInformation.value,
			id: 'addressMandatory',
		},
	] as IItem[];
});

const selectedRequiredContactMethods = computed({
	get: () => {
		return requiredContactMethods.value.filter((item) => item.isChecked);
	},
	set: (value: IItem[]) => {
		requiredContactMethods.value.forEach((method) => {
			const shouldBeChecked = value.some((item) => item.id === method.id);

			if (shouldBeChecked !== method.isChecked) {
				updateUserRequirement(method.id, shouldBeChecked);
			}
		});
	},
});

// Allow Application Secondarily

const allowApplicationSecondarily = computed({
	get: () => {
		return form.value.attributes.userRequirement.canApplyForAnother;
	},
	set: (value: boolean) => {
		updateUserRequirement('canApplyForAnother', value);
	},
});
</script>

<style scoped>
.indented-row {
	padding-left: 1rem;
	position: relative;
}

.indented-row::before {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0rem;
	width: 2px;
	background-color: #858585;
}
</style>
