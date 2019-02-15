import React, { PureComponent } from 'react';
import PropTypes from "prop-types"
import View from "../../src/components/view";
import TestViewMarkup from "./test-message-markup";

export default class TestViewController extends PureComponent {
    render() {
        return (
            <View name={this.props.name}
                     component={TestViewMarkup}
                     display={this.props.display}
                     sync={this.props.sync}
                     onChange={this.props.onChange}
                     watch={this.props.watch}/>
        )
    }
}

TestViewController.propTypes = {
    name: PropTypes.string.isRequired
};