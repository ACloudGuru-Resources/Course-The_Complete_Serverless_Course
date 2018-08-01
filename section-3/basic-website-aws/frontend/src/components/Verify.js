import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { Auth } from 'aws-amplify';

const FormItem = Form.Item;

const Verify = Form.create()(

  class extends Component {

    state = {
      resending: false,
      confirmLoading: false
    };

    handleCodeConfirm = () => {
      this.setState({
        confirmLoading: true
      });
      const form = this.formRef.props.form;
      form.validateFields((err, values) => {
        if (err) {
          this.setState({
            confirmLoading: false
          });
          return;
        } else {
          Auth.confirmSignUp(values.username, values.code)
            .then(data => {
              console.log(data);
              form.resetFields();
              this.setState({
                confirmLoading: false,
                confirm: false
              });
            })
            .catch(err => console.log(err));
        }

      });
    }

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
      const { getFieldDecorator } = this.formRef.props.form;
      return (
        <div>
          <p>Please confirm your account by using the MFA code send to your email</p>
          <Form>
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please enter your username' }],
              })(
                <Input placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('code', {
                rules: [{ required: true, message: 'Please enter your email code' }],
              })(
                <Input placeholder="Code" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.confirmLoading}>
                Verify
              </Button>
            </FormItem>

          </Form>
        </div>
      );
    }

  }

);

export default Verify;
