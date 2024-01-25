<template>
	<div class="paper-signature">
		<v-container grid-list-md style="padding: 20px 0 0">
			<v-layout row wrap>
				<v-col cols="7" class="pa-1">
					<PrintTextBox
						:title="$t('component.PaperSignature.signature')"
						:spacing="false"
					/>
					<PrintTextBox
						:title="$t('component.PaperSignature.name')"
						:spacing="false"
					/>
				</v-col>
				<v-col cols="5" class="pa-1">
					<PrintTextBox
						:title="$t('component.PaperSignature.whereAndWhen')"
						:spacing="false"
					/>
				</v-col>
			</v-layout>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import PrintTextBox from './PrintTextBox.vue';
/**
 * Component that renders a textbox sutiable for a on-paper-ui
 */
</script>

<style scoped lang="scss"></style>
