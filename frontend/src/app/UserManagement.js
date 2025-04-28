import React, { useEffect, useState } from 'react';
import '../style/UserManagement.css';
import UserForm from './UserForm'; // Import the form component
import api from './auth/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/users/');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };


    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const handleAddNew = () => {
        setSelectedUser(null); // Clear selected user for a new entry
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/users/${id}/`);
            fetchUsers(); // Refresh users after deletion
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    return (
        <div className="user-management-container">
            <div className="header">
                <h2>User Management</h2>
                <button className="btn-add-new" onClick={handleAddNew}>
                    + Add New User
                </button>
            </div>

            <input
                type="text"
                placeholder="Filter by username..."
                value={filter}
                onChange={handleFilterChange}
                className="filter-input"
            />

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="user-cards">
                    {users.map((user) => (
                        <div key={user.id} className="user-card">
                            <h3>{user.username}</h3>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                            <div className="button-container">
                                <button
                                    className="btn-edit"
                                    onClick={() => handleEdit(user)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <UserForm
                            user={selectedUser}
                            onClose={() => setModalVisible(false)}
                            onSave={() => {
                                fetchUsers(); // Refresh users after save
                                setModalVisible(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

