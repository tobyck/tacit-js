import { test, expect, describe } from "bun:test"
import "../src/lib.js"

describe(`"it" chains`, () => {
	test(() => expect(it).toBeInstanceOf(Function))
	test(() => expect(it.repeat(3)("a")).toBe("aaa"))
	test(() => expect(repeat(3)("a")).toBe("aaa"))
	test(() => expect(mul(3).add(1)(4)).toBe(13))
	test(() => expect(it.isnum()(123)).toBeTruthy())
	test(() => expect(mul(it)(3)).toBe(9))
	test(() => expect(str.len.it("arstneio")).toBe(8))
	test(() => expect(trim.split(" ")("  hello world ")).toEqual(["hello", "world"]))
	test(() => expect(match(/\d+/)[0].length.it("abc1234def456")).toBe(4))
	
	test("t flag", () => {
		const s = set()
		"hello world".chars.each(chcode.add$t(s))
		expect(s).toEqual(set([104, 101, 108, 111, 32, 119, 114, 100]))
	})
	test("f flag", () => expect(it.mul$f(it.add(1))(4)).toBe(20))
	test("a flag", () => expect(it.add$a().div(2)([4, 8])).toBe(6))
})

describe(`"get" chains`, () => {
	test(() => expect(get).toBeInstanceOf(Function))
	test(() => expect(get.str.len("arstneio")).toBe(8))
	test(() => expect(get[1][0].length(["ab", ["cdef", "hijkl"]])).toBe(4))
	test(() => expect(get.a.b[0].c({ a: { b: [{ c: 123 }] } })).toBe(123))
	test(() => expect(get.first("hello")).toBe("h"))
})
