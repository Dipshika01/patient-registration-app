import { useState } from 'react';
import PatientRegistration from './components/PatientRegistration';
import SQLQuery from './components/SQLQuery';
import PatientList from './components/PatientList';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('registration');

  const renderPage = () => {
    switch (currentPage) {
      case 'registration':
        return <PatientRegistration />;
      case 'sql':
        return <SQLQuery />;
      case 'list':
        return <PatientList />;
      default:
        return <PatientRegistration />;
    }
  };

  return (
    <div className="container">
      <nav className="navigation">
        <button 
          className={currentPage === 'registration' ? 'active' : ''}
          onClick={() => setCurrentPage('registration')}
        >
          Patient Registration
        </button>
        <button 
          className={currentPage === 'list' ? 'active' : ''}
          onClick={() => setCurrentPage('list')}
        >
          Patient List
        </button>
        <button 
          className={currentPage === 'sql' ? 'active' : ''}
          onClick={() => setCurrentPage('sql')}
        >
          SQL Query
        </button>
      </nav>
      
      {renderPage()}
    </div>
  );
}

export default App;
