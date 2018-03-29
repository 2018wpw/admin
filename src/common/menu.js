import { isUrl } from '../utils/utils';

const menuData = [{
  name: '概况',
  path: 'general',
}, {
  name: '设备管理',
  path: 'devices',
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
  }],
}, {
  name: '账户管理',
  path: 'account',
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
  children: [{
    name: '分润模式',
    path: 'profit-mode',
  }, {
    name: '租赁关系',
    path: 'rent-relate',
  },, {
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
  name: '列表页',
  icon: 'table',
  path: 'list',
  children: [{
    name: '查询表格',
    path: 'table-list',
  }, {
    name: '标准列表',
    path: 'basic-list',
  }, {
    name: '卡片列表',
    path: 'card-list',
  }, {
    name: '搜索列表',
    path: 'search',
    children: [{
      name: '搜索列表（文章）',
      path: 'articles',
    }, {
      name: '搜索列表（项目）',
      path: 'projects',
    }, {
      name: '搜索列表（应用）',
      path: 'applications',
    }],
  }],
}, {
  name: '详情页',
  icon: 'profile',
  path: 'profile',
  children: [{
    name: '基础详情页',
    path: 'basic',
  }, {
    name: '高级详情页',
    path: 'advanced',
    authority: 'admin',
  }],
}, {
  name: '结果页',
  icon: 'check-circle-o',
  path: 'result',
  children: [{
    name: '成功',
    path: 'success',
  }, {
    name: '失败',
    path: 'fail',
  }],
}, {
  name: '异常页',
  icon: 'warning',
  path: 'exception',
  children: [{
    name: '403',
    path: '403',
  }, {
    name: '404',
    path: '404',
  }, {
    name: '500',
    path: '500',
  }, {
    name: '触发异常',
    path: 'trigger',
    hideInMenu: true,
  }],
}, {
  name: '账户',
  icon: 'user',
  path: 'user',
  authority: 'guest',
  children: [{
    name: '登录',
    path: 'login',
  }, {
    name: '注册',
    path: 'register',
  }, {
    name: '注册结果',
    path: 'register-result',
  }],
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
