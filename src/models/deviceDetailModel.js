import { listRentUsers, listBoundUsers, list } from '../services/deviceDetailApi';

export default {
  namespace: 'deviceDetailModel',

  state: {
    rentUsers: [],
    bindUsers: [],
    basicInfo: undefined,
    deviceList: [],
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
    *getBasicInfo({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryList',
          payload: {
            basicInfo: response.data,
          },
        });
      }
    },
    *getDeviceList({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response.errCode === 0) {
        var devices = response.data.devices;
        var batchInfo = response.data.batchInfo;
        var deviceData = response.data.deviceData;
        var models = response.data.models;
        var deviceList = [];
        devices.map((item, index) => {
          deviceList.push({
            key: item.matchDeviceInfo.deviceID,
            deviceID: item.matchDeviceInfo.deviceID,
            devicecategory: models[index].prodInfo.name,
            devicetype: models[index].name,
            location:item.addrDetail,
            batch:item.batchInfo.name,
            groupName:item.groupName,
          });
        })
        yield put({
          type: 'queryList',
          payload: {
            deviceList: [...deviceList]
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
  },
};