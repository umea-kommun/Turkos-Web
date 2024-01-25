<template>
	<div :class="getClasses()">
		<div
			role="button"
			class="wrap-btn"
			@click="toggle()"
			@keydown.prevent.space.enter="toggle()"
			tabindex="0"
			:aria-expanded="isOpened"
			:aria-controls="containerId"
		>
			<v-container fluid class="pa-0">
				<!--Tillgänglighetsjustering: BaseToggleContainer (base-toggle-container) används på startsidan
				men förekommer även på andra ställen. Borde justera så att innehållet i if/else-satsen ligger
				i en egen komponent.
				-->
				<h3 v-if="!headinglevelh2" :class="getH3Classes()">
					<v-icon
						v-if="icon"
						:icon="icon"
						size="small"
						class="title-icon"
					/>
					<span :class="getSpanClasses()">{{ title }}</span>
					<v-icon
						v-if="!isOpened"
						size="24"
						class="chevron"
						icon="expand_more"
					/>
					<v-icon
						v-if="isOpened"
						size="24"
						:class="getOpenIconClasses()"
						icon="expand_less"
					/>
				</h3>
				<h2 v-else :class="getH3Classes()">
					<v-icon
						v-if="icon"
						:icon="icon"
						size="small"
						class="title-icon"
					/>
					<span :class="getSpanClasses()">{{ title }}</span>
					<v-icon
						v-if="!isOpened"
						size="24"
						class="chevron"
						icon="expand_more"
					/>
					<v-icon
						v-if="isOpened"
						size="24"
						:class="getOpenIconClasses()"
						icon="expand_less"
					/>
				</h2>
			</v-container>
		</div>
		<v-container
			fluid
			:id="containerId"
			v-if="isOpened || hasOpenedAtleastOnce"
			v-show="isOpened"
			class="toggle-container-body pa-0"
		>
			<div class="slot-wrapper">
				<slot></slot>
			</div>
		</v-container>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
	/** Text to be displayed as title */
	title: String,
	/** Uniqueue name of this container */
	containerId: {
		type: String,
		required: true,
	},
	rememberUserToggle: {
		type: Boolean,
		default: true,
	},
	defaultOpen: {
		type: Boolean,
		default: false,
	},
	box: {
		type: Boolean,
		default: false,
	},
	small: {
		type: Boolean,
		default: false,
	},
	startPage: {
		type: Boolean,
		default: false,
	},
	icon: {
		type: String,
		default: '',
	},
	headinglevelh2: {
		type: Boolean,
		default: false,
	},
});

let openContainers: string[] = [];

const isOpened = ref<boolean>(false);
const hasOpenedAtleastOnce = ref<boolean>(false);

function loadOpenContainersFromStorage(): void {
	openContainers = (
		window.localStorage.getItem('basicUseToggle') || ''
	).split(',');
	isOpened.value = openContainers.indexOf(props.containerId) > -1;
	if (isOpened.value) {
		hasOpenedAtleastOnce.value = true;
	}
}
function saveOpenContainersToStorage(): void {
	window.localStorage.setItem('basicUseToggle', openContainers.join(','));
}

function isOpen(): boolean {
	return isOpened.value;
}

function toggle(): void {
	if (props.rememberUserToggle) {
		loadOpenContainersFromStorage();

		const index = openContainers.indexOf(props.containerId);
		if (index === -1) {
			isOpened.value = true;
			openContainers.push(props.containerId);
		} else {
			isOpened.value = false;
			openContainers.splice(index, 1);
		}

		saveOpenContainersToStorage();
	} else {
		isOpened.value = !isOpened.value;
	}

	if (isOpened.value) {
		hasOpenedAtleastOnce.value = true;
	}
}

function open(): void {
	if (!isOpened.value) {
		toggle();
	}
}

// default to false needs this
if (props.rememberUserToggle && !props.containerId) {
	throw new Error(
		'Container id must be set if rememberUserToggle isnt set to false'
	);
}
if (props.rememberUserToggle) {
	loadOpenContainersFromStorage();
} else {
	isOpened.value = props.defaultOpen !== false; // defaults to true
	if (isOpened.value) {
		hasOpenedAtleastOnce.value = true;
	}
}

// Element classes
function getClasses(): string {
	const classes = ['component-base-toggle-container'];
	classes.push(isOpened.value ? 'open' : 'close');
	if (props.box !== false) {
		classes.push('box-style');
	}
	if (props.small !== false) {
		classes.push('small-style');
	}
	return classes.join(' ');
}
function getH3Classes(): string {
	if (props.startPage) {
		return 'subheading toggle-container-title';
	} else {
		return 'subheading text-uppercase toggle-container-title';
	}
}
function getSpanClasses(): string {
	if (props.startPage) {
		if (isOpened.value) {
			return 'text-h5 headline-color headline-color-open';
		} else {
			return 'text-h5 headline-color';
		}
	} else {
		return '';
	}
}
function getOpenIconClasses(): string {
	if (props.startPage) {
		return 'chevron text-primary';
	} else {
		return 'chevron headline-color';
	}
}

defineExpose({
	toggle,
	isOpen,
	open,
});
</script>

<style scoped lang="scss">
.component-base-toggle-container {
	height: auto;
	overflow: visible;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;

	.wrap-btn {
		width: 100%;
		text-align: left;
	}
}

.headline-color {
	color: rgba(0, 0, 0, 0.54) !important;
}

.background-color-open {
	background-color: $primary-bg;
}

.headline-color-open {
	color: $primary !important;
}

h3.subheading,
h2.subheading {
	padding-bottom: 12px;
	padding: 8px 10px;
	line-height: 1;
	cursor: pointer;
	.v-icon.chevron {
		float: right;
	}
	.v-icon.title-icon {
		vertical-align: -3px;
		margin-right: 2px;
	}
}
h3:hover {
	background-color: rgba($primary, 0.2);
}

.small-style {
	h3.subheading {
		text-transform: none !important;
		padding: 0;
		font-size: 100% !important;
		.v-icon {
			float: none;
			font-size: 120%;
			margin-left: 3px;
		}
	}
}

.box-style {
	background: $grey-lighten-1;
	margin-top: 20px;
	overflow: visible;
}

.box-style > .container > h3.subheading {
	text-transform: none !important;
	color: $grey-darken-1;
	background: $grey-lighten-3;
	font-weight: normal;
}

.box-style > .container > .slot-wrapper {
	padding: 10px;
}
</style>
