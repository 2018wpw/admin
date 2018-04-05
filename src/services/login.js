import { stringify } from 'qs';
import request from '../utils/request';

export async function login(params) {
  return request('/admin/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function logout() {
  return request('/admin/user/logout', {
    method: 'POST',
  });
}

export async function sendCapatch() {
	return request('/common/verifiedCode/send', {
		method: 'POST',
	});
}

export async function verifyCapatch() {
	return request('/common/verifiedCode/verify', {
		method: 'POST',
	});
}

export async function resetPwd(params) {
  return request('/admin/user/resetPassword', {
    method: 'POST',
    body: params,
  });	
}