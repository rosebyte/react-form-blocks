import React, {PureComponent} from 'react';
import PropTypes from "prop-types"
import withForm from "../helpers/with-form";
import renderElement from "../helpers/render-element";

export const LEVELS = {
    allways: 0,
    changed: 1,
    dirty: 2,
    touched: 3,
    submitted: 4,
    never: 5
};

class Message extends PureComponent {
    componentDidMount(){
        this.props.form.register({name: this.props.name}, this.handlePeerChange, "message");
    }

    componentWillUnmount(){
        this.props.form.unregister(this.props.name);
    }

    handlePeerChange = () => this.forceUpdate();

    render() {
        const {name, level = LEVELS.touched, hide, ...rest} = this.props;
        const field = this.props.form.fields[name];
        const submitted = this.props.form.submitted;

        if(!field || !field.feedback){return null;}
        if(level === LEVELS.never || hide){return null;}
        if(level === LEVELS.submitted && !submitted){return null;}
        if(level === LEVELS.touched && !field.touched && !submitted){return null;}
        if(level === LEVELS.dirty && !field.dirty){return null;}
        if(level === LEVELS.changed && !field.dirty && !field.touched && !submitted){return null;}

        return renderElement({feedback: field.feedback}, rest);
    }
}

Message.propTypes = {
    name: PropTypes.string.isRequired,
    hide: PropTypes.bool,
    level: PropTypes.number,
    render: PropTypes.func,
    children: PropTypes.any,
    component: PropTypes.any,
    form: PropTypes.shape({
        fields: PropTypes.object,
        submitted: PropTypes.bool
    }).isRequired
};

Message.defaultProps = {
    level: LEVELS.touched,
    hide: false
};

export default withForm(Message);