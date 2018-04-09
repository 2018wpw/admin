import { create , edit, deleteApi, list} from '../services/prod';

export default {
  namespace: 'prodModel',

  state: {
    
  },

  effects: {
    *create({ payload }, { call, put }) {
      const response = yield call(create, payload);
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(edit, payload);
    },
    *deleteApi({ payload }, { call, put }) {
      const response = yield call(deleteApi, payload);
    }, 
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
      const response = yield call(query, payload);
      if(response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: response.data,
          errCode: response.errCode,
        });         
      }
    },
    *check({ payload }, { call, put }) {
      const response = yield call(check, payload);
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
