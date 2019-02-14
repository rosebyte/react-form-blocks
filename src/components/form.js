import React, { Component } from 'react';
import PropTypes from "prop-types"
import {checkActiveElement, forEachProperty, isString, preventDefault} from "../helpers/utils";

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
    handlers = {};
    state = {
        working: false,
        submitted: false,
    };

    onChange = facade => {
        if(this.handlers[facade.name]){
            this.handlers[facade.name].forEach(x => x.handler(facade));
        }
        this.props.onChange(this.facade);
    };

    register = (facade, handler, watch) => {
        const watcher = {name: facade.name, type: facade.type, handler};

        if(facade.type === ELEMENTS.FIELD){
            this.fields[facade.name] = facade;
        } else if(facade.type === ELEMENTS.MESSAGE){
            this.messages[facade.name] = facade;

            if(!this.handlers[facade.name]){
                this.handlers[facade.name] = [watcher]
            } else {
                this.handlers[facade.name].push(watcher);
            }
        }
        if(isString(watch)){
            watch = [watch];
        }
        if(watch){
            watch.forEach(x => {
                if(!this.handlers[x]){
                    this.handlers[x] = [watcher]
                } else {
                    this.handlers[x].push(watcher);
                }
            });
        }
    };

    unregister = facade => {
        if(facade.type === ELEMENTS.FIELD){
            delete this.fields[facade.name];
        } else if(facade.type === ELEMENTS.MESSAGE){
            delete this.messages[facade.name];
        }
        delete this.handlers[facade.name];
        for (let item in this.handlers){
            if(this.handlers.hasOwnProperty(item)){
                this.handlers[item] = this.handlers[item]
                    .filter(y => y.name !== facade.name || y.type !== facade.type);
                if(!this.handlers[item].length){
                    delete this.handlers[item];
                }
            }
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