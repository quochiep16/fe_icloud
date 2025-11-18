import http from './http';

export async function checkout(data) {
  const res = await http.post('/orders/checkout', data);
  return res.data;
}

export async function getMyOrders() {
  const res = await http.get('/orders/me');
  return res.data;
}

export async function getMyOrderDetail(id) {
  const res = await http.get(`/orders/me/${id}`);
  return res.data;
}

export async function getAllOrders() {
  const res = await http.get('/orders');
  return res.data;
}

export async function updateOrderStatus(id, status) {
  const res = await http.patch(`/orders/${id}/status`, { status });
  return res.data;
}

export async function getOrderDetailAdmin(id) {
  const res = await http.get(`/orders/${id}`);
  return res.data;
}
