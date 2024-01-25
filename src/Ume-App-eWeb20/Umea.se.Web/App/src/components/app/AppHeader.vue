<template>
	<header class="app-header mb-4">
		<div class="demo-alert pl-2 pr-2" v-if="usingMockedData">
			<p>
				<strong>OBS!</strong> Denna applikation är inställd att ge en
				demonstration av den funktionalitet som erbjuds. All information
				lagras lokalt. Vissa funktioner i gränssnittet är delvis
				inaktiverade.
				<v-btn small variant="outlined" @click="resetMockedData"
					>Återställ data</v-btn
				>
			</p>
		</div>
		<div v-if="warningBanner" class="warning-banner-wrap">
			<v-container class="pa-0">
				<v-layout class="warning-banner">
					<v-col :class="sizeClasses">
						<v-alert icon="warning" type="error">
							{{ warningBanner.text }}
						</v-alert>
					</v-col>
				</v-layout></v-container
			>
		</div>

		<div>
			<!-- Cookie Banner -->
			<t-cookie-banner :url-cookies-info="Config.VUE_APP_COOKIE_URL" />

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

			<v-container class="pt-0 pb-0">
				<v-layout class="content-layout">
					<v-col :class="sizeClasses" class="content-flex pa-0">
						<div class="pt-6 pb-6">
							<!-- Skip to content for easy access to content when navigating using
							keyboard and screen readers [WCAG 2.4, navigation] -->
							<div id="skip">
								<a
									href="#main-content"
									class="subheading text-center"
									>{{ $t('app.nav.skipToContent') }}</a
								>
							</div>
							<div>
								<a href="/" class="tag-line">
									{{ $t('component.appHeader.appName') }}
								</a>
								<h1
									v-if="
										route.name === 'AppStart' ||
										route.name === 'AppStartSortedByName'
									"
								>
									{{ $t('app.route.AppStart') }}
								</h1>
								<h1 v-if="isVisitingAdmin()">
									{{ $t('app.route.AdminListForms') }}
								</h1>
								<h1
									v-if="
										route.name !== 'AppStart' &&
										!isVisitingAdmin() &&
										form
									"
								>
									{{ form.attributes.title }}
								</h1>
								<h1
									v-if="
										route.name === 'AppFormConfirmation' &&
										lastFormTitle
									"
								>
									{{ lastFormTitle }}
								</h1>
							</div>
						</div>
					</v-col>
				</v-layout>
			</v-container>
		</div>
		<div class="app-horizontal-nav">
			<v-container class="pt-0 pb-0">
				<v-layout class="content-layout pt-0 pb-0 overflow-visible">
					<v-col :class="sizeClasses" class="pa-0 content-flex">
						<div flat class="nav-bar-card overflow-visible">
							<v-layout
								align-end
								justify-space-between
								class="overflow-visible"
							>
								<v-col class="pa-0 nav-bar-col">
									<v-menu
										id="user-menu-dialog"
										aria-labelledby="userMenuButton"
										attach
										scroll-strategy="none"
									>
										<template v-slot:activator="{ props }">
											<v-btn
												flat
												color="primary"
												id="userMenuButton"
												aria-haspopup="true"
												aria-controls="user-menu-dialog"
												v-bind="props"
											>
												<v-icon
													size="22"
													color="white"
													icon="menu"
													class="left"
												/>
												{{
													$t(
														'component.appHeader.navigation'
													)
												}}
											</v-btn>
										</template>
										<nav class="v-menu__content">
											<v-list class="main-drop-down-menu">
												<v-list-item href="/">
													<v-list-item-title
														:class="
															route.path == '/'
																? 'active'
																: ''
														"
													>
														<v-icon
															size="small"
															icon="chevron_right"
														/>
														{{
															$t(
																'component.appHeader.menu.allServices'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<v-list-item
													:href="mainSiteUrl"
													target="blank"
												>
													<v-list-item-title>
														{{
															$t(
																'component.appHeader.menu.mainSite'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<v-list-item
													:href="errorReportUrl"
													target="blank"
												>
													<v-list-item-title>
														{{
															$t(
																'component.appHeader.menu.errorReport'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<v-list-group
													v-if="helpLinks.length"
												>
													<template
														v-slot:activator="{
															props,
														}"
													>
														<v-list-item
															v-bind="props"
															@click.stop
															>{{
																$t(
																	'component.appHeader.menu.help.title'
																)
															}}</v-list-item
														>
													</template>
													<v-list-item
														v-for="helpLink in helpLinks"
														:key="
															helpLink.url +
															helpLink.title
														"
														:href="helpLink.url"
														target="blank"
													>
														<v-list-item-title>
															{{ helpLink.title }}
														</v-list-item-title>
													</v-list-item>
												</v-list-group>
												<v-list-item
													v-if="
														availabilityStatementUrl
													"
													:href="
														availabilityStatementUrl
													"
													target="blank"
												>
													<v-list-item-title>
														{{
															$t(
																'component.appHeader.menu.availabilityStatement'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<v-list-item
													:href="aboutPageUrl"
													target="blank"
												>
													<v-list-item-title>
														{{
															$t(
																'component.appHeader.menu.about'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<v-divider v-if="isAdmin" />
												<!--Tillgänglighetsjustering: Removes role="menuitem"
												from <v-list-item>-->
												<v-list-item
													v-if="isAdmin"
													@click="
														routerPush('/admin')
													"
													@keydown.enter.space.prevent="
														routerPush('/admin')
													"
												>
													<v-list-item-title
														:class="
															route.path ==
															'/admin'
																? 'active'
																: ''
														"
													>
														<v-icon
															size="small"
															icon="chevron_right"
														/>
														{{
															$t(
																'component.appHeader.menu.admin'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<!-- Managementobject-->
												<v-list-item
													v-if="isAdmin"
													@click="
														showPm3Dialog = true
													"
													@keydown.enter.space.prevent="
														showPm3Dialog = true
													"
												>
													<v-list-item-title>
														{{
															$t(
																'component.adminForm.menu.managementobject'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<!-- Receivers-->
												<v-list-item
													v-if="isAdmin"
													@click="
														showReceiverDialog = true
													"
													@keydown.enter.space.prevent="
														showReceiverDialog = true
													"
												>
													<v-list-item-title>
														{{
															$t(
																'component.adminForm.menu.receiver'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<!-- Gdpr-->
												<v-list-item
													v-if="isAdmin"
													@click="
														showGdprDialog = true
													"
													@keydown.enter.space.prevent="
														showGdprDialog = true
													"
												>
													<v-list-item-title>
														{{
															$t(
																'component.adminForm.menu.gdpr'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<!-- Life situations-->
												<v-list-item
													v-if="isAdmin"
													@click="
														showLifeSituationDialog = true
													"
													@keydown.enter.space.prevent="
														showLifeSituationDialog = true
													"
												>
													<v-list-item-title>
														{{
															$t(
																'component.adminForm.menu.lifeSituation'
															)
														}}
													</v-list-item-title>
												</v-list-item>
												<!-- Categories-->
												<v-list-item
													v-if="isAdmin"
													@click="
														showCategoryDialog = true
													"
													@keydown.enter.space.prevent="
														showCategoryDialog = true
													"
												>
													<v-list-item-title>
														{{
															$t(
																'component.adminForm.menu.category'
															)
														}}
													</v-list-item-title>
												</v-list-item>

												<v-divider
													v-if="user.isAuthenticated"
												/>
												<v-list-item
													v-if="user.isAuthenticated"
													@click="logout"
													@keydown.enter.space.prevent="
														logout
													"
												>
													<v-list-item-title>
														{{
															$t(
																'component.appHeader.menu.logout'
															)
														}}
													</v-list-item-title>
												</v-list-item>
											</v-list>
										</nav>
									</v-menu>
								</v-col>
								<v-col class="pa-0 nav-bar-col account-col">
									<v-btn
										left
										v-if="!user.isAuthenticated"
										@click.prevent="login"
										flat
										color="primary"
									>
										{{ $t('app.auth.logIn') }}
										<v-icon
											size="22"
											class="right"
											icon="person"
										/>
									</v-btn>
									<span v-if="user.isAuthenticated">
										{{ user.fullName }}
										<v-icon
											size="22"
											class="right"
											icon="person"
										/>
									</span>
								</v-col>
							</v-layout>
						</div>
					</v-col>
				</v-layout>
			</v-container>
		</div>

		<!-- <div v-if="isAdmin">
			<!- PM3 Manager --
			<admin-pm3-manager
				v-on:onError="
					setErrorMessage($event.error, $event.errorDisplayMessage)
				"
				v-if="showPm3Dialog"
				v-on:onClosePm3Dialog="showPm3Dialog = false"
			/>

			<!- Receiver Manager --
			<admin-receiver-manager
				v-on:onError="
					setErrorMessage($event.error, $event.errorDisplayMessage)
				"
				v-if="showReceiverDialog"
				v-on:onCloseReceiverDialog="showReceiverDialog = false"
			/>

			<!- GDPR Manager --
			<admin-gdpr-manager
				v-on:onError="
					setErrorMessage($event.error, $event.errorDisplayMessage)
				"
				v-if="showGdprDialog"
				v-on:onCloseGdprDialog="showGdprDialog = false"
			/>

			<!- LifeSituation Manager --
			<admin-lifeSituation-manager
				v-on:onError="
					setErrorMessage($event.error, $event.errorDisplayMessage)
				"
				v-if="showLifeSituationDialog"
				v-on:onCloseLifeSituationDialog="
					showLifeSituationDialog = false
				"
			/>

			<!- Category Manager --
			<admin-category-manager
				v-on:onError="
					setErrorMessage($event.error, $event.errorDisplayMessage)
				"
				v-if="showCategoryDialog"
				v-on:onCloseCategoryDialog="showCategoryDialog = false"
			/>
		</div> -->
	</header>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, PropType, ref } from 'vue';
import { useStore } from 'vuex';
import { IRootState } from '@/models/IForm';
import { AppContentSize, FormType, MutationType } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import Config from '@/utils/Config';
import IAuthManager from '@/plugins/auth/IAuthManager';
import { useRoute, useRouter } from 'vue-router';
import IAuthClientConfig from '@/plugins/auth/IAuthClientConfig';
import { TCookieBanner } from '@turkos/components';
import { resetSavedMockData } from '@/store/mock';
import { useI18n } from 'vue-i18n';

/**
 * Component for the header section in the application
 * @description WCAG: landmark role for navigation, menu and menuitem, aria-labelledby (1.3.1)
 */

const props = defineProps({
	size: {
		type: String as PropType<AppContentSize>,
		default: AppContentSize.Default,
	},
	errorMessage: {
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
const form = computed(() => store.state.form);
const lastFormTitle = computed(() => store.state.lastFormTitle);

const sizeClasses = computed(() => {
	return Helper.getSizeClasses(props.size);
});

// Admin Dialogs
const showReceiverDialog = ref<boolean>(false);
const showPm3Dialog = ref<boolean>(false);
const showGdprDialog = ref<boolean>(false);
const showLifeSituationDialog = ref<boolean>(false);
const showCategoryDialog = ref<boolean>(false);

// Navigation
const mainSiteUrl = Config.VUE_APP_MAIN_SITE_URL;
const errorReportUrl = Config.VUE_APP_ERRORREPORT_URL;
const availabilityStatementUrl =
	Config.VUE_APP_AVAILABILITY_STATEMENT_URL ?? '';
const aboutPageUrl = Config.VUE_APP_ABOUT_URL;

// Navigation help links
const helpLinks = [
	{
		title: t('component.appHeader.menu.help.login'),
		url: Config.VUE_APP_HELP_LINK_LOGIN,
	},
	{
		title: t('component.appHeader.menu.help.multipleGuardians'),
		url: Config.VUE_APP_HELP_LINK_MULTIPLE_GUARDIANS,
	},
].filter((helpLink) => !!helpLink.url); // Don't show item if no url

function routerPush(path: string): void {
	if (route.path !== path) {
		router.push(path);
	}
}

// Warning banner
const warningBanner = computed(() => {
	if (store.state.banner?.active) {
		return store.state.banner;
	}
	return null;
});
onMounted(async () => {
	await store.dispatch('getBannerList');
});

// Authentication
const doLogin = ref(false);
const clientState = ref('');
const clientNames = ref('');
const cancelUrl = ref('');
const allClientsConfig = ref<IAuthClientConfig[]>([]);

const isAdmin = computed(() => {
	return store.getters.isLoggedInAdmin;
});

function isVisitingAdmin(): boolean {
	return route.name ? (route.name as string).indexOf('Admin') > -1 : false;
}

function logout(): void {
	store.commit(MutationType.TruncateForm); // Remove possibly stored data in session storage
	auth.logoutRedirectingToStartPage(
		user.value.authClientName,
		'logoutReason=manual'
	);
}

function login(): void {
	let tempLoginUrl = '';
	const innerAllClientsConfig = auth.getAllClientsConfig();
	if (
		store.state.form &&
		form.value &&
		form.value.attributes?.type !== FormType.InfoPage
	) {
		if (form.value.attributes.userRequirement.authClient.length > 1) {
			tempLoginUrl = auth.loginCitizen(
				route.path,
				store.state.form.attributes.userRequirement.authClient
			);
		} else if (
			form.value.attributes.userRequirement.authClient.length === 1
		) {
			const AnonymExists =
				form.value.attributes.userRequirement.authClient.find(
					(f) =>
						f === Config.VUE_APP_AUTH_ANONYMOUS_CLIENT_DISPLAY_NAME
				)
					? true
					: false;
			if (!AnonymExists) {
				tempLoginUrl = auth.loginCitizen(
					route.path,
					store.state.form.attributes.userRequirement.authClient
				);
			} else {
				tempLoginUrl = auth.loginCitizen(route.path, [
					'AllLoginMethods',
				]);
				const index = innerAllClientsConfig.findIndex(
					(element) => element.clientName === 'Anonym'
				);
				innerAllClientsConfig.splice(index, 1);
			}
		}
	} else {
		tempLoginUrl = auth.loginCitizen(route.path, ['AllLoginMethods']);
		const index = innerAllClientsConfig.findIndex(
			(element) => element.clientName === 'Anonym'
		);
		innerAllClientsConfig.splice(index, 1);
	}
	clientState.value = tempLoginUrl.split('&state=')[1].split('&')[0];
	clientNames.value = tempLoginUrl.split('&client_name=')[1].split('&')[0];
	cancelUrl.value = tempLoginUrl.split('&frejaCancelUrl=')[1].split('&')[0];
	allClientsConfig.value = innerAllClientsConfig;

	doLogin.value = true;
}

// Mock data
const usingMockedData = computed(() => {
	return (Config.VUE_APP_MOCK_DATA || '').toLowerCase() === 'yes';
});

function resetMockedData(): void {
	resetSavedMockData();
	(window as Window).location.href = '/';
}
</script>

<style scoped lang="scss">
.app-header {
	.demo-alert {
		background: pink;
		padding: 10px 0 0;
		min-height: 60px;
		text-align: center;
	}

	background: #fff;

	h1 {
		line-height: normal;
		cursor: default;
	}

	.tag-line {
		text-transform: uppercase;
		font-weight: bold;
		font-size: size(15);
		padding-bottom: 0;
		margin-bottom: -5px; // h4ck!
	}

	a {
		text-decoration: none !important;
		color: #333 !important;
	}

	// Skip to content visible when tabbing, used for screen readers [WCAG 2.4, navigation]
	#skip {
		position: absolute;
		top: 0;
		left: -9999px;
		z-index: 100;
		width: 100%;
		margin: 0;

		a:focus,
		a:active {
			display: block;
			position: absolute;
			top: 0;
			left: 9999px;
			width: 100%;
			padding: 8px 0;
			background: $accent;
			color: $black;
		}
	}

	.content-layout,
	.warning-banner {
		z-index: 901 !important; // necessary for the navbar menu to be visible
		justify-content: center;
	}
	.warning-banner-wrap {
		.warning-banner {
			.v-alert {
				background-color: $error !important;
				border-radius: $border-radius;
			}
			color: #fff;
		}
	}
	nav {
		box-shadow:
			0 5px 5px -3px rgb(0 0 0 / 20%),
			0 8px 10px 1px rgb(0 0 0 / 14%),
			0 3px 14px 2px rgb(0 0 0 / 12%);
		.v-list {
			border-radius: 4px;
		}
	}
}

.app-horizontal-nav {
	background: $primary;

	color: #fff;
	a,
	button,
	i,
	span {
		color: #fff;
	}

	a {
		font-size: size(14);
		text-transform: uppercase;
	}

	.v-btn {
		margin: 0;
		padding: 3px 8px;
		height: auto;
	}

	.v-icon {
		vertical-align: -4px;
	}

	.nav-bar-card {
		background: none;
		padding-top: 6px;
		padding-bottom: 6px;
	}
	.nav-bar-col {
		display: flex;
		align-items: center;

		&.account-col {
			justify-content: flex-end;
		}

		span {
			display: flex;
			align-items: center;

			.v-icon {
				margin-left: 4px;
			}
		}
	}

	.person-icon {
		display: none;
	}
}

.main-drop-down-menu {
	min-width: 200px;

	.v-icon {
		font-weight: bold;
		display: none;
		color: rgba(0, 0, 0, 0.54);
	}
	.active {
		font-weight: bold;
		.v-icon {
			display: inline;
		}
	}
}
.icon-right {
	margin-right: -4px;
}
</style>
