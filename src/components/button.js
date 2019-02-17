import React from 'react';
import PropTypes from "prop-types"
import withForm from "../helpers/with-form";
import {isString, preventDefault} from "../helpers/utils";
import renderElement from "../helpers/render-element";

class Button extends React.Component {
    handleClick = event => {
        preventDefault(event);
        this.props.form.onSubmit(this.props.onClick, this.props.submit, this.props.onError);
    };

    render() {
        let {form, type, disabled, value, hide, children, name, ...rest} = this.props;
        delete rest.submit;
        delete rest.onClick;
        delete rest.onError;

        const field = {
            disabled: disabled !== null ? disabled : form ? form.working : false,
            type: type,
            value: !value && isString(children) ? children : value,
            children: children || value,
            onClick: this.handleClick,
            name: name
        };

        return hide ? null : renderElement(field, {...rest, children});
    }
}

Button.defaultProps = {
    disabled: null,
    hide: false,
    submit: true,
    type: "submit",
    component: "button",
    onClick: () => {},
    onError: () => {}
};

Button.propTypes = {
    value: PropTypes.string,
    disabled: PropTypes.bool,
    hide: PropTypes.bool,
    render: PropTypes.func,
    children: PropTypes.any,
    component: PropTypes.any,
    submit: PropTypes.bool,
    onClick: PropTypes.func,
    onError: PropTypes.func,
    type: PropTypes.string,
    name: PropTypes.string,
    form: PropTypes.shape({
        working: PropTypes.bool.isRequired,
        onSubmit: PropTypes.func.isRequired
    }).isRequired
};

export default withForm(Button)