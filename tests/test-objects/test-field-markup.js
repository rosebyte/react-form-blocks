import React, { PureComponent } from 'react';
import PropTypes from "prop-types"
import withForm from "../../src/helpers/with-form";

export class TestFieldMarkup extends PureComponent {
    render() {
        const {value, onChange, onBlur, className} = this.props;
        return (
            <input value={value} onChange={onChange} onBlur={onBlur} className={className}/>
        )
    }
}

TestFieldMarkup.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string
};

export default withForm(TestFieldMarkup)