import { 
  listRent,
  listProfitMode,
  listWithdrawRecords, 
  listRentOrders, 
  queryRentIncome, 
  withdraw
}
from '../services/rent';

export default {
  namespace: 'rent',

  state: {
    
  },

  effects: {
    *listRent({ payload }, { call, put }) {
      const response = yield call(listRent, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listRentCB',
          payload: response,
        });
      }
    },    
    *listProfitMode({ payload }, { call, put }) {
      const response = yield call(listProfitMode, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listRentCB',
          payload: response,
        });
      }
    },
    *listWithdrawRecords({ payload }, { call, put }) {
      const response = yield call(listWithdrawRecords, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listRentCB',
          payload: response.data,
        });
      }
    },
    *listRentOrders({ payload }, { call, put }) {
      const response = yield call(listRentOrders, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listRentCB',
          payload: response.data,
        });
      }
    },
    *queryRentIncome({ payload }, { call, put }) {
      const response = yield call(queryRentIncome, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listRentCB',
          payload: {
            rentIncome: response.data,
          }
        });
      }
    },
    *withdraw({ payload }, { call, put }) {
      var body = {
        amount: payload.amount,
        password: payload.password,
      };
      const { resolve, reject } = payload;
      const response = yield call(queryRentIncome, payload);
      if (response.errCode === 0) {
        resolve(response.errMsg);
      } else {
        reject(response.errMsg);
      }
    },
  },

  reducers: {
    listRentCB(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },  
  },
};