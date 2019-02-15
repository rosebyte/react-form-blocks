import React from 'react';
import {preventDefault} from "../helpers/utils"
import PropTypes from "prop-types"
import withForm from "../helpers/with-form";
import {ELEMENTS} from "../helpers/enums";
import renderElement from "../helpers/render-element";

class Field extends React.Component {
    name = this.props.name;
    state = {touched: false, dirty: false, value: this.props.value};

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

    challenge = () => {
        let synced = this.props.sync(this.props.form.fields, this.facade);
        if(synced !== this.value){
            this.setState({...this.state, value: synced});
        }
    };

    handleBlur = event => {
        preventDefault(event);
        if(this.dirty || !this.touched){
            this.setState({...this.state, touched: true, dirty: false});
        }
        this.props.onBlur(event);
    };

    handleChange = event => {
        preventDefault(event);
        let newValue = this.props.extractValue(event);
        let value = this.props.edit(this.state.value, newValue);
        if(value !== this.state.value){
            this.setState({...this.state, value, dirty: true});
        }
    };

    componentDidMount(){
        if(!this.props.value && this.props.form.initialValues[this.props.name]){
            this.setState({...this.state, value: this.props.form.initialValues[this.props.name]})
        }
        this.props.form.register(this.facade, this.challenge, this.props.watch);
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
        initialValues: PropTypes.object.isRequired
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
    sync: (fields, field) => field.value,
    extractValue: event => event.target.value
};

export default withForm(Field)