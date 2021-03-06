import { isUrl } from '../utils/utils';

const menuData = [{
  name: '概况',
  path: 'general',
  authority: 'token',  
}, {
  name: '设备管理',
  path: 'devices',
  authority: 'token',
  children: [{
    name: '设备列表',
    path: 'list',
  }, {
    name: '导入设备',
    path: 'import',
  }, {
    name: '设备地图',
    path: 'map',
    // hideInMenu: true,
  }, {
    name: '批次管理',
    path: 'batch',
    // hideInMenu: true,
  }, {
    name: '产品类型',
    path: 'product',
    // hideInMenu: true,
  }, {
    name: '升级',
    path: 'upgrade',
    // hideInMenu: true,
  },],
}, {
  name: '账户管理',
  path: 'account',
  authority: 'token',
  children: [{
    name: '账号列表',
    path: 'account-list',
  }, {
    name: '角色管理',
    path: 'role-manager',
  }, {
    name: '个人信息',
    // authority: 'admin',
    path: 'personal-profile',
  }, {
    name: '用户信息列表',
    // authority: 'admin',
    path: 'user-info-list',
  }],
}, {
  name: '租赁管理',
  path: 'rent',
  authority: 'token',
  children: [{
    name: '分润模式',
    path: 'profit-mode',
  }, {
    name: '租赁关系',
    path: 'rent-relate',
  }, {
    name: '租赁详情',
    path: 'rent-detail',
  },],
}, {
  name: '告警管理',
  path: 'warning',
  children: [{
    name: '告警记录',
    path: 'warning-list',
  }, {
    name: '告警设置',
    path: 'warning-setting',
  },],
}, {
  name: '滤网管理',
  path: 'filter',
  authority: 'token',
  children: [{
    name: '滤网列表',
    path: 'filter-list',
  }],
}, {
  name: '群组管理',
  authority: 'token',
  path: 'group',
}, {
  name: '意见反馈',
  authority: 'token',
  path: 'feedback',
  children: [{
    name: '反馈列表',
    path: 'list',
  }, {
    name: '反馈类型',
    path: 'category',
  }],  
}, {
  name: '文案',
  authority: 'token',
  path: 'document',
  children: [{
    name: ' 空气文案',
    path: 'document-air',
  }, {
    name: '空气告警文案',
    path: 'document-warning',
  }, {
    name: '排名文案',
    path: 'document-order',
  }, {
    name: '支付文案',
    path: 'document-pay',
  }],
}, {
  name: 'App版本管理',
  authority: 'token',
  path: 'version',
}];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
