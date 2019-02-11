import React, { PureComponent } from 'react';
import PropTypes from "prop-types"

export default class TestMessageMarkup extends PureComponent {
    render() {
        const {feedback, title} = this.props;
        return (
            <div>
                <div className="title">{title}</div>
                {feedback && <div className="error">{feedback}</div>}
            </div>
        )
    }
}

TestMessageMarkup.propTypes = {
    feedback: PropTypes.string,
    title: PropTypes.string.isRequired
};