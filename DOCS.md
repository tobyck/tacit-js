# Tacit.js

Docs: [tobyck.github.io/tacit-js](https://tobyck.github.io/tacit-js) <br>
GitHub: [github.com/tobyck/tacit-js](https://github.com/tobyck/tacit-js)

## Usage

### Utility Functions

Firstly, besides the tacit capabilities, this library also adds some useful utility functions. You can explore them if you scroll past the installation section, or use the side bar on the left. Note that despite namespaces like `type_casts` or `iter_utils` appearing in the docs, they are entirely for organisation purposes, and won't exist by the time you import Tacit.js. Most of these functions **only exist** as methods the `Object` prototype (meaning you can essentially use them on anything) besides a few which have a global version *as well* (these are tagged with `[Global]` in the docs).

### Chains Using `it`

 - The global `it` starts a [tacit chain](https://en.wikipedia.org/wiki/Tacit_programming).
 - In a chain you may access properties or call any method or function that's builtin or defined by this library.
 - All tacit chains are monadic, and `it` may also refer to the argument.
 - If you're calling a function without any arguments you may optionally omit the parentheses.
 - If the first "link" in a chain isn't already in the global scope you may omit the leading `it`. This will be the case for every builtin method/property, and most functions defined by this library.
 - A chain will only be evaluated if the last link is either:
    1. an explicit function call
    2. a nilad from this library
    3. `it` (so append this if you want to end a chain and neither of the above conditions are met)

| Tacit chain | Equivalent |
| ----------- | ---------- |
| `it.repeat(3)` | `str => str.repeat(3)` |
| `repeat(3)` | Same thing (there's no global `repeat(str, times)` so we can drop the leading `it.`) |
| `mul(3).add(1)` | `num => num * 3 + 1` |
| `it.isnum` | `val => typeof val === "number"` (`isnum` is global already so we need the leading `it`) |
| `mul(it).div(2).toFixed(2)` | `num => (num * num / 2).toFixed(2)` |
| `it.str.len` | `val => val.toString().length` (`str` doesn't allow implicit chains because it's a common variable name) |
| `trim.split(", ")` | `str => str.trim().split(", ")` |
| `trim.it` | `str => str.trim()` (`trim` is niladic, but it's builtin so we need the trailing `.it`) |
| `trim()` | Same thing |
| `match(/\d+/)[0].len` | `str => str.match(/\d+/)[0].length` (`[0]` may also be `first`) |

<br>

Functions in tacit chains can also have flags, which are placed in the function name after a `$`. The flags available are:

 - `t`: explicitly pass the `this` arg (i.e. the object that the method is being called on). This results what would have been `this` being the first arg to the function.
 - `f`: evaluate args as functions on the chain's argument before passing them to the function.
 - `v`: [vectorise](#vectorisation).
 - `a`: make the function take a single array of args
 - `d`: debug. Prints args to the console.

_Note: if a function with flags is the first link in a chain, the leading `it` is compulsory._

| Tacit chain | Equivalent |
| ----------- | ---------- |
| `chcode.add$t(s)` | `char => s.add(char.charCodeAt(0))` |
| `it.mul$fd(it.add(1))` | `num => { print(num, num + 1); return num * (num + 1) }` |
| `it.add$a()` | `([a, b]) => a + b` |

### Chains Using `get`

If you only need to access properties, you can start the chain with `get` instead, and you won't have to end with `.it`:

| Tacit chain | Equivalent |
| ----------- | ---------- |
| `get[1].length` | `val => val[1].length` |
| `get.some_prop[0].another_prop` | `val => val.some_prop[0].another_prop` |

### Getters

All methods *in this library* (not builtin ones) which take no arguments (not even optional ones) are replaced by getters so you can omit the parentheses like in tacit chains:

 - `[1, 2, 1, 3, 3, 1].uniq.arr` (both of these functions are niladic)
 - `"  hello ".trim().first` (we need the `()` on `trim` because it's builtin)

These may also be used in `get` chains:

```js
"foo bar baz".words.map(get.chars).pr // prints [["f", "o", "o"], ["b", "a", "r"], ["b", "a", "z"]]
```

<h3 id="vectorisation">Vectorisation</h3>

A vectorising operation is one which can operate on vectors (i.e. arrays) of arguments not just scalars. This will become clear in the examples. A function may be vectorised in three ways:

| Syntax | Available functions |
| ------ | ------------------- |
| `func$v` | Builtin methods and functions defined by this library |
| `vct.func` | Functions defined by this library |
| `vct(func)` | Any function |

<br>

```js
it.add$v(4) ([1, 2, 3]) // [5, 6, 7]
it.add$v([4, 5, -1]) ([1, 2, 3]) // [5, 7, 2]
vct.add([7, 8], 2) // [9, 10]
vct.add(5, 6) // 11

const squared_plus_one = vct(num => num * num + 1)
squared_plus_one([1, 2, 3]) // [2, 5, 10]

const a_times_b_plus_c = vct((a, b, c) => a * b + c)
a_times_b_plus_c([1, 2, 3], [4, 5], [6, 7, 8]) // [10, 17]
```

Notice that a) vectorised functions still work on scalars, and b) if a vector _is_ present, the result is only as long as the shortest vector argument.

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
