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
      // nếu BE trả message cụ thể, có thể đọc: err.response?.data?.message
      setError('Đăng ký thất bại. Hãy kiểm tra lại thông tin (email trùng, mật khẩu < 7 kí tự, ...).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '32px auto' }}>
      <div className="card">
        <h2 className="page-title">Đăng ký tài khoản</h2>
        <p style={{ fontSize: 14, color: '#4b5563' }}>
          Tạo tài khoản mới để mua sắm và quản lý đơn hàng dễ dàng hơn.
        </p>

        {msg && <div className="alert alert-success mt-12">{msg}</div>}
        {error && <div className="alert alert-error mt-12">{error}</div>}

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
            className="btn btn-primary mt-12"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <p style={{ marginTop: 12, fontSize: 13, color: '#6b7280' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#2563eb' }}>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
