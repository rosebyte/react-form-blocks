import React, { PureComponent } from 'react';
import PropTypes from "prop-types"
import withForm from "../../src/helpers/with-form";

export class TestMessageMarkup extends PureComponent {
    render() {
        const {error, warning, title} = this.props;
        return (
            <div>
                <div className="title">{title}</div>
                {error && <div className="error">{error}</div>}
                {warning && <div className="warning">{warning}</div>}
            </div>
        )
    }
}

TestMessageMarkup.propTypes = {
    error: PropTypes.string,
    warning: PropTypes.string,
    title: PropTypes.string.isRequired
};

export default withForm(TestMessageMarkup)