import React from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Form, Icon, Input, Button } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;

class SignInForm extends React.Component {

  state = {
    isError: false,
    errorMessage: '',
    loading: false
  }

  handleSubmit = async (e) => {

    e.preventDefault();

    await this.setState({
      isError: false,
      errorMessage: '',
      loading: true
    });


    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const result = await this.props.fbAuth.signInWithEmailAndPassword(values.username, values.password);
          console.log(result);
          this.props.history.push('/');
        } catch (error) {
          console.error(error);
          await this.setState({
            errorMessage: error.message,
            isError: true,
            loading: false
          });
        }
      }
    });

  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 0,
        },
      },
    };


    return (
      <Row>
        <Col span={12} offset={6}>
          <Form
            {...formItemLayout}
            onSubmit={this.handleSubmit}
            className="login-form"
          >

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
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" loading={this.state.loading}>
                Log in
              </Button>
            </FormItem>

          </Form>
        </Col>
      </Row >
    );

  }

}

SignInForm.propTypes = {
  fbAuth: PropTypes.object.isRequired
};

export default withRouter(SignInForm);