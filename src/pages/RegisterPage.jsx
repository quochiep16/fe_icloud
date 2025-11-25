import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password });
      setMsg('Đăng ký thành công, hãy đăng nhập.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      console.error(err);
      setError(
        'Đăng ký thất bại. Hãy kiểm tra lại thông tin (email trùng, mật khẩu < 7 kí tự, ...).'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        {/* Bên trái: giới thiệu lợi ích đăng ký */}
        <div className="auth-hero">
          <div className="auth-badge">Tạo tài khoản mới</div>
          <h1 className="auth-title">Bắt đầu hành trình mua sắm ✨</h1>
          <p className="auth-subtitle">
            Tài khoản giúp bạn lưu địa chỉ, theo dõi đơn hàng và nhận ưu đãi riêng cho thành viên.
          </p>

          <ul className="auth-feature-list">
            <li>🎁 Nhận ưu đãi & voucher độc quyền</li>
            <li>📦 Theo dõi trạng thái đơn hàng realtime</li>
            <li>❤️ Lưu sản phẩm yêu thích dễ dàng</li>
          </ul>

          <div className="auth-stat">
            <span className="auth-stat-number">+1000</span>
            <span className="auth-stat-label">Khách hàng tin dùng</span>
          </div>
        </div>

        {/* Bên phải: Form register */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Đăng ký tài khoản</h2>
            <p>Chỉ mất 1 phút để tạo tài khoản mới.</p>
          </div>

          {msg && <div className="alert alert-success mt-8">{msg}</div>}
          {error && <div className="alert alert-error mt-8">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-16">
            <div className="form-group">
              <label className="form-label">Họ tên</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 7 ký tự"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
          </form>

          <p className="auth-footer-text">
            Đã có tài khoản?{' '}
            <Link to="/login" className="auth-link">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
