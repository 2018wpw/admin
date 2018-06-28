import React from 'react';
import { Input, Icon } from 'antd';
import styles from './index.less';

const map = {
  UserName: {
    component: Input,
    props: {
      size: 'large',
      placeholder: '手机号',
    },
    rules: [{
      required: true, message: '请输入手机号',
    }, {
      pattern: /^1\d{10}$/, message: '手机号码格式错误',
    }],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      type: 'password',
      placeholder: '密码',
    },
    rules: [{
      required: true, message: '请输入密码',
    }],
  },
  Mobile: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [{
      required: true, message: '请输入手机号',
    }, {
      pattern: /^1\d{10}$/, message: '手机号码格式错误',
    }],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [{
      required: true, message: '请输入验证码',
    }],
  },
};

export default map;
