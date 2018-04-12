import { stringify } from 'qs';
import request from '../utils/request';

export async function queryImportHistory(params) {
  return request('/admin/device/queryImportHistory', {
    method: 'GET',
    body: params,
  });
}

export async function importDevice(params) {
  return request('/admin/device/importDevices', {
	method: 'POST',
	body: params,
  });
}
