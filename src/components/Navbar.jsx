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

  const handleBrandClick = () => {
    navigate('/products');
  };

  const brandInitial = 'M';
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <button
            type="button"
            className="navbar-logo"
            onClick={handleBrandClick}
          >
            {brandInitial}
          </button>

          <div className="navbar-brand-wrap" onClick={handleBrandClick}>
            <span className="navbar-brand">Mini Shop</span>
            <span className="navbar-subtitle">Mini Ecommerce Dashboard</span>
          </div>

          <nav className="navbar-nav">
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
          </nav>
        </div>

        <div className="navbar-right">
          {user ? (
            <div className="navbar-user">
              <div className="navbar-avatar">{userInitial}</div>
              <div className="navbar-user-text">
                <span className="navbar-user-name">{user.name}</span>
                <span className="badge-role">{user.role}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="navbar-auth-links">
              <NavLink className={navLinkClass} to="/login">
                Đăng nhập
              </NavLink>
              <NavLink className={navLinkClass} to="/register">
                Đăng ký
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
