
import request from '../utils/request';

export async function getChinaAddr(params) {
  return request('/common/district/list?addrCode=5737807872&subdistrict=3', {
    method: 'GET',
    body: params,
  });
}

const uploadFileUrl = 'http://60.205.205.82/mockjs/2/common/file/upload';

export { uploadFileUrl };