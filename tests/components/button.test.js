import React from "react"
import {configure, mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Form from "../../src/components/form";
import Button from "../../src/components/button";
import TestButtonController from "../test-objects/test-button-controller"

configure({adapter: new Adapter()});

describe("Button with form", () => {
    it("should submit form", done => {
        let watcher = {value: "value", message: "error"};
        let fields = {watcher};
        let result = {};
        let clicked = false;

        function handleSubmit (fields, isValid, submitter) {
            result = {fields, isValid, submitter};
        }

        const element = (
            <Form fields={fields} onSubmit={handleSubmit}>
                <Button name="testButton" value={"test button"} onClick={() => clicked = true} />
            </Form>
        );
        const wrapper = mount(element);

        const button = wrapper.find("button");

        button.simulate("click");

        setImmediate(() => {
            expect(result.fields.watcher).toBe(watcher);
            expect(result.isValid).toBeTruthy();
            expect(result.submitter).toBe("testButton");
            done();
        });
    });

    it("should be disabled when submitting", done => {
        function handleSubmit () {
            expect(wrapper.instance().state.working).toBeTruthy();
            expect(wrapper.find("button").html()).toContain("disabled=\"\"");
        }

        const element = (
            <Form onSubmit={handleSubmit}>
                <Button name="testButton" value={"test button"}/>
            </Form>
        );
        const wrapper = mount(element);

        const button = wrapper.find("button");
        expect(wrapper.instance().state.working).toBeFalsy();
        expect(button.prop("disabled")).toBeFalsy();
        button.simulate("click");

        setImmediate(() => {
            expect(button.prop("disabled")).toBeFalsy();
            expect(wrapper.instance().state.working).toBeFalsy();
            done();
        });
    });

    it("should not be disabled when submitting and disabled prop is false", done => {
        function handleSubmit () {
            expect(wrapper.instance().state.working).toBeTruthy();
            expect(wrapper.find("button").html()).not.toContain("disabled=\"\"");
        }

        const element = (
            <Form onSubmit={handleSubmit}>
                <Button name="testButton" value={"test button"} disabled={false}/>
            </Form>
        );
        const wrapper = mount(element);

        const button = wrapper.find("button");
        expect(wrapper.instance().state.working).toBeFalsy();
        expect(button.prop("disabled")).toBeFalsy();
        button.simulate("click");

        setImmediate(() => {
            expect(wrapper.find("button").prop("disabled")).toBeFalsy();
            expect(wrapper.instance().state.working).toBeFalsy();
            done();
        });
    });

    it("should submit form with its name", () => {
        let buttonName = null;

        function handleSubmit (fields, isValid, submitter) {
            buttonName = submitter;
        }

        const element = (
            <Form onSubmit={handleSubmit}>
                <Button name="testButton" value={"test button"} />
            </Form>
        );
        const wrapper = mount(element);

        const button = wrapper.find("button");

        button.simulate("click");

        expect(buttonName).toBe("testButton");
    });

    it("should submit form without setting it submitted", () => {
        const element = (
            <Form onSubmit={() => {}}>
                <Button name="testButton" value={"test button"} setSubmitted={false} />
            </Form>
        );
        const wrapper = mount(element);
        wrapper.find("button").simulate("click");

        expect(wrapper.instance().state.submitted).toBeFalsy();
    });

    it("should be hidden with hide prop", () => {
        const element = (
            <Form onSubmit={() => {}}>
                <Button name="testButton" value={"test button"} hide={true} />
            </Form>
        );
        const wrapper = mount(element);
        wrapper.find("button");

        expect(wrapper.find("button").exists()).toBeFalsy();
    });

    it("should be disabled with disabled prop", () => {
        const element = (
            <Form onSubmit={() => {}}>
                <Button name="testButton" value={"test button"} disabled={true} />
            </Form>
        );
        const wrapper = mount(element);
        wrapper.find("button");

        expect(wrapper.find("button").prop("disabled")).toBeTruthy();
    });



    it("should submit form with setting it submitted as default", () => {
        const element = (
            <Form onSubmit={() => {}}>
                <Button name="testButton" value={"test button"} />
            </Form>
        );
        const wrapper = mount(element);
        wrapper.find("button").simulate("click");

        expect(wrapper.instance().state.submitted).toBeTruthy();
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

    it("should submit by click using outside components", () => {
        let watcher = {value: "value", warning: "warning"};
        let fields = {watcher};
        let result = {};

        function handleSubmit(fields, isValid, name) {
            result.fields = fields;
            result.isValid = isValid;
            result.name = name;
        }

        const element = (
            <Form fields={fields} onSubmit={handleSubmit}>
                <TestButtonController name="name" />
            </Form>
        );
        const wrapper = mount(element);

        const button = wrapper.find("button");
        button.simulate("click");

        expect(result.fields.watcher).toBe(watcher);
        expect(result.isValid).toBeTruthy();
        expect(result.name).toBe("name");
    });
});

