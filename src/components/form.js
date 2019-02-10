import React, { Component } from 'react';
import PropTypes from "prop-types"
import {anyFieldContainsError, checkActiveElement, forEachProperty, preventDefault} from "../helpers/utils";

export const FormContext = React.createContext({});

export default class Form extends Component {
    fields = this.props.fields || {};
    peerChangeHandlers = {};
    state = {
        working: false,
        submitted: false
    };

    fieldChanged = field => {
        forEachProperty(this.peerChangeHandlers, (f, p) => {if(p !== field.name){f(field.name)}});
        this.props.onChange(this.fields)
    };

    register = (facade, peerChangeHandler, type = "field") => {
        if(type === "field"){
            this.fields[facade.name] = facade;
            this.peerChangeHandlers[facade.name] = peerChangeHandler;
        } else if(type === "message"){
            this.peerChangeHandlers[facade.name + "_message"] = peerChangeHandler;
        }
    };

    unregister = (facade) => {
        delete this.fields[facade.name];
        delete this.peerChangeHandlers[facade.name];
        delete this.peerChangeHandlers[facade.name + "_message"];
    };

    submit = (name, setSubmitted) => {
        this.setState({...this.state, working: true}, () =>{
            checkActiveElement(document);
            this.props.onSubmit(this.fields, !anyFieldContainsError(this.fields), name);
            const submitted = this.state.submitted || setSubmitted;
            this.setState({...this.state, submitted, working: false});
        });
    };

    handleSubmit = (event) => {
        preventDefault(event);
        const target = event.target || event.srcElement;
        this.submit(target ? target.name : null, true);
    };

    get facade(){
        return {
            register: this.register,
            unregister: this.unregister,
            submit: this.submit,
            fieldChanged: this.fieldChanged,
            working: this.state.working,
            submitted: this.state.submitted,
            fields: this.fields
        }
    }

    render() {
        const {children, ...rest} = this.props;
        delete rest.onChange;
        delete rest.onSubmit;

        return (
            <FormContext.Provider value={this.facade}>
                <form onSubmit={this.handleSubmit} {...rest}>{children}</form>
            </FormContext.Provider>
        )
    }
}

Form.defaultProps = {
    onSubmit: () => {},
    onChange: () => {}
};

Form.propTypes = {
    onSubmit: PropTypes.func,
    onChange: PropTypes.func
};