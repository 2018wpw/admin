import { quryOTAPackages, quryOTAHistory, createOTAPackage, requestOTA, uploadPackage } from '../services/upgrade';

export default {
  namespace: 'upgrade',

  state: {
    packages: [],
  },

  effects: {
    *quryOTAPackages({ payload }, { call, put }) {
      const response = yield call(quryOTAPackages, payload);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },    
    *quryOTAHistory({ payload }, { call, put }) {
      const response = yield call(quryOTAHistory, payload);
      yield put({
        type: 'queryListHistory',
        payload: response.data,
      });
    },      
    *createOTAPackage({ payload }, { call, put }) {
      const response = yield call(createOTAPackage, payload);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    *uploadPackage({ payload }, { call, put }) {
      var response = yield call(uploadPackage, payload);    

    },
    *requestOTA({ payload }, { call, put }) {
      const response = yield call(requestOTA, payload);
      yield put({
        type: 'appendList',
        payload: response.data,
      });
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    queryListHistory(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
