import { queryUserInfo, editBankInfo, editUserInfo } from '../services/account';
import { queryRoleList, createRole, editRole, deleteRole } from '../services/account';
import { queryUserList, queryAccountList, createAccount, editAccount, resetAccountPwd } from '../services/account';
import { formatMockData } from '../utils/utils';

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
      console.log('deleteRole');  
      var body = {
        groupID: payload.groupID,
        devices: payload.devices,
      };
      const { resolve, reject } = payload;         
      const response = yield call(deleteRole, body);
      if (response.errCode === 0) {
        resolve();
        const response = yield call(queryRoleList, payload);
        yield put({
          type: 'roleListCallback',
          payload: response.data,
          errCode: response.errCode,
        });        
      } else {
        reject(response.errMsg);
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
    *queryAccountList({ payload }, { call, put }) {
      const response = yield call(queryAccountList, payload);
      yield put({
        type: 'accountListCallback',
        payload: response.data,
        errCode: response.errCode,
      });
    },

    *searchAccount({ payload }, { call, put }) {
      const { resolve, reject } = payload;
      var body = {
        name: payload.name,
        addrDetail: payload.addrDetail,
        phone: payload.phone,
        addrCode: payload.addrCode,
      };
      const response = yield call(queryAccountList, body);
      if(response.errCode === 0) {
        if (resolve) {
          response.data = formatMockData(response.data);
          resolve(response.data);
        }
        yield put({
          type: 'accountListCallback',
          payload: response.data,
          errCode: response.errCode,
        });
      } else {
        if(reject) {
          reject(response.errMsg);
        }
      } 
    },

    *createAccount({ payload }, { call, put }) {
      const response = yield call(createAccount, payload);
      if (response.errCode === 0) {
        var body = {};
        const response = yield call(queryAccountList, body);
        yield put({
          type: 'accountListCallback',
          payload: response.data,
          errCode: response.errCode,
        });        
      }
    },
    *editAccount({ payload }, { call, put }) {
      const response = yield call(editAccount, payload);
      if (response.errCode === 0) {
        const response = yield call(queryAccountList, payload);
        yield put({
          type: 'accountListCallback',
          payload: response.data,
          errCode: response.errCode,
        });        
      }
    },    
    *resetAccountPwd({ payload }, { call, put }) {
      var body = {
        userID: payload.userID,
      }
      const { resolve, reject } = payload;
      const response = yield call(resetAccountPwd, body);
      if (response.errCode === 0) {
        resolve(response.data.userPwd);     
      } else {
        reject(response);
      }
    },
    *getRoleList({ payload }, { call, put }) {
      const { resolve, reject } = payload;      
      const response = yield call(queryRoleList, payload);
      if(response.errCode === 0) {
        if (resolve) {
          resolve(response.data);
        }
      } else {
        if(reject) {
          reject(response.errMsg);
        }
      }      
    }
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
      payload = formatMockData(payload);      
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
      payload = formatMockData(payload);      
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
    accountListCallback(state, { payload, errCode }) {
      payload = formatMockData(payload);
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
