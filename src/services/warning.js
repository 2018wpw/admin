import { stringify } from 'qs';
import request from '../utils/request';

export async function listAlarmRecords(params) {
  return request('/admin/alarm/listAlarmRecords', {
    method: 'GET',
    body: params,
  });
}

export async function query(params) {
  return request('/admin/alarm/query', {
    method: 'GET',
    body: params,
  });
}

export async function list(params) {
  return request('/admin/alarm/list', {
    method: 'GET',
    body: params,
  });
}

export async function create(params) {
  return request('/admin/alarm/create', {
    method: 'POST',
    body: params,
  });
}

export async function edit(params) {
  return request('/admin/strainer/edit', {
    method: 'POST',
    body: params,
  });
}
