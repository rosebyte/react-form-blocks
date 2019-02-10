import React from "react"
import {configure, mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Form from "../../src/components/form";
import Message, {LEVELS} from "../../src/components/message";
import TestMessageController from "./test-objects/test-message-controller"

configure({adapter: new Adapter()});

describe("message", () => {
    it("should propagate warning and error from form", () => {
        const element = (
            <Form fields={{test:{error: "E", warning: "W", touched: true}}}>
                <Message name="test" />
            </Form>
        );
        const wrapper = mount(element);
        const error = wrapper.find(".error");
        expect(error.text()).toBe("E");
        const warning = wrapper.find(".warning");
        expect(warning.text()).toBe("W");
    });

    it("shouldn't propagate warning or error if it absents", () => {
        const element = (
            <Form fields={{test:{touched: true}}}>
                <Message name="test" />
            </Form>
        );
        const wrapper = mount(element);
        const error = wrapper.find(".error");
        expect(error.exists()).toBeFalsy();
        const warning = wrapper.find(".warning");
        expect(warning.exists()).toBeFalsy();
    });

    it("shouldn't propagate warning if it absents", () => {
        const element = (
            <Form fields={{test:{error: "E", touched: true}}}>
                <Message name="test" />
            </Form>
        );
        const wrapper = mount(element);
        const error = wrapper.find(".error");
        expect(error.text()).toBe("E");
        const warning = wrapper.find(".warning");
        expect(warning.exists()).toBeFalsy();
    });

    it("shouldn't propagate error if it absents", () => {
        const element = (
            <Form fields={{test:{warning: "W", touched: true}}}>
                <Message name="test" />
            </Form>
        );
        const wrapper = mount(element);
        const error = wrapper.find(".error");
        expect(error.exists()).toBeFalsy();
        const warning = wrapper.find(".warning");
        expect(warning.text()).toBe("W");
    });

    it("shouldn't propagate error below level", () => {
        const element = (
            <Form fields={{test:{error: "E", touched: false}}}>
                <Message name="test" />
            </Form>
        );
        const wrapper = mount(element);
        const error = wrapper.find(".error");
        expect(error.exists()).toBeFalsy();
        const warning = wrapper.find(".warning");
        expect(warning.exists()).toBeFalsy();
    });
});

describe("Message used with outer markup", () => {
    it("should propagate warning and error from form", () => {
        const element = (
            <Form fields={{test:{error: "E", warning: "W", touched: true}}}>
                <TestMessageController name="test" />
            </Form>
        );
        const wrapper = mount(element);

        expect(wrapper.find(".error").text()).toBe("E");
        expect(wrapper.find(".warning").text()).toBe("W");
        expect(wrapper.find(".title").text()).toBe("test title");
    });

    it("shouldn't propagate warning or error if it absents", () => {
        const element = (
            <Form fields={{test:{touched: true}}}>
                <TestMessageController name="test" />
            </Form>
        );
        const wrapper = mount(element);

        expect(wrapper.find(".error").exists()).toBeFalsy();
        expect(wrapper.find(".warning").exists()).toBeFalsy();
    });

    it("shouldn't propagate warning if it absents", () => {
        const element = (
            <Form fields={{test:{error: "E", touched: true}}}>
                <TestMessageController name="test" />
            </Form>
        );
        const wrapper = mount(element);

        expect(wrapper.find(".warning").exists()).toBeFalsy();
    });

    it("shouldn't propagate error if it absents", () => {
        const element = (
            <Form fields={{test:{warning: "W", touched: true}}}>
                <TestMessageController name="test" />
            </Form>
        );
        const wrapper = mount(element);

        expect(wrapper.find(".error").exists()).toBeFalsy();
    });

    it("shouldn't propagate error below level", () => {
        const element = (
            <Form fields={{test:{error: "E", touched: false}}}>
                <TestMessageController name="test" />
            </Form>
        );
        const wrapper = mount(element);

        expect(wrapper.find(".error").exists()).toBeFalsy();
        expect(wrapper.find(".warning").exists()).toBeFalsy();
    });
});
