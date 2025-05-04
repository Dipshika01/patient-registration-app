import React, { useState } from 'react';
import PatientRegistration from './components/PatientRegistration';
import SQLQuery from './components/SQLQuery';
import PatientList from './components/PatientList';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('registration');
  const [navOpen, setNavOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'registration': return <PatientRegistration />;
      case 'list': return <PatientList />;
      case 'sql': return <SQLQuery />;
      default: return <PatientRegistration />;
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h3>Patient Portal</h3>
        <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)}>
          ☰
        </button>
        <nav className={`nav-links ${navOpen ? 'open' : ''}`}>
          <button
            className={currentPage === 'registration' ? 'active' : ''}
            onClick={() => { setCurrentPage('registration'); setNavOpen(false); }}
          >
            Register
          </button>
          <button
            className={currentPage === 'list' ? 'active' : ''}
            onClick={() => { setCurrentPage('list'); setNavOpen(false); }}
          >
            Patient List
          </button>
          <button
            className={currentPage === 'sql' ? 'active' : ''}
            onClick={() => { setCurrentPage('sql'); setNavOpen(false); }}
          >
            SQL Query
          </button>
        </nav>
      </header>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
