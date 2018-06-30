import { stringify } from 'qs';
import request from '../utils/request';

export async function getStrainerLinearStatistics(params) {
  return request(`/admin/statis/getStrainerLinearStatistics?${stringify(params)}`, {
    method: 'GET',
    body: params,
  });
}

export async function getAccountLinearStatistics(params) {
  return request(`/admin/statis/getAccountLinearStatistics?${stringify(params)}`, {
    method: 'GET',
    body: params,
  });
}

export async function getDeviceWorkLinearStatistics(params) {
  return request(`/admin/statis/getDeviceWorkLinearStatistics?${stringify(params)}`, {
    method: 'GET',
    body: params,
  });
}

export async function getDeviceStatistics(params) {
  return request('/admin/statis/getDeviceStatistics', {
    method: 'GET',
    body: params,
  });
}

export async function getAccountStatistics(params) {
  return request('/admin/statis/getAccountStatistics', {
    method: 'GET',
    body: params,
  });
}