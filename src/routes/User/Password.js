import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Captcha.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@connect(({ password, loading }) => ({
  password,
  submitting: loading.effects['password/submit'],
}))
@Form.create()
export default class Password extends React.Component {
  
  state = {
  	count: 0,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'password/submit',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  render() {
  	const { form, submitting } = this.props;
    const { count } = this.state;
    const { getFieldDecorator } = form;

    return (
    	<div className={styles.main}>
    		<h3 className={styles.subtitle}>密码重置</h3>
    		<Form onSubmit={this.handleSubmit}>
	          <FormItem>
	            {getFieldDecorator('newPwd', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ],
              })(<Input size="large" placeholder="新密码" />)}
	          </FormItem>

            <FormItem>
              {getFieldDecorator('cfmPwd', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ],
              })(<Input size="large" placeholder="确认密码" />)}
            </FormItem>

            <FormItem>
  	            <Button
  	              size="large"
  	              className={styles.submit}
  	              loading={submitting}
  	              type="primary"
  	              htmlType="submit"
  	            >
  	              确定
  	            </Button>
  	        </FormItem>
    		</Form>
    	</div>
    )
  }
}