import { queryStrainerList, resetStrainer } from '../services/strainer';

export default {
  namespace: 'strainer',

  state: {
    
  },

  effects: {
    *queryStrainerList({ payload }, { call, put }) {
      const response = yield call(queryStrainerList, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryStrainerListCb',
          payload: response.data,
        });
      }
    },
    *resetStrainer({ payload }, { call, put }) {
      const response = yield call(resetStrainer, payload);
      if (response.errCode === 0) {
        const response = yield call(queryStrainerList, payload);        
        yield put({
          type: 'queryStrainerListCb',
          payload: response.data,
        });
      }      
    },    
  },

  reducers: {
    queryStrainerListCb(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};