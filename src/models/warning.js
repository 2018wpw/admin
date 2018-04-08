import { listAlarmRecords, query, list, create, edit ,deleteWarning} from '../services/warning';

export default {
  namespace: 'warning',

  state: {
    
  },

  effects: {
    *listAlarmRecords({ payload }, { call, put }) {
      const response = yield call(listAlarmRecords, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listCb',
          payload: response.data,
        });
      }
    },
    *query({ payload }, { call, put }) {
      var body = {
        alarmID: payload.alarmID,
      }
      const response = yield call(query, body);
      const { resolve, reject } = payload;
      if (response.errCode === 0) {
        resolve(response.data);
      } else {
        reject(reponse.errCode);
      }
    },
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listCb',
          payload: response,
        });
      }
    },
    *create({ payload }, { call, put }) {
      const response = yield call(create, payload);
      if(response.errCode === 0) {
        const response = yield call(list, payload);
        yield put({
          type: 'listCb',
          payload: response,
        });        
      }
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(edit, payload);
      if(response.errCode === 0) {
        const response = yield call(list, payload);
        yield put({
          type: 'listCb',
          payload: response,
        });        
      }      
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteWarning, payload);
      if(response.errCode === 0) {
        const response = yield call(list, payload);
        yield put({
          type: 'listCb',
          payload: response,
        });        
      }      
    },

  },

  reducers: {
    listCb(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};