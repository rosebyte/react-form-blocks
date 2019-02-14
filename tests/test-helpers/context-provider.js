import React from "react";
import FormContext from "../../src/helpers/context"
import deepmerge from "./deep-merge";

const defaultContext = {
    submitted: false,
    working: false,
    register: () => {},
    unregister: () => {},
    fields: {}
};

export function withFakeContext(context = {}, component){
    const ctx = deepmerge({}, defaultContext, context);
    return (
        <FormContext.Provider value={ctx}>{component}</FormContext.Provider>
    )
}