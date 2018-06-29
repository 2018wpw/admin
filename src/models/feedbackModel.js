import { getIssueList, getCategory, getCategoryList, editCategory, createCategory , deleteCategory, processIssue} from '../services/feedback';

export default {
  namespace: 'feedbackModel',

  state: {
    issueList: [],
    category: {
      "createTime": 0,
      "descr": "",
      "id": 0,
      "name": ""      
    },
    categoryList: [],
  },

  effects: {
    *getIssueList({ payload }, { call, put }) {
      const response = yield call(getIssueList, payload);
      console.log('getIssueList', response);
      if (response.errCode === 0) {
        yield put({
          type: 'listCb',
          payload: {
            issueList: response.data.issues,
          }
        });
      }
    },
    *getCategory({ payload }, { call, put }) {
      const response = yield call(getCategory, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listCb',
          payload: {
            category: response.data,
          }
        });
      }
    },
    *getCategoryList({ payload }, { call, put }) {
      const response = yield call(getCategoryList, payload);
      if (response.errCode === 0) {
        yield put({
          type: 'listCb',
          payload: {
            categoryList: response.data.categories,
          }
        });
      }
    },
    *createCategory({ payload, resolve, reject }, { call, put }) {
      console.log('createCategory');
      const response = yield call(createCategory, payload);
      if (response.errCode === 0) {
        const response = yield call(getCategoryList, payload);
        yield put({
          type: 'listCb',
          payload: {
            categoryList: response.data.categories,
          }
        });
        if (resolve) resolve();      
      } else {
        if (reject) reject(response.errCode);
      }
    },    
    *editCategory({ payload, resolve, reject }, { call, put }) {
      const response = yield call(editCategory, payload);
      if (response.errCode === 0) {
        const response = yield call(getCategoryList, payload);
        yield put({
          type: 'listCb',
          payload: {
            categoryList: response.data.categories,
          }
        });
        if (resolve) resolve();      
      } else {
        if (reject) reject(response.errCode);
      }     
    },
    *deleteCategory({ payload }, { call, put }) {    
      const response = yield call(deleteCategory, payload);
      if(response.errCode === 0) {
       
      }
    },
    *processIssue({ payload }, { call, put }) {    
      const response = yield call(processIssue, payload);
      if(response.errCode === 0) {
       
      }
    },
  },

  reducers: {
    listCb(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};