import { sendCapatch, verifyCapatch } from '../services/login';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'captcha',

  state: {
    status: undefined,
  },

  effects: {
    *verifyCaptcha({ payload }, { call, put }) {
      const response = yield call(verifyCapatch, payload);
      if (response.errCode === 0) {
        yield put(routerRedux.push('/user/password'));
      }
    },
    *getCaptcha({ payload }, { call, put }) {
      const response = yield call(sendCapatch, payload);
      yield put({
        type: 'handleCaptcha',
        payload: response.data,
      });
    }
  },

  reducers: {
    handleCaptcha(state, {payload}) {
      return {
        ...state,
        status: payload.errCode,
      };
    },
  },
};
