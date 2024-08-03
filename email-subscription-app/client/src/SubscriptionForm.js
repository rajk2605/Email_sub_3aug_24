
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function SubscriptionForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateName = (name) => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return 'Name should only contain letters and spaces';
    }
    return null;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Invalid email address';
    }
    return null;
  };

  const handleSubscribe = async () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    if (nameError || emailError) {
      setErrors({ name: nameError, email: emailError });
      return;
    }
    setErrors({});
    try {
      const response = await axios.post('http://localhost:5000/subscribe', { name, email });
      setSuccessMessage(response.data.message);
      setName('');
      setEmail('');
    } catch (error) {
      alert('Error subscribing');
    }
  };

  const handleUnsubscribe = async () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    if (nameError || emailError) {
      setErrors({ name: nameError, email: emailError });
      return;
    }
    setErrors({});
    try {
      const response = await axios.post('http://localhost:5000/unsubscribe', { email });
      setSuccessMessage(response.data.message);
      setName('');
      setEmail('');
    } catch (error) {
      alert('Error unsubscribing');
    }
  };

  return (
    <div className="form-container">
      <h2>Email Subscription</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
	required
      />
      {errors.name && <p className="error">{errors.name}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
	required
      />
      {errors.email && <p className="error">{errors.email}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <button onClick={handleSubscribe}>Subscribe</button>
      <button onClick={handleUnsubscribe}>Unsubscribe</button>
    </div>
  );
}

export default SubscriptionForm;
