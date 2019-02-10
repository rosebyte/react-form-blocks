import React from 'react';
import PropTypes from "prop-types"
import withForm from "../helpers/with-form";
import {isString, preventDefault} from "../helpers/utils";
import renderElement from "../helpers/render-element";

class Button extends React.Component {
    handleClick = (event) => {
        preventDefault(event);
        this.props.form.submit(this.props.name, this.props.setSubmitted);
        this.props.onClick(event);
    };

    render() {
        let {form, type, disabled, value, render, children, component, hide, setSubmitted,
            ...rest} = this.props;

        const field = {
            disabled: disabled !== null ? disabled : form.working,
            type: type,
            value: !value && isString(children) ? children : value,
            onClick: this.handleClick
        };

        return hide ? null : renderElement(component, children, render, field, rest)
    }
}

Button.defaultProps = {
    disabled: null,
    hide: false,
    setSubmitted: true,
    type: "submit",
    component: "button",
    onClick: () => {},
    form: {}
};

Button.propTypes = {
    value: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    hide: PropTypes.bool,
    render: PropTypes.func,
    children: PropTypes.any,
    component: PropTypes.any,
    setSubmitted: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string,
    name: PropTypes.string,
    form: PropTypes.shape({
        working: PropTypes.bool,
        submit: PropTypes.func
    }).isRequired
};

export default withForm(Button)