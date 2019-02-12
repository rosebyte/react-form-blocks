import React, { Component } from 'react';
import PropTypes from "prop-types"
import {anyFieldContainsError, checkActiveElement, forEachProperty, preventDefault} from "../helpers/utils";

export const FormContext = React.createContext({});
export const ELEMENTS = {
    FIELD: "field",
    MESSAGE: "message"
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
        if(type === ELEMENTS.FIELD){
            forEachProperty(this.valueHandlers, (f, p) => {if(p !== field.name){f(field.name)}});
        } else if(type === ELEMENTS.MESSAGE){
            forEachProperty(this.errorHandlers, (f, p) => {if(p === field.name){f(field.name)}});
        }

        this.props.onChange({
            fields: this.fields,
            working: this.state.working,
            submitted: this.state.submitted
        })
    };

    register = (facade, peerChangeHandler, type) => {
        if(type === ELEMENTS.FIELD){
            this.fields[facade.name] = facade;
            this.valueHandlers[facade.name] = peerChangeHandler;
        } else if(type === ELEMENTS.MESSAGE){
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
            this.props.onChange({
                fields: this.fields,
                working: this.state.working,
                submitted: this.state.submitted
            });
            checkActiveElement(document);
            this.props.onSubmit(this.fields, !anyFieldContainsError(this.fields), name);
            const submitted = this.state.submitted || setSubmitted;
            this.setState({...this.state, submitted, working: false}, () =>{
                this.props.onChange({
                    fields: this.fields,
                    working: this.state.working,
                    submitted: this.state.submitted
                });
            });
        });
    };

    handleSubmit = (event) => {
        preventDefault(event);
        const target = event.target || event.srcElement;
        this.submit(target ? target.name || null : null, true);
    };

    get facade(){
        const self = this;
        return {
            register: self.register,
            unregister: self.unregister,
            submit: self.submit,
            fieldChanged: self.fieldChanged,
            get working(){return self.state.working},
            get submitted() {return self.state.submitted},
            get fields() {return self.fields}
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