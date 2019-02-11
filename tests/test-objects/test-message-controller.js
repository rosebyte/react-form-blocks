import React, { PureComponent } from 'react';
import PropTypes from "prop-types"
import withForm from "../../src/helpers/with-form";
import Message from "../../src/components/message";
import TestMessageMarkup from "./test-message-markup";

class TestMessageController extends PureComponent {
    render() {
        return (
            <Message name={this.props.name}
                     component={TestMessageMarkup}
                     level={this.props.level}
                     title="test title"/>
        )
    }
}

TestMessageController.propTypes = {
    name: PropTypes.string.isRequired
};

export default withForm(TestMessageController)