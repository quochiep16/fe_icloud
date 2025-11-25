import { useEffect, useState } from 'react';
import { createProduct } from '../api/products';
import { useNavigate } from 'react-router-dom';

export default function AdminCreateProductPage({ user }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    if (!imageFile) {
      setError('Vui lòng chọn ảnh sản phẩm');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('stock', stock);
      formData.append('image', imageFile);

      await createProduct(formData);
      setMsg('Tạo sản phẩm thành công');
      setTimeout(() => navigate('/products'), 1000);
    } catch (err) {
      console.error(err);
      setError('Tạo sản phẩm thất bại. Hãy kiểm tra lại dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="card">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Admin · Sản phẩm</p>
            <h2 className="page-title">Thêm sản phẩm mới</h2>
            <p className="page-description">
              Điền thông tin chi tiết để sản phẩm hiển thị đẹp trên cửa hàng.
            </p>
          </div>
          <span className="badge-role">ADMIN</span>
        </div>

        <p className="page-note">
          Chỉ có tài khoản <b>ADMIN</b> mới có thể tạo sản phẩm.
        </p>

        {msg && <div className="alert alert-success mt-12">{msg}</div>}
        {error && <div className="alert alert-error mt-12">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-16">
          <div className="form-section">
            <h3 className="form-section-title">Thông tin cơ bản</h3>
            <p className="form-section-subtitle">
              Tên và mô tả giúp khách hiểu nhanh về sản phẩm.
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
              Thiết lập giá bán, số lượng trong kho và chọn ảnh minh hoạ.
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
                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small style={{ fontSize: 12, color: '#6b7280' }}>
                  Chấp nhận các định dạng ảnh phổ biến (JPG, PNG...), tối đa
                  ~5MB.
                </small>

                {previewUrl && (
                  <div className="upload-preview">
                    <p style={{ fontSize: 12, marginBottom: 4 }}>
                      Xem trước ảnh:
                    </p>
                    <img src={previewUrl} alt={name || 'Preview'} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-12"
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo sản phẩm'}
          </button>
        </form>
      </div>
    </div>
  );
}
