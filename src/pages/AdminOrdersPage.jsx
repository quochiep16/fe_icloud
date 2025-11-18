import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../api/orders';

const STATUS_OPTIONS = ['PENDING', 'PAID', 'COMPLETED', 'CANCELLED'];

export default function AdminOrdersPage({ user }) {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  if (!user || user.role !== 'ADMIN') {
    return <p>Không có quyền truy cập trang này</p>;
  }

  const fetchOrders = async () => {
    setLoading(true);
    setMsg('');
    setError('');
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Không tải được danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChangeStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setMsg('');
    setError('');
    try {
      await updateOrderStatus(orderId, newStatus);
      setMsg(`Cập nhật trạng thái đơn ${orderId} thành ${newStatus} thành công`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setError('Cập nhật trạng thái thất bại');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="card">
      <h2 className="page-title">Quản lý đơn hàng (Admin)</h2>
      <p style={{ fontSize: 14, color: '#4b5563' }}>
        Xem tất cả đơn hàng và thay đổi trạng thái (PENDING, PAID, COMPLETED, CANCELLED).
      </p>

      {msg && <div className="alert alert-success mt-12">{msg}</div>}
      {error && <div className="alert alert-error mt-12">{error}</div>}
      {loading && <p className="mt-12">Đang tải...</p>}

      {!loading && (
        <table className="table mt-12">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Người dùng</th>
              <th>Người nhận</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.code}</td>
                <td>
                  {o.user?.email || 'N/A'}
                  <br />
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    ID: {o.user?.id}
                  </span>
                </td>
                <td>
                  {o.shippingName}
                  <br />
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {o.shippingPhone}
                  </span>
                </td>
                <td>{Number(o.totalAmount).toLocaleString()} đ</td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className={`badge-status badge-status--${o.status}`}>
                      {o.status}
                    </span>
                    <select
                      value={o.status}
                      onChange={(e) =>
                        handleChangeStatus(o.id, e.target.value)
                      }
                      disabled={updatingId === o.id}
                      className="input"
                      style={{ padding: '4px 8px', fontSize: 12 }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <Link to={`/admin/orders/${o.id}`}>
                    <button className="btn btn-secondary">
                      Xem chi tiết
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan={7}>Chưa có đơn hàng nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
