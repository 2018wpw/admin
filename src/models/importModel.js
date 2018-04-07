import { queryImportHistory } from '../services/import';

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