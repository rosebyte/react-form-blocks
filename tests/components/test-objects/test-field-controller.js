import React, { PureComponent } from 'react';
import PropTypes from "prop-types"
import withForm from "../../../src/helpers/with-form";
import Field from "../../../src/components/field";
import TestFieldMarkup from "./test-field-markup";

class TestFieldController extends PureComponent {
    render() {
        return (
            <Field name={this.props.name}
                   component={TestFieldMarkup}
                   className={this.props.className}
                   watch={this.props.watch}
                   sync={this.props.sync} />
        )
    }
}

TestFieldController.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    sync: PropTypes.func,
    watch: PropTypes.array
};

export default withForm(TestFieldController)