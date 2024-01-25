<template>
	<!--Tillgänglighetsjustering: Removes role="form" from app-content element and wraps everyting
	inside a <form>-tag instead.-->
	<form>
		<app-content
			v-if="form || loadFormErrorMessage || isBusyLoadingFromServer"
			:is-loading="isBusyLoadingFormInfo && isBusyLoadingFromServer"
			:errorMessage="
				loadFormErrorMessage +
				(notFoundRedirectTimer !== null
					? ' ' +
					  $t('app.error.formNotFoundRedirectCountdown', [
							notFoundRedirectTimer,
					  ])
					: '')
			"
			:pageTitle="form ? form.attributes.title : ''"
			:allowBotIndexing="form && !form.attributes.hidden"
			:size="contentSize"
			class="app-form"
			v-show="!doLogin"
		>
			<!--Tillgänglighetsjustering: What is the v-snackbar used for?
			Can't be found on the web. Is the role="alert" needed?-->
			<div>
				<v-snackbar
					v-model="sendFormError"
					top
					color="info"
					multi-line
					role="alert"
					:timeout="getSnackbarTimeout()"
				>
					{{ errorMessage }}
				</v-snackbar>
			</div>
			<v-card v-if="form" class="rounded-lg app-form-card">
				<v-layout
					v-if="form.attributes.type === 'LinkExternal'"
					pt-2
					pr-2
					pb-2
					pl-2
					row
					wrap
					align-center
					fill-height
					class="bg-grey-lighten-5"
				>
					<v-container>
						<v-col>
							<v-layout>
								<v-icon
									color="grey-darken-3"
									size="24"
									icon="warning"
								/>
								<h3 class="pl-3">
									{{ $t('app.linkExternal') }}
								</h3>
							</v-layout>
						</v-col>
					</v-container>
				</v-layout>
				<!-- Preview/Test warning -->
				<v-toolbar
					card
					color="warning"
					class="preview-warning pl-2 pb-2 pt-2"
					v-if="previewFormId || testFormId"
				>
					<v-toolbar-title>
						<v-layout row wrap align-center>
							<v-col cols="2">
								<v-icon icon="warning" />
							</v-col>
							<v-col cols="8" class="text-center">
								{{
									$t(
										'component.appForm.' +
											(testFormId
												? 'testWarningTitle'
												: 'previewWarningTitle')
									)
								}}
							</v-col>
						</v-layout>
					</v-toolbar-title>
				</v-toolbar>
				<v-toolbar
					card
					color="warning"
					class="preview-warning pl-2 pb-2 pt-2"
					v-if="previewTestFormId"
				>
					<v-toolbar-title>
						<v-layout row wrap align-center>
							<v-col cols="2"><v-icon icon="warning" /></v-col>
							<v-col cols="8" class="text-center">
								{{
									$t(
										'component.appForm.previewTestWarningTitle'
									)
								}}
							</v-col>
						</v-layout>
					</v-toolbar-title>
				</v-toolbar>
				<v-toolbar
					card
					density="prominent"
					class="bg-grey-lighten-5 pa-0"
					v-if="stepId"
					style="overflow: visible"
				>
					<!-- Title -->
					<v-toolbar-title class="header-form-nav">
						<!-- Cancel -->
						<v-btn
							v-if="isFirstStep && !eServiceHasErrorMessage()"
							flat
							:disabled="sendingForm"
							class="cancel-btn"
							@click="cancel"
						>
							<v-icon size="24" left icon="close" />
							<span>{{ $t('app.nav.cancel') }}</span>
						</v-btn>

						<!-- Go to previous step -->
						<v-btn
							v-if="
								!isLastStep &&
								!isFirstStep &&
								!isMultipleSigningByLink()
							"
							flat
							class="cancel-btn"
							:disabled="sendingForm"
							@click="previousStep()"
						>
							<v-icon size="24" left icon="arrow_back" />
							<span>{{ $t('app.nav.previous') }}</span>
						</v-btn>
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<!-- Feedback -->
					<base-form-progress
						:current-step="currentStep"
						:total-steps="numberSteps"
						:visible-steps="stepsWithVisibleFields"
						:has-review-step="!form.attributes.simpleEservice"
					/>
				</v-toolbar>

				<v-card-text class="pa-0">
					<!-- Expired link stepId && -->
					<v-container
						class="intro"
						v-show="
							multipleSigningByLinkHasBeenUsed() ||
							eServiceHasErrorMessage()
						"
					>
						<h2 v-html="eServiceGetErrorMessage()" />
					</v-container>

					<!-- Description -->
					<v-container
						class="intro"
						v-show="
							!stepId &&
							form &&
							!multipleSigningByLinkHasBeenUsed()
						"
					>
						<!-- Warning about this being a test -->
						<v-alert
							:model-value="!!testFormId || !!previewTestFormId"
							color="warning"
							variant="outlined"
							class="mb-3"
						>
							<div class="text-black">
								<strong>{{
									$t('component.appForm.testWarningInfoTitle')
								}}</strong>
								<br />
								{{
									$t('component.appForm.testWarningInfoText')
								}}
							</div>
						</v-alert>
						<h2 v-if="!isInfoPage" class="pb-4">
							{{ $t('component.appForm.startPageTitle') }}
						</h2>
						<!-- Form description -->
						<div
							class="intro-description"
							v-html="form.attributes.description"
						></div>
						<!-- Info about date schedule -->
						<div
							v-if="isBlockedByDateSchedule"
							class="schedule-info"
						>
							<v-icon
								size="60"
								style="float: left; padding-right: 12px"
								icon="alarm"
								color="black"
							/>
							<h2>
								{{ $t('component.appForm.scheduleInfo.title') }}
							</h2>
							<p v-html="scheduleInfoText"></p>
						</div>
					</v-container>

					<!-- Display form -->
					<div
						v-if="stepId"
						v-show="
							!multipleSigningByLinkHasBeenUsed() &&
							!eServiceHasErrorMessage()
						"
					>
						<!-- Replace with v-stepper when released -->
						<v-window
							v-bind:model-value="parseInt(stepId)"
							:disabled="true"
						>
							<v-window-item
								class="pa-0"
								v-for="(step, index) in formMetaData"
								v-bind:key="index + 1"
								:value="index + 1"
								:style="
									disableWindowAnimation
										? { transition: 'none' }
										: undefined
								"
							>
								<Form
									as=""
									v-slot="{ errors }"
									:ref="
										(el) => {
											validators[step.id] = el;
										}
									"
								>
									<!-- Summary of validation errors, WCAG (3.3.1) -->
									<div :id="'validation-summary-' + stepId">
										<v-container
											v-if="showValidationSummary"
										>
											<form-validation-summary
												:stepId="stepId"
												:validation-errors="{
													...errors,
													...getSubmitErrors(),
												}"
											></form-validation-summary>
										</v-container>
									</div>

									<v-container
										class="pa-6"
										:class="
											step.id === 'review' ? 'review' : ''
										"
									>
										<!-- Step - title & description -->
										<div
											class="step-title"
											v-if="!isLastStep"
										>
											<h2
												:aria-label="
													step.title +
													': ' +
													$t('app.nav.stepFeedback', {
														currentStep: stepId,
														totalSteps: numberSteps,
													})
												"
											>
												{{ step.title }}
											</h2>
											<div
												v-if="step.description"
												class="step-description text-grey-darken-1"
											>
												{{ step.description }}
											</div>
										</div>

										<!-- Display step in EDIT MODE -->

										<v-form
											v-if="
												index <
												form.attributes.steps.length
											"
										>
											<template
												v-for="field in filterOnlyVisibleFields(
													form.attributes.steps[index]
														.fields,
													form
												)"
												:key="field.id"
											>
												<dynamic-field-component
													:ref="
														addDynamicFormFieldRef
													"
													v-if="
														!field.fieldOptions
															.tableGuid &&
														!isTableType(
															field.type
														) &&
														isApplyingForAnother(
															field
														)
													"
													:key="field.id"
													:field="field"
													:validationScope="
														step.id.toString()
													"
													@updatedValue="
														saveUpdatedFormField(
															field.id,
															$event.newValue,
															'value'
														)
													"
													@updatedOptions="
														saveUpdatedFormField(
															field.id,
															$event.newOptions,
															'fieldOptions'
														)
													"
													mode="EDIT"
												></dynamic-field-component>
												<field-table
													:ref="addTableFieldRef"
													v-if="
														isTableType(
															field.type
														) &&
														isApplyingForAnother(
															field
														)
													"
													:tableFields="
														filterTableFields(
															form.attributes
																.steps[index]
																.fields,
															field.guid
														)
													"
													:key="field.id"
													:field="
														field as ITableField
													"
													:stepId="step.id"
													:stepIndex="index"
													:validationScope="
														step.id.toString()
													"
													@updatedOptions="
														saveUpdatedFormField(
															field.id,
															$event.newOptions,
															'fieldOptions'
														)
													"
													mode="EDIT"
												/>
											</template>
										</v-form>

										<!-- Display entire form in REVIEW MODE -->
										<v-form v-if="step.id === 'review'">
											<div
												v-for="stepReview in stepsWithVisibleFields"
												v-bind:key="stepReview.id"
											>
												<h3
													v-if="
														!isMultipleSigningByLink()
													"
													class="step-title title text-h6"
													style="
														background: #f2f2f2;
														padding: 4px;
														margin-bottom: 15px;
													"
												>
													{{ stepReview.title }}
												</h3>
												<div
													v-if="
														isMultipleSigningByLink()
													"
												>
													<h3>
														Följande uppgifter har
														skickats in:
													</h3>
													<p>
														Genom att skicka in det
														här formuläret samtycker
														du till anmälan som
														vårdnadshavare 1 har
														lämnat in.
													</p>
													<br />
												</div>
												<template
													v-for="field in filterOnlyVisibleFields(
														stepReview.fields,
														form
													)"
													:key="field.id"
												>
													<dynamic-field-component
														v-if="
															!field.fieldOptions
																.tableGuid &&
															!isTableType(
																field.type
															) &&
															isApplyingForAnother(
																field
															)
														"
														:key="field.id"
														:field="field"
														:validationScope="
															step.id.toString()
														"
														mode="VIEW"
														class="field"
													/>
													<field-table
														v-if="
															isTableType(
																field.type
															) &&
															isApplyingForAnother(
																field
															)
														"
														:tableFields="
															filterTableFields(
																stepReview.fields,
																field.guid
															)
														"
														:key="field.id"
														:field="
															field as ITableField
														"
														mode="VIEW"
													/>
												</template>
											</div>

											<!-- Multipe Users Contact Informations -->

											<template
												v-if="
													isReviewStep &&
													form.attributes
														.userRequirement
														.multipleLegitimation &&
													(checkIfAnyFieldIsMultipleLegitimation() ||
														previewTestFormId)
												"
											>
												<template
													v-for="userContactInfo in multipleLegitimationUserContactInfos"
													:key="
														userContactInfo.socialSecurityNumber
													"
												>
													<form-contact-info
														:userContactInfo="
															userContactInfo
														"
														:title="
															addMoreTitle(
																guardianTitlePerson(
																	guardianTitlePerson2
																)
															)
														"
														:validationScope="
															step.id
														"
														validationId="kontakter"
														:emailMandatory="true"
														:phoneNumberMandatory="
															true
														"
														:selectedContactPaths="
															form.attributes
																.userRequirement
																.contactPaths
														"
													/>
												</template>
											</template>

											<!-- Users Contact Information -->
											<form-user-contact-info
												v-if="
													isReviewStep &&
													form.attributes
														.userRequirement
														.showUserContactInformation
												"
												:key="
													user.userContactInfo
														? user.userContactInfo
																.socialSecurityNumber
														: 'anonym'
												"
												:userContactInfo="
													user.userContactInfo
														? user.userContactInfo
														: undefined
												"
												:validationScope="step.id"
												:title="
													addMoreTitle(
														guardianTitlePerson(
															guardianTitlePerson1
														)
													)
												"
												validationId="minakontakter"
												:emailMandatory="
													form.attributes
														.userRequirement
														.emailMandatory
												"
												:phoneNumberMandatory="
													form.attributes
														.userRequirement
														.phoneNumberMandatory
												"
												:addressMandatory="
													form.attributes
														.userRequirement
														.addressMandatory
												"
												:notAnonymous="isNotAnonymous()"
											/>

											<!-- GDPR -->
											<form-gdpr
												:dataControllers="
													form.attributes.gDPR
														.dataControllers
												"
												:validationScope="step.id"
											/>
										</v-form>
									</v-container>
								</Form>
							</v-window-item>
						</v-window>
					</div>

					<!-- Edit button visible at bottom right when user is an administrator-->
					<aside>
						<v-fab-transition>
							<v-btn
								aria-disabled="true"
								tabindex="-1"
								v-show="isEditButtonVisible"
								@click="$router.push('/admin/' + form.id)"
								fab
								dark
								style="position: fixed; bottom: 0; right: 0"
								color="accent"
								:aria-label="
									$t('component.appForm.editButtonTitle')
								"
								icon
							>
								<v-icon icon="edit" color="white" />
							</v-btn>
						</v-fab-transition>
					</aside>
				</v-card-text>
				<v-divider v-if="mtCaptchaIsTriggered"></v-divider>
				<v-card-subtitle v-show="showCaptcha">
					<app-loading-spinner
						:is-visible="
							!mtCaptchaIsTriggered && !mtCaptchaIsVerified
						"
					/>
					<v-layout
						pt-2
						pr-2
						pb-2
						pl-2
						row
						wrap
						align-center
						fill-height
						class="mtcaptcha-text"
					>
						<v-col>
							<div class="form-group">
								<p v-if="mtCaptchaIsTriggered">
									Vi använder MTCaptcha för att förhindra
									missbruk av våra e-tjänster som saknar
									inloggning.<br />
									Var god fyll i rutan nedan för att
									fortsätta.
								</p>
								<div class="mtcaptcha-widget" id="Mt-Captcha" />
							</div>
						</v-col>
					</v-layout>
				</v-card-subtitle>
				<v-divider></v-divider>

				<v-card-actions v-if="!isInfoPage" class="bg-grey-lighten-5">
					<v-layout
						pt-2
						pr-2
						pb-2
						pl-2
						row
						wrap
						align-center
						fill-height
					>
						<!-- Form has not started -->
						<v-col
							v-if="
								!stepId &&
								form &&
								!multipleSigningByLinkHasBeenUsed()
							"
							cols="12"
							class="text-center"
						>
							<!-- Login to start -->
							<Teleport to="body">
								<div v-if="doLogin" class="fullscreen-fixed">
									<base-login-methods
										:clientState="clientState"
										:clientNames="clientNames"
										:cancelUrl="cancelUrl"
										:allClientsConfig="allClientsConfig"
									>
									</base-login-methods>
								</div>
							</Teleport>

							<v-checkbox
								v-if="
									form.attributes.userRequirement
										.canApplyForAnother &&
									!form.attributes.simpleEservice &&
									form.attributes.type === 'EService'
								"
								class="d-flex align-center justify-center"
								v-model="checkApplyingForAnother"
								:label="
									$t('component.appForm.applyingForAnother')
								"
								color="primary"
								type="checkbox"
								hide-details
								persistent-hint
							></v-checkbox>
							<!--Denna är till för när fler inloggnings delen ska finnas för e-tjänst -->
							<div v-if="form.attributes.type === 'EService'">
								<v-btn
									class="start-btn"
									v-if="
										!loginedInWithAuthenticatedBeforeStart &&
										!isOnlyAnonymousUser
									"
									:disabled="
										isBlockedByDateSchedule ||
										isBusyLoadingFromServer
									"
									variant="outlined"
									color="primary"
									:loading="
										aboutToLogin || isBusyLoadingFromServer
									"
									@click="
										login();
										aboutToLogin = true;
									"
								>
									<v-icon left size="24" icon="play_arrow" />
									<span v-if="hasStarted">Fortsätt</span>
									<span v-else>{{
										$t('app.nav.start')
									}}</span>
								</v-btn>
								<!-- Start form 🎻 -->
								<v-btn
									v-if="
										loginedInWithAuthenticatedBeforeStart ||
										isOnlyAnonymousUser
									"
									:disabled="
										isBlockedByDateSchedule ||
										isBusyLoadingFromServer
									"
									:loading="isBusyLoadingFromServer"
									color="primary"
									variant="outlined"
									@click="startForm()"
								>
									<v-icon left size="24" icon="play_arrow" />
									<span v-if="hasStarted">Fortsätt</span>
									<span v-else>{{
										$t('app.nav.start')
									}}</span>
								</v-btn>
							</div>

							<!-- Link to external site -->
							<v-btn
								v-if="form.attributes.type === 'LinkExternal'"
								:disabled="isBlockedByDateSchedule"
								variant="outlined"
								color="primary"
								:loading="aboutToLogin"
								@click="goToLink()"
							>
								<v-icon left icon="open_in_new" />
								<span>{{ $t('app.nav.open') }}</span>
							</v-btn>
						</v-col>

						<v-col
							v-if="
								stepId &&
								!multipleSigningByLinkHasBeenUsed() &&
								!eServiceHasErrorMessage()
							"
						>
							<!-- Cancel -->
							<v-btn
								v-if="isFirstStep"
								flat
								:disabled="sendingForm"
								@click="cancel"
								class="cancel-btn"
							>
								<v-icon size="24" left icon="close" />
								<span>{{ $t('app.nav.cancel') }}</span>
							</v-btn>

							<!-- Go to previous step -->
							<v-btn
								v-if="
									!isLastStep &&
									!isFirstStep &&
									!isMultipleSigningByLink()
								"
								flat
								class="cancel-btn"
								:disabled="sendingForm"
								@click="previousStep()"
							>
								<v-icon size="24" left icon="arrow_back" />
								<span>{{ $t('app.nav.previous') }}</span>
							</v-btn>
						</v-col>

						<v-spacer></v-spacer>

						<v-col
							v-if="
								stepId &&
								!multipleSigningByLinkHasBeenUsed() &&
								!eServiceHasErrorMessage()
							"
							class="text-right"
						>
							<!-- Go to next step -->
							<v-btn
								v-if="
									(!isLastStep &&
										!isReviewStep &&
										!form.attributes.simpleEservice) ||
									(form.attributes.simpleEservice &&
										!isStepBeforeReviewStep &&
										!isReviewStep)
								"
								color="primary"
								:disabled="!searchStep"
								variant="outlined"
								@click="nextStep()"
							>
								<span>{{ $t('app.nav.next') }}</span>
								<v-icon
									size="24"
									right
									class="right"
									icon="arrow_forward"
								/>
							</v-btn>

							<!-- Deny form -->
							<v-btn
								v-if="
									isMultipleSigningByLink() &&
									isReviewStep &&
									!testFormId &&
									!previewTestFormId &&
									!form.attributes.simpleEservice
								"
								color="error"
								variant="outlined"
								:loading="sendingFormReject"
								:disabled="
									isAdmin ||
									sendingFormReviewMethod === 'accept'
								"
								@click="confirmReject('reject')"
							>
								<v-icon left>clear</v-icon>
								<span>
									{{ $t('app.nav.reject') }}
								</span>
							</v-btn>

							<!-- Send form -->
							<v-btn
								v-if="
									!testFormId &&
									!previewTestFormId &&
									isReviewStep &&
									!form.attributes.simpleEservice &&
									!isMultipleSigningByLink()
								"
								color="primary"
								variant="outlined"
								:loading="sendingForm"
								:disabled="isAdmin || !mtCaptchaAllowSendIn"
								@click="confirmReview('send')"
							>
								<v-icon left icon="send" />
								<span>
									{{ $t('app.nav.send') }}
								</span>
							</v-btn>

							<!-- Send form as a simple e-service -->
							<v-btn
								v-if="
									form.attributes.simpleEservice &&
									isStepBeforeReviewStep &&
									!testFormId &&
									!previewTestFormId &&
									!isMultipleSigningByLink()
								"
								color="primary"
								variant="outlined"
								:loading="sendingForm"
								:disabled="isAdmin"
								@click="confirmReview('save')"
							>
								<v-icon left icon="save" />
								<span>
									{{ $t('app.nav.save') }}
								</span>
							</v-btn>

							<!-- Approve form -->
							<v-btn
								v-if="
									isMultipleSigningByLink() &&
									isReviewStep &&
									!testFormId &&
									!previewTestFormId &&
									!form.attributes.simpleEservice
								"
								color="primary"
								variant="outlined"
								:loading="sendingForm"
								:disabled="
									isAdmin ||
									sendingFormReviewMethod === 'reject'
								"
								@click="confirmReview('accept')"
							>
								<v-icon left>send</v-icon>
								<span>
									{{ $t('app.nav.accept') }}
								</span>
							</v-btn>

							<!-- Test integration -->
							<v-btn
								v-if="
									(testFormId && isReviewStep) ||
									(testFormId &&
										form.attributes.simpleEservice &&
										isStepBeforeReviewStep) ||
									(previewTestFormId && isReviewStep) ||
									(previewTestFormId &&
										form.attributes.simpleEservice &&
										isStepBeforeReviewStep)
								"
								color="primary"
								variant="outlined"
								:loading="sendingForm"
								:disabled="!isAdmin"
								@click="sendFormToTestIntegrations()"
							>
								<v-icon left>send</v-icon>
								<span>{{ $t('app.nav.testSend') }}</span>
							</v-btn>
						</v-col>
					</v-layout>
				</v-card-actions>
			</v-card>

			<!-- Print / info links -->
			<v-container
				v-show="
					!stepId &&
					!isBlockedByDateSchedule &&
					!isInfoPage &&
					!isLinkExternal
				"
				class="mt-4 extra-info rounded-lg"
			>
				<p class="mb-2" v-if="form && form.attributes.receiver">
					<v-icon size="16" class="mr-1" icon="info" />
					{{ $t('component.appDescription.footerInfo1') }}
					<a
						v-if="form"
						:href="form.attributes.receiver.url"
						target="_blank"
						>{{ form.attributes.receiver.title }}</a
					>
					{{ $t('component.appDescription.footerInfo2') }}
				</p>
				<p
					class="mb-2"
					v-if="
						form &&
						form.attributes.receiver &&
						!form.attributes.simpleEservice &&
						form.attributes.type === 'EService' &&
						!form.attributes.disablePrintPdf
					"
				>
					<v-icon size="16" class="mr-1" icon="print" />
					{{ $t('component.appDescription.footerPrint1') }}
					<a
						:href="'/blankett/' + form.attributes.path"
						target="_blank"
						>{{ $t('component.appDescription.footerPrint2') }}</a
					>
					{{ $t('component.appDescription.footerPrint3') }}
					<a
						v-if="form"
						:href="form.attributes.receiver.url"
						target="_blank"
						>{{ form.attributes.receiver.title }}</a
					>.
				</p>
				<p class="mb-1">
					<v-icon size="16" class="mr-1" icon="policy" />
					<a href="#" @click.prevent="GdprDialogClick()">
						{{ $t('component.appDescription.footerGdpr') }}
					</a>
				</p>
				<base-dialog
					:showDialog="gdprDialog"
					@dialogClose="gdprDialog = false"
				>
					<form-gdpr
						style="padding-top: 0px"
						v-if="gdprDialog"
						:dataControllers="form.attributes.gDPR.dataControllers"
					/>
				</base-dialog>
			</v-container>
		</app-content>
	</form>
</template>

<script setup lang="ts">
import {
	inject,
	computed,
	ref,
	onMounted,
	onUnmounted,
	reactive,
	watch,
} from 'vue';
import { useStore } from 'vuex';
import { IRootState, ITableField, ITableRow } from '@/models/IForm';
import AppContent from '@/components/app/AppContent.vue';
import FormMetaDataModel, {
	IContactInfo,
	IFormField,
	IDisplayRule,
} from '@/models/IForm';
import { IForm, IUserLegitimation } from '@/models/IForm';
import FormGdpr from '@/components/form/FormGdpr.vue';
import VueScrollTo from 'vue-scrollto';
import {
	FormFieldType,
	ErrorCode,
	MutationType,
	FormStatus,
	AppContentSize,
	FormType,
} from '@/models/Enums';
import AppLoadingSpinner from './AppLoadingSpinner.vue';
import FormValidationSummary from '@/components/form/FormValidationSummary.vue';
import FormUserContactInfo from '@/components/form/FormUserContactInfo.vue';
import FormContactInfo from '@/components/form/FormContactInfo.vue';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';
import {
	DateScheduleUtils,
	getAvailableMetaDataLista,
	isVisible,
	isVisibleDisplayRuleGroup,
	isVisibleInAnotherStep,
	isVisibleMeta,
} from '@/store/utils';
import BaseDialog from '@/components/base/BaseDialog.vue';
import BaseFormProgress from '@/components/base/BaseFormProgress.vue';
import FieldTable from '@/components/field/FieldTable.vue';
import { sleep } from '@/store/utils';
import { getAnonymousContactInfo } from '@/store/helper';
import Config from '@/utils/Config';
import IAuthManager from '@/plugins/auth/IAuthManager';
import { Form } from 'vee-validate';
import {
	onBeforeRouteUpdate,
	onBeforeRouteLeave,
	useRoute,
	useRouter,
} from 'vue-router';
import { useI18n } from 'vue-i18n';
import IAuthClientConfig from '@/plugins/auth/IAuthClientConfig';
import ErrorService from '@/utils/ErrorService';
import mtCaptchaHandler from '@/utils/MTCaptchaHandler';
import { setFormMetaTags, unsetFormMetaTags } from '@/utils/FormMetaData';
import { appInsights } from '@/plugins/appInsights';
import { useTConfirmDialog } from '@turkos/components';

/**
 * AppForm ansvarar för att rita ut ett formulär bestående av steg med olika typer av fält.
 * @prop {string} formId - Identifikation av formulär. Används för att hämta data för formulär. Sätts via router.
 * @prop {string} stepId - Vilket steg som ska visas. Sätts via router.
 */

const props = defineProps({
	formPath: String,
	previewFormId: Number, // Used only when wanting to preview a form as admin
	previewTestFormId: Number, // Used only when wanting to preview a form with hidden fields as admin
	testFormId: Number, // Used only when wanting to test an unpublished form
	stepId: {
		// this is actually step index
		type: String,
		default: '',
	},
});

const auth = inject('$auth') as IAuthManager;
const store = useStore<IRootState>();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const user = computed(() => store.state.user);
const form = computed(() => store.state.form as IForm);

const contentSize = ref<AppContentSize>();
let hasSentFormToServer = false;
const hasStarted = ref<boolean>(false);
const formMetaData = reactive<FormMetaDataModel[]>([]);
const numberSteps = ref<number>(0);
const sendingForm = ref<boolean>(false);
const sendingFormReject = ref<boolean>(false);
const sendingFormReviewMethod = ref<string>('');
const sendFormError = ref<boolean>(false);
const isBusyLoadingFormInfo = ref<boolean>(true);
const isBusyLoadingFromServer = ref<boolean>(true);
const loadFormErrorMessage = ref<string>('');
const isEditButtonVisible = ref<boolean>(false);
const showValidationSummary = ref<boolean>(false);
let isBackingAwayFromStartedForm = false;
const aboutToLogin = ref<boolean>(false);
const errorMessage = ref<string>('');
const gdprDialog = ref<boolean>(false);
const guardianTitlePerson1 = ref<string>('1');
const guardianTitlePerson2 = ref<string>('2');

document.cookie = 'currentFileUploadSize=0';

function GdprDialogClick(): boolean {
	gdprDialog.value = !gdprDialog.value;
	return !gdprDialog.value;
}

function formattedDate(date: Date, format: string): string {
	const padStart = (value: number): string =>
		value.toString().padStart(2, '0');
	return format
		.replace(/yyyy/g, padStart(date.getFullYear()))
		.replace(/dd/g, padStart(date.getDate()))
		.replace(/mm/g, padStart(date.getMonth() + 1))
		.replace(/hh/g, padStart(date.getHours()))
		.replace(/ii/g, padStart(date.getMinutes()))
		.replace(/ss/g, padStart(date.getSeconds()));
}

const isInfoPage = computed(() => {
	return form.value?.attributes?.type === FormType.InfoPage;
});

const isLinkExternal = computed(() => {
	return form.value?.attributes?.type === FormType.LinkExternal;
});

const reviewStep = computed(() => {
	return formMetaData.length - 1;
});
const isReviewStep = computed(() => {
	const thisIsReviewStep =
		parseInt(props.stepId, 10) === formMetaData.length - 1;
	const isAnonymousUser = user.value.authClientName === '' ? true : false;
	if (thisIsReviewStep && isAnonymousUser) {
		mtCaptchaHandler.renderCaptchaOnload();
	}
	return thisIsReviewStep;
});

async function goToLink(): Promise<void> {
	window.open(form.value.attributes.linkUrl, '_blank');
	appInsights.trackEvent(
		{ name: 'OpenedExternalEService' },
		{
			formId: form.value.id,
			formTitle: form.value.attributes.title,
			formPath: form.value.attributes.path,
			formModified: form.value.attributes.modified,
		}
	);
}

function cancel(): void {
	(window as Window).location.href = '/';
}

// -- Authentication --
const doLogin = ref<boolean>(false);
const clientState = ref<string>('');
const clientNames = ref<string>('');
const cancelUrl = ref<string>('');
const allClientsConfig = ref<IAuthClientConfig[]>([]);

const availableMetaDataLista = computed(() => {
	const allClientsConfig = auth.getAuthClientsUsedForCitizenLogin();
	return getAvailableMetaDataLista(allClientsConfig);
});
const isAdmin = computed(() => {
	return store.getters.isLoggedInAdmin;
});

const authClient = computed(() => {
	return (
		form.value.attributes.userRequirement.authClient || [
			auth.getDefaultAuthClientUsedForCitizenLogin(),
		]
	);
});

const loginedInWithAuthenticatedBeforeStart = computed(() => {
	return user.value.isAuthenticated;
});
const isOnlyAnonymousUser = computed(() => {
	if (form.value.attributes.userRequirement.authClient.length > 1) {
		return false;
	} else if (form.value.attributes.userRequirement.authClient.length === 1) {
		return form.value.attributes.userRequirement.authClient.find(
			(f) => f === Config.VUE_APP_AUTH_ANONYMOUS_CLIENT_DISPLAY_NAME
		)
			? true
			: false;
	}
	return false;
});
const mustLoginBeforeStart = computed(() => {
	return !user.value.isAuthenticated;
});
const allowAnonymousUser = computed(() => {
	return form.value.attributes.userRequirement.authClient.find(
		(f) => f === Config.VUE_APP_AUTH_ANONYMOUS_CLIENT_DISPLAY_NAME
	)
		? true
		: false;
});

function login(): void {
	if (!user.value.isAuthenticated) {
		let comeBackUrl: string = '';
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('guid') && urlParams.get('contactid')) {
			comeBackUrl =
				route.path +
				reviewStep.value.toString() +
				'?guid=' +
				urlParams.get('guid') +
				'&contactid=' +
				urlParams.get('contactid');
		} else {
			comeBackUrl =
				route.path +
				'/1?applyingForAnother=' +
				form.value.attributes.applyingForAnother;
		}
		const tempLoginUrl = auth.loginCitizen(comeBackUrl, authClient.value);
		clientState.value = tempLoginUrl.split('&state=')[1].split('&')[0];
		clientNames.value = tempLoginUrl
			.split('&client_name=')[1]
			.split('&')[0];
		cancelUrl.value = tempLoginUrl
			.split('&frejaCancelUrl=')[1]
			.split('&')[0];
		allClientsConfig.value = auth.getAllClientsConfig();

		doLogin.value = true;
	}
}

// -- Step --
const currentStep = computed(() => {
	return formMetaData[parseInt(props.stepId, 10) - 1];
});
const searchStep = computed(() => {
	const step = form.value.attributes.steps[parseInt(props.stepId, 10) - 1];
	if (step) {
		const searchBox = step.fields.filter(
			(f) => f.type === FormFieldType.TextSearchBox
		)[0];
		if (searchBox) {
			const searchResponse = searchBox.fieldOptions.searchResponse;
			if (searchResponse) {
				return searchResponse.searchFoundResult;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	return false;
});

const dynamicFormFieldRefs = ref<unknown[]>([]);
const addDynamicFormFieldRef = (el: unknown): void => {
	dynamicFormFieldRefs.value.push(el);
};

// -- Validation / error handling --
function getSubmitErrors(): Map<string, string[]> {
	const submitErrors: any = {};
	// iterate over all form fiels and check if they have any "submit" errors
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(dynamicFormFieldRefs.value || []).forEach((dynamicFormField: any) => {
		const formFieldComponent = dynamicFormField?.$refs?.component;
		const errors = formFieldComponent?.submitErrors;
		if (errors?.length) {
			const messages: string[] = [];
			let i: number = 0;
			const validationId = formFieldComponent.getValidationId;
			errors.forEach((msg: string) => {
				messages[i] = msg;
				i = i + 1;
			});
			submitErrors[validationId] = messages;
		}
	});
	return submitErrors;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validators = reactive<{ [key: string]: any }>({});

const tableFieldRefs = ref<InstanceType<typeof FieldTable>[]>([]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addTableFieldRef = (el: any): void => {
	if (el) {
		tableFieldRefs.value.push(el);
	}
};

async function isValidForm(): Promise<boolean> {
	// Validate current step
	const validatorResult = await validators[currentStep.value.id].validate();

	const isValid =
		validatorResult.valid && Object.keys(getSubmitErrors()).length === 0;

	if (!isValid) {
		// open all table objects that contains invalid fields
		tableFieldRefs.value.forEach((tableField) => {
			if (tableField.rowDisplay === 'objectContainer') {
				tableField.openContainersHavingInvalidFields();
			}
		});
	}
	return isValid;
}
async function clearValidation(): Promise<void> {
	for (const validator of Object.values(validators)) {
		validator.resetForm();
	}
	return;
}
async function clearFormData(): Promise<void> {
	await clearValidation();
	hasStarted.value = false;
	store.commit(MutationType.TruncateForm);
}

function isMultipleSigningByLink(): boolean {
	return store.state.multipleSigningByLink
		? store.state.multipleSigningByLink.isMultipleSigningByLink
		: false;
}
function isWrongUserForLink(): boolean {
	return store.state.multipleSigningByLink
		? store.state.multipleSigningByLink.isWrongUserForLink
		: false;
}
function multipleSigningByLinkHasBeenUsed(): boolean {
	if (store.state.multipleSigningByLink) {
		if (store.state.multipleSigningByLink.linkHasExpired) {
			return true;
		}
		if (store.state.multipleSigningByLink.linkHasBeenCancelled) {
			return true;
		}
		if (store.state.multipleSigningByLink.linkIsAlreadySigned) {
			return true;
		}
	}
	return false;
}
function eServiceHasErrorMessage(): boolean {
	if (store.state.eServiceErrorMessage) {
		if (store.state.eServiceErrorMessage.errorMessage) {
			return hasStarted.value;
		}
	}
	return false;
}
function eServiceGetErrorMessage(): string {
	if (store.state.multipleSigningByLink) {
		if (store.state.multipleSigningByLink.linkHasExpired) {
			return t('app.error.linkExpired').toString();
		}
		if (store.state.multipleSigningByLink.linkHasBeenCancelled) {
			return t('app.error.linkCancelled').toString();
		}
		if (store.state.multipleSigningByLink.linkIsAlreadySigned) {
			return t('app.error.linkSigned').toString();
		}
	}
	if (store.state.eServiceErrorMessage) {
		if (store.state.eServiceErrorMessage.errorMessage) {
			return store.state.eServiceErrorMessage.errorMessage;
		}
	}
	return '';
}

/**
 * Check if filed is hidden and should be shown or not.
 */
function isNotHiddenField(field: IFormField): boolean {
	if (Object.keys(field.fieldOptions).length === 0) {
		return true;
	} else {
		if (
			typeof field.fieldOptions.showToUser === 'undefined' ||
			(field.fieldOptions.showToUser && isReviewStep.value) ||
			props.previewTestFormId
		) {
			return true;
		}
	}
	return false;
}

function isNotDependentOnOtherDataSource(
	field: IFormField,
	visibleFields: IFormField[]
): boolean {
	if (
		field.fieldOptions.dataSource?.options
			?.dependsOnDataSourceSearchParameter
	) {
		switch (field.type) {
			// Single value fields should always be displayed even if the have a data source with parameters
			case FormFieldType.TextBox:
			case FormFieldType.TextArea:
			case FormFieldType.PersonalNumber:
			case FormFieldType.HiddenTextBox:
			case FormFieldType.Numeric:
				return true;
		}
		if (
			field.fieldOptions.dataSource.dataSourceName.includes(
				'SingleEntity'
			)
		) {
			let visible = false;
			field.fieldOptions.dataSource.options.dependsOnDataSourceSearchParameters.forEach(
				(parameter: string) => {
					const visibleField = visibleFields.filter(
						(f) => f.guid === parameter
					);
					if (visibleField.length > 0) {
						visible = true;
					}
				}
			);
			return visible;
		} else {
			if (
				(field.fieldOptions.items &&
					field.fieldOptions.items.length > 0) ||
				(field.fieldOptions.tableRows &&
					field.fieldOptions.tableRows.length > 0)
			) {
				return field.fieldOptions.dataSource.options
					.dependsOnDataSourceSearchParameter;
			} else if (
				field.fieldOptions.tableGuid &&
				field.fieldOptions.tableGuid.length > 0 &&
				visibleFields.filter(
					(f) => f.guid === field.fieldOptions.tableGuid
				).length > 0
			) {
				return field.fieldOptions.dataSource.options
					.dependsOnDataSourceSearchParameter;
			} else {
				return false;
			}
		}
	}
	return true;
}

function filterOnlyVisibleFields(
	fields: IFormField[] | ITableField[],
	form: IForm
): IFormField[] | ITableField[] {
	const visibleFields: IFormField[] = [];
	fields.forEach((field) => {
		if (isNotDependentOnOtherDataSource(field, visibleFields)) {
			if (field.displayRuleGuids?.length > 0) {
				const displayRules = [] as IDisplayRule[];
				const displayRuleGuidsIsNot = [] as IDisplayRule[];
				field.displayRuleGuids.forEach((f) => {
					if (!f.isNot) {
						displayRules.push(
							form.attributes.displayRules.filter(
								(r) => r.guid === f.guid
							)[0]
						);
					} else {
						displayRuleGuidsIsNot.push(
							form.attributes.displayRules.filter(
								(r) => r.guid === f.guid
							)[0]
						);
					}
				});
				const isAlreadyChecked = [] as any;
				displayRules.forEach((displayRule) => {
					const displayRuleIsAnd = field.displayRuleGuids.filter(
						(r) => r.guid === displayRule.guid
					)[0];
					if (!displayRuleIsAnd.isAnd) {
						if (
							isVisible(displayRule, visibleFields, form) ||
							isVisibleMeta(displayRule, user.value)
						) {
							if (visibleFields.indexOf(field) === -1) {
								if (isNotHiddenField(field)) {
									visibleFields.push(field);
								}
							}
						} else if (isVisibleInAnotherStep(displayRule, form)) {
							if (visibleFields.indexOf(field) === -1) {
								if (isNotHiddenField(field)) {
									visibleFields.push(field);
								}
							}
						}
					} else {
						const displayRuleIsAnds = field.displayRuleGuids.filter(
							(r) => r.isAnd
						);
						let isNotVisable = true;
						displayRuleGuidsIsNot.forEach((dp) => {
							const displayRuleIs =
								form.attributes.displayRules.filter(
									(r) => r.guid === dp.guid
								)[0];
							if (
								isVisible(displayRuleIs, visibleFields, form) ||
								isVisibleMeta(displayRuleIs, user.value)
							) {
								if (visibleFields.indexOf(field) === -1) {
									isNotVisable = false;
								}
							} else if (
								isVisibleInAnotherStep(displayRuleIs, form)
							) {
								if (visibleFields.indexOf(field) === -1) {
									isNotVisable = false;
								}
							}
						});
						displayRuleIsAnds.forEach((dp) => {
							isAlreadyChecked.push({
								guid: dp.guid,
								isAnd: dp.isAnd,
								isNot: dp.isNot,
								valid: false,
							});
							const displayRuleIs =
								form.attributes.displayRules.filter(
									(r) => r.guid === dp.guid
								)[0];
							if (
								isVisible(displayRuleIs, visibleFields, form) ||
								isVisibleMeta(displayRuleIs, user.value)
							) {
								if (visibleFields.indexOf(field) === -1) {
									isAlreadyChecked.filter(
										(r: any) => r.guid === dp.guid
									)[0].valid = true;
									if (
										isAlreadyChecked.filter(
											(r: any) => r.valid
										).length === displayRuleIsAnds.length &&
										isNotVisable
									) {
										if (isNotHiddenField(field)) {
											visibleFields.push(field);
										}
									}
								}
							} else if (
								isVisibleInAnotherStep(displayRuleIs, form)
							) {
								if (visibleFields.indexOf(field) === -1) {
									isAlreadyChecked.filter(
										(r: any) => r.guid === dp.guid
									)[0].valid = true;
									if (
										isAlreadyChecked.filter(
											(r: any) => r.valid
										).length === displayRuleIsAnds.length &&
										isNotVisable
									) {
										if (isNotHiddenField(field)) {
											visibleFields.push(field);
										}
									}
								}
							}
						});
					}
				});
				if (
					displayRules.length === 0 &&
					displayRuleGuidsIsNot.length > 0
				) {
					displayRuleGuidsIsNot.forEach((dp) => {
						const displayRuleIs =
							form.attributes.displayRules.filter(
								(r) => r.guid === dp.guid
							)[0];
						if (
							(!isVisible(displayRuleIs, visibleFields, form) &&
								!isVisibleInAnotherStep(displayRuleIs, form)) ||
							!isVisibleMeta(displayRuleIs, user.value)
						) {
							if (visibleFields.indexOf(field) === -1) {
								if (isNotHiddenField(field)) {
									visibleFields.push(field);
								}
							}
						}
					});
				}
			} else if (
				field.displayRuleGroup &&
				Object.prototype.hasOwnProperty.call(
					field.displayRuleGroup,
					'displayRuleGroupGuid'
				) &&
				field?.displayRuleGroup?.displayRuleGroupGuid !== ''
			) {
				if (store.state.form) {
					if (
						isVisibleDisplayRuleGroup(
							field,
							store.state.form,
							availableMetaDataLista.value
						)
					) {
						if (isNotHiddenField(field)) {
							visibleFields.push(field);
						}
					}
				}
			} else {
				if (isNotHiddenField(field)) {
					visibleFields.push(field);
				}
			}
		}
	});
	return visibleFields;
}

/**
 * Skapa metadata för formulär. Behövs för att bygga upp steg och navigering.
 */
function createFormMetaData(): void {
	// Rensa metadata
	Object.assign(formMetaData, []);

	// Skapa metadata för alla steg
	if (form.value.attributes.simpleEservice) {
		numberSteps.value = form.value.attributes.steps.length + 1;
	} else {
		numberSteps.value = form.value.attributes.steps.length + 2;
	}
	for (const step of form.value.attributes.steps) {
		formMetaData.push(
			new FormMetaDataModel(
				step.id.toString(),
				step.title,
				step.description
			)
		);
	}
	// Meta data för granskning och bekräftelse
	formMetaData.push(new FormMetaDataModel('review', 'Granskning', ''));
	formMetaData.push(new FormMetaDataModel('confirmation', 'Bekräftelse', ''));
}

const notFoundTimeout = ref();
const notFoundRedirectTimer = ref<number | null>(null);
function notFoundRedirect(): void {
	clearTimeout(notFoundTimeout.value);

	if (!notFoundRedirectTimer.value) {
		notFoundRedirectTimer.value = 10;
	}
	notFoundRedirectTimer.value -= 1;
	if (notFoundRedirectTimer.value <= 0) {
		window.location.replace('/');
	}
	notFoundTimeout.value = setTimeout(notFoundRedirect, 1000);
}

// Load description/title that can be displayed while loading rest of the form
async function loadFormInfo(): Promise<void> {
	if (
		!props.stepId &&
		!(props.previewFormId || props.testFormId || props.previewTestFormId)
	) {
		try {
			await store.dispatch('getPublicFormInfoByPath', {
				path: props.formPath,
			});
			if (form.value) {
				setFormMetaTags(form.value);
			}
		} catch (error: any) {
			switch (error.message) {
				case ErrorCode.FormNotFound:
					loadFormErrorMessage.value = t(
						'app.error.formNotFound'
					).toString();
					notFoundRedirect();
					break;
				case ErrorCode.FormNotPublished:
					loadFormErrorMessage.value = t(
						'app.error.formNotPublished'
					).toString();
					notFoundRedirect();
					break;
				default:
					throw error;
			}
		}
		isBusyLoadingFormInfo.value = false;
	}
}

/**
 * Visa alla dolda fält
 */
function showHiddenFields(): void {
	form.value.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			if (
				field.type.toLowerCase() ===
				FormFieldType.HiddenTextBox.toLowerCase()
			) {
				store.commit(MutationType.UpdateFormField, {
					fieldId: field.id,
					newValue: { ...field.fieldOptions, showToUser: true },
					fieldProperty: 'fieldOptions',
				});
			}
		});
	});
}

/**
 * Load data from server into store
 */
async function loadFormDataFromServer(): Promise<void> {
	try {
		if (
			props.previewFormId ||
			props.testFormId ||
			props.previewTestFormId
		) {
			const id =
				props.previewFormId ||
				props.testFormId ||
				props.previewTestFormId;
			await store.dispatch('getPublicForm', { id });
			// Redirect to public view if trying to test a published form (you cant test something that is already live!)
			if (
				props.testFormId &&
				form.value.attributes.status === FormStatus.Published
			) {
				router.push('/' + form.value.attributes.path);
			}
			if (props.previewTestFormId) {
				showHiddenFields();
			}
		} else {
			await store.dispatch('getPublicFormByPath', {
				path: props.formPath,
			});
			await sleep(1500);
		}
		createFormMetaData();
	} catch (error: any) {
		switch (error.message) {
			case ErrorCode.FormNotFound:
				loadFormErrorMessage.value = t(
					'app.error.formNotFound'
				).toString();
				notFoundRedirect();
				break;
			case ErrorCode.FormNotPublished:
				loadFormErrorMessage.value = t(
					'app.error.formNotPublished'
				).toString();
				notFoundRedirect();
				break;
			default:
				throw error;
		}
	}
	isBusyLoadingFromServer.value = false;
}

function isCheckItem(item: any): boolean | void {
	const isAnonymous =
		item === Config.VUE_APP_AUTH_ANONYMOUS_CLIENT_DISPLAY_NAME;
	if (!isAnonymous && mustLoginBeforeStart.value) {
		return false;
	} else if (isAnonymous || !mustLoginBeforeStart.value) {
		return true;
	}
}
function startForm(): void {
	const isAuthClient = authClient.value.find(
		(f) => f === user.value.authClientName
	)
		? true
		: false;
	const queryParams: { [key: string]: string } = {};
	if (form.value.attributes.applyingForAnother) {
		queryParams['applyingForAnother'] = 'true';
	}
	const isAnonymousUser = user.value.authClientName === '' ? true : false;
	if (isMultipleSigningByLink()) {
		hasStarted.value = true;
		router.push({
			name: route.name ?? '',
			params: { stepId: reviewStep.value.toString() },
			query: { ...queryParams },
		});
	} else if (isAdmin.value) {
		hasStarted.value = true;
		router.push({
			name: route.name ?? '',
			params: { stepId: '1' },
			query: { ...queryParams },
		});
	} else if (!isAuthClient && !allowAnonymousUser.value) {
		const comeBackUrl = route.path + '?differentLogin=true';
		auth.logout(comeBackUrl, user.value.authClientName);
	} else if (!isAuthClient && !isAnonymousUser && allowAnonymousUser.value) {
		const comeBackUrl = route.path + '?differentLogin=true';
		auth.logout(comeBackUrl, user.value.authClientName);
	} else if (isAuthClient || allowAnonymousUser.value || isAdmin.value) {
		hasStarted.value = true;
		router.push({
			name: route.name ?? '',
			params: { stepId: '1' },
			query: { ...queryParams },
		});
	} else {
		const comeBackUrl = route.path + '?differentLogin=true';
		auth.logout(comeBackUrl, user.value.authClientName);
	}
}

function getSnackbarTimeout(): number {
	return parseInt(Config.VUE_APP_SNACKBAR_TIMEOUT, 10);
}

const showCaptcha = computed(() => {
	const thisIsReviewStep =
		parseInt(props.stepId, 10) === formMetaData.length - 1;
	const isAnonymousUser = user.value.authClientName === '' ? true : false;
	if (thisIsReviewStep && isAnonymousUser) {
		return true;
	}
	return false;
});

/**
 * Compute how much progress that have been made
 */
const progress = computed(() => {
	return Math.ceil((parseInt(props.stepId, 10) / numberSteps.value) * 100);
});

/**
 * Steps with visible fields
 */
const stepsWithVisibleFields = computed(() => {
	return form.value.attributes.steps.filter(
		(step) => filterOnlyVisibleFields(step.fields, form.value).length
	);
});

const isStepBeforeReviewStep = computed(() => {
	const currentStepIndex = stepsWithVisibleFields.value.findIndex(
		(step) => currentStep.value.id.toString() === step.id.toString()
	);
	return currentStepIndex === stepsWithVisibleFields.value.length - 1;
});

/**
 * Get next step that has visible fields
 */
function getNextStepId(currentStep: number): number {
	const nextStep = currentStep + 1;
	if (nextStep > form.value.attributes.steps.length) {
		return nextStep;
	}
	const fields = filterOnlyVisibleFields(
		form.value.attributes.steps[nextStep - 1].fields,
		form.value
	);
	if (fields.length === 0) {
		return getNextStepId(nextStep);
	}

	return nextStep;
}

/**
 * Go on to next step, or review step
 */
async function nextStep(): Promise<void> {
	const validationResult = await isValidForm();

	if (validationResult) {
		// Go to next step
		showValidationSummary.value = false;
		const nextStep = getNextStepId(parseInt(props.stepId, 10)).toString();
		router.push({
			name: route.name!,
			params: { stepId: nextStep },
			query: { ...route.query },
		});

		// Scroll to top of form
		VueScrollTo.scrollTo('.step-title', 0, {
			offset: -20,
			onDone: (element: HTMLElement) => {
				element.focus();
			},
		});
	} else {
		// Show validation summary, scroll and place focus there
		showValidationSummary.value = true;
		VueScrollTo.scrollTo('#validation-summary-' + props.stepId, 0, {
			offset: -20,
			onDone: (element: HTMLElement) => {
				const link = element.querySelector('a');
				link?.focus();
			},
		});
	}
}
/**
 * Get previous step that has visible fields
 */
function getPreviousStepId(currentStep: number): number {
	const previousStep = currentStep - 1;
	if (previousStep <= 0) {
		return 0;
	}
	const fields = filterOnlyVisibleFields(
		form.value.attributes.steps[previousStep - 1].fields,
		form.value
	);
	if (fields.length === 0) {
		return getPreviousStepId(previousStep);
	}

	return previousStep;
}

function previousStep(): void {
	const previousStep = getPreviousStepId(parseInt(props.stepId, 10));
	router.replace({
		name: route.name!,
		params: { stepId: previousStep.toString() },
		query: { ...route.query },
	});
	// Scroll to top of form
	VueScrollTo.scrollTo('.step-title', 0, {
		offset: -20,
		onDone: (element: HTMLElement) => {
			element.focus();
		},
	});
}

const isFirstStep = computed(() => {
	return (
		parseInt(props.stepId, 10) === 1 ||
		getPreviousStepId(parseInt(props.stepId)) === 0
	);
});

const isLastStep = computed(() => {
	return parseInt(props.stepId, 10) === formMetaData.length;
});

async function sendInForm(
	dispatchMethod: string,
	MtCaptchaToken?: string,
	reviewMethod?: string
): Promise<void> {
	let error = false;
	const validationResult = await isValidForm();
	if (validationResult) {
		// Go to next step
		showValidationSummary.value = false;
		if (reviewMethod === 'reject') {
			sendingFormReject.value = true;
		} else {
			sendingForm.value = true;
		}
		sendingFormReviewMethod.value = reviewMethod ? reviewMethod : '';
		try {
			let userContactInfo = user.value.userContactInfo;
			if (!userContactInfo) {
				userContactInfo = getAnonymousContactInfo().userContactInfo;
			}

			store.commit(MutationType.RemoveValuesFromHiddenFields, {
				availableMetaDataLista: availableMetaDataLista.value,
			});

			store.commit(MutationType.FormatFormFieldOutput);

			const blob = await store.dispatch('getPdf', {
				form: form.value,
				userContactInfo,
				availableMetaDataLista: availableMetaDataLista.value,
				downloadPdf: false,
			});

			await store.dispatch(dispatchMethod, {
				blob,
				MtCaptchaToken,
				reviewMethod,
			});

			store.commit(MutationType.FieldLoadingDataSourceReset);

			hasSentFormToServer = true;
		} catch (err) {
			ErrorService.onError({ err });
			error = !!err;
		}
		if (reviewMethod === 'reject') {
			sendingFormReject.value = false;
		} else {
			sendingForm.value = false;
		}
		sendingFormReviewMethod.value = '';
		if (!error) {
			// Go to confirm page
			router.push({ name: 'AppFormConfirmation' });
		}
	} else {
		// Show validation summary, scroll and place focus there
		showValidationSummary.value = true;
		VueScrollTo.scrollTo('#validation-summary-' + props.stepId, 0, {
			offset: -20,
			onDone: (element: HTMLElement) => {
				element.focus();
			},
		});
	}
}
async function confirmReview(reviewMethod: string): Promise<void> {
	if (allowAnonymousUser.value && !user.value.isAuthenticated) {
		const mtcaptcha = await mtCaptchaHandler.getMTCaptchaToken();
		await sendInForm('sendFormAnonymous', mtcaptcha);
	} else {
		await sendInForm('sendForm', undefined, reviewMethod);
	}
}
const { tConfirmDialogAsync } = useTConfirmDialog();
async function confirmReject(reviewMethod: string): Promise<void> {
	const rejectConfirmed = await tConfirmDialogAsync(
		t('component.appForm.reject.title'),
		t('component.appForm.reject.text'),
		{ text: t('app.nav.yes'), color: 'error' },
		{ text: t('app.nav.no') }
	);
	if (rejectConfirmed) {
		if (allowAnonymousUser.value && !user.value.isAuthenticated) {
			const MtCaptchaToken = await mtCaptchaHandler.getMTCaptchaToken();

			await sendInForm('sendFormAnonymous', MtCaptchaToken);
		} else {
			await sendInForm('sendForm', undefined, reviewMethod);
		}
	}
}
async function sendFormToTestIntegrations(): Promise<void> {
	await sendInForm('sendFormToTestIntegrations');
}

const isBlockedByDateSchedule = computed(() => {
	return (
		form.value &&
		DateScheduleUtils.isScheduled(form.value) &&
		!DateScheduleUtils.isScheduledToBeVisibleNow(form.value)
	);
});

const scheduleInfoText = computed(() => {
	const lastDate = new Date(form.value.attributes.dateSchedule.to);
	const hasPassedLastScheduleDate = new Date().getTime() > lastDate.getTime();
	if (DateScheduleUtils.hasPassedScheduledDate(form.value)) {
		let receiverLink = '';
		if (form.value.attributes.receiver) {
			receiverLink = `<a href="${form.value.attributes.receiver.url}" target="_blank">
          ${form.value.attributes.receiver.title}
        </a>`;
		}
		return t('component.appForm.scheduleInfo.infoClosed', [receiverLink]);
	} else {
		const openDate = new Date(form.value.attributes.dateSchedule.from);
		// <strong>Måndag, 24:e oktober 2019 kl. 10:00</strong>
		const dateString = '%day%, %date%:%dateEnd% %month% %year% kl. %time%'
			.replace('%day%', t('app.days.day' + openDate.getDay()).toString())
			.replace('%date%', openDate.getDate().toString())
			.replace(
				'%dateEnd%',
				openDate.getDate().toString().substr(-1) === '1' ? 'a' : 'e'
			)
			.replace(
				'%month%',
				t('app.months.month' + openDate.getMonth()).toString()
			)
			.replace('%year%', openDate.getFullYear().toString())
			.replace('%time%', DateScheduleUtils.getClockTime(openDate));
		return t('component.appForm.scheduleInfo.infoSoonOpen', [dateString]);
	}
});

/**
 * Set if edit bottom be visible after a small timeout
 */
function setEditButton(): void {
	setTimeout(() => {
		if (isAdmin.value && props.formPath) {
			isEditButtonVisible.value = true;
		}
	}, 1000);
}
function isTableType(type: FormFieldType | string): boolean {
	return type === FormFieldType.Table;
}
function isApplyingForAnother(field: IFormField): boolean {
	if (form.value.attributes.userRequirement.canApplyForAnother) {
		if (form.value.attributes.applyingForAnother) {
			return true;
		} else if (!field.displayRuleAnother) {
			return true;
		}
		return false;
	}
	return true;
}
const checkApplyingForAnother = computed({
	get: () => {
		return form.value.attributes.applyingForAnother;
	},
	set: (event: boolean) => {
		store.commit(MutationType.UpdateFormProperty, {
			newValue: event,
			fieldProperty: 'applyingForAnother',
		});
	},
});

function filterTableFields(fields: IFormField[], guid: string): IFormField[] {
	if (!form.value.attributes.applyingForAnother) {
		const filteradFields: IFormField[] = [];
		fields.forEach((field) => {
			if (isApplyingForAnother(field)) {
				filteradFields.push(field);
			}
		});
		return filterOnlyVisibleFields(filteradFields, form.value).filter(
			(f) => f.fieldOptions.tableGuid === guid
		);
	} else {
		return filterOnlyVisibleFields(fields, form.value).filter(
			(f) => f.fieldOptions.tableGuid === guid
		);
	}
}
function checkIfAnyFieldIsMultipleLegitimation(): boolean {
	let multipleLegitimation = false;
	form.value.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			if (field.type === FormFieldType.Table) {
				if (field.fieldOptions.tableRows) {
					field.fieldOptions.tableRows.forEach(
						(tableRow: ITableRow) => {
							tableRow.columns.forEach((column: any) => {
								if (column.contactInfos) {
									const contactInfo =
										column.contactInfos.filter(
											(c: any) =>
												c.id.toString() ===
												column.value.toString()
										);
									if (contactInfo.length > 0) {
										multipleLegitimation = true;
									}
								}
							});
						}
					);
				}
			} else {
				if (field.fieldOptions.contactInfo) {
					multipleLegitimation = true;
				}
			}
		});
	});
	return multipleLegitimation;
}
const multipleLegitimationUserContactInfos = computed(() => {
	if (!isMultipleSigningByLink()) {
		const userContactInfos = [] as IContactInfo[];
		form.value.attributes.steps.forEach((step) => {
			step.fields.forEach((field) => {
				if (field.type === FormFieldType.Table) {
					if (field.fieldOptions.tableRows) {
						field.fieldOptions.tableRows.forEach(
							(tableRow: ITableRow) => {
								tableRow.columns.forEach((column: any) => {
									if (column.contactInfos) {
										column.contactInfos.forEach(
											(element: IContactInfo) => {
												if (
													element.id.toString() ===
													column.value.toString()
												) {
													userContactInfos.push(
														element as IContactInfo
													);
												}
											}
										);
									}
								});
							}
						);
					}
				} else {
					if (field.fieldOptions.contactInfo) {
						field.fieldOptions.contactInfo.forEach(
							(element: IContactInfo) => {
								if (element.isSelected) {
									userContactInfos.push(
										element as IContactInfo
									);
								}
							}
						);
					}
				}
			});
		});

		if (props.previewTestFormId && !userContactInfos.length) {
			userContactInfos.push({
				id: 'test',
				childSocialSecurityNumber: '1212121212',
				childName: 'Test-Barnet',
				childFirstName: 'Test',
				childLastName: 'Barnet',
				socialSecurityNumber: '1212121212',
				name: 'Test-Förälder',
				address: 'Test-Adress',
				postalNumber: '12345',
				city: 'Umeå',
				phoneNumber: '',
				email: '',
				isSelected: false,
				contactPath: 0,
			});
			if (!form.value.attributes.userContactInfos?.length) {
				store.commit(MutationType.UpdateFormContactInfos, {
					newValue: userContactInfos,
				});
			}
		} else {
			store.commit(MutationType.UpdateFormContactInfos, {
				newValue: userContactInfos,
			});
		}
	}
	return form.value.attributes.userContactInfos;
});

const mtCaptchaIsTriggered = computed(() => {
	return store.state.mtCaptcha.isTriggered;
});

const mtCaptchaIsVerified = computed(() => {
	return store.state.mtCaptcha.isVerified;
});

const mtCaptchaAllowSendIn = computed(() => {
	const isAnonymousUser = user.value.authClientName === '' ? true : false;
	if (isAnonymousUser) {
		return mtCaptchaIsVerified.value;
	} else {
		return true;
	}
});

function addMoreTitle(value: string): string {
	if (
		form.value.attributes.userContactInfos &&
		form.value.attributes.userContactInfos.length > 0
	) {
		return (
			' ' +
			t('component.formUserContactInfo.guardianTitle').toString() +
			' ' +
			value
		);
	}
	return '';
}
function isNotAnonymous(): boolean {
	if (isAdmin.value) {
		return isAdmin.value;
	} else if (user.value.authClientName && user.value.authClientName !== '') {
		return form.value.attributes.userRequirement.authClient.find(
			(f) => f === user.value.authClientName
		)
			? true
			: false;
	} else {
		return false;
	}
}
function saveUpdatedFormField(
	fieldId: string,
	newValue: any,
	fieldProperty: string
): void {
	store.commit(MutationType.UpdateFormField, {
		fieldId,
		newValue,
		fieldProperty,
	});
}
function guardianTitlePerson(value: string): string {
	if (value === '1' && isMultipleSigningByLink()) {
		return '2';
	} else if (value === '2' && isMultipleSigningByLink()) {
		return '1';
	} else {
		return value;
	}
}

// Handle route changes
onBeforeRouteUpdate((to, from, next) => {
	if (!to.params.stepId && hasStarted.value) {
		isBackingAwayFromStartedForm = true;
	} else {
		isBackingAwayFromStartedForm = false;
	}
	next();
});
onBeforeRouteLeave(async (to, from, next) => {
	if (!hasSentFormToServer && isBackingAwayFromStartedForm) {
		const cancelConfirmed = await tConfirmDialogAsync(
			t('component.appForm.cancel.title'),
			t('component.appForm.cancel.text'),
			{
				text: t('app.nav.yes') + ', ' + t('app.nav.cancel'),
			},
			{ text: t('app.nav.no') + ', ' + t('app.nav.back') }
		);
		if (cancelConfirmed) {
			clearFormData();
			next();
		}
	} else {
		next();
	}
});

const disableWindowAnimation = ref(false);

function skipFirstStepIfHidden(): void {
	// If the first step doesn't have any visible fields, skip to next step with fields
	if (props.stepId == '1' && form.value?.attributes?.steps?.length) {
		const fields = filterOnlyVisibleFields(
			form.value.attributes.steps[0].fields,
			form.value
		);
		if (fields.length === 0) {
			disableWindowAnimation.value = true;
			const nextStep = getNextStepId(1).toString();
			router.replace({
				name: route.name ?? '',
				params: { stepId: nextStep },
			});
			setTimeout(() => {
				disableWindowAnimation.value = false;
			}, 100);
		}
	}
}
watch(() => props.stepId, skipFirstStepIfHidden);

// Warning when leaving page
onMounted(() => {
	window.onbeforeunload = () => {
		if (hasStarted.value) {
			return t('component.appForm.cancel.text');
		}
	};
});
onUnmounted(() => {
	window.onbeforeunload = () => {
		// unsetting beforeunload
	};
	unsetFormMetaTags();
});

// Initialize
onMounted(async () => {
	// Temporary redirect to old admin (remove when no need for old admin)
	if (props.formPath === 'adminold') {
		if (window.location.href.indexOf('e.umea.se') > 0) {
			window.location.href =
				'https://ume-basicuse-app-prod.azurewebsites.net/admin';
		} else if (window.location.href.indexOf('etest.umea.se') > 0) {
			window.location.href =
				'https://ume-basicuse-app-test.azurewebsites.net/admin';
		} else {
			window.location.href =
				'https://ume-basicuse-app-dev.azurewebsites.net/admin';
		}
	}

	contentSize.value = route.meta
		? (route.meta.contentSize as AppContentSize)
		: AppContentSize.Default;

	store.commit(MutationType.FieldLoadingDataSourceReset); // No data sources currently loading

	// No need to await loadFormInfo, we are doing both requests simultaneously
	loadFormInfo();
	await loadFormDataFromServer();
	const urlParams = new URLSearchParams(window.location.search);
	const applyingForAnother = urlParams.get('applyingForAnother') || '';
	const differentLogin = urlParams.get('differentLogin') || '';
	const frejaEIDError = urlParams.get('frejaEIDError') || '';

	if (frejaEIDError === '1') {
		sendFormError.value = true;
		errorMessage.value = t('app.error.frejaEIDError');
	}

	if (!differentLogin && user.value.authClientName !== '') {
		const isAuthClient = authClient.value.find(
			(f) => f === user.value.authClientName
		)
			? true
			: false;
		if (
			!isAuthClient &&
			!allowAnonymousUser.value &&
			!isAdmin.value &&
			form.value.attributes.type !== FormType.LinkExternal &&
			form.value.attributes.type !== FormType.InfoPage
		) {
			const comeBackUrl = route.path + '?differentLogin=true';
			auth.logout(comeBackUrl, user.value.authClientName);
		}
	}

	if (applyingForAnother || differentLogin) {
		if (applyingForAnother) {
			if (JSON.parse(applyingForAnother)) {
				store.commit(MutationType.UpdateFormProperty, {
					newValue: applyingForAnother,
					fieldProperty: 'applyingForAnother',
				});
			}
		}
		if (differentLogin) {
			sendFormError.value = true;
			errorMessage.value = t('app.auth.loggingOutDifferentLogin');
			let comeBackUrl: string = '';
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get('guid') && urlParams.get('contactid')) {
				comeBackUrl =
					route.path +
					reviewStep.value.toString() +
					'?guid=' +
					urlParams.get('guid') +
					'&contactid=' +
					urlParams.get('contactid');
			} else {
				comeBackUrl =
					route.path +
					'/1?applyingForAnother=' +
					form.value.attributes.applyingForAnother;
			}
			const tempLoginUrl = auth.loginCitizen(
				comeBackUrl,
				authClient.value
			);

			clientState.value = tempLoginUrl.split('&state=')[1].split('&')[0];
			clientNames.value = tempLoginUrl
				.split('&client_name=')[1]
				.split('&')[0];
			cancelUrl.value = tempLoginUrl
				.split('&frejaCancelUrl=')[1]
				.split('&')[0];
			if (cancelUrl.value.indexOf('?') > 0) {
				const cleanUri = cancelUrl.value.substring(
					0,
					cancelUrl.value.indexOf('?')
				);
				cancelUrl.value = cleanUri;
			}
			allClientsConfig.value = auth.getAllClientsConfig();

			doLogin.value = true;
		}
	}
	if (urlParams.get('guid') && urlParams.get('contactid')) {
		if (store.state.user.isAuthenticated) {
			isBusyLoadingFromServer.value = true;
			if (!route.path.includes(reviewStep.value.toString())) {
				window.location.replace(
					route.path +
						reviewStep.value.toString() +
						'?guid=' +
						urlParams.get('guid') +
						'&contactid=' +
						urlParams.get('contactid')
				);
			}
			await store.dispatch('getMultipleSigning', {
				guid: urlParams.get('guid'),
				id: urlParams.get('contactid'),
			});
			isBusyLoadingFromServer.value = false;
			if (!isMultipleSigningByLink()) {
				if (isWrongUserForLink()) {
					sendFormError.value = true;
					errorMessage.value = t('app.error.wrongUser');
					router.replace('/' + form.value.attributes.path);
				}
			}
		}
	}

	if (form.value) {
		const AnonymExists = form.value.attributes.userRequirement.authClient
			? form.value.attributes.userRequirement.authClient.find(
					(f) =>
						f === Config.VUE_APP_AUTH_ANONYMOUS_CLIENT_DISPLAY_NAME
			  )
				? true
				: false
			: false;
		if (
			props.stepId === '1' ||
			(props.stepId === reviewStep.value.toString() &&
				isMultipleSigningByLink())
		) {
			if (!AnonymExists && !user.value.isAuthenticated) {
				// dont allow users to jump to a specific step via url
				router.replace('/' + form.value.attributes.path);
			} else {
				hasStarted.value = true;
			}
		} else if (props.stepId) {
			// dont allow users to jump to a specific step via url
			router.replace('/' + form.value.attributes.path);
		}
		skipFirstStepIfHidden();

		// Set if edit button should be visible
		setEditButton();

		const AuthClientNameExists = form.value.attributes.userRequirement
			.authClient
			? form.value.attributes.userRequirement.authClient.find(
					(f) => f === user.value.authClientName
			  )
				? true
				: false
			: false;
		if (user.value.isAuthenticated && AuthClientNameExists) {
			const usersLegitimations = form.value.attributes.usersLegitimations
				? form.value.attributes.usersLegitimations
				: ([] as IUserLegitimation[]);
			if (
				usersLegitimations.findIndex(
					(f) => f.name === user.value.fullName
				) === -1
			) {
				store.commit(MutationType.UpdateFormUsersLegitimations, {
					refId: user.value.userId,
					name: user.value.fullName,
					legitimizedMethod: user.value.idp,
					legitimizedDateTime: formattedDate(
						new Date(),
						'yyyy-mm-dd hh:ii:ss'
					),
				});
			}
		}
	}
});
</script>

<style lang="scss">
.app-form {
	.app-form-card .v-card__loader {
		display: none;
	}

	.start-btn {
		&.v-btn--disabled {
			opacity: 1;
		}
	}
	.intro-description {
		ol,
		ul {
			padding-left: 24px;
		}
	}

	.warning-icon {
		font-size: 35px;
		float: left;
		position: relative;
	}

	.schedule-info {
		background: #f9f9f9;
		padding: 12px 12px 8px;
		border-radius: 3px;
		margin-top: 35px;
	}

	.preview-warning {
		.v-toolbar__title {
			width: 100%;
		}
	}

	// Justera layout för Toolbar
	.v-toolbar__content {
		padding: 0 !important;
		height: auto !important; // very important or else long titles won't fit in the toolbar on small screens
	}

	.header-form-nav {
		margin-top: 6px;
	}
	.v-toolbar__title {
		white-space: normal;
	}

	.v-toolbar .v-progress-circular {
		margin: 10px;
	}

	.v-toolbar__items {
		padding: 10px;
	}

	.extra-info {
		border: #bbb solid 1px;
		border-radius: 3px;
		opacity: 0.8;
	}

	.cancel-btn {
		font-size: size(14);
	}

	// Make buttons a bit less wide (except primary)
	.v-card-actions button,
	.v-toolbar button {
		padding-left: 8px;
		padding-right: 8px;

		&.text-primary {
			padding-left: 15px;
			padding-right: 15px;
		}

		.v-icon {
			margin-right: 3px;
		}
	}

	// Öka marginal nedanför stegtitel
	.step-title {
		padding-bottom: 30px;
		font-weight: 500;
		line-height: 1 !important;
		letter-spacing: 0.02em !important;
	}

	.step-description {
		margin-top: 6px;
	}

	// Ta bort skugga för stegbakgrund
	.v-stepper {
		box-shadow: none;
	}

	// Container for field
	.field {
		padding-bottom: 20px;
		margin-bottom: 20px;
		border-bottom: 1px solid $grey-lighten-3;
	}

	.review {
		.field.field-section {
			border-bottom: 0;
			padding-bottom: 0;
			margin-bottom: 0;
		}
	}

	// Fix för att input-fält som är inaktiverade i IOS ska ha full opacity
	.v-input input[disabled],
	.v-input textarea[disabled] {
		opacity: 1 !important;
	}

	// Error message or helpText for inputs should scale with browser font size (WCAG)
	.v-input .v-input__details .v-messages {
		font-size: size(14);
	}

	.print-btn {
		text-transform: none;
		font-weight: normal;
	}

	.mtcaptcha-text {
		margin-top: 12pt;
		text-align: center;
		color: black;
		font-size: size(16);
		p {
			white-space: initial;
		}
	}

	.mtcaptcha-widget {
		display: block;
		margin-top: 10px;
		margin-left: auto;
		margin-right: auto;
		width: 405px;
		@media screen and (max-width: 600px) {
			width: 100%;
		}
	}
}
</style>
