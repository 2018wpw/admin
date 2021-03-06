import { 
  listRent,
  listProfitMode,
  listWithdrawRecords, 
  listRentOrders, 
  queryRentIncome, 
  withdraw,
  createProfitMode,
  deleteProfitMode,
  editProfitMode,
  createRent,
  deleteRent,
  editRent,
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
    *getProfitList({ payload }, { call, put }) {
      const { resolve, reject } = payload;
      const response = yield call(listProfitMode, payload);
      if(response.errCode === 0) {
        if (resolve) {
          resolve(response);
        }
      } else {
        if(reject) {
          reject(response.errMsg);
        }
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
    *createRent({ payload }, { call, put }) {
      const response = yield call(createRent, payload);
      if (response.errCode === 0) {
        const response = yield call(listRent, payload);
        yield put({
          type: 'listRentCB',
          payload: response,
        });
      }
    },    
    *createProfitMode({ payload }, { call, put }) {
      const response = yield call(createProfitMode, payload);
      if (response.errCode === 0) {
        const response = yield call(listProfitMode, payload);
        yield put({
          type: 'listRentCB',
          payload: response,
        });
      }
    },
    *editProfitMode({ payload }, { call, put }) {
      const response = yield call(editProfitMode, payload);
      if (response.errCode === 0) {
        const response = yield call(listProfitMode, payload);
        yield put({
          type: 'listRentCB',
          payload: response,
        });
      }
    },    
    *deleteProfitMode({ payload }, { call, put }) {
      var body = {
        profitID: payload.profitID,
      };
      const { resolve, reject } = payload;          
      const response = yield call(deleteProfitMode, body);
      if (response.errCode === 0) {
        resolve();
        const response = yield call(listProfitMode, payload);
        yield put({
          type: 'listRentCB',
          payload: response.data,
        });        
      } else {
        reject(response.errCode);
      }
    },
    *editRent({ payload }, { call, put }) {
      const response = yield call(editRent, payload);
      if (response.errCode === 0) {
        const response = yield call(listRent, payload);
        yield put({
          type: 'listRentCB',
          payload: response,
        });
      }
    },     
    *deleteRent({ payload }, { call, put }) {
      var body = {
        id: payload.profitID,
      };
      const { resolve, reject } = payload;          
      const response = yield call(deleteRent, body);
      if (response.errCode === 0) {
        resolve();
        const response = yield call(listRent, payload);
        yield put({
          type: 'listRentCB',
          payload: response.data,
        });        
      } else {
        reject(response.errCode);
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