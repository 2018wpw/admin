const baseUrl = 'http://60.205.205.82/mockjsdata/1/';
const baseUrl2 = 'http://60.205.205.82/mockjsdata/2/';

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
  'POST /admin/role/delete': baseUrl,

  'GET /admin/user/listUsers': baseUrl,
  'POST /admin/user/listAccounts': baseUrl,
  'POST /admin/user/createAccount': baseUrl,
  'POST /admin/user/resetAccountPassword': baseUrl,

  //设备
  //升级
  'POST /admin/ota/createOTAPackage': baseUrl,
  'POST /admin/ota/deleteOTAPackage': baseUrl,  
  'POST /admin/ota/requestOTA': baseUrl,
  'GET /admin/ota/listOTAPackages': baseUrl,
  'GET /admin/ota/listOTAHistory': baseUrl,

  //导入设备
  'GET /admin/device/importDevices': baseUrl,
  'GET /admin/device/queryImportHistory': baseUrl,
  'POST /admin/device/importDevices':baseUrl,
  
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
  'POST /admin/rent/deleteProfitMode': baseUrl,
  'POST /admin/rent/createRent': baseUrl,
  'POST /admin/rent/deleteRent': baseUrl,  
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

  //设备详情
  'GET /admin/device/listRentUsers': baseUrl,
  'GET /admin/device/listBoundUsers': baseUrl,
  'GET /admin/device/getDeviceHistoryData': baseUrl,
  'GET /admin/device/list': baseUrl,
  'GET /admin/device/queryControlResult': baseUrl,
  'POST /admin/device/control': baseUrl,
};
