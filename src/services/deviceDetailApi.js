import { stringify } from 'qs';
import request from '../utils/request';

export async function listRentUsers(params) {
  return request('/admin/device/listRentUsers', {
    method: 'GET',
    body: params,
  });
}

export async function list(params) {
  var para = stringify(params);
  return request('/admin/device/list?' + para, {
    method: 'GET',
    body: params,
  });
}

export async function listBoundUsers(params) {
  return request('/admin/device/listBoundUsers', {
    method: 'GET',
    body: params,
  });
}

export async function getDeviceHistoryData(params) {
  return request('/admin/device/getDeviceHistoryData', {
    method: 'GET',
    body: params,
  });
}

export async function queryControlResult(params) {
  return request('/admin/device/queryControlResult', {
    method: 'GET',
    body: params,
  });
}

export async function control(params) {
  return request('/admin/device/control', {
    method: 'POST',
    body: params,
  });	
}