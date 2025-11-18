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
