// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem('token');
}

export function setAuthority(data) {
  localStorage.setItem('token', data.token);
  return localStorage.setItem('userName', data.userInfo.name);
}

export function clearAuthority() {
	localStorage.setItem('token', '');
	localStorage.setItem('userName', '');
}

export function getUserName() {
	return localStorage.getItem('userName');
}

export function getUser() {
	const user = {
		name: localStorage.getItem('userName'),
		//TODO
		avatar: 'https://www.baidu.com/img/baidu_jgylogo3.gif'
	}
	return user;
}

export function getToken() {
  return localStorage.getItem('token');
}


function formatAddr(data) {
  const array= [];
  data.map((item, index) => {
	var label;
	if (item.depth === 2) {
	  label = item.lev1;
	} else if (item.depth === 3) {
	  label = item.lev2;
	} else if (item.depth === 4) {
      label = item.lev3;
	}

	if (item.districts) {
		array.push({
		  "label":label,
	      "value":item.addrCode,
	      "children": formatAddr(item.districts),
		});
	} else {
		array.push({
		  "label":label,
	      "value":item.addrCode,
		});
	}
  });
  return array;
}

export function saveChinaAddr(data) {
  var json = formatAddr(data);
  localStorage.setItem('china', JSON.stringify(json));
}

export function getChinaAddr() {
  var str = localStorage.getItem('china');
  return JSON.parse(str);
}