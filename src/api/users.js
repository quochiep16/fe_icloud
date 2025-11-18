import http from './http';

export async function getUsers() {
  const res = await http.get('/users'); // chỉ ADMIN gọi được
  return res.data;
}

export async function updateUser(id, data) {
  const res = await http.patch(`/users/${id}`, data);
  return res.data;
}

export async function deleteUser(id) {
  const res = await http.delete(`/users/${id}`);
  return res.data;
}
