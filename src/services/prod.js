import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request('/admin/model/query', {
    method: 'GET',
    body: params,
  });
}

export async function list(params) {
  return request('/admin/model/list', {
    method: 'GET',
    body: params,
  });
}

export async function check(params) {
  return request('/admin/model/check', {
    method: 'GET',
    body: params,
  });
}

export async function edit(params) {
  return request('/admin/model/edit', {
    method: 'POST',
    body: params,
  });
}

export async function deleteApi(params) {
  return request('/admin/model/delete', {
    method: 'POST',
    body: params,
  });
}

export async function create(params) {
  return request('/admin/model/create', {
    method: 'POST',
    body: params,
  });
}

export async function getDeviceTypeList(params) {
  return request('/admin/prod/list', {
    method: 'GET',
    body: params,
  });
}