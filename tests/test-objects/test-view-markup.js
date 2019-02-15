import React, { PureComponent } from 'react';
import PropTypes from "prop-types"

export default class TestViewMarkup extends PureComponent {
    render() {
        const {value} = this.props;
        return <div className="view">{value}</div>;
    }
}

TestViewMarkup.propTypes = {
    value: PropTypes.string
};