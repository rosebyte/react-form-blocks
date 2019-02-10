import React from "react"
import {isFunction} from "../../src/helpers/utils";

describe("isFunction", () => {
    it("should return true to function", () => {
        const func = () => {};
        expect(isFunction(func)).toBeTruthy();
    });

    it("should return true to  non-function", () => {
        const func = "Being mere string, I wish to be a function!";
        expect(isFunction(func)).toBeFalsy();
    });
});