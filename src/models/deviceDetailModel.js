import { listRentUsers, listBoundUsers } from '../services/deviceDetailApi';

export default {
  namespace: 'deviceDetailModel',

  state: {
    rentUsers: [],
    bindUsers: [],
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