import { stringify } from 'qs';
import request from '../utils/request';

export async function queryStrainerList(params) {
  return request('/admin/strainer/list', {
    method: 'GET',
    body: params,
  });
}

export async function resetStrainer(params) {
  return request('/admin/strainer/reset', {
    method: 'POST',
    body: params,
  });
}
