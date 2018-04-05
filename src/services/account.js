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

export async function queryRoleList(params) {
  return request('/admin/role/list', {
    method: 'GET',
    body: params,
  }); 
}

export async function queryAccountTypeList(params) {
  return request('/admin/role/queryAccountTypeList', {
    method: 'GET',
    body: params,
  }); 
}

export async function queryRolePermissions(params) {
  return request('/admin/role/listPermissions', {
    method: 'GET',
    body: params,
  }); 
}

export async function checkRole(params) {
  return request('/admin/role/check', {
    method: 'GET',
    body: params,
  }); 
}

export async function editRole(params) {
  return request('/admin/role/edit', {
    method: 'POST',
    body: params,
  }); 
}

export async function createRole(params) {
  return request('/admin/role/create', {
    method: 'POST',
    body: params,
  }); 
}