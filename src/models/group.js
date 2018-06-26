import { qureyList, assign, addDevices, create, removeDevices, exitRent} from '../services/group';

export default {
  namespace: 'group',

  state: {
    
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      console.log('qurey group List models');
      const response = yield call(qureyList, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'queryListCB',
          payload: response.data,
        });        
      }
    },
    *create({ payload }, { call, put }) {
      const response = yield call(create, payload);
      if(response.errCode === 0) {
        const response = yield call(qureyList, payload);
        yield put({
          type: 'queryList',
          payload: response.data,
        });        
      }
    },
    *removeDevices({ payload, resolve, reject }, { call, put }) {
      console.log('removeDevices');  
      var body = {
        groupID: payload.groupID,
        devices: payload.devices,
      };
      const response = yield call(removeDevices, body);
      if (response.errCode === 0) {
        resolve();
        const response = yield call(qureyList, body);
        yield put({
          type: 'queryList',
          payload: response.data,
        });
      } else {
        reject(response.errCode);
      } 
    },
    *assign({ payload }, { call, put }) {
      console.log('assign'); 
      const response = yield call(assign, payload);
      if(response.errCode === 0) {
        const response = yield call(qureyList, payload);
        yield put({
          type: 'queryList',
          payload: response.data,
        });        
      }      
    },
    *addDevices({ payload, resolve, reject }, { call, put }) {
      console.log('addDevices');  
      const response = yield call(addDevices, payload);
      if(response.errCode === 0) {
        if (resolve) {
          resolve(response);
        }        
        const response = yield call(qureyList, payload);
        yield put({
          type: 'queryList',
          payload: response.data,
        });
      } else {
        if (reject) {
          reject(response.errCode);
        }
      }
    }, 
    *exitRent({ payload }, { call, put }) {
      var body = {
        groupID: payload.groupID,
        devices: payload.devices,
      };
      const { resolve, reject } = payload;       
      const response = yield call(exitRent, body);
      if (response.errCode === 0) {
        resolve();
        const response = yield call(qureyList, body);
        yield put({
          type: 'queryList',
          payload: response.data,
        });
      } else {
        reject(response.errCode);
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
    queryListCB(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },    
  },
};
