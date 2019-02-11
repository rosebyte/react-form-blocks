import React from "react"
import {configure, mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Form from "../../src/components/form";
import Tmess, {LEVELS} from "../../src/components/message";
import TestMessageController from "../test-objects/test-message-controller"
import mockFormContext, {withFakeContext} from "../test-helpers/context-provider";
import TestFieldController from "../test-objects/test-field-controller";

configure({adapter: new Adapter()});

function Message(props){
    const {context, name = "test", ...rest} = props;
    return mockFormContext(
        context,
        {...rest, name},
        "../../src/components/message",
        props => (
            <div className="output">
            {props.error && <p className="error">{props.error}</p>}
            {props.warning && <p className="warning">{props.warning}</p>}
            </div>
        )
    )
}

function MessageFunc(props){
    return (
        <Tmess {...props}>
            {
                props => (
                    <div className="output">
                        {props.error && <p className="error">{props.error}</p>}
                        {props.warning && <p className="warning">{props.warning}</p>}
                    </div>
                )
            }
        </Tmess>
    )
}

beforeEach(() => {
    jest.resetModules();
});

const defaultContext = {
    submitted: false,
    register: () => {},
    fields: {test:{error: "E", warning: "W", touched: false, dity: false}}
};

describe("rendering message", () => {
    it("should propagate warning and error from form", () => {
        const elem = withFakeContext(defaultContext, <MessageFunc name="test" level={LEVELS.allways} />);

        //const dom = mount(<Message context={{fields:{test:{touched: true}}}} />);
        const dom = mount(elem);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").text()).toBe("W");
    });

    it("shouldn't propagate warning or error if it absents", () => {
        const props = {
            context: {fields: {test:{error: null, warning: null}}},
            level: LEVELS.allways
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".output").exists()).toBeFalsy();
    });

    it("shouldn't propagate warning if it absents", () => {
        const props = {
            context: {fields: {test:{warning: null}}},
            level: LEVELS.allways
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").exists()).toBeFalsy();
    });

    it("shouldn't propagate error if it absents", () => {
        const props = {
            context: {fields: {test:{error: null}}},
            level: LEVELS.allways
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").exists()).toBeFalsy();
        expect(dom.find(".warning").text()).toBe("W");
    });
});

describe("using message levels", () => {
    it("shouldn't show submitted level when not submitted", () => {
        const dom = mount(<Message level={LEVELS.submitted} />);

        expect(dom.find(".error").exists()).toBeFalsy();
        expect(dom.find(".warning").exists()).toBeFalsy();
    });

    it("should show submitted level when submitted", () => {
        const props = {level: LEVELS.submitted, context: {submitted: true}};

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").text()).toBe("W");
    });

    it("should show allways level even when not submitted", () => {
        const props = {level: LEVELS.allways};

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").text()).toBe("W");
    });

    it("should not show wnen never level", () => {
        const props = {
            level: LEVELS.never,
            context: {fields: {test:{dity: true, touched: true}}, submitted: true}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").exists()).toBeFalsy();
        expect(dom.find(".warning").exists()).toBeFalsy();
    });

    it("should not show when touched level and not touched, submited", () => {
        const dom = mount(<Message level={LEVELS.touched} />);

        expect(dom.find(".error").exists()).toBeFalsy();
        expect(dom.find(".warning").exists()).toBeFalsy();
    });

    it("should show when touched level and touched", () => {
        const props = {
            level: LEVELS.touched,
            context: {fields: {test:{touched: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").text()).toBe("W");
    });

    it("should show when touched level and submitted", () => {
        const props = {
            level: LEVELS.touched,
            context: {submitted: true}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").text()).toBe("W");
    });

    it("should not show when dirty level and not dirty", () => {
        const dom = mount(<Message level={LEVELS.dirty} />);

        expect(dom.find(".error").exists()).toBeFalsy();
        expect(dom.find(".warning").exists()).toBeFalsy();
    });

    it("should show when dirty level and dirty", () => {
        const props = {
            level: LEVELS.dirty,
            context: {fields: {test:{dirty: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").text()).toBe("W");
    });

    it("should not show when changed level and not dirty, touched, submitted", () => {
        const dom = mount(<Message level={LEVELS.changed} />);

        expect(dom.find(".error").exists()).toBeFalsy();
        expect(dom.find(".warning").exists()).toBeFalsy();
    });

    it("should show when changed level and dirty", () => {
        const props = {
            level: LEVELS.changed,
            context: {fields: {test:{dirty: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").text()).toBe("W");
    });

    it("should show when changed level and touched", () => {
        const props = {
            level: LEVELS.changed,
            context: {fields: {test:{touched: true}}}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").text()).toBe("W");
    });

    it("should show when changed level and submitted", () => {
        const props = {
            level: LEVELS.changed,
            context: {submitted: true}
        };

        const dom = mount(<Message {...props} />);

        expect(dom.find(".error").text()).toBe("E");
        expect(dom.find(".warning").text()).toBe("W");
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
            expect(wrapper.find(".warning").exists()).toBeFalsy();
            done();
        });
    });

    it("should reflect field warning raised", done => {
        const validate = value => ({warning: "This is warning: " + value});
        const element = (
            <Form>
                <TestFieldController validate={validate} name="test"/>
                <TestMessageController name="test" level={LEVELS.allways} />
            </Form>
        );
        const wrapper = mount(element);

        wrapper.find("input").simulate("change", {target:{value: "change"}});
        setImmediate(() => {
            expect(wrapper.find(".warning").text()).toBe("This is warning: change");
            expect(wrapper.find(".error").exists()).toBeFalsy();
            done();
        });
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
