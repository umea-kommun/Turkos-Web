import { ApplicationInsights, Util } from '@microsoft/applicationinsights-web';
import { Router } from 'vue-router';

export let appInsights: ApplicationInsights;

export default {
	install(
		app: any,
		{
			baseName,
			appInsightsConfig,
			router,
			onAfterScriptLoaded,
		}: {
			baseName: string;
			appInsightsConfig: { [key: string]: string | boolean | number };
			router: Router;
			onAfterScriptLoaded: unknown;
		}
	): void {
		/** App Insights */
		if (!appInsightsConfig.connectionString) {
			console.warn(
				'No Application Insights instrumentation was provided, logging disabled.'
			);
			return;
		}
		if (!appInsights) {
			appInsights = new ApplicationInsights({
				config: appInsightsConfig,
			});
			appInsights.loadAppInsights();
			if (typeof onAfterScriptLoaded === 'function') {
				onAfterScriptLoaded(appInsights);
			}
		}

		// Track route change (same way as done in 'vue-application-insights' that we used before)
		if (router) {
			router.beforeEach((route, from, next) => {
				const name = baseName + ' / ' + route.name?.toString();
				appInsights.context.telemetryTrace.traceID =
					Util.generateW3CId();
				appInsights.context.telemetryTrace.name =
					route.name?.toString();
				appInsights.startTrackPage(name);
				next();
			});

			router.afterEach((route) => {
				const name = baseName + ' / ' + route.name?.toString();
				const url =
					location.protocol + '//' + location.host + route.fullPath;
				appInsights.stopTrackPage(name, url);
				appInsights.flush();
			});
		}
	},
};
