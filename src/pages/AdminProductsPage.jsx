// src/pages/AdminProductsPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/products';
import { BACKEND_URL } from '../api/http';

const shortDesc = (text) => {
  if (!text) return '';
  return text.length > 80 ? text.slice(0, 80) + '...' : text;
};

const buildImageUrl = (relativePath) => {
  if (!relativePath) return '';
  return `${BACKEND_URL.replace(/\/+$/, '')}${relativePath}`;
};

export default function AdminProductsPage({ user }) {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="page-shell">
        <div className="card">
          <p>Bạn không có quyền truy cập trang này</p>
        </div>
      </div>
    );
  }

  const fetchProducts = async () => {
    setLoading(true);
    setMsg('');
    setError('');
    try {
      const data = await getProducts(search);
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('Không tải được danh sách sản phẩm');
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

  const handleDelete = async (id) => {
    const ok = window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này?');
    if (!ok) return;

    try {
      await deleteProduct(id);
      setMsg('Đã xoá sản phẩm (soft delete)');
      fetchProducts();
    } catch (err) {
      console.error(err);
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || 'Xoá sản phẩm thất bại');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/${id}/edit`);
  };

  return (
    <div className="page-shell">
      <div className="card">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Admin · Sản phẩm</p>
            <h2 className="page-title">Quản lý sản phẩm</h2>
            <p className="page-description">
              Xem, tìm kiếm và chỉnh sửa danh sách sản phẩm đang bán trên hệ thống.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/admin/products/new')}
          >
            + Thêm sản phẩm
          </button>
        </div>

        <form onSubmit={handleSearch} className="toolbar mt-12">
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
        {error && <div className="alert alert-error mt-8">{error}</div>}

        {loading ? (
          <p className="mt-16">Đang tải...</p>
        ) : (
          <>
            <p className="table-caption">
              Tổng: <b>{products.length}</b> sản phẩm
            </p>
            <div className="product-grid mt-12">
              {products.map((p) => (
                <div key={p.id} className="card card-product-admin">
                  {/* Nội dung phía trên */}
                  <div className="card-product-main">
                    {p.imageUrl && (
                      <img
                        src={buildImageUrl(p.imageUrl)}
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

                    <p style={{ fontSize: 13, color: '#4b5563' }}>
                      Còn {p.stock} sản phẩm trong kho
                    </p>
                  </div>

                  {/* Hàng nút đáy card */}
                  <div className="card-product-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(p.id)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(p.id)}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p>Không có sản phẩm nào</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
