import "./lib.js"

/**
 * Overrides the default set methods to use `JSON.stringify`. This allows it to
 * work with objects and arrays. See the docs for the built in [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).
 * @extends {Set}
 */
export class _Set extends Set {
	/**
	 * Creates a new set. Can also be done with {@link constructors.set}.
	 * @param {Iterable.<*>} iterable Optional iterable to initialize the set with
	 * @returns {_Set}
	 */
	constructor(iterable = []) {
		super()
		for (const element of iterable) {
			this.add(element)
		}
	}

	add(item) {
		return super.add(JSON.stringify(item))
	}

	has(item) {
		return super.has(JSON.stringify(item))
	}

	delete(item) {
		return super.delete(JSON.stringify(item))
	}

	*[Symbol.iterator]() {
		for (const item of super[Symbol.iterator]()) {
			yield JSON.parse(item)
		}
	}
}

/** Represents a 2D vector. */
export class Vec {
	/**
	 * Creates a new vector. Can also be done with {@link constructors.vec}.
	 * @param {number} x The x component
	 * @param {number} y The y component
	 * @returns {Vec}
	 */
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	/**
	 * Moves the vector up by `n` units (decreases `y`), in place.
	 * @param {number} [n=1] The number of units to move
	 * @returns {Vec} The new vector
	 */
	up(n = 1) { this.y -= n; return this }

	/**
	 * Moves the vector down by `n` units (increases `y`), in place.
	 * @param {number} [n=1] The number of units to move
	 * @returns {Vec} The new vector
	 */
	down(n = 1) { this.y += n; return this }

	/**
	 * Moves the vector left by `n` units (decreases `x`), in place.
	 * @param {number} [n=1] The number of units to move
	 * @returns {Vec} The new vector
	 */
	left(n = 1) { this.x -= n; return this }

	/**
	 * Moves the vector right by `n` units (increases `x`), in place.
	 * @param {number} [n=1] The number of units to move
	 * @returns {Vec} The new vector
	 */
	right(n = 1) { this.x += n; return this }

	/**
	 * Add another vector to this one
	 * @param {Vec} other The other vector
	 * @returns {Vec} A new vector
	 */
	add(other) {
		return new Vec(this.x + other.x, this.y + other.y)
	}

	/**
	 * Subtract another vector from this one
	 * @param {Vec} other The other vector
	 * @returns {Vec} A new vector
	 */
	sub(other) {
		return new Vec(this.x - other.x, this.y - other.y)
	}

	/**
	 * Multiplies this vector by `factor`
	 * @param {number} factor The factor to multiply by
	 * @returns {Vec} A new vector
	 */
	mul(factor) {
		return new Vec(this.x * factor, this.y * factor)
	}

	/**
	 * Divides this vector by `factor`
	 * @param {number} factor The factor to divide by
	 * @returns {Vec} A new vector
	 */
	div(factor) {
		return new Vec(this.x / factor, this.y / factor)
	}

	/**
	 * Gets the size of the vector
	 * @returns {number}
	 */
	get size() {
		return Math.hypot(this.x, this.y)
	}

	/**
	 * Clones the vector
	 * @returns {Vec}
	 */
	clone() {
		return new Vec(this.x, this.y)
	}

	/**
	 * Returns `"(x, y)"`
	 * @returns {string}
	 */
	toString() {
		return `(${this.x}, ${this.y})`
	}

	*[Symbol.iterator]() {
		yield this.x
		yield this.y
	}

	[Symbol.toPrimitive](hint) {
		if (hint === "string") return this.toString()
		return this.size
	}
}
