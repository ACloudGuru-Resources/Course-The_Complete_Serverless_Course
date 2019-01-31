import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;


class RegistrationForm extends React.Component {

  state = {
    confirmDirty: false,
    isError: false,
    errorMessage: '',
    confirm: false,
  };

  handleSignup = ({ email, password }) => {
    this.props.fbAuth.createUserWithEmailAndPassword(email, password)
      .then(data => {
        this.setState({
          confirm: true,
          errorMessage: '',
          isError: false
        });
      })
      .catch(err => {
        this.setState({
          errorMessage: err.message,
          isError: true
        });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.handleSignup(values);
      }
    });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });

  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
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
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Row>
        <Col span={12} offset={4}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label="E-mail"
            >
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'The input is not valid E-mail!',
                }, {
                  required: true, message: 'Please input your E-mail!',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Password"
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: 'Please input your password!',
                }, {
                  validator: this.validateToNextPassword,
                }],
              })(
                <Input type="password" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Confirm Password"
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: 'Please confirm your password!',
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">Register</Button>
            </FormItem>
            {
              this.state.isError ?
                (
                  <div>
                    {this.state.errorMessage}
                  </div>
                ) : ''
            }
          </Form>
        </Col>
      </Row>
    );
  }
}

RegistrationForm.propTypes = {
  fbAuth: PropTypes.object.isRequired,
};

export default RegistrationForm;