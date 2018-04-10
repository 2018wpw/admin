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

export async function deleteRole(params) {
  return request('/admin/role/delete', {
    method: 'POST',
    body: params,
  }); 
}

export async function queryUserList(params) {
  return request('/admin/user/listUsers', {
    method: 'GET',
    body: params,
  }); 
}

export async function queryAccountList(params) {
  return request('/admin/user/listAccounts', {
    method: 'POST',
    body: params,
  });   
}

export async function createAccount(params) {
  return request('/admin/user/createAccount', {
    method: 'POST',
    body: params,
  });     
}

export async function editAccount(params) {
  return request('/admin/user/editAccount', {
    method: 'POST',
    body: params,
  });     
}

export async function resetAccountPwd(params) {
  return request('/admin/user/resetAccountPassword', {
    method: 'POST',
    body: params,
  });
}