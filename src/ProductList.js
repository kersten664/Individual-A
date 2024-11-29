import React, { useState, useEffect } from 'react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: ''
    });

    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(storedProducts);
    }, []);

    const handleEditClick = (product) => {
        setEditingProduct(product.id);
        setFormData({ ...product }); // Pre-fill the form
    };

    const handleDelete = (id) => {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        alert('Product deleted successfully');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const updatedProducts = products.map(product => 
            product.id === formData.id ? formData : product
        );
        setProducts(updatedProducts);
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        alert('Product updated successfully');
        setEditingProduct(null); // Exit edit mode
        setFormData({ id: '', name: '', description: '', category: '', price: '', quantity: '' }); // Reset form
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setFormData({ id: '', name: '', description: '', category: '', price: '', quantity: '' });
    };

    return (
        <section>
            <h2>List of Products</h2>
            {editingProduct ? (
                <form onSubmit={handleEditSubmit}>
                    <h3>Edit Product</h3>
                    <input type="hidden" name="id" value={formData.id} />
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
                    <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
                    <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
                    <button type="submit">Update Product</button>
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                </form>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <button onClick={() => handleEditClick(product)}>Edit</button>
                                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
};

export default ProductList;