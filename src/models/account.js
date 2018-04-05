import { queryUserInfo, editBankInfo, editUserInfo } from '../services/account';

export default {
  namespace: 'account',

  state: {
    userInfo: '',
    bankInfo: '',
    role: {
      name: '',
      id: ''
    },
    userCompleted: false,
    bankCompleted: false,    
  },

  effects: {
    *queryUserInfo({ payload }, { call, put }) {
      const response = yield call(queryUserInfo, payload);
      yield put({
        type: 'userInfoCallback',
        payload: response.data,
        errCode: response.errCode,
      });
    },
    *editBankInfo({ payload }, { call, put }) {
      const response = yield call(editBankInfo, payload);
      yield put({
        type: 'editBankCallback',
        errCode: response.errCode,
      });
    },
    *editUserInfo({ payload }, { call, put }) {
      const response = yield call(editUserInfo, payload);
      yield put({
        type: 'editUserCallback',
        errCode: response.errCode,
      });
    },
  },

  reducers: {
    userInfoCallback(state, { payload, errCode }) {
      if (errCode === 0) {
        return {
          ...state,
          ...payload,
          errCode: 0,
          role: payload.userInfo.role,
        }
      } else {
        return {
          ...state,
          errCode: errCode,
        }
      }
    },
    editBankCallback(state, { errCode }) {
      return {
        ...state,
        bankCompleted: true,
        errCode: errCode,
      }
    },
    editUserCallback(state, { errCode }) {
      return {
        ...state,
        userCompleted: true,
        errCode: errCode,
      }
    },    
  },
};
