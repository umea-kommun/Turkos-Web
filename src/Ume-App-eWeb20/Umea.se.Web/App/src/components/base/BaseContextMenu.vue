<template>
	<v-menu
		ref="menu"
		v-model="showMenu"
		scroll-strategy="close"
		:close-on-content-click="closeOnContentClick"
		:min-width="minWidth"
		@contextmenu.prevent
		:location-strategy="setMenuLocation as any"
	>
		<slot></slot>
	</v-menu>
</template>

<script setup lang="ts">
import { Ref, ref, WritableComputedRef } from 'vue';

/**
 * @example
 * <code>
 *  <BaseRightClickMenu ref="someName">
 *    ... menu content
 *  </BaseRightClickMenu>
 *  ...
 *  <p @contextmenu.prevent="$refs['someName'].open($event)">
 *    Right click on me!
 *  </p>
 * </code>
 */

defineProps({
	minWidth: {
		type: Number,
		default: 220,
	},
	closeOnContentClick: {
		type: Boolean,
		default: true,
	},
});
const emit = defineEmits(['open']);

const mousePositionX = ref<number>(1);
const mousePositionY = ref<number>(1);
const showMenu = ref<boolean>(false);
const menu = ref();

function open($event: MouseEvent): void {
	mousePositionX.value = $event.clientX;
	mousePositionY.value = $event.clientY;
	showMenu.value = true;
	emit('open');
	setTimeout(() => {
		if (menu.value?.updateLocation) {
			menu.value?.updateLocation();
		}
	});
}
function close(): void {
	showMenu.value = false;
}

const setMenuLocation = (
	data: {
		target: Ref<HTMLButtonElement>;
		contentEl: Ref<HTMLDivElement>;
	},
	props: unknown,
	contentStyles: WritableComputedRef<Record<string, string>>
): unknown => {
	const updateLocation = (): void => {
		const menu = data.contentEl.value;
		let x = mousePositionX.value;
		let y = mousePositionY.value;

		// Reposition if outside window
		const menuBounds = menu.getBoundingClientRect();
		if (x + menuBounds.width + 26 > window.innerWidth) {
			const diff = x + menuBounds.width - window.innerWidth;

			x -= diff + 26;
		}
		if (y + menuBounds.height + 26 > window.innerHeight) {
			const diff = Math.min(
				y + menuBounds.height - window.innerHeight,
				menuBounds.height
			);
			y -= diff + 26;
		}

		Object.assign(contentStyles.value, {
			position: 'fixed',
			top: y + 'px',
			left: x + 'px',
		});
	};

	return {
		updateLocation,
	};
};

defineExpose({
	open,
	close,
});
</script>

<style scoped lang="scss">
.v-menu__content.menuable__content__active {
	overflow: hidden;
}
.v-menu__content:first-child {
	overflow-y: auto;
}
</style>
