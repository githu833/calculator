import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calculator from './components/Calculator';
import History from './components/History';

const API_BASE_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:5000/api'
  : '/api';


function App() {
  const [formData, setFormData] = useState({
    principal: '',
    rate: '',
    time: '',
    interestType: 'simple'
  });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      setHistory(response.data);
      setError(''); // Clear error if fetch succeeds
    } catch (err) {
      console.error('Error fetching history:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Network Error: Cannot connect to the server. Please ensure the backend is running.');
      } else {
        setError('Failed to sync portfolio history.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    const { principal, rate, time } = formData;

    if (!principal || !rate || !time) {
      setError('Required metrics missing');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/calculate`, formData);
      setResult(response.data);
      setError(''); // Success - clear any old errors
      fetchHistory();
    } catch (err) {
      let msg = 'Protocol Failure: Analysis could not be completed.';
      if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err.code === 'ERR_NETWORK') {
        msg = 'Connection Offline: Please verify backend status.';
      }
      setError(msg);
    }
  };

  const handleReset = () => {
    setFormData({
      principal: '',
      rate: '',
      time: '',
      interestType: 'simple'
    });
    setResult(null);
    setError('');
  };

  return (
    <>
      <div className="bg-visuals">
        <div className="blob"></div>
        <div className="blob blob-2"></div>
      </div>
      <div className="container">
        <Calculator
          formData={formData}
          handleChange={handleChange}
          handleCalculate={handleCalculate}
          handleReset={handleReset}
          result={result}
          error={error}
          onToggleHistory={() => setShowHistory(!showHistory)}
        />
        {showHistory && (
          <div className="history-modal-overlay" onClick={() => setShowHistory(false)}>
            <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowHistory(false)}>×</button>
              <History history={history} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
