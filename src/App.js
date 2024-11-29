// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Link for navigation
import './App.css';
import Auth from './Auth';
import Dashboard from './Dashboard';
import Home from './Home';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import StockManagement from './StockManagement';
import ProductList from './ProductList';
import UserList from './UserList';
import StockList from './StockList';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="container">
                <header>
                    <h1>Welcome to WINGS CAFE System!</h1>
                    {isAuthenticated && (
                        <nav>
                            <ul className='nav-list'>
                                <li><Link to="/home">Home Page</Link></li>
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/product-management">Manage Products</Link></li>
                                <li><Link to="/user-management">Manage Users</Link></li>
                                <li><Link to="/stock-management">Manage Stock</Link></li>
                                
                            </ul>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </nav>
                    )}
                </header>
                
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Home /> : <Auth onLogin={handleLogin} />} />
                    <Route path="/home" element={isAuthenticated ? <Home /> : <Auth onLogin={handleLogin} />} />
                    <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Auth onLogin={handleLogin} />} />
                    <Route path="/product-management" element={isAuthenticated ? <ProductManagement /> : <Auth onLogin={handleLogin} />} />
                    <Route path="/user-management" element={isAuthenticated ? <UserManagement /> : <Auth onLogin={handleLogin} />} />
                    <Route path="/stock-management" element={isAuthenticated ? <StockManagement /> : <Auth onLogin={handleLogin} />} />
                    <Route path="/product-list" element={isAuthenticated ? <ProductList /> : <Auth onLogin={handleLogin} />} />
                    <Route path="/user-list" element={isAuthenticated ? <UserList /> : <Auth onLogin={handleLogin} />} />
                    <Route path="/stock-list" element={isAuthenticated ? <StockList /> : <Auth onLogin={handleLogin} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;