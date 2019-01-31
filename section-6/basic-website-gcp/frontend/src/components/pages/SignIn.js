import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import SignInForm from '../profile/SignInForm';

const renderSignInForm = (props) => {
    const WrappedSignInForm = Form.create()(SignInForm);
    return <WrappedSignInForm {...props} />;
}

const SignIn = renderSignInForm;

SignIn.propTypes = {
    fbAuth: PropTypes.object.isRequired
};

export default SignIn;
