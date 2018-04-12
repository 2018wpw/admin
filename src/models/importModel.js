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
      var body = {
        batchID: payload.batchID,
        prodID: payload.prodID,
        modelID: payload.modelID,
      };
      const { resolve, reject } = payload;
      const response = yield call(importDevice, body);
      if (response.errCode === 0) {
        yield put({
          type: 'queryListHistory',
          payload: response.data,
        });
        resolve(response.data);
      } else {
        reject(response.errMsg);
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