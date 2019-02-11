import React, { PureComponent } from 'react';
import withForm from "../../src/helpers/with-form";
import TestButtonMarkup from "./test-button-markup";
import Button from "../../src/components/button";

class TestButtonController extends PureComponent {
    render() {
        const {name, onClick} = this.props;

        return (
            <Button component={TestButtonMarkup} value="test title" name={name} onClick={onClick}/>
        )
    }
}

export default withForm(TestButtonController)