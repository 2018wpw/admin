import { fakeRegister } from '../services/api';
import { fakeGetCaptcha } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'password',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeGetCaptcha, payload);
      if (response.status === 'ok') {
        yield put(routerRedux.push('/'));
      }
    },
  },
};
