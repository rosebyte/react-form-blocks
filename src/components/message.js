import React, {PureComponent} from 'react';
import PropTypes from "prop-types"
import withForm from "../helpers/with-form";
import renderElement from "../helpers/render-element";

export const LEVELS = {
    touched: 0,
    changed: 1
};

class InnerMessage extends PureComponent {
    componentDidMount(){
        this.props.form.register({name: this.props.name}, this.handlePeerChange, "message");
    }

    componentWillUnmount(){
        this.props.form.unregister(this.props.name);
    }

    handlePeerChange = changedField => {
        if(changedField === this.props.name){
            this.forceUpdate()
        }
    };

    render() {
        const {name, level = LEVELS.touched, ...rest} = this.props;
        const field = this.props.form.fields[name];

        if(this.props.hide || !field || (!field.error && !field.warning)){
            return null;
        }

        if(!this.props.form.submitted && !field.touched && level === LEVELS.touched){
            return null;
        }

        const content = {error: field.error, warning: field.warning};

        return renderElement(content, rest);
    }
}

InnerMessage.propTypes = {
    name: PropTypes.string.isRequired,
    hide: PropTypes.bool,
    level: PropTypes.number,
    render: PropTypes.func,
    children: PropTypes.any,
    component: PropTypes.any,
    form: PropTypes.shape({
        fields: PropTypes.object,
        submitted: PropTypes.bool
    })
};

InnerMessage.defaultProps = {
    level: LEVELS.touched,
    hide: false,
    form: {}
};

export default withForm(InnerMessage);