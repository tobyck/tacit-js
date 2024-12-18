import { chain_proxy, attach_links, getter_chain_proxy, vectorise_proxy } from "./proxies.js"
import functions from "./functions.js"
import { builtin_types, custom_types, is_monadic, is_niladic } from "./helpers.js"

// put proxies in the global scope

Object.defineProperty(globalThis, "it", {
	// make usage of `it` always create a new chain
	get: () => chain_proxy(attach_links(x => x, []))
})

globalThis.get = getter_chain_proxy(x => x)
globalThis.vct = vectorise_proxy

// object where the keys are method names from functions/classes defined by
// this library, values are whether or not the method is niladic
export const is_niladic_method_map = {}

for (const func_name in functions) {
	// if the function is monadic then it'll be niladic if it's a method
	if (is_monadic(functions[func_name])) {
		is_niladic_method_map[func_name] = true
	}
}

for (const type of custom_types)
	for (const prop_name of Object.getOwnPropertyNames(type.prototype))
		if (
			typeof type.prototype[prop_name] === "function" &&
			!(prop_name in is_niladic_method_map) &&
			is_niladic(type.prototype[prop_name])
		) {
			is_niladic_method_map[prop_name] = true
		}

// for each function make a copy that's a method (e.g. eq(a, b) -> a.eq(b))
for (const func_name in functions) {
	for (const type of [Object, ...(functions[func_name]?.meta?.attach_to ?? [])]) {
		type.prototype[func_name] = function(...args) {
			return functions[func_name](this, ...args)
		}
		type.prototype[func_name].meta = functions[func_name].meta ?? {}
	}
}

// for each method on all types make a global version which either behaves
// normally or implicitly starts a tacit chain
for (const type of builtin_types.concat(custom_types)) {
	for (const prop_name of Object.getOwnPropertyNames(type.prototype)) {
		if (prop_name.startsWith("__")) continue;

		// make sure we're actually looking at a method
		const prop_descriptor = Object.getOwnPropertyDescriptor(type.prototype, prop_name)
		const prop = prop_descriptor.value
		if (typeof prop !== "function") continue

		if (prop.meta?.keep_global) {
			globalThis[prop_name] = functions[prop_name]
		} else {
			try {
				// if the function doesn't need to keep its normal global form, then make
				// it implicitly start a new tacit chain
				Object.defineProperty(globalThis, prop_name, {
					get: () => chain_proxy(attach_links(x => x, [prop_name]))
				})
			} catch (error) {
				// i don't fully understand why this error happens or how to add a
				// check for it so... yeah just gonna ignore it
				if (!(error instanceof TypeError))
					throw error
			}
		}

		// if the method is niladic and from a class from this lib, make it a getter
		if (custom_types.includes(type) && is_niladic_method_map[prop_name] === true) {
			Object.defineProperty(type.prototype, prop_name, {
				get() {
					return prop.bind(this)()
				}
			})
		}
	}
}

for (const niladic_method_name of Object.keys(is_niladic_method_map)) {
	Object.defineProperty(Object.prototype, niladic_method_name, {
		get() {
			return functions[niladic_method_name](this)
		}
	})
}
