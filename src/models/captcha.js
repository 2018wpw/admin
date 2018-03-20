import { fakeRegister } from '../services/api';
import { fakeGetCaptcha } from '../services/api';

export default {
  namespace: 'captcha',

  state: {
    status: undefined,
  },

  effects: {
    *submit(_, { call, put }) {
      const response = yield call(fakeGetCaptcha, payload);
      yield put({
        type: 'handleCaptcha',
        payload: response,
      });
    },
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
