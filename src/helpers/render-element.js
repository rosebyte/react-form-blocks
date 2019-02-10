import React from "react";
import {isFunction, isString} from "./utils";

export default function renderElement (component, children, render, values, props) {
    if (render) {
        return render(values);
    }

    if (isFunction(children)) {
        return children(values);
    }

    if (isString(component)) {
        const { innerRef, ...rest } = props;
        const setup = {ref: innerRef, ...values, ...rest, children};
        return React.createElement(component, setup);
    }

    return component
        ? React.createElement(component, {...values, ...props, children})
        :null;
}