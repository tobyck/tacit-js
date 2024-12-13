import { chain_proxy, attach_links, getter_chain_proxy, vectorise_proxy } from "./proxies.js"
import functions from "./functions.js"
import { is_niladic_method } from "./helpers.js"
import { Vec } from "./classes.js"

// make usage of `it` always create a new chain
Object.defineProperty(globalThis, "it", {
	get: () => chain_proxy(attach_links(x => x, []))
})

globalThis.get = getter_chain_proxy(x => x)
globalThis.vct = vectorise_proxy

// for function make a copy that's a method (e.g. eq(a, b) -> a.eq(b))
for (const func_name in functions) {
	for (const type of [Object, ...(functions[func_name]?.meta?.attach_to ?? [])]) {
		type.prototype[func_name] = function(...args) { return functions[func_name](this, ...args) }
		type.prototype[func_name].meta = functions[func_name].meta ?? {}
		type.prototype[func_name].meta.is_nildadic_method = is_niladic_method(functions[func_name])
	}
}

// make a) a global chainable copy of each method (e.g. array.split(delim) -> array => array.split(delim))
// and b) if the method is niladic, a getter
for (const type of [Number, String, Array, Boolean, Set, Object, Vec]) {
	for (const prop_name of Object.getOwnPropertyNames(type.prototype)) {
		if (prop_name.startsWith("__") || prop_name === "size" && type === Set) continue;

		const prop = type.prototype[prop_name]
		if (prop === null) continue

		if (prop.meta?.keep_global) {
			if (prop_name == "str") console.log("why tf are we here")
			globalThis[prop_name] = functions[prop_name]
		} else {
			try {
				if (prop_name == "str") console.log("why tf are we here 2")
				Object.defineProperty(globalThis, prop_name, {
					get: () => chain_proxy(attach_links(x => x, [prop_name]))
				})
			} catch (error) {
				// if it won't let us define the getter we just don't worry about it
				if (!(error instanceof TypeError))
					throw error
			}

			if (typeof prop === "function" && prop?.meta?.is_nildadic_method)
				Object.defineProperty(type.prototype, prop_name, {
					get() {
						return functions[prop_name](this)
					}
				})
		}
	}
}
