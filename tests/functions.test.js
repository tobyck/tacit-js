import { test, expect, describe } from "bun:test"
import f from "../src/functions.js"

describe("isnum", () => {
	test("positive int", () => expect(f.isnum(123)).toBeTruthy())
	test("negative float", () => expect(f.isnum(-12.3)).toBeTruthy())
	test("bigint", () => expect(f.isnum(456n)).toBeTruthy())
	test("string", () => expect(f.isnum("789")).toBeFalsy())
	test("array", () => expect(f.isnum([0])).toBeFalsy())
})

describe("isobj", () => {
	test("object", () => expect(f.isobj({ x: 123 })).toBeTruthy())
	test("array", () => expect(f.isobj([456])).toBeTruthy())
	test("string", () => expect(f.isobj("abc")).toBeFalsy())
	test("number", () => expect(f.isobj(123)).toBeFalsy())
})

describe("type", () => {
	test("string", () => expect(f.type("abc")).toBe("string"))
	test("number", () => expect(f.type(123)).toBe("number"))
	test("array", () => expect(f.type([456])).toBe("object"))
	test("null", () => expect(f.type(null)).toBe("object"))
	test("undefined", () => expect(f.type(undefined)).toBe("undefined"))
})

describe("isiter", () => {
	test("array", () => expect(f.isiter([1, 2, 3])).toBeTruthy())
	test("string", () => expect(f.isiter("abc")).toBeTruthy())
	test("number", () => expect(f.isiter(123)).toBeFalsy())
	test("object", () => expect(f.isiter({ x: [4, 5, 6] })).toBeFalsy())
})

describe("arr", () => {
	test("string", () => expect(f.arr("abc")).toEqual(["a", "b", "c"]))
	test("number", () => expect(f.arr(3)).toEqual([undefined, undefined, undefined]))
	test("array", () => expect(f.arr(["a", "b", "c"])).toEqual(["a", "b", "c"]))
	test("object", () => expect(f.arr({ length: 2 })).toEqual([undefined, undefined]))
	test("vec", () => expect(f.arr(f.V(2, 3))).toEqual([2, 3]))
	test("empty object", () => expect(f.arr({})).toEqual([]))
})

describe("exp", () => {
	test("ints", () => expect(f.exp(2, 3)).toBe(8))
	test("float ^ int", () => expect(f.exp(2.5, 2)).toBe(6.25))
	test("float ^ float", () => expect(f.exp(9, 0.5)).toBe(3))
	test("2 ^ .5mil modulo", () => expect(f.exp(2, 500_000, 789)).toBe(496))
})

describe("wrapindex", () => {
	test("within range", () => expect(f.wrapindex(2, 4)).toBe(2))
	test("zero", () => expect(f.wrapindex(0, 4)).toBe(0))
	test("past end", () => expect(f.wrapindex(4, 4)).toBe(0))
	test("negative 1", () => expect(f.wrapindex(-1, 4)).toBe(3))
	test("way past end", () => expect(f.wrapindex(25, 4)).toBe(1))
})

describe("firstn", () => {
	test("empty", () => expect(f.firstn([], 3)).toEqual([]))
	test("getting none", () => expect(f.firstn([1, 2], 0)).toEqual([]))
	test("short", () => expect(f.firstn([1, 2], 3)).toEqual([1, 2]))
	test("long", () => expect(f.firstn([1, 2, 3, 4], 2)).toEqual([1, 2]))
})

describe("lastn", () => {
	test("empty", () => expect(f.lastn([], 3)).toEqual([]))
	test("getting none", () => expect(f.firstn([1, 2], 0)).toEqual([]))
	test("short", () => expect(f.lastn([1, 2], 3)).toEqual([1, 2]))
	test("long", () => expect(f.lastn([1, 2, 3, 4], 2)).toEqual([3, 4]))
})

describe("append", () => {
	test(() => {
		const array = [1, 2, 3]
		expect(f.append(array, 4)).toEqual([1, 2, 3, 4])
		expect(array).toEqual([1, 2, 3, 4])
	})
})

describe("last", () => {
	test("empty", () => expect(f.last([])).toBeUndefined())
	test("single", () => expect(f.last([1])).toBe(1))
	test("multiple", () => expect(f.last([1, 2, 3])).toBe(3))
})

describe("dropnth", () => {
	test("empty", () => expect(f.dropnth([], 3)).toEqual([]))
	test("drop first", () => expect(f.dropnth([1, 2, 3], 0)).toEqual([2, 3]))
	test("drop last", () => expect(f.dropnth([1, 2, 3], 2)).toEqual([1, 2]))
	test("drop middle", () => expect(f.dropnth([1, 2, 3], 1)).toEqual([1, 3]))
})

describe("alleq", () => {
	test("empty", () => expect(f.alleq([])).toBeTruthy())
	test("all equal", () => expect(f.alleq([1, 1, 1])).toBeTruthy())
	test("not all equal", () => expect(f.alleq([1, 2, 1])).toBeFalsy())
})

describe("sliding", () => {
	test("empty", () => expect(f.sliding([], 3)).toEqual([]))
	test("too short", () => expect(f.sliding([1, 2], 3)).toEqual([1, 2]))
	test("one window", () => expect(f.sliding([1, 2, 3], 3)).toEqual([[1, 2, 3]]))
	test("multiple windows", () => expect(f.sliding([1, 2, 3, 4], 2)).toEqual([[1, 2], [2, 3], [3, 4]]))
	test("wrapping", () => expect(f.sliding([1, 2, 3], 2, true)).toEqual([[1, 2], [2, 3], [3, 1]]))
})

describe("chunks", () => {
	test("empty", () => expect(f.chunks([], 3)).toEqual([]))
	test("too short", () => expect(f.chunks([1, 2], 3)).toEqual([[1, 2]]))
	test("one chunk", () => expect(f.chunks([1, 2, 3], 3)).toEqual([[1, 2, 3]]))
	test("multiple chunks of 2", () => expect(f.chunks([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]))
	test("multiple chunks of 3", () => expect(f.chunks([1, 2, 3, 4, 5, 6], 3)).toEqual([[1, 2, 3], [4, 5, 6]]))
	test("not divisible equally", () => expect(f.chunks([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]))
})

describe("everynth", () => {
	test("empty", () => expect(f.everynth([], 2)).toEqual([]))
	test("every 1", () => expect(f.everynth([1, 2, 3], 1)).toEqual([1, 2, 3]))
	test("every 2", () => expect(f.everynth([1, 2, 3, 4, 5], 2)).toEqual([1, 3, 5]))
	test("start at 1", () => expect(f.everynth([1, 2, 3, 4, 5], 2, 1)).toEqual([2, 4]))
	test("array is length of step", () => expect(f.everynth([1, 2, 3], 3)).toEqual([1]))
})

describe("at", () => {
	test("empty", () => expect(f.at([], 2)).toBeUndefined())
	test("in range", () => expect(f.at([1, 2, 3], 1)).toBe(2))
	test("past end", () => expect(f.at([1, 2, 3], 7)).toBe(2))
	test("negative", () => expect(f.at([1, 2, 3], -1)).toBe(3))
	test("negative past start", () => expect(f.at([1, 2, 3], -5)).toBe(2))
	test("multiple indicies", () => expect(f.at([1, 2, 3], [0, -2, 4])).toEqual([1, 2, 2]))
})

describe("count", () => {
	test("number in list", () => expect(f.count([2, 1, 2, 3, 1, 1], 1)).toBe(3))
	test("char in string", () => expect(f.count("abracadabra", "a")).toBe(5))
	test("string in string", () => expect(f.count("abababa", "aba")).toBe(2))
	test("list in list", () => expect(f.count([[1, 2], [3, 4], [1, 2]], [1, 2])).toBe(2))
	test("list in flat list (no match)", () => expect(f.count([3, 1, 2, 1, 2, 1, 1, 2, 1], [1, 2, 1])).toBe(0))
	test("list in flat list", () => expect(f.count([3, 1, 2, 1, 2, 1, 1, 2, 1], [1, 2, 1], true)).toBe(2))
	test("function", () => expect(f.count([4, 6, 1, 9, 8], x => x > 4)).toBe(3))
})

describe("countol", () => {
	test("string in string", () => expect(f.countol("abababa", "aba")).toBe(3))
	test("list in flat list", () => expect(f.countol([3, 1, 2, 1, 2, 1, 1, 2, 1], [1, 2, 1], true)).toBe(3))
})

describe("deltas", () => {
	test("empty", () => expect(f.deltas([])).toEqual([]))
	test("one element", () => expect(f.deltas([1])).toEqual([0]))
	test("two elements", () => expect(f.deltas([1, 2])).toEqual([1]))
	test("three elements", () => expect(f.deltas([1, 2, 4])).toEqual([1, 2]))
	test("negative", () => expect(f.deltas([1, 2, -1])).toEqual([1, -3]))
})

describe("zip", () => {
	test("nothing", () => expect(f.zip()).toEqual([]))
	test("single empty arr", () => expect(f.zip([])).toEqual([]))
	test("one row", () => expect(f.zip([1, 2, 3])).toEqual([[1], [2], [3]]))
	test("2x2", () => expect(f.zip([1, 2], [3, 4])).toEqual([[1, 3], [2, 4]]))
	test("3x3", () => expect(f.zip([1, 2, 3], [4, 5, 6], [7, 8, 9])).toEqual([[1, 4, 7], [2, 5, 8], [3, 6, 9]]))
})

describe("perms", () => {
	test("empty", () => expect(f.perms([])).toEqual([]))
	test("single", () => expect(f.perms([1])).toEqual([[1]]))
	test("two", () => expect(f.perms([1, 2])).toEqual([[1, 2], [2, 1]]))
	test("three", () => expect(f.perms([1, 2, 3]).sort()).toEqual([
		[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]
	].sort()))
})

describe("gridd", () => {
	test("empty", () => expect(f.gridd("", " ")).toEqual([]))
	test("one row", () => expect(f.gridd("a,b,c", ",")).toEqual([["a", "b", "c"]]))
	test("one item", () => expect(f.gridd("a", " ")).toEqual([["a"]]))
	test("multiple rows", () => expect(f.gridd(" a b  c\nd e f  ", " ")).toEqual([["a", "b", "c"], ["d", "e", "f"]]))
	test("no delim", () => expect(f.gridd("abc", "")).toEqual([["a", "b", "c"]]))
})

describe("gmap", () => {
	test("empty", () => expect(f.gmap([], x => x + 1)).toEqual([]))
	test("one row", () => expect(f.gmap([[1, 2, 3]], x => x + 1)).toEqual([[2, 3, 4]]))
	test("multiple rows", () => expect(f.gmap([[1, 2], [3, 4], [5, 6]], (x, v) => x + v.y)).toEqual([[1, 2], [4, 5], [7, 8]]))
})

describe("vecswhere", () => {
	test("empty", () => expect(f.vecswhere([], () => true)).toEqual([]))
	test("one row", () => expect(f.vecswhere([[1, 2, 3]], cell => cell >= 2)).toEqual([f.V(1, 0), f.V(2, 0)]))
	test("multiple rows", () => expect(f.vecswhere(
		[[1, 3, 2], [6, 4, 5], [7, 8, 9]],
		(cell, vec) => cell % 2 === 1 && vec.x < 2
	)).toEqual([f.V(0, 0), f.V(1, 0), f.V(0, 2)]))
})

describe("nrotate", () => {
	test("empty", () => expect(f.nrotate([], 1)).toEqual([]))
	test("one row", () => expect(f.nrotate([[1, 2, 3]])).toEqual([[1], [2], [3]]))
	test("multiple rows", () => expect(f.nrotate([[1, 2, 3], [4, 5, 6]], 1)).toEqual([[4, 1], [5, 2], [6, 3]]))
	test("280 deg", () => expect(f.nrotate([[1, 2], [3, 4]], 2)).toEqual([[4, 3], [2, 1]]))
	test("270 deg", () => expect(f.nrotate([[1, 2], [3, 4]], 3)).toEqual([[2, 4], [1, 3]]))
})

describe("diagonals", () => {
	test("empty", () => expect(f.diagonals([])).toEqual([]))
	test("one row", () => expect(f.diagonals([[1, 2, 3]])).toEqual([[1], [2], [3]]))
	test("2x2 square", () => expect(f.diagonals([[1, 2], [3, 4]])).toEqual([[1], [2, 3], [4]]))
	test("3x2 rectangle", () => expect(f.diagonals([[1, 2, 3], [4, 5, 6]])).toEqual([[1], [2, 4], [3, 5], [6]]))
	test("2x3 rectangle", () => expect(f.diagonals([[1, 2], [3, 4], [5, 6]])).toEqual([[1], [2, 3], [4, 5], [6]]))
})

describe("antidiagonals", () => {
	test("empty", () => expect(f.antidiagonals([])).toEqual([]))
	test("one row", () => expect(f.antidiagonals([[1, 2, 3]])).toEqual([[3], [2], [1]]))
	test("2x2 square", () => expect(f.antidiagonals([[1, 2], [3, 4]])).toEqual([[2], [1, 4], [3]]))
	test("3x2 rectangle", () => expect(f.antidiagonals([[1, 2, 3], [4, 5, 6]])).toEqual([[3], [2, 6], [1, 5], [4]]))
	test("2x3 rectangle", () => expect(f.antidiagonals([[1, 2], [3, 4], [5, 6]])).toEqual([[2], [1, 4], [3, 6], [5]]))
})
