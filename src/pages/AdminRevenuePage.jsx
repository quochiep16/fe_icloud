// src/pages/AdminRevenuePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../api/orders';

const PERIOD_OPTIONS = [
  { value: 'day', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'year', label: 'Năm nay' },
];

// Tính khoảng thời gian theo ngày / tuần / tháng / năm hiện tại
function getDateRange(period) {
  const now = new Date();
  const to = now;

  let from;
  if (period === 'day') {
    // Hôm nay: từ 00:00 đến hiện tại
    from = new Date(now);
    from.setHours(0, 0, 0, 0);
  } else if (period === 'week') {
    // Tuần này (tính từ Thứ 2)
    const d = new Date(now);
    const day = d.getDay(); // 0: CN, 1: T2, ...
    const diff = day === 0 ? -6 : 1 - day; // về Thứ 2
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + diff);
    from = d;
  } else if (period === 'month') {
    // Đầu tháng
    from = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'year') {
    // Đầu năm
    from = new Date(now.getFullYear(), 0, 1);
  } else {
    // fallback: tất cả
    from = new Date(0);
  }

  return { from, to };
}

export default function AdminRevenuePage({ user }) {
  const [allOrders, setAllOrders] = useState([]);
  const [period, setPeriod] = useState('day'); // mặc định: hôm nay
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  if (!user || user.role !== 'ADMIN') {
    return <p>Không có quyền truy cập trang này</p>;
  }

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const data = await getAllOrders();
      setAllOrders(data);
      setMsg('Đã tải danh sách đơn hàng.');
    } catch (err) {
      console.error(err);
      setError('Không tải được danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lọc và tính toán theo period
  const { from, to } = getDateRange(period);

  const filteredOrders = allOrders.filter((o) => {
    if (!o.createdAt) return false;
    const created = new Date(o.createdAt);
    if (Number.isNaN(created.getTime())) return false;
    return created >= from && created <= to;
  });

  // Sắp xếp đơn mới nhất lên đầu
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  let totalOrders = sortedOrders.length;
  let totalProductsSold = 0;
  let totalRevenue = 0;

  sortedOrders.forEach((o) => {
    totalRevenue += Number(o.totalAmount || 0);

    if (Array.isArray(o.items)) {
      o.items.forEach((item) => {
        totalProductsSold += Number(item.quantity || 0);
      });
    }
  });

  const fromText = from.toLocaleDateString('vi-VN');
  const toText = to.toLocaleDateString('vi-VN');

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <h2 className="page-title">Thống kê doanh thu</h2>
        <button
          className="btn btn-secondary"
          onClick={fetchOrders}
          disabled={loading}
        >
          Làm mới
        </button>
      </div>

      <p style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>
        Xem tổng số đơn hàng, tổng số sản phẩm đã bán và doanh thu theo ngày / tuần / tháng / năm.
      </p>

      {msg && <div className="alert alert-success mt-8">{msg}</div>}
      {error && <div className="alert alert-error mt-8">{error}</div>}

      {/* Chọn khoảng thời gian */}
      <div className="flex gap-8 mt-12" style={{ flexWrap: 'wrap' }}>
        <div className="form-group">
          <label className="form-label">Khoảng thời gian</label>
          <select
            className="input"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            Từ <b>{fromText}</b> đến <b>{toText}</b>
          </div>
        </div>
      </div>

      {/* 3 ô tổng quan */}
      <div
        className="flex gap-8 mt-12"
        style={{ flexWrap: 'wrap', alignItems: 'stretch' }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 220,
            padding: 16,
            borderRadius: 12,
            backgroundColor: '#111827',
            color: 'white',
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.7 }}>Tổng số đơn hàng</div>
          <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6 }}>
            {totalOrders}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 220,
            padding: 16,
            borderRadius: 12,
            backgroundColor: '#1f2937',
            color: 'white',
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            Tổng số sản phẩm đã bán
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6 }}>
            {totalProductsSold}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 220,
            padding: 16,
            borderRadius: 12,
            backgroundColor: '#374151',
            color: 'white',
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.7 }}>Tổng doanh thu (ước tính)</div>
          <div style={{ fontSize: 26, fontWeight: 600, marginTop: 6 }}>
            {totalRevenue.toLocaleString()} đ
          </div>
        </div>
      </div>

      {/* Bảng danh sách đơn */}
      <h3 style={{ fontWeight: 600, marginTop: 24 }}>
        Đơn hàng trong khoảng thời gian đã chọn
      </h3>

      {loading ? (
        <p className="mt-8">Đang tải...</p>
      ) : (
        <table className="table mt-8">
          <thead>
            <tr>
              <th>#</th>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Số sản phẩm</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((o, index) => {
              const itemCount = Array.isArray(o.items)
                ? o.items.reduce(
                    (sum, item) => sum + Number(item.quantity || 0),
                    0,
                  )
                : 0;

              return (
                <tr key={o.id}>
                  <td>{index + 1}</td>
                  <td>{o.code}</td>
                  <td>
                    <div style={{ fontSize: 14 }}>
                      {o.user?.email || 'N/A'}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {o.shippingName}
                    </div>
                  </td>
                  <td>{Number(o.totalAmount).toLocaleString()} đ</td>
                  <td>{itemCount}</td>
                  <td>{o.status}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    <Link to={`/admin/orders/${o.id}`}>
                      <button className="btn btn-secondary">
                        Xem chi tiết
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}

            {sortedOrders.length === 0 && !loading && (
              <tr>
                <td colSpan={8}>
                  Không có đơn hàng nào trong khoảng thời gian này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
