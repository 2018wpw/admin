import { stringify } from 'qs';
import request from '../utils/request';

export async function createOTAPackage(params) {
  return request('/admin/ota/createOTAPackage', {
    method: 'POST',
    body: params,
  });
}

export async function requestOTA(params) {
  return request('/admin/ota/requestOTA', {
    method: 'POST',
    body: params,    
  });
}

export async function quryOTAPackages(params) {
  return request('/admin/ota/listOTAPackages', {
    method: 'GET',
    body: params,
  });	
}

export async function quryOTAHistory(params) {
  return request('/admin/ota/listOTAHistory', {
    method: 'GET',
    body: params,
  }); 
}

export async function uploadPackage(params) {
  return request('/common/file/upload', {
    method: 'POST',
    body: params,    
  });
}
