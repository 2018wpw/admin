import { listAlarmRecords, query, list, create, edit } from '../services/warning';

export default {
  namespace: 'warning',

  state: {
    
  },

  effects: {
    *listAlarmRecords({ payload }, { call, put }) {
      const response = yield call(listAlarmRecords, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listAlarmRecordsCb',
          payload: response.data,
        });
      }
    },
    *query({ payload }, { call, put }) {
      const response = yield call(query, payload);
      if (response.errCode === 0) {
        const response = yield call(query, payload);        
        yield put({
          type: 'listAlarmRecordsCb',
          payload: response.data,
        });
      }      
    },
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listAlarmRecordsCb',
          payload: response.data,
        });
      }
    },
    *create({ payload }, { call, put }) {
      const response = yield call(create, payload);
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(edit, payload);
    },        
  },

  reducers: {
    listAlarmRecordsCb(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};