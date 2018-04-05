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