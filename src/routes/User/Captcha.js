import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Captcha.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@connect(({ captcha, loading }) => ({
  captcha,
  submitting: loading.effects['captcha/verifyCaptcha'],
}))
@Form.create()
export default class Captcha extends React.Component {
  
  state = {
  	count: 0,
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    this.props.form.validateFields('mobile', {force: true}, (err, values) => {
      if (!err) {
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
      
        //send captcha
        this.props.dispatch({
          type: 'captcha/getCaptcha',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(['captcha', 'mobile'], { force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'captcha/verifyCaptcha',
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
	            {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ],
              })(<Input size="large" placeholder="手机号" />)}
	          </FormItem>

    		    <FormItem>
	            <Row gutter={8}>
	              <Col span={16}>
	                {getFieldDecorator('captcha', {
	                  rules: [
	                    {
	                      required: true,
	                      message: '请输入验证码！',
	                    },
	                  ],
	                })(<Input size="large" placeholder="验证码" />)}
	              </Col>
	              <Col span={8}>
	                <Button
	                  size="large"
	                  disabled={count}
	                  className={styles.getCaptcha}
	                  onClick={this.onGetCaptcha}
	                >
	                  {count ? `${count} s` : '发送验证码'}
	                </Button>
	              </Col>
	            </Row>
            </FormItem>

            <FormItem>
	            <Button
	              size="large"
	              className={styles.submit}
	              loading={submitting}
	              type="primary"
	              htmlType="submit"
	            >
	              下一步
	            </Button>
	          </FormItem>
    		</Form>
    	</div>
    )
  }
}