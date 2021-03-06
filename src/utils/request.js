import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import { getToken } from './authority';
import { base_url } from './utils';
import { parse } from 'json-bigint';

function addItemsToForm(form, names, obj) {
  if (obj === undefined || obj === "" || obj === null) return addItemToForm(form, names, "");

  if (
    typeof obj == "string" 
    || typeof obj == "number" 
    || obj === true 
    || obj === false
  ) return addItemToForm(form, names, obj);

  if (obj instanceof Date) return addItemToForm(form, names, obj.toJSON());

  // array or otherwise array-like
  if (obj instanceof Array) {
    return obj.forEach((v,i) => {
      names.push(`[${i}]`);
      addItemsToForm(form, names, v);
      names.pop();
    });
  }

  if (typeof obj === "object") {
    return Object.keys(obj).forEach((k)=>{
      names.push(k);
      addItemsToForm(form, names, obj[k]);
      names.pop();
    });
  }
}

function addItemToForm(form, names, value) {
  var name = encodeURIComponent(names.join('.').replace(/\.\[/g, '['));
  value = encodeURIComponent(value.toString());
  form.push(`${name}=${value}`);
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  error.response.errCode = -1;
  throw error;
}

export default function request(url, options) {
  return requestWithType(url, options, 'application/x-www-form-urlencoded;charsets=utf-8');
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function requestWithType(url, options, type) {
  const defaultOptions = {
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer'
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': type,
        ...newOptions.headers,
      };
      if (type === 'application/json') {
        newOptions.body = JSON.stringify(newOptions.body);
      } else {
        var form = [];
        addItemsToForm(form, typeof newOptions.body == 'object' ? [] : [newOptions.name || 'model'], newOptions.body);
        newOptions.body = form.join('&');
      }
    } else {
      // newOptions.body is FormData do nothing
    }
  }

    var token = 'Bearer ' + getToken();
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        Authorization: token,
        ...newOptions.headers,
      }
    } else {
      newOptions.headers = {
        Authorization: token,
        ...newOptions.headers,
      }
    }

  return fetch(base_url + url, newOptions)
    .then(checkStatus)
    .then((response) => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.text().then( text => {
        var json = parse(text);
        return json;
      });
    })
    .catch((e) => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
