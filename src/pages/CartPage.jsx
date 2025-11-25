import { useEffect, useState } from 'react';
import { getCart, updateCartItem, deleteCartItem } from '../api/cart';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error(err);
      setMsg('Không tải được giỏ hàng');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, { quantity });
      setMsg('');
      fetchCart();
    } catch (err) {
      console.error(err);
      const backendMessage = err?.response?.data?.message;
      setMsg(backendMessage || 'Cập nhật số lượng thất bại');
      fetchCart();
    }
  };

  const handleSelectedChange = async (itemId, selected) => {
    try {
      await updateCartItem(itemId, { selected });
      setMsg('');
      fetchCart();
    } catch (err) {
      console.error(err);
      const backendMessage = err?.response?.data?.message;
      setMsg(backendMessage || 'Cập nhật chọn thanh toán thất bại');
      fetchCart();
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteCartItem(itemId);
      setMsg('');
      fetchCart();
    } catch (err) {
      console.error(err);
      const backendMessage = err?.response?.data?.message;
      setMsg(backendMessage || 'Xoá thất bại');
    }
  };

  if (!cart) {
    return (
      <div className="page-shell">
        <div className="card">
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="card">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Cửa hàng</p>
            <h2 className="page-title">Giỏ hàng</h2>
            <p className="page-description">
              Quản lý các sản phẩm bạn đã thêm vào giỏ, điều chỉnh số lượng và
              chọn sản phẩm để thanh toán.
            </p>
          </div>
        </div>

        {msg && <div className="alert alert-error mt-8">{msg}</div>}

        {cart.items.length === 0 ? (
          <p className="mt-12">Giỏ hàng trống</p>
        ) : (
          <>
            <table className="table mt-8">
              <thead>
                <tr>
                  <th>Chọn</th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) =>
                          handleSelectedChange(item.id, e.target.checked)
                        }
                      />
                    </td>
                    <td>{item.product.name}</td>
                    <td>{Number(item.product.price).toLocaleString()} đ</td>
                    <td>
                      <input
                        className="input"
                        style={{ width: 70 }}
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            Number(e.target.value),
                          )
                        }
                      />
                    </td>
                    <td>
                      {(
                        item.quantity * Number(item.product.price)
                      ).toLocaleString()}{' '}
                      đ
                    </td>
                    <td>
                      <button
                        className="btn btn-error"
                        onClick={() => handleDelete(item.id)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary mt-16">
              <div className="cart-summary-line">
                <span>Tổng sản phẩm:</span>
                <b>{cart.totalItems}</b>
              </div>
              <div className="cart-summary-line">
                <span>Tổng tiền:</span>
                <b>{Number(cart.totalPrice).toLocaleString()} đ</b>
              </div>
              <div className="cart-summary-line">
                <span>Tiền các sản phẩm đã chọn:</span>
                <b>{Number(cart.selectedTotalPrice).toLocaleString()} đ</b>
              </div>

              <Link to="/checkout">
                <button className="btn btn-primary mt-12">
                  Tiếp tục thanh toán
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
