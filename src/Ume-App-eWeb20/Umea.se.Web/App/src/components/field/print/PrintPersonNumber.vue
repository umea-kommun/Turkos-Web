<template>
	<div class="print-person-number">
		<v-container grid-list-md style="padding: 20px 0 0">
			<v-layout row wrap>
				<v-col cols="4" class="pa-1">
					<PrintTextBox
						:title="$t('component.PrintPersonNumber.personNumber')"
						:spacing="false"
					/>
				</v-col>
				<v-col cols="8" class="pa-1">
					<PrintTextBox
						:title="$t('component.PrintPersonNumber.name')"
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
 * Component that renders a textbox suitable for a on-paper-ui
 */
</script>

<style scoped lang="scss"></style>
