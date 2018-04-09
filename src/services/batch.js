import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request('/admin/batch/query', {
    method: 'GET',
    body: params,
  });
}

export async function list(params) {
  return request('/admin/batch/list', {
    method: 'GET',
    body: params,
  });
}

export async function check(params) {
  return request('/admin/batch/check', {
    method: 'GET',
    body: params,
  });
}

export async function edit(params) {
  return request('/admin/batch/edit', {
    method: 'POST',
    body: params,
  });
}

export async function deleteApi(params) {
  return request('/admin/batch/delete', {
    method: 'POST',
    body: params,
  });
}

export async function create(params) {
  return request('/admin/batch/create', {
    method: 'POST',
    body: params,
  });
}