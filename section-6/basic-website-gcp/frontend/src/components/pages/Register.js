import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import RegistrationForm from '../profile/RegistrationForm';

const renderRegistrationForm = (props) => {
    const WrappedRegistrationForm = Form.create()(RegistrationForm);
    return <WrappedRegistrationForm {...props} />;
}

const Register = renderRegistrationForm;

Register.propTypes = {
    fbAuth: PropTypes.object.isRequired
};

export default Register;
