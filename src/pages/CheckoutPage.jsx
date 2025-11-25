import { useState } from 'react';
import { checkout } from '../api/orders';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
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
      const order = await checkout({ shippingName, shippingPhone, shippingAddress });
      setMsg(`Tạo đơn hàng thành công: ${order.code}`);
      setTimeout(() => navigate('/orders/me'), 1200);
    } catch (err) {
      console.error(err);

      const res = err?.response;
      const data = res?.data;
      let message = 'Thanh toán thất bại. Vui lòng thử lại sau.';

      // Ưu tiên đọc message từ backend
      if (data?.message) {
        if (Array.isArray(data.message)) {
          // class-validator hay trả về mảng message
          message = data.message.join('\n');
        } else if (typeof data.message === 'string') {
          message = data.message;
        }
      } else if (typeof data === 'string') {
        // phòng trường hợp BE trả body là string thuần
        message = data;
      }

      // Một số case đặc biệt
      if (res?.status === 401) {
        message = 'Bạn cần đăng nhập lại trước khi thanh toán.';
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="card">
        <h2 className="page-title">Thanh toán</h2>

        <p style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>
          Các sản phẩm bạn đã <b>chọn</b> trong giỏ hàng sẽ được tạo thành một đơn hàng mới.
        </p>

        {msg && <div className="alert alert-success mt-12">{msg}</div>}
        {error && (
          <div
            className="alert alert-error mt-12"
            style={{ whiteSpace: 'pre-line' }} // để \n xuống dòng đẹp
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-16">
          <div className="form-group">
            <label className="form-label">Tên người nhận</label>
            <input
              className="input"
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
              placeholder="Nhập tên người nhận..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input
              className="input"
              value={shippingPhone}
              onChange={(e) => setShippingPhone(e.target.value)}
              placeholder="Ví dụ: 0901234567"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Địa chỉ giao hàng</label>
            <textarea
              className="textarea"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-12"
            disabled={loading}
          >
            {loading ? 'Đang tạo đơn hàng...' : 'Tạo đơn hàng'}
          </button>
        </form>
      </div>
    </div>
  );
}
