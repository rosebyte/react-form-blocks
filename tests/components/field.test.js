import React from "react"
import {shallow, configure, mount} from "enzyme"
import Adapter from 'enzyme-adapter-react-16';
import Field from "../../src/components/field";
import Form, {ELEMENTS} from "../../src/components/form";
import TestFieldController from "../test-objects/test-field-controller"

configure({adapter: new Adapter()});

describe("Field tests", () =>{
    it('should render the component with defaults', () => {
        const wrapper = mount(<Form><Field name="test"/></Form>);

        expect(wrapper.html()).toBe('<form name="__form__"><input name="test" type="text" value=""></form>');
        expect(wrapper.find("input").prop("value")).toBe("");
    });

    it('should render the component with value', () => {
        const testValue = "testValue";
        const wrapper = mount(
            <Form><Field name="test" onChange={event => event} value={testValue} /></Form>
        );
        expect(wrapper.find("input").prop("value")).toBe(testValue);
    });

    it('should extract value', () => {
        const testValue = "testValue";
        const wrapper = mount(
            <Form><Field name="test" extractValue={event => event.myValue.first} /></Form>
        );
        wrapper.find("input").simulate("change", {myValue:{first: testValue}});
        expect(wrapper.instance().fields.test.value).toBe(testValue);
    });

    it('should render the component with name', () => {
        const testValue = "testValue";
        const element = <Form><Field name={testValue}/></Form>;
        const wrapper = mount(element);
        expect(wrapper.find("input").prop("name")).toBe(testValue);
    });

    it('should register component after mount', () => {
        const testValue = "testValue";
        const element = <Form><Field name={testValue} watch={["iSee"]}/></Form>;
        const wrapper = mount(element);
        expect(wrapper.instance().fields[testValue]).not.toBeUndefined();
        expect(wrapper.instance().handlers["iSee"]).not.toBeUndefined();
        expect(wrapper.instance().handlers["iSee"].length).toBe(1);
        expect(wrapper.instance().handlers["iSee"][0].name).toBe(testValue);
        expect(wrapper.instance().handlers["iSee"][0].type).toBe(ELEMENTS.FIELD);
        expect(wrapper.instance().handlers["iSee"][0].handler).not.toBeUndefined();
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

    it("shouldn't be dirty after blur", () => {
        let testValue = "";
        const newValue = "test";
        const element = <Form><Field name="test" onBlur={e => testValue = e.target.value} /></Form>;
        const wrapper = mount(element);
        wrapper.find("input").simulate("change", {target:{value: newValue}});
        expect(wrapper.instance().fields.test.dirty).toBeTruthy();

        wrapper.find("input").simulate("blur", {target:{value: newValue}});

        expect(wrapper.instance().fields.test.dirty).toBeFalsy();
    });

    it("should be touched after blur", () => {
        let testValue = "";
        const newValue = "test";
        const element = <Form><Field name="test" onBlur={e => testValue = e.target.value} /></Form>;
        const wrapper = mount(element);
        expect(wrapper.instance().fields.test.touched).toBeFalsy();

        wrapper.find("input").simulate("blur", {target:{value: newValue}});

        expect(wrapper.instance().fields.test.touched).toBeTruthy();
    });

    it("should be dirty after change", () => {
        let testValue = "";
        const newValue = "test";
        const element = <Form><Field name="test" onBlur={e => testValue = e.target.value} /></Form>;
        const wrapper = mount(element);

        expect(wrapper.instance().fields.test.dirty).toBeFalsy();

        wrapper.find("input").simulate("change", {target:{value: newValue}});

        expect(wrapper.instance().fields.test.dirty).toBeTruthy();
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

    it("should ignore non-watched field's change", () => {
        const value = "I'm changed now!";
        let syncMethodWasInvoked = false;
        const element = (
            <Form>
                <Field className="first" name="watched"/>
                <Field className="second"
                       name="watcher"
                       value="A"
                       sync={() => syncMethodWasInvoked = true} />
            </Form>
        );
        const wrapper = mount(element);
        const input = wrapper.find("input.first");
        input.simulate("change", {target:{value}});
        expect(syncMethodWasInvoked).toBeFalsy();
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

    it("should not change state if value doesn't change", () => {
        let changes = [];
        let edit = currentVal => currentVal;

        const sut = (
            <Form>
                <Field value="value" name="name" edit={edit} onChange={x => changes.push(x)} />
            </Form>
        );
        const wrapper = mount(sut);
        wrapper.find("input").simulate("change", {target:{value: "changed"}});
        expect(changes.length).toBe(0);
    });

    it("should use outer element", () => {
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

    it('should emit change after change', () => {
        let changes = [];
        let validate = value => "Error: " + value;
        const sut = (
            <Form>
                <Field value="value" name="name" validate={validate}
                       onChange={facade => changes.push(facade)} />
            </Form>
        );
        const wrapper = mount(sut);
        wrapper.find("input").simulate("change", {target:{value: "changed"}});
        expect(changes.length).toBe(1);
        expect(changes[0].value).toBe("changed");
    });
});

