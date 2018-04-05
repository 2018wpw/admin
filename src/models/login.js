import { routerRedux } from 'dva/router';
import { login, logout } from '../services/login';
import { setAuthority, clearAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      // Login successfully
      yield put({
        type: 'changeLoginStatus',
        auto: payload.autoLogin,
        status: response.errCode,
        payload: response.errCode === 0 ? response.data : '',
      });
      if (response.errCode === 0) {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }      
    },
    *logout(_, { call, put, select }) {
      const reponse = yield call(logout);
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'clearLoginStatus',
          payload: {
            status: reponse.errCode,
            currentAuthority: '',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload, auto, status }) {
      if (status === 0) {
        setAuthority(payload);
      }
      return {
        ...state,
        status: status,
        type: payload.type,
      };
    },
    clearLoginStatus(state, { payload }) {
      clearAuthority();
      return {
        ...state,
        status: 0,
        type: payload.type,        
      }
    },
  },
};
