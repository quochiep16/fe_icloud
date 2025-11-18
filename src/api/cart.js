import http from './http';

export async function getCart() {
  const res = await http.get('/cart');
  return res.data;
}

export async function addToCart(productId, quantity) {
  const res = await http.post('/cart', { productId, quantity });
  return res.data;
}

export async function updateCartItem(id, data) {
  const res = await http.patch(`/cart/${id}`, data);
  return res.data;
}

export async function deleteCartItem(id) {
  const res = await http.delete(`/cart/${id}`);
  return res.data;
}
