import React, { PureComponent } from 'react';
import PropTypes from "prop-types"
import Message from "../../src/components/message";
import TestMessageMarkup from "./test-message-markup";

export default class TestMessageController extends PureComponent {
    render() {
        return (
            <Message name={this.props.name}
                     component={TestMessageMarkup}
                     display={this.props.display}
                     title="test title"
                     validate={this.props.validate}
                     onChange={this.props.onChange}
                     watch={this.props.watch}/>
        )
    }
}

TestMessageController.propTypes = {
    name: PropTypes.string.isRequired
};