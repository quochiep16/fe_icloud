import { NavLink, useNavigate } from 'react-router-dom';


export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'nav-link nav-link-active' : 'nav-link';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand">Mini Shop</span>

        <NavLink className={navLinkClass} to="/products">
          Sản phẩm
        </NavLink>

        <NavLink className={navLinkClass} to="/cart">
          Giỏ hàng
        </NavLink>

        <NavLink className={navLinkClass} to="/orders/me">
          Đơn hàng
        </NavLink>

        {user?.role === 'ADMIN' && (
          <>
            <NavLink className={navLinkClass} to="/admin/products">
              Quản lý sản phẩm
            </NavLink>

            <NavLink className={navLinkClass} to="/admin/users">
              Quản lý user
            </NavLink>

            <NavLink className={navLinkClass} to="/admin/orders">
              Quản lý đơn hàng
            </NavLink>

            <NavLink className={navLinkClass} to="/admin/revenue">
              Doanh thu
            </NavLink>

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
            <NavLink className={navLinkClass} to="/login">
              Đăng nhập
            </NavLink>
            <NavLink className={navLinkClass} to="/register">
              Đăng ký
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
