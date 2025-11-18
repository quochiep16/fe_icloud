import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../api/products';
import { addToCart } from '../api/cart';

const shortDesc = (text) => {
  if (!text) return '';
  return text.length > 80 ? text.slice(0, 80) + '...' : text;
};

export default function ProductsPage({ user }) {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(search);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAddToCart = async (product) => {
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

  return (
    <div>
      <div className="card">
        <div className="flex justify-between items-center">
          <h2 className="page-title">Danh sách sản phẩm</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-8 mt-12">
          <input
            className="input"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            Tìm kiếm
          </button>
        </form>

        {msg && <div className="alert alert-success mt-8">{msg}</div>}

        {loading ? (
          <p className="mt-16">Đang tải...</p>
        ) : (
          <div className="product-grid mt-16">
            {products.map((p) => {
              const outOfStock = p.stock <= 0;
              return (
                <div key={p.id} className="card">
                  {p.imageUrl && (
                    <img
                      src={`http://localhost:3000${p.imageUrl}`}
                      alt={p.name}
                      className="product-card-img"
                    />
                  )}

                  <h4 className="product-name">
                    <Link
                      to={`/products/${p.id}`}
                      style={{ textDecoration: 'none', color: '#111827' }}
                    >
                      {p.name}
                    </Link>
                  </h4>

                  <p
                    style={{
                      fontSize: 13,
                      color: '#4b5563',
                      marginBottom: 4,
                      minHeight: 36,
                    }}
                  >
                    {shortDesc(p.description)}
                  </p>

                  <p className="product-price">
                    {Number(p.price).toLocaleString()} đ
                  </p>

                  <p style={{ fontSize: 13, color: outOfStock ? '#b91c1c' : '#4b5563' }}>
                    {outOfStock
                      ? 'Hết hàng'
                      : `Còn ${p.stock} sản phẩm trong kho`}
                  </p>

                  <button
                    className="btn btn-primary mt-8"
                    onClick={() => handleAddToCart(p)}
                    disabled={outOfStock}
                    style={outOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    {outOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </button>
                </div>
              );
            })}
            {products.length === 0 && <p>Không có sản phẩm nào</p>}
          </div>
        )}
      </div>
    </div>
  );
}
