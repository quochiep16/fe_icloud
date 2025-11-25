// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail } from '../api/products';
import { addToCart } from '../api/cart';
import { BACKEND_URL } from '../api/http';

const buildImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http')
    ? url
    : `${BACKEND_URL.replace(/\/+$/, '')}${url}`;
};

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
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || 'Không tải được thông tin sản phẩm');
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
      <div className="page-shell">
        <div className="card">
          {loading ? <p>Đang tải...</p> : error ? <p>{error}</p> : null}
        </div>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="page-shell">
      <div className="card product-detail">
        <div className="product-detail-layout">
          {product.imageUrl && (
            <div className="product-detail-image-wrap">
              <img
                src={buildImageUrl(product.imageUrl)}
                alt={product.name}
                className="product-detail-img"
              />
            </div>
          )}

          <div className="product-detail-info">
            <p className="page-eyebrow">Sản phẩm</p>
            <h2 className="page-title">{product.name}</h2>

            <p className="product-price product-detail-price">
              {Number(product.price).toLocaleString()} đ
            </p>

            <div className="product-detail-meta">
              <span className={`chip ${outOfStock ? 'chip--out' : 'chip--in'}`}>
                {outOfStock
                  ? 'Hết hàng'
                  : `Còn ${product.stock} sản phẩm trong kho`}
              </span>
            </div>

            <div className="product-detail-description">
              <h4>Mô tả sản phẩm</h4>
              <p>{product.description}</p>
            </div>

            {msg && <div className="alert alert-success mt-12">{msg}</div>}
            {error && <div className="alert alert-error mt-12">{error}</div>}

            <button
              className="btn btn-primary product-detail-buy"
              onClick={handleAddToCart}
              disabled={outOfStock}
              style={outOfStock ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            >
              {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
