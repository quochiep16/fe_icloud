import http from './http';

export async function register(data) {
  const res = await http.post('/auth/register', data);
  return res.data;
}

export async function login(data) {
  const res = await http.post('/auth/login', data);
  return res.data; // { accessToken, user }
}
