import React from "react"
import {configure, mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Form from "../../src/components/form";
import Button from "../../src/components/button";
import TestButtonController from "../test-objects/test-button-controller"
import TestFieldController from "../test-objects/test-field-controller"

configure({adapter: new Adapter()});

const NAME = "btn";
const VALUE = "test button";

describe("Button with form", () => {
    it("should submit form", done => {
        let result = {};

        function onError(error){}

        function handleClick (form, error) {
            result = {form, error};
        }

        const element = (
            <Form values={{btn: VALUE}}>
                <TestFieldController name={NAME} value={VALUE} />
                <Button name={NAME} value={VALUE} onError={onError} onClick={handleClick} />
            </Form>
        );
        const wrapper = mount(element);

        const button = wrapper.find("button");

        button.simulate("click");

        setImmediate(() => {
            expect(result.form.fields[NAME].value).toBe(VALUE);
            expect(result.error).toBe(onError);
            done();
        });
    });

    it("should submit form using outside components", done => {
        let result = {};

        function onError(){}

        function handleClick (form, error) {
            result = {form, error};
        }

        const element = (
            <Form values={{btn: VALUE}}>
                <TestFieldController name={NAME} value={VALUE} />
                <TestButtonController name={NAME}
                                      value={VALUE}
                                      onError={onError}
                                      onClick={handleClick} />
            </Form>
        );
        const wrapper = mount(element);

        const button = wrapper.find("button");

        button.simulate("click");

        setImmediate(() => {
            expect(result.form.fields[NAME].value).toBe(VALUE);
            expect(result.error.toString()).toBe(onError.toString());
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

    it("should submit form without setting it submitted", () => {
        const element = (
            <Form onSubmit={() => {}}>
                <Button name="testButton" value={"test button"} submit={false} />
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
            <Form >
                <Button name="testButton" value={"test button"} onClick={() => {}}/>
            </Form>
        );
        const wrapper = mount(element);
        wrapper.find("button").simulate("click");

        expect(wrapper.instance().state.submitted).toBeTruthy();
    });
});

