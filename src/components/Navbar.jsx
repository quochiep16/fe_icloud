import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand">Mini Shop</span>
        <Link className="nav-link" to="/products">Sản phẩm</Link>
        <Link className="nav-link" to="/cart">Giỏ hàng</Link>
        <Link className="nav-link" to="/orders/me">Đơn hàng</Link>

        {user?.role === 'ADMIN' && (
        <>
            <Link className="nav-link" to="/admin/products/new">+ Thêm sản phẩm</Link>
            <Link className="nav-link" to="/admin/users">Quản lý user</Link>
            <Link className="nav-link" to="/admin/orders">Quản lý đơn hàng</Link>
        </>
        )}

      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span>
              {user.name}{' '}
              <span className="badge-role">{user.role}</span>
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Đăng nhập</Link>
            <Link className="nav-link" to="/register">Đăng ký</Link>
          </>
        )}
      </div>
    </header>
  );
}
