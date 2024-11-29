import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        position: '',
        idNumber: '',
        phoneNumber: ''
    });
    const [errors, setErrors] = useState({}); // Track errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' })); // Clear error message
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (isSignUp) {
            if (!formData.position) newErrors.position = "Name is required";
            if (!formData.idNumber) newErrors.idNumber = "ID Number is required";
            if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (isSignUp) {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.find(user => user.idNumber === formData.idNumber)) {
                alert('User with this ID number already exists.');
                return;
            }
            users.push(formData);
            localStorage.setItem("users", JSON.stringify(users));
            alert('Account created successfully');
            setIsSignUp(false);
        } else {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(u => u.username === formData.username && u.password === formData.password);
            if (user) {
                onLogin();
            } else {
                alert('Invalid username or password');
            }
        }
    };

    return (
        <section>
            <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange} className={errors.username ? 'error' : ''} />
                <span className="error-message">{errors.username}</span>
                <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className={errors.password ? 'error' : ''} />
                <span className="error-message">{errors.password}</span>
                {isSignUp && (
                    <>
                        <input type="text" name="position" placeholder="Position" required value={formData.name} onChange={handleChange} className={errors.position ? 'error' : ''} />
                        <span className="error-message">{errors.name}</span>
                        <input type="text" name="idNumber" placeholder="ID Number" required value={formData.idNumber} onChange={handleChange} className={errors.idNumber ? 'error' : ''} />
                        <span className="error-message">{errors.idNumber}</span>
                        <input type="text" name="phoneNumber" placeholder="Phone Number" required value={formData.phoneNumber} onChange={handleChange} className={errors.phoneNumber ? 'error' : ''} />
                        <span className="error-message">{errors.phoneNumber}</span>
                    </>
                )}
                <button type="submit">{isSignUp ? "Create Account" : "Login"}</button>
                <p>
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <button type="button" onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? "Login" : "Sign Up"}</button>
                </p>
            </form>
        </section>
    );
};

export default Auth;