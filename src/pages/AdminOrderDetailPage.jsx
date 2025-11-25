import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetailAdmin } from '../api/orders';

export default function AdminOrderDetailPage({ user }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="page-shell">
        <div className="card">
          <p>Bạn không có quyền truy cập trang này</p>
        </div>
      </div>
    );
  }

  const fetchOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrderDetailAdmin(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || 'Không tải được thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !order) {
    return (
      <div className="page-shell">
        <div className="card">
          {loading ? (
            <p>Đang tải...</p>
          ) : (
            <p>{error || 'Không tìm thấy đơn hàng.'}</p>
          )}
        </div>
      </div>
    );
  }

  const totalAmount = Number(order.totalAmount);
  const createdAtText = order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : '';

  return (
    <div className="page-shell">
      <div className="card">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Admin · Đơn hàng</p>
            <h2 className="page-title">
              Chi tiết đơn hàng {order.code}{' '}
              <span style={{ fontSize: 14, color: '#6b7280' }}>
                (ID: {order.id})
              </span>
            </h2>
            <p className="page-description">
              Xem thông tin người dùng, địa chỉ nhận hàng và danh sách sản phẩm
              trong đơn.
            </p>
          </div>

          <Link to="/admin/orders">
            <button className="btn btn-secondary">← Quay lại danh sách</button>
          </Link>
        </div>

        {error && <div className="alert alert-error mt-12">{error}</div>}

        {/* Thông tin tóm tắt */}
        <div className="order-summary-grid mt-12">
          <div className="order-summary-card">
            <h3>Thông tin người dùng</h3>
            <p>
              ID user: <b>{order.user?.id}</b>
            </p>
            <p>
              Email: <b>{order.user?.email}</b>
            </p>
          </div>

          <div className="order-summary-card">
            <h3>Người nhận</h3>
            <p>
              Tên: <b>{order.shippingName}</b>
            </p>
            <p>
              SĐT: <b>{order.shippingPhone}</b>
            </p>
            <p>
              Địa chỉ: <b>{order.shippingAddress}</b>
            </p>
          </div>

          <div className="order-summary-card">
            <h3>Thông tin đơn hàng</h3>
            <p>
              Trạng thái:{' '}
              <span
                className={`badge-status badge-status--${order.status}`}
              >
                {order.status}
              </span>
            </p>
            <p style={{ marginTop: 4 }}>
              Tổng tiền: <b>{totalAmount.toLocaleString()} đ</b>
            </p>
            <p style={{ marginTop: 4 }}>
              Ngày tạo: <b>{createdAtText}</b>
            </p>
          </div>
        </div>

        {/* Danh sách sản phẩm trong đơn */}
        <h3 className="mt-24" style={{ fontWeight: 600 }}>
          Sản phẩm trong đơn
        </h3>

        {(!order.items || order.items.length === 0) && (
          <p className="mt-8">Đơn hàng này không có sản phẩm nào.</p>
        )}

        {order.items && order.items.length > 0 && (
          <table className="table mt-8">
            <thead>
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {item.productName}
                      </div>
                      {item.product && (
                        <div
                          style={{ fontSize: 12, color: '#6b7280' }}
                        >
                          (ID sản phẩm: {item.product.id})
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{Number(item.unitPrice).toLocaleString()} đ</td>
                  <td>{item.quantity}</td>
                  <td>{Number(item.totalPrice).toLocaleString()} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
