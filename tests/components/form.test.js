import React from "react"
import Form from "../../src/components/form"
import {configure, mount} from "enzyme"
import Field from "../../src/components/field";
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

describe("Form tests", () => {
    it('should register field', () => {
        const sut = (
            <Form>
                <Field name="myTestField" />
            </Form>
        );
        const wrapper = mount(sut);

        expect(wrapper.instance().fields["myTestField"]).not.toBe(null);
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

    it('should validate after sync', () => {
        let testfields = {
            name: {value: "value1", error: "error1", warning: "warning1"},
            surname: {value: "value2", error: "error2", warning: "warning2"},
        };

        const sut = (
            <Form fields={testfields}>
                <Field name="name"/>
                <Field name="surname"
                       watch={["name"]}
                       sync={fields => "Watched: " + fields.name.value}
                       validate={value => {
                           if (value === "Watched: changed"){
                               return "this works!"
                           }
                       }}/>
            </Form>
        );
        const wrapper = mount(sut);
        wrapper.find("input").at(0).simulate("change", {target:{value: "changed"}});
        const second = wrapper.find("input").at(1).parent().prop("form").fields.surname.feedback;
        expect(second).toBe("this works!")
    });
});