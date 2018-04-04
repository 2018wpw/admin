import { stringify } from 'qs';
import request from '../utils/request';

export async function login(params) {
  return request('/admin/user/login', {
    method: 'POST',
    body: params,
  });
}
