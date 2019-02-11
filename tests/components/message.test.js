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
const VALUE = "anything";
const ID = "feedback";
const REF = "#" + ID;
const NAME = "test";

function Message(props){
    const {context, name = NAME, ...rest} = props;
    const defaultField = {};
    defaultField[NAME] = {feedback: VALUE, touched: false, dity: false};
    const ctx = deepmerge({}, {fields: defaultField}, context);
    const field = {...rest, name};
    const message = (<BaseMessage {...field}>{x => <p id={ID}>{x.feedback}</p>}</BaseMessage>);
    return withFakeContext(ctx, message);
}

it("should pass feedback", () => {
    const dom = mount(<Message level={LEVELS.always} />);

    expect(dom.find(REF).text()).toBe(VALUE);
});

it("shouldn't pass empty feedback", () => {
    const props = {
        context: {fields: {test:{feedback: null, warning: null}}},
        level: LEVELS.always
    };

    const dom = mount(<Message {...props} />);

    expect(dom.find(REF).exists()).toBeFalsy();
});

it("should react on field's feedback change", done => {
    const validate = value => "This is error: " + value;
    const element = (
        <Form>
            <TestFieldController validate={validate} name={NAME}/>
            <TestMessageController name={NAME} level={LEVELS.always} />
        </Form>
    );

    const wrapper = mount(element);

    wrapper.find("input").simulate("change", {target:{value: "change"}});
    setImmediate(() => {
        expect(wrapper.find(".error").text()).toBe("This is error: change");
        done();
    });
});

it("should work in components hierarchy", () => {
    const element = (
        <Form fields={{test:{feedback: VALUE, touched: true}}}>
            <TestMessageController name={NAME} />
        </Form>
    );

    const wrapper = mount(element);

    expect(wrapper.find(".error").text()).toBe(VALUE);
    expect(wrapper.find(".title").text()).toBe("test title");
});

describe("message level tests", () => {
    it("shouldn't show submitted level when not submitted", () => {
        const dom = mount(<Message level={LEVELS.submitted} />);

        expect(dom.find(REF).exists()).toBeFalsy();
    });

    it("should show submitted level when submitted", () => {
        const props = {level: LEVELS.submitted, context: {submitted: true}};

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should show always level even when not submitted, touched, dirty", () => {
        const props = {level: LEVELS.always};

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should not show wnen never level", () => {
        const props = {
            level: LEVELS.never,
            context: {fields: {test:{dity: true, touched: true}}, submitted: true}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).exists()).toBeFalsy();
    });

    it("should not show when touched level and not touched, submited", () => {
        const dom = mount(<Message level={LEVELS.touched} />);

        expect(dom.find(REF).exists()).toBeFalsy();
    });

    it("should show when touched level and touched", () => {
        const props = {
            level: LEVELS.touched,
            context: {fields: {test:{touched: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should show when touched level and submitted", () => {
        const props = {
            level: LEVELS.touched,
            context: {submitted: true}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should not show when dirty level and not dirty", () => {
        const dom = mount(<Message level={LEVELS.dirty} />);

        expect(dom.find(REF).exists()).toBeFalsy();
    });

    it("should show when dirty level and dirty", () => {
        const props = {
            level: LEVELS.dirty,
            context: {fields: {test:{dirty: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should not show when changed level and not dirty, touched, submitted", () => {
        const dom = mount(<Message level={LEVELS.changed} />);

        expect(dom.find(REF).exists()).toBeFalsy();
    });

    it("should show when changed level and dirty", () => {
        const props = {
            level: LEVELS.changed,
            context: {fields: {test:{dirty: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should show when changed level and touched", () => {
        const props = {
            level: LEVELS.changed,
            context: {fields: {test:{touched: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should show when changed level and submitted", () => {
        const props = {level: LEVELS.changed, context: {submitted: true}};

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });
});