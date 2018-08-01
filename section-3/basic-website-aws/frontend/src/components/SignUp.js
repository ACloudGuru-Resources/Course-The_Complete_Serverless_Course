import React from 'react';
import { Form } from 'antd';
import RegistrationForm from './profile/RegistrationForm';


class SigninForm extends React.Component {
    render() {
        const WrappedRegistrationForm = Form.create()(RegistrationForm);
        return (
            <div>
                <WrappedRegistrationForm />
            </div>
        );
    }
}

export default SigninForm;
