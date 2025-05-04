import { useState } from 'react';
import { PGlite } from '@electric-sql/pglite';

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
  });

  const db = new PGlite();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          date_of_birth DATE NOT NULL,
          gender TEXT NOT NULL,
          address TEXT,
          phone TEXT,
          email TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await db.query(
        `INSERT INTO patients (first_name, last_name, date_of_birth, gender, address, phone, email)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          formData.firstName,
          formData.lastName,
          formData.dateOfBirth,
          formData.gender,
          formData.address,
          formData.phone,
          formData.email,
        ]
      );

      alert('Patient registered successfully!');
      // Reset form after successful registration
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
      });
    } catch (error) {
      console.error('Error registering patient:', error);
      alert('Error registering patient. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Patient Registration</h2>
      <input
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <input
        name="dateOfBirth"
        type="date"
        placeholder="Date of Birth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />
      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">Register Patient</button>
    </form>
  );
} 