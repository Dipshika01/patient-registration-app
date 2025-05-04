import React, { useState, useEffect } from 'react';
import databaseService from '../services/database';
import './PatientList.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 10;

  const fetchPatients = async () => {
    try {
      setLoading(true);
      console.log('Fetching patients...');
      const allPatients = await databaseService.getPatients();
      console.log('Fetched patients:', allPatients);
      
      if (Array.isArray(allPatients)) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPatients = allPatients.slice(startIndex, endIndex);
        
        console.log('Setting patients state:', paginatedPatients);
        setPatients(paginatedPatients);
        setTotalPages(Math.ceil(allPatients.length / itemsPerPage));
      } else {
        console.error('Invalid patients data:', allPatients);
        setError('Invalid data received from database');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Error fetching patients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const setupDatabase = async () => {
      try {
        console.log('Setting up database...');
        await databaseService.initialize();
        if (mounted) {
          await fetchPatients();
        }
      } catch (err) {
        console.error('Error initializing database:', err);
        if (mounted) {
          setError('Error initializing database: ' + err.message);
        }
      }
    };

    setupDatabase();

    const handlePatientRegistered = () => {
      console.log('Patient registered event received, refreshing list...');
      if (mounted) {
        fetchPatients();
      }
    };

    window.addEventListener('patientRegistered', handlePatientRegistered);

    return () => {
      mounted = false;
      window.removeEventListener('patientRegistered', handlePatientRegistered);
    };
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="patient-list-container">
      <h2>Patient List</h2>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : patients.length === 0 ? (
        <div className="no-patients">No patients found in the database.</div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.first_name}</td>
                    <td>{patient.last_name}</td>
                    <td>{patient.date_of_birth}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.email}</td>
                    <td>{patient.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientList; 