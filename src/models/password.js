import { resetPwd } from '../services/login';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'password',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(resetPwd, payload);
      if (response.errCode === 0) {
        yield put(routerRedux.push('/'));
      } else {
        yield put({
          type: 'errorCallback',
          payload: response,
        });
      }
    },
  },
  reducers: {
    errorCallback(state, { payload }) {
      return {
        ...state,
        errCode: payload.errCode,
        errMsg: payload.errMsg,
      };
    },
  },
};
