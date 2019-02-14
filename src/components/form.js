import React, { Component } from 'react';
import PropTypes from "prop-types"
import {checkActiveElement, forEachProperty, preventDefault} from "../helpers/utils";

export const FormContext = React.createContext({});
export const ELEMENTS = {
    FIELD: "field",
    MESSAGE: "message",
    FORM: "form"
};

export default class Form extends Component {
    name = this.props.name;
    message = null;
    fields = this.props.fields || {};
    messages = this.props.messages || {};
    valueHandlers = {};
    errorHandlers = {};
    state = {
        working: false,
        submitted: false,
    };

    onChange = facade => {
        forEachProperty(this.valueHandlers, (f, p) => {if(p !== facade.name){f(facade)}});
        forEachProperty(this.errorHandlers, f => f(facade));
        this.props.onChange(this.facade);
    };

    register = (facade, handler) => {
        if(facade.type === ELEMENTS.FIELD){
            this.fields[facade.name] = facade;
            this.valueHandlers[facade.name] = handler;
        } else if(facade.type === ELEMENTS.MESSAGE){
            this.messages[facade.name] = facade;
            this.errorHandlers[facade.name] = handler;
        }
    };

    unregister = facade => {
        if(facade.type === ELEMENTS.FIELD){
            delete this.fields[facade.name];
            delete this.valueHandlers[facade.name];
        } else if(facade.type === ELEMENTS.MESSAGE){
            delete this.messages[facade.name];
            delete this.errorHandlers[facade.name];
        }
    };

    componentDidUpdate(prevProps, prevState){
        if(prevState !== this.state){
            this.props.onChange(this.facade);
        }
    }

    onSubmit = (name, setSubmitted) => {
        this.setState({...this.state, working: true}, () => {
            checkActiveElement(document);
            const error = this.props.onSubmit(this.fields, this.check(), name);
            if((error || null) !== (this.message || null)){
                this.message = error;
                this.onChange(this.facade);
            }
            const submitted = this.state.submitted || setSubmitted;
            this.setState({...this.state, submitted, working: false});
        });
    };

    check = () =>{
        let ok = true;
        forEachProperty(this.errorHandlers, f => {if(!f.check()){ok = false;}});
        return ok;
    };

    handleSubmit = (event) => {
        preventDefault(event);
        const target = event.target || event.srcElement;
        this.onSubmit(target ? target.name || null : null, true);
    };

    get facade(){
        const self = this;
        return {
            type: ELEMENTS.FORM,
            get name(){return self.name},
            get message(){return this.message},
            get messages(){return this.messages},
            get working(){return self.state.working},
            get submitted() {return self.state.submitted},
            get fields() {return self.fields}
        }
    }

    get formContext(){
        const self = this;
        return {
            type: ELEMENTS.FORM,
            register: self.register,
            unregister: self.unregister,
            onSubmit: self.onSubmit,
            onChange: self.onChange,
            get name(){return self.name},
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
            <FormContext.Provider value={this.formContext}>
                <form onSubmit={this.handleSubmit} {...rest}>{children}</form>
            </FormContext.Provider>
        )
    }
}

Form.defaultProps = {
    onSubmit: () => {},
    onChange: () => {},
    name: "__form__"
};

Form.propTypes = {
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    name: PropTypes.string
};