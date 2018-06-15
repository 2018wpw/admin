import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon, message } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: false,
    withUserInfo: true,
  }

  handleSubmit = (err, values) => {
    const { type, withUserInfo, autoLogin } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          withUserInfo,
          autoLogin,
        },
      });
    }
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  renderMessage = (content) => {
    message.error(content);
  }

  render() {
    const { submitting, login } = this.props;
    const { type, withUserInfo } = this.state;
    if (login.status === 0x201 && submitting === false) {
      this.renderMessage('手机号或密码错误');
    }
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account">
            <UserName name="userPhone" />
            <Password name="userPwd" />
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
            <Link style={{ float: 'right' }} to="/user/captcha">忘记密码？</Link>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
