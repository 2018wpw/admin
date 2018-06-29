import { stringify } from 'qs';
import request from '../utils/request';

export async function getIssueList(params) {
  return request('/admin/feedback/listIssue', {
    method: 'GET',
    body: params,
  });
}

export async function getCategory(params) {
  return request('/admin/feedback/queryCategory', {
    method: 'GET',
    body: params,
  });
}

export async function getCategoryList(params) {
  return request('/admin/feedback/listCategory', {
    method: 'GET',
    body: params,
  });
}

export async function editCategory(params) {
  return request('/admin/feedback/editCategory', {
    method: 'POST',
    body: params,
  });
}

export async function createCategory(params) {
  return request('/admin/feedback/createCategory', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCategory(params) {
  return request('/admin/feedback/deleteCategory', {
    method: 'POST',
    body: params,
  });
}

export async function processIssue(params) {
  return request('/admin/feedback/processIssue', {
    method: 'POST',
    body: params,
  });
}