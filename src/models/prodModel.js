import { create , edit, deleteApi, list, getProdList, query } from '../services/prod';

export default {
  namespace: 'prodModel',

  state: {
    deviceTypeList: [],
    batchList: [],
  },

  effects: {
    *create({ payload }, { call, put }) {
      const response = yield call(create, payload);
      if (response.errCode === 0) {
        const response = yield call(list, payload);
        yield put({
          type: 'queryList',
          payload: response.data,
          errCode: response.errCode,
        });          
      }
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(edit, payload);
      if (response.errCode === 0) {
        const response = yield call(list, payload);
        yield put({
          type: 'queryList',
          payload: response.data,
          errCode: response.errCode,
        });          
      }
    },
    *deleteApi({ payload }, { call, put }) {
      const response = yield call(deleteApi, payload);
      if (response.errCode === 0) {
        const response = yield call(list, payload);
        yield put({
          type: 'queryList',
          payload: response.data,
          errCode: response.errCode,
        });          
      }      
    }, 
    //产品型号列表
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if(response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: response.data,
          errCode: response.errCode,
        });         
      }      
    },
    *query({ payload }, { call, put }) {
      var body = {
        modelID: payload.modelID,
      }
      const response = yield call(query, body);
      const { resolve, reject } = payload;
      if (response.errCode === 0) {
        resolve(response.data);
      } else {
        reject(reponse.errCode);
      }         
    },
    *check({ payload }, { call, put }) {
      const response = yield call(check, payload);
    },
    *getProdList ({ payload }, { call, put }) {
      const response = yield call(getProdList, payload);
      if(response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: {
            deviceTypeList: response.data,
          }
        });
      }
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
