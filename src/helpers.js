import { Vec, _Set } from "./classes.js"

export const tag = (metadata, func) => {
	func.meta = metadata
	return func
}

export const vectorise = func => (...args) => {
	if (args.some(arg => typeof arg[Symbol.iterator] === "function")) {
		const shortest = Math.min(...args.map(a => a?.length ?? Infinity))
		return Array.from({ length: shortest }).map((_, i) => func(...args.map(a => a?.[i] ?? a)))
	} else return func(...args)
}

export const is_monadic = func => !!func?.toString().match(/^([\w\$_]+\s*)?\(\s*[\w\$_]+\s*\)|^\(?\s*[\w\$_]+\s*\)?\s*=>/)
export const is_niladic = func => !!func?.toString().match(/^([\w\$_]+\s*)?\(\s*\)/)

export const builtin_types = [Number, String, Array, Boolean, Object]
export const custom_types = [_Set, Vec]
