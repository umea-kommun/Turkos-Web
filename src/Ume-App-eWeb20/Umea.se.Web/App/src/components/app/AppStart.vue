<template>
	<app-content
		:size="contentSize"
		class="app-start"
		:pageTitle="$t('component.appStart.title')"
	>
		<v-container class="form-list-controls">
			<v-layout row class="overflow-visible">
				<v-col class="search-field">
					<ume-text-field
						:aria-label="$t('component.appStart.search')"
						:placeholder="
							$t('component.appStart.searchPlaceholder')
						"
						v-model="searchPhrase"
						variant="underlined"
						color="primary"
						prepend-inner-icon="search"
						aria-controls="form-list"
					/>
				</v-col>
			</v-layout>
		</v-container>
		<div class="form-list-control-options">
			<div>
				<v-btn-toggle
					v-if="!mobileView"
					v-model="showGridLayout"
					:mandatory="true"
				>
					<v-btn
						icon="view_module"
						:value="true"
						:aria-label="'Visa som rutnät'"
					></v-btn>
					<v-btn
						icon="view_headline"
						:value="false"
						:aria-label="'Visa som lista'"
					></v-btn>
				</v-btn-toggle>
			</div>
			<v-menu
				attach
				class="sorting-controls"
				v-if="!(mobileView && isSearching)"
			>
				<template v-slot:activator="{ props }">
					<div>
						{{ $t('component.appStart.sorting') }}
						<v-btn
							:disabled="isSearching"
							class="sort-btn"
							style=""
							aria-haspopup="true"
							aria-controls="listbox-filter"
							role="combobox"
							v-bind="props"
							variant="flat"
						>
							<span v-if="sortingType == 'category'">{{
								$t('component.appStart.category')
							}}</span>
							<span v-if="sortingType == 'lifeSituation'">{{
								$t('component.appStart.lifeSituation')
							}}</span>
							<span
								v-if="
									sortingType != 'lifeSituation' &&
									sortingType != 'category'
								"
								>{{ $t('component.appStart.name') }}</span
							>
							<v-icon
								class="right"
								size="22"
								icon="expand_more"
							/>
						</v-btn>
					</div>
				</template>
				<v-list id="listbox-filter" role="listbox">
					<router-link
						to="/sort/category"
						role="option"
						class="sort-option"
						:aria-selected="sortOnCategory"
					>
						<v-list-item>
							<v-list-item-title>
								{{ $t('component.appStart.category') }}
							</v-list-item-title>
						</v-list-item>
					</router-link>
					<router-link
						to="/"
						role="option"
						class="sort-option"
						:aria-selected="sortOnLifeSituation"
					>
						<v-list-item>
							<v-list-item-title>
								{{ $t('component.appStart.lifeSituation') }}
							</v-list-item-title>
						</v-list-item>
					</router-link>
					<router-link
						to="/sort/name"
						role="option"
						class="sort-option"
						:aria-selected="sortOnName"
					>
						<v-list-item>
							<v-list-item-title>
								{{ $t('component.appStart.name') }}
							</v-list-item-title>
						</v-list-item>
					</router-link>
				</v-list>
			</v-menu>
		</div>
		<app-loading-spinner
			:isVisible="
				(isBusyLoadingFromServer && isBusyLoadingInitialData) ||
				(initialSortingType !== sortingType && isBusyLoadingFromServer)
			"
		/>
		<div
			id="form-list"
			v-if="
				!(
					(isBusyLoadingFromServer && isBusyLoadingInitialData) ||
					(initialSortingType !== sortingType &&
						isBusyLoadingFromServer)
				)
			"
		>
			<v-list
				subheader
				v-if="isSearching"
				style="background: transparent"
			>
				<!--Tillgänglighetsjustering: Lägger till en rubrik på nivå h2 för sökresultat-->
				<app-loading-spinner
					:isVisible="isBusyLoadingFromServer"
				></app-loading-spinner>
				<div
					v-if="!isBusyLoadingFromServer"
					class="search-count ma-0 pa-0"
				>
					<h2>Sökresultat</h2>
					<p aria-live="assertive" aria-relevant="additions">
						{{ searchResult.length }} sökträffar på
						<strong>{{ searchPhrase }}</strong>
					</p>
				</div>
				<BaseFormGroup
					v-if="!isBusyLoadingFromServer"
					:forms="searchResult"
					:show-grid="showGridLayout && !mobileView"
					:default-show-all="true"
					:per-row="perRow"
				/>
			</v-list>
			<v-list
				style="background: transparent"
				subheader
				v-if="!isSearching"
			>
				<BaseFormGroup
					:title="$t('component.appStart.mostUsedEServices')"
					v-if="mostUsedForms.length"
					:count="mostUsedForms.length"
					:forms="mostUsedForms"
					:show-grid="showGridLayout && !mobileView"
					:per-row="perRow"
				/>
				<template
					v-for="(groupItems, i) in glossary"
					:key="i + '-header' + groupItems[0].tag"
				>
					<BaseFormGroup
						:title="groupItems[0].tag"
						:count="groupItems[0].count ?? groupItems.length"
						:forms="forms"
						:group-items="groupItems"
						:show-grid="showGridLayout && !mobileView"
						:per-row="perRow"
						:loading="isBusyLoadingFromServer"
					/>
				</template>
			</v-list>
		</div>
	</app-content>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { IForm, IFormGroup } from '@/models/IForm';
import { AppContentSize } from '@/models/Enums';
import { DateScheduleUtils } from '@/store/utils';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';
import AppContent from '@/components/app/AppContent.vue';
import PriorityQueue from '@/utils/PriorityQueue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { IRootState } from '@/models/IForm';
import BaseFormGroup from '../base/BaseFormGroup.vue';

/**
 * Start page for the application
 * @description WCAG: semantic headers (1.3.1)
 */
const props = defineProps({
	sortingType: {
		type: String,
		default: 'lifeSituation',
	},
});

const route = useRoute();
const store = useStore<IRootState>();
const showGridLayout = ref<boolean>(true);
const mobileView = ref<boolean>(false);
const wideView = ref<boolean>(false);

const contentSize = ref<AppContentSize>(
	route.meta
		? (route.meta.contentSize as AppContentSize)
		: AppContentSize.Default
);
const isBusyLoadingFromServer = ref<boolean>(true);
const isBusyLoadingInitialData = ref<boolean>(true);
const initialSortingType = ref<string>(props.sortingType);
const searchPhrase = ref<string>('');

const perRow = computed(() => {
	return wideView.value ? 4 : 3;
});

const loadInitialForms = async (): Promise<void> => {
	await store.dispatch('getInitialFormGroups', {
		group: props.sortingType,
		limit: perRow.value,
	});
	isBusyLoadingInitialData.value = false;
};

onMounted(async () => {
	if (
		props.sortingType === 'lifeSituation' ||
		props.sortingType === 'category'
	) {
		loadInitialForms();
	}
	await store.dispatch('getPublishedForms');
	isBusyLoadingFromServer.value = false;
});

/** Sort forms by title in ascending order */
function sortByTitle(a: IForm, b: IForm): number {
	if (a.attributes.title.toLowerCase() < b.attributes.title.toLowerCase()) {
		return -1;
	}
	if (a.attributes.title.toLowerCase() > b.attributes.title.toLowerCase()) {
		return 1;
	}
	return 0;
}

function sortForms(a: IForm, b: IForm): number {
	const order =
		(b.attributes.recentSubmits ?? 0) - (a.attributes.recentSubmits ?? 0);
	if (order === 0) {
		// Sort by title if same number of submits
		return sortByTitle(a, b);
	}
	return order;
}

const sortOnLifeSituation = computed<boolean>(() => {
	if (props.sortingType === 'lifeSituation') return true;
	return false;
});

const sortOnCategory = computed<boolean>(() => {
	if (props.sortingType === 'category') return true;
	return false;
});

const sortOnName = computed<boolean>(() => {
	if (props.sortingType === 'name') return true;
	return false;
});

const forms = computed<IForm[]>(() => {
	if (!store.state.forms?.length) {
		if (store.state.initialForms?.length) {
			return store.state.initialForms
				.filter((f: IForm) => {
					if (
						DateScheduleUtils.isScheduled(f) &&
						DateScheduleUtils.hasPassedScheduledDate(f)
					) {
						return false;
					}
					return true;
				})
				.sort(sortOnName.value ? sortByTitle : sortForms);
		}
		return [];
	}
	return store.state.forms
		.filter((f: IForm) => {
			if (
				DateScheduleUtils.isScheduled(f) &&
				DateScheduleUtils.hasPassedScheduledDate(f)
			) {
				return false;
			}
			return true;
		})
		.sort(sortOnName.value ? sortByTitle : sortForms);
});

const mostUsedForms = computed<IForm[]>(() => {
	if (forms.value.length && !sortOnName.value) {
		return forms.value
			.slice(0, perRow.value)
			.filter((f) => f.attributes.recentSubmits > 0);
	}
	return [];
});

const groups = computed<IFormGroup[]>(() => {
	if (!store.state.initialGroups?.length) {
		return [];
	}
	return store.state.initialGroups;
});

const isSearching = computed<boolean>(() => {
	return searchPhrase.value.trim() !== '';
});

/**
 * Generate a sorted glossary
 */
const glossary = computed(() => {
	// Map used to group forms by title/lifeSituation
	let formMap = new Map();

	if (props.sortingType === 'lifeSituation') {
		// Group forms by lifeSituation
		forms.value.forEach((form: IForm, i) => {
			let lifeSituationTitles = [] as string[];
			const lifeSituations = form.attributes.lifeSituations || [];
			if (lifeSituations.length < 1) {
				lifeSituationTitles.push(''); // Form does not have any life situation
			} else {
				lifeSituationTitles = lifeSituations.map((l) => l.title);
			}
			lifeSituationTitles.forEach((title) => {
				if (!formMap.has(title)) {
					formMap.set(title, []);
				}
				formMap.get(title).push({
					index: i,
					tag: title,
					count: groups.value.find((g) => g.title === title)?.count,
				});
			});
		});
	} else {
		if (props.sortingType === 'category') {
			// Group forms by category
			forms.value.forEach((form: IForm, i) => {
				let categoryTitles = [] as string[];
				const categories = form.attributes.categories || [];
				if (categories.length < 1) {
					categoryTitles.push(''); // Form does not have any life situation
				} else {
					categoryTitles = categories.map((l) => l.title);
				}
				categoryTitles.forEach((title) => {
					if (!formMap.has(title)) {
						formMap.set(title, []);
					}
					formMap.get(title).push({
						index: i,
						tag: title,
						count: groups.value.find((g) => g.title === title)
							?.count,
					});
				});
			});
		} else {
			// Group forms by first letter in name
			forms.value.forEach((form, i) => {
				const firstLetter = form.attributes.title
					.charAt(0)
					.toUpperCase();
				if (!formMap.has(firstLetter)) {
					formMap.set(firstLetter, []);
				}
				formMap.get(firstLetter).push({ index: i, tag: firstLetter });
			});
		}
	}

	// Sort map and convert back to an array (iterating over maps will be supported in vue 3.0)
	formMap = new Map([...formMap].sort());
	return Array.from(formMap.values());
});

function sanitize(text: string): string {
	// eslint-disable-next-line no-useless-escape
	const htmlAttrRule = '[ a-zA-Z0-9_="\-:;\?\&\#\/\.]+';
	return text
		.replace(new RegExp('<span' + htmlAttrRule + '>', 'g'), '') // remove a and span tags
		.replace(new RegExp('<a' + htmlAttrRule + '>', 'g'), '')
		.replace(new RegExp('</span>', 'g'), '')
		.replace(new RegExp('</a>', 'g'), '')
		.replace(new RegExp('&ouml;', 'g'), 'ö')
		.replace(new RegExp('&Ouml;', 'g'), 'Ö')
		.replace(new RegExp('&auml;', 'g'), 'ä')
		.replace(new RegExp('&Auml;', 'g'), 'Ä')
		.replace(new RegExp('&aring;', 'g'), 'å')
		.replace(new RegExp('&Aring;', 'g'), 'Å');
}

function countOccurencesInForm(form: IForm, search: string): number {
	const title = sanitize(form.attributes.title);
	const desc = sanitize(form.attributes.description);
	const numMatchesInTitle = (title.match(new RegExp(search, 'gi')) || [])
		.length;
	const numMatchesInDesc = (desc.match(new RegExp(search, 'gi')) || [])
		.length;
	return numMatchesInTitle + numMatchesInDesc;
}

function formMatchesOnAllKeyWords(form: IForm, keyWords: string[]): boolean {
	return (
		keyWords.length > 1 &&
		keyWords.every((word: string) => countOccurencesInForm(form, word) > 0)
	);
}

const searchResult = computed((): IForm[] => {
	const searchPhraseStr: string = searchPhrase.value.trim().toLowerCase();
	if (searchPhraseStr.length < 3) {
		return forms.value;
	}
	const searchKeyWords = searchPhraseStr.split(' ');

	// forms with description containing exact search phrase
	const matchesOnExactSearchPhrase = new PriorityQueue<IForm>();

	// forms with description containing all words in the search phrase, no particular order
	const matchesOnAllKeyWords = new PriorityQueue<IForm>();

	// form with description containing one or more words in the search phrase
	const matchesOnAnyKeyWord = new PriorityQueue<IForm>();
	const keyWordMatchesInForms = new Map<IForm, number>();

	forms.value.forEach((form: IForm) => {
		const numMatches = countOccurencesInForm(form, searchPhraseStr);
		if (numMatches > 0) {
			// have exact match on search phrase
			matchesOnExactSearchPhrase.push(form, numMatches);
		} else if (formMatchesOnAllKeyWords(form, searchKeyWords)) {
			// All words in search phrase matches, but not the exact order (search phrase)
			matchesOnAllKeyWords.push(form, 1);
		} else {
			// Compute the sum of all posibly matching keywords
			searchKeyWords.forEach((keyWord) => {
				const matchCount = countOccurencesInForm(form, keyWord);
				if (matchCount > 0) {
					const currentNumOfMatches =
						keyWordMatchesInForms.get(form) || 0;
					keyWordMatchesInForms.set(
						form,
						matchCount + currentNumOfMatches
					);
				}
			});
		}
	});
	keyWordMatchesInForms.forEach((matchCount: number, form: IForm) => {
		matchesOnAnyKeyWord.push(form, matchCount);
	});
	const allMatches = [
		...matchesOnExactSearchPhrase.toArray().reverse(),
		...matchesOnAllKeyWords.toArray().reverse(),
		...matchesOnAnyKeyWord.toArray().reverse(),
	];
	return allMatches;
});

function loadLayoutOptionFromStorage(): void {
	showGridLayout.value =
		window.localStorage.getItem('basicUseLayout') !== 'list';
}
watch(showGridLayout, (value: boolean) => {
	window.localStorage.setItem('basicUseLayout', value ? 'grid' : 'list');
});
loadLayoutOptionFromStorage();

function onResize(): void {
	mobileView.value = window.innerWidth < 800;
	wideView.value = window.innerWidth > 1440;
}
onResize();
onMounted(() => {
	window.addEventListener('resize', onResize);
});
onUnmounted(() => {
	window.removeEventListener('resize', onResize);
});
</script>

<style scoped lang="scss">
.search-field {
	padding: 4px 8px;

	&:deep(input) {
		cursor: text;
		font-size: size(16);
	}
}

.search-description {
	border: #ccc solid 1px;
	padding: 10px 10px 6px;
	font-size: 12px;
	font-style: italic;
	color: #888;
	margin-top: 10px;
	max-width: 80%;
}

span.highlight {
	background: #f9f933 !important;
	color: #000 !important;
}

.e-service-title {
	height: auto;
	padding-top: 10px;
	padding-bottom: 10px;
}

.v-divider {
	margin-top: 20px;
}

.v-divider:last-child {
	display: none;
}
.v-btn-toggle {
	height: 36px !important;
	margin-top: 6px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	.v-btn {
		margin: 0;
		border: none;
		color: $black;
	}
}

.v-list {
	padding-top: 0;
}
.v-list-item-title {
	// Show all text even on small screens
	white-space: normal;
	overflow: visible;
	text-overflow: unset;
	height: auto;
	font-weight: normal !important;
}

.form-list-controls {
	padding: 10px 10px 10px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0px 1px 3px #00000014;

	input {
		font-size: 18px;
	}
}
.form-list-control-options {
	display: flex;
	justify-content: space-between;
	margin-top: 6px;
	margin-bottom: 10px;
	font-size: 16px;
}
:deep(.sort-btn) {
	background-color: #fff;
	font-size: 16px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
	border: none !important;
	margin-right: 0;
}

.sorting-controls {
	width: 100%;
	padding-top: 12px;
	align-self: self-end;

	.v-btn {
		background-color: #fff;
		font-size: 16px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
		border: none;
		margin-right: 0;
	}
}
.sorting-controls .v-list-item-title {
	color: $black;
	font-size: size(14);
}
:deep(.v-btn) {
	border: #ccc solid 1px;
	text-transform: none;
	letter-spacing: normal;
}
.subheading-h3 {
	font-size: size(16);
}
.search {
	&-count {
		padding-top: size(8);
		padding-left: size(10);

		p {
			padding-left: size(6);
			margin-top: size(10);
		}
	}
}
:deep(.v-text-field .v-field--has-label input) {
	opacity: 1;
}
:deep(.search-field) {
	label {
		position: absolute;
		left: -10000px;
	}
}
</style>
