import { fakeGetCaptcha, fakeVerifyCaptcha } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'captcha',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeVerifyCaptcha, payload);
      console.log(response);
      if (response.status === 'ok') {
        yield put(routerRedux.push('/user/password'));
      }
    },
    *getCaptcha({ payload }, { call, put }) {
      const response = yield call(fakeGetCaptcha, payload);
      console.log(response);
      yield put({
        type: 'handleCaptcha',
        payload: response,
      });
    }
  },

  reducers: {
    handleCaptcha(state, {payload}) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
