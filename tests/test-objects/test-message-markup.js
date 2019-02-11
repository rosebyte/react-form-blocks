import React, { PureComponent } from 'react';
import PropTypes from "prop-types"

export default class TestMessageMarkup extends PureComponent {
    render() {
        const {message, title} = this.props;
        return (
            <div>
                <div className="title">{title}</div>
                {message && <div className="error">{message}</div>}
            </div>
        )
    }
}

TestMessageMarkup.propTypes = {
    message: PropTypes.string,
    title: PropTypes.string.isRequired
};