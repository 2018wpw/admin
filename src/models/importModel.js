import { queryImportHistory, importDevice } from '../services/import';

export default {
  namespace: 'importModel',

  state: {
    
  },

  effects: {
    *queryImportHistory({ payload }, { call, put }) {
      const response = yield call(queryImportHistory, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryListHistory',
          payload: response.data,
        });
      }
    }, 
    *importDevice({ payload }, { call, put }) {
      const { resolve, reject } = payload;
      const response = yield call(importDevice, payload.formData);
      if (response.errCode === 0) {
        resolve(response.data);
      } else {
        reject(response.errMsg);
      }
      if (response.errCode === 0) {
        var resp = yield call(queryImportHistory, payload);
        if (resp.errCode === 0) {
          yield put({
            type: 'queryListHistory',
            payload: response.data,
          });
        }
      }
    },        
  },

  reducers: {
    queryListHistory(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};