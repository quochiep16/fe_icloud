import { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../api/users';

export default function AdminUsersPage({ user }) {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="page-shell">
        <div className="card">
          <p>Bạn không có quyền truy cập trang này</p>
        </div>
      </div>
    );
  }

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setMsg('Không tải được danh sách user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (u) => {
    try {
      const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
      await updateUser(u.id, { role: newRole });
      setMsg(`Đổi role của ${u.email} thành ${newRole} thành công`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMsg('Đổi role thất bại');
    }
  };

  const handleDelete = async (u) => {
    if (u.id === user.id) {
      setMsg('Không thể xoá chính bạn');
      return;
    }
    if (!window.confirm(`Bạn chắc chắn muốn xoá user ${u.email}?`)) return;
    try {
      await deleteUser(u.id);
      setMsg(`Đã xoá user ${u.email}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setMsg('Xoá user thất bại');
    }
  };

  return (
    <div className="page-shell">
      <div className="card">
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Admin · User</p>
            <h2 className="page-title">Quản lý user</h2>
            <p className="page-description">
              Xem danh sách tài khoản, đổi quyền ADMIN/USER hoặc xoá user.
            </p>
          </div>
        </div>

        {msg && <div className="alert alert-success mt-8">{msg}</div>}

        <table className="table mt-8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Role</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className="table-badge-role">{u.role}</span>
                </td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    style={{ marginRight: 8 }}
                    onClick={() => handleToggleRole(u)}
                  >
                    Đổi role
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={() => handleDelete(u)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6}>Không có user nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
