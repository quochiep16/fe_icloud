import { useEffect, useState } from 'react';
import { getMyOrders } from '../api/orders';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setMsg('Không tải được danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="card">
      <h2 className="page-title">Đơn hàng của tôi</h2>
      <p style={{ fontSize: 14, color: '#4b5563' }}>
        Đây là lịch sử các đơn hàng bạn đã tạo từ giỏ hàng.
      </p>

      {msg && <div className="alert alert-error mt-12">{msg}</div>}
      {loading && <p className="mt-12">Đang tải...</p>}

      {!loading && orders.length === 0 && (
        <p className="mt-12">Bạn chưa có đơn hàng nào.</p>
      )}

      {!loading && orders.length > 0 && (
        <table className="table mt-12">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Người nhận</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.code}</td>
                <td>
                  <span className={`badge-status badge-status--${o.status}`}>
                    {o.status}
                  </span>
                </td>
                <td>{Number(o.totalAmount).toLocaleString()} đ</td>
                <td>
                  {o.shippingName}
                  <br />
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {o.shippingPhone}
                  </span>
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
