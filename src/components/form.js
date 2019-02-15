import React from 'react';
import PropTypes from "prop-types"
import {any, isString, preventDefault} from "../helpers/utils";
import warning from "tiny-warning";
import FormContext from "../helpers/context"
import {ELEMENTS} from "../helpers/enums";


export default class Form extends React.Component {
    fields = {};
    messages = {};
    handlers = {};
    state = {working: false, submitted: false};

    get initialValues(){return this.props.values}

    get isValid() {return !any(this.messages, x => !x.isValid);};

    get facade(){
        const self = this;
        return {
            type: ELEMENTS.FORM,
            get initialValues(){return self.initialValues},
            get name(){return self.name},
            get messages(){return self.messages},
            get working(){return self.state.working},
            get submitted() {return self.state.submitted},
            get fields() {return self.fields},
            get isValid() {return self.isValid}
        }
    }

    get formContext(){
        const self = this;
        return {
            register: self.register,
            unregister: self.unregister,
            onSubmit: self.onSubmit,
            onChange: self.onChange,
            get initialValues(){return self.initialValues},
            get messages(){return self.messages},
            get working(){return self.state.working},
            get submitted() {return self.state.submitted},
            get fields() {return self.fields}
        }
    }

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
        if(watch && watch.length){
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

    onSubmit = (func, setSubmitted, onError) => {
        this.setState({...this.state, working: true}, () => {
            func(this.facade, onError);
            const submitted = this.state.submitted || setSubmitted;
            this.setState({...this.state, submitted, working: false});
        });
    };

    handleSubmit = (event) => {
        preventDefault(event);
        warning("Don't use submit event, use form button click instead.")
    };

    render() {
        const {children, ...rest} = this.props;
        delete rest.onChange;
        delete rest.onSubmit;
        delete rest.values;

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
    values: {}
};

Form.propTypes = {
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    values: PropTypes.object
};