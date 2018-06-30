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
    strainerStatis: [],
    accountLinearStatis: [],
    deviceWorkStatis: [],
    deviceStatis: [],
    accountStatis: [],
  },

  effects: {
    *getStrainerLinearStatistics({ payload }, { call, put }) {
      const response = yield call(getStrainerLinearStatistics, payload);
      console.log('getStrainerLinearStatistics', response);
      if (response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: {
            strainerStatis: response.data[0].strainerStatis,
          },
        });
      }
    },
    *getAccountLinearStatistics({ payload }, { call, put }) {
      const response = yield call(getAccountLinearStatistics, payload);
      console.log('getAccountLinearStatistics', response);      
      if (response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: {
            accountLinearStatis: response.data,
          },
        });
      }
    },
    *getDeviceWorkLinearStatistics({ payload }, { call, put }) {
      const response = yield call(getDeviceWorkLinearStatistics, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: {
            deviceWorkStatis: response.data,
          },
        });
      }
    },
    *getDeviceStatistics({ payload }, { call, put }) {
      const response = yield call(getDeviceStatistics, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: {
            deviceStatis: response.data,
          },
        });
      }
    },
    *getAccountStatistics({ payload }, { call, put }) {
      const response = yield call(getAccountStatistics, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: {
            accountStatis: response.data,
          },
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
