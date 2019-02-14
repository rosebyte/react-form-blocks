import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { Component } from 'react';
import FormContext from "./context"

export default function withForm(Component) {
    const wrapper = (props) => (
        <FormContext.Consumer>
            {ctx => <Component {...props} form={ctx} />}
        </FormContext.Consumer>
    );
    const componentDisplayName =
        Component.displayName ||
        Component.name ||
        (Component.constructor && Component.constructor.name) ||
        'Component';

    wrapper.WrappedComponent = Component;

    wrapper.displayName = `Form(${componentDisplayName})`;

    return hoistNonReactStatics(wrapper, Component)
}