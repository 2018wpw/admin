import { stringify } from 'qs';
import request from '../utils/request';

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
  return request('/admin/group/removeDevices', {
    method: 'POST',
    body: params,
  });
}


export async function assign(params) {
  return request('/admin/group/assign', {
    method: 'POST',
    body: params,
  });
}
export async function addDevices(params) {
  return request('/admin/group/addDevices', {
    method: 'POST',
    body: params,
  });
}

