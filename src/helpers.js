import functions from "./functions.js"

export const tag = (metadata, func) => {
	func.meta = metadata
	return func
}

export const vectorise = func => (...args) => {
	if (args.some(functions.isiter)) {
		const shortest = Math.min(...args.map(a => a?.length ?? Infinity))
		return functions.range(shortest).map(i => func(...args.map(a => a?.[i] ?? a)))
	} else return func(...args)
}

export const is_niladic_method = func => !!func?.toString()
	.match(/^function\([\d\w_$]+\)|^\(?[\d\w_$]+\)?\s*=>/)
