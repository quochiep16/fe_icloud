import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail } from '../api/products';
import { addToCart } from '../api/cart';

export default function ProductDetailPage({ user }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setMsg('');
    setError('');
    try {
      const data = await getProductDetail(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError('Không tải được thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      setMsg('Bạn cần đăng nhập để thêm vào giỏ hàng');
      return;
    }
    if (!product) return;

    if (product.stock <= 0) {
      setMsg('Sản phẩm đã hết hàng, không thể thêm vào giỏ');
      return;
    }

    try {
      await addToCart(product.id, 1);
      setMsg('Đã thêm vào giỏ hàng');
      setTimeout(() => setMsg(''), 1500);
    } catch (err) {
      console.error(err);
      const backendMessage = err?.response?.data?.message;
      setMsg(backendMessage || 'Thêm vào giỏ hàng thất bại');
    }
  };

  if (loading || !product) {
    return (
      <div className="card">
        {loading ? <p>Đang tải...</p> : error ? <p>{error}</p> : null}
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="card">
      <div className="flex gap-8">
        {product.imageUrl && (
          <div>
            <img
              src={`http://localhost:3000${product.imageUrl}`}
              alt={product.name}
              style={{
                width: 320,
                height: 320,
                objectFit: 'cover',
                borderRadius: 12,
              }}
            />
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h2 className="page-title">{product.name}</h2>
          <p className="product-price" style={{ fontSize: 20 }}>
            {Number(product.price).toLocaleString()} đ
          </p>

          <p style={{ fontSize: 14, marginTop: 4, color: outOfStock ? '#b91c1c' : '#4b5563' }}>
            {outOfStock
              ? 'Sản phẩm hiện đã hết hàng.'
              : `Còn ${product.stock} sản phẩm trong kho.`}
          </p>

          <div style={{ marginTop: 12 }}>
            <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Mô tả sản phẩm</h4>
            <p style={{ fontSize: 14, color: '#4b5563', whiteSpace: 'pre-line' }}>
              {product.description}
            </p>
          </div>

          {msg && <div className="alert alert-success mt-12">{msg}</div>}
          {error && <div className="alert alert-error mt-12">{error}</div>}

          <button
            className="btn btn-primary mt-12"
            onClick={handleAddToCart}
            disabled={outOfStock}
            style={outOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </button>
        </div>
      </div>
    </div>
  );
}
