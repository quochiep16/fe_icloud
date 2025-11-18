import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{ maxWidth: 400, margin: '32px auto' }}>
      <div className="card">
        <h2 className="page-title">Đăng nhập</h2>
        {error && <div className="alert alert-error mt-8">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-12">
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

          <button type="submit" className="btn btn-primary mt-8" style={{ width: '100%' }}>
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
