import React from "react"
import Form, {ELEMENTS} from "../../src/components/form"
import {configure, mount} from "enzyme"
import Field from "../../src/components/field";
import Button from "../../src/components/button";
import Adapter from 'enzyme-adapter-react-16';
import TestMessageController from "../test-objects/test-message-controller";
import {LEVELS} from "../../src/components/message";

configure({adapter: new Adapter()});

describe("Form tests", () => {
    it('should register field', () => {
        const sut = (
            <Form>
                <Field name="firstField" />
                <Field name="secondField" watch={"firstField"} />
            </Form>
        );
        const wrapper = mount(sut);

        expect(wrapper.instance().fields["firstField"]).not.toBeUndefined();
        expect(wrapper.instance().fields["secondField"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["firstField"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["firstField"].length).toBe(1);
    });

    it('should unregister field', () => {
        const sut = (
            <Form>
                <Field name="firstField" watch={["A", "B"]} />
                <Field name="secondField" watch={"A"} />
            </Form>
        );
        const wrapper = mount(sut);

        expect(wrapper.instance().fields["firstField"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["A"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["A"].length).toBe(2);
        expect(wrapper.instance().handlers["B"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["B"].length).toBe(1);

        wrapper.instance().unregister({name: "firstField", type: ELEMENTS.FIELD});

        expect(wrapper.instance().fields["firstField"]).toBeUndefined();
        expect(wrapper.instance().fields["secondField"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["A"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["A"].length).toBe(1);
        expect(wrapper.instance().handlers["B"]).toBeUndefined();
    });

    it('should unregister message', () => {
        const sut = (
            <Form>
                <TestMessageController name="firstField" watch={["watched"]} />
            </Form>
        );
        const wrapper = mount(sut);

        expect(wrapper.instance().messages["firstField"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["firstField"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["firstField"].length).toBe(1);
        expect(wrapper.instance().handlers["watched"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["watched"].length).toBe(1);

        wrapper.instance().unregister({name: "firstField", type: ELEMENTS.MESSAGE});

        expect(wrapper.instance().messages["firstField"]).toBeUndefined();
        expect(wrapper.instance().handlers["firstField"]).toBeUndefined();
        expect(wrapper.instance().handlers["watched"]).toBeUndefined();
    });

    it('should register message', () => {
        const sut = (
            <Form>
                <TestMessageController name="firstField" />
                <TestMessageController name="secondField" />
            </Form>
        );
        const wrapper = mount(sut);

        expect(wrapper.instance().fields["firstField"]).toBeUndefined();
        expect(wrapper.instance().fields["secondField"]).toBeUndefined();
        expect(wrapper.instance().messages["firstField"]).not.toBeUndefined();
        expect(wrapper.instance().messages["secondField"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["firstField"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["firstField"].length).toBe(1);
        expect(wrapper.instance().handlers["firstField"][0].name).toBe("firstField");
        expect(wrapper.instance().handlers["firstField"][0].type).toBe(ELEMENTS.MESSAGE);
        expect(wrapper.instance().handlers["firstField"][0].handler).not.toBeUndefined();
        expect(wrapper.instance().handlers["secondField"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["secondField"].length).toBe(1);
        expect(wrapper.instance().handlers["secondField"][0].name).toBe("secondField");
        expect(wrapper.instance().handlers["secondField"][0].type).toBe(ELEMENTS.MESSAGE);
        expect(wrapper.instance().handlers["secondField"][0].handler).not.toBeUndefined();

    });

    it('should render field', () => {
        const sut = (
            <Form>
                <Field name="myTestField" />
            </Form>
        );
        const wrapper = mount(sut);

        expect(wrapper.find("input").exists()).not.toBeFalsy();
    });

    it('should reflect own change via edit', () => {
        let fields = {name: {value: "value", error: "error", warning: "warning"}};
        let newValue = null;
        let oldValue = null;
        let onChange = (currentVal, nextVal) => {
            newValue = nextVal;
            oldValue = currentVal;
            return "edited"
        };

        const sut = (
            <Form fields={fields}>
                <Field className="firstField" value="value" name="name" edit={onChange} />
                <Field className="second" name="surname" />
            </Form>
        );
        const wrapper = mount(sut);
        wrapper.find("input").at(0).simulate("change", {target:{value: "changed"}});
        expect(oldValue).toBe("value");
        expect(newValue).toBe("changed");
        expect(wrapper.find("input").at(0).props().value).toBe("edited")
    });

    it('should reflect peer change via sync', () => {
        let fields = {
            name: {value: "value1", error: "error1", warning: "warning1"},
            surname: {value: "value2", error: "error2", warning: "warning2"},
        };

        const sut = (
            <Form fields={fields}>
                <Field name="name"/>
                <Field name="surname"
                       watch={["name"]}
                       sync={fields => "Watched: " + fields.name.value}/>
            </Form>
        );
        const wrapper = mount(sut);
        wrapper.find("input").at(0).simulate("change", {target:{value: "changed"}});
        expect(wrapper.find("input").at(1).props().value).toBe("Watched: changed")
    });

    it('should pass fields to context', () => {
        let testfields = {
            name: {value: "value1", error: "error1", warning: "warning1"},
            surname: {value: "value2", error: "error2", warning: "warning2"},
        };

        const sut = (
            <Form fields={testfields}>
                <Button value="name"/>
            </Form>
        );
        const wrapper = mount(sut);
        expect(wrapper.find("button").parent().prop("form").fields).toBe(testfields)
    });

    it("should be working when submitting", done => {
        function handleSubmit () {
            expect(wrapper.instance().state.working).toBeTruthy();
        }

        const element = (
            <Form onSubmit={handleSubmit} />
        );
        const wrapper = mount(element);

        wrapper.simulate("submit");

        setImmediate(() => {
            expect(wrapper.instance().state.working).toBeFalsy();
            done();
        });
    });

    it("should pass working to context", done => {
        function handleSubmit () {
            expect(wrapper.instance().state.working).toBeTruthy();
            expect(wrapper.find("button").parent().prop("form").working).toBeTruthy();
        }

        const wrapper = mount(<Form onSubmit={handleSubmit}><Button value="name"/></Form>);
        expect(wrapper.find("button").parent().prop("form").working).toBeFalsy();

        wrapper.simulate("submit");

        setImmediate(() => {
            expect(wrapper.find("button").parent().prop("form").working).toBeFalsy();
            done();
        });
    });

    it("should pass own methods to context", done => {
        const element = (
            <Form><Button value="name"/></Form>
        );
        const wrapper = mount(element);
        const form = wrapper.find("button").parent().prop("form");
        expect(form.register).not.toBeUndefined();
        expect(form.unregister).not.toBeUndefined();
        expect(form.onSubmit).not.toBeUndefined();
        expect(form.onChange).not.toBeUndefined();

        wrapper.simulate("submit");

        setImmediate(() => {
            expect(wrapper.find("button").parent().prop("form").working).toBeFalsy();
            done();
        });
    });

    it("should be submitted after submitting", done => {
        let submitting = false;

        function handleSubmit () {
            submitting = true;
        }

        const element = (
            <Form onSubmit={handleSubmit} />
        );
        const wrapper = mount(element);
        expect(wrapper.instance().state.submitted).toBeFalsy();
        wrapper.simulate("submit");

        setImmediate(() => {
            expect(submitting).toBeTruthy();
            expect(wrapper.instance().state.submitted).toBeTruthy();
            done();
        });
    });

    it("should pass submitted to context", done => {
        const element = (
            <Form><Button value={name}/></Form>
        );
        const wrapper = mount(element);
        expect(wrapper.find("button").parent().prop("form").submitted).toBeFalsy();
        wrapper.simulate("submit");

        setImmediate(() => {
            expect(wrapper.find("button").parent().prop("form").submitted).toBeTruthy();
            done();
        });
    });

    it("should notify of field change", () => {
        const fields = {a:{}, b: {}};
        let result = {};

        const element = (
            <Form><Button value={name}/></Form>
        );
        const wrapper = mount(element);
        const form = wrapper.instance();

        form.fields = fields;
        form.handlers = {
            a:[{handler: (field => result.a = field)}, {handler: (field => result.b = field)}],
            b:[{handler: (field => result.c = field)}]
        };

        const a = {name: "a", value:"A"};

        form.onChange(a, {name: "a", value:"B"});

        expect(result.a.name).toBe("a");
        expect(result.b.name).toBe("a");
        expect(result.c).toBeUndefined();
    });

    it("should emit on Change after field changed", () => {
        let changes = [];

        const sut = (
            <Form onChange={event => changes.push(event)}>
                <Field name="myTestField" />
            </Form>
        );
        const wrapper = mount(sut);
        wrapper.find("input").simulate("change", {target:{value:"aa"}});

        expect(changes.length).toBe(1);
        expect(changes[0].fields["myTestField"].value).toBe("aa");
        expect(changes[0].working).not.toBeNull();
        expect(changes[0].working).toBe(false);
        expect(changes[0].submitted).not.toBeNull();
        expect(changes[0].submitted).toBe(false);
    });

    it("should emit on Change after message changed", () => {
        let changes = [];

        const sut = (
            <Form onChange={event => changes.push(event)}>
                <Field name="myTestField" validate={value => value} />
            </Form>
        );
        const wrapper = mount(sut);
        wrapper.find("input").simulate("change", {target:{value:"aa"}});

        expect(changes.length).toBe(1);
        expect(changes[0].fields["myTestField"].value).toBe("aa");
        expect(changes[0].working).not.toBeNull();
        expect(changes[0].working).toBe(false);
        expect(changes[0].submitted).not.toBeNull();
        expect(changes[0].submitted).toBe(false);
    });

    it("should emit on Changes when submitting", done => {
        const fields = "AASSS";
        let changes = [];
        const element = <Form onChange={event => changes.push(event)} />;
        const wrapper = mount(element);
        const form = wrapper.instance();
        form.fields = fields;
        wrapper.simulate("submit");

        setImmediate(() => {
            expect(changes.length).toBe(2);
            done();
        });
    });

    it("should pass submitters name to onSubmit method", () => {
        function handleSubmit (fields, valid, name) {
            expect(name).toBe("myName");
        }

        const element = (
            <Form onSubmit={handleSubmit} />
        );
        const wrapper = mount(element);

        wrapper.simulate("submit", {target:{name:"myName"}});
    });

    it("should pass fields to onSubmit method", () => {
        const testFields = {prop:""};

        function handleSubmit (fields) {
            expect(fields).toBe(fields);
        }

        const element = (
            <Form fields={testFields} onSubmit={handleSubmit} />
        );
        const wrapper = mount(element);

        wrapper.simulate("submit");
    });

    it("should pass true if form is valid", () => {
        const testFields = {prop:""};

        function handleSubmit (fields, valid) {
            expect(valid).toBeTruthy();
        }

        const element = (
            <Form fields={testFields} onSubmit={handleSubmit} />
        );
        const wrapper = mount(element);

        wrapper.simulate("submit");
    });

    it("should pass false if form is not valid", () => {
        const testFields = {prop:""};

        function handleSubmit (fields, valid) {
            expect(valid).toBeTruthy();
        }

        const element = (
            <Form fields={testFields} onSubmit={handleSubmit} />
        );
        const wrapper = mount(element);

        wrapper.simulate("submit");
    });

    it("should pass null when submitter has no name", () => {
        function handleSubmit (fields, valid, name) {
            expect(name).toBeNull();
        }

        const element = (
            <Form onSubmit={handleSubmit} />
        );
        const wrapper = mount(element);

        wrapper.simulate("submit", {target:{}});
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
});