import React, { PureComponent } from 'react';
import {isString, getEventValue, isCheckable, isObject, preventDefault} from "../helpers/utils"
import PropTypes from "prop-types"
import withForm from "../helpers/with-form";
import renderElement from "../helpers/render-element";

class InnerField extends PureComponent {
    name = this.props.name;
    state = {
        error: null,
        warning: null,
        touched: false,
        dirty: false,
        value: this.props.value
    };

    facade = (() => {
        const self = this;
        return {
            get name(){return self.name;},
            get error(){return self.state.error;},
            get warning(){return self.state.warning;},
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

    handleChange = (event) => {
        preventDefault(event);
        let value = this.props.edit(this.state.value, getEventValue(event, this.props.type));
        if(value !== this.state.value){
            this.setState({...this.state, value, dirty: true});
        }
    };

    componentDidMount(){
        this.props.form.register(this.facade, this.handlePeerChange);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.name !== this.props.name){
            prevProps.form.unregister(this.facade);
            this.props.form.register(this.facade, this.handlePeerChange);
        }

        if(prevState !== this.state){
            this.props.form.fieldChanged(this.facade);
            this.props.onChange({...this.state});
        }
    }

    static getDerivedStateFromProps(props, state){
        state.error = null;
        state.warning = null;

        let error = props.validate(state.value);
        if(isString(error)){
            state.error = error;
        } else if(isObject(error)){
            if(error.error){
                state.error = error.error;
            }
            if(error.warning){
                state.warning = error.warning;
            }
        }

        if(props.name !== state.name){
            state.name = props.name;
        }

        return state;
    }

    componentWillUnmount(){
        this.props.form.unregister(this.name);
    }

    render() {
        let {name, disabled, hide, form, ...props} = this.props;

        delete props.value;
        delete props.type;
        delete props.watch;
        delete props.validate;
        delete props.onChange;
        delete props.onBlur;
        delete props.edit;
        delete props.sync;
        props.component = props.component || "input";

        const field = {
            name,
            onChange: this.handleChange,
            onBlur: this.handleBlur,
            disabled: disabled != null ? disabled : form.working
        };

        if(isCheckable(this.props.type)){
            field.checked = this.state.value || false;
        }
        else{
            field.value = this.state.value || "";
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
    value: PropTypes.any,
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