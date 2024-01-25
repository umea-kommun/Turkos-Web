export default class PriorityQueue<T> {
	private data: Array<{ value: T; priority: number }> = [];

	public push(value: T, priority = 0): number {
		return this.data.push({ value, priority });
	}

	public toArray(): T[] {
		const arr: T[] = [];
		while (this.data.length > 0) {
			arr.push(this.pop());
		}
		return arr;
	}

	public contains(value: T): boolean {
		return this.data.some((queueItem) => queueItem.value === value);
	}

	public pop(): T {
		if (this.data.length === 0) {
			throw new Error(
				'Array index out of bounds, you can not pop from a queue that is empty'
			);
		}
		let index = 0;
		let min = Infinity;
		for (let i = 0; i < this.data.length; i++) {
			const priority = this.data[i].priority;
			if (Math.min(min, priority) === priority) {
				min = priority;
				index = i;
			}
		}
		return this.data.splice(index, 1)[0].value;
	}

	get size(): number {
		return this.data.length;
	}
}
