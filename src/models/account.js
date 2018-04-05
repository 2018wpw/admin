import { queryUserInfo, editBankInfo, editUserInfo } from '../services/account';
import { queryRoleList, createRole, editRole } from '../services/account';
import { queryUserList } from '../services/account';

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
    *queryRoleList({ payload }, { call, put }) {
      const response = yield call(queryRoleList, payload);
      yield put({
        type: 'roleListCallback',
        payload: response.data,
        errCode: response.errCode,
      });
    },
    *createRole({ payload }, { call, put }) {
      const response = yield call(createRole, payload);
      if (response.errCode === 0) {
        const response = yield call(queryRoleList, payload);
        yield put({
          type: 'roleListCallback',
          payload: response.data,
          errCode: response.errCode,
        });        
      }
    },
    *editRole({ payload }, { call, put }) {
      const response = yield call(editRole, payload);
      if (response.errCode === 0) {
        const response = yield call(queryRoleList, payload);
        yield put({
          type: 'roleListCallback',
          payload: response.data,
          errCode: response.errCode,
        });        
      }
    },
    *deleteRole({ payload }, { call, put }) {
      const response = yield call(deleteRole, payload);
      if (response.errCode === 0) {
        const response = yield call(queryRoleList, payload);
        yield put({
          type: 'roleListCallback',
          payload: response.data,
          errCode: response.errCode,
        });        
      }
    },                 
    *queryUserList({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'userListCallback',
        payload: response.data,
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
    roleListCallback(state, { payload, errCode }) {
      var key = 'role|10';
      if (errCode === 0) {
        return {
          ...state,
          ...payload,
          errCode: 0,
        }
      } else {
        return {
          ...state,
          errCode: errCode,
        }
      }
    }, 
    userListCallback(state, { payload, errCode }) {
      if (errCode === 0) {
        return {
          ...state,
          ...payload,
          errCode: 0,
        }
      } else {
        return {
          ...state,
          errCode: errCode,
        }
      }
    },     
  },
};
