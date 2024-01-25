<template>
	<div class="form-gdpr">
		<!-- Info om GDPR -->
		<v-container class="gdpr-card pa-0" fluid>
			<h2 class="pb-2">Så behandlar vi dina personuppgifter</h2>

			<p>
				Vi behöver spara och behandla dina ifyllda personuppgifter. Vi
				efterfrågar bara de personuppgifter som krävs för att vi ska
				kunna behandla ditt ärende. Om du inte lämnar efterfrågade
				uppgifter kommer vi inte att kunna hantera ditt ärende. Vi
				tillämpar gällande integritetslagstiftning vid all behandling av
				personuppgifter. Vi kan komma att dela dina personuppgifter med
				en tredje part, förutsatt att vi är skyldiga enligt lag, till
				exempel enligt offentlighetsprincipen.
			</p>

			<p>
				Läs mer om dina rättigheter, syftet med behandlingen, rättslig
				grund och vem som är personuppgiftsansvarig för dina uppgifter.
			</p>

			<!-- Lista med personuppgiftsansvariga -->
			<div v-if="mode !== 'PRINT'" class="button-list">
				<v-btn
					v-for="dataController in dataControllers"
					:key="dataController.id"
					:href="dataController.url"
					target="_blank"
					variant="outlined"
					>{{ dataController.title }}
					<v-icon right icon="open_in_new" />
				</v-btn>
			</div>
			<ul v-if="mode === 'PRINT'">
				<li
					v-for="dataController in dataControllers"
					:key="dataController.id"
				>
					{{ dataController.title }} <br />
					{{ dataController.url }}
				</li>
			</ul>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { IGdpr } from '@/models/IForm';

/**
 * Komponent för att informera användaren om GDPR. Skriver ut en lista med
 * personuppgiftsansvariga (data-controllers), ex. nämnder inom kommunen.
 * @prop {IGdpr[]} dataControllers - Lista med personuppgiftsansvariga.
 * @prop {string} validationScope - Sätt scope för validering, dvs när den ska utvärderas.
 */

defineProps({
	dataControllers: Array as PropType<IGdpr[]>,
	validationScope: String,
	mode: {
		type: String,
		default: 'VIEW',
	},
});
</script>

<style lang="scss">
.form-gdpr {
	page-break-inside: avoid;
	padding-top: 18px;

	p {
		margin-bottom: 16px;
	}

	.v-btn__content {
		padding: 5px 0px;
		white-space: pre-wrap;
	}
	.v-btn {
		height: auto;
		.v-icon {
			margin-left: 6px;
		}
	}
	.button-list .v-btn:first-child {
		margin-left: 0;
	}
}
</style>
