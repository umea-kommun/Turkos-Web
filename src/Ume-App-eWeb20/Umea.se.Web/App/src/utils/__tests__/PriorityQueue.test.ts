import PriorityQueue from '@/utils/PriorityQueue';
import { describe, expect, test } from 'vitest';

describe('PriorityQueue', () => {
	describe('size', () => {
		test('size is correct', () => {
			const queue = new PriorityQueue<string>();

			expect(queue.size).toBe(0);

			queue.push('test 1');
			expect(queue.size).toBe(1);

			queue.push('test 2');
			expect(queue.size).toBe(2);

			queue.pop();
			expect(queue.size).toBe(1);
		});
	});

	describe('pop', () => {
		test('Pops in priority order', () => {
			const queue = new PriorityQueue<string>();

			queue.push('test prio 4', 4);
			queue.push('test prio 2', 2);
			queue.push('test prio 1', 1);
			queue.push('test prio 3', 3);

			expect(queue.pop()).toBe('test prio 1');
			expect(queue.pop()).toBe('test prio 2');
			expect(queue.pop()).toBe('test prio 3');
			expect(queue.pop()).toBe('test prio 4');
		});

		test('Throws error when poping empty queue', () => {
			const queue = new PriorityQueue<string>();

			expect(() => queue.pop()).toThrowError(Error);

			queue.push('test');
			expect(queue.pop()).toBe('test');

			expect(() => queue.pop()).toThrowError(Error);
		});
	});

	describe('contains', () => {
		test('Returns true if queue contains value', () => {
			const queue = new PriorityQueue<string>();
			queue.push('test 1');
			queue.push('test 2');

			expect(queue.contains('test 1')).toBe(true);
		});

		test('Returns false if queue does not contain value', () => {
			const queue = new PriorityQueue<string>();
			queue.push('test 1');
			queue.push('test 2');

			expect(queue.contains('test 3')).toBe(false);
		});
	});

	describe('toArray', () => {
		test('Values in queue returned in array (in right order)', () => {
			const queue = new PriorityQueue<string>();

			queue.push('test prio 4', 4);
			queue.push('test prio 2', 2);
			queue.push('test prio 1', 1);
			queue.push('test prio 3', 3);

			const result = queue.toArray();

			expect(result.length).toBe(4);
			expect(result[0]).toBe('test prio 1');
			expect(result[1]).toBe('test prio 2');
			expect(result[2]).toBe('test prio 3');
			expect(result[3]).toBe('test prio 4');
		});

		test('Empty queue return empty array', () => {
			const queue = new PriorityQueue<string>();

			const result = queue.toArray();

			expect(result.length).toBe(0);
		});
	});
});
