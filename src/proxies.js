import functions from "./functions.js"
import { vectorise, is_niladic } from "./helpers.js"

// applies a proxy to a function that makes any property access or call do
// nothing, and simply build up a list of operations to do once it's called
export const chain_proxy = func => new Proxy(func, {
	get(target, prop) {
		if (prop === "links") return target[prop] // for debugging
		if (prop === "symbol") return Symbol.for("chain_proxy")

		target.links.push(prop)
		return chain_proxy(target)
	},

	apply(target, _, args) {
		const last_link = target.links.at(-1)

		if (!last_link) return args[0]
		else if (typeof last_link === "object" || is_niladic(functions?.[last_link]) || last_link === "it")
			return evaluate_chain(target.links)(args[0])

		let [func_name, flags] = target.links.pop().split("$")
		target.links.push({ func_name, args, flags: flags ?? "" })

		return chain_proxy(target)
	}
})

const call_link = (chain_arg, result, func_name, flags = "", args = []) => {
	let this_arg = result // value to call method on

	// if an arg is `it` with no links, treat as the original chain arg
	args = args.map(arg => arg?.symbol === Symbol.for("chain_proxy") && !arg.links.length ? chain_arg : arg)

	for (const flag of flags) {
		if (flag === "f") args = args.map(f => f(chain_arg)) // map args as functions on the chain arg
		else if (flag === "a") {
			if (Array.isArray(result)) {
				// treat the result as the arg list
				this_arg = result[0]
				args = result.slice(1)
			} else throw new Error(`Trying to use result as arg list but it is not an array: ${result}`)
		} else if (flag === "t") {
			if (flags.includes("a")) throw new Error("Cannot use both 'a' and 't' flags")
			// make this_arg passed explicitly
			this_arg = args[0]
			args = [result, ...args.slice(1)]
		} else if (flag === "d") {
			const formatted_args = JSON.stringify([result, ...args], null, 1).replace(/\n\s*/g, " ")
			const formatted_flags = `(-${flags.split("").filter(f => f !== "d").join("")})`
			console.log(`[Debug] args to '${func_name}\` ${formatted_flags}: ${formatted_args}`)
		}
	}

	let func
	if (typeof this_arg?.[func_name] === "function") func = (...args) => args[0][func_name](...args.slice(1))
	else if (typeof functions?.[func_name] === "function") func = functions[func_name]
	if (flags.includes("v")) func = vectorise(func)

	if (func) return func(this_arg, ...args)

	throw new Error(`Error while evluating chain: function '${func_name}\` not available`)
}

const evaluate_chain = links => chain_arg => links.reduce((result, link) => {
	if (link === "it") return result
	else if (typeof link === "string") {
		try {
			return call_link(chain_arg, result, ...link.split("$"))
		} catch (_) {
			if (result[link] === undefined)
				throw new Error(`Error while evaluating chain: ${typeof result} "${result}" has no property \`${link}\``)
			return result[link]
		}
	} else {
		return call_link(chain_arg, result, link.func_name, link.flags, link.args)
	}
}, chain_arg)

export const attach_links = (func, links) => {
	func.links = links
	return func
}

export const getter_chain_proxy = func => new Proxy(func, {
	get: (target, prop) => getter_chain_proxy(arg => {
		const so_far = target(arg)
		if (so_far?.[prop] === undefined)
			throw new Error(`Error while evaluating getter chain: ${typeof so_far} "${so_far}" has no property \`${prop}\``)
		return so_far[prop]
	})
})

export const vectorise_proxy = new Proxy(vectorise, {
	get(_, func_name) {
		print(func_name)
		if (functions?.[func_name] === undefined)
			throw new Error(`Error trying to vectorise function '${func_name}\`: function does not exist`)
		return vectorise(functions[func_name])
	}
})
