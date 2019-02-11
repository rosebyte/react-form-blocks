import React, { PureComponent } from 'react';
import PropTypes from "prop-types"
import withForm from "../../src/helpers/with-form";

class TestButtonMarkup extends PureComponent {
    render() {
        const {value} = this.props;
        return (
            <button type="submit">{value}</button>
        )
    }
}

TestButtonMarkup.propTypes = {
    value: PropTypes.string.isRequired
};

export default withForm(TestButtonMarkup)