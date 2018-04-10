import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

const baseUrl = 'http://60.205.205.82/mockjsdata/1/';
const baseUrl2 = 'http://60.205.205.82/mockjsdata/2/';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if(password === '888888' && userName === 'admin'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin'
      });
      return ;
    }
    if(password === '123456' && userName === 'user'){
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user'
      });
      return ;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest'
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'POST /api/login/captcha': (req, res) => {
    res.send({ status: 'ok' });
  },
  'POST /api/login/verify': (req, res) => {
    res.send({ status: 'ok' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      "timestamp": 1513932555104,
      "status": 500,
      "error": "error",
      "message": "error",
      "path": "/base/category/list"
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      "timestamp": 1513932643431,
      "status": 404,
      "error": "Not Found",
      "message": "No message available",
      "path": "/base/category/list/2121212"
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      "timestamp": 1513932555104,
      "status": 403,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      "timestamp": 1513932555104,
      "status": 401,
      "error": "Unauthorized",
      "message": "Unauthorized",
      "path": "/base/category/list"
    });
  },
};

//登录信息
export default {
  'POST /common/file/upload': baseUrl2,

  // Forward 到另一个服务器
  'POST /admin/user/login': baseUrl,
  'POST /admin/user/logout': baseUrl,
  'POST /admin/user/resetPassword': baseUrl,
  'POST /common/verifiedCode/send': baseUrl2,
  'POST /common/verifiedCode/verify': baseUrl2,
  // ....

  'POST /admin/user/editUserInfo': baseUrl,
  'POST /admin/user/editBankInfo': baseUrl,
  'GET /admin/user/query': baseUrl,

  'GET /admin/role/list': baseUrl,
  'POST /admin/role/create': baseUrl,
  'POST /admin/role/edit': baseUrl,

  'GET /admin/user/listUsers': baseUrl,
  'POST /admin/user/listAccounts': baseUrl,
  'POST /admin/user/createAccount': baseUrl,
  'POST /admin/user/resetAccountPassword': baseUrl,

  //设备
  //升级
  'POST /admin/ota/createOTAPackage': baseUrl,
  'POST /admin/ota/requestOTA': baseUrl,
  'GET /admin/ota/listOTAPackages': baseUrl,
  'GET /admin/ota/listOTAHistory': baseUrl,

  //导入设备
  'GET /admin/device/importDevices': baseUrl,
  'GET /admin/device/queryImportHistory': baseUrl,
  
  //概况
  'GET /admin/statis/getStrainerLinearStatistics': baseUrl,
  'GET /admin/statis/getAccountLinearStatistics': baseUrl,
  'GET /admin/statis/getDeviceWorkLinearStatistics': baseUrl,
  'GET /admin/statis/getDeviceStatistics': baseUrl,
  'GET /admin/statis/getAccountStatistics': baseUrl,
  

  //群组
  'GET /admin/group/list': baseUrl,
  'POST /admin/group/create': baseUrl,
  'POST /admin/group/removeDevices': baseUrl,
  'POST /admin/group/assign': baseUrl,
  'POST /admin/group/addDevices': baseUrl,
  'POST /admin/group/exitRent': baseUrl,

  //滤网管理
  'GET /admin/strainer/list': baseUrl,
  'POST /admin/strainer/reset': baseUrl,

  //告警管理
  'GET /admin/alarm/listAlarmRecords': baseUrl,
  'GET /admin/alarm/query': baseUrl,
  'POST /admin/alarm/create': baseUrl,
  'GET /admin/alarm/list': baseUrl,
  'POST /admin/alarm/edit': baseUrl,
  'POST /admin/alarm/delete': baseUrl,

  //租赁管理
  'POST /admin/rent/createProfitMode': baseUrl,
  'POST /admin/rent/createRent': baseUrl,
  'POST /admin/rent/withdraw': baseUrl,
  'POST /admin/rent/editProfitMode': baseUrl,
  'POST /admin/rent/editRent': baseUrl,
  'GET /admin/rent/queryProfitMode': baseUrl,
  'GET /admin/rent/listProfitMode': baseUrl,
  'GET /admin/rent/listWithdrawRecords': baseUrl,
  'GET /admin/rent/queryRent': baseUrl,
  'GET /admin/rent/listRent': baseUrl,
  'GET /admin/rent/queryRentIncome': baseUrl,
  'GET /admin/rent/listRentOrders': baseUrl,
  'GET /admin/rent/checkProfit': baseUrl,
  'GET /admin/rent/checkRent': baseUrl,

  //批次管理
  'POST /admin/batch/create': baseUrl,
  'POST /admin/batch/delete': baseUrl,
  'GET /admin/batch/query': baseUrl,
  'GET /admin/batch/list': baseUrl,
  'GET /admin/batch/check': baseUrl,
  'POST /admin/batch/edit': baseUrl,

  //产品型号
  'GET /admin/model/list': baseUrl,
  'GET /admin/model/check': baseUrl,
  'GET /admin/model/query': baseUrl,
  'POST /admin/model/create': baseUrl,
  'POST /admin/model/delete': baseUrl,
  'POST /admin/model/edit': baseUrl,
  //设备类型，产品类型
  'GET /admin/prod/list': baseUrl,
};
