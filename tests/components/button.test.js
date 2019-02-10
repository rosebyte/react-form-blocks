import React from "react"
import {configure, mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Form from "../../src/components/form";
import Button from "../../src/components/button";
import TestButtonController from "./test-objects/test-button-controller"

configure({adapter: new Adapter()});

describe("Button with form", () => {
    it("should submit form", () => {
        //arrange
        let watcher = {value: "value", error: "error", warning: "warning"};
        let fields = {watcher};
        let result = {};

        const element = (
            <Form fields={fields}
                  onSubmit={(fields, isValid) => {result.fields = fields; result.isValid = isValid}}>
                <Button value={"test button"} />
            </Form>
        );
        const wrapper = mount(element);

        const button = wrapper.find("button");

        //act
        button.simulate("submit");

        //assert
        expect(result.fields.watcher).toBe(watcher);
        expect(result.isValid).toBeFalsy();
    });

    it("should submit form using outside components", () => {
        let watcher = {value: "value", warning: "warning"};
        let fields = {watcher};
        let result = {};

        const element = (
            <Form fields={fields}
                  onSubmit={(fields, isValid) => {result.fields = fields; result.isValid = isValid}}>
                <TestButtonController />
            </Form>
        );
        const wrapper = mount(element);

        const button = wrapper.find("button");
        button.simulate("submit");
        expect(result.fields.watcher).toBe(watcher);
        expect(result.isValid).toBeTruthy();
    });
});

