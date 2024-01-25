import { ref } from 'vue';
const bus = ref(new Map());

export default function useEventsBus(): any {
	function emitError(event: any, ...args: any): any {
		bus.value.set(event, args);
	}

	return {
		emitError,
		bus,
	};
}
