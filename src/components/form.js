import React, { Component } from 'react';
import PropTypes from "prop-types"
import {anyFieldContainsError, checkActiveElement, forEachProperty, preventDefault} from "../helpers/utils";

export const FormContext = React.createContext({});
export const CHANGES = {
    value: "value",
    feedback: "feedback"
};

export default class Form extends Component {
    fields = this.props.fields || {};
    valueHandlers = {};
    errorHandlers = {};
    state = {
        working: false,
        submitted: false
    };

    fieldChanged = (field, type) => {
        if(type === CHANGES.value){
            forEachProperty(this.valueHandlers, (f, p) => {if(p !== field.name){f(field.name)}});
        } else if(type === CHANGES.feedback){
            forEachProperty(this.errorHandlers, (f, p) => {if(p === field.name){f(field.name)}});
        }

        this.props.onChange(this.fields)
    };

    register = (facade, peerChangeHandler, type) => {
        if(type === CHANGES.value){
            this.fields[facade.name] = facade;
            this.valueHandlers[facade.name] = peerChangeHandler;
        } else if(type === CHANGES.feedback){
            this.errorHandlers[facade.name] = peerChangeHandler;
        }
    };

    unregister = (facade) => {
        delete this.fields[facade.name];
        delete this.valueHandlers[facade.name];
        delete this.errorHandlers[facade.name];
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