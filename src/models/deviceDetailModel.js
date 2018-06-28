import { listRentUsers, 
  listBoundUsers, 
  list, 
  getTimingList,
  getDevAirLevelList,
  setDevAirLevel,
  setDevSmartParas,
  getDevSmartParas } from '../services/deviceDetailApi';

export default {
  namespace: 'deviceDetailModel',

  state: {
    rentUsers: [],
    bindUsers: [],
    deviceDetailData: {
      deviceName: '',
      groupName: '',
      online: false,
      "batchInfo": {
        "id": '',
        "modelID": '',
        "name": ''
      },
      "deviceData": {
        "ch2o": 0,
        "humidity": 0,
        "pm25": 0,
        "temp": 0,
        co2: 0,
        tvoc: 0,
      },
      "deviceStatus": {
        "firstCommTime": 0,
        "lastCommTime": 0,
        "online": false,
        "powerOn": false,
        "strainerStatus": []
      },
      "matchDeviceInfo": [],
      model: {
        "connWay": 0,
        "descr": "",
        "id": 0,
        "name": "",
        "prodInfo": {
          "id": 0,
          "name": ""
        },
        "withDetector": false        
      }
    },
    deviceList: [],
    timingListData: [],
    devAirLevelListData: [],
    devSmartParasListData: [],
  },

  effects: {
    *listRentUsers({ payload }, { call, put }) {
      const response = yield call(listRentUsers, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: {
            rentUsers: response.data.users,
          },
        });
      }
    }, 
    *listBoundUsers({ payload }, { call, put }) {
      const response = yield call(listBoundUsers, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: {
            bindUsers: response.data.users,
          },
        });
      }
    },
    *getDeviceDetailInfo({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.errCode === 0) {
        var deviceDetailData = response.data.devices[0];
        var model = response.data.models[0];
        deviceDetailData.model = model;
        yield put({
          type: 'queryList',
          payload: {
            deviceDetailData: deviceDetailData,
          },
        });
      }
    },
    *getDeviceList({ payload, resolve, reject }, { call, put }) {
      const response = yield call(list, payload);
      if (response.errCode === 0) {
        var devices = response.data.devices;
        var batchInfo = response.data.batchInfo;
        var deviceData = response.data.deviceData;
        var models = response.data.models;
        var deviceList = devices || [];
        yield put({
          type: 'queryList',
          payload: {
            deviceList: [...deviceList]
          },
        });
        if (resolve) {
          resolve(response);
        }
      } else {
        if (reject) {
          reject(response.errCode);
        }
      }
    },
    *getTimingList({ payload }, { call, put }) {
      const response = yield call(getTimingList, payload);
      if ( response.errCode === 0 ) {
        yield put({
          type: 'queryList',
          payload: {
            timingListData: response.data,
          },
        });        
      }
    },
    *getDevAirLevelList({ payload }, { call, put }) {
      const response = yield call(getDevAirLevelList, payload);
      if ( response.errCode === 0 ) {
        yield put({
          type: 'queryList',
          payload: {
            devAirLevelListData: response.data,
          },
        });        
      }
    },
    *setDevAirLevel({ payload }, { call, put }) {
      const response = yield call(setDevAirLevel, payload);
      if ( response.errCode === 0 ) {
        const response = yield call(getDevAirLevelList, payload);
        if ( response.errCode === 0 ) {
          yield put({
            type: 'queryList',
            payload: {
              devAirLevelListData: response.data,
            },
          });        
        }
      }
    },
    *getDevSmartParas({ payload }, { call, put }) {
      const response = yield call(getDevSmartParas, payload);
      if ( response.errCode === 0 ) {
        yield put({
          type: 'queryList',
          payload: {
            devSmartParasListData: response.data,
          },
        });
      }
    },
    *setDevSmartParas({ payload }, { call, put }) {
      const response = yield call(setDevSmartParas, payload);
      if ( response.errCode === 0 ) {
        const response = yield call(getDevSmartParas, payload);
        if ( response.errCode === 0 ) {
          yield put({
            type: 'queryList',
            payload: {
              devSmartParasListData: response.data,
            },
          });
        }
      }
    }    
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};