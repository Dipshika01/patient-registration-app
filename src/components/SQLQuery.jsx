import React, { useState, useEffect } from 'react';
import databaseService from '../services/database';
import './SQLQuery.css';

const SQLQuery = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize the database
    const setupDatabase = async () => {
      try {
        await databaseService.initialize();
        // Initial load of patients
        const patients = await databaseService.getPatients();
        setResults(patients);
      } catch (err) {
        console.error('Error initializing database:', err);
        setError('Error initializing database: ' + err.message);
      }
    };

    setupDatabase();

    // Listen for patient registration events
    const handlePatientRegistered = async () => {
      console.log('Patient registered event received, refreshing list...');
      try {
        const patients = await databaseService.getPatients();
        setResults(patients);
      } catch (err) {
        console.error('Error refreshing patient list:', err);
        setError('Error refreshing patient list: ' + err.message);
      }
    };

    window.addEventListener('patientRegistered', handlePatientRegistered);

    return () => {
      window.removeEventListener('patientRegistered', handlePatientRegistered);
    };
  }, []);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Basic SQL injection prevention
      if (query.toLowerCase().includes('drop') || 
          query.toLowerCase().includes('delete') || 
          query.toLowerCase().includes('update') ||
          query.toLowerCase().includes('alter')) {
        throw new Error('Invalid query');
      }

      const result = await databaseService.executeQuery(query);
      setResults(result);
    } catch (err) {
      console.error('Error executing query:', err);
      setError('Error executing query: ' + err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sql-query-container">
      <h2>SQL Query Interface</h2>
      <div className="query-info">
        <p>Available tables: patients</p>
        <p>Example queries:</p>
        <ul>
          <li>SELECT * FROM patients</li>
          <li>SELECT * FROM patients WHERE gender = 'Male'</li>
          <li>SELECT first_name, last_name FROM patients</li>
        </ul>
      </div>
      <form onSubmit={handleQuerySubmit}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here"
          rows={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Executing...' : 'Execute Query'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {results.length > 0 && (
        <div className="results-container">
          <h3>Results:</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SQLQuery; 