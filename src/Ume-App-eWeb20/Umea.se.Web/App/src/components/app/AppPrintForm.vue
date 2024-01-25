<template>
	<!--Tillgänglighetsjustering: Removed role="form" from app-content below-->
	<app-content
		:is-loading="isBusyLoadingFromServer"
		:errorMessage="loadFormErrorMessage"
		:pageTitle="form ? form.attributes.title : ''"
		class="app-form"
	>
		<div v-if="form">
			<header>
				<router-link to="/">
					<img
						class="logo"
						width="200"
						:src="logotypeUrl"
						:alt="$t('component.appHeader.logoAlt')"
					/>
				</router-link>
			</header>

			<div v-if="!isAvailable">
				<h2 class="print-warning-title">
					{{ $t('component.AppPrintForm.warningUnpublished') }}
				</h2>
			</div>

			<div>
				<h1>{{ form.attributes.title }}</h1>
				<p style="margin-top: 12px">
					{{ $t('component.AppPrintForm.sendInfo') }}
					&quot;<a
						:href="form.attributes.receiver?.url"
						target="_blank"
						>{{ form.attributes.receiver?.title }}</a
					>&quot;.
				</p>
			</div>
			<div v-for="(step, index) in filteredSteps" v-bind:key="index + 1">
				<h2 class="print-title">{{ index + 1 }}) {{ step.title }}</h2>
				<div
					v-for="field in groupFollowUpQuestions(
						filteredSteps[index].fields
					)"
					:key="field.id"
				>
					<div v-if="hasChildFields(field)">
						<print-follow-up-questions
							:field="field"
						></print-follow-up-questions>
					</div>
					<div v-if="field.type == 'FieldTable'">
						<print-table
							:field="field"
							:tableColumns="
								fetchTableColumns(
									field,
									filteredSteps[index].fields
								)
							"
						></print-table>
					</div>
					<dynamic-field-component
						v-if="
							!hasChildFields(field) &&
							!field.fieldOptions.tableGuid
						"
						:field="field"
						mode="PRINT"
					>
					</dynamic-field-component>
				</div>
			</div>

			<!-- GDPR -->
			<form-gdpr
				:dataControllers="form.attributes.gDPR.dataControllers"
				mode="PRINT"
			/>

			<!-- Sökande, personnummer och namn -->
			<div v-if="form.attributes.printFieldPersonnumber">
				<div id="print-person-number">
					<h2 class="print-title">
						{{ $t('component.AppPrintForm.printPersonNumber') }}
					</h2>
					<PrintPersonNumber />
				</div>
			</div>

			<!-- Contact info -->
			<div id="contact-info">
				<h2 class="print-title">
					{{ $t('component.AppPrintForm.contactInfo') }}
				</h2>
				<PrintTextBox
					:title="$t('component.AppPrintForm.contactInfoSender')"
					:helpText="$t('component.AppPrintForm.contactInfoHelp')"
					:height="100"
				/>
			</div>

			<!-- Signature -->
			<div id="paper-signature">
				<h2 class="print-title">
					{{ $t('component.AppPrintForm.signature') }}
				</h2>
				<PaperSignature />
			</div>

			<div
				v-if="
					form.attributes.status === 'Unpublished' ||
					form.attributes.status === 'Draft'
				"
			>
				<h2 class="print-warning-title">
					{{ $t('component.AppPrintForm.warningUnpublished') }}
				</h2>
			</div>

			<!-- Printing info -->
			<div id="print-alert">
				<v-snackbar
					v-model="showPrintSnackBar"
					:timeout="-1"
					multi-line
					bottom
					attach
				>
					{{ $t('component.AppPrintForm.notice') }} &quot;{{
						form.attributes.title
					}}&quot;.
					<v-btn color="pink" flat @click="openBrowserPrintDialog()">
						<v-icon class="pr-1" icon="print" />
						Skriv ut
					</v-btn>
				</v-snackbar>
			</div>
		</div>
	</app-content>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { IItem, IRootState } from '@/models/IForm';
import AppContent from '@/components/app/AppContent.vue';
import {
	IFormField,
	IDisplayRule,
	IItemListField,
	IFormStep,
} from '@/models/IForm';
import FormGdpr from '@/components/form/FormGdpr.vue';
import { Helper } from '@/utils/helper';
import { ErrorCode, FormStatus } from '@/models/Enums';
import { DateScheduleUtils } from '@/store/utils';
import PaperSignature from '@/components/field/print/PaperSignature.vue';
import PrintTextBox from '@/components/field/print/PrintTextBox.vue';
import PrintPersonNumber from '@/components/field/print/PrintPersonNumber.vue';
import PrintFollowUpQuestions from '@/components/field/print/PrintFollowUpQuestions.vue';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';
import PrintTable from '@/components/field/print/PrintTable.vue';
import logotypeUrl from '@/assets/logo.png';

/**
 * Renders a form suitable for printing
 */

const props = defineProps({
	formPath: String,
});

const store = useStore<IRootState>();
const { t } = useI18n();

const loadFormErrorMessage = ref<string>('');
const isBusyLoadingFromServer = ref<boolean>(true);
const showPrintSnackBar = ref<boolean>(true);
const filteredSteps = ref<IFormStep[]>([]);

function openBrowserPrintDialog(): void {
	window.print();
}

const form = computed(() => {
	return store.state.form;
});

const isAvailable = computed(() => {
	if (!form.value) {
		return false;
	}
	const blockedDueToDateSchedule =
		DateScheduleUtils.isScheduled(form.value) &&
		!DateScheduleUtils.isScheduledToBeVisibleNow(form.value);
	return (
		form.value.attributes.status === FormStatus.Published &&
		!blockedDueToDateSchedule
	);
});

function hasMotherFieldInSameStep(
	stepFields: IFormField[],
	displayRule: IDisplayRule
): boolean {
	return stepFields.find((f) => f.guid === displayRule.fieldGuid)
		? true
		: false;
}

function groupFollowUpQuestions(stepFields: IFormField[]): IFormField[] {
	if (!form.value) {
		return [];
	}

	const newFieldList: IFormField[] = [];
	const childFieldsMap: Map<string | number, IFormField[]> = new Map();

	// Collect all child fields and create a new field list, excluding these child fields
	stepFields.forEach((field) => {
		if (field.displayRuleGuids.length > 0) {
			const displayRules = [] as IDisplayRule[];
			field.displayRuleGuids.forEach((f) => {
				if (form.value) {
					displayRules.push(
						form.value.attributes.displayRules.filter(
							(r) => r.guid === f
						)[0]
					);
				}
			});
			displayRules.forEach((displayRule) => {
				if (
					displayRule &&
					hasMotherFieldInSameStep(stepFields, displayRule)
				) {
					const itemIdString = displayRule.fieldOptionId.toString();
					const childFieldList = childFieldsMap.get(itemIdString);
					if (!childFieldList) {
						childFieldsMap.set(itemIdString, [field]);
					} else {
						childFieldList.push(field);
					}
				} else {
					// Exclude table-fields
					if (field.fieldOptions && !field.fieldOptions.tableGuid) {
						newFieldList.push(field);
					}
				}
			});
		} else {
			newFieldList.push(field);
		}
	});

	// Monkey-patch the child fields onto field.fieldOptions.items (the items belonging to the "mother" question)
	newFieldList.forEach((field) => {
		field = field as IItemListField;
		if (field.fieldOptions && field.fieldOptions.items) {
			field.fieldOptions.items.forEach((item: IItem | any) => {
				const itemIdString = item.id.toString();
				if (childFieldsMap.has(itemIdString)) {
					item.childFields = childFieldsMap.get(itemIdString);
				}
			});
		}
	});

	return newFieldList;
}

/**
 * Load data from server into store
 */
async function getData(): Promise<void> {
	try {
		await store.dispatch('getFormByPath', { path: props.formPath });
		if (!form.value) {
			return;
		}
		filteredSteps.value = Helper.deepCopy(form.value.attributes.steps);
		if (form.value.attributes.userRequirement.canApplyForAnother) {
			form.value.attributes.steps.forEach((step, index) => {
				filteredSteps.value[index].fields = [];
				step.fields.forEach((field) => {
					if (!field.displayRuleAnother) {
						filteredSteps.value[index].fields.push(field);
					}
				});
			});
		}
	} catch (error: any) {
		switch (error.message) {
			case ErrorCode.FormNotFound:
				loadFormErrorMessage.value = t(
					'app.error.formNotFound'
				).toString();
				break;
			case ErrorCode.FormNotPublished:
				loadFormErrorMessage.value = t(
					'app.error.formNotPublished'
				).toString();
				break;
			default:
				loadFormErrorMessage.value =
					(error.message || error.toString()) + '\n' + error.stack;
		}
	}
	isBusyLoadingFromServer.value = false;
}

function hasChildFields(field: IItemListField | any): boolean {
	if (field.fieldOptions && field.fieldOptions.items) {
		return field.fieldOptions.items.find(
			(item: any) => 'childFields' in item
		);
	}
	return false;
}

function fetchTableColumns(
	field: IItemListField | any,
	stepFields: IFormField[]
): IItemListField[] {
	return stepFields.filter((r) => r.fieldOptions.tableGuid === field.guid);
}

onMounted(async () => {
	await getData();
	openBrowserPrintDialog();
});
</script>

<style lang="scss">
#app.route-AppPrintForm {
	background: #fff !important;

	.content-layout {
		display: block;
		-ms-flex: none;
		flex: none;
		-ms-flex-wrap: none;
		flex-wrap: none;
		min-width: 0;
		max-width: 900px;
		margin: 0;
	}

	.content-flex {
		display: block !important;
		max-width: none !important;
		width: 90% !important;
		flex: none !important;
		margin: 0 !important;
	}

	h1 {
		width: 700px !important;
		max-width: none !important;
	}

	header {
		padding: 120px 0 100px;
	}

	.app-horizontal-nav,
	.app-header,
	.app-footer {
		display: none;
	}

	h1 {
		max-width: 500px;
	}

	.container {
		max-width: none !important;
	}

	.print-title {
		background-color: $primary-bg;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
		page-break-after: avoid;
		break-after: avoid;
		margin: 58px 0 20px;
		line-height: 1.5;
	}

	.v-alert.v-alert,
	.v-alert.v-alert--outline {
		border: 0 !important;
		font-style: italic;
	}

	.field-section {
		margin-bottom: 0;
		padding-bottom: 0 !important;
	}

	.print-warning-title {
		margin-bottom: 20px;
		border: #333 solid 5px;
		padding: 20px;
	}

	#paper-signature {
		page-break-inside: avoid;
	}

	#contact-info {
		page-break-inside: avoid;
	}

	.v-icon.icon_crop_square {
		color: rgba(0, 0, 0, 0.54);
		margin-right: 4px;
	}
}

.v-snackbar__content {
	display: flex;
}

@media print {
	#print-alert {
		display: none;
	}
	@page {
		size: A4;
	}
}
</style>
