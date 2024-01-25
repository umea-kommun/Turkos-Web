<template>
	<app-content
		v-if="form"
		:pageTitle="form ? form.attributes.title : ''"
		class="form-confirmation"
	>
		<v-card class="rounded-lg">
			<v-card-text>
				<div class="">
					<v-responsive>
						<v-container fill-height class="pa-0">
							<v-layout class="wrap">
								<v-col cols="12" class="text-center pa-0">
									<!-- Animated icon -->
									<div class="sa">
										<div class="sa-success">
											<div class="sa-success-tip"></div>
											<div class="sa-success-long"></div>
											<div
												class="sa-success-placeholder"
											></div>
											<div class="sa-success-fix"></div>
										</div>
									</div>
									<h3 class="text-h3">
										{{
											$t(
												'component.appDescription.confirmationText'
											)
										}}
									</h3>
									<p v-if="formHasFollowUp" class="ces-text">
										{{
											$t(
												'component.appDescription.cesInfo.1'
											)
										}}
										<br />
										{{
											$t(
												'component.appDescription.cesInfo.2'
											)
										}}
										<br />
										{{
											$t(
												'component.appDescription.cesInfo.3'
											)
										}}
									</p>
									<p class="infoReceiver">
										{{
											$t('component.appDescription.text')
										}}
										<a
											:href="
												form.attributes.receiver?.url
											"
											target="_blank"
											>{{
												form.attributes.receiver?.title
											}}</a
										>
									</p>
									<!-- PDF download -->
									<v-btn
										v-if="!form.attributes.simpleEservice"
										variant="outlined"
										flat
										:loading="isDownloadingPdf"
										@click="downloadPdf()"
									>
										<v-icon
											size="22"
											class="left"
											icon="cloud_download"
										/>
										<span>{{
											$t(
												'component.appDescription.download'
											)
										}}</span>
									</v-btn>
								</v-col>

								<!-- Rating stars -->
								<v-col
									cols="12"
									class="text-center mt-5 pa-0"
									@mouseout="scoreThatUserHasCursorOn = -1"
								>
									<fieldset>
										<legend>
											{{
												$t(
													'component.appDescription.rateText'
												)
											}}
										</legend>
										<!-- display 5 stars (representing 5 scores) -->
										<v-btn
											v-for="score in 5"
											:key="score"
											@mouseover="
												scoreThatUserHasCursorOn = score
											"
											@click="() => setUserRating(score)"
											flat
											:disabled="hasCommentedForm"
											icon
											class="rating"
											:ripple="false"
											role="radio"
											:aria-label="
												$t(
													'component.appDescription.rating.' +
														score
												)
											"
											:aria-checked="
												ratingScore === score
											"
										>
											<v-icon
												size="30"
												:class="
													getStarClass(score) +
													' icon_star'
												"
												:icon="getStarIcon(score)"
											/>
										</v-btn>
									</fieldset>
								</v-col>

								<!-- Rating/Comment thank you response -->
								<v-col
									v-if="hasRatedForm && !hasCommentedForm"
									class="pa-2 text-center"
									cols="12"
								>
									{{
										$t(
											'component.appDescription.rateThanks'
										)
									}}
								</v-col>
								<v-col
									v-if="hasCommentedForm"
									class="pa-2 text-center"
									cols="12"
								>
									{{
										$t(
											'component.appDescription.commentThanks'
										)
									}}
								</v-col>

								<!-- Comment form -->
								<v-col
									cols="12"
									v-if="hasRatedForm && !hasCommentedForm"
								>
									<div class="comment-wrapper">
										<v-textarea
											:label="
												$t(
													'component.appDescription.comment'
												)
											"
											v-model="comment"
											box
											color="primary"
											hide-details
											:required="true"
										>
										</v-textarea>
										<v-btn
											variant="outlined"
											primary
											class="mt-3"
											@click="sendComment"
										>
											{{
												$t(
													'component.appDescription.sendComment'
												)
											}}
											<v-icon class="ml-2" icon="send" />
										</v-btn>
									</div>
								</v-col>
							</v-layout>
						</v-container>
					</v-responsive>
				</div>
			</v-card-text>
		</v-card>
	</app-content>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import AppContent from '@/components/app/AppContent.vue';
import { FormFollowUpActivation, MutationType } from '@/models/Enums';
import { IForm, IRootState, IUser } from '@/models/IForm';
import { Helper } from '@/utils/helper';
import { useStore } from 'vuex';
import { getAvailableMetaDataLista } from '@/store/utils';
import { getAnonymousContactInfo } from '@/store/helper';
import { useRouter } from 'vue-router';
import IAuthManager from '@/plugins/auth/IAuthManager';

/**
 * This confirmation page tries to get user feedback in a two-step-rocket approach
 *  1. Let user click on star/score for the e-service (this gets sent to server)
 *  2. A textarea appears where user can leave a comment.
 *    2.b The user can now hange the score if he wants to (but it wont get sent to server immediately when user clicks)
 *    2.c The user sends in the comment + the (possibly changed) score to the server
 */

const auth = inject('$auth') as IAuthManager;
const store = useStore<IRootState>();
const router = useRouter();

const scoreThatUserHasCursorOn = ref<number>(-1);
const ratingScore = ref<number>(0);

const formCopy = ref<IForm>();
const userCopy = ref<IUser>();

const isDownloadingPdf = ref<boolean>(false);
const hasRatedForm = ref<boolean>(false);
const hasCommentedForm = ref<boolean>(false);
const comment = ref<string>('');

const form = computed(() => {
	return formCopy.value;
});

const user = computed(() => {
	return userCopy.value;
});

const formHasFollowUp = computed(() => {
	if (
		form.value?.attributes.followUp.activation ===
		FormFollowUpActivation.Manual
	) {
		return true;
	}
	return false;
});

const availableMetaDataLista = computed(() => {
	const allClientsConfig = auth.getAuthClientsUsedForCitizenLogin();
	return getAvailableMetaDataLista(allClientsConfig);
});

function getStarClass(score: number): string {
	/*
      1. Show interactively the scoring when user hovers the stars with the mouse (interactively=stars light up)
      2. Once the user has clicked on a star (hasRatedForm=true) keep the stars lit up, displaying the score
      3. Keep the interactivity also afterwards the user has clicked on a star
      4. Stop being interactive after that the user has sent in the comment. The user can now no longer change the score
     */
	const userIsHoveringOnStars = scoreThatUserHasCursorOn.value > -1;
	if (
		hasCommentedForm.value ||
		(hasRatedForm.value && !userIsHoveringOnStars)
	) {
		return ratingScore.value >= score ? 'active-hover' : '';
	} else if (score <= scoreThatUserHasCursorOn.value) {
		return 'active-hover';
	}
	return '';
}

function getStarIcon(score: number): string {
	const userIsHoveringOnStars = scoreThatUserHasCursorOn.value > -1;
	if (
		hasCommentedForm.value ||
		(hasRatedForm.value && !userIsHoveringOnStars)
	) {
		return ratingScore.value >= score ? 'star' : 'star_outline';
	} else if (score <= scoreThatUserHasCursorOn.value) {
		return 'star';
	}
	return 'star_outline';
}

async function sendEServiceRatingToServer(): Promise<void> {
	let MtCaptchaToken = '';
	if (!store.state.user.isAuthenticated) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		MtCaptchaToken = (window as any).mtcaptcha.getVerifiedToken(
			'Mt-Captcha'
		);
	}
	store.dispatch('rateEService', {
		form: form.value,
		score: ratingScore.value,
		userComment: comment.value,
		MtCaptchaToken,
	});
}

function setUserRating(score: number): void {
	// dont let user change the score after the comment have been sent in
	if (!hasCommentedForm.value) {
		ratingScore.value = score;
		if (!hasRatedForm.value) {
			// We only send the score the first time user clicks...
			// Now if the user decides to send a comment we will again
			// send the score (which the user then might have changed)
			sendEServiceRatingToServer();
			hasRatedForm.value = true;
		}
	}
}

async function sendComment(): Promise<void> {
	if (comment.value.trim()) {
		sendEServiceRatingToServer();
		hasCommentedForm.value = true;
	}
}

async function downloadPdf(): Promise<void> {
	isDownloadingPdf.value = true;
	let userContactInfo = user.value?.userContactInfo;
	if (!userContactInfo) {
		userContactInfo = getAnonymousContactInfo().userContactInfo;
	}
	const blob = await store.dispatch('getPdf', {
		form: form.value,
		userContactInfo,
		availableMetaDataLista: availableMetaDataLista.value,
		downloadPdf: true,
	});
	const pdfFileName = form.value?.attributes.title + '.pdf';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if ((window.navigator as any).msSaveOrOpenBlob) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window.navigator as any).msSaveOrOpenBlob(blob, pdfFileName);
	} else {
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = pdfFileName;
		document.body.appendChild(link);
		link.click();
	}
	isDownloadingPdf.value = false;
}

// Initialize
if (!store.state.form) {
	// This might happen if reloading page, lets go to start page
	router.push('/');
} else {
	// create copy of form and remove data from storage
	formCopy.value = Helper.deepCopy(store.state.form);
	userCopy.value = Helper.deepCopy(store.state.user);
	store.commit(
		MutationType.UpdateLastFormTitle,
		store.state.form.attributes.title
	);
	store.commit(MutationType.TruncateForm);
}
</script>

<style scoped lang="scss">
.v-jumbotron {
	height: auto !important;
}
.v-layout.wrap {
	flex-wrap: wrap;
}

.form-confirmation {
	.v-card-text {
		font-size: 16px;
	}
	.ces-text {
		margin: 24px 0;
	}
}

.rating {
	margin: 5px;
	padding: 6px;
	width: 40px !important;
	height: 40px !important;
	background-color: transparent;
}
.v-btn-toggle .v-btn {
	opacity: 1 !important;
}
.theme--light.v-btn-toggle {
	background: transparent !important;
}
.v-btn-toggle--selected {
	box-shadow: none !important;
}

.v-btn {
	.v-icon.icon_star {
		transition: all 0.2s ease;
		color: #959393;
	}
	.v-icon.active-hover {
		color: #006e1e !important;
	}
	.v-icon.star {
		color: #006e1e !important;
	}
}
:deep(.v-btn--disabled .v-btn__overlay) {
	opacity: 0 !important;
}
.v-btn--active:before,
.v-btn:hover:before,
.v-btn:focus:before {
	background-color: transparent !important;
}

fieldset {
	border: none;
	legend {
		font-size: size(16);
		font-weight: bold;
	}
}

.comment-wrapper {
	max-width: 500px;
	margin: 0 auto;

	.v-btn {
		float: right;
	}
}

.infoReceiver {
	margin-top: 20px;
	margin-bottom: 16px;
}

.sa {
	width: 140px;
	height: 140px;
	padding: 26px;
	margin-left: auto;
	margin-right: auto;
	border-radius: 100px;

	.sa-success-tip {
		background: $primary;
	}
	.sa-success-long {
		background: $primary;
	}

	&-success {
		border-radius: 50%;
		border: 8px solid $primary;
		box-sizing: content-box;
		height: 80px;
		padding: 0;
		position: relative;
		width: 80px;
		&:after,
		&:before {
			content: '';
			height: 120px;
			position: absolute;
			transform: rotate(45deg);
			width: 60px;
		}
		&:before {
			border-radius: 40px 0 0 40px;
			width: 26px;
			height: 80px;
			top: -17px;
			left: 5px;
			transform-origin: 60px 60px;
			transform: rotate(-45deg);
		}
		&:after {
			border-radius: 0 120px 120px 0;
			left: 30px;
			top: -11px;
			transform-origin: 0 60px;
			transform: rotate(-45deg);
			animation: rotatePlaceholder 4.25s ease-in;
		}
		&-placeholder {
			border-radius: 50%;
			box-sizing: content-box;
			height: 80px;
			left: -4px;
			position: absolute;
			top: -4px;
			width: 80px;
			z-index: 2;
		}
		&-fix {
			height: 90px;
			left: 28px;
			position: absolute;
			top: 8px;
			transform: rotate(-45deg);
			width: 5px;
			z-index: 1;
		}
		&-tip,
		&-long {
			background-color: #fff;
			border-radius: 2px;
			height: 5px;
			position: absolute;
			z-index: 2;
		}
		&-tip {
			left: 14px;
			top: 46px;
			transform: rotate(45deg);
			width: 25px;
			animation: animateSuccessTip 0.75s;
		}
		&-long {
			right: 8px;
			top: 38px;
			transform: rotate(-45deg);
			width: 47px;
			animation: animateSuccessLong 0.75s;
		}
	}
}
@keyframes animateSuccessTip {
	0%,
	54% {
		width: 0;
		left: 1px;
		top: 19px;
	}
	70% {
		width: 50px;
		left: -8px;
		top: 37px;
	}
	84% {
		width: 17px;
		left: 21px;
		top: 48px;
	}
	100% {
		width: 25px;
		left: 14px;
		top: 45px;
	}
}
@keyframes animateSuccessLong {
	0%,
	65% {
		width: 0;
		right: 46px;
		top: 54px;
	}
	84% {
		width: 55px;
		right: 0;
		top: 35px;
	}
	100% {
		width: 47px;
		right: 8px;
		top: 38px;
	}
}
@keyframes rotatePlaceholder {
	0%,
	5% {
		transform: rotate(-45deg);
	}
	100%,
	12% {
		transform: rotate(-405deg);
	}
}
</style>
