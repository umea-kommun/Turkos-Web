<template>
	<v-col class="base-form-group pa-0">
		<h2 v-if="title" ref="groupRef">
			{{ title + ' (' + count + ')' }}
		</h2>
		<div
			class="items-wrapper"
			:class="showGrid ? 'grid-layout' : 'list-layout'"
		>
			<v-list-item
				ripple
				v-for="form in showAll && !loading
					? items
					: items.slice(0, perRow)"
				:key="form.id + (groupItems?.length ? groupItems[0].tag : '')"
				:to="'/' + form.attributes.path"
				:aria-labelledby="'heading-' + form.id"
				:id="`${props.title}-service-${form.id}`"
			>
				<v-list-item-title>
					<h3 class="subheading" :id="'heading-' + form.id">
						{{ form.attributes.title }}
						<v-icon
							v-if="form.attributes.type === 'LinkExternal'"
							size="20"
							color="grey"
							class="inline-icon"
							icon="open_in_new"
						/>
					</h3>
				</v-list-item-title>
				<v-list-item-subtitle v-if="showGrid">
					<span>
						{{
							formatFormDescription(form.attributes.description)
						}}</span
					>
				</v-list-item-subtitle>
				<div class="separator"></div>
				<v-list-item-action>
					<span>{{ $t('component.appStart.toEService') }}</span>
					<v-icon size="22" color="white" icon="arrow_forward" />
				</v-list-item-action>
			</v-list-item>
		</div>
		<div class="show-more-btn-wrap">
			<v-btn
				v-if="(count || 0) - perRow > 0"
				@click="showAllServices()"
				variant="flat"
				class="show-more-btn"
				:loading="showAll && loading"
				:aria-label="
					!!title
						? $t('component.appStart.showAllInCategory') +
						  ' ' +
						  title
						: $t('component.appStart.showAllUncategorized')
				"
			>
				<span v-if="!showAll">
					{{ $t('component.appStart.showAll') }}
				</span>
				<span v-else>{{ $t('component.appStart.showLess') }}</span>
			</v-btn>
		</div>
	</v-col>
</template>

<script setup lang="ts">
import { ref, computed, PropType, nextTick } from 'vue';
import { IForm } from '@/models/IForm';

/**
 * Start page for the application
 * @description WCAG: semantic headers (1.3.1)
 */
const props = defineProps({
	title: { type: String },
	count: { type: Number },
	forms: {
		type: Array as PropType<IForm[]>,
		required: true,
	},
	groupItems: {
		type: Array as PropType<any[]>,
	},
	showGrid: {
		type: Boolean,
		default: true,
	},
	defaultShowAll: {
		type: Boolean,
		default: false,
	},
	perRow: {
		type: Number,
		default: 3,
	},
	loading: {
		type: Boolean,
		default: false,
	},
});

let showAll = ref<boolean>(props.defaultShowAll);

const items = computed(() => {
	let list: IForm[] = [];
	if (props.groupItems) {
		list = props.groupItems.map(
			(groupItem) => props.forms[groupItem.index]
		);
	} else {
		list = props.forms;
	}
	return list;
});

function decodeHTMLEntities(text: string): string {
	var textArea = document.createElement('textarea');
	textArea.innerHTML = text;
	return textArea.value;
}

const formatFormDescription = (text: string): string => {
	const noHtml = decodeHTMLEntities(text.replace(/<[^>]*>/g, ''));
	if (noHtml?.length > 100) {
		return noHtml.substr(0, 100) + '...';
	}
	return noHtml;
};

const groupRef = ref<HTMLElement | null>();

function isInViewport(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();
	const height = window.innerHeight || document.documentElement.clientHeight;
	const width = window.innerWidth || document.documentElement.clientWidth;

	if (!rect) {
		return false;
	}

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= height &&
		rect.right <= width
	);
}

async function showAllServices(): Promise<void> {
	showAll.value = !showAll.value;

	if (showAll.value) {
		const nextItemId = items.value.at(props.perRow)?.id;

		await nextTick();

		document
			.getElementById(`${props.title}-service-${nextItemId}`)
			?.focus();
	} else {
		if (!groupRef.value) {
			return;
		}

		if (!isInViewport(groupRef.value)) {
			groupRef.value.scrollIntoView();
		}
	}
}
</script>

<style scoped lang="scss">
.base-form-group {
	margin-bottom: 10px;

	h2 {
		margin-bottom: 10px;
	}

	.show-more-btn-wrap {
		min-height: 20px;
		width: 100%;
		display: flex;
		justify-content: center;
		.v-btn.show-more-btn {
			text-transform: uppercase;
			letter-spacing: 0.1rem;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
			border: none;

			.v-btn__content {
				> span {
					white-space: break-spaces;
				}
			}
		}
	}

	.items-wrapper {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 10px;
	}

	:deep(.v-list-item__content) {
		flex-direction: column;
		height: 100%;
		width: 100%;
		display: flex;
	}
	.v-list-item {
		flex: 1 1 0px;
		min-width: 30%;
		max-width: 33%;

		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0px 1px 3px #00000014;
		margin-bottom: 10px;
		padding: 0 !important;

		.v-list-item-title {
			padding: 16px;
			padding-bottom: 0;
			font-size: size(16);

			h3 {
				white-space: pre-line;
				font-weight: normal;
			}
		}

		.v-list-item-subtitle {
			padding: 16px;
			display: block;
			color: $grey-darken-2;
			opacity: 1;
		}

		.v-list-item-action {
			width: 100%;
			padding: 10px;
			margin-top: 10px;
			background-color: $primary;
			color: #fff;
			text-align: center;
			align-items: center;
			justify-content: center;
			border-radius: 0 0 8px 8px;
			.v-icon {
				margin-left: 6px;
			}
		}

		.separator {
			display: block;
			flex-grow: 1;
		}
	}

	.items-wrapper.list-layout {
		display: block;

		.v-list-item {
			min-width: auto;
			max-width: none;
			margin-bottom: 10px;

			.v-list-item-title {
				flex: 1;
				padding: 14px;
			}
			.v-list-item-action {
				width: auto;
				border-radius: 0 8px 8px 0;
				margin: 0;
				padding-left: 14px;
				align-self: stretch;
			}
			.separator {
				display: none;
			}

			:deep(.v-list-item__content) {
				flex-direction: row;
			}
		}
	}

	:deep(.v-btn .v-progress-circular) {
		color: $primary;
	}
}

@media only screen and (min-width: 1440px) {
	.items-wrapper.grid-layout {
		.v-list-item {
			min-width: 20%;
			max-width: 25%;
		}
	}
}
@media only screen and (max-width: 600px) {
	.items-wrapper.list-layout {
		.v-list-item-action {
			.v-icon {
				margin: 0;
			}
			span {
				display: none;
			}
		}
	}
}
</style>
