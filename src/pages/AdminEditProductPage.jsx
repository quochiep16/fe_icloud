// src/pages/AdminEditProductPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductDetail, updateProduct } from '../api/products';
import { BACKEND_URL } from '../api/http';

export default function AdminEditProductPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="page-shell">
        <div className="card">
          <p>Bạn không có quyền truy cập trang này</p>
        </div>
      </div>
    );
  }

  const fetchProduct = async () => {
    setLoadingProduct(true);
    setError('');
    try {
      const data = await getProductDetail(id);
      setName(data.name || '');
      setDescription(data.description || '');
      setPrice(data.price != null ? String(data.price) : '');
      setStock(data.stock != null ? String(data.stock) : '');
      setCurrentImageUrl(data.imageUrl || null);
    } catch (err) {
      console.error(err);
      setError('Không tải được thông tin sản phẩm');
    } finally {
      setLoadingProduct(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file || null);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } else {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await updateProduct(id, formData);
      setMsg('Cập nhật sản phẩm thành công');
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (err) {
      console.error(err);
      setError('Cập nhật sản phẩm thất bại. Hãy kiểm tra lại dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="page-shell">
        <div className="card">
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="card">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Admin · Sản phẩm</p>
            <h2 className="page-title">Chỉnh sửa sản phẩm</h2>
            <p className="page-description">
              Cập nhật thông tin, giá, tồn kho và hình ảnh cho sản phẩm.
            </p>
          </div>
          <span className="badge-role">ADMIN</span>
        </div>

        <p className="page-note">
          Chỉ có tài khoản <b>ADMIN</b> mới có thể chỉnh sửa sản phẩm.
        </p>

        {msg && <div className="alert alert-success mt-12">{msg}</div>}
        {error && <div className="alert alert-error mt-12">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-16">
          <div className="form-section">
            <h3 className="form-section-title">Thông tin cơ bản</h3>
            <p className="form-section-subtitle">
              Đặt lại tên và mô tả nếu cần thiết.
            </p>

            <div className="form-group">
              <label className="form-label">Tên sản phẩm</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Áo thun trắng"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea
                className="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn gọn về sản phẩm..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Giá, tồn kho & hình ảnh</h3>
            <p className="form-section-subtitle">
              Chỉnh sửa giá, số lượng trong kho và thay ảnh mới nếu cần.
            </p>

            <div className="flex gap-8">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Giá (đ)</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Tồn kho</label>
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ảnh sản phẩm</label>

              <div className="upload-area">
                {currentImageUrl && !previewUrl && (
                  <div style={{ marginBottom: 8 }}>
                    <p style={{ fontSize: 12, marginBottom: 4 }}>
                      Ảnh hiện tại:
                    </p>
                    <img
                      src={`${BACKEND_URL.replace(/\/+$/, '')}${currentImageUrl}`}
                      alt={name}
                      style={{
                        width: '100%',
                        maxHeight: 220,
                        objectFit: 'cover',
                        borderRadius: 12,
                      }}
                    />
                  </div>
                )}

                {previewUrl && (
                  <div className="upload-preview">
                    <p style={{ fontSize: 12, marginBottom: 4 }}>
                      Ảnh mới sẽ lưu:
                    </p>
                    <img src={previewUrl} alt={name || 'Preview'} />
                  </div>
                )}

                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small style={{ fontSize: 12, color: '#6b7280' }}>
                  Nếu không chọn ảnh mới, hệ thống sẽ giữ nguyên ảnh cũ.
                </small>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-12"
            disabled={loading}
          >
            {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  );
}
