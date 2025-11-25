import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

export default function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/products');
    } catch (err) {
      console.error(err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        {/* Bên trái: Hero / giới thiệu */}
        <div className="auth-hero">
          <div className="auth-badge">Mini Ecommerce</div>
          <h1 className="auth-title">Chào mừng trở lại 👋</h1>
          <p className="auth-subtitle">
            Đăng nhập để tiếp tục mua sắm, theo dõi đơn hàng và quản lý tài khoản của bạn.
          </p>

          <ul className="auth-feature-list">
            <li>🔐 Bảo mật tài khoản & đăng nhập nhanh chóng</li>
            <li>🛒 Lưu lịch sử mua hàng, giỏ hàng</li>
            <li>⚡ Trải nghiệm mượt mà trên mọi thiết bị</li>
          </ul>

          <div className="auth-stat">
            <span className="auth-stat-number">24/7</span>
            <span className="auth-stat-label">Hỗ trợ khách hàng</span>
          </div>
        </div>

        {/* Bên phải: Form login */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Đăng nhập</h2>
            <p>Nhập email và mật khẩu để truy cập tài khoản.</p>
          </div>

          {error && <div className="alert alert-error mt-8">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-16">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
              />
            </div>

            <div className="auth-extra-row">
              <label className="auth-remember">
                <input type="checkbox" /> <span>Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                className="auth-link-button"
                onClick={() => alert('Tính năng quên mật khẩu sẽ làm sau 😄')}
              >
                Quên mật khẩu?
              </button>
            </div>

            <button type="submit" className="btn btn-primary auth-submit">
              Đăng nhập
            </button>
          </form>

          <p className="auth-footer-text">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="auth-link">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
