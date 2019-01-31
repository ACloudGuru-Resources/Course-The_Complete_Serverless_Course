import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class Verify extends Component {

    state = {
        resending: false
    };

    onResendVerification = () => {
        this.setState({
            resending: true
        });
        this.props.auth.currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: window.location.protocol + '/' + window.location.host + '/'
        })
            .then(() => {
                this.setState({
                    resending: false
                });
            })
    }


    render() {
        return (
            <div>
                <p>Please confirm your account by using the MFA code sent to your email</p>
                <Button type="info" loading={this.state.resending} onClick={this.onResendVerification} >Resend verification</Button>
            </div>
        );
    }
};

Verify.propTypes = {
    auth: PropTypes.object.isRequired,
    verified: PropTypes.bool.isRequired
};

export default Verify;