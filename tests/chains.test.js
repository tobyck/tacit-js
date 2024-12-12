import { test, expect, describe } from "bun:test"
import "../src/lib.js"

describe(`"it" chains`, () => {
	test("`it` is func", () => expect(it).toBeInstanceOf(Function))
	test("repeat 3 'a'", () => expect(it.repeat(3)("a")).toBe("aaa"))
	test("repeat 3 'a' without `it`", () => expect(repeat(3)("a")).toBe("aaa"))
	test("n * 3 + 1", () => expect(mul(3).add(1)(4)).toBe(13))
	test("isnum", () => expect(it.isnum(123)).toBe(true))
	test("square using mul(it)", () => expect(mul(it)(3)).toBe(9))
	test("str len", () => expect(str.len("arstneio")).toBe(8))
	test("leading nilad", () => expect(trim.split(" ")("  hello world ")).toEqual(["hello", "world"]))
	test("regex and indexing", () => expect(match(/\d+/)[0].length.it("abc1234def456")).toBe(4))
	test("undefined eq undefined", () => expect(it.eq(undefined)(undefined)).toBe(true))
	
	test("t flag", () => {
		const s = set()
		"hello world".chars.each(chcode.add$t(s))
		expect(s).toEqual(set([104, 101, 108, 111, 32, 119, 114, 100]))
	})
	test("f flag", () => expect(it.mul$f(it.add(1))(4)).toBe(20))
	test("a flag", () => expect(it.add$a().div(2)([4, 8])).toBe(6))
	test("v flag", () => expect(it.add$v(5)([4, 8])).toEqual([9, 13]))
})

describe(`"get" chains`, () => {
	test(() => expect(get).toBeInstanceOf(Function))
	test(() => expect(get.str.len("arstneio")).toBe(8))
	test(() => expect(get[1][0].length(["ab", ["cdef", "hijkl"]])).toBe(4))
	test(() => expect(get.a.b[0].c({ a: { b: [{ c: 123 }] } })).toBe(123))
	test(() => expect(get.first("hello")).toBe("h"))
})

describe(`vectorise ("vct")`, () => {
	test("num + num", () => expect(vct.add(1, 2)).toBe(3))
	test("empty", () => expect(vct.add([], [])).toEqual([]))
	test("array + num", () => expect(vct.add([1, 2, 3], 4)).toEqual([5, 6, 7]))
	test("array + array", () => expect(vct.add([8, 9], [-5, 6])).toEqual([3, 15]))

	// const v_triad = f.vectorise((a, b, c) => a * b + c)
	// test("num * num + num", () => expect(v_triad(2, 3, 4)).toBe(10))
	// test("array * num + num", () => expect(v_triad([2, 3], 4, 5)).toEqual([13, 17]))
	// test("num * array + array", () => expect(v_triad(2, [4, 5], [6, 7])).toEqual([14, 17]))
	// test("array * array + array", () => expect(v_triad([2, 3], [4, 5], [6, 7])).toEqual([14, 22]))
})
