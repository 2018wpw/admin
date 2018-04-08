import
{ getStrainerLinearStatistics,
 getAccountLinearStatistics, 
 getDeviceWorkLinearStatistics, 
 getDeviceStatistics, 
 getAccountStatistics
} from '../services/general';

export default {
  namespace: 'general',

  state: {
    list: [],
  },

  effects: {
    *getStrainerLinearStatistics({ payload }, { call, put }) {
      const response = yield call(getStrainerLinearStatistics, payload);
      console.log('getStrainerLinearStatistics', response);
      if (response.errCode === 0) {
        yield put({
          type: 'getStrainerLinearStatisticsCb',
          payload: response.data,
        });
      }
    },
    *getAccountLinearStatistics({ payload }, { call, put }) {
      const response = yield call(getAccountLinearStatistics, payload);
      console.log('getAccountLinearStatistics', response);      
      if (response.errCode === 0) {
        yield put({
          type: 'queryListHistory',
          payload: response.data,
        });
      }
    },
    *getDeviceWorkLinearStatistics({ payload }, { call, put }) {
      const response = yield call(getDeviceWorkLinearStatistics, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryListHistory',
          payload: response.data,
        });
      }
    },
    *getDeviceStatistics({ payload }, { call, put }) {
      const response = yield call(getDeviceStatistics, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryListHistory',
          payload: response.data,
        });
      }
    },
    *getAccountStatistics({ payload }, { call, put }) {
      const response = yield call(getAccountStatistics, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryListHistory',
          payload: response.data,
        });
      }
    },     
  },

  reducers: {
    getStrainerLinearStatisticsCb(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getAccountLinearStatisticsCb(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getDeviceWorkLinearStatisticsCb(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getDeviceStatisticsCb(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    getAccountStatisticsCb(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },                
  },
};
