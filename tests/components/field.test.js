import React from "react"
import {shallow, configure, mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Field from "../../src/components/field";
import Form from "../../src/components/form";
import TestFieldController from "../test-objects/test-field-controller"

configure({adapter: new Adapter()});

describe("Field tests", () =>{
    it('should render the component with defaults', () => {
        const wrapper = mount(<Form><Field name="test"/></Form>);

        expect(wrapper.html()).toBe("<form><input name=\"test\" value=\"\"></form>");
        expect(wrapper.find("input").prop("value")).toBe("");
    });

    it('should render the component with value', () => {
        const testValue = "testValue";
        const wrapper = mount(
            <Form><Field name="test" onChange={event => event} value={testValue} /></Form>
        );
        expect(wrapper.find("input").prop("value")).toBe(testValue);
    });

    it('should render the component with name', () => {
        const testValue = "testValue";
        const element = <Form><Field name={testValue}/></Form>;
        const wrapper = mount(element);
        expect(wrapper.find("input").prop("name")).toBe(testValue);
    });

    it('should render radio component with default value', () => {
        const testValue = "radio";
        const element = <Field name="test" component={testValue} />;
        const wrapper = shallow(element);
        expect(wrapper.prop("value")).toBeFalsy();
        expect(wrapper.prop("checked")).toBeFalsy();
    });

    it('should render checkbox component with default value', () => {
        const testValue = "checkbox";
        const element = <Field name="test" component={testValue} />;
        const wrapper = shallow(element);
        expect(wrapper.prop("value")).toBeFalsy();
        expect(wrapper.prop("checked")).toBeFalsy();
    });

    it('should handle value change', () => {
        let testValue = "";
        const newValue = "test";
        const element = <Form><Field name="test" onChange={f => testValue = f.value} /></Form>;
        const wrapper = mount(element);
        wrapper.find("input").simulate("change", {target:{value: newValue}});
        expect(testValue).toBe(newValue);
    });

    it('should handle blur', () => {
        let testValue = "";
        const newValue = "test";
        const element = <Form><Field name="test" onBlur={e => testValue = e.target.value} /></Form>;
        const wrapper = mount(element);
        wrapper.find("input").simulate("blur", {target:{value: newValue}});
        expect(testValue).toBe(newValue);
    });

    it('should run children function', () => {
        const element = <Form><Field name="test">{(props) => <input {...props} />}</Field></Form>;
        const wrapper = mount(element);

        expect(wrapper.find("input").type()).toBe("input");
    });

    it('should run render function', () => {
        const element = <Form><Field name="test" render={(props) => <input {...props} />} /></Form>;
        const wrapper = mount(element);

        expect(wrapper.find("input").type()).toBe("input");
    });
});

describe("FormField tests", () => {
    it('should run render field with value', () => {
        const testName = "testValue";
        const element = (
            <Form>
                <Field value={testName} name="testName"/>
            </Form>
        );
        const wrapper = mount(element);
        expect(wrapper.find("input").props().value).toBe("testValue");
    });

    it('should watch field change', () => {
        const value = "I'm changed now!";
        let result = {};
        const element = (
            <Form onChange={x => result = x}>
                <Field className="first" name="watched"/>
                <Field className="second"
                           name="watcher"
                           watch={["watched"]}
                           sync={fields => fields.watched.value + "!"} />
            </Form>
        );
        const wrapper = mount(element);
        const input = wrapper.find("input.first");
        input.simulate("change", {target:{value}});
        const watchedValue = wrapper.find("input").at(0).parent().prop("form").fields.watched.value;
        const watcherValue = wrapper.find("input").at(1).parent().prop("form").fields.watcher.value;
        expect(watchedValue).toBe(value);
        expect(watcherValue).toBe(value + "!");
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

    it("shouldn use outer element", () => {
        const value = "I'm changed now!";
        const element = (
            <Form>
                <TestFieldController className="first" name="test" />
                <TestFieldController className="second" name="test2"
                                     watch={["test"]}
                                     sync={fields => fields.test.value + "!"} />
            </Form>
        );

        const wrapper = mount(element);
        const input = wrapper.find("input.first");
        input.simulate("change", {target:{value}});
        const watchedValue = wrapper.find("input").at(0).parent().prop("form").fields.test.value;
        const watcherValue = wrapper.find("input").at(1).parent().prop("form").fields["test2"].value;
        expect(watchedValue).toBe(value);
        expect(watcherValue).toBe(value + "!");
    });

    it('should validate using string after change', () => {
        let state = null;
        let validate = value => "Error: " + value;
        const sut = (
            <Form onChange={x => state = x}>
                <Field value="value" name="name" validate={validate} />
            </Form>
        );
        const wrapper = mount(sut);
        wrapper.find("input").simulate("change", {target:{value: "changed"}});
        expect(state.name.feedback).toBe("Error: changed");
    });
});

