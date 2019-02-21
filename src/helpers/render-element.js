import React from "react";
import {isFunction, isString} from "./utils";

export default function renderElement (props, extendedProps) {
    const {component, children, render, ...rest} = props;

    if (render) {
        return render({...rest, ...extendedProps, children, component});
    }

    if (isFunction(children)) {
        return children({...rest, ...extendedProps, render, component});
    }

    if (isString(component)) {
        const { innerRef, ...primitiveProps } = rest;
        const setup = {ref: innerRef, ...primitiveProps};
        return React.createElement(component, setup, children);
    }

    if(!component){
        throw new Error(
            "No component to render, please insert either component, render or children prop.");
    }

    return React.createElement(component, {...rest, ...extendedProps, render}, children);
}