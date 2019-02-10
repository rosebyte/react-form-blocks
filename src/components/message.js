import React, {PureComponent} from 'react';
import PropTypes from "prop-types"
import withForm from "../helpers/with-form";
import {isFunction, isString} from "../helpers/utils";
import renderElement from "../helpers/render-element";

export const LEVELS = {
    touched: 0,
    changed: 1
};

class InnerMessage extends PureComponent {
    componentDidMount(){
        this.props.form.register({name: this.props.name}, this.handlePeerChange, "message");
    }

    componentWillUnmount(){
        this.props.form.unregister(this.props.name);
    }

    handlePeerChange = changedField => {
        if(changedField === this.props.name){
            this.forceUpdate()
        }
    };

    render() {
        const {name, level = LEVELS.touched, render, children, component, ...rest} = this.props;
        const field = this.props.form.fields[name];

        if(this.props.hide || !field || (!field.error && !field.warning)){
            return null;
        }

        if(!this.props.form.submitted && !field.touched && level === LEVELS.touched){
            return null;
        }

        const content = {error: field.error, warning: field.warning};

        const result = renderElement(component, children, render, content, rest);

        return result ? result : (
            <React.Fragment>
                {field.error && <div className="error">{field.error}</div>}
                {field.warning && <div className="warning">{field.warning}</div>}
            </React.Fragment>
        );
    }
}

InnerMessage.propTypes = {
    name: PropTypes.string.isRequired,
    hide: PropTypes.bool,
    level: PropTypes.number,
    render: PropTypes.func,
    children: PropTypes.any,
    component: PropTypes.any,
    form: PropTypes.shape({
        fields: PropTypes.object,
        submitted: PropTypes.bool
    })
};

InnerMessage.defaultProps = {
    level: LEVELS.touched,
    hide: false,
    form: {}
};

export default withForm(InnerMessage);