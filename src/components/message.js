import React, {PureComponent} from 'react';
import PropTypes from "prop-types"
import {ELEMENTS, DISPLAY} from "../helpers/enums";
import withForm from "../helpers/with-form";
import renderElement from "../helpers/render-element";



class Message extends PureComponent {
    state = {value: this.props.value || null, ran: false};

    facade = (() => {
        const self = this;
        return {
            type: ELEMENTS.MESSAGE,
            get name(){return self.props.name;},
            get value(){return self.state.value;},
            get isValid(){return self.isValid}
        }
    })();

    componentDidMount(){
        this.props.form.register(this.facade, this.challenge, this.props.watch);
    }

    componentWillUnmount(){
        this.props.form.unregister(this.facade);
    }

    get isValid() {
        if(!this.state.ran){this.challenge()}
        return this.props.check ? this.props.check() : !this.state.value;
    };

    challenge = () => {
        const message = this.props.validate(this.props.form.fields);
        if(message !== this.state.value || !this.state.ran){
            this.setState({...this.state, value: message, ran: true})
        }

        if(this.props.required){
            const field = this.props.form.fields[this.name];
            if(field && !field.value && this.state.value !== this.props.required){
                this.setState({...this.state, value: this.props.required, ran: true})
            }
        }
    };

    componentDidUpdate(prevProps, prevState){
        if(prevProps.name !== this.props.name){
            prevProps.form.unregister(this.facade);
            this.props.form.register(this.facade, this.challenge);
        }

        if(prevState !== this.state){
            this.props.onChange(this.facade);
        }
    }

    render() {
        let {name, display, hide, ...rest} = this.props;
        const value = this.state.value;

        const field = this.props.form.fields[name];
        if(!value){return null;}
        const submitted = this.props.form.submitted;

        if(display === DISPLAY.NEVER || hide){return null;}
        if(display === DISPLAY.SUBMITTED && !submitted){return null;}
        if(display === DISPLAY.TOUCHED && !field.touched && !submitted){return null;}
        if(display === DISPLAY.DIRTY && !field.dirty){return null;}
        if(display === DISPLAY.CHANGED && !field.dirty && !field.touched && !submitted){return null;}

        return renderElement({message: value}, rest);
    }
}

Message.propTypes = {
    name: PropTypes.string.isRequired,
    hide: PropTypes.bool,
    display: PropTypes.number,
    render: PropTypes.func,
    children: PropTypes.any,
    component: PropTypes.any,
    validate: PropTypes.func,
    onChange: PropTypes.func,
    required: PropTypes.string,
    watch: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    form: PropTypes.shape({
        fields: PropTypes.object,
        submitted: PropTypes.bool
    }).isRequired
};

Message.defaultProps = {
    display: DISPLAY.TOUCHED,
    onChange: () => {},
    validate: () => {},
    hide: false,
    watch: []
};

export default withForm(Message);