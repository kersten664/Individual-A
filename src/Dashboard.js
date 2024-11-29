import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Load products from local storage
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

        // Ensure each product has a valid image URL, if missing use a placeholder
        const updatedProducts = storedProducts.map((product) => ({
            ...product,
            imageUrl: product.imageUrl || 'https://via.placeholder.com/150', // Fallback if missing
        }));

        setProducts(updatedProducts);

        // Load transactions from local storage
        const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
        setTransactions(storedTransactions);

        // Handle changes in localStorage (e.g., when a product is added)
        const handleStorageChange = () => {
            const updatedProducts = JSON.parse(localStorage.getItem("products")) || [];
            setProducts(updatedProducts);
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // Calculate the total stock value
    const calculateTotalStockValue = () => {
        return products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0).toFixed(2); // Fixed to two decimal points
    };

    // Data for the chart (quantities of each product)
    const chartData = {
        labels: products.map(product => product.name), // Product names as labels
        datasets: [
            {
                label: 'Product Quantities',
                data: products.map(product => product.quantity), // Product quantities as data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            tooltip: {
                enabled: false, // Disable default tooltip
            },
        },
        onHover: (event, chartElement) => {
            if (chartElement.length > 0) {
                const index = chartElement[0].index;
                setHoveredProduct(products[index]); // Set the hovered product

                // Get the chart's bounding box to calculate mouse position within it
                const chartArea = event.chart.chartArea;
                const mouseX = event.x - chartArea.left;
                const mouseY = event.y - chartArea.top;

                setMousePosition({ x: mouseX, y: mouseY }); // Set the mouse position relative to the chart
            } else {
                setHoveredProduct(null); // Reset when no product is hovered
            }
        },
    };

    return (
        <section>
            <h2>Dashboard</h2>

            {/* Bar Chart to show Product Quantities */}
            <h3>Product Quantity Overview</h3>
            <div style={{ height: '400px', width: '100%' }}>
                <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Total stock value */}
            <h3>Total Stock Value: M{calculateTotalStockValue()}</h3>

            {/* Product Table */}
            <h3>Product Inventory</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Stock Level</th>
                        <th>Sold Stock</th>
                        <th>Sold Products</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>M{product.price.toFixed(2)}</td>
                                <td>{product.quantity < 5 ? "Low Stock" : "Available"}</td>
                                <td>{product.quantity < 20 ? 20 - product.quantity : 0}</td>
                                <td>{product.quantity < 20 ? "Yes" : "No"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6}>No Products Available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Transaction Table */}
            <h3>Transaction History</h3>
            <table>
                <thead>
                    <tr>
                        <th>Stock Name</th>
                        <th>Quantity Changed</th>
                        <th>Action</th>
                        <th>Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.productName}</td>
                                <td>{transaction.quantityChanged}</td>
                                <td>{transaction.action === 'add' ? "Added" : "Deducted"}</td>
                                <td>{transaction.date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4}>No Transactions Available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Show only the hovered product's name and image */}
            {hoveredProduct && (
                <div>
                    <div
                        style={{
                            position: 'absolute',
                            top: mousePosition.y + 10, // Position below the cursor
                            left: mousePosition.x + 10, // Position to the right of the cursor
                            zIndex: 10,
                            pointerEvents: 'none', // Prevent image from blocking mouse events
                            transition: 'top 0.1s, left 0.1s', // Smooth movement animation
                            display: 'inline-block',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                marginBottom: '10px',
                                display: 'block',
                                animation: 'moveTextLeft 0.3s ease', // Move from right to left
                            }}
                        >
                            {hoveredProduct.name}
                        </span>
                        <img
                            src={hoveredProduct.imageUrl} // Corrected to use the actual imageUrl property
                            alt={hoveredProduct.name}
                            style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                transition: 'transform 0.1s ease-in-out', // Optional: smooth scaling effect
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Add CSS for scrolling effect */}
            <style>
                {`
                @keyframes moveTextLeft {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                `}
            </style>
        </section>
    );
};

export default Dashboard;
