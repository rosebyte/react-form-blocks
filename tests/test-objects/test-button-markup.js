import React, { PureComponent } from 'react';
import PropTypes from "prop-types"
import withForm from "../../src/helpers/with-form";

class TestButtonMarkup extends PureComponent {
    render() {
        const {value, onClick, name} = this.props;
        return (
            <button type="submit" onClick={onClick} name={name}>{value}</button>
        )
    }
}

TestButtonMarkup.propTypes = {
    value: PropTypes.string.isRequired
};

export default withForm(TestButtonMarkup)