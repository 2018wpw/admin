import { stringify } from 'qs';
import request from '../utils/request';

export async function editUserInfo(params) {
  return request('/admin/user/editUserInfo', {
    method: 'POST',
    body: params,
  });	
}

export async function editBankInfo(params) {
  return request('/admin/user/editBankInfo', {
    method: 'POST',
    body: params,
  });	
}

export async function queryUserInfo(params) {
  return request('/admin/user/query', {
    method: 'GET',
    body: params,
  });	
}