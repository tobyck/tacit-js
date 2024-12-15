import { tag } from "./helpers.js"
import { _Set, Vec } from "./classes.js"

/** @namespace */
const type_checks = {}

/** 
 * **[Global]** Checks if a value is a number or a big int
 * @function
 * @param {any} value Value to check
 * @returns {boolean}
 */
type_checks.isnum = tag({ keep_global: true }, x => typeof x === "number" || typeof x === "bigint")

/** 
 * **[Global]** Same as the built in [Number.isInteger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger)
 * @function
 * @param {any} value Value to check
 * @returns {boolean}
 */
type_checks.isint = tag({ keep_global: true }, Number.isInteger)

/** 
 * **[Global]** Checks if a value is a string
 * @function
 * @param {any} value Value to check
 * @returns {boolean}
 */
type_checks.isstr = tag({ keep_global: true }, x => typeof x === "string")

/** 
 * **[Global]** Checks if a value is an array (alias for Array.isArray)
 * @function
 * @param {any} value Value to check
 * @returns {boolean}
 */
type_checks.isarr = tag({ keep_global: true }, Array.isArray)

/** 
 * **[Global]** Checks if a value is a boolean
 * @function
 * @param {any} value Value to check
 * @returns {boolean}
 */
type_checks.isbool = tag({ keep_global: true }, x => typeof x === "boolean")

/** 
 * **[Global]** Checks if a value is a function
 * @function
 * @param {any} value Value to check
 * @returns {boolean}
 */
type_checks.isfunc = tag({ keep_global: true }, x => typeof x === "function")

/**
 * **[Global]** Checks if a value is an object
 * @function
 * @param {any} value Value to check
 * @returns {boolean}
 */
type_checks.isobj = tag({ keep_global: true }, x => typeof x === "object")

/** 
 * **[Global]** Gets the type of a value using typeof
 * @function
 * @param {any} value Value to get the type of
 * @returns {boolean}
 */
type_checks.type = tag({ keep_global: true }, x => typeof x)

/** 
 * **[Global]** Checks if a type is iterable
 * @function
 * @param {any} value Value to check
 * @returns {boolean}
 */
type_checks.isiter = tag({ keep_global: true }, x => typeof x[Symbol.iterator] === "function")

/** @namespace */
const type_casts = {}

/**
 * Casts a value to a number using the `Number` constructor. If `value` is a string
 * then a number will be extracted with regex before casting.
 * @param {any} value
 * @returns {number}
 */
type_casts.num = value => {
	if (type_checks.isstr(value)) {
		const match = value.match(/-?\d+(\.\d+)?/)[0]
		return match ? Number(match) : null
	}

	return Number(value)
}

/**
 * Casts a value to an integer using parseInt. If `value` is a string an int
 * will be extracted with regex before casting).
 * @param {any} value Value to cast
 * @returns {number}
 */
type_casts.int = value => parseInt(type_casts.num(value))

/**
 * Casts a value to a string. If `value` is an array, it will be joined by "".
 * @param {any} value Value to cast
 */
type_casts.str = value => {
	const str = value.toString()

	if (value instanceof Vec)
		return `Vec(${value.x}, ${value.y})`
	if (type_checks.isarr(value))
		return value.join("")
	if (type_checks.isobj(value))
		return str === "[object Object]" ? JSON.stringify(value) : str

	return str
}

/**
 * Casts a value to an array. If `value` is a number, an array of length `value`
 * will be created
 * @param {any} value Value to cast
 * @returns {Array}
 */
type_casts.arr = value => {
	if (type_checks.isnum(value)) return Array(value)
	if (type_checks.isiter(value)) return [...value]
	return Array.from(value)
}

/**
 * Casts a value to a boolean (alias for Boolean constructor)
 * @param {any} value Value to cast
 * @returns {boolean}
 */
type_casts.bool = value => Boolean(value)

/** @namespace */
const math_utils = {}

/** 
 * Casts `a` and `b` using `Number` constructor, then adds them using `+` operator
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
math_utils.add = (a, b) => Number(a) + Number(b)

/** 
 * Casts `a` and `b` using `Number` constructor, then subtracts them using `-` operator
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
math_utils.sub = (a, b) => Number(a) - Number(b)

/** 
 * Casts `a` and `b` using `Number` constructor, then multiplies them using `*` operator
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
math_utils.mul = (a, b) => Number(a) * Number(b)

/** 
 * Casts `a` and `b` using `Number` constructor, then divides them using `/` operator
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
math_utils.div = (a, b) => Number(a) / Number(b)

/** 
 * Casts `a` and `b` using `Number` constructor, then calculates `a % b` 
 * (note: this is not true modulo, just remainder after division)
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
math_utils.mod = (a, b) => Number(a) % Number(b)

/** 
 * Calculates `b ** m` (optionally modulo `m`)
 * @param {number} b
 * @param {number} e
 * @param {number} [m]
 * @return {number}
 */
math_utils.exp = (b, e, m = null) => {
	if (m) {
		// naive solution but it does the job
		if (m == 1) return 0
		let ret = 1
		for (let i = 0; i < e; i++)
			ret = (ret * b) % m
		return ret
	} else return b ** e
}

/**
 * Returns the absolute difference between `a` and `b`
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
math_utils.absdiff = (a, b) => Math.abs(a - b)

/**
 * Checks if `a` is greater than `b`
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
math_utils.gt = (a, b) => a > b

/**
 * Checks if `a` is less than `b`
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
math_utils.lt = (a, b) => a < b

/**
 * Checks if `a` is greater than or equal to `b`
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
math_utils.gte = (a, b) => a >= b

/**
 * Checks if `a` is less than or equal to `b`
 * @param {number} a
 * @param {number} b
 * @returns {boolean}
 */
math_utils.lte = (a, b) => a <= b

/**
 * Checks if `n` is odd
 * @param {number} n
 * @returns {boolean}
 */
math_utils.odd = n => n % 2 === 1

/**
 * Checks if `n` is even
 * @param {number} n
 * @returns {boolean}
 */
math_utils.even = n => n % 2 === 0

/**
 * Calculates the absolute value of `n`
 * @param {number} n
 * @returns {number}
 */
math_utils.abs = n => Math.abs(n)

/**
 * Calculates the square root of `n`
 * @param {number} n
 * @returns {number}
 */
math_utils.sqrt = n => Math.sqrt(n)

/**
 * Calculates the sign of `n`
 * @param {number} n
 * @returns {number}
 */
math_utils.sign = n => Math.sign(n)

/**
 * Rounds `n` down to the nearest integer
 * @param {number} n
 * @returns {number}
 */
math_utils.floor = n => Math.floor(n)

/**
 * Rounds `n` up to the nearest integer
 * @param {number} n
 * @returns {number}
 */
math_utils.ceil = n => Math.ceil(n)

/**
 * Rounds `n` to the nearest integer
 * @param {number} n
 * @returns {number}
 */
math_utils.round = n => Math.round(n)

/**
 * Wraps `index` around `length` (for indexing into to arrays, strings, etc.)
 * @param {number} index
 * @param {number} length
 * @returns {number}
 */
math_utils.wrapindex = (index, length) => (index % length + length) % length

/**
 * Clamps `n` between `min` and `max`
 * @param {number} n
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
math_utils.clamp = (n, min, max) => Math.min(Math.max(n, min), max)

/**
 * Checks if `n` is in the range [`min`, `max`] (inclusive)
 * @param {number} n
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
math_utils.inrange = (n, min, max) => n >= min && n <= max

/**
 * Functions which operate on iterable types
 * @namespace
 */
const iter_utils = {}

/**
 * Gets the first `n` elements of an iterable value and returns them in an array
 * @template T
 * @param {Iterable.<T>} iter The iterable to get elements from
 * @param {number} n The number of elements to get
 * @returns {T[]}
 */
iter_utils.firstn = (iter, n) => [...iter].slice(0, n)

/**
 * Gets the last `n` elements of an iterable value and returns them in an array
 * @template T
 * @param {Iterable.<T>} iter The iterable to get elements from
 * @param {number} n The number of elements to get
 * @returns {T[]}
 */
iter_utils.lastn = (iter, n) => !n ? [] : [...iter].slice(-n)

/**
 * Gets the first element of an iterable value
 * @param {Iterable.<*>} iter The iterable to get the first element from
 * @returns {any}
 */
iter_utils.first = iter => [...iter][0]

/**
 * Gets the last element of an iterable value
 * @param {Iterable.<*>} iter The iterable to get the last element from
 * @returns {any}
 */
iter_utils.last = iter => {
	const array = [...iter]
	return array[array.length - 1]
}

/**
 * Removes the nth element from an iterable value
 * @template T
 * @param {Iterable.<T>} iter The iterable to remove an element from
 * @param {number} index The index of the element to remove
 * @returns {T[]} The resulting array
 */
iter_utils.dropnth = (iter, index) => {
	const array = [...iter]
	array.splice(math_utils.wrapindex(index, array.length), 1)
	return array
};

/**
 * Sums the elements of an iterable value
 * @param {Iterable.<*>} iter The iterable to sum
 * @returns {number|string}
 */
iter_utils.sum = iter => [...iter].reduce((acc, cur) => acc + cur)

/**
 * Calculates the product of all values in an iterable
 * @param {Iterable.<*>} iter The iterable
 * @returns {number}
 */
iter_utils.prod = iter => [...iter].reduce((acc, cur) => acc * cur)

/**
 * Reverses the elements of an iterable (not in place)
 * @template T
 * @param {Iterable.<T>} iter The iterable to reverse
 * @returns {T[]} The reversed array
 */
iter_utils.rev = iter => [...iter].reverse()

/**
 * **[Global]** Zips multiple iterable into a single array of arrays, each
 * containing a single element from each iterable. The result will only be as
 * long as the shortest input.
 * @template T
 * @function
 * @param {...Iterable.<T[]>} iters The iterables to zip
 * @returns {T[][]}
 * @example zip([1, 2, 3], [4, 5, 6]) // [[1, 4], [2, 5], [3, 6]]
 * @example zip([1, 2]) // [[1], [2]]
 */
iter_utils.zip = tag({ keep_global: true }, (...iters) => {
	if (!iters.length) return [];

	const smallest = Math.min(...iters.map(x => x.length))
	const ret = [];

	for (let i = 0; i < smallest; i++) {
		ret.push(iters.map(x => x[i]));
	}

	return ret;
})

/**
 * Creates a new {@link _Set} from an iterable. Same as {@link constructors.set}.
 * @param {Iterable.<*>} iter The iterable to create a set from
 * @returns {_Set}
 */
iter_utils.uniq = iter => new _Set(iter)

/**
 * Sorts an iterable given a comparison function (same as [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort))
 * but not in place
 * @template T
 * @param {Iterable.<T>} iter The iterable to sort
 * @param {function(T, T): number} compare_fn The comparison function
 * @returns {T[]} The sorted array
 */
iter_utils.sorted = (iter, compare_fn) => [...iter].sort(compare_fn)

/**
 * Sorts an iterable (of numbers) in ascending order
 * @template T
 * @param {Iterable.<T>} iter The iterable to sort
 * @returns {T[]} The sorted array
 */
iter_utils.nsort = iter => [...iter].sort((a, b) => a - b)

/**
 * Sorts an iterable (of numbers) in descending order
 * @param {Iterable.<*>} iter The iterable to sort
 * @returns {T[]} The sorted array
 */
iter_utils.rsort = iter => [...iter].sort((a, b) => b - a)

/**
 * Sorts an iterable in ascending order by the result of applying a given
 * function to each element
 * @template T
 * @param {Iterable.<T>} iter The iterable to sort
 * @param {function(T)} func The function to apply to each element
 * @returns {T[]} The sorted array
 */
iter_utils.sortby = (iter, func) => iter.sort((a, b) => func(a) - func(b))

/**
 * Sorts an iterable in descending order by the result of applying a given
 * function to each element
 * @template T
 * @param {Iterable.<T>} iter The iterable to sort
 * @param {function(T)} func The function to apply to each element
 * @returns {T[]} The sorted array
 */
iter_utils.rsortby = (iter, func) => iter.sort((a, b) => func(b) - func(a))

/** 
 * Same as the built in [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
 * @template T
 * @param {Iterable.<T>} iter The iterable to iterate over
 * @param {function(T, number, Iterable.<T>)} callback The callback to call for each element (see the MDN link for more info)
 * @returns {Iterable.<T>} The original iterable
 */
iter_utils.for = (iter, callback) => {
	[...iter].forEach(callback)
	return iter
}

/** 
 * Same as the built in [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
 * @function
 * @template T
 * @param {Iterable.<T>} iter The iterable to iterate over
 * @param {function(T, number, Iterable.<T>)} callback The callback to call for each element (see the MDN link for more info)
 * @returns {Iterable.<T>} The original iterable
 */
iter_utils.each = iter_utils.for

/**
 * Same as the built in [Math.min](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min)
 * but it takes an iterable as a single argument
 * @param {Iterable.<*>} iter The iterable to find the minimum of
 * @returns {number}
 */
iter_utils.min = iter => Math.min(...iter)

/**
 * Same as the built in [Math.max](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max)
 * but it takes an iterable as a single argument
 * @param {Iterable.<*>} iter The iterable to find the maximum of
 * @returns {number}
 */
iter_utils.max = iter => Math.max(...iter)

/**
 * Same as the built in [Array.push](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
 * @template T
 * @param {T[]} array The array to append to
 * @param {...T} items The items to append
 * @returns {T[]} The resulting array
 */
iter_utils.append = (array, ...items) => (array.push(...items), array)

/**
 * Same as the built in [Array.unshift](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)
 * @template T
 * @param {T[]} array The array to prepend to
 * @param {...T} items The items to prepend
 * @returns {T[]} The resulting array
 */
iter_utils.prepend = (array, ...items) => (array.unshift(...items), array)

/**
 * Checks if all items in an iterable are equal
 * @param {Iterable.<*>} iter The iterable to check
 * @returns {boolean}
 */
iter_utils.alleq = iter => {
	const array = [...iter]
	return array.every(item => misc_utils.eq(item, array[0]))
}

/**
 * Creates a list of sublists of length `size` each of which is a sliding
 * window looking into `iter` starting at index `0` moving along by 1 each
 * time. If `loop` is true, there will be some extra windows at the end which
 * wrap around to the start.
 * @template T
 * @param {Iterable.<T[]>} iter The iterable to create sliding windows from
 * @param {number} size The size of the sliding window
 * @param {boolean} [wrap=false] Whether to include windows that wrap around
 * @returns {T[][]}
 * @example [1, 2, 3, 4, 5].sliding(3) // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 * @example [1, 2, 3].sliding(2, true) // [[1, 2], [2, 3], [3, 1]]
 */
iter_utils.sliding = (iter, size = 2, wrap = false) => {
	const array = [...iter]
	if (array.length < size) return [array]
	const x = wrap ? array.concat(array.slice(0, size - 1)) : array
	return x.slice(0, -size + 1).map((_, i) => x.slice(i, i + size))
}

/**
 * Creates a list of contiguous non-overlapping chunks of `iter`, each of
 * length `size`
 * @template T
 * @param {Iterable.<*>} iter The iterable to create chunks from
 * @param {number} [size=2] The size of each chunk
 * @returns {T[][]}
 * @example [1, 2, 3, 4, 5, 6].chunks() // [[1, 2], [3, 4], [5, 6]]
 * @example [1, 2, 3, 4, 5, 6].chunks(3) // [[1, 2, 3], [4, 5, 6]]
 */
iter_utils.chunks = (iter, size = 2) => {
	const ret = []
	for (let i = 0; i < iter.length; i += size) {
		ret.push(iter.slice(i, i + size))
	}
	return ret
}

/**
 * Swaps the elements at indices `index_a` and `index_b` in `array`. Only works
 * on arrays so that it can be done in place.
 * @template T
 * @param {T[]} array The array to swap elements in
 * @param {number} index_a The index of the first element to swap
 * @param {number} index_b The index of the second element to swap
 * @returns {T[]} The resulting array
 */
iter_utils.swap = (array, index_a, index_b) => {
	[array[index_a], array[index_b]] = [array[index_b], array[index_a]]
	return array
}

/**
 * Generates all permutations of an iterable
 * @template T
 * @param {Iterable.<T>} iter
 * @returns {T[][]}
 */
iter_utils.perms = iter => {
	const array = [...iter]
	if (!array.length) return []

	const output = []

	const generate = (k, array) => {
		if (k === 1) {
			output.push(array.slice())
			return
		}

		generate(k - 1, array)

		for (let i = 0; i < k - 1; i++) {
			if (k % 2 === 0) iter_utils.swap(array, i, k - 1)
			else iter_utils.swap(array, 0, k - 1)
			generate(k - 1, array)
		}
	}

	generate(array.length, array)
	return output
}

/**
 * Return a list with every `n`th element of `iter` starting at index `start`
 * @template T
 * @param {Iterable.<T>} iter The iterable to get elements from
 * @param {number} n The step size
 * @param {number} [start=0] The starting index
 * @returns {T[]}
 */
iter_utils.everynth = (iter, n, start = 0) => {
	const ret = [];
	for (let i = start; i < iter.length; i += n)
		ret.push(iter[i])
	return ret
}

/**
 * Gets the element at `index` in `iter`. Indices wrap around using
 * {@link math_utils.wrapindex}. If `index` is a {@link Vec}, `iter` will be
 * treated as a grid, or if `index` is a list of integers, a list of elements
 * at those indices will be returned.
 * @function
 * @template T
 * @param {Iterable.<T|Iterable.<T>>} iter The iterable to get elements from
 * @param {number|Vec|number[]} index The index/indicies to get
 * @returns {T}
 */
iter_utils.at = tag({ attach_to: [Array] }, (iter, index) => {
	const array = [...iter]

	if (type_checks.isint(index)) {
		return array[math_utils.wrapindex(index, array.length)];
	} else if (index instanceof Vec) {
		return iter?.[index.y]?.[index.x]
	} else if (type_checks.isarr(index) && index.every(type_checks.isint)) {
		return index.map(i => iter_utils.at(array, i));
	} else {
		throw new Error(`Invalid index/indicies ${JSON.stringify(index)}`);
	}
})

const count = (iter, value, string_like_match = false, overlapping = false) => {
	const array = [...iter]
	if (typeof value === "function") return array.filter(value).length

	string_like_match = type_checks.isstr(iter) || string_like_match

	if (type_checks.isiter(value) && string_like_match) {
		const to_find = [...value]
		let count = 0

		for (let i = 0; i < array.length;) {
			if (misc_utils.eq(array.slice(i, i + to_find.length), to_find)) {
				count++
				i += overlapping ? 1 : to_find.length
			} else i++
		}

		return count
	}

	return array.filter(x => misc_utils.eq(x, value)).length
}

/**
 * Counts the number of times `value` appears in `iter`. If `value` is a
 * function, it's will do the same as `.filter(f).length`, if `iter` is a
 * string or `string_like_match` is explicitly set to `true`, `["a", "b"]` will
 * match `abcd` or ["a", "b", "c", "d"] as well as something like 
 * ["arstneio", ["a", "b], 4].
 * @param {Iterable.<*>} iter The iterable to count values in
 * @param {any} value The value to count
 * @param {boolean} [string_like_match=false] (See description)
 * @returns {number}
 * @example [4, 2, 3, 1, 2].count(2) // 2
 * @example "abababa".count("aba") // 2
 * @example [3, 2, 1, 2, 1].count([2, 1]) // 0
 * @example [3, 2, 1, 2, 1].count([2, 1], true) // 2
 */
iter_utils.count = (...args) => count(...args)

/**
 * Same as `iter_utils.count` but counts overlapping matches
 * @param {Iterable.<*>} iter The iterable to count values in
 * @param {any} value The value to count
 * @param {boolean} [string_like_match=false] (See description)
 * @returns {number}
 * @example "abababa".countol("aba") // 3
 * @example [1, 2, 1, 2, 1].countol([1, 2, 1]) // 2
 */
iter_utils.countol = (iter, value, string_like_match = false) => count(iter, value, string_like_match, true)

/**
 * Same as the built in [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
 * but inverted. For consistency with builtins like `Array.filter` and `Array.map` which _don't_ work on any iterable. This must also be called on an array.
 * @template T
 * @param {T[]} array The iterable to filter
 * @param {function(T): boolean} filter_fn The filter function
 * @returns {T[]}
 */
iter_utils.filterout = (array, filter_fn) => array.filter((...args) => !filter_fn(...args))

/**
 * Checks if there are no elements in `array` that satisfy `fn`. `fn` is passed
 * to the built in [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
 * so refer to those docs if needed.
 * @template T
 * @param {T[]} array The array to check
 * @param {function(T, number, T[]): boolean} fn The function to check
 * @returns {boolean}
 */
iter_utils.none = (array, fn) => !array.some(fn)

/**
 * Gets the differences between consecutive elements of an iterable
 * @param {Iterable.<number>} iter The iterable to get deltas from
 * @returns {number[]}
 * @example [1, 2, 9, -4].deltas // [1, 7, -13]
 */
iter_utils.deltas = iter => {
	const array = [...iter];

	if (array.length <= 1) return [];

	const ret = [];
	for (let i = 0; i < array.length - 1; i++) {
		ret.push(array[i + 1] - array[i]);
	}
	return ret;
}

/**
 * Splits an iterable into `n` pieces. Rounds up if the split is uneven.
 * @template T
 * @param {Iterable.<T>} iter The iterable to split
 * @param {number} n The number of pieces to split into
 * @returns {T[][]}
 * @example [1, 2, 3, 4, 5, 6].pieces(3) // [[1, 2], [3, 4], [5, 6]]
 * @example [1, 2, 3].pieces(2) // [[1, 2], [3]]
 */
iter_utils.pieces = (iter, n) => {
	if (n <= 0) return []
	const array = [...iter], ret = [], step = Math.ceil(array.length / n);
	for (let i = 0; i < array.length; i += step) {
		ret.push(array.slice(i, i + step))
	}
	return ret
}

/**
 * Returns list of indices where the function `fn` returns true. `fn` receives
 * the value, index and the iterable as arguments, in that order.
 * @template T
 * @param {Iterable.<T>} iter
 * @param {function(T, number, Iterable.<T>): boolean} fn
 * @returns {number[]}
 * @example [1, 2, 3, 4, 5].iwhere(x => x % 2 === 0) // [1, 3]
 */
iter_utils.iwhere = (iter, fn) => [...iter]
	.map((value, index) => [value, index])
	.filter(([value, index]) => fn(value, index, iter))
	.map(([, index]) => index)

/** @namespace */
const string_utils = {}

/**
 * Splits a string into an array of characters
 * @param {string} str The string to split
 * @returns {string[]}
 */
string_utils.chars = str => str.split("")

/**
 * Splits a string on spaces and trims each word
 * @param {string} str The string to split
 * @returns {string[]}
 */
string_utils.words = str => str.split(" ").map(s => s.trim())

/**
 * Splits a string on "\n"
 * @param {string} str The string to split
 * @returns {string[]}
 */
string_utils.lines = str => str.split("\n")

/**
 * Splits a string on "\n\n"
 * @param {string} str The string to split
 * @returns {string[]}
 */
string_utils.groups = str => str.split("\n\n")

/**
 * Splits a string on commas and trims each element
 * @param {string} str The string to split
 * @returns {string[]}
 */
string_utils.csv = str => str.split(",").map(s => s.trim())

/**
 * Checks if a character is a digit
 * @param {string} char The character to check
 * @returns {boolean}
 */
string_utils.isdigit = char => /^\d$/.test(char)

/**
 * Extracts all integers from a string and returns them in an array
 * @param {string} str The string to extract integers from
 * @returns {number[]}
 */
string_utils.ints = str => str.match(/-?\d+/g).map(type_casts.int)

/**
 * Extracts all numbers from a string and returns them in an array
 * @param {string} str The string to extract numbers from
 * @returns {number[]}
 */
string_utils.nums = str => str.match(/\d+(\.\d+)?/g).map(type_casts.num)

/**
 * Gets the ASCII code a character
 * @param {string} char The character to get the code of
 * @returns {number}
 */
string_utils.chcode = char => char.charCodeAt(0)

/** @namespace */
const logic_utils = {}

/**
 * Returns `a && b`. I.e. if `a` is truthy it returns `b`, otherwise it short
 * circuits and returns `a`
 * @param {any} a
 * @param {any} b
 * @returns {any}
 */
logic_utils.and = (a, b) => a && b

/**
 * Returns `a || b`. I.e. if `a` is truthy it short circuits and returns `a`,
 * otherwise it returns `b`
 * @param {any} a
 * @param {any} b
 * @returns {any}
 */
logic_utils.or = (a, b) => a || b

/**
 * Returns logical NOT of `a`
 * @param {any} a
 * @returns {boolean}
 */
logic_utils.not = a => !a

/**
 * Returns logical XOR of `a` and `b`. I.e. returns true if exactly one of `a`
 * and `b` are truthy, otherwise returns false
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
logic_utils.xor = (a, b) => !!(!a ^ !b)

/** @namespace */
const grid_utils = {}

/**
 * Creates a grid from a string where each row is separated by a newline and
 * each cell is seperated by `delim`.
 * @param {string} str The string to create a grid from
 * @param {string} delim The delimiter to split cells by
 * @returns {string[][]}
 */
grid_utils.gridd = (str, delim) => str.trim().split("\n").filter(x => x).map(row => row.split(delim).filter(x => x))

/**
 * Calls with {@link grid_utils.gridd} with an empty delimiter
 * @param {string} str The string to create a grid from
 * @returns {string[][]}
 */
grid_utils.grid = str => grid_utils.gridd(str, "")

/**
 * Uses {@link grid_utils.grid} then maps each cell to a number
 * @param {string} str The string to create a grid from
 * @returns {number[][]}
 */
grid_utils.digitgrid = str => grid_utils.grid(str).map(row => row.map(cell => +cell))

/**
 * Maps a function over each cell in a grid
 * @template T
 * @template K
 * @param {T[][]} grid The grid to map over
 * @param {function(T, Vec, T[][]): K} fn The function to map
 * @returns {K[][]}
 */
grid_utils.gmap = (grid, fn) => grid.map((row, y) => row.map((cell, x) => fn(cell, new Vec(x, y), grid)))

/**
 * Finds {@link Vec}s in a grid which satisfy the given function
 * @template T
 * @param {T[][]} grid The grid to search
 * @param {function(T, Vec, T[][]): boolean} fn The function to filter with
 * @returns {Vec[]}
 */
grid_utils.vecswhere = (grid, fn) => grid.flatMap(
	(row, y) => row
		.map((cell, x) => [cell, new Vec(x, y)])
		.filter(args => fn(...args, grid))
		.map(([, vec]) => vec)
)

/**
 * Rotates a grid 90 degrees clockwise `times` times
 * @param {T[][]} grid The grid to rotate
 * @param {number} [times=1] The number of times to rotate
 * @returns {T[][]}
 */
grid_utils.nrotate = (grid, times = 1) => {
	if (!grid.length) return []
	let ret = grid.map(row => row.slice())
	for (let i = 0; i < times; i++) {
		ret = ret[0].map((_, i) => ret.map(row => row[i]).reverse())
	}
	return ret
}

/**
 * Rotates a grid 90 degrees clockwise once (alias for `grid_utils.nrotate(grid, 1)`)
 * @param {T[][]} grid The grid to rotate
 * @returns {T[][]}
 */
grid_utils.rotate = grid => grid_utils.nrotate(grid, 1)

/**
 * Gets diagonals of a grid (top right to bottom left). Assumes the grid is rectangular.
 * @param {T[][]} grid The grid to get diagonals from
 * @returns {T[][]}
 * @example diagonals([
 *     [1, 2, 3],
 *     [4, 5, 6],
 *     [7, 8, 9]
 * ]) // [[1], [2, 4], [3, 5, 7], [6, 8], [9]]
 */
grid_utils.diagonals = grid => {
	const ret = []

	for (let r = 0; r < grid.length; r++) {
		for (let c = 0; c < grid[0].length; c++) {
			ret[r + c] ??= []
			ret[r + c].push(grid[r][c])
		}
	}

	return ret
}

/**
 * Gets diagonals of a grid in the other direction to {@link grid_utils.diagonals}
 * (so top left to bottom right). Assumes the grid is rectangular.
 * @param {T[][]} grid The grid to get diagonals from
 * @returns {T[][]}
 * @example antidiagonals([
 *     [1, 2, 3],
 *     [4, 5, 6],
 *     [7, 8, 9]
 * ]) // [[3], [2, 6], [1, 5, 9], [4, 8], [7]]
 */
grid_utils.antidiagonals = grid => {
	const ret = [], width = grid[0]?.length

	for (let r = 0; r < grid.length; r++) {
		for (let c = 0; c < width; c++) {
			ret[r + (width - 1 - c)] ??= []
			ret[r + (width - 1 - c)].push(grid[r][c])
		}
	}

	return ret
}

/**
 * Prints a grid and returns it. If the shortest cell is only 1 character long
 * then the grid will be printed without spaces between cells.
 * @template T
 * @param {T[][]} grid
 * @returns {T[][]}
 */
grid_utils.gprint = grid => {
	const longest_cell = Math.max(...grid.flatMap(
		row => row.map(cell => cell.toString().length)
	))

	console.log(grid.map(row => row.map(
		cell => cell.toString().padEnd(longest_cell)
	).join(longest_cell > 1 ? " " : "")).join("\n"))

	return grid
}

/** @namespace */
const object_utils = {}

/**
 * Same as the built in [Object.keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
 * @param {object} obj The object to get keys from
 * @returns {string[]}
 */
object_utils.keys = obj => Object.keys(obj)

/**
 * Same as the built in [Object.values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
 * @param {object} obj The object to get values from
 * @returns {any[]}
 */
object_utils.values = obj => Object.values(obj)

/**
 * Same as the built in [Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
 * @param {object} obj The object to get entries from
 * @returns {any[]} An array of key-value tuples
 */
object_utils.entries = obj => Object.entries(obj)

/** @namespace */
const misc_utils = {}

/**
 * **[Global]** Checks `a` and `b` are equal. In theory this works for any two values,
 * whether they're primitives, arrays or some other object.
 * @function
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
misc_utils.eq = tag({ keep_global: true }, (a, b) => {
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++)
			if (!misc_utils.eq(a[i], b[i])) return false;
		return true;
	} else if (typeof a === "object" && typeof b === "object") {
		return JSON.stringify(a) === JSON.stringify(b);
	} else return a === b;
})

/** 
 * **[Global]** Checks `a` and `b` are not equal (by negating `misc_utils.eq`)
 * @function
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
misc_utils.neq = tag({ keep_global: true }, (a, b) => !eq(a, b))

/**
 * **[Global]** Creates the range `[a, b)` in an array with an optional step size
 * @function
 * @param {number} a End of the range (if `b` is not provided)
 * @param {number} [b=0] End of the range (if provided, in which case `a` is the start)
 * @param {number} [step=1]
 * @returns {number[]}
 * @example range(4) // [0, 1, 2, 3]
 * @example range(2, 5) // [2, 3, 4]
 * @example range(1, 10, 2) // [1, 3, 5, 7, 9]
 */
misc_utils.range = tag({ keep_global: true }, function(a, b = 0, step = 1) {
	let start = 0, end = a
	if (arguments.length > 1) {
		start = a
		end = b
	}
	const ret = [];
	for (let n = start; n < end; n += step)
		ret.push(n)
	return ret
})

/**
 * **[Global]** Same as `console.log` its arg(s)
 * @function
 * @template T
 * @param {...T} values Values to print
 * @returns {T|T[]}
 */
misc_utils.print = tag({ keep_global: true }, (...values) => {
	console.log(...values)
	return values.length > 1 ? values : values[0]
})

/**
 * **[Global]** Same as `misc_utils.print` but niladic (so that it becomes a getter)
 * @function
 * @template T
 * @param {T} value Value to print
 * @returns {T}
 */
misc_utils.pr = value => print(value)

/**
 * **[Global]** Tries to get the length property of `value` otherwise tries to get `size`
 * @function
 * @param {any} value Value to get the length/size of
 * @returns {?number}
 */
misc_utils.len = value => value?.length ?? value?.size

/**
 * **[Global]** Wraps a value in a singleton list
 * @function
 * @template T
 * @param {T} value Value to wrap
 * @returns {T[]}
 */
misc_utils.wrap = tag({ keep_global: true }, value => [value])

/** @namespace */
const constructors = {}

/**
 * **[Global]** Calls `new _Set(iter)`. See the documentation for `{@link _Set}` for more info
 * @function
 * @param {Iterable.<*>} iter The iterable to create the set from
 * @returns {_Set}
 */
constructors.S = tag({ keep_global: true }, (iter = []) => new _Set(iter))

/**
 * **[Global]** Calls `new Vec(x, y)`. See the documentation for `{@link Vec}` for more info
 * @function
 * @param {number} x The x component of the vector
 * @param {number} y The y component of the vector
 * @returns {Vec}
 */
constructors.V = tag({ keep_global: true }, (x, y) => new Vec(x, y))

export default {
	...type_checks,
	...type_casts,
	...math_utils,
	...string_utils,
	...iter_utils,
	...object_utils,
	...logic_utils,
	...grid_utils,
	...misc_utils,
	...constructors
}
