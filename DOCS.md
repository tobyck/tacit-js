# Tacit.js

Docs: [tobyck.github.io/tacit-js](https://tobyck.github.io/tacit-js) <br>
GitHub: [github.com/tobyck/tacit-js](https://github.com/tobyck/tacit-js)

## Usage

Firstly, besides the tacit capabilities, this library also adds some useful utility functions. You can explore them if you scroll past the installation section, or use the side bar on the left. Note that despite namespaces like `type_casts` or `iter_utils` appearing in the docs, most of these functions **only exist** as methods the `Object` prototype (meaning you can essentially use them on anything) besides a few which have a global version *as well* (these are tagged with `[Global]` in the docs). Anyway, on to the tacit stuff:

 - The global `it` starts a [tacit chain](https://en.wikipedia.org/wiki/Tacit_programming).
 - In a chain you may access properties or call any method or global function, builtin or defined by this library.
 - All tacit chains are monadic, and `it` may also refer to the argument.
 - If you're calling a function without any arguments you may optionally omit the parentheses.
 - If the first link in a chain isn't already in the global scope you may omit the leading `it.`. This will be the case for every builtin method/property, and most functions defined by this library.
 - If the last "link" in a chain isn't an explicit function call you will need to force the chain to end by appending `.it`.

| Tacit chain | Equivalent |
| ----------- | ---------- |
| `it.repeat(3)` | `str => str.repeat(3)` |
| `repeat(3)` | Same thing (there's no global `repeat(str, times)` so we can drop the leading `it.`) |
| `mul(3).add(1)` | `num => num * 3 + 1` |
| `it.isnum()` | `val => typeof val === "number"` (`isnum` is global already so we need the leading `it.`) |
| `mul(it).div(2).toFixed(2)` | `num => (num * num / 2).toFixed(2)` |
| `str.len.it` | `val => val.toString().length` |
| `trim.split(", ")` | `str => str.trim().split(", ")` |
| `match(/\d+/)[0].len.it` | `str => str.match(/\d+/)[0].length` |

<br>

Functions in tacit chains can also have flags, which are placed in the function name after a `$`. The flags available are:

 - `t`: explicitly pass the `this` arg (i.e. the object that the method is being called on). This results what would have been `this` being the first arg to the function.
 - `f`: evaluate args as functions on the chain's argument before passing them to the function.
 - `a`: make the function take a single array of args
 - `d`: debug. Prints args to the console.

_Note: if a function with flags is the first link in a chain, the leading `it.` is compulsory._

| Tacit chain | Equivalent |
| ----------- | ---------- |
| `chcode.add$t(s)` | `char => s.add(char.charCodeAt(0))` |
| `it.mul$fd(it.add(1))` | `num => { print(num, num + 1); return num * (num + 1) }` |

<br>

If you only need to access properties, you can start the chain with `get` instead, and you won't have to end with `.it`:

| Tacit chain | Equivalent |
| ----------- | ---------- |
| `get[1].length` | `val => val[1].length` |
| `get.some_prop[0].another_prop` | `val => val.some_prop[0].another_prop` |

<br>

Lastly, all methods *in this library* (not builtin ones) which take no arguments (not even optional ones) are replaced by getters so you can omit the parentheses like in tacit chains:

 - `[1, 2, 1, 3, 3, 1].uniq.arr` (both of these functions are niladic)
 - `"  hello ".trim().first` (we need the `()` on `trim` because it's builtin)

These may also be used in `get` chains:

```js
"foo bar baz".words.map(get.chars).pr // prints [["f", "o", "o"], ["b", "a", "r"], ["b", "a", "z"]]
```

## Installation

Install with you favourite JS package manager:

 - npm: `npm install @toby_ck/tacit-js`
 - Yarn: `yarn add @toby_ck/tacit-js`
 - pnpm: `pnpm add @toby_ck/tacit-js`
 - Bun: `bun add @toby_ck/tacit-js`

<br>

Using ES module syntax:

```js
import "@toby_ck/tacit-js"

// everything is automatically put in the global scope
```

Or with CommonJS:

```js
require("@toby_ck/tacit-js")
```
