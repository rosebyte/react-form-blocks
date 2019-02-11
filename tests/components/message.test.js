import React from "react"
import {configure, mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Form from "../../src/components/form";
import BaseMessage, {LEVELS} from "../../src/components/message";
import TestMessageController from "../test-objects/test-message-controller"
import {withFakeContext} from "../test-helpers/context-provider";
import TestFieldController from "../test-objects/test-field-controller";
import deepmerge from "../test-helpers/deep-merge";

configure({adapter: new Adapter()});
const testValue = "anything";

function Message(props){
    const {context, name = "test", ...rest} = props;
    const defaultField = {test:{feedback: testValue, touched: false, dity: false}};
    const ctx = deepmerge({}, {fields: defaultField}, context);
    const field = {...rest, name};
    const message = (<BaseMessage {...field}>{x => <p id="error">{x.feedback}</p>}</BaseMessage>);
    return withFakeContext(ctx, message);
}

describe("rendering message", () => {
    it("should propagate warning and error from form", () => {
        const dom = mount(<Message name="test" level={LEVELS.allways} />);

        expect(dom.find("#error").text()).toBe(testValue);
    });

    it("shouldn't propagate warning nor error if it absents", () => {
        const props = {
            context: {fields: {test:{feedback: null, warning: null}}},
            level: LEVELS.allways
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").exists()).toBeFalsy();
    });
});

describe("using message levels", () => {
    it("shouldn't show submitted level when not submitted", () => {
        const dom = mount(<Message level={LEVELS.submitted} />);

        expect(dom.find("#error").exists()).toBeFalsy();
    });

    it("should show submitted level when submitted", () => {
        const props = {level: LEVELS.submitted, context: {submitted: true}};

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").text()).toBe(testValue);
    });

    it("should show allways level even when not submitted", () => {
        const props = {level: LEVELS.allways};

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").text()).toBe(testValue);
    });

    it("should not show wnen never level", () => {
        const props = {
            level: LEVELS.never,
            context: {fields: {test:{dity: true, touched: true}}, submitted: true}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").exists()).toBeFalsy();
    });

    it("should not show when touched level and not touched, submited", () => {
        const dom = mount(<Message level={LEVELS.touched} />);

        expect(dom.find("#error").exists()).toBeFalsy();
    });

    it("should show when touched level and touched", () => {
        const props = {
            level: LEVELS.touched,
            context: {fields: {test:{touched: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").text()).toBe(testValue);
    });

    it("should show when touched level and submitted", () => {
        const props = {
            level: LEVELS.touched,
            context: {submitted: true}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").text()).toBe(testValue);
    });

    it("should not show when dirty level and not dirty", () => {
        const dom = mount(<Message level={LEVELS.dirty} />);

        expect(dom.find("#error").exists()).toBeFalsy();
    });

    it("should show when dirty level and dirty", () => {
        const props = {
            level: LEVELS.dirty,
            context: {fields: {test:{dirty: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").text()).toBe(testValue);
    });

    it("should not show when changed level and not dirty, touched, submitted", () => {
        const dom = mount(<Message level={LEVELS.changed} />);

        expect(dom.find("#error").exists()).toBeFalsy();
    });

    it("should show when changed level and dirty", () => {
        const props = {
            level: LEVELS.changed,
            context: {fields: {test:{dirty: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").text()).toBe(testValue);
    });

    it("should show when changed level and touched", () => {
        const props = {
            level: LEVELS.changed,
            context: {fields: {test:{touched: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").text()).toBe(testValue);
    });

    it("should show when changed level and submitted", () => {
        const props = {
            level: LEVELS.changed,
            context: {submitted: true}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find("#error").text()).toBe(testValue);
    });
});

describe("message reflects changes of watched field", () => {
    it("should reflect field error raised", done => {
        const validate = value => "This is error: " + value;
        const element = (
            <Form>
                <TestFieldController validate={validate} name="test"/>
                <TestMessageController name="test" level={LEVELS.allways} />
            </Form>
        );
        const wrapper = mount(element);

        wrapper.find("input").simulate("change", {target:{value: "change"}});
        setImmediate(() => {
            expect(wrapper.find(".error").text()).toBe("This is error: change");
            done();
        });
    });
});

describe("Message used with outer markup", () => {
    it("should propagate warning and error from form", () => {
        const element = (
            <Form fields={{test:{feedback: testValue, touched: true}}}>
                <TestMessageController name="test" />
            </Form>
        );
        const wrapper = mount(element);

        expect(wrapper.find(".error").text()).toBe(testValue);
        expect(wrapper.find(".title").text()).toBe("test title");
    });
});
