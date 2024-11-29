import React, { useState, useEffect } from 'react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', idNumber: '', phoneNumber: '', position: '' });

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(storedUsers);
    }, []);

    const handleDelete = (idNumber) => {
        const updatedUsers = users.filter(u => u.idNumber !== idNumber);
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        alert('User deleted successfully');
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ 
            name: user.name, 
            idNumber: user.idNumber, 
            phoneNumber: user.phoneNumber, 
            position: user.position 
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUsers = users.map(user => 
            user.idNumber === editingUser.idNumber ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setEditingUser(null); // Close the edit form
        alert('User updated successfully');
    };

    const handleCancelEdit = () => {
        setEditingUser(null); // Cancel editing
    };

    return (
        <section>
            <h2>List of Users</h2>
            {editingUser ? (
                <form onSubmit={handleSubmit}>
                    <h3>Edit User</h3>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                    <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="ID Number" required disabled />
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
                    <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" required />
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                </form>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID Number</th>
                            <th>Phone Number</th>
                            <th>Position</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.idNumber}>
                                <td>{user.name}</td>
                                <td>{user.idNumber}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.position}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Edit</button>
                                    <button onClick={() => handleDelete(user.idNumber)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default UserList;