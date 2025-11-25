import http from './http';

export async function getProducts(search) {
  const res = await http.get('/products', {
    params: search ? { search } : {},
  });
  return res.data;
}

export async function getProductDetail(id) {
  const res = await http.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(formData) {
  const res = await http.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// 👇 NEW: cập nhật sản phẩm (PATCH /products/:id)
export async function updateProduct(id, formData) {
  const res = await http.patch(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// 👇 NEW: xoá (soft delete) sản phẩm (DELETE /products/:id)
export async function deleteProduct(id) {
  const res = await http.delete(`/products/${id}`);
  return res.data;
}
