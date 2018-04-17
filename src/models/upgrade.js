import { quryOTAPackages, quryOTAHistory, createOTAPackage, requestOTA, uploadPackage, deleteOTAPackage } from '../services/upgrade';

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
      if(response.errCode === 0) {
        const response = yield call(quryOTAPackages, payload);
        yield put({
          type: 'queryList',
          payload: response.data,
        });        
      }
    },
    *deleteOTAPackage({ payload }, { call, put }) {
      var body = {
        packageID: payload.packageID,
        devices: payload.devices,
      };
      const { resolve, reject } = payload;         
      const response = yield call(deleteOTAPackage, body);
      if (response.errCode === 0) {
        resolve();
        const response = yield call(quryOTAPackages, payload);
        yield put({
          type: 'roleListCallback',
          payload: response.data,
          errCode: response.errCode,
        });        
      } else {
        reject(response.errMsg);
      }      
    },
    *uploadPackage({ payload }, { call, put }) {
      var response = yield call(uploadPackage, payload);    

    },
    *requestOTA({ payload }, { call, put }) {
      console.log('requestOTA', payload);
      const response = yield call(requestOTA, payload);
      if(response.errCode === 0) {
        const response = yield call(quryOTAHistory, payload);
        yield put({
          type: 'queryListHistory',
          payload: response.data,
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
    queryListHistory(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
