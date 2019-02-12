import React, { PureComponent } from 'react';
import {getEventValue, isCheckable, preventDefault} from "../helpers/utils"
import PropTypes from "prop-types"
import withForm from "../helpers/with-form";
import {ELEMENTS} from "./form";
import renderElement from "../helpers/render-element";

class InnerField extends PureComponent {
    name = this.props.name;
    state = {
        message: null,
        touched: false,
        dirty: false,
        value: this.props.value
    };

    facade = (() => {
        const self = this;
        return {
            get name(){return self.name;},
            get message(){return self.state.message;},
            get touched(){return self.state.touched;},
            get dirty(){return self.state.dirty;},
            get value(){return self.state.value;},
        }
    })();

    handlePeerChange = (fieldName) => {
        if(this.props.watch.indexOf(fieldName) > -1){
            let synced = this.props.sync(this.props.form.fields, this.facade);
            if(synced !== this.value){
                this.setState({...this.state, value: synced});
            }
        }
    };

    handleBlur = (event) => {
        preventDefault(event);

        if(this.dirty || !this.touched){
            this.setState({...this.state, touched: true, dirty: false});
        }

        this.props.onBlur(event);
    };

    extractValue = event => {
        if(this.props.getValue){
            return this.props.extractValue(event);
        }

        return getEventValue(event, this.props.type);
    };

    handleChange = event => {
        preventDefault(event);
        let newValue = this.extractValue(event);
        let value = this.props.edit(this.state.value, newValue);
        if(value !== this.state.value){
            this.setState({...this.state, value, dirty: true});
        }
    };

    componentDidMount(){
        this.props.form.register(this.facade, this.handlePeerChange, ELEMENTS.FIELD);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.name !== this.props.name){
            prevProps.form.unregister(this.facade);
            this.props.form.register(this.facade, this.handlePeerChange);
        }

        if(prevState !== this.state){
            this.props.form.fieldChanged(this.facade, ELEMENTS.FIELD);
            this.props.onChange({...this.state});
        }
    }

    static getDerivedStateFromProps(props, state){
        let message = props.validate(state.value, state.message) || null;
        if(message !== (state.message || null)){
            state.message = message;
            props.form.fieldChanged(state, ELEMENTS.MESSAGE)
        }

        if(props.name !== state.name){
            state.name = props.name;
        }

        return state;
    }

    componentWillUnmount(){
        this.props.form.unregister(this.name, ELEMENTS.FIELD);
    }

    render() {
        let {name, disabled, hide, form, noValue, noBlur, ...props} = this.props;

        delete props.value;
        delete props.type;
        delete props.watch;
        delete props.validate;
        delete props.onChange;
        delete props.onBlur;
        delete props.edit;
        delete props.sync;
        delete props.extractValue;

        props.component = props.component || "input";

        const field = {
            name,
            onChange: this.handleChange,
            disabled: disabled != null ? disabled : form.working
        };

        if(!noBlur){
            field.onBlur = this.handleBlur
        }

        if(!noValue){
            if(isCheckable(this.props.type)){
                field.checked = this.state.value || false;
            }
            else{
                field.value = this.state.value || "";
            }
        }

        return hide ? null : renderElement(field, props);
    }
}

InnerField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    render: PropTypes.func,
    children: PropTypes.func,
    component: PropTypes.any,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    noBlur: PropTypes.bool,
    value: PropTypes.any,
    noValue: PropTypes.bool,
    extractValue: PropTypes.func,
    validate: PropTypes.func,
    edit: PropTypes.func,
    sync: PropTypes.func,
    watch: PropTypes.array,
    hide: PropTypes.bool
};

InnerField.defaultProps = {
    onBlur: () => {},
    onChange: () => {},
    validate: () => {},
    value: null,
    hide: false,
    type: "text",
    watch: [],
    edit: (oldVal, newVal) => newVal,
    sync: (fields, field) => field.value
};

export default withForm(InnerField)