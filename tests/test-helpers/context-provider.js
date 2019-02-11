import deepmerge from "./deep-merge"
import React from "react";
import {FormContext} from "../../src/components/form"

const defaultContext = {
    submitted: false,
    working: false,
    register: () => {},
    fields: {test:{error: "E", warning: "W", touched: false, dity: false}}
};

export function withFakeContext(context = {}, component){
    const ctx = deepmerge(defaultContext, context);

    return (
        <FormContext.Provider value={ctx}>{component}</FormContext.Provider>
    )
}

export default function mockFormContext(context = {}, props, path, component){
    const ctx = deepmerge(defaultContext, context);

    jest.doMock("../../src/components/form", () => {
        return {
            FormContext: {
                Consumer: props => props.children(ctx)
            }
        }
    });

    const Provider = require(path).default;

    return <Provider {...props}>{component}</Provider>
}