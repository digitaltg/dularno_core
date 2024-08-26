const { TypeTool } = require("../../../lib/helper/typing");

describe("[Unit Test] Auto Typing string values", () => {

    test("Should return boolean", () => {
        expect(TypeTool.infer("true")).toBe(true);
        expect(TypeTool.infer("false")).toBe(false);
    });

    test("Should return number", () => {
        expect(TypeTool.infer("34")).toBe(34);
        expect(TypeTool.infer("034")).toBe(34);
    });

    test("Should return objec", () => {
        const result = TypeTool.infer("\{\"a\": 3, \"b\": 4\}");
        expect(typeof result).toBe("object");
        expect(result.a).toBe(3);
        expect(result.b).toBe(4);
    });

    test("Should return date", () => {
        expect(TypeTool.infer("2023-02-02T00:00")).toBe("2023-02-02T00:00");
    });
});
