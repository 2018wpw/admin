import { stringify } from 'qs';
import request from '../utils/request';

export async function createProfitMode(params) {
  return request('/admin/rent/createProfitMode', {
    method: 'POST',
    body: params,
  });
}

export async function createRent(params) {
  return request('/admin/rent/createRent', {
    method: 'POST',
    body: params,
  });
}

export async function withdraw(params) {
  return request('/admin/rent/withdraw', {
    method: 'POST',
    body: params,
  });
}

export async function editProfitMode(params) {
  return request('/admin/rent/editProfitMode', {
    method: 'POST',
    body: params,
  });
}

export async function editRent(params) {
  return request('/admin/rent/editRent', {
    method: 'POST',
    body: params,
  });
}

export async function queryProfitMode(params) {
  return request('/admin/rent/queryProfitMode', {
    method: 'GET',
    body: params,
  });
}

export async function listProfitMode(params) {
  return request('/admin/rent/listProfitMode', {
    method: 'GET',
    body: params,
  });
}

export async function listWithdrawRecords(params) {
  return request('/admin/rent/listWithdrawRecords', {
    method: 'GET',
    body: params,
  });
}

export async function queryRent(params) {
  return request('/admin/rent/queryRent', {
    method: 'GET',
    body: params,
  });
}

export async function listRent(params) {
  return request('/admin/rent/listRent', {
    method: 'GET',
    body: params,
  });
}


export async function queryRentIncome(params) {
  return request('/admin/rent/queryRentIncome', {
    method: 'GET',
    body: params,
  });
}


export async function listRentOrders(params) {
  return request('/admin/rent/listRentOrders', {
    method: 'GET',
    body: params,
  });
}


export async function checkProfit(params) {
  return request('/admin/rent/checkProfit', {
    method: 'GET',
    body: params,
  });
}


export async function checkRent(params) {
  return request('/admin/rent/checkRent', {
    method: 'GET',
    body: params,
  });
}
