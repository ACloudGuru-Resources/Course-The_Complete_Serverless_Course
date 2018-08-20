import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Auth } from 'aws-amplify';

const FormItem = Form.Item;


class SignInForm extends React.Component {

  state = {
    isError: false,
    errorMessage: '',
    loading: false
  }

  handleSubmit = (e) => {

    e.preventDefault();

    this.setState({
      isError: false,
      errorMessage: '',
      loading: true
    });

    let that = this;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        Auth.signIn(values.username, values.password)
          .then(user => {
            console.log(user);
            that.setState({
              errorMessage: '',
              isError: false,
              loading: false
            });
            that.props.handleSignIn(user.signInUserSession);
          })
          .catch(err => {
            console.error(err);
            that.setState({
              errorMessage: err.message,
              isError: true,
              loading: false
            });
          });
      } else {
        that.setState({
          errorMessage: err.message,
          isError: true,
          loading: false
        });
      }
    });

  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">

        {
          this.state.isError ?
            (
              <div>
                {this.state.errorMessage}
              </div>
            ) : ''
        }

        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.loading}>
            Log in
          </Button>
        </FormItem>

      </Form>
    );

  }

}

export default SignInForm;