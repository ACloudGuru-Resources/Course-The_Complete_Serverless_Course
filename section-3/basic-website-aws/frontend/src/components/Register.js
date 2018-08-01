import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import RegistrationForm from './profile/RegistrationForm';


class Register extends React.Component {

    renderRegistrationForm = () => {
        const WrappedRegistrationForm = Form.create()(RegistrationForm);
        return <WrappedRegistrationForm auth={this.props.auth} verified={this.props.verified} />;
    }

    render() {
        return (
            <div>
                {this.renderRegistrationForm()}
            </div>
        );
    }
}

Register.propTypes = {
    auth: PropTypes.object.isRequired,
    verified: PropTypes.bool.isRequired,
};

export default Register;
