import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetailAdmin } from '../api/orders';

export default function AdminOrderDetailPage({ user }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'ADMIN') {
    return <p>Không có quyền truy cập trang này</p>;
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
      <div className="card">
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <p>{error || 'Không tìm thấy đơn hàng.'}</p>
        )}
      </div>
    );
  }

  const totalAmount = Number(order.totalAmount);
  const createdAtText = order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : '';

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <h2 className="page-title">
          Chi tiết đơn hàng {order.code}{' '}
          <span style={{ fontSize: 14, color: '#6b7280' }}>
            (ID: {order.id})
          </span>
        </h2>
        <Link to="/admin/orders">
          <button className="btn btn-secondary">← Quay lại danh sách</button>
        </Link>
      </div>

      {error && <div className="alert alert-error mt-12">{error}</div>}

      {/* Thông tin chung */}
      <div className="flex gap-12 mt-12" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Thông tin người dùng</h3>
          <p style={{ fontSize: 14 }}>
            ID user: <b>{order.user?.id}</b>
          </p>
          <p style={{ fontSize: 14 }}>
            Email: <b>{order.user?.email}</b>
          </p>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Thông tin người nhận</h3>
          <p style={{ fontSize: 14 }}>
            Tên: <b>{order.shippingName}</b>
          </p>
          <p style={{ fontSize: 14 }}>
            SĐT: <b>{order.shippingPhone}</b>
          </p>
          <p style={{ fontSize: 14 }}>
            Địa chỉ: <b>{order.shippingAddress}</b>
          </p>
        </div>

        <div style={{ flex: 1, minWidth: 260 }}>
          <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Thông tin đơn hàng</h3>
          <p style={{ fontSize: 14 }}>
            Trạng thái:{' '}
            <span className={`badge-status badge-status--${order.status}`}>
              {order.status}
            </span>
          </p>
          <p style={{ fontSize: 14, marginTop: 4 }}>
            Tổng tiền:{' '}
            <b>{totalAmount.toLocaleString()} đ</b>
          </p>
          <p style={{ fontSize: 14, marginTop: 4 }}>
            Ngày tạo: <b>{createdAtText}</b>
          </p>
        </div>
      </div>

      {/* Danh sách sản phẩm trong đơn */}
      <h3 style={{ fontWeight: 600, marginTop: 24 }}>Sản phẩm trong đơn</h3>

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
                    <div style={{ fontWeight: 500 }}>{item.productName}</div>
                    {item.product && (
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
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
  );
}
