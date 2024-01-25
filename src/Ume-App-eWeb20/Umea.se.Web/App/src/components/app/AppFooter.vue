<template>
	<footer class="app-footer mt-4">
		<v-container class="top-container">
			<v-layout justify-center class="content-layout">
				<v-col :class="sizeClasses + ' pl-3 pr-3 pa-0'">
					<div class="footer-links">
						<h2>{{ $t('component.appFooter.linksTitle') }}</h2>
						<a href="/">
							{{ $t('component.appHeader.menu.allServices') }}
						</a>
						<a :href="mainSiteUrl" target="blank">
							{{ $t('component.appHeader.menu.mainSite') }}
						</a>
						<a :href="errorReportUrl" target="blank">
							{{ $t('component.appHeader.menu.errorReport') }}
						</a>
						<a
							v-if="helpPageUrl"
							:href="helpPageUrl"
							target="blank"
						>
							{{ $t('component.appHeader.menu.help.title') }}
						</a>
						<a
							v-if="availabilityStatementUrl"
							:href="availabilityStatementUrl"
							target="blank"
						>
							{{
								$t(
									'component.appHeader.menu.availabilityStatement'
								)
							}}
						</a>
						<a :href="aboutPageUrl" target="blank">
							{{ $t('component.appHeader.menu.about') }}
						</a>
					</div>
					<div class="logo-text">
						<img
							:src="logotypeUrl"
							width="120"
							aria-label="Umeå kommun"
						/>
						<p>
							{{ $t('component.appFooter.byLine') }}
						</p>
					</div>
				</v-col>
			</v-layout>
		</v-container>
	</footer>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { AppContentSize } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import logotypeUrl from '@/assets/logo_white.png';
import Config from '@/utils/Config';

const props = defineProps({
	size: {
		type: String as PropType<AppContentSize>,
		default: AppContentSize.Default,
	},
});

const sizeClasses = computed<string>(() => Helper.getSizeClasses(props.size));

// Navigation
const mainSiteUrl = Config.VUE_APP_MAIN_SITE_URL;
const errorReportUrl = Config.VUE_APP_ERRORREPORT_URL;
const helpPageUrl = Config.VUE_APP_HELP_PAGE_URL;
const availabilityStatementUrl =
	Config.VUE_APP_AVAILABILITY_STATEMENT_URL ?? '';
const aboutPageUrl = Config.VUE_APP_ABOUT_URL;
</script>

<style scoped lang="scss">
.app-footer {
	z-index: 1;
	background: $primary;

	.top-container {
		padding: 20px 15px;
		display: flex;
		min-height: 110px;
		align-items: center;
	}
	.content-layout {
		justify-content: center;

		.v-col {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
		}
	}

	.logo-text {
		text-align: right;
		margin-left: 20px;
		p {
			color: #fff;
			margin-top: 10px;
			margin-bottom: 15px;
		}
	}

	.footer-links {
		h2 {
			color: #fff;
			font-size: size(20);
			margin-bottom: 10px;
		}

		a {
			display: inline-block;
			background-color: rgba(0, 0, 0, 0.1);
			border-radius: 30px;
			margin-right: 5px;
			margin-bottom: 5px;
			padding: 10px 14px;
			color: #fff !important;
			text-decoration: none;
			transition: all 0.2s ease;

			&:hover {
				background-color: rgba(0, 0, 0, 0.15);
			}
		}
	}

	@media screen and (max-width: 600px) {
		.v-col {
			flex-wrap: wrap;
		}
		.logo-text {
			margin: 0;
			margin-top: 20px;
			text-align: left;
		}
		.footer-links {
			flex: 1;
		}
	}
}
</style>
