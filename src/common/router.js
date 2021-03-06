import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/general': {
      component: dynamicWrapper(app, ['general'], () => import('../routes/Main/General')),
    },
    // '/dashboard/analysis': {
    //   component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    // },
    // '/dashboard/monitor': {
    //   component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    // },
    // '/dashboard/workplace': {
    //   component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
    //   // hideInBreadcrumb: true,
    //   // name: '工作台',
    //   // authority: 'admin',
    // },
    //devices
    '/devices/list': {
      component: dynamicWrapper(app, ['deviceDetailModel', 'group', 'prodModel', 'batchModel'], () => import('../routes/devices/DeviceList')),
    },
    '/devices/list/list': {
      component: dynamicWrapper(app, ['deviceDetailModel', 'group', 'prodModel', 'batchModel', 'account'], () => import('../routes/devices/DeviceList/DeviceList')),
    },
    '/devices/list/detail': {
      component: dynamicWrapper(app, ['deviceDetailModel', 'group', 'batchModel'], () => import('../routes/devices/DeviceList/DeviceDetail')),
    },
    '/devices/product': {
      component: dynamicWrapper(app, ['prodModel'], () => import('../routes/devices/Product')),
    },
    '/devices/batch': {
      component: dynamicWrapper(app, ['batchModel', 'prodModel'], () => import('../routes/devices/Batch')),
    },
    '/devices/upgrade': {
      component: dynamicWrapper(app, ['upgrade', 'batchModel', 'prodModel'], () => import('../routes/devices/Upgrade')),
    },
    '/devices/import': {
      component: dynamicWrapper(app, ['importModel', 'prodModel', 'batchModel'], () => import('../routes/devices/Import')),
    },
    '/devices/map': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/devices/map')),
    },
    //account
    '/account/account-list': {
      component: dynamicWrapper(app, ['account'], () => import('../routes/Account/AccountList')),
    },
    '/account/user-info-list': {
      component: dynamicWrapper(app, ['account'], () => import('../routes/Account/UserInfoList')),
    },
    '/account/personal-profile': {
      component: dynamicWrapper(app, ['account'], () => import('../routes/Account/PersonalProfile')),
    },
    '/account/role-manager': {
      component: dynamicWrapper(app, ['account'], () => import('../routes/Account/RoleManager')),
    },
    '/warning/warning-list': {
      component: dynamicWrapper(app, ['warning'], () => import('../routes/Warning/WarningList')),
    },
    '/warning/warning-setting': {
      component: dynamicWrapper(app, ['warning'], () => import('../routes/Warning/WarningSetting')),
    },

    //rent
    '/rent/profit-mode': {
      component: dynamicWrapper(app, ['rent', 'account'], () => import('../routes/Rent/ProfitMode')),
    },
    '/rent/rent-relate': {
      component: dynamicWrapper(app, ['rent'], () => import('../routes/Rent/RentRelate')),
    },
    '/rent/rent-detail': {
      component: dynamicWrapper(app, ['rent'], () => import('../routes/Rent/RentDetail')),
    },

    '/filter/filter-list': {
      component: dynamicWrapper(app, ['strainer'], () => import('../routes/Filter/FilterList')),
    },

    //group
    '/group': {
      component: dynamicWrapper(app, ['group', 'prodModel'], () => import('../routes/Group/GroupManager')),
    },

    '/feedback/list': {
      component: dynamicWrapper(app, ['feedbackModel'], () => import('../routes/Feedback/FeedbackList')),
    },
    '/feedback/category': {
      component: dynamicWrapper(app, ['feedbackModel'], () => import('../routes/Feedback/FeedbackCategory')),
    },

    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
    '/user/captcha': {
      component: dynamicWrapper(app, ['captcha'], () => import('../routes/User/Captcha')),
    },
    '/user/password': {
      component: dynamicWrapper(app, ['password'], () => import('../routes/User/Password')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
