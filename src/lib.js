import { chain_proxy, attach_links, getter_chain_proxy } from "./proxies.js"
import functions from "./functions.js"
import { Vec } from "./classes.js"

// copy all functions into the global scope
for (const func_name in functions) {
	globalThis[func_name] = functions[func_name]
}

// make usage of `it` always create a new chain
Object.defineProperty(globalThis, "it", {
	get: () => chain_proxy(attach_links(x => x, []))
})

globalThis.get = getter_chain_proxy(x => x)

const attach_to_type = (type, func_name) => {
	type.prototype[func_name] = function(...args) { return functions[func_name](this, ...args) }

	type.prototype[func_name].is_nildadic = !!globalThis[func_name].toString()
		.match(/^function\([\d\w_$]+\)|^\(?[\d\w_$]+\)?\s*=>/)
	// did i just do a regex match on a function... what am i creating

	// the keep_global property will need to be accessed on the method later so we need to copy it over
	if (globalThis[func_name].keep_global) type.prototype[func_name].keep_global = true
}

// for each global function make a copy that's a method (e.g. eq(a, b) -> a.eq(b))
for (const func_name in functions) {
	attach_to_type(Object, func_name)
	if (functions[func_name].attach_to)
		attach_to_type(functions[func_name].attach_to, func_name)
}

// make a) a global chainable copy of each method (e.g. array.split(delim) -> array => array.split(delim))
// and b) if the method is niladic, a getter
for (const type of [Number, String, Array, Boolean, Set, Object, Vec]) {
	for (const prop_name of Object.getOwnPropertyNames(type.prototype)) {
		if (prop_name === "size" && type === Set) continue;

		// make it so that the leading `it` can be omitted if the first link isn't already in the global scope
		const prop = type.prototype[prop_name]
		if (prop != null && !prop.keep_global) {
			try {
				Object.defineProperty(globalThis, prop_name, {
					get: () => chain_proxy(attach_links(x => x, [prop_name]))
				})
			} catch (error) {
				// if it won't let us define the getter we just don't worry about it
				if (!(error instanceof TypeError))
					throw error
			}

			if (typeof prop === "function" && prop.is_nildadic)
				Object.defineProperty(type.prototype, prop_name, {
					get() {
						return functions[prop_name](this)
					}
				})
		}
	}
}
