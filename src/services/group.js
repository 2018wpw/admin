import { stringify } from 'qs';
import request from '../utils/request';
import { requestWithType } from '../utils/request';
// export async function query(params) {
//   return request(`/api/users?${qs.stringify(params)}`);
// }
export async function qureyList(params) {
  return request('/admin/group/list', {
    method: 'GET',
    body: params,
  });
}

export async function exitRent(params) {
  return request('/admin/group/exitRent', {
    method: 'POST',
    body: params,
  });
}

export async function create(params) {
  return request('/admin/group/create', {
    method: 'POST',
    body: params,
  });
}


export async function removeDevices(params) {
  return requestWithType('/admin/group/removeDevices', {
    method: 'POST',
    body: params,
  }, 'application/json');
}

export async function addDevices(params) {
  return requestWithType('/admin/group/addDevices', {
    method: 'POST',
    body: params,
  }, 'application/json');
}

export async function assign(params) {
  return request('/admin/group/assign', {
    method: 'POST',
    body: params,
  });
}

