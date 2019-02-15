import React, {PureComponent} from 'react';
import PropTypes from "prop-types"
import {ELEMENTS, DISPLAY} from "../helpers/enums";
import withForm from "../helpers/with-form";
import renderElement from "../helpers/render-element";

class View extends PureComponent {
    state = {value: this.props.value};

    facade = (() => {
        const self = this;
        return {
            type: ELEMENTS.VIEW,
            get name(){return self.name},
            get value(){return self.state.value;},
        }
    })();

    componentDidMount(){
        this.props.form.register(this.facade, this.challenge, this.props.watch);
    }

    componentWillUnmount(){
        this.props.form.unregister(this.facade);
    }

    get name() {return this.props.name;};

    challenge = () => {
        const value = this.props.sync(this.props.form.fields);
        if(value === this.state.value) return;
        this.setState({...this.state, value});
        this.onChange(this.facade);
    };

    componentDidUpdate(prevProps){
        if(prevProps.name !== this.props.name){
            prevProps.form.unregister(this.facade);
            this.props.form.register(this.facade, this.challenge);
        }
    }

    render() {
        let {display, hide, ...rest} = this.props;
        delete rest.name;

        if(display === DISPLAY.never || hide || !state.value){return null;}
        if(level === DISPLAY.submitted && !this.props.form.submitted){return null;}

        return renderElement({value: this.state.value}, rest);
    }
}

View.propTypes = {
    name: PropTypes.string.isRequired,
    hide: PropTypes.bool,
    display: PropTypes.number,
    render: PropTypes.func,
    children: PropTypes.any,
    component: PropTypes.any,
    sync: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    watch: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    form: PropTypes.shape({
        fields: PropTypes.object,
        submitted: PropTypes.bool
    }).isRequired
};

View.defaultProps = {
    display: DISPLAY.ALWAYS,
    onChange: () => {},
    hide: false,
    watch: [],
    value: null
};

export default withForm(View);