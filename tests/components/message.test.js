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
const ID = "msg";
const REF = "#" + ID;
const NAME = "test";

function Message(props){
    const {context, name = NAME, ...rest} = props;
    const defaultField = {};
    defaultField[NAME] = {message: VALUE, touched: false, dity: false};
    const ctx = deepmerge({}, {fields: defaultField}, context);
    const field = {...rest, name};
    const message = (<BaseMessage {...field}>{x => <p id={ID}>{x.message}</p>}</BaseMessage>);
    return withFakeContext(ctx, message);
}

it("should pass message", () => {
    const dom = mount(<Message level={LEVELS.always} value={VALUE} />);
    expect(dom.find(REF).text()).toBe(VALUE);
});

it('should validate using string after change', () => {
    let state = null;
    let validate = field => "Error: " + field[NAME].value;
    const sut = (
        <Form>
            <TestFieldController value={VALUE} name={NAME}/>
            <TestMessageController name={NAME} validate={validate} onChange={x => state = x} />
        </Form>
    );
    const wrapper = mount(sut);
    wrapper.find("input").simulate("change", {target:{value: "changed"}});
    expect(state.value).toBe("Error: changed");
});

it("shouldn't pass empty message", () => {
    const props = {
        context: {fields: {test:{message: null, warning: null}}},
        level: LEVELS.always
    };

    const dom = mount(<Message {...props} />);

    expect(dom.find(REF).exists()).toBeFalsy();
});

it("should work in components hierarchy", () => {
    const element = (
        <Form fields={{test:{message: VALUE, touched: true}}}>
            <TestFieldController value="test" name={NAME} />
            <TestMessageController validate={x => "Error: " + x[NAME].value}
                                   name={NAME}
                                   level={LEVELS.always} />
        </Form>
    );

    const wrapper = mount(element);
    wrapper.find("input").simulate("change", {target:{value: "changed"}});
    let html = wrapper.html();
    expect(wrapper.find(".error").text()).toBe("Error: changed");
});

it("should be hidden with hide prop", () => {
    const dom = mount(<Message level={LEVELS.always} hide={true} />);

    expect(dom.find(REF).exists()).toBeFalsy();
});

describe("message level tests", () => {
    it("shouldn't show submitted level when not submitted", () => {
        const dom = mount(<Message level={LEVELS.submitted} />);

        expect(dom.find(REF).exists()).toBeFalsy();
    });

    it("should show submitted level when submitted", () => {
        const props = {level: LEVELS.submitted, value: VALUE, context: {submitted: true}};

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should show always level even when not submitted, touched, dirty", () => {
        const props = {level: LEVELS.always, value: VALUE};

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
            context: {fields: {test:{touched: true}}},
            value: VALUE
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should show when touched level and submitted", () => {
        const props = {
            level: LEVELS.touched,
            context: {submitted: true},
            value: VALUE
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
            context: {fields: {test:{dirty: true}}},
            value: VALUE
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
            context: {fields: {test:{dirty: true}}},
            value: VALUE
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should show when changed level and touched", () => {
        const props = {
            level: LEVELS.changed,
            context: {fields: {test:{touched: true}}},
            value: VALUE
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });

    it("should show when changed level and submitted", () => {
        const props = {level: LEVELS.changed, context: {submitted: true}, value: VALUE};

        const dom = mount(<Message {...props} />);

        expect(dom.find(REF).text()).toBe(VALUE);
    });
});