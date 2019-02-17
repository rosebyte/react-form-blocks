import React from "react";
import {isFunction, isString} from "./utils";

export default function renderElement (fieldProps, props) {
    const {component, children, render, ...rest} = props;

    if (render) {
        return render(fieldProps);
    }

    if (isFunction(children)) {
        return children(fieldProps);
    }

    if (isString(component)) {
        const { innerRef, ...componentProps } = rest;
        const setup = {ref: innerRef, ...fieldProps, ...componentProps};
        return React.createElement(component, setup, children);
    }

    if(!component){
        throw new Error(
            "No component to render, please insert either component, render or children prop.");
    }

    return React.createElement(component, {...fieldProps, ...rest}, children);
}