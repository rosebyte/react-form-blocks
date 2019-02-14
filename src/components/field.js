import React from 'react';
import {getEventValue, preventDefault} from "../helpers/utils"
import PropTypes from "prop-types"
import withForm from "../helpers/with-form";
import {ELEMENTS} from "./form";
import renderElement from "../helpers/render-element";

class Field extends React.Component {
    name = this.props.name;
    state = {
        touched: false,
        dirty: false,
        value: this.props.value
    };

    facade = (() => {
        const self = this;
        return {
            type: ELEMENTS.FIELD,
            get name(){return self.name;},
            get touched(){return self.state.touched;},
            get dirty(){return self.state.dirty;},
            get value(){return self.state.value;},
        }
    })();

    handlePeerChange = field => {
        if(this.props.watch.indexOf(field.name) > -1){
            let synced = this.props.sync(this.props.form.fields, this.facade);
            if(synced !== this.value){
                this.setState({...this.state, value: synced});
            }
        }
    };

    handleBlur = event => {
        preventDefault(event);
        if(this.dirty || !this.touched){
            this.setState({...this.state, touched: true, dirty: false});
        }
        this.props.onBlur(event);
    };

    extractValue = event => {
        if(this.props.extractValue){
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
        this.props.form.register(this.facade, this.handlePeerChange, this.props.watch);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.name !== this.props.name){
            prevProps.form.unregister(this.facade);
            this.props.form.register(this.facade, this.handlePeerChange);
        }

        if(prevState !== this.state){
            this.props.form.onChange(this.facade);
            this.props.onChange(this.facade);
        }
    }

    componentWillUnmount(){
        this.props.form.unregister(this.facade);
    }

    render() {
        let {name, disabled, hide, form, noValue, valueName, ...rest} = this.props;

        delete rest.value;
        delete rest.watch;
        delete rest.validate;
        delete rest.onChange;
        delete rest.onBlur;
        delete rest.edit;
        delete rest.sync;
        delete rest.extractValue;
        delete rest.value;

        if(!rest.component && !rest.render && !rest.children){
            rest["component"] = "input";
            rest["type"] = rest.type || "text";
        }

        const field = {
            name,
            onChange: this.handleChange,
            disabled: disabled != null ? disabled : form.working,
            onBlur: this.handleBlur
        };

        if(!noValue){
            field[valueName] = this.state.value || "";
        }

        return hide ? null : renderElement(field, rest);
    }
}

Field.propTypes = {
    name: PropTypes.string.isRequired,
    render: PropTypes.func,
    children: PropTypes.any,
    component: PropTypes.any,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.any,
    noValue: PropTypes.bool,
    valueName: PropTypes.string,
    extractValue: PropTypes.func,
    edit: PropTypes.func,
    sync: PropTypes.func,
    watch: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    type: PropTypes.string,
    hide: PropTypes.bool,
    disabled: PropTypes.bool,
    form: PropTypes.shape({
        fields: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        register: PropTypes.func.isRequired,
        unregister: PropTypes.func.isRequired,
    }).isRequired
};

Field.defaultProps = {
    onBlur: () => {},
    onChange: () => {},
    validate: () => {},
    noValue: false,
    value: null,
    valueName: "value",
    hide: false,
    watch: [],
    edit: (oldVal, newVal) => newVal,
    sync: (fields, field) => field.value
};

export default withForm(Field)