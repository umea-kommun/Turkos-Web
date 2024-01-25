import { ComputedRef, ref, Ref } from 'vue';

interface IUseFieldMenuNavigationParams {
	id: ComputedRef<string>;
	showList?: () => void;
}
interface IUseFieldMenuNavigation {
	keyDown: (e: KeyboardEvent) => void;
	activeMenuItem: Ref<string | null>;
}

export const useFieldMenuNavigation = ({
	id,
	showList,
}: IUseFieldMenuNavigationParams): IUseFieldMenuNavigation => {
	const activeMenuItem = ref<string | null>(null);

	function scrollIntoView(element: HTMLElement): void {
		const scrollY = element.parentElement?.scrollTop ?? 0;
		const parentHeight = element.parentElement?.clientHeight ?? 0;
		const offsetY = element.offsetTop;

		if (scrollY + parentHeight < offsetY + element.clientHeight) {
			const scrollDistance =
				offsetY + element.clientHeight - (scrollY + parentHeight);

			element.parentElement?.scrollTo({
				top: offsetY + element.clientHeight - parentHeight,
				behavior: scrollDistance > 100 ? undefined : 'smooth',
				// If we need to scroll a long distance we don't want smooth scrolling
			});
		} else if (offsetY < scrollY) {
			const scrollDistance = scrollY - offsetY;

			element.parentElement?.scrollTo({
				top: offsetY,
				behavior: scrollDistance > 100 ? undefined : 'smooth',
			});
		}
	}

	function navigatePrevious(
		activeIndex: number,
		listItems: NodeListOf<Element>
	): void {
		if (activeIndex - 1 >= 0) {
			if (activeIndex > -1) {
				listItems[activeIndex].classList.remove('v-list-item--active');
			}
			listItems[activeIndex - 1].classList.add('v-list-item--active');
			activeMenuItem.value = listItems[activeIndex - 1].id;
			scrollIntoView(listItems[activeIndex - 1] as HTMLElement);
		}
	}

	function navigateNext(
		activeIndex: number,
		listItems: NodeListOf<Element>
	): void {
		if (activeIndex + 1 < listItems.length) {
			if (activeIndex > -1) {
				listItems[activeIndex].classList.remove('v-list-item--active');
			}
			listItems[activeIndex + 1].classList.add('v-list-item--active');
			activeMenuItem.value = listItems[activeIndex + 1].id;
			scrollIntoView(listItems[activeIndex + 1] as HTMLElement);
		}
	}

	function navigateMenu(forward: boolean): void {
		if (showList) {
			showList();
		}
		const listItems = document.querySelectorAll(
			'.v-menu-' + id.value + ' .v-list-item'
		);
		if (listItems?.length) {
			let activeIndex = -1;
			listItems.forEach((item, index) => {
				if (item.className.indexOf('v-list-item--active') > -1) {
					activeIndex = index;
				}
			});
			if (forward) {
				navigateNext(activeIndex, listItems);
			} else {
				navigatePrevious(activeIndex, listItems);
			}
		}
	}

	function select(e: KeyboardEvent): void {
		const listItems = document.querySelectorAll(
			'.v-menu-' + id.value + ' .v-list-item'
		);
		let activeIndex = -1;
		listItems.forEach((item, index) => {
			if (item.className.indexOf('v-list-item--active') > -1) {
				activeIndex = index;
			}
		});
		if (activeIndex > -1) {
			(listItems[activeIndex] as HTMLElement).click();
			e.preventDefault();
		}
	}

	function keyDown(e: KeyboardEvent): void {
		switch (e.code) {
			case 'Enter':
				select(e);
				e.preventDefault();
				break;
			case 'Space':
				select(e);
				break;
			case 'ArrowDown':
				navigateMenu(true);
				e.preventDefault();
				break;
			case 'ArrowUp':
				navigateMenu(false);
				e.preventDefault();
		}
	}

	return {
		keyDown,
		activeMenuItem,
	};
};
